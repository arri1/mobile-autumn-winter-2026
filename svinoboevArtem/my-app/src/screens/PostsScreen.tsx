import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDate, getPosts, isMyPost, type Post } from '../api';
import { Button } from '../components';
import { colors } from '../theme';
import type { PostsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PostsStackParamList, 'PostsList'>;

// Лаба «Просмотр списка постов»: GET /posts. Спека: SPECS/lab-posts.md
export default function PostsScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPosts(await getPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить');
    }
  }, []);

  async function firstLoad() {
    setLoading(true);
    await load();
    setLoading(false);
  }

  // fetch — в эффекте с [], а не в теле компонента: иначе setState → рендер → fetch → …
  useEffect(() => {
    firstLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // После создания/правки/удаления возвращаемся на список — тихо обновляем его.
  const skipFirstFocus = useRef(true);
  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (skipFirstFocus.current) {
        skipFirstFocus.current = false;
        return;
      }
      load();
    });
  }, [navigation, load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Повторить" onPress={firstLoad} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flex}
      data={posts}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <Button title="+ Новый пост" onPress={() => navigation.navigate('PostForm')} />
      }
      ListEmptyComponent={<Text style={styles.empty}>Постов нет</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => navigation.navigate('PostView', { id: item.id })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {isMyPost(item) && <Text style={styles.badge}>мой</Text>}
          </View>
          <Text style={styles.content} numberOfLines={3}>
            {item.content}
          </Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14 },
  pressed: { opacity: 0.7 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  badge: {
    fontSize: 12,
    color: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  content: { fontSize: 15, color: colors.text, opacity: 0.85 },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  error: { color: colors.danger, marginBottom: 12, textAlign: 'center' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
