import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';

import { getProductImage } from '../product-images';

type ProductImageProps = {
  product: { id: string; name: string; image_url: string | null };
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
};

/** Фото товара; если его нет — нейтральная заглушка с иконкой. */
export function ProductImage({ product, style, iconSize = 28 }: ProductImageProps) {
  const colors = useTheme();
  const source = getProductImage(product);

  return (
    <View style={[styles.frame, { backgroundColor: colors.surface }, style]}>
      {source ? (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          accessibilityLabel={product.name}
        />
      ) : (
        <Icon name="basket" size={iconSize} color={colors.textSecondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
