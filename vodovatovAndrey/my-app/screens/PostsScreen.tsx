import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getPosts, Post } from "../api";

export default function PostsScreen() {
  const navigation = useNavigation<any>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    try {
      setError("");
      setLoading(true);

      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      setError("Не удалось загрузить посты");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#171717" />
        <Text style={styles.message}>Загрузка постов...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error}</Text>

        <Pressable style={styles.button} onPress={loadPosts}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список постов</Text>
      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={styles.createButtonText}>+ Создать пост</Text>
      </Pressable>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.message}>Постов пока нет</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("PostView", { id: item.id })}
          >
            <Text style={styles.postTitle}>{item.title}</Text>

            <Text style={styles.content} numberOfLines={3}>
              {item.content}
            </Text>
          </Pressable>
        )}
      />
    </View>
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFD21F",
    borderWidth: 3,
    borderColor: "#171717",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
  },
  postTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: "#171717",
  },
  message: {
    fontSize: 17,
    color: "#171717",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#B8A1FF",
    borderWidth: 3,
    borderColor: "#171717",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#171717",
  },
  createButton: {
    backgroundColor: "#B8A1FF",
    borderWidth: 3,
    borderColor: "#111111",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  createButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111111",
  },
});
