import React from 'react';
import { ScrollView } from 'react-native';
import ChoresCard from './ChoresCard';

export default function DoingScreen() {
  return (
    <ScrollView>
      <ChoresCard
        status="doing"
        chore="Vacuum the living room"
        assignedTo="Liam"
        countdown="5h 10m"
        reward={40}
      />
    </ScrollView>
  );
}
