import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { formatDistance } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

import { PRICE_LEVEL_LABELS, STORE_TYPE_LABELS_SINGULAR } from '../constants';
import type { Store } from '../types';

type StoreListItemProps = {
  store: Store;
  onPress: () => void;
};

/** Карточка магазина в списке: тип, адрес, рейтинг, уровень цен и расстояние. */
export function StoreListItem({ store, onPress }: StoreListItemProps) {
  const colors = useTheme();
  const facts = [
    store.price_level !== null ? PRICE_LEVEL_LABELS[store.price_level] : null,
    store.opening_hours,
  ].filter(Boolean);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={store.name}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={[styles.badge, { backgroundColor: colors.tint }]}>
        <Icon name="store" size={22} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="label" numberOfLines={1} style={styles.title}>
            {store.name}
          </Text>
          {store.rating !== null ? (
            <View style={styles.rating}>
              <Icon name="star" size={13} color={colors.star} />
              <Text variant="label">{store.rating.toFixed(1).replace('.', ',')}</Text>
            </View>
          ) : null}
        </View>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {STORE_TYPE_LABELS_SINGULAR[store.store_type]} · {store.address}
        </Text>
        <View style={styles.facts}>
          {store.distance_m !== null ? (
            <View style={[styles.pill, { backgroundColor: colors.tint }]}>
              <Text variant="overline" color="primary">
                {formatDistance(store.distance_m)}
              </Text>
            </View>
          ) : null}
          {facts.map((fact) => (
            <View key={fact} style={[styles.pill, { backgroundColor: colors.surface }]}>
              <Text variant="overline" color="textSecondary">
                {fact}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { flex: 1, fontSize: 16 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill },
});
