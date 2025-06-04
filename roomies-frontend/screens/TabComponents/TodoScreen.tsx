import React from 'react';
import { ScrollView } from 'react-native';
import ChoresCard from '../TabComponents/ChoresCard';

export default function TodoScreen() {
  return (
    <ScrollView>
      <ChoresCard
        status="todo"
        chore="Wash the dishes"
        assignedTo="John"
        countdown="1d 20m 30s"
        reward={50}
      />

      <ChoresCard
        status="todo"
        chore="Take out the trash"
        assignedTo="Emma"
        countdown="3h 45m"
        reward={25}
      />

      <ChoresCard
        status="todo"
        chore="Vacuum the living room"
        assignedTo="Liam"
        countdown="5h 10m"
        reward={40}
      />
    </ScrollView>
  );
}
