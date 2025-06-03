import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MainScreen from '../screens/MainScreen';
import SocialScreen from '../screens/SocialScreen';
import SetGroupScreen from '../screens/Group/SetGroupScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Social" component={SocialScreen} />
        <Stack.Screen name="SetGroup" component={SetGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}