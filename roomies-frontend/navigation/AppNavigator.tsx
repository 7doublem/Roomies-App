import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../firebase/config';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import AddChoreScreen from '../screens/AddChoreScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MainScreen from '../screens/MainScreen';
import UserScreen from '../screens/UserScreen';
import SetGroupScreen from '../screens/Group/SetGroupScreen';
import UpdateChoreScreen from '../screens/UpdateChoreScreen';
import ChoreDetailScreen from 'screens/ChoreDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// Stack for Welcome and SetGroup (for new users)
function WelcomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        tabBarIcon: ({ focused, size, color }) => {
          let iconName: string;
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
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6f69',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="MainTab" component={MainStack} options={{ title: 'Main' }} />
      <Tab.Screen name="GroupTab" component={GroupStack} options={{ title: 'Group' }} />
      <Tab.Screen name="AddChoreTab" component={AddChoreStack} options={{ title: 'Add Chore' }} />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardStack}
        options={{ title: 'Leaderboard' }}
      />
      <Tab.Screen name="UserTab" component={UserStack} options={{ title: 'User' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasGroup, setHasGroup] = useState<boolean | null>(null);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      setIsSignedIn(!!user);
      if (user) {
        // Listen for real-time changes to the user's groupId
        const userRef = doc(db, 'users', user.uid);
        unsubscribeUserDoc = onSnapshot(userRef, (userDoc) => {
          const userData = userDoc.data();
          setHasGroup(!!userData?.groupId);
        });
      } else {
        setHasGroup(null);
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  return (
    <NavigationContainer>
      {!isSignedIn && <AuthStack />}
      {isSignedIn && hasGroup === false && <WelcomeStack />}
      {isSignedIn && hasGroup === true && <AppTabs />}
    </NavigationContainer>
  );
}
