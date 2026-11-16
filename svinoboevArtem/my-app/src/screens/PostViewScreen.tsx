import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deletePost, formatDate, getPost, isMyPost, type Post } from '../api';
import { Button } from '../components';
import { colors } from '../theme';
import type { PostsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PostsStackParamList, 'PostView'>;

// Лаба «Просмотр одного поста»: GET /posts/{id}. Спека: SPECS/lab-post-view.md
export default function PostViewScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Отдельный запрос по id (не берём данные из списка). Зависимость [id]: другой пост — новый запрос.
  // isFocused — чтобы после редактирования вернуться на свежие данные.
  useEffect(() => {
    if (!isFocused) return;
    let cancelled = false;

    async function load() {
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
    // cleanup: если ушли до ответа сервера, не трогаем state
    return () => {
      cancelled = true;
    };
  }, [id, isFocused]);

  function confirmDelete() {
    Alert.alert('Удалить пост?', 'Действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deletePost(id);
            navigation.goBack();
          } catch (e) {
            setDeleting(false);
            Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось удалить');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Пост не найден'}</Text>
        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const edited = post.updated_at !== post.created_at;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>
        {formatDate(post.created_at)}
        {edited ? ` · изменён ${formatDate(post.updated_at)}` : ''}
      </Text>
      <Text style={styles.content}>{post.content}</Text>

      {isMyPost(post) && (
        <View style={styles.actions}>
          <Button
            title="Изменить"
            variant="secondary"
            disabled={deleting}
            onPress={() => navigation.navigate('PostForm', { id: post.id })}
          />
          <Button
            title={deleting ? 'Удаление…' : 'Удалить'}
            variant="danger"
            disabled={deleting}
            onPress={confirmDelete}
          />
        </View>
      )}
    </ScrollView>
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
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.textSecondary },
  content: { fontSize: 16, lineHeight: 24, color: colors.text },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  error: { color: colors.danger, marginBottom: 12, textAlign: 'center' },
});
