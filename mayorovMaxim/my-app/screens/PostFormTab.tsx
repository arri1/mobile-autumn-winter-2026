import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { getPost, createPost, updatePost, Post } from '../api';

export default function PostFormTab({ route, navigation }: any) {
  const id = route.params?.id as number | undefined;
  const isEdit = id != null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const p = await getPost(id!);
        setTitle(p.title);
        setContent(p.content);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  async function save() {
    if (!title.trim()) {
      Alert.alert('Введите заголовок');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updatePost(id!, { title: title.trim(), content: content.trim() });
      } else {
        await createPost({ title: title.trim(), content: content.trim() });
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <View style={styles.center}><Text>Загрузка…</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Заголовок</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок поста"
      />
      <Text style={styles.label}>Содержание</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={content}
        onChangeText={setContent}
        placeholder="Текст поста"
        multiline
        numberOfLines={6}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.btn} onPress={save} disabled={saving}>
        <Text style={styles.btnText}>{saving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Создать'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 16, gap: 8 },
  label: { fontSize: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 12, fontSize: 16 },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  error: { color: '#c00', marginTop: 8 },
  btn: { backgroundColor: '#111', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});