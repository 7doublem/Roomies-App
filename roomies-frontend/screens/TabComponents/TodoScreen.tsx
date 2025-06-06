import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import ChoresCard from '../TabComponents/ChoresCard';
import { useNavigation } from '@react-navigation/native';
type Todo = {
  id: number;
  status: string;
  chore: string;
  assignedTo: string;
  countdown: string;
  reward: number;
};

export default function TodoScreen() {
  const navigation = useNavigation();
  const [todo, setToDo] = useState<Todo[]>([]);

  useEffect(() => {
    setToDo([
      {
        id: 1,
        status: 'todo',
        chore: 'Wash the dishes',
        assignedTo: 'John',
        countdown: '1d 20m 30s',
        reward: 40,
      },
      {
        id: 2,
        status: 'todo',
        chore: 'Vacuum the living room',
        assignedTo: 'Wendy',
        countdown: '1d 20m 30s',
        reward: 40,
      },
      {
        id: 3,
        status: 'todo',
        chore: 'Take out the trash',
        assignedTo: 'Emma',
        countdown: '1d 20m 30s',
        reward: 70,
      },
    ]);
  }, []);

  const choreDetailHandler = () => {
    navigation.navigate('ChoreDetail');
  };

  return (
    <ScrollView>
      {todo.map((todo) => (
        <TouchableOpacity key={todo.id} onPress={choreDetailHandler}>
          <ChoresCard
            status={todo.status}
            chore={todo.chore}
            assignedTo={todo.assignedTo}
            countdown={todo.countdown}
            reward={todo.reward}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
