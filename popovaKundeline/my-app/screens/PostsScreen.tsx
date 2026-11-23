import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Button,
    SafeAreaView,
    Pressable,
    Alert,
    RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getPosts, deletePost, Post } from '../api';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PostsList'>;

export default function PostsScreen({ navigation }: Props) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async (showLoader = true) => {
        if (showLoader) setIsLoading(true);
        setError(null);
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Первичная загрузка
    useEffect(() => {
        fetchPosts();
    }, []);

    // Перезагрузка при возврате на экран (после создания/редактирования)
    useFocusEffect(
        useCallback(() => {
            fetchPosts(false);
        }, [])
    );

    // Кнопка "Создать" в шапке
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Создать"
                    onPress={() => navigation.navigate('PostForm')}
                />
            ),
        });
    }, [navigation]);

    // Pull-to-refresh
    const onRefresh = () => {
        setIsRefreshing(true);
        fetchPosts(false);
    };

    // Удаление поста с подтверждением
    const handleDelete = (id: number) => {
        Alert.alert(
            'Удалить пост?',
            'Это действие нельзя отменить',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePost(id);
                            setPosts(prev => prev.filter(p => p.id !== id));
                        } catch (err) {
                            Alert.alert(
                                'Ошибка',
                                err instanceof Error ? err.message : 'Не удалось удалить пост'
                            );
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Произошла ошибка:</Text>
                <Text style={styles.errorDetails}>{error}</Text>
                <Button title="Повторить" onPress={() => fetchPosts()} />
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => navigation.navigate('PostView', { id: item.id })}
                    >
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.content} numberOfLines={3}>
                            {item.content}
                        </Text>
                        <Text style={styles.date}>{formatDate(item.created_at)}</Text>

                        <View style={styles.cardActions}>
                            <Button
                                title="Ред."
                                onPress={() =>
                                    navigation.navigate('PostForm', { id: item.id })
                                }
                            />
                            <Button
                                title="Удалить"
                                color="#d9534f"
                                onPress={() => handleDelete(item.id)}
                            />
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Постов нет</Text>
                        <Button
                            title="Создать первый пост"
                            onPress={() => navigation.navigate('PostForm')}
                        />
                    </View>
                }
                contentContainerStyle={posts.length === 0 ? { flex: 1 } : styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
    content: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 20,
    },
    date: {
        fontSize: 11,
        color: '#999999',
        textAlign: 'right',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        marginBottom: 4,
    },
    errorDetails: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#888888',
    },
});