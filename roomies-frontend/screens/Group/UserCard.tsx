import { styles } from 'components/style';
import React from 'react';
import { View, Text, Image } from 'react-native';

type UserCardProps = {
  name: string;
  totalPoints: number;
  avatar: any;
};

export default function UserCard({
  name, totalPoints, avatar
}: UserCardProps) {

  return (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>
      {/* Reward badge style like ChoresCard*/}
      <View style={styles.rewardBadge}>
        <Text style={styles.rewardText}>{totalPoints}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Image source={avatar} style={styles.avatarSmall} />
        <Text style={styles.userName}>{name}</Text>
        </View>
    </View>
  );
}
