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
  
  export default function SetGroupScreen({ navigation }: any) {
    const [groupName, setGroupName] = useState('');
    const [addUserName, setAddUserName] = useState('');
    const [userList, setUserList] = useState<string[]>([]);
  
    const addUserHandler = () => {
      if (addUserName.trim() !== '') {
        setUserList([addUserName.trim(), ...userList]);
        setAddUserName('');
      }
    };

    const removeUserHandler = (index: number) => {
      const updatedList = [...userList];
      updatedList.splice(index, 1);
      setUserList(updatedList);
    };
  
    const createGroupHandler = () => {
      console.log('Group:', groupName, 'Users:', userList);
      // Handle group creation logic here
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
  