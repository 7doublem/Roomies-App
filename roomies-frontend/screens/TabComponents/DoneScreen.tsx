import React from 'react';
import { ScrollView } from 'react-native';
import ChoresCard from './ChoresCard';

type Chore = {
  id: number;
  status: string;
  chore: string;
  assignedTo: string;
  countdown: string;
  reward: number;
};

type Props = {
  chores: Chore[];
};

export default function DoneScreen({ chores }: Props) {
  return (
    <ScrollView>
      {chores.map((chore) => (
        <ChoresCard
          key={chore.id}
          status={chore.status}
          chore={chore.chore}
          assignedTo={chore.assignedTo}
          countdown={chore.countdown}
          reward={chore.reward}
        />
      ))}
    </ScrollView>
  );
}
