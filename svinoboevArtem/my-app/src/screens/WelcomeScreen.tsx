import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Button } from '../components';
import { colors } from '../theme';
import type { TabParamList } from '../navigation/types';

export default function WelcomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать</Text>
      <Text style={styles.subtitle}>Свинобоев Артем · ИВТ-23-2</Text>
      <Text style={styles.text}>
        Учебное приложение курса «Разработка мобильных приложений»: каждая лаба — отдельная
        вкладка внизу.
      </Text>
      <Button title="Начать" onPress={() => navigation.navigate('Counter')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
