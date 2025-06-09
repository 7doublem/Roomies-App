import { styles } from 'components/style';
import React from 'react';
import { View, Text, Image } from 'react-native';

type PointsCardProps = {
  totalPoints: number;
  weeklyPoints: any;
};

export default function PointsCard({
  totalPoints, weeklyPoints
}: PointsCardProps) {

  return (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={styles.userName}>Total Points: {totalPoints}</Text>
        <Text style={styles.userName}>Weekly Points: {weeklyPoints}</Text>
        </View>
    </View>
  );
}