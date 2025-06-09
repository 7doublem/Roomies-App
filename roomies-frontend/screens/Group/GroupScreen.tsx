import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react';
import { styles } from 'components/style'; // your styles file
import GradientContainer from 'components/GradientContainer';
import UserCard from './UserCard';
import Animated, { FadeInUp, withSpring } from 'react-native-reanimated';

export default function GroupScreen({ navigation }: any) {
  const [addUser, setAddUser] = useState('');
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice', totalPoints: 1200, avatar: require('assets/bear.png') },
    { id: '2', name: 'Bob', totalPoints: 11000, avatar: require('assets/deer.png') },
    { id: '3', name: 'Charlie', totalPoints: 10000, avatar: require('assets/turtle.png') },
    { id: '4', name: 'David', totalPoints: 900, avatar: require('assets/bear.png') },
    { id: '5', name: 'Eve', totalPoints: 8000, avatar: require('assets/deer.png') },
    { id: '6', name: 'Suhaim', totalPoints: 70000, avatar: require('assets/deer.png') },
    { id: '7', name: 'Wendy', totalPoints: 15000, avatar: require('assets/turtle.png') }
  ]);

  const addUserHandler = () => {
    const trimmedName = addUser.trim();
    if (!trimmedName) return;

    const newUser = {
      id: Date.now().toString(),
      name: trimmedName,
      totalPoints: 0,
      avatar: require('assets/bear.png'),
    };

    setUsers((prev) => [newUser, ...prev]);
    setAddUser('');
  };

  const deleteUserHandler = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  const sortedUsers = users;
  return (
    <GradientContainer>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Your Group</Text>
        <View style={styles.groupScreen_container}>
          <Text style={styles.groupSection_text}>Add New Users</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter username"
              value={addUser}
              onChangeText={setAddUser}
              autoCapitalize="none"
              style={styles.textInput}
              returnKeyType="done"
              onSubmitEditing={addUserHandler}
            />
            <TouchableOpacity onPress={addUserHandler} activeOpacity={0.8} style={styles.addButton}>
              <FontAwesome6 name="circle-plus" size={28} color="#4a90e2" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>
            {sortedUsers.map((user, idx) => (
              <Animated.View
                key={user.id}
                entering={FadeInUp.delay(idx * 100)}
                style={[
                  styles.userCardContainer,
                  {
                    transform: [{ scale: withSpring(1, { damping: 12, stiffness: 120 }) }],
                  },
                ]}>
                <View style={styles.userInfoContainer}>
                  <Image source={user.avatar} style={styles.avatar} />
                  <View style={styles.userTextContainer}>
                    <Text style={styles.GroupScreen_userName}>{user.name}</Text>
                    <Text style={styles.userPoints}>{user.totalPoints} pts</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => deleteUserHandler(user.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}>
                  <FontAwesome6 name="circle-minus" size={26} color="#e74c3c" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </View>
    </GradientContainer>
  );
}
