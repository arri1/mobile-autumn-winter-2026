import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPost, deletePost, Post } from '../api';

function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if ((globalThis as any).confirm('Удалить пост?')) onConfirm();
    return;
  }
  Alert.alert('Удалить пост?', 'Это действие нельзя отменить.', [
    { text: 'Отмена', style: 'cancel' },
    { text: 'Удалить', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function PostViewScreen({ route, navigation }: any) {
  const id = route.params.id as number;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        setError(null);
        try {
          const data = await getPost(id);
          if (!cancelled) setPost(data);
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : 'Не удалось загрузить');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      load();

      return () => {
        cancelled = true;
      };
    }, [id])
  );

  function handleDelete() {
    confirmDelete(async () => {
      setDeleting(true);
      try {
        await deletePost(id);
        navigation.goBack();
      } catch (e) {
        setDeleting(false);
        const msg = e instanceof Error ? e.message : 'Не удалось удалить';
        if (Platform.OS === 'web') (globalThis as any).alert(msg);
        else Alert.alert('Ошибка', msg);
      }
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Пост не найден'}</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>
        {new Date(post.created_at).toLocaleString('ru-RU')}
      </Text>
      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() => navigation.navigate('CreatePost', { post })}
          disabled={deleting}
        >
          <Text style={styles.buttonText}>Редактировать</Text>
        </Pressable>
        <Pressable
          style={[styles.deleteButton, deleting && styles.disabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Удалить</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    color: '#c00',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#111',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});