import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";

import { getPost, deletePost, Post } from "../api";

export default function PostViewScreen({ route, navigation }: any) {
  const id = route.params.id as number;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      try {
        setLoading(true);
        setError("");

        const data = await getPost(id);

        if (!cancelled) {
          setPost(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Не удалось загрузить пост",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#171717" />
        <Text style={styles.message}>Загрузка поста...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Пост не найден"}</Text>

        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  async function handleDelete() {
    if (!post) {
      return;
    }

    Alert.alert(
      "Удаление поста",
      "Ты действительно хочешь удалить этот пост?",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              setError("");

              await deletePost(post.id);

              navigation.goBack();
            } catch (e) {
              setLoading(false);
              setError("Не удалось удалить пост");
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>

      <Text style={styles.date}>
        {new Date(post.created_at).toLocaleDateString("ru-RU")}
      </Text>

      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.button, styles.editButton]}
            onPress={() =>
              navigation.navigate("EditPost", {
                id: post.id,
                title: post.title,
                content: post.content,
              })
            }
          >
            <Text style={styles.buttonText}>Изменить</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Удалить</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Назад</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF7",
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#FFFDF7",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#777777",
    marginBottom: 20,
  },
  content: {
    fontSize: 17,
    lineHeight: 26,
    color: "#171717",
    marginBottom: 24,
  },
  button: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#171717",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#171717",
  },
  error: {
    fontSize: 17,
    color: "#C62828",
    textAlign: "center",
  },
  message: {
    fontSize: 17,
    color: "#171717",
  },
  deleteButton: {
    backgroundColor: "#FF7777",
  },
  buttonContainer: {
    marginTop: "auto",
    paddingTop: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#FFD21F",
  },
  backButton: {
    width: "100%",
    backgroundColor: "#B8A1FF",
    borderWidth: 3,
    borderColor: "#171717",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
});
