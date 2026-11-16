import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';

/** Быстрый доступ к сканеру из любого раздела (ТЗ, п. 5.1). */
export function ScanButton() {
  const colors = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Сканировать чек или штрихкод"
      hitSlop={12}
      onPress={() => router.push('/scanner')}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Icon name="scan" color={colors.primary} />
    </Pressable>
  );
}
