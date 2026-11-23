import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function WelcomeScreen({navigation}: any) {
    return (
        <View style={styles.container}> 
            <View style={styles.card}>
            <Text style={styles.subtitle}> 
                Добро пожаловать!
            </Text>
            <Text style={styles.subtitle}>
                Мобильная разработка
            </Text>
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('Counter')}
            >
            <Text style={styles.buttonText}>
                Начать
            </Text>
            </Pressable>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF5EF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#426B55',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#315B42',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#789684',
        marginBottom: 25,
    },
    button: {
        backgroundColor: '#B7DEC5',
        borderRadius: 14,
        paddingHorizontal: 32,
        paddingVertical: 14,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#315B42',
    },
});