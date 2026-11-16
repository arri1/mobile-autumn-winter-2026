import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type PlatformSymbol = Exclude<SymbolViewProps['name'], string>;

/** SF Symbols на iOS и Material Symbols на Android — без PNG-ассетов. */
const ICONS = {
  scan: { ios: 'barcode.viewfinder', android: 'barcode_scanner' },
  close: { ios: 'xmark', android: 'close' },
  torchOn: { ios: 'flashlight.on.fill', android: 'flash_on' },
  torchOff: { ios: 'flashlight.off.fill', android: 'flash_off' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right' },
  location: { ios: 'location.fill', android: 'my_location' },
  pin: { ios: 'mappin.and.ellipse', android: 'location_on' },
  city: { ios: 'building.2', android: 'location_city' },
  search: { ios: 'magnifyingglass', android: 'search' },
  plus: { ios: 'plus', android: 'add' },
  minus: { ios: 'minus', android: 'remove' },
  trash: { ios: 'trash', android: 'delete' },
  star: { ios: 'star.fill', android: 'star' },
  starOutline: { ios: 'star', android: 'star_border' },
  check: { ios: 'checkmark', android: 'check' },
  checkboxOn: { ios: 'checkmark.square.fill', android: 'check_box' },
  checkboxOff: { ios: 'square', android: 'check_box_outline_blank' },
  receipt: { ios: 'doc.text', android: 'receipt_long' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning' },
  info: { ios: 'info.circle', android: 'info' },
  store: { ios: 'storefront', android: 'storefront' },
  cart: { ios: 'cart', android: 'shopping_cart' },
  basket: { ios: 'basket', android: 'shopping_basket' },
  clock: { ios: 'clock', android: 'schedule' },
  tag: { ios: 'tag', android: 'sell' },
  route: {
    ios: 'point.topleft.down.to.point.bottomright.curvepath',
    android: 'route',
  },
  car: { ios: 'car', android: 'directions_car' },
  person: { ios: 'person.fill', android: 'person' },
  pencil: { ios: 'pencil', android: 'edit' },
  exit: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout' },
  grid: { ios: 'square.grid.2x2', android: 'category' },
  flame: { ios: 'flame', android: 'local_fire_department' },
  wifiOff: { ios: 'wifi.slash', android: 'wifi_off' },
  keyboard: { ios: 'keyboard', android: 'keyboard' },
  map: { ios: 'map', android: 'map' },
  clearField: { ios: 'xmark.circle.fill', android: 'cancel' },
} as const satisfies Record<string, PlatformSymbol>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = 22, color }: IconProps) {
  const colors = useTheme();
  return <SymbolView name={ICONS[name]} size={size} tintColor={color ?? colors.text} />;
}
