import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function NameScreen() {
    const [name, setName] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.label}>What is your name?</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    autoCapitalize="words"
                />
                <Text style={styles.hello}>
                    {name.trim() ? `Hello, ${name.trim()}!` : 'Hello!'}
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    label: { fontSize: 18, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    hello: { fontSize: 22, fontWeight: '600' },
});