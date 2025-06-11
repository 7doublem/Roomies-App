import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientContainer from 'components/GradientContainer';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { styles } from 'components/style';
import { createGroup } from '../../api/groups';
import { auth } from '../../firebase/config';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { addUser } from 'api/users';

export default function SetGroupScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [addUserName, setAddUserName] = useState('');
  const [userList, setUserList] = useState<string[]>([]);
  const [groupNameError, setGroupNameError] = useState<string | null>(null);
  const [userNameError, setUserNameError] = useState<string | null>(null);

  const addUserHandler = async () => {
    if (addUserName.trim() === '') return;
    console.log('Searching for:', addUserName);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const searchUsername = addUserName.trim();

      // 1. First log the API response
      console.log('Calling addUser with:', searchUsername);
      const res = await addUser(token, searchUsername);
      console.log('API response:', res);

      // 2. Handle the response properly
      if (!res) {
        throw new Error('User not found or server error');
      }

      // 3. Check if response is an array or single object
      let users = [];
      if (Array.isArray(res)) {
        users = res;
      } else if (typeof res === 'object' && res !== null) {
        // If single user object, convert to array
        users = [res];
      } else {
        throw new Error('Invalid response format');
      }

      console.log('Processed users:', users);

      // 4. Extract usernames (handle both array and single object responses)
      const newUsernames = users
        .map((user) => user.username) // Changed from data.username to user.username
        .filter((username) => username && !userList.includes(username));

      if (newUsernames.length === 0) {
        setUserNameError(users.length > 0 ? 'User(s) already added.' : 'No valid usernames found.');
        return;
      }

      // 5. Update state
      setUserList([...newUsernames, ...userList]);
      setAddUserName('');
      setUserNameError('');
    } catch (err) {
      console.error('Error in addUserHandler:', err);
      setUserNameError(
        err instanceof Error ? err.message : 'Failed to add user. Please try again.'
      );
    }
  };

  const removeUserHandler = (index: number) => {
    const updatedList = [...userList];
    updatedList.splice(index, 1);
    setUserList(updatedList);
  };

  const createGroupHandler = async () => {
    // Input validation
    if (!groupName.trim()) {
      setGroupNameError('Please enter a group name.');
      return;
    }

    if (userList.length === 0) {
      setUserNameError('Please add at least one user.');
      return;
    }

    // Clear previous errors
    setGroupNameError('');
    setUserNameError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      console.log('Creating group with:', {
        name: groupName.trim(),
        members: userList,
      });

      // 1. Create the group
      const response = await createGroup(token, groupName.trim(), userList);
      console.log('Create group response:', response);

      if (!response) {
        throw new Error('No response received from server');
      }

      // 2. Verify the response structure
      // ✅ Directly extract groupId
      const groupId = response.groupId;
      console.log('Extracted groupId:', groupId);

      if (!groupId || typeof groupId !== 'string') {
        console.error('Malformed response:', response);
        throw new Error('Server returned invalid group data');
      }

      // 3. Update user's groupId in Firestore
      console.log('Updating user with groupId:', groupId);
      await updateDoc(doc(db, 'users', user.uid), {
        groupId: groupId,
      });

      // 4. Navigate or show success
      // navigation.navigate('MainTab'); // REMOVE THIS LINE
      // AppNavigator will switch to AppTabs automatically
    } catch (err) {
      console.error('Error creating group:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create group';
      console.error('Error', errorMessage);
    }
  };

  const joinGroupHandler = () => {
    navigation.navigate('Welcome');
  };

  return (
    <GradientContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}>
        <View style={styles.SetGroup_container}>
          <Text style={styles.SetGroup_title}>Create a Group</Text>

          {groupNameError ? (
            <View style={{ marginBottom: 12, alignItems: 'flex-start' }}>
              <Text style={{ color: '#e74c3c', fontSize: 14 }}>{groupNameError}</Text>
            </View>
          ) : null}

          <TextInput
            placeholder="Name of Group"
            value={groupName}
            onChangeText={setGroupName}
            autoCapitalize="none"
            style={styles.SetGroup_input}
          />

          <Text style={styles.SetGroup_SearchText}>Add a User</Text>

          {userNameError ? (
            <Text style={{ color: 'red', marginTop: 8 }}>{userNameError}</Text>
          ) : null}

          <View style={styles.SetGroup_addUserContainer}>
            <TextInput
              placeholder="UserName"
              value={addUserName}
              onChangeText={setAddUserName}
              autoCapitalize="none"
              style={styles.SetGroup_Userinput}
            />
            <TouchableOpacity onPress={addUserHandler} activeOpacity={0.8}>
              <FontAwesome6
                name="circle-plus"
                style={styles.SetGroup_PlusIcon}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.SetGroup_userList}
            contentContainerStyle={{ paddingBottom: 150 }}>
            {userList.map((user, index) => (
              <View key={index} style={styles.SetGroup_userCard}>
                <Text style={styles.SetGroup_userText}>{String(user)}</Text>
                <TouchableOpacity onPress={() => removeUserHandler(index)}>
                  <FontAwesome6 name="circle-minus" size={22} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.SetGroup_buttonWrapper}>
            <TouchableOpacity
              style={styles.SetGroup_createGroupbtn}
              onPress={createGroupHandler}
              activeOpacity={0.8}>
              <Text style={styles.SetGroup_createGroupbtn_text}>Create Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.SetGroup_JoinGroupbtn}
              onPress={joinGroupHandler}
              activeOpacity={0.8}>
              <Text style={styles.SetGroup_JoinGroupbtn_text}>Join Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientContainer>
  );
}
