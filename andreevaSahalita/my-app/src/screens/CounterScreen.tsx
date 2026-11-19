import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CounterScreen() {
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.countText}>Count:{count}</Text>
            <View style={styles.buttonContainer}>
                <Button title="+1" onPress={() => setCount(c => c + 1)} />
                <Button title="-1" onPress={() => setCount(c => Math.max(0, c - 1))} />
                <Button title="Reset" onPress={() => setCount(0)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    countText: { fontSize: 48, marginBottom: 20 },
    buttonContainer: { flexDirection: 'row', gap: 10 },
});