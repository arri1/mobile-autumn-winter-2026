import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage } from '@/lib/storage';

import type { City } from './types';

type CityState = {
  /** Все поиски, цены и маршруты ограничены выбранным городом (ТЗ, п. 4.2). */
  city: City | null;
  setCity: (city: City) => void;
};

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      city: null,
      setCity: (city) => set({ city }),
    }),
    { name: 'city', storage: persistStorage },
  ),
);
