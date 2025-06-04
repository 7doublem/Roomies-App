import React from 'react';
import { ScrollView } from 'react-native';
import ChoresCard from './ChoresCard';

export default function DoneScreen() {
  return (
    <ScrollView>
      <ChoresCard
        status="done"
        chore="Wash the dishes"
        assignedTo="John"
        countdown="1d 20m 30s"
        reward={50}
      />
    </ScrollView>
  );
}
