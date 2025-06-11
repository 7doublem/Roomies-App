import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import AddChoreScreen from '../screens/AddChoreScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MainScreen from '../screens/MainScreen';
import UserScreen from '../screens/UserScreen';
import SetGroupScreen from '../screens/Group/SetGroupScreen';
import UpdateChoreScreen from '../screens/UpdateChoreScreen'
import ChoreDetailScreen from 'screens/ChoreDetailScreen';
const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SetGroup" component={SetGroupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="ChoreDetail" component={ChoreDetailScreen} />
      <Stack.Screen name="UpdateChoreScreen" component={UpdateChoreScreen} />
    </Stack.Navigator>
  );
}
function GroupStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Group" component={GroupScreen} />
    </Stack.Navigator>
  );
}

function AddChoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddChore" component={AddChoreScreen} />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
  <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size, color}) => {
          let iconName;

          switch (route.name) {
            case 'MainTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'GroupTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'AddChoreTab':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'LeaderboardTab':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'UserTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6f69',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="MainTab" component={MainStack} options={{ title: 'Main' }} />
        <Tab.Screen name="GroupTab" component={GroupStack} options={{ title: 'Group' }} />
        <Tab.Screen name="AddChoreTab" component={AddChoreStack} options={{ title: 'Add Chore' }} />
        <Tab.Screen name="LeaderboardTab" component={LeaderboardStack} options={{ title: 'Leaderboard' }} />
        <Tab.Screen name="UserTab" component={UserStack} options={{ title: 'User' }} />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsSignedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {isSignedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

