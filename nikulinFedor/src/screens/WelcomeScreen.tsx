import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import { courseStyles } from './courseStyles';

const welcomeMessage = 'Открой вкладку «Лабы», чтобы начать со счётчика.';

export default function WelcomeScreen() {
  const [started, setStarted] = useState(false);

  function start() {
    if (Platform.OS === 'web') setStarted(true);
    else Alert.alert('Поехали!', welcomeMessage);
  }

  return (
    <CampusScreen>
      <View style={[courseStyles.card, styles.welcome]}>
        <Text accessibilityRole="header" style={[courseStyles.title, styles.center]}>Добро пожаловать</Text>
        <Text style={[courseStyles.muted, styles.center]}>Мобильная разработка · СВФУ · ИВТ-23-2</Text>
        <Pressable accessibilityRole="button" onPress={start} style={courseStyles.button}>
          <Text style={courseStyles.buttonText}>Начать</Text>
        </Pressable>
        {started && <Text accessibilityRole="alert" style={[courseStyles.text, styles.center]}>{welcomeMessage}</Text>}
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  welcome: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, marginTop: 24 },
  center: { textAlign: 'center' },
});
