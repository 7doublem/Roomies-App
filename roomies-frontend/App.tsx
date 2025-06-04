import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from 'navigation/AppNavigator';

// import './global.css';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
