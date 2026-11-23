// screens/PostFormScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, Button,
    ActivityIndicator, SafeAreaView, Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createPost, updatePost, getPost } from '../api';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PostForm'>;

export default function PostFormScreen({ route, navigation }: Props) {
    const postId = route.params?.id; // Если есть id — режим редактирования
    const isEditing = postId !== undefined;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(isEditing); // Грузим данные только при редактировании
    const [isSaving, setIsSaving] = useState(false);

    // При редактировании загружаем текущие данные поста
    useEffect(() => {
        if (isEditing) {
            const loadPost = async () => {
                try {
                    const data = await getPost(postId);
                    setTitle(data.title);
                    setContent(data.content);
                } catch (err) {
                    Alert.alert('Ошибка', 'Не удалось загрузить пост');
                    navigation.goBack();
                } finally {
                    setIsLoading(false);
                }
            };
            loadPost();
        }
    }, [isEditing, postId]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Ошибка', 'Заполните заголовок и содержание');
            return;
        }
        setIsSaving(true);
        try {
            if (isEditing) {
                await updatePost(postId, { title, content });
            } else {
                await createPost({ title, content });
            }
            navigation.goBack(); // Возвращаемся к списку
        } catch (err) {
            Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось сохранить');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Заголовок</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Введите заголовок"
                />
                <Text style={styles.label}>Содержание</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Введите текст поста"
                    multiline
                />
                <Button
                    title={isSaving ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Создать пост')}
                    onPress={handleSave}
                    disabled={isSaving}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    form: { padding: 16 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        padding: 10, marginBottom: 16, fontSize: 16,
    },
    textArea: { height: 150, textAlignVertical: 'top' },
});