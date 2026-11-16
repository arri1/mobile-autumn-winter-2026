import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPost, Post } from '../api';
import type { PostsStackParamList } from './PostsStack';

type Props = NativeStackScreenProps<PostsStackParamList, 'PostView'>;

export default function PostViewScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // флаг, чтобы не обновлять state, если ушли с экрана до ответа сервера
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPost(id);
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Не удалось загрузить');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>{new Date(post.created_at).toLocaleString('ru-RU')}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <Pressable style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Назад</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
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
  error: {
    color: '#c00',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#111',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
