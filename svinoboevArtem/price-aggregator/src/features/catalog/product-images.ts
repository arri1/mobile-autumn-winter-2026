import type { ImageSource } from 'expo-image';

/**
 * Локальные фото товаров демо-каталога — те же, что в веб-клиенте.
 * Используются, пока бэкенд не отдаёт image_url.
 */
const LOCAL_IMAGES: Record<string, number> = {
  apple: require('@/assets/images/products/apple.webp'),
  banana: require('@/assets/images/products/banana.webp'),
  bread: require('@/assets/images/products/bread.webp'),
  cucumber: require('@/assets/images/products/cucumber.webp'),
  eggs: require('@/assets/images/products/eggs.webp'),
  milk: require('@/assets/images/products/milk.webp'),
  oats: require('@/assets/images/products/oats.webp'),
  rice: require('@/assets/images/products/rice.webp'),
  yogurt: require('@/assets/images/products/yogurt.webp'),
};

type ProductImageRef = { id: string; image_url: string | null };

/** Фото с сервера имеет приоритет; null — показать заглушку. */
export function getProductImage(product: ProductImageRef): ImageSource | number | null {
  if (product.image_url) return { uri: product.image_url };
  return LOCAL_IMAGES[product.id] ?? null;
}
