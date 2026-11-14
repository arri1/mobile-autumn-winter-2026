import { useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Polygon, Rect } from 'react-native-svg';

import { projectBuilding, type BuildingModel } from '../models';
import { colors } from '../theme';

const orbitControls = [
  { label: 'Повернуть влево', icon: '↶', offset: -Math.PI / 6 },
  { label: 'Сбросить поворот', icon: 'Сбросить', offset: 0 },
  { label: 'Повернуть вправо', icon: '↷', offset: Math.PI / 6 },
];

export default function ModelViewer({ building }: { building: BuildingModel }) {
  const [angle, setAngle] = useState(0);
  const [responder] = useState(() => {
    let previousDelta = 0;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: () => { previousDelta = 0; },
      onPanResponderMove: (_, gesture) => {
        const change = gesture.dx - previousDelta;
        previousDelta = gesture.dx;
        setAngle((value) => value + change * 0.014);
      },
    });
  });

  const faces = projectBuilding(building, angle);

  return (
    <View style={styles.viewer}>
      <View
        {...responder.panHandlers}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Объёмная модель ${building.shortName}`}
        style={styles.canvas}
      >
        <Svg width="100%" height="100%" viewBox="0 0 400 300" aria-hidden>
          <Defs>
            <Pattern id="model-grid" width={14} height={14} patternUnits="userSpaceOnUse">
              <Circle cx={7} cy={7} r={0.8} fill="#D4DED4" />
            </Pattern>
          </Defs>
          <Rect width={400} height={300} fill="url(#model-grid)" />
          {faces.map(({ id, ...face }) => <Polygon key={id} {...face} strokeWidth={0.65} />)}
        </Svg>
      </View>
      <Text style={styles.hint}>Проведи по модели, чтобы повернуть</Text>
      <View style={styles.controls}>
        {orbitControls.map(({ label, icon, offset }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => setAngle((value) => offset === 0 ? 0 : value + offset)}
            style={({ pressed }) => [styles.control, offset === 0 && styles.reset, pressed && styles.pressed]}
          >
            <Text style={offset === 0 ? styles.resetText : styles.turnText}>{icon}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewer: { gap: 9 },
  canvas: { width: '100%', aspectRatio: 4 / 3, borderRadius: 14, overflow: 'hidden', backgroundColor: '#EDF2EB' },
  hint: { color: colors.muted, fontSize: 12, textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  control: { minWidth: 48, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.mint },
  reset: { minWidth: 90, paddingHorizontal: 10 },
  resetText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  turnText: { color: colors.green, fontSize: 22, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
