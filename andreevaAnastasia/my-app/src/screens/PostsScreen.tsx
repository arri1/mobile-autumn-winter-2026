import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPosts, Post } from '../api';
import type { PostsStackParamList } from './PostsStack';

export default function PostsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PostsStackParamList>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            setLoading(true);
            load();
          }}
        >
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={refresh}
      ListEmptyComponent={<Text style={styles.empty}>Постов нет</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('PostView', { id: item.id })}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content} numberOfLines={3}>
            {item.content}
          </Text>
          <Text style={styles.date}>{new Date(item.created_at).toLocaleString('ru-RU')}</Text>
        </Pressable>
      )}
    />
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
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111',
  },
  content: {
    fontSize: 15,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  error: {
    color: '#c00',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
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
