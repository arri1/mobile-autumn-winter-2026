import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';

const welcomeMessage = 'Открой вкладку «Лабы», чтобы начать со счётчика.';
const shortcuts = [
  { route: '/campus', icon: 'campus', title: 'Кампус', description: '3D-модели и поиск аудиторий' },
  { route: '/posts', icon: 'posts', title: 'Посты', description: 'Читать и публиковать в ленте курса' },
] as const;

export default function WelcomeScreen() {
  const [started, setStarted] = useState(false);

  function start() {
    if (Platform.OS === 'web') setStarted(true);
    else Alert.alert('Поехали!', welcomeMessage);
  }

  return (
    <CampusScreen>
      <View style={styles.welcome}>
        <Text style={styles.subtitle}>Кампус СВФУ</Text>
        <Text accessibilityRole="header" style={[courseStyles.title, styles.heroTitle]}>Добро пожаловать</Text>
        <Pressable accessibilityRole="button" onPress={start}
          style={({ pressed }) => [courseStyles.button, styles.start, pressed && courseStyles.dimmed]}>
          <Text style={[courseStyles.buttonText, styles.startLabel]}>Начать</Text>
          <Icon name="arrow" color={colors.forest} size={19} />
        </Pressable>
        {started && <Text accessibilityRole="alert" style={styles.subtitle}>{welcomeMessage}</Text>}
      </View>
      <View style={styles.shortcuts}>
        {shortcuts.map(({ route, icon, title, description }) => (
          <Link key={route} href={route} asChild>
            <Pressable accessibilityRole="link">
              {({ pressed }) => (
                <View style={[courseStyles.card, styles.shortcut, pressed && courseStyles.dimmed]}>
                  <View style={styles.badge}><Icon name={icon} color={colors.green} /></View>
                  <View style={styles.shortcutCopy}>
                    <Text style={courseStyles.heading}>{title}</Text>
                    <Text style={courseStyles.muted}>{description}</Text>
                  </View>
                  <Icon name="arrow" color={colors.green} size={19} />
                </View>
              )}
            </Pressable>
          </Link>
        ))}
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  welcome: { gap: 14, padding: 24, borderRadius: 26, backgroundColor: colors.forest },
  subtitle: { color: colors.lightText, fontSize: 15, lineHeight: 21 },
  heroTitle: { color: colors.paper, fontSize: 40, lineHeight: 44, letterSpacing: -1.5 },
  start: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: colors.mint },
  startLabel: { color: colors.forest },
  shortcuts: { gap: 10 },
  shortcut: { flexDirection: 'row', alignItems: 'center' },
  shortcutCopy: { flex: 1, gap: 3 },
  badge: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint, borderRadius: 14 },
});
