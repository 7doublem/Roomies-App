import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/style';
import GradientContainer from 'components/GradientContainer';
import { useNavigation } from '@react-navigation/native';
export default function WelcomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [groupId, setGroupId] = useState('');

  const joinInHandler = () => {
    console.log('Join In ID', groupId);
  };

  const createGroupHandler = () => {
    navigation.navigate('SetGroup');
  };

  return (
    <GradientContainer>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome to Roomies</Text>
        <Text style={styles.welcomeUserNameText}>UserName</Text>
        <Text style={styles.welcomeText}>The app that will make</Text>
        <Text style={styles.welcomeText}>Your tasks look funny!</Text>
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
        {/* We add in form fields here */}
        <Button title="Go to Main" onPress={() => navigation.navigate('Main')} color="#111" />
      </View>
    </GradientContainer>
  );
}
