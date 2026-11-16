import * as Location from 'expo-location';

export type GeoPoint = {
  lat: number;
  lon: number;
};

export class LocationPermissionError extends Error {
  constructor() {
    super('Нет доступа к геопозиции. Разрешите его в настройках устройства');
    this.name = 'LocationPermissionError';
  }
}

export class LocationUnavailableError extends Error {
  constructor() {
    super('Не удалось определить местоположение. Проверьте, что геолокация включена');
    this.name = 'LocationUnavailableError';
  }
}

/** Сколько ждём свежих координат: в помещении GPS может не ответить вовсе. */
const FIX_TIMEOUT_MS = 8000;
const LAST_KNOWN_MAX_AGE_MS = 5 * 60_000;

/** Запрашивает разрешение (если нужно) и возвращает текущие координаты устройства. */
export async function getCurrentPoint(): Promise<GeoPoint> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new LocationPermissionError();
  }

  const position =
    (await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      FIX_TIMEOUT_MS,
    )) ??
    // Свежих координат нет — подойдут недавние: старые могут быть из другого города.
    (await Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS }).catch(() => null));
  if (!position) {
    throw new LocationUnavailableError();
  }
  return { lat: position.coords.latitude, lon: position.coords.longitude };
}

/** null — если промис не успел или завершился ошибкой. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(resolve, () => resolve(null)).finally(() => clearTimeout(timer));
  });
}
