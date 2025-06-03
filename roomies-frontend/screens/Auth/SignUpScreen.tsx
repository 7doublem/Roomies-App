import {View, Text, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

export default function SignUpScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignUp = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate('Welcome');
      } catch (error: any) {
        Alert.alert('Sign Up Error', error.message);
      }
    };
  
    return (
      <View style={{ padding: 16 }}>
        <Text>Sign Up</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <Button title="Sign Up" onPress={handleSignUp} />
        <Button title="Already have an account? Sign In" onPress={() => navigation.navigate('SignIn')} />
      </View>
    );
  }