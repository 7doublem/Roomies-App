import { View, Text, Button, TextInput, TouchableOpacity,Alert } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/style';
import GradientContainer from 'components/GradientContainer';
import { useNavigation } from '@react-navigation/native';
import {getAuth} from 'firebase/auth';
import { joinGroup } from '../api/groups';
export default function WelcomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const joinInHandler = async () => {
    if (!groupCode) {
      setError("Please Add Group Code")
      return;
    }

    try {
      const user = getAuth().currentUser;

      if (!user) {
        setError('You must be logged in');
        return;
      }

      const token = await user.getIdToken(); // Firebase ID token for auth
      const res = await joinGroup(token, groupCode);
      const data = await res.json();

      if (res.ok) {
        console.log('Success', 'You joined the group!');
        navigation.navigate('MainTab'); 
      } else {
       setError(`Failed: ${data?.message || 'Could not join group'}`);
      }
    } catch (error) {
      console.error('Join Group Error:', error);
    setError('Something went wrong'); // Also fixed here
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
        <Text style={styles.welcomeJoinText}>Join Group by Code</Text>

        {error && (
      <View style={{ marginBottom: 12, alignItems: 'center' }}>
      <Text style={{ color: '#e74c3c', fontSize: 14 }}>{error}</Text>
      </View>
      )}
        <View style={styles.welcomeInputContainer}>


          <TextInput
            placeholder="Group Code"
            value={groupCode}
            onChangeText={setGroupCode}
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

        <TouchableOpacity onPress={createGroupHandler}  style={[styles.welcomeCreateGroupButton, { marginVertical: 10 }]} >
          <Text style={styles.welcomeCreateBtnText}>Create a group</Text>
        </TouchableOpacity>
      </View>
    </GradientContainer>
  );
}
