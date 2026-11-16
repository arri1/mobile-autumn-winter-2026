import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme';

// Лаба TextInput: controlled-поле (value + onChangeText). Спека: SPECS/lab-textinput.md
export default function NameScreen() {
  const [name, setName] = useState('');
  const trimmed = name.trim();

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
          placeholderTextColor={colors.disabled}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={40}
        />
        <Text style={styles.hello}>{trimmed ? `Привет, ${trimmed}!` : 'Привет!'}</Text>
        <Text style={styles.counter}>{name.length} / 40</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  label: { fontSize: 18, color: colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  hello: { fontSize: 22, fontWeight: '600', color: colors.text },
  counter: { marginTop: 8, fontSize: 12, color: colors.textSecondary },
});
