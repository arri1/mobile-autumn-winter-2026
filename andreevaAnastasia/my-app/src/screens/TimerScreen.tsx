import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // cleanup: без него интервал продолжит тикать после ухода с экрана
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Секунд на экране</Text>
      <Text style={styles.value}>{seconds}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111',
  },
});
