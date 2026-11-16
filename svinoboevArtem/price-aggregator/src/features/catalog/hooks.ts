import { useQuery } from '@tanstack/react-query';

import { useCityStore } from '@/features/city/city-store';

import { fetchCategories, fetchProduct, fetchProductByBarcode, fetchProducts } from './api';
import type { ProductsQuery } from './types';

export const catalogKeys = {
  all: ['catalog'] as const,
  categories: (parentId: string | null) => [...catalogKeys.all, 'categories', parentId] as const,
  products: (params: ProductsQuery) => [...catalogKeys.all, 'products', params] as const,
  product: (productId: string, cityId: string) =>
    [...catalogKeys.all, 'product', productId, cityId] as const,
  barcode: (barcode: string, cityId: string) =>
    [...catalogKeys.all, 'barcode', barcode, cityId] as const,
};

export function useCategories(parentId: string | null) {
  return useQuery({
    queryKey: catalogKeys.categories(parentId),
    queryFn: ({ signal }) => fetchCategories(parentId, signal),
    staleTime: 10 * 60_000,
  });
}

// Цены зависят от города, поэтому запросы ниже ждут, пока город будет выбран.

type ProductsFilter = Omit<ProductsQuery, 'cityId'>;

/** Товары выбранного города с фильтрами по категории, магазину и строке поиска. */
export function useProducts(filter: ProductsFilter = {}, enabled = true) {
  const cityId = useCityStore((state) => state.city?.id);
  const params: ProductsQuery = {
    cityId: cityId ?? '',
    categoryId: filter.categoryId ?? null,
    search: filter.search ?? '',
    storeId: filter.storeId ?? null,
  };
  return useQuery({
    queryKey: catalogKeys.products(params),
    queryFn: ({ signal }) => fetchProducts(params, signal),
    enabled: Boolean(cityId) && enabled,
    // Не мигаем пустой сеткой, пока пользователь печатает запрос.
    // Цены другого города при этом не показываем.
    placeholderData: (previous, previousQuery) => {
      const previousParams = previousQuery?.queryKey[2] as ProductsQuery | undefined;
      return previousParams?.cityId === params.cityId ? previous : undefined;
    },
  });
}

export function useProduct(productId: string) {
  const cityId = useCityStore((state) => state.city?.id);
  return useQuery({
    queryKey: catalogKeys.product(productId, cityId ?? ''),
    queryFn: ({ signal }) => fetchProduct(productId, cityId!, signal),
    enabled: Boolean(cityId),
  });
}

export function useProductByBarcode(barcode: string | null) {
  const cityId = useCityStore((state) => state.city?.id);
  return useQuery({
    queryKey: catalogKeys.barcode(barcode ?? '', cityId ?? ''),
    queryFn: ({ signal }) => fetchProductByBarcode(barcode!, cityId!, signal),
    enabled: Boolean(barcode && cityId),
  });
}
