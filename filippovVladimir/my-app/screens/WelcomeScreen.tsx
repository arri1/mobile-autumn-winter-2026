import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export function WelcomeScreen() {
  const [name, setName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const displayName = name.trim();

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.topRow}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
        <Text style={styles.topLabel}>УЧЕБНОЕ ПРИЛОЖЕНИЕ</Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.illustration}>
          <View style={styles.sun} />
          <View style={styles.card}>
            <View style={styles.cardLineShort} />
            <View style={styles.cardLine} />
            <View style={styles.cardDot}><Text style={styles.cardDotText}>✓</Text></View>
          </View>
          <View style={styles.sparkle}><Text style={styles.sparkleText}>✦</Text></View>
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>ТВОЙ ПУТЬ В РАЗРАБОТКУ</Text>
          <Text style={styles.title}>{displayName ? `Привет, ${displayName}!` : 'Добро пожаловать!'}</Text>
          <Text style={styles.subtitle}>Изучай мобильную разработку, создавая своё первое приложение.</Text>
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.inputLabel}>Как тебя зовут?</Text>
          <TextInput accessibilityLabel="Ваше имя" autoCapitalize="words" onChangeText={setName} placeholder="Имя" placeholderTextColor="#8a908a" returnKeyType="done" style={styles.input} value={name} />
        </View>
        <View style={styles.actionArea}>
          {hasStarted ? <Text style={styles.confirmation} accessibilityLiveRegion="polite">Отличное начало! Загляни во вкладку «Лабы».</Text> : null}
          <Pressable accessibilityRole="button" onPress={() => setHasStarted((started) => !started)} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>{hasStarted ? 'Начать заново' : 'Начать'}</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
          <Text style={styles.footer}>React Native · Expo · TypeScript</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, backgroundColor: '#f7f5ee', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#176b57', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#fffefa', fontSize: 18, fontWeight: '800' },
  topLabel: { color: '#666e67', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  hero: { flexGrow: 1, justifyContent: 'center', paddingVertical: 18 },
  illustration: { height: 150, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  sun: { position: 'absolute', width: 132, height: 132, borderRadius: 66, backgroundColor: '#e7edcf', transform: [{ translateY: 4 }] },
  card: { width: 112, height: 132, borderRadius: 20, backgroundColor: '#fffefa', alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 17, shadowColor: '#294b3f', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5, transform: [{ rotate: '-6deg' }] },
  cardLineShort: { width: 38, height: 7, borderRadius: 4, backgroundColor: '#e7b36b', marginBottom: 12 },
  cardLine: { width: 74, height: 8, borderRadius: 5, backgroundColor: '#dce6dc', marginBottom: 7 },
  cardDot: { position: 'absolute', right: 12, bottom: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: '#176b57', alignItems: 'center', justifyContent: 'center' },
  cardDotText: { color: '#fffefa', fontSize: 17, fontWeight: '700' },
  sparkle: { position: 'absolute', top: 10, right: '20%', width: 34, height: 34, borderRadius: 17, backgroundColor: '#f2d8ac', alignItems: 'center', justifyContent: 'center' },
  sparkleText: { color: '#76552a', fontSize: 20 },
  copy: { alignItems: 'center' },
  eyebrow: { color: '#176b57', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  title: { color: '#202b26', fontSize: 28, fontWeight: '800', letterSpacing: -0.6, textAlign: 'center', marginBottom: 9 },
  subtitle: { maxWidth: 310, color: '#68716b', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  inputArea: { width: '100%', maxWidth: 340, alignSelf: 'center', marginTop: 20 },
  inputLabel: { color: '#404a44', fontSize: 13, fontWeight: '600', marginBottom: 7 },
  input: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: '#e2dfd4', backgroundColor: '#fffefa', color: '#202b26', fontSize: 16, paddingHorizontal: 16 },
  actionArea: { width: '100%', alignItems: 'center', marginTop: 18 },
  confirmation: { color: '#176b57', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  button: { minHeight: 54, width: '100%', maxWidth: 340, borderRadius: 18, backgroundColor: '#176b57', paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#fffefa', fontSize: 16, fontWeight: '700' },
  buttonArrow: { position: 'absolute', right: 20, color: '#fffefa', fontSize: 22 },
  footer: { color: '#8a908a', fontSize: 12, marginTop: 15 },
});
