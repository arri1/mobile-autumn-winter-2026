import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { createPost, updatePost, Post } from '../api';

export default function CreatePostScreen({ route, navigation }: any) {
  const editing: Post | undefined = route.params?.post;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const t = title.trim();
    const c = content.trim();

    if (!t || !c) {
      setError('Заполните заголовок и текст поста');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updatePost(editing.id, t, c);
      } else {
        await createPost(t, c);
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось сохранить');
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Заголовок</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Введите заголовок"
          editable={!saving}
        />

        <Text style={styles.label}>Текст</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={content}
          onChangeText={setContent}
          placeholder="Введите текст поста"
          multiline
          textAlignVertical="top"
          editable={!saving}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {editing ? 'Сохранить' : 'Опубликовать'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: {
    minHeight: 160,
  },
  error: {
    color: '#c00',
    fontSize: 15,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
