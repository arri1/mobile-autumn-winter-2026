import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Хранилище для zustand/persist. Только для несекретных данных — токены лежат в SecureStore. */
export const persistStorage = createJSONStorage(() => AsyncStorage);
