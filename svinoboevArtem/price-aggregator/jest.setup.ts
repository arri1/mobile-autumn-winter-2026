// jest-expo уже мокает нативную часть модулей Expo SDK. Здесь — сторонние нативные модули.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// MapLibre рендерит нативную карту — в тестах экранов подменяем её пустыми View.
jest.mock('@maplibre/maplibre-react-native', () => {
  const { createElement } = require('react');
  const { View } = require('react-native');
  const Stub = ({ children }: { children?: unknown }) => createElement(View, null, children);
  return { Map: Stub, Camera: Stub, GeoJSONSource: Stub, Layer: Stub, UserLocation: Stub };
});
