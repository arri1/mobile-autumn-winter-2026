import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AUTHOR_TAG, createPost, getPost, updatePost } from '../api';
import { Button } from '../components';
import { colors } from '../theme';
import type { PostsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<PostsStackParamList, 'PostForm'>;

// Создание (POST) и редактирование (PUT) поста. Спеки: SPECS/lab-create-post.md, SPECS/lab-edit-post.md
export default function PostFormScreen({ route, navigation }: Props) {
  const id = route.params?.id;
  const isEdit = id !== undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [sending, setSending] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Редактирование' : 'Новый пост' });
  }, [navigation, isEdit]);

  // В режиме редактирования подставляем текущие значения с сервера.
  useEffect(() => {
    if (id === undefined) return;
    let cancelled = false;
    getPost(id)
      .then((post) => {
        if (cancelled) return;
        setTitle(post.title);
        setContent(post.content);
      })
      .catch((e) => {
        if (cancelled) return;
        Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось загрузить');
        navigation.goBack();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigation]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !sending;

  async function submit() {
    if (!canSubmit) return;
    // База общая: в заголовке должна быть фамилия, чтобы было видно, чей пост.
    const cleanTitle = title.trim();
    const input = {
      title: cleanTitle.includes(AUTHOR_TAG) ? cleanTitle : `${cleanTitle} · ${AUTHOR_TAG}`,
      content: content.trim(),
    };

    setSending(true);
    try {
      if (isEdit) {
        await updatePost(id, input);
        Alert.alert('Готово', 'Пост обновлён');
      } else {
        await createPost(input);
        setTitle('');
        setContent('');
        Alert.alert('Готово', 'Пост опубликован');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Заголовок</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="О чём пост"
          placeholderTextColor={colors.disabled}
          maxLength={120}
          editable={!sending}
        />
        <Text style={styles.hint}>Фамилия «{AUTHOR_TAG}» добавится к заголовку автоматически.</Text>

        <Text style={styles.label}>Текст</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={content}
          onChangeText={setContent}
          placeholder="Текст поста"
          placeholderTextColor={colors.disabled}
          multiline
          textAlignVertical="top"
          editable={!sending}
        />

        <Button
          title={sending ? 'Отправка…' : isEdit ? 'Сохранить' : 'Опубликовать'}
          disabled={!canSubmit}
          onPress={submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: { padding: 16, gap: 8 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 160 },
  hint: { fontSize: 12, color: colors.textSecondary },
});
