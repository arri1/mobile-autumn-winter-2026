import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import { courseStyles } from './courseStyles';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={courseStyles.card}>
      <Text accessibilityRole="header" style={courseStyles.heading}>Секунд на экране</Text>
      <Text testID="elapsed-seconds" style={courseStyles.title}>{seconds}</Text>
    </View>
  );
}

export default function TimerScreen() {
  const focused = useIsFocused();
  return <CampusScreen>{focused && <Timer />}</CampusScreen>;
}
