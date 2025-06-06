import {View, Text, Button , TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from 'components/style'
import GradientContainer from 'components/GradientContainer';
import { ScrollView } from 'react-native';
import UserCard from './UserCard';

export default function GroupScreen({ navigation }: any) {

    const users = [
  { id: '1', name: 'Alice', totalPoints: 1200, avatar: require('assets/bear.png') },
  { id: '2', name: 'Bob', totalPoints: 11000, avatar: require('assets/deer.png') },
  { id: '3', name: 'Charlie', totalPoints: 10000, avatar: require('assets/turtle.png') },
  { id: '4', name: 'David', totalPoints: 900, avatar: require('assets/bear.png') },
  { id: '5', name: 'Eve', totalPoints: 8000, avatar: require('assets/deer.png') },
  { id: '6', name: 'Suhaim', totalPoints: 70000, avatar: require('assets/deer.png') },
  { id: '7', name: 'Wendy', totalPoints: 15000, avatar: require('assets/turtle.png') }
    ];
  
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints)

  return (
      <GradientContainer>
        <View style={{ flex: 1 }}>
            <Text style={styles.title} >Your Group</Text>
    <ScrollView>
          {sortedUsers.map(user => (
            <UserCard
              key={user.id}
              name={user.name}
              avatar={user.avatar}
              totalPoints={user.totalPoints}
            />
          ))}
    </ScrollView>
      </View>
      </GradientContainer>
    );
}