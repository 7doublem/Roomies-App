import React from 'react'
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

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.userProfileContainer}>
        <Image source={profileUser.avatar} style={styles.avatarLarge} />
        <Text style={styles.title} >{profileUser.name}</Text>
              <PointsCard
                weeklyPoints={profileUser.weeklyPoints}
                totalPoints={profileUser.totalPoints}
              />
        </ScrollView>
        <TouchableOpacity onPress={LogOutHandler} style={styles.welcomeCreateGroupButton}>
            <Text style={styles.welcomeCreateBtnText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </GradientContainer>
  );
}
