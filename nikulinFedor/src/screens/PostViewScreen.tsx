import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { formatPostDate, getPost } from '../api';
import CampusScreen from '../components/CampusScreen';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';
import { usePostRequest } from './usePostRequest';

function PostContent({ id }: { id: number }) {
  const load = useCallback((signal: AbortSignal) => getPost(id, signal), [id]);
  const { result, retry } = usePostRequest(load);

  if (result.status === 'loading') {
    return (
      <View style={courseStyles.card} accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.green} />
        <Text style={courseStyles.muted}>Загрузка поста…</Text>
      </View>
    );
  }

  if (result.status === 'error') {
    return (
      <View style={courseStyles.card}>
        <Text accessibilityRole="alert" style={courseStyles.text}>{result.message}</Text>
        <Pressable accessibilityRole="button" onPress={retry} style={courseStyles.button}>
          <Text style={courseStyles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  const post = result.data;
  return (
    <View style={courseStyles.card}>
      <Text accessibilityRole="header" style={courseStyles.title}>{post.title}</Text>
      <Text style={courseStyles.muted}>{formatPostDate(post.created_at)}</Text>
      <Text selectable style={courseStyles.text}>{post.content}</Text>
    </View>
  );
}

export default function PostViewScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string }>();
  const id = typeof routeId === 'string' && /^\d+$/.test(routeId) ? Number(routeId) : NaN;

  return (
    <CampusScreen>
      <Pressable accessibilityRole="button" onPress={() => router.dismissTo('/posts')}>
        <Text style={courseStyles.link}>← К постам</Text>
      </Pressable>
      {Number.isSafeInteger(id) && id > 0 ? <PostContent key={id} id={id} /> : (
        <Text accessibilityRole="alert" style={courseStyles.text}>Неверный номер поста.</Text>
      )}
    </CampusScreen>
  );
}
