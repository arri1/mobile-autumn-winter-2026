import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimerScreen() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Seconds on screen</Text>
            <Text style={styles.value}>{seconds}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 16, color: '#666', marginBottom: 8 },
    value: { fontSize: 48, fontWeight: '700' },
});