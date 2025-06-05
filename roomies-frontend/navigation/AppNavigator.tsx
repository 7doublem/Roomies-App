import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'

import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GroupScreen from '../screens/Group/GroupScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MainScreen from '../screens/MainScreen';
import SocialScreen from '../screens/SocialScreen';
import SetGroupScreen from '../screens/Group/SetGroupScreen';
import UpdateTaskScreen from '../screens/UpdateTaskScreen'

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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
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

function AddTaskStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
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

function SocialStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Social" component={SocialScreen} />
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
            case 'AddTaskTab':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'LeaderboardTab':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'SocialTab':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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
        <Tab.Screen name="AddTaskTab" component={AddTaskStack} options={{ title: 'Add Task' }} />
        <Tab.Screen name="LeaderboardTab" component={LeaderboardStack} options={{ title: 'Leaderboard' }} />
        <Tab.Screen name="SocialTab" component={SocialStack} options={{ title: 'Social' }} />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // const [isSignedIn, setIsSignedIn] = React.useState(false); 

  return (
    <NavigationContainer>
      {/* {isSignedIn ? <AppTabs /> : <AuthStack />} */}
      <AppTabs/>
    </NavigationContainer>
  );
}

