import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPostDate, getPosts, type Post } from '../api';
import Icon from '../components/Icon';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';
import PostComposer from './PostComposer';
import { usePostRequest } from './usePostRequest';

export default function PostsScreen() {
  const { result, retry } = usePostRequest(getPosts);
  const [composing, setComposing] = useState(false);
  const [published, setPublished] = useState(false);
  const list = useRef<FlatList<Post>>(null);
  const loading = result.status === 'loading';
  const initialLoad = loading && result.data === undefined;
  const refreshing = loading && !initialLoad;

  function refresh() {
    if (loading) return;
    setPublished(false);
    retry();
  }

  function showPublished(post: Post) {
    setComposing(false);
    setPublished(true);
    retry((posts) => [post, ...(posts ?? []).filter(({ id }) => id !== post.id)]);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <FlatList
        ref={list}
        data={result.data}
        keyExtractor={(post) => String(post.id)}
        contentContainerStyle={styles.list}
        alwaysBounceVertical
        refreshControl={Platform.OS === 'web' ? undefined : (
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.green}
            colors={[colors.green]} progressBackgroundColor={colors.paper} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text accessibilityRole="header" style={courseStyles.title}>Посты</Text>
              <Text style={courseStyles.muted}>Лента курса</Text>
            </View>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={() => setComposing(true)}
                style={({ pressed }) => [courseStyles.button, pressed && courseStyles.dimmed]}>
                <Icon name="plus" color={colors.paper} size={20} />
                <Text style={courseStyles.buttonText}>Новый пост</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Обновить ленту" disabled={loading}
                onPress={refresh} style={({ pressed }) => [courseStyles.iconButton, pressed && courseStyles.dimmed]}>
                {refreshing && Platform.OS === 'web'
                  ? <ActivityIndicator color={colors.green} />
                  : <Icon name="refresh" color={loading ? colors.muted : colors.green} />}
              </Pressable>
            </View>
            {published && (
              <View accessibilityLiveRegion="polite" style={styles.confirmation}>
                <Icon name="check" color={colors.green} size={20} />
                <Text style={courseStyles.label}>Пост опубликован</Text>
              </View>
            )}
            {result.status === 'error' && (
              <View style={courseStyles.card}>
                <Text accessibilityRole="alert" style={courseStyles.error}>{result.message}</Text>
                {result.data === undefined && (
                  <Pressable accessibilityRole="button" onPress={refresh} style={courseStyles.button}>
                    <Text style={courseStyles.buttonText}>Повторить</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={initialLoad ? (
          <View accessibilityLiveRegion="polite" style={styles.status}>
            <ActivityIndicator color={colors.green} />
            <Text style={courseStyles.muted}>Загрузка постов…</Text>
          </View>
        ) : result.status === 'success' ? (
          <Text style={[courseStyles.card, courseStyles.muted]}>Постов пока нет.</Text>
        ) : null}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/posts/[id]', params: { id: String(item.id) } }} asChild>
            <Pressable accessibilityRole="link">
              {({ pressed }) => (
                <View style={[courseStyles.card, pressed && courseStyles.dimmed]}>
                  <View style={styles.postHeader}>
                    <Text style={[courseStyles.heading, styles.postTitle]} numberOfLines={2}>{item.title}</Text>
                    <Icon name="arrow" color={colors.green} size={19} />
                  </View>
                  <Text style={courseStyles.text} numberOfLines={3}>{item.content}</Text>
                  <Text style={courseStyles.muted}>{formatPostDate(item.created_at)}</Text>
                </View>
              )}
            </Pressable>
          </Link>
        )}
      />
      <PostComposer visible={composing} onClose={() => setComposing(false)} onPublished={showPublished} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', backgroundColor: colors.background },
  header: { gap: 16, marginBottom: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  confirmation: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.mint, borderRadius: 14, padding: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  postTitle: { flex: 1 },
  status: { alignItems: 'center', padding: 20, gap: 8 },
  list: { flexGrow: 1, alignSelf: 'center', width: '100%', maxWidth: 640, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26, gap: 12 },
});
