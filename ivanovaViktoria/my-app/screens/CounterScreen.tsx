import { View, Text, StyleSheet , Pressable} from 'react-native';
import { useState } from 'react';

export default function CounterScreen() {
    const [count, setCount] = useState(0)
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cчётчик</Text>
            <Text style={styles.value}>{count}</Text>
            <View style={styles.buttons}>
                <Pressable 
                    style={styles.btn} 
                    onPress={() => setCount(c => c + 1)}>
                        <Text style={styles.btnText}>+</Text>
                </Pressable>
                <Pressable 
                    style={styles.btn} 
                    onPress={() => setCount(c => Math.max(0, c - 1))}>
                        <Text style={styles.btnText}>−</Text>
                </Pressable>
                <Pressable 
                    style={styles.btn} 
                    onPress={() => setCount(0)}>
                        <Text style={styles.btnText}>Reset</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF5EF',
        padding: 24,
    },
    buttons: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    btn: {
        backgroundColor: '#B7DEC5',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 16,
        marginTop: 12,
        minWidth: 100,
        alignItems: 'center',
    },
    btnText: {
        color: '#315B42',
        fontSize: 22,
        fontWeight: '700',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#426B55',
        marginBottom: 20,
    },
    value: {
        fontSize: 72,
        fontWeight: '700',
        color: '#5B9B75',
    },
});