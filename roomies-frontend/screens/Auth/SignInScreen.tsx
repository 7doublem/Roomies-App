import { Text, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../../firebase/config';
import GradientContainer from '../../components/GradientContainer';
import { styles } from '../../components/style';
export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          Alert.alert('Google Sign-In Error', error.message);
        });
    }
  }, [response]);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Welcome');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <GradientContainer>
      <Text style={styles.signIn_Text}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.signIn_Input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.signIn_Input}
      />
      {/* Pill Sign In Button */}
      <TouchableOpacity
        onPress={handleSignIn}
        activeOpacity={0.8}
        style={styles.signIn_Touchable}
      >
        <Text style={styles.signIn_Touchable_Text}>Sign In</Text>
      </TouchableOpacity>

      {/* Google Sign-In Button */}
      <TouchableOpacity
        onPress={() => promptAsync()}
        activeOpacity={0.8}
        style={styles.signIn_Googlebutton}>
        <Image
          source={require('../../assets/google-light-logo.png')}
          style={styles.signIn_Googlebutton_image}
          resizeMode="contain"
        />
        <Text style={styles.signIn_Googlebutton_text}>Sign In with Google</Text>
      </TouchableOpacity>

      {/* Pill Sign Up Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        activeOpacity={0.8}
        style={styles.signIn_goBackButton}>
        <Text style={styles.signIn_goBackButton_text}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </GradientContainer>
  );
}