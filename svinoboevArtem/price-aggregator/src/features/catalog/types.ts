/** Пищевая ценность на 100 г (или 100 мл) продукта. */
export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type Nutrient = keyof Nutrition;

export type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  has_children: boolean;
};

export type ProductSummary = {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  /** Масса или объём нетто одной упаковки, г или мл. */
  net_weight: number | null;
  nutrition: Nutrition | null;
  /** Минимальная цена в выбранном городе. */
  min_price: number | null;
};

export type StoreOffer = {
  store_id: string;
  store_name: string;
  price: number;
  updated_at: string;
};

/** Минимальная цена по городу на дату (ISO, YYYY-MM-DD). */
export type PricePoint = {
  date: string;
  price: number;
};

export type Product = ProductSummary & {
  barcode: string | null;
  category_id: string | null;
  /** Отсортированы по возрастанию цены. */
  offers: StoreOffer[];
  price_history: PricePoint[];
};

export type ProductsQuery = {
  cityId: string;
  /** Категория вместе со всеми вложенными. */
  categoryId?: string | null;
  /** Название, бренд или штрихкод. */
  search?: string;
  storeId?: string | null;
};
