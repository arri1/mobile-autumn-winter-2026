import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Polyline, Text as SvgText } from 'react-native-svg';

import type { FloorRoute } from '../kfenPlan';
import type { PlanFloor, PlanRoom, Point } from '../kfenPlan/types';
import { colors } from '../theme';

const coordinates = (points: Point[]) => points.map((point) => point.join(',')).join(' ');

function bounds(points: Point[]) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

export default function KfenFloorMap({ floor, room, route, onRoomPress, onStairPress }: {
  floor: PlanFloor;
  room?: PlanRoom;
  route?: FloorRoute;
  onRoomPress: (room: PlanRoom) => void;
  onStairPress: (index: number) => void;
}) {
  const [overview, setOverview] = useState(!room);
  const [width, setWidth] = useState(320);
  const focus = room && bounds([...room.outline, ...(route?.points ?? [])]);
  const focusedWidth = focus ? Math.max(250, focus.width + 80) : 0;
  const focusedHeight = focus ? Math.max(150, focus.height + 68) : 0;
  const view = !overview && focus ? [
    focus.left + (focus.width - focusedWidth) / 2,
    focus.top + (focus.height - focusedHeight) / 2,
    focusedWidth,
    focusedHeight,
  ] : floor.viewBox;
  const mapWidth = overview ? Math.max(width, view[2] * 0.61) : width;
  const mapHeight = Math.max(154, Math.min(340, mapWidth * view[3] / view[2]));
  const scale = Math.min(mapWidth / view[2], mapHeight / view[3]);
  const offsetX = (mapWidth - view[2] * scale) / 2;
  const offsetY = (mapHeight - view[3] * scale) / 2;
  const destination = route?.points.at(-1);

  function position(x: number, y: number, areaWidth: number, areaHeight: number) {
    return {
      left: offsetX + (x - view[0]) * scale,
      top: offsetY + (y - view[1]) * scale,
      width: areaWidth * scale,
      height: areaHeight * scale,
    };
  }

  return (
    <View style={styles.content}>
      {room && (
        <Pressable accessibilityRole="button" onPress={() => setOverview(!overview)} style={styles.control}>
          <Text style={styles.controlText}>{overview ? 'К помещению' : 'Весь этаж'}</Text>
        </Pressable>
      )}
      <View style={styles.canvas} onLayout={(event) => setWidth(Math.max(1, event.nativeEvent.layout.width - 2))}>
        <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
          <View style={{ width: mapWidth, height: mapHeight, overflow: 'hidden' }}>
            <Svg width={mapWidth} height={mapHeight} viewBox={view.join(' ')} accessibilityLabel={`Схема ${floor.level}-го этажа КФЕН`}>
              {floor.halls.map((hall, index) => (
                <G key={index}>
                  <Polyline points={coordinates(hall.points)} fill="none" stroke="#D4DFD9" strokeWidth={hall.width + 8} strokeLinecap="round" strokeLinejoin="round" />
                  <Polyline points={coordinates(hall.points)} fill="none" stroke="#FFFFFF" strokeWidth={hall.width + 4} strokeLinecap="round" strokeLinejoin="round" />
                </G>
              ))}
              {floor.landmarks?.map(({ label, outline }, index) => {
                const box = bounds(outline);
                return (
                  <G key={`${label}:${index}`}>
                    <Polygon points={coordinates(outline)} fill="#E4E7DF" stroke="#BFC9C0" strokeWidth={1.3} />
                    <SvgText x={box.left + box.width / 2} y={box.top + box.height / 2 + 4} textAnchor="middle" fill="#506557" fontSize={12}>{label}</SvgText>
                  </G>
                );
              })}
              {floor.rooms.map((item) => {
                const box = bounds(item.outline);
                const selected = item.number === room?.number;
                const fontSize = Math.max(8, Math.min(17, (box.width - 5) / (item.number.length * 0.63)));
                return (
                  <G key={item.number}>
                    <Polygon points={coordinates(item.outline)} fill={selected ? '#FADDAE' : '#DDECE8'} stroke={selected ? '#94601C' : '#9CB8AD'} strokeWidth={selected ? 2.6 : 1.3} />
                    <SvgText x={box.left + box.width / 2} y={box.top + box.height / 2 + fontSize * 0.35} textAnchor="middle" fill={colors.ink} fontSize={fontSize} fontWeight="700">{item.number}</SvgText>
                  </G>
                );
              })}
              {route && <Polyline points={coordinates(route.points)} fill="none" stroke={colors.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
              {floor.stairs.map(({ point: [x, y], label }, index) => {
                const selected = route?.stairIndex === index;
                return (
                  <G key={label}>
                    <Circle cx={x} cy={y} r={selected ? 15 : 13} fill={selected ? colors.green : '#FFFFFF'} stroke={colors.green} strokeWidth={2} />
                    <Path d={`M${x - 6} ${y + 5}h4v-4h4v-4h4`} fill="none" stroke={selected ? '#FFFFFF' : colors.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </G>
                );
              })}
              {destination && <Circle cx={destination[0]} cy={destination[1]} r={6} fill="#9B5819" stroke="#FFFFFF" strokeWidth={2} />}
            </Svg>
            {floor.rooms.map((item) => {
              const box = bounds(item.outline);
              if (!overview && (box.left < view[0] || box.top < view[1] || box.left + box.width > view[0] + view[2] || box.top + box.height > view[1] + view[3])) return null;
              return (
                <Pressable
                  key={item.number}
                  accessibilityRole="button"
                  accessibilityLabel={`Помещение ${item.number} на схеме`}
                  onPress={() => onRoomPress(item)}
                  style={[styles.hitArea, position(box.left, box.top, box.width, box.height)]}
                />
              );
            })}
            {room && floor.stairs.map(({ point: [x, y], label }, index) => (x >= view[0] && x <= view[0] + view[2] && y >= view[1] && y <= view[1] + view[3]) && (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityLabel={`Выбрать лестницу «${label}» на схеме`}
                onPress={() => onStairPress(index)}
                style={[styles.hitArea, position(x - 15, y - 15, 30, 30)]}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <Text style={styles.hint}>{overview ? 'Листай схему вбок и нажимай на номера помещений.' : route ? 'Зелёная линия ведёт от лестницы к двери.' : 'Выбранное помещение выделено на схеме.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 8 },
  canvas: { borderWidth: 1, borderColor: colors.line, backgroundColor: '#F1F5EF', borderRadius: 12, overflow: 'hidden' },
  hitArea: { position: 'absolute' },
  control: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.mint },
  controlText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 17 },
});
