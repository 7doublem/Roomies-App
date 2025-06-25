import { StatusBar } from 'expo-status-bar';
import AppNavigator from 'navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...FontAwesome6.font,
  });

  if (!fontsLoaded) return null; // Or a loading spinner

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}