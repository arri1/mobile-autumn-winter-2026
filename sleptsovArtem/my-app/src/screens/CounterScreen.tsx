import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CounterScreen = () => {
    const [count, setCount] = useState(0);
    const handleIncrement = () => {
        setCount(count + 1);
    };
    const handleDecrement = () => {
        setCount(count - 1);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Счётчик</Text>
            <Text style={styles.count}>{count}</Text>
            <Pressable onPress={handleIncrement} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>
            <Pressable onPress={handleDecrement} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    count: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default CounterScreen;