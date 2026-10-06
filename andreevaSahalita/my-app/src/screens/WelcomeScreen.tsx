import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text>This is my app for the mobile development course.</Text>
            <Button title="Start" onPress={() => navigation.navigate('Counter')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});