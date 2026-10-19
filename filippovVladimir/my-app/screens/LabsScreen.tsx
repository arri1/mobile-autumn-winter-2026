import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LabsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<LabsStackParamList, 'LabsHome'>;

export function LabsScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>ПРАКТИКА</Text>
      <Text style={styles.title}>Лабораторные</Text>
      <Text style={styles.description}>Выбери, что хочешь попробовать сегодня.</Text>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Counter')} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={[styles.icon, styles.counterIcon]}><Text style={styles.iconText}>±</Text></View>
        <View style={styles.cardCopy}><Text style={styles.cardTitle}>useState-счётчик</Text><Text style={styles.cardDescription}>Состояние и нажатия</Text></View>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Timer')} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={[styles.icon, styles.timerIcon]}><Text style={styles.iconText}>◷</Text></View>
        <View style={styles.cardCopy}><Text style={styles.cardTitle}>Таймер useEffect</Text><Text style={styles.cardDescription}>Эффект и очистка таймера</Text></View>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Posts')} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={[styles.icon, styles.postsIcon]}><Text style={styles.iconText}>☰</Text></View>
        <View style={styles.cardCopy}><Text style={styles.cardTitle}>Посты курса</Text><Text style={styles.cardDescription}>Загрузка данных с сервера</Text></View>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5ee', padding: 24, paddingTop: 32 },
  eyebrow: { color: '#176b57', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#202b26', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  description: { color: '#68716b', fontSize: 15, marginBottom: 24 },
  card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffefa', borderColor: '#e9e7df', borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 12 },
  pressed: { opacity: 0.78 },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  counterIcon: { backgroundColor: '#e7edcf' },
  timerIcon: { backgroundColor: '#f2d8ac' },
  postsIcon: { backgroundColor: '#dce9e5' },
  iconText: { color: '#176b57', fontSize: 24, fontWeight: '700' },
  cardCopy: { flex: 1 },
  cardTitle: { color: '#202b26', fontSize: 16, fontWeight: '700', marginBottom: 5 },
  cardDescription: { color: '#68716b', fontSize: 13 },
  arrow: { color: '#176b57', fontSize: 22, marginLeft: 8 },
});
