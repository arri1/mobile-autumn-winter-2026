import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  UserLocation,
  type CameraRef,
  type GeoJSONSourceRef,
  type PressEventWithFeatures,
} from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import type { LineString } from 'geojson';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, View, type NativeSyntheticEvent } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api/errors';
import { env } from '@/lib/env';
import { getCurrentPoint, type GeoPoint } from '@/lib/geo';
import { Elevation, Radius, Spacing } from '@/theme';

import { storesToFeatureCollection } from '../geojson';
import type { Store } from '../types';

// Шрифт должен существовать на glyph-сервере стиля. Для стилей OpenFreeMap — Noto Sans.
const CLUSTER_FONT = ['Noto Sans Bold'];

type StoreMapProps = {
  /**
   * Начальная точка камеры. Применяется при монтировании: чтобы перецентрировать карту
   * при смене города, передайте компоненту новый `key`.
   */
  center: GeoPoint;
  zoom?: number;
  stores: readonly Store[];
  /** Маршрут от OSRM (приходит с бэкенда). */
  route?: LineString | null;
  onStorePress?: (storeId: string) => void;
  /** Нажатие на карту мимо магазинов — например, чтобы снять выделение. */
  onBackgroundPress?: () => void;
  /** Выделенный магазин рисуется крупнее. */
  selectedStoreId?: string | null;
  /** Начальная точка маршрута. */
  origin?: GeoPoint | null;
  /** false — статичная мини-карта без кнопки геолокации. */
  interactive?: boolean;
  /**
   * Отступ снизу для кнопки «моё местоположение». Атрибуцию OSM (обязательна по лицензии)
   * MapLibre сам размещает с учётом safe area.
   */
  controlsBottomInset?: number;
};

export function StoreMap({
  center,
  zoom = 11,
  stores,
  route,
  onStorePress,
  onBackgroundPress,
  selectedStoreId = null,
  origin = null,
  interactive = true,
  controlsBottomInset = Spacing.lg,
}: StoreMapProps) {
  const colors = useTheme();
  const cameraRef = useRef<CameraRef>(null);
  const storesSourceRef = useRef<GeoJSONSourceRef>(null);
  const [permission, , refreshPermission] = Location.useForegroundPermissions();

  async function handleStoresPress(event: NativeSyntheticEvent<PressEventWithFeatures>) {
    // Событие всплывает до карты — там оно означало бы «нажали мимо магазинов».
    event.stopPropagation();
    const feature = event.nativeEvent.features[0];
    if (!feature || feature.geometry.type !== 'Point') return;
    const [lon, lat] = feature.geometry.coordinates;
    const properties = feature.properties ?? {};

    if (typeof properties.cluster_id === 'number') {
      const expansionZoom = await storesSourceRef.current
        ?.getClusterExpansionZoom(properties.cluster_id)
        .catch(() => undefined);
      cameraRef.current?.easeTo({ center: [lon, lat], zoom: expansionZoom });
      return;
    }
    if (typeof properties.storeId === 'string') {
      onStorePress?.(properties.storeId);
    }
  }

  async function locateMe() {
    try {
      const point = await getCurrentPoint();
      // Обновляем статус разрешения, чтобы показать точку пользователя на карте.
      refreshPermission();
      cameraRef.current?.flyTo({ center: [point.lon, point.lat], zoom: 14 });
    } catch (error) {
      Alert.alert('Не удалось определить местоположение', getErrorMessage(error));
    }
  }

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={env.mapStyleUrl}
        logo={false}
        compass={false}
        dragPan={interactive}
        touchZoom={interactive}
        doubleTapZoom={interactive}
        touchRotate={false}
        touchPitch={false}
        tintColor={colors.primary}
        onPress={onBackgroundPress ? () => onBackgroundPress() : undefined}
        // Справа внизу — кнопка геолокации, поэтому атрибуцию переносим влево.
        attributionPosition={{ bottom: Spacing.sm, left: Spacing.sm }}>
        <Camera ref={cameraRef} initialViewState={{ center: [center.lon, center.lat], zoom }} />
        {permission?.granted ? <UserLocation /> : null}

        <GeoJSONSource
          ref={storesSourceRef}
          id="stores"
          data={storesToFeatureCollection(stores)}
          cluster
          clusterRadius={50}
          clusterMaxZoom={14}
          onPress={handleStoresPress}>
          <Layer
            id="store-clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': colors.primary,
              'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            }}
          />
          <Layer
            id="store-cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': ['get', 'point_count_abbreviated'],
              'text-font': CLUSTER_FONT,
              'text-size': 13,
            }}
            paint={{ 'text-color': '#FFFFFF' }}
          />
          <Layer
            id="store-points"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': colors.primary,
              'circle-radius': ['case', ['==', ['get', 'storeId'], selectedStoreId ?? ''], 12, 8],
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'storeId'], selectedStoreId ?? ''],
                4,
                2.5,
              ],
              'circle-stroke-color': '#FFFFFF',
            }}
          />
        </GeoJSONSource>

        {route ? (
          <GeoJSONSource id="route" data={route}>
            <Layer
              id="route-line"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{ 'line-color': colors.primary, 'line-width': 4, 'line-opacity': 0.85 }}
            />
          </GeoJSONSource>
        ) : null}

        {origin ? (
          <GeoJSONSource
            id="origin"
            data={{ type: 'Point', coordinates: [origin.lon, origin.lat] }}>
            <Layer
              id="origin-point"
              type="circle"
              paint={{
                'circle-color': '#FFFFFF',
                'circle-radius': 6,
                'circle-stroke-width': 4,
                'circle-stroke-color': colors.text,
              }}
            />
          </GeoJSONSource>
        ) : null}
      </Map>

      {interactive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Моё местоположение"
          onPress={locateMe}
          style={({ pressed }) => [
            styles.locateButton,
            Elevation,
            {
              backgroundColor: colors.background,
              bottom: controlsBottomInset,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <Icon name="location" size={20} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  locateButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
