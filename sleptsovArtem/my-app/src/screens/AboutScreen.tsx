import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>О приложении</Text>
            <Text style={styles.description}>
                Это приложение было создано для демонстрации навыков мобильной разработки с использованием React Native.
            </Text>
            <Text style={styles.description}>
                Автор: Слепцов Артём, группа Б-ФИИТ-23
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});
