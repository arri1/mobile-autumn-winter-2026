import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createPost, type Post } from '../api';
import Icon from '../components/Icon';
import { student } from '../student';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';

export default function PostComposer({ visible, onClose, onPublished }: {
  visible: boolean;
  onClose: () => void;
  onPublished: (post: Post) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const contentInput = useRef<TextInput>(null);
  const canSubmit = Boolean(title.trim() && content.trim() && !submitting);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);

  function close() {
    if (request.current) return;
    setError('');
    onClose();
  }

  async function publish() {
    if (!canSubmit || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 12000);
    const prefix = `${student.lastName}: `;
    const heading = title.trim();
    setSubmitting(true);
    setError('');

    try {
      const post = await createPost(heading.startsWith(prefix) ? heading : prefix + heading, content.trim(), controller.signal);
      if (request.current !== controller) return;
      setTitle('');
      setContent('');
      onPublished(post);
    } catch (cause) {
      if (request.current !== controller) return;
      const message = controller.signal.aborted
        ? 'Сервер долго отвечает. Проверь ленту перед повторной отправкой.'
        : cause instanceof Error && !(cause instanceof TypeError)
          ? cause.message
          : 'Связь с сервером прервалась. Проверь ленту перед повторной отправкой.';
      setError(message);
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setSubmitting(false);
      }
    }
  }

  return (
    <Modal visible={visible} animationType={Platform.OS === 'web' ? 'none' : 'slide'} onRequestClose={close}>
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
            <View style={styles.form} accessibilityViewIsModal>
              <View style={styles.header}>
                <Text accessibilityRole="header" style={[courseStyles.title, styles.headerTitle]}>Новый пост</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Закрыть форму" disabled={submitting}
                  onPress={close} style={({ pressed }) => [courseStyles.iconButton, (pressed || submitting) && courseStyles.dimmed]}>
                  <Icon name="close" color={colors.ink} />
                </Pressable>
              </View>
              <View style={styles.field}>
                <Text style={courseStyles.label}>Заголовок</Text>
                <TextInput accessibilityLabel="Заголовок" value={title} onChangeText={setTitle}
                  placeholder="О чём твой пост?" placeholderTextColor={colors.muted}
                  editable={!submitting} returnKeyType="next" submitBehavior="submit"
                  onSubmitEditing={() => contentInput.current?.focus()} style={courseStyles.input} />
                <Text style={courseStyles.muted}>Фамилия добавится в заголовок автоматически.</Text>
              </View>
              <View style={styles.field}>
                <Text style={courseStyles.label}>Текст поста</Text>
                <TextInput ref={contentInput} accessibilityLabel="Текст поста" value={content} onChangeText={setContent}
                  placeholder="Напиши сообщение…" placeholderTextColor={colors.muted} editable={!submitting}
                  multiline textAlignVertical="top" style={[courseStyles.input, styles.content]} />
              </View>
              {error ? <Text accessibilityRole="alert" style={courseStyles.error}>{error}</Text> : null}
              <Pressable accessibilityRole="button" disabled={!canSubmit} accessibilityState={{ disabled: !canSubmit, busy: submitting }}
                onPress={publish} style={({ pressed }) => [courseStyles.button, (!canSubmit || pressed) && courseStyles.dimmed]}>
                {submitting && <ActivityIndicator color={colors.paper} />}
                <Text style={courseStyles.buttonText}>{submitting ? 'Публикуем…' : 'Опубликовать'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  form: { alignSelf: 'center', width: '100%', maxWidth: 600, gap: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerTitle: { flexShrink: 1 },
  field: { gap: 7 },
  content: { minHeight: 170 },
});
