import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getPosts, Post } from '../api';

type RootStackParamList = {
  PostDetail: { id: number; title: string };
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PostsScreen() {
  const navigation = useNavigation<Nav>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getPosts(20);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.muted}>Загрузка постов...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Ошибка: {error}</Text>
        <Pressable style={styles.button} onPress={onRefresh}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Пока нет постов</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() =>
            navigation.navigate('PostDetail', { id: item.id, title: item.title })
          }
        >
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardBody} numberOfLines={3}>
            {item.body}
          </Text>
          <Text style={styles.cardId}>#{item.id}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  muted: { marginTop: 12, color: '#666', fontSize: 16 },
  error: { color: '#c0392b', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  list: { padding: 16, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e8ec',
  },
  pressed: { opacity: 0.7 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 6 },
  cardBody: { fontSize: 14, color: '#555', marginBottom: 8 },
  cardId: { fontSize: 12, color: '#999' },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});