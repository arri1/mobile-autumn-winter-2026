import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/theme';

import type { Category } from '../types';

/** Категории горизонтальной лентой чипов; нажатие открывает категорию. */
export function CategoryList({ categories }: { categories: readonly Category[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}>
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          onPress={() =>
            router.push({
              pathname: '/catalog/category/[categoryId]',
              params: { categoryId: category.id, title: category.name },
            })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Лента выходит за боковые отступы экрана, чтобы чипы прокручивались от края до края.
  scroll: { flexGrow: 0, marginHorizontal: -Spacing.lg },
  row: { gap: Spacing.sm, paddingHorizontal: Spacing.lg },
});
