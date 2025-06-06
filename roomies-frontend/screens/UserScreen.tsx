import React from 'react'
import { View, Text, Image, Button } from 'react-native';
import GradientContainer from 'components/GradientContainer';
import { styles } from 'components/style'
import { ScrollView } from 'react-native-gesture-handler';

export default function UserScreen({ navigation }: any) {

  const profileUser = {
    id: '1',
    name: 'Alice',
    weeklyPoints: 120,
    totalPoints: 1200,
    avatar: require('../assets/bear.png')
  }

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.userProfileContainer}>
        <Image source={profileUser.avatar} style={styles.avatarLarge} />
        <Text style={styles.title} >{profileUser.name}</Text>
          <View style={styles.pointsContainer}>
          <Text style={styles.pointsSubtitle}>Total Points: {profileUser.totalPoints}</Text>
          <Text style={styles.pointsSubtitle}>Weekly Points: {profileUser.weeklyPoints}</Text>
        </View>
          </ScrollView>
      </View>
    </GradientContainer>
  );
}
