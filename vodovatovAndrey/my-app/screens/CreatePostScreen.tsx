import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

import { createPost } from "../api";

export default function CreatePostScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!title.trim() || !content.trim()) {
      setError("Заполни заголовок и текст");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await createPost(title, content);

      navigation.goBack();
    } catch (e) {
      setError("Не удалось создать пост");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создание поста</Text>

      <Text style={styles.label}>Заголовок</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Введите заголовок"
      />

      <Text style={styles.label}>Текст</Text>

      <TextInput
        style={[styles.input, styles.contentInput]}
        value={content}
        onChangeText={setContent}
        placeholder="Введите текст поста"
        multiline
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={styles.button}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Создание..." : "Создать пост"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF7",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 25,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#111111",
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    marginBottom: 20,
  },

  contentInput: {
    height: 180,
    textAlignVertical: "top",
  },

  error: {
    color: "#C62828",
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#FFD21F",
    borderWidth: 3,
    borderColor: "#111111",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111111",
  },
});
