import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { getPosts, Post } from '../src/api';
import { useNavigation } from '@react-navigation/native';

export default function PostsScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

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
            <Pressable style={styles.btn} onPress={load}>
            <Text style={styles.btnText}>Повторить</Text>
            </Pressable>
        </View>
        );
    }

    return (
        <FlatList
            refreshing={refreshing}
            onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
            }}
        data={posts}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Постов нет</Text>}
        renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => navigation.navigate('PostView', { id: item.id })}
>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleString('ru-RU')}</Text>
            </Pressable>
        )}
        />
    );
    }

    const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    list: { padding: 16, gap: 12 },
    card: { backgroundColor: '#f4f4f5', borderRadius: 12, padding: 14 },
    title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
    content: { fontSize: 15, color: '#333' },
    date: { fontSize: 12, color: '#888', marginTop: 8 },
    error: { color: '#c00', marginBottom: 12, textAlign: 'center' },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
    btn: { backgroundColor: '#111', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
    btnText: { color: '#fff', fontWeight: '600' },
    });