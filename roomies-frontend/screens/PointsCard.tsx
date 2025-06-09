import { styles } from 'components/style';
import React from 'react';
import { View, Text, Image } from 'react-native';

type PointsCardProps = {
  totalPoints: number;
};

export default function PointsCard({
  totalPoints
}: PointsCardProps) {

  return (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={styles.userName}>Total Points: {totalPoints}</Text>
        </View>
    </View>
  );
}