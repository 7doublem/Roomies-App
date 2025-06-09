import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style'
import { ScrollView } from 'react-native-gesture-handler';
import PointsCard from './PointsCard';

export default function UserScreen({ navigation }: any) {

  const profileUser = {
    id: '1',
    name: 'Alice',
    weeklyPoints: 120,
    totalPoints: 1200,
    avatar: require('../assets/bear.png')
  }

  function LogOutHandler() {
    console.log("Log me out");
  }

  function DeleteUserHandler() {
    console.log("Delete user profile")
  }

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.userProfileContainer}>
        <Image source={profileUser.avatar} style={styles.avatarLarge} />
        <Text style={styles.title} >{profileUser.name}</Text>
              <PointsCard
                totalPoints={profileUser.totalPoints}
              />
        </ScrollView>
        <View style={{ paddingHorizontal: 20, marginBottom: 30, gap: 10 }}>
        <TouchableOpacity onPress={DeleteUserHandler} style={styles.userScreenDeleteButton}>
            <Text style={styles.userScreenDeleteBtnText}>Delete my user profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={LogOutHandler} style={styles.welcomeCreateGroupButton}>
            <Text style={styles.welcomeCreateBtnText}>Log out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </GradientContainer>
  );
}

