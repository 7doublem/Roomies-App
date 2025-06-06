import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
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
  onDropToDone: (id: number) => void;
};

export default function DoingScreen({ chores, onDropToDone }: Props) {
  return (
    <ScrollView>
      {chores.map((chore) => (
        <TouchableOpacity
          key={chore.id}
          onLongPress={() => {
            // Simulate drag-to-done: on long press, move to done
            onDropToDone(chore.id);
          }}
          delayLongPress={400}
        >
          <ChoresCard
            status={chore.status}
            chore={chore.chore}
            assignedTo={chore.assignedTo}
            countdown={chore.countdown}
            reward={chore.reward}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
