import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';

const WelcomeScreen = () => {
    const handleStart = () => {
        Alert.alert('my-app', 'Вы нажали кнопку');
    }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мобильная разработка</Text>
      <Text style={styles.subtitle}>Welcome to My App!</Text>
      <Text style={styles.subtitle}>Слепцов Артём</Text>
      <Pressable onPress={handleStart} style={styles.button}>
        <Text style={styles.buttonText}>Начать</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default WelcomeScreen;