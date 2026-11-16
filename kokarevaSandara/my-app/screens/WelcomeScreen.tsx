import { View, Text, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useState } from 'react';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Как тебя зовут?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Имя"
          autoCapitalize="words"
        />
        <Text style={styles.hello}>
          {name.trim() ? `Добро пожаловать, ${name.trim()}!` : 'Добро пожаловать!'}
        </Text>
        <Text style={styles.subtitle}>Мобильная разработка · СВФУ</Text>
        <Pressable style={styles.button} onPress={() => Alert.alert('Поехали')}>
          <Text style={styles.buttonText}>Начать</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  button: {
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  flex: { flex: 1 },
  label: { fontSize: 18, marginBottom: 8 },
  hello: { fontSize: 22, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
});