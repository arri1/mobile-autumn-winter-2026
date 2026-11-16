import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPost, type Post } from '../api';
import type { LabsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<LabsStackParamList, 'PostView'>;

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU');
}

export function PostViewScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPost() {
      try {
        const data = await getPost(id, controller.signal);
        if (!controller.signal.aborted) setPost(data);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить пост');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadPost();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#176b57" /><Text style={styles.statusText}>Загружаем пост…</Text></View>;
  }
  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Не получилось открыть пост</Text>
        <Text style={styles.errorMessage}>{error ?? 'Пост не найден'}</Text>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backButtonText}>Назад к списку</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>ПОСТ #{post.id}</Text>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>{formatDate(post.created_at)}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#f7f5ee' },
  statusText: { color: '#68716b', fontSize: 14, marginTop: 12 },
  errorTitle: { color: '#202b26', fontSize: 19, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  errorMessage: { color: '#a13e35', fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 18 },
  backButton: { backgroundColor: '#176b57', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  backButtonText: { color: '#fffefa', fontWeight: '700' },
  pressed: { opacity: 0.75 },
  content: { padding: 24, backgroundColor: '#f7f5ee', flexGrow: 1 },
  eyebrow: { color: '#176b57', fontSize: 11, fontWeight: '800', letterSpacing: 1.3, marginBottom: 10 },
  title: { color: '#202b26', fontSize: 25, fontWeight: '800', lineHeight: 32 },
  date: { color: '#8a908a', fontSize: 12, marginTop: 12 },
  divider: { height: 1, backgroundColor: '#e2dfd4', marginVertical: 20 },
  body: { color: '#404a44', fontSize: 16, lineHeight: 26 },
});
