import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import GradientContainer from 'components/GradientContainer';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { styles } from 'components/style';
import { createGroup } from '../../api/groups';
import { auth } from '../../firebase/config';

export default function SetGroupScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [addUserName, setAddUserName] = useState('');
  const [userList, setUserList] = useState<string[]>([]);

  const addUserHandler = async () => {
    if (addUserName.trim() === '') return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const searchUsername = addUserName.trim();

      const response = await fetch(
        `https://roomiesapi-34btz44gbq-uc.a.run.app/users/search?username=${searchUsername}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('User not found or server error');
      }

      const data = await response.json();

      if (data && Array.isArray(data.users) && data.users.length > 0) {
        // Filter out usernames already added
        const newUsernames = data.users
          .map((user: any) => user.username)
          .filter((username: string) => !userList.includes(username));

        if (newUsernames.length === 0) {
          alert('User(s) already added.');
          return;
        }

        setUserList([...newUsernames, ...userList]);
        setAddUserName('');
      } else {
        alert('User not found.');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      alert('Failed to fetch user. Please check username.');
    }
  };

  const removeUserHandler = (index: number) => {
    const updatedList = [...userList];
    updatedList.splice(index, 1);
    setUserList(updatedList);
  };

  const createGroupHandler = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }
    if (userList.length === 0) {
      alert('Please add at least one user.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();

      const response = await createGroup(token, groupName.trim(), userList);

      if (response && response.group) {
        alert('Group created successfully!');
        navigation.navigate('Main'); // Change to your main/home screen
      } else {
        alert(response.message || 'Failed to create group.');
      }
    } catch (err: any) {
      console.error('Error creating group:', err);
      alert(err.message || 'Failed to create group.');
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

          <TextInput
            placeholder="Name of Group"
            value={groupName}
            onChangeText={setGroupName}
            autoCapitalize="none"
            style={styles.SetGroup_input}
          />

          <Text style={styles.SetGroup_SearchText}>Add a User</Text>
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
                <Text style={styles.SetGroup_userText}>{user}</Text>
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