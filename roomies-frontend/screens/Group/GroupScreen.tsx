import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { styles } from 'components/style'
import GradientContainer from 'components/GradientContainer';
import { ScrollView } from 'react-native';
import UserCard from './UserCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';

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

  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Your Group</Text>
        <ScrollView>
          {sortedUsers.map((user, idx) => (
            <Animated.View
              key={user.id}
              entering={FadeInUp.delay(idx * 100)}
              style={{
                // Optional: add a little spring pop
                transform: [{ scale: withSpring(1, { damping: 12, stiffness: 120 }) }],
              }}
            >
              <UserCard
                name={user.name}
                avatar={user.avatar}
                totalPoints={user.totalPoints}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </GradientContainer>
  );
}