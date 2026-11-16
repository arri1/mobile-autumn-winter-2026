import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPosts, type Post } from '../api';
import type { LabsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<LabsStackParamList, 'Posts'>;

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU');
}

export function PostsScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  const loadPosts = useCallback(async (isRefresh = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    if (isRefresh) setRefreshing(true);

    try {
      const data = await getPosts(controller.signal);
      if (!controller.signal.aborted) setPosts(data);
    } catch (requestError) {
      if (!controller.signal.aborted) {
        setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить посты');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
        activeRequest.current = null;
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return loadPosts();
    });
    return () => {
      cancelled = true;
      activeRequest.current?.abort();
    };
  }, [loadPosts]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#176b57" /><Text style={styles.statusText}>Загружаем посты…</Text></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Не получилось загрузить посты</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={() => { setError(null); setLoading(true); void loadPosts(); }} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => String(post.id)}
      contentContainerStyle={posts.length ? styles.list : styles.emptyList}
      refreshing={refreshing}
      onRefresh={() => { setError(null); void loadPosts(true); }}
      ListHeaderComponent={<Text style={styles.listIntro}>Публикации учебного сервера</Text>}
      ListEmptyComponent={<Text style={styles.emptyText}>Постов пока нет.</Text>}
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" accessibilityLabel={`Открыть пост: ${item.title}`} onPress={() => navigation.navigate('PostView', { id: item.id })} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardContent} numberOfLines={4}>{item.content}</Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#f7f5ee' },
  statusText: { color: '#68716b', fontSize: 14, marginTop: 12 },
  errorTitle: { color: '#202b26', fontSize: 19, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  errorMessage: { color: '#a13e35', fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 18 },
  retryButton: { backgroundColor: '#176b57', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  retryText: { color: '#fffefa', fontWeight: '700' },
  pressed: { opacity: 0.75 },
  list: { padding: 16, gap: 12, backgroundColor: '#f7f5ee' },
  emptyList: { flexGrow: 1, padding: 16, backgroundColor: '#f7f5ee' },
  listIntro: { color: '#68716b', fontSize: 14, marginBottom: 4 },
  emptyText: { color: '#68716b', fontSize: 15, textAlign: 'center', marginTop: 48 },
  card: { backgroundColor: '#fffefa', borderRadius: 18, borderWidth: 1, borderColor: '#e9e7df', padding: 16 },
  cardTitle: { color: '#202b26', fontSize: 17, fontWeight: '700', lineHeight: 23, marginBottom: 8 },
  cardContent: { color: '#68716b', fontSize: 14, lineHeight: 21 },
  date: { color: '#8a908a', fontSize: 12, marginTop: 12 },
});
