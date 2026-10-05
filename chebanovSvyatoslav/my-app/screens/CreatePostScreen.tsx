import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createPost } from '../api';

export default function CreatePostScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      const created = await createPost({
        title: title.trim(),
        body: body.trim(),
        userId: 1,
      });
      Alert.alert('Готово', `Пост #${created.id} создан (на сервере не сохранится)`);
      setTitle('');
      setBody('');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось отправить');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Заголовок</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Например: Мой первый пост"
          editable={!submitting}
        />

        <Text style={styles.label}>Текст</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={body}
          onChangeText={setBody}
          placeholder="Напиши что-нибудь..."
          multiline
          numberOfLines={5}
          editable={!submitting}
        />

        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit || submitting}
          style={({ pressed }) => [
            styles.button,
            (!canSubmit || submitting) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Опубликовать</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#a8d5b5' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});