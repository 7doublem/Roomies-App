import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MainScreen from '../screens/MainScreen';
import SocialScreen from '../screens/SocialScreen';
import SetGroupScreen from '../screens/Group/SetGroupScreen';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SetGroup" component={SetGroupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
}
function GroupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Group" component={GroupScreen} />
    </Stack.Navigator>
  );
}

function AddTaskStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
}

function SocialStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Social" component={SocialScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="MainTab" component={MainStack} options={{ title: 'Main' }} />
        <Tab.Screen name="GroupTab" component={GroupStack} options={{ title: 'Group' }} />
        <Tab.Screen name="AddTaskTab" component={AddTaskStack} options={{ title: 'Add Task' }} />
        <Tab.Screen name="LeaderboardTab" component={LeaderboardStack} options={{ title: 'Leaderboard' }} />
        <Tab.Screen name="SocialTab" component={SocialStack} options={{ title: 'Social' }} />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AuthStack/>
    </NavigationContainer>
  );
}

