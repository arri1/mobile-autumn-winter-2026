import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';

export default function NameScreen() {
  const [name, setName] = useState('');
  const trimmedName = name.trim();

  return (
    <CampusScreen>
      <View style={courseStyles.card}>
        <Text accessibilityRole="header" style={courseStyles.heading}>Как тебя зовут?</Text>
        <TextInput
          accessibilityLabel="Имя"
          placeholder="Введи имя"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="done"
          style={styles.input}
        />
        <Text accessibilityLiveRegion="polite" style={courseStyles.text}>{trimmedName ? `Привет, ${trimmedName}!` : 'Привет!'}</Text>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 48, paddingHorizontal: 12, color: colors.ink, fontSize: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
});
