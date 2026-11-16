import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPostDate, getPosts } from '../api';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';
import { usePostRequest } from './usePostRequest';

export default function PostsScreen() {
  const { result, retry } = usePostRequest(getPosts);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={courseStyles.title}>Посты</Text>
        <Text style={courseStyles.muted}>Публикации с сервера курса</Text>
      </View>
      {result.status === 'loading' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.green} />
          <Text style={courseStyles.muted}>Загрузка постов…</Text>
        </View>
      )}
      {result.status === 'error' && (
        <View style={[courseStyles.card, styles.status]}>
          <Text accessibilityRole="alert" style={courseStyles.text}>{result.message}</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={courseStyles.button}>
            <Text style={courseStyles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      )}
      {result.status === 'success' && (
        <FlatList
          data={result.data}
          keyExtractor={(post) => String(post.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={courseStyles.muted}>Постов пока нет.</Text>}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/posts/[id]', params: { id: String(item.id) } }} asChild>
              <Pressable accessibilityRole="link">
                <View style={courseStyles.card}>
                  <Text style={courseStyles.heading}>{item.title}</Text>
                  <Text style={courseStyles.muted}>{formatPostDate(item.created_at)}</Text>
                  <Text style={courseStyles.text} numberOfLines={3}>{item.content}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', backgroundColor: colors.background },
  header: { alignSelf: 'center', width: '100%', maxWidth: 600, padding: 16, gap: 4 },
  status: { alignSelf: 'center', alignItems: 'center', padding: 16, gap: 8, marginHorizontal: 16 },
  list: { alignSelf: 'center', width: '100%', maxWidth: 600, paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
});
