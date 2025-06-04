import { View, Text, Button, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../firebase/config';
import GradientContainer from '../../components/GradientContainer';

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
    <GradientContainer>
      <Text style={styles.signUp_text}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.signUp_Input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.signUp_Input}
      />

      {/* Pill Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        activeOpacity={0.8}
        style={styles.signUp_touchable}
      >
        <Text style={styles.signUp_touchable_text}>Sign Up</Text>
      </TouchableOpacity>

      {/* Google Sign Up Button */}
      <TouchableOpacity
        onPress={() => promptAsync()}
        activeOpacity={0.8}
        style={styles.signUp_googleButton}
      >
        <Image
          source={require('../../assets/google-light-logo.png')}
          style={styles.signUp_googleButton_image}
          resizeMode="contain"
        />
        <Text style={styles.signUp_googleButton_text}>
          Sign Up with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignIn')}
        activeOpacity={0.8}
        style={styles.signUp_signinButton}
      >
        <Text style={styles.signUp_signinButton_text}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={styles.signUp_Avatar_Touchable}>
        <Image
          source={avatarUri ? { uri: avatarUri } : avatar}
          style={styles.signUp_Avatar_Touchable_image}
        />
        <Text style={styles.signUp_Avatar_Touchable_text}>Tap to upload avatar</Text>
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
        style={styles.signUp_Input}
        dropdownIconColor="#111"
      >
        <Picker.Item label="Choose a profile picture..." value="0" />
        <Picker.Item label="Bear" value="0" />
        <Picker.Item label="Deer" value="1" />
        <Picker.Item label="Turtle" value="2" />
        <Picker.Item label="Upload from device..." value="custom" />
      </Picker>
    </GradientContainer>
  );
}