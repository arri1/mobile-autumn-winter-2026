import { useCallback, useState } from 'react';
import {View,Text,FlatList,ActivityIndicator,Pressable,StyleSheet,Modal,TextInput,Alert} from 'react-native';
import { getPosts, createPost, Post } from '../src/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function PostsScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

  // Состояния для модального окна создания поста
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [creating, setCreating] = useState(false);

    const navigation = useNavigation<any>();

    async function load(showLoader = true) {
        if (showLoader) setLoading(true);
        setError(null);
        try {
        const data = await getPosts();
        setPosts(data);
        } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось загрузить');
        } finally {
        if (showLoader) setLoading(false);
        }
    }

    // Обновляем список каждый раз при фокусе на экране (в т.ч. после редактирования в PostView)
    useFocusEffect(
        useCallback(() => {
        load(posts.length === 0);
        }, [])
    );

    async function handleCreate() {
        if (!title.trim() || !content.trim()) {
        Alert.alert('Ошибка', 'Заполните заголовок и текст поста');
        return;
        }

        setCreating(true);
        try {
        const newPost = await createPost({
            title: title.trim(),
            content: content.trim(),
        });
        setPosts((prev) => [newPost, ...prev]); // Добавляем новый пост в начало списка
        setTitle('');
        setContent('');
        setModalVisible(false);
        } catch (e) {
        Alert.alert('Ошибка', e instanceof Error ? e.message : 'Не удалось создать пост');
        } finally {
        setCreating(false);
        }
    }

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
            <Pressable style={styles.btn} onPress={() => load()}>
            <Text style={styles.btnText}>Повторить</Text>
            </Pressable>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <FlatList
            refreshing={refreshing}
            onRefresh={async () => {
            setRefreshing(true);
            await load(false);
            setRefreshing(false);
            }}
            data={posts}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
            <Pressable style={styles.createBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.btnText}>+ Новый пост</Text>
            </Pressable>
            }
            ListEmptyComponent={<Text style={styles.empty}>Постов нет</Text>}
            renderItem={({ item }) => (
            <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('PostView', { id: item.id })}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleString('ru-RU')}</Text>
            </Pressable>
            )}
        />

        {/* Модальное окно создания поста */}
        <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Новый пост</Text>

                <TextInput
                style={styles.input}
                placeholder="Заголовок"
                value={title}
                onChangeText={setTitle}
                editable={!creating}
                />

                <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Текст поста"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                editable={!creating}
                />

                <View style={styles.modalActions}>
                <Pressable
                    style={[styles.btn, styles.cancelBtn]}
                    onPress={() => setModalVisible(false)}
                    disabled={creating}
                >
                    <Text style={styles.cancelBtnText}>Отмена</Text>
                </Pressable>

                <Pressable style={styles.btn} onPress={handleCreate} disabled={creating}>
                    <Text style={styles.btnText}>{creating ? 'Сохранение...' : 'Создать'}</Text>
                </Pressable>
                </View>
            </View>
            </View>
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#fff' },
center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
list: { padding: 16, gap: 12 },
createBtn: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 4,
},
card: { backgroundColor: '#f4f4f5', borderRadius: 12, padding: 14 },
title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
content: { fontSize: 15, color: '#333' },
date: { fontSize: 12, color: '#888', marginTop: 8 },
error: { color: '#c00', marginBottom: 12, textAlign: 'center' },
empty: { textAlign: 'center', color: '#888', marginTop: 40 },
btn: { backgroundColor: '#111', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
btnText: { color: '#fff', fontWeight: '600' },

// Стили модального окна
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
},
modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
},
modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
},
textArea: {
    height: 110,
},
modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
},
cancelBtn: {
    backgroundColor: '#e4e4e7',
},
cancelBtnText: {
    color: '#111',
    fontWeight: '600',
},
});
