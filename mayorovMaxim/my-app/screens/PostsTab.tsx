import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPosts, deletePost, Post } from '../api';

export default function PostsTab() {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  function confirmDelete(id: number, title: string) {
    Alert.alert(
      'Удалить пост?',
      `«${title}» будет удалён без возможности восстановления.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(id);
              setPosts((prev) => prev.filter((p) => p.id !== id));
            } catch (e) {
              Alert.alert(
                'Ошибка',
                e instanceof Error ? e.message : 'Не удалось удалить'
              );
            }
          },
        },
      ]
    );
  }

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
        <Pressable style={styles.btn} onPress={load}>
          <Text style={styles.btnText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Pressable
        style={styles.createBtn}
        onPress={() => navigation.navigate('PostCreate')}
      >
        <Text style={styles.createBtnText}>+ Создать пост</Text>
      </Pressable>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Постов нет</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() => navigation.navigate('PostView', { id: item.id })}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleString('ru-RU')}
              </Text>
            </Pressable>

            <View style={styles.actions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() =>
                  navigation.navigate('PostEdit', { id: item.id })
                }
              >
                <Text style={styles.actionEdit}>Редактировать</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() => confirmDelete(item.id, item.title)}
              >
                <Text style={styles.actionDelete}>Удалить</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  card: { backgroundColor: '#f4f4f5', borderRadius: 12, padding: 14 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  content: { fontSize: 15, color: '#333' },
  date: { fontSize: 12, color: '#888', marginTop: 8 },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  actionBtn: { paddingVertical: 4 },
  actionEdit: { color: '#2563eb', fontWeight: '600' },
  actionDelete: { color: '#c00', fontWeight: '600' },
  error: { color: '#c00', marginBottom: 12, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  btn: { backgroundColor: '#111', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  createBtn: {
    backgroundColor: '#111',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});