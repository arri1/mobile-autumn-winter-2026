import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function TimerScreen() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.icon}><Text style={styles.iconText}>◷</Text></View>
      <Text style={styles.eyebrow}>ЭФФЕКТ ПОСЛЕ ОТРИСОВКИ</Text>
      <Text style={styles.title}>Таймер</Text>
      <Text style={styles.seconds} accessibilityLiveRegion="polite">{seconds}</Text>
      <Text style={styles.description}>Таймер работает, пока открыт этот экран. При уходе интервал очищается.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f5ee', padding: 28 },
  icon: { width: 64, height: 64, borderRadius: 22, backgroundColor: '#f2d8ac', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  iconText: { color: '#76552a', fontSize: 32 },
  eyebrow: { color: '#176b57', fontSize: 11, fontWeight: '800', letterSpacing: 1.3, textAlign: 'center', marginBottom: 8 },
  title: { color: '#202b26', fontSize: 28, fontWeight: '800' },
  seconds: { color: '#176b57', fontSize: 76, fontWeight: '800', marginVertical: 12 },
  description: { maxWidth: 300, color: '#68716b', fontSize: 15, lineHeight: 23, textAlign: 'center' },
});
