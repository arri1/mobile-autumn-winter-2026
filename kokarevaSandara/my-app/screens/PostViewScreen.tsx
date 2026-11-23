import { useEffect, useState } from 'react';
import {View,Text,ActivityIndicator,Pressable,StyleSheet,TextInput,Alert,ScrollView} from 'react-native';
import { getPost, updatePost, deletePost, Post } from '../src/api';

export default function PostViewScreen({ route, navigation }: any) {
  const id = route.params.id as number;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для редактирования и удаления
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPost(id);
        if (!cancelled) {
          setPost(data);
          setEditTitle(data.title);
          setEditContent(data.content);
        }
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

  function startEditing() {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  }

  async function handleSave() {
    if (!post) return;
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert('Ошибка', 'Заголовок и текст поста не могут быть пустыми');
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePost(post.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setPost(updated);
      setIsEditing(false);
    } catch (e) {
      Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!post) return;
    Alert.alert(
      'Удаление поста',
      'Вы уверены, что хотите удалить этот пост?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deletePost(post.id);
              navigation.goBack(); // Возвращаемся к списку, он обновится автоматически
            } catch (e) {
              Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось удалить пост');
              setDeleting(false);
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

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Пост не найден'}</Text>
        <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  // Режим редактирования
  if (isEditing) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Заголовок</Text>
        <TextInput
          style={styles.input}
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="Заголовок"
          editable={!saving}
        />

        <Text style={styles.label}>Текст поста</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={editContent}
          onChangeText={setEditContent}
          placeholder="Текст поста"
          multiline
          textAlignVertical="top"
          editable={!saving}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => setIsEditing(false)}
            disabled={saving}
          >
            <Text style={styles.cancelBtnText}>Отмена</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={handleSave} disabled={saving}>
            <Text style={styles.btnText}>{saving ? 'Сохранение...' : 'Сохранить'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Режим просмотра
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>
        Создано: {new Date(post.created_at).toLocaleString('ru-RU')}
      </Text>
      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.footer}>
        <Pressable style={styles.btn} onPress={startEditing} disabled={deleting}>
          <Text style={styles.btnText}>Редактировать</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.deleteBtn]}
          onPress={confirmDelete}
          disabled={deleting}
        >
          <Text style={styles.btnText}>{deleting ? 'Удаление...' : 'Удалить'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    container: { flexGrow: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: '700' },
    date: { fontSize: 12, color: '#888' },
    content: { fontSize: 16, lineHeight: 24, color: '#222' },
    error: { color: '#c00', marginBottom: 12, textAlign: 'center' },
    footer: { flexDirection: 'row', gap: 10, marginTop: 16 },

    // Стили формы редактирования
    label: { fontSize: 14, fontWeight: '600', color: '#444' },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
    },
    textArea: {
      minHeight: 160,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8,
    },
    btn: { backgroundColor: '#111', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
    btnText: { color: '#fff', fontWeight: '600' },
    cancelBtn: { backgroundColor: '#e4e4e7' },
    cancelBtnText: { color: '#111', fontWeight: '600' },
    deleteBtn: { backgroundColor: '#dc2626' },
});
