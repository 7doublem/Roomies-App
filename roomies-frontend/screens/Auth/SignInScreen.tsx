import { Text, TextInput, Alert, TouchableOpacity, Image, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import GradientContainer from '../../components/GradientContainer';
import { styles } from '../../components/style';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<'email' | 'password' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter both an email address and password')
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Welcome');
    } catch (error: any) {
      switch (error.code) {
        
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email address');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError(error.message || 'Something went wrong');
      }
    }
  };

  // --- Animated Button ---
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 4,
    elevation: 3,
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };
  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  // --- Animated Input Borders ---
  const emailBorder = useSharedValue(0);
  const passwordBorder = useSharedValue(0);

  const animatedEmailStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      emailBorder.value,
      [0, 1],
      ['#ccc', '#4f8cff']
    ),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  const animatedPasswordStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      passwordBorder.value,
      [0, 1],
      ['#ccc', '#4f8cff']
    ),
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  }));

  // --- Fade-in Animation ---
  const fade = useSharedValue(0);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
  }, []);

  return (
    <GradientContainer>
      <Animated.View style={fadeStyle}>
        <Text style={styles.signIn_Text}>Sign In</Text>

        {/* Error Message */}
        {error && (
          <View style={{ marginBottom: 12, alignItems: 'center' }}>
            <Text style={{ color: '#e74c3c', fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Email Input */}
        <Animated.View style={animatedEmailStyle}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={[styles.signIn_Input, { borderWidth: 0, marginBottom: 0 }]}
            onFocus={() => {
              emailBorder.value = withTiming(1);
              setFocusedInput('email');
            }}
            onBlur={() => {
              emailBorder.value = withTiming(0);
              setFocusedInput(null);
            }}
            placeholderTextColor="#888"
          />
        </Animated.View>

        {/* Password Input */}
        <Animated.View style={animatedPasswordStyle}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.signIn_Input, { borderWidth: 0, marginBottom: 0 }]}
            onFocus={() => {
              passwordBorder.value = withTiming(1);
              setFocusedInput('password');
            }}
            onBlur={() => {
              passwordBorder.value = withTiming(0);
              setFocusedInput(null);
            }}
            placeholderTextColor="#888"
          />
        </Animated.View>

        {/* Pill Sign In Button */}
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={handleSignIn}
            activeOpacity={0.8}
            style={styles.signIn_Touchable}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.signIn_Touchable_Text}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Pill Sign Up Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.8}
          style={styles.signIn_goBackButton}>
          <Text style={styles.signIn_goBackButton_text}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </GradientContainer>
  );
}