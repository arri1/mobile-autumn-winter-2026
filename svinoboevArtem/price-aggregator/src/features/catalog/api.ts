import { apiRequest } from '@/lib/api/client';

import type { Category, Product, ProductsQuery, ProductSummary } from './types';

export function fetchCategories(parentId: string | null, signal?: AbortSignal) {
  return apiRequest<Category[]>('/categories', { query: { parent_id: parentId }, signal });
}

export function fetchProducts(params: ProductsQuery, signal?: AbortSignal) {
  return apiRequest<ProductSummary[]>('/products', {
    query: {
      city_id: params.cityId,
      category_id: params.categoryId,
      q: params.search || undefined,
      store_id: params.storeId,
    },
    signal,
  });
}

export function fetchProduct(productId: string, cityId: string, signal?: AbortSignal) {
  return apiRequest<Product>(`/products/${encodeURIComponent(productId)}`, {
    query: { city_id: cityId },
    signal,
  });
}

export function fetchProductByBarcode(barcode: string, cityId: string, signal?: AbortSignal) {
  return apiRequest<Product>(`/products/by-barcode/${encodeURIComponent(barcode)}`, {
    query: { city_id: cityId },
    signal,
  });
}
