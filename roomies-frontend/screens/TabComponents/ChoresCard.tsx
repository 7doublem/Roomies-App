import { styles } from 'components/style';
import React from 'react';
import { View, Text } from 'react-native';

// Define props with TypeScript
type ChoresCardProps = {
  chore: string;
  assignedTo: string;
  countdown: string;
  reward: number;
  status?: 'todo' | 'doing' | 'done';
};

export default function ChoresCard({
  chore,
  assignedTo,
  countdown,
  reward,
  status = 'todo',
}: ChoresCardProps) {
  const getBackgroundColor = () => {
    switch (status) {
      case 'doing':
        return 'rgb(175 241 251)'; 
      case 'done':
        return 'rgb(189 255 178)';
      case 'todo':
      default:
        return '#fff'; // white
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }]}>
      {/* Reward badge */}
      <View style={styles.rewardBadge}>
        <Text style={styles.rewardText}>{reward}</Text>
      </View>

      {/* Chore info */}
      <Text style={styles.choreName}>{chore}</Text>
      <Text style={styles.assignedTo}>👤 Assigned to: {assignedTo}</Text>
      <Text style={styles.countdown}>⏳ Countdown: {countdown}</Text>
    </View>
  );
}
