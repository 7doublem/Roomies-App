import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style'
import { ScrollView } from 'react-native-gesture-handler';
import PointsCard from './PointsCard';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UserScreen({ navigation }: any) {
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = getAuth().currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfileUser({ uid: user.uid, ...userDoc.data() });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  function LogOutHandler() {
    signOut(getAuth())
      .then(() => {
        // Optionally show a message or navigate
        Alert.alert('Logged out', 'You have been logged out.');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to log out.');
        console.error('Logout error:', error);
      });
  }

  function DeleteUserHandler() {
    console.log("Delete user profile")
  }

  if (loading) {
    return (
      <GradientContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4f8cff" />
        </View>
      </GradientContainer>
    );
  }

  if (!profileUser) {
    return (
      <GradientContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>User not found.</Text>
        </View>
      </GradientContainer>
    );
  }

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.userProfileContainer}>
          <Image
            source={
              profileUser.avatarUrl
                ? { uri: profileUser.avatarUrl }
                : require('../assets/bear.png')
            }
            style={styles.avatarLarge}
          />
          <Text style={styles.title}>{profileUser.username}</Text>
          <PointsCard totalPoints={profileUser.rewardPoints || 0} />
        </ScrollView>
        <View style={{ paddingHorizontal: 20, marginBottom: 30, gap: 10 }}>
          <TouchableOpacity onPress={LogOutHandler} style={styles.welcomeCreateGroupButton}>
            <Text style={styles.welcomeCreateBtnText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientContainer>
  );
}

