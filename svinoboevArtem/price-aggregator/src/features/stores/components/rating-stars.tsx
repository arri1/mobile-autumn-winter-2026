import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme';

type RatingStarsProps = {
  /** 0 — оценка ещё не выбрана. */
  value: number;
  onChange: (value: number) => void;
};

/** Выбор оценки от 1 до 5. */
export function RatingStars({ value, onChange }: RatingStarsProps) {
  const colors = useTheme();
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          accessibilityRole="button"
          accessibilityLabel={`Оценка ${star} из 5`}
          accessibilityState={{ selected: star === value }}
          hitSlop={4}
          onPress={() => onChange(star)}
          style={styles.star}>
          <Icon
            name={star <= value ? 'star' : 'starOutline'}
            size={30}
            color={star <= value ? colors.star : colors.textSecondary}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.xs },
  star: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
