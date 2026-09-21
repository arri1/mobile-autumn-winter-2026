
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>МОЙ КЛИКЕР</Text>

        <Text style={styles.subtitle}>Всего кликов</Text>

        <Text style={styles.counter}>{count}</Text>

        <Pressable
          style={styles.clickButton}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.clickButtonText}>КЛИК!</Text>
        </Pressable>

        <Pressable
          style={styles.resetButton}
          onPress={() => setCount(0)}
        >
          <Text style={styles.resetButtonText}>Сбросить</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101828',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#98A2B3',
    marginBottom: 8,
  },
  counter: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  clickButton: {
    backgroundColor: '#7F56D9',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 16,
    marginBottom: 16,
  },
  clickButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#98A2B3',
  },
});
