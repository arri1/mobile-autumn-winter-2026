import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const paths = {
  home: 'M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9',
  campus: 'M3 21h18M5 21V8l7-5 7 5v13M9 10h.01M15 10h.01M9 14h.01M15 14h.01M11 21v-4h2v4',
  labs: 'M9 3h6m-5 0v7l-5.6 8.8A1.5 1.5 0 0 0 5.7 21h12.6a1.5 1.5 0 0 0 1.3-2.2L14 10V3M8 15h8',
  posts: 'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 5h8m-8 4h6',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1',
  refresh: 'M20 10a8 8 0 0 0-14-4L3 9m0-5v5h5m-4 5a8 8 0 0 0 14 4l3-3m0 5v-5h-5',
  plus: 'M12 5v14M5 12h14',
  close: 'm6 6 12 12M18 6 6 18',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
};

type IconName = keyof typeof paths;

export default function Icon({ name, color, size = 22 }: { name: IconName; color: ColorValue; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <Path d={paths[name]} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
