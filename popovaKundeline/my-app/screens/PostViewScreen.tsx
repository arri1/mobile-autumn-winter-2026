import React, { useEffect, useState } from 'react';
import { 
StyleSheet, 
Text, 
View, 
ActivityIndicator, 
Button, 
SafeAreaView, 
ScrollView 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPost, Post } from '../api'; 
import { RootStackParamList } from '../App'; 

// Типизируем пропсы текущего экрана
type Props = NativeStackScreenProps<RootStackParamList, 'PostView'>;

export default function PostViewScreen({ route, navigation }: Props) {
    const { id } = route.params; // Извлекаем переданный id из роута навигации
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getPost(id);
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить пост');
        } finally {
            setIsLoading(false);
        }
        };

        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
        );
    }

    if (error || !post) {
        return (
        <View style={styles.center}>
            <Text style={styles.errorText}>Произошла ошибка или пост не найден</Text>
            <Text style={styles.errorDetails}>{error}</Text>
            <Button title="Назад" onPress={() => navigation.goBack()} />
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
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.date}>{formatDate(post.created_at)}</Text>
            <Text style={styles.content}>{post.content}</Text>
            
            <View style={styles.buttonContainer}>
            <Button title="Назад" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        color: '#444444',
        lineHeight: 24,
        marginBottom: 30,
    },
    buttonContainer: {
        marginTop: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorDetails: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16,
        textAlign: 'center',
    },    
});
