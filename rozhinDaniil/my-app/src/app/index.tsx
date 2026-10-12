import { router } from 'expo-router';

import WelcomeScreen from '../screens/WelcomeScreen';

export default function Welcome() {
  return <WelcomeScreen onStart={() => router.replace('/home')} />;
}
