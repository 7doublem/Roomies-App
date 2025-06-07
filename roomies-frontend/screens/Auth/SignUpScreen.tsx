import { View, Text, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
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

const avatarOptions = [
  require('../../assets/bear.png'),
  require('../../assets/deer.png'),
  require('../../assets/turtle.png'),
];

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [pickerValue, setPickerValue] = useState('0');
  const [error, setError] = useState<string | null>(null);

  // --- Animated Button ---
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
      ['#ccc', '#ffcc5c']
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
      ['#ccc', '#ffcc5c']
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

  const handleSignUp = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // You may want to save the name to Firestore or user profile here
      navigation.navigate('Welcome');
    } catch (error: any) {
      setError(error.message);
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
      <Animated.View style={fadeStyle}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 140, height: 140, alignSelf: 'center', marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text style={styles.signUp_text}>Sign Up</Text>

        {/* Error Message */}
        {error && (
          <View style={{ marginBottom: 12, alignItems: 'center' }}>
            <Text style={{ color: '#e74c3c', fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Name Input */}
        <Animated.View style={animatedEmailStyle}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={[styles.signUp_Input, { borderWidth: 0, marginBottom: 0 }]}
            placeholderTextColor="#888"
          />
        </Animated.View>

        {/* Email Input */}
        <Animated.View style={animatedEmailStyle}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={[styles.signUp_Input, { borderWidth: 0, marginBottom: 0 }]}
            onFocus={() => { emailBorder.value = withTiming(1); }}
            onBlur={() => { emailBorder.value = withTiming(0); }}
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
            style={[styles.signUp_Input, { borderWidth: 0, marginBottom: 0 }]}
            onFocus={() => { passwordBorder.value = withTiming(1); }}
            onBlur={() => { passwordBorder.value = withTiming(0); }}
            placeholderTextColor="#888"
          />
        </Animated.View>

        {/* Avatar Picker */}
        <TouchableOpacity onPress={pickImage} style={styles.signUp_Avatar_Touchable}>
          <Image
            source={avatarUri ? { uri: avatarUri } : avatar}
            style={styles.signUp_Avatar_Touchable_image}
          />
          <Text style={styles.signUp_Avatar_Touchable_text}>Tap to upload avatar</Text>
        </TouchableOpacity>
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
          <Picker.Item label="Bear" value="0" />
          <Picker.Item label="Deer" value="1" />
          <Picker.Item label="Turtle" value="2" />
          <Picker.Item label="Upload from device..." value="custom" />
        </Picker>

        {/* Pill Sign Up Button */}
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            onPress={handleSignUp}
            activeOpacity={0.8}
            style={styles.signUp_touchable}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.signUp_touchable_text}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Pill Sign In Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          activeOpacity={0.8}
          style={styles.signUp_signinButton}
        >
          <Text style={styles.signUp_signinButton_text}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </GradientContainer>
  );
}