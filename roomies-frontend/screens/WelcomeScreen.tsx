import { View, Text, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/style';
import GradientContainer from 'components/GradientContainer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { joinGroup } from '../api/groups';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
export default function WelcomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Re-fetch user groupId on screen focus to trigger AppNavigator logic
      const checkGroup = async () => {
        const user = getAuth().currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          if (userData?.groupId) {
            // If groupId is set, force a navigation event (AppNavigator will handle the rest)
            navigation.goBack(); // or navigation.navigate('MainTab') if needed
          }
        }
      };
      checkGroup();
    }, [])
  );

  const joinInHandler = async () => {
    setError(null);
    setLoading(true);
    if (!groupCode) {
      setError('Please Add Group Code');
      setLoading(false);
      return;
    }

    try {
      const user = getAuth().currentUser;
      if (!user) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const res = await joinGroup(token, groupCode);
      const data = await res.json();

      if (res.ok) {
        await updateDoc(doc(db, 'users', user.uid), { groupId: groupCode });
        Alert.alert('Success', 'You joined the group!');
        // No navigation needed! AppNavigator will switch to AppTabs automatically
      } else {
        setError(`Failed: ${data?.message || 'Could not join group'}`);
      }
    } catch (error) {
      console.error('Join Group Error:', error);
      setError('Something went wrong');
    } finally {
      setLoading(false);
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
            style={styles.welcomeJoinInButton}
            disabled={loading}
          >
            <Text style={styles.welcomeJoinInButtontext}>
              {loading ? 'Joining...' : 'Join In'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>or</Text>

        <TouchableOpacity onPress={createGroupHandler} style={[styles.welcomeCreateGroupButton, { marginVertical: 10 }]}>
          <Text style={styles.welcomeCreateBtnText}>Create a group</Text>
        </TouchableOpacity>
      </View>
    </GradientContainer>
  );
}
