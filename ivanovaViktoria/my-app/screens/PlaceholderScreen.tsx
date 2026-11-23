import { View, Text, StyleSheet } from 'react-native';

export default function PlaceholderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Просто так</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF5EF',
    },
    text: {
        fontSize: 22,
        fontWeight: '600',
        color: '#426B55',
    },
});