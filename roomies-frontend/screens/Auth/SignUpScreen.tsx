import { View, Text, Button, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../firebase/config';

const avatarOptions = [
  require('../../assets/bear.png'),
  require('../../assets/deer.png'),
  require('../../assets/turtle.png'),
];

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Avatar state
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [pickerValue, setPickerValue] = useState('0');

  // Google Authentication Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '434083306699-mk47mhaffjojfv65nr247h8vsi6nm7tc.apps.googleusercontent.com',
    iosClientId: '434083306699-14r5k5v4l505ubgoohphidm03j1hi6ku.apps.googleusercontent.com',
    androidClientId: '434083306699-032sff9k48cer4oajlqi036ufbo46ufu.apps.googleusercontent.com',
    webClientId: '434083306699-mk47mhaffjojfv65nr247h8vsi6nm7tc.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.navigate('Welcome'))
        .catch((error) => {
          Alert.alert('Google Sign-Up Error', error.message);
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Welcome');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      setPickerValue('custom');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginVertical: 8, padding: 12, fontSize: 18, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 8, padding: 12, fontSize: 18, borderRadius: 8 }}
      />

      {/* Pill Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        activeOpacity={0.8}
        style={{
          alignSelf: 'center',
          marginVertical: 12,
          width: 320,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#ffcc5c',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 20 }}>Sign Up</Text>
      </TouchableOpacity>

      {/* Google Sign Up Button */}
      <TouchableOpacity
        onPress={() => promptAsync()}
        activeOpacity={0.8}
        style={{
          alignSelf: 'center',
          marginVertical: 12,
          width: 320,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#ffeead',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Image
          source={require('../../assets/google-light-logo.png')}
          style={{ width: 32, height: 32, marginRight: 16 }}
          resizeMode="contain"
        />
        <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 20 }}>
          Sign Up with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignIn')}
        activeOpacity={0.8}
        style={{
          alignSelf: 'center',
          marginVertical: 12,
          width: 320,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#96ceb4',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#111', fontWeight: 'bold', fontSize: 20 }}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 16 }}>
        <Image
          source={avatarUri ? { uri: avatarUri } : avatar}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: '#96ceb4',
            backgroundColor: '#fff',
          }}
        />
        <Text style={{ textAlign: 'center', color: '#111', marginTop: 8 }}>Tap to upload avatar</Text>
      </TouchableOpacity>

      {/* Avatar Picker */}
      <Picker
        selectedValue={pickerValue}
        onValueChange={(itemValue, itemIndex) => {
          setPickerValue(itemValue);
          if (itemValue !== 'custom') {
            setAvatar(avatarOptions[parseInt(itemValue)]);
            setAvatarUri(null);
          }
        }}
        style={{ marginBottom: 16 }}
      >
        <Picker.Item label="Choose a profile picture..." value="0" />
        <Picker.Item label="Avatar 1" value="0" />
        <Picker.Item label="Avatar 2" value="1" />
        <Picker.Item label="Avatar 3" value="2" />
        <Picker.Item label="Upload from device..." value="custom" />
      </Picker>
    </View>
  );
}