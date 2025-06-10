import { View, Text, Button, TextInput, TouchableOpacity,Alert } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/style';
import GradientContainer from 'components/GradientContainer';
import { useNavigation } from '@react-navigation/native';
import {getAuth} from 'firebase/auth';
import { joinGroup } from '../api/groups';
export default function WelcomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [groupId, setGroupId] = useState('');

  const joinInHandler = async () => {
    if (!groupId) {
      Alert.alert('Please enter a Group ID');
      return;
    }

    try {
      const user = getAuth().currentUser;

      if (!user) {
        Alert.alert('You must be logged in');
        return;
      }

      const token = await user.getIdToken(); // Firebase ID token for auth
      const res = await joinGroup(token, groupId);
      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'You joined the group!');
        navigation.navigate('Main'); // Navigate to main screen after joining
      } else {
        Alert.alert('Failed', data.message || 'Could not join group');
      }
    } catch (error) {
      console.error('Join Group Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const createGroupHandler = () => {
    navigation.navigate('SetGroup');
  };

  return (
    <GradientContainer>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome to Roomies</Text>
        {/* <Text style={styles.welcomeUserNameText}>/username</Text> */}
        <Text style={styles.welcomeText}>Track chores. Have fun. Stay happy.</Text>
        <Text style={styles.welcomeJoinText}>Join Group by ID</Text>
        <View style={styles.welcomeInputContainer}>
          <TextInput
            placeholder="Group ID"
            value={groupId}
            onChangeText={setGroupId}
            autoCapitalize="none"
            style={styles.welcomeInput}
            placeholderTextColor="#222"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={joinInHandler}
            style={styles.welcomeJoinInButton}>
            <Text style={styles.welcomeJoinInButtontext}>Join In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>or</Text>

        <TouchableOpacity onPress={createGroupHandler} style={styles.welcomeCreateGroupButton}>
          <Text style={styles.welcomeCreateBtnText}>Create a group</Text>
        </TouchableOpacity>
      </View>
    </GradientContainer>
  );
}
