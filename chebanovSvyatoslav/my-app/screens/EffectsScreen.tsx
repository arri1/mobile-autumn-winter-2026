import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const FAKE_ITEMS = ['Первый элемент', 'Второй элемент', 'Третий элемент'];

export default function EffectsScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setItems([]);

    const timer = setTimeout(() => {
      setItems(FAKE_ITEMS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const reload = () => {
    setLoading(true);
    setItems([]);

    setTimeout(() => {
      setItems(FAKE_ITEMS);
      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f95dc" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <Pressable
        onPress={reload}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Перезагрузить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  list: { paddingBottom: 16 },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f2f4f7',
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: { fontSize: 16, color: '#222' },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.7 },
});