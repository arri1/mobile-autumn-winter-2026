import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import KfenFloorMap from '../components/KfenFloorMap';
import { kfenFloors, routesToRoom } from '../kfenPlan';
import type { PlanRoom } from '../kfenPlan/types';
import { kfenRooms } from '../kfenRooms';
import { buildings } from '../models';
import { colors } from '../theme';

type Room = { number: string; floor: number; source?: string; plan?: PlanRoom };

const building = buildings.find((item) => item.id === 'kfen');

function normalizeRoomNumber(value: string) {
  return value.trim()
    .replace(/^(?:(?:аудитория|ауд)\s*\.?\s*|№\s*)+/iu, '')
    .replace(/\s+/gu, '')
    .toUpperCase()
    .replace(/A$/u, 'А');
}

const locations: Room[] = kfenFloors.flatMap((floor) => floor.rooms.flatMap((plan) =>
  [plan.number, ...(plan.aliases ?? [])].map((number) => ({ number, floor: floor.level, plan })),
));
const rooms: Room[] = [
  ...locations.map((room) => ({ ...room, source: kfenRooms.find((entry) => entry.number === room.number && entry.floor === room.floor)?.source })),
  ...kfenRooms.filter((entry) => !locations.some((room) => room.number === entry.number && room.floor === entry.floor)),
];
const suggestions = rooms.filter(({ number }) => ['138', '324', '626'].includes(number));

export default function KfenScreen() {
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Room>();
  const [level, setLevel] = useState(1);
  const [stairIndex, setStairIndex] = useState<number>();
  const floor = kfenFloors.find((item) => item.level === level)!;
  const roomOnFloor = selection?.floor === level ? selection.plan : undefined;
  const routes = useMemo(() => roomOnFloor ? routesToRoom(floor, roomOnFloor) : [], [floor, roomOnFloor]);
  const route = routes.find((item) => item.stairIndex === stairIndex) ?? routes[0];
  const number = normalizeRoomNumber(query);
  const matches = number ? rooms.filter((room) => normalizeRoomNumber(room.number).startsWith(number)) : suggestions;

  function changeQuery(value: string) {
    setQuery(value);
    setSelection(undefined);
    setStairIndex(undefined);
  }

  function selectRoom(room: Room) {
    setQuery(room.number);
    setSelection(room);
    setLevel(room.floor);
    setStairIndex(undefined);
    Keyboard.dismiss();
  }

  function submitQuery() {
    const exact = matches.find((room) => normalizeRoomNumber(room.number) === number);
    if (exact) selectRoom(exact);
  }

  return (
    <CampusScreen>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/');
        }}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>←  К корпусам</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>КОРПУС СВФУ</Text>
        <Text accessibilityRole="header" style={styles.title}>КФЕН изнутри</Text>
        {building?.address && <Text style={styles.subtitle}>{building.address}</Text>}
      </View>

      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>Найти аудиторию</Text>
        <View style={styles.searchBar}>
          <TextInput
            accessibilityLabel="Номер аудитории"
            placeholder="Введи номер аудитории"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={24}
            returnKeyType="search"
            value={query}
            onChangeText={changeQuery}
            onSubmitEditing={submitQuery}
            style={styles.input}
          />
          {query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Очистить поиск"
              onPress={() => changeQuery('')}
              style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
            >
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>

        {selection ? (
          <View style={styles.result} accessibilityLiveRegion="polite">
            <Text style={styles.resultLabel}>Помещение № {selection.number}</Text>
            <Text style={styles.resultFloor}>{selection.floor}-й этаж</Text>
            {selection.floor !== level && (
              <Pressable accessibilityRole="button" onPress={() => setLevel(selection.floor)} style={styles.jump}>
                <Text style={styles.backText}>Перейти на этаж</Text>
              </Pressable>
            )}
            {selection.source && (
              <Link href={selection.source} target="_blank" rel="noopener noreferrer" style={styles.source}>
                Источник номера и этажа ↗
              </Link>
            )}
          </View>
        ) : matches.length > 0 ? (
          <>
            <Text style={styles.caption}>{number ? 'Найденные помещения' : 'Примеры номеров'}</Text>
            <View style={styles.matches}>
              {matches.map((room) => (
                <Pressable
                  key={`${room.floor}:${room.number}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Помещение № ${room.number}, ${room.floor}-й этаж`}
                  onPress={() => selectRoom(room)}
                  style={({ pressed }) => [styles.match, pressed && styles.pressed]}
                >
                  <Text style={styles.matchNumber}>№ {room.number}</Text>
                  <Text style={styles.caption}>{room.floor}-й этаж</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.caption} accessibilityLiveRegion="polite">
            {number ? 'Для этого номера пока нет подтверждённых данных.' : 'Подтверждённые номера аудиторий пока недоступны.'}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>План этажей</Text>
        <View accessibilityRole="tablist" accessibilityLabel="Этажи КФЕН" style={styles.floorTabs}>
          {kfenFloors.map((item) => (
            <Pressable
              key={item.level}
              accessibilityRole="tab"
              accessibilityLabel={`${item.level}-й этаж`}
              aria-selected={level === item.level}
              onPress={() => setLevel(item.level)}
              style={[styles.floorTab, level === item.level && styles.floorSelected]}
            >
              <Text style={[styles.floorNumber, level === item.level && styles.floorNumberSelected]}>{item.level}</Text>
            </Pressable>
          ))}
        </View>
        {route && (
          <View style={styles.routeControls}>
            <Text style={styles.resultLabel}>От какой лестницы идти?</Text>
            <ScrollView horizontal keyboardShouldPersistTaps="handled" contentContainerStyle={styles.stairChoices}>
              {routes.map(({ stairIndex: index }) => (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityState={{ selected: route.stairIndex === index }}
                  onPress={() => setStairIndex(index)}
                  style={[styles.stairChoice, route.stairIndex === index && styles.floorSelected]}
                >
                  <Text style={[styles.floorNumber, route.stairIndex === index && styles.floorNumberSelected]}>{floor.stairs[index].label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        {selection?.floor === level && !route && (
          <Text style={styles.caption}>{roomOnFloor ? 'Положение двери на исходном плане неясно.' : 'Номер есть в источнике, но на снимке его положение не отмечено.'}</Text>
        )}
        <KfenFloorMap
          key={`${level}:${roomOnFloor?.number ?? ''}`}
          floor={floor}
          room={roomOnFloor}
          route={route}
          onRoomPress={(plan) => {
            const location = rooms.find((item) => item.plan === plan && item.number === plan.number);
            if (location) selectRoom(location);
          }}
          onStairPress={setStairIndex}
        />
        <Link href="https://2gis.ru" target="_blank" rel="noopener noreferrer" style={styles.source}>
          Схема по снимкам карты · © 2ГИС
        </Link>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44, paddingHorizontal: 4 },
  backText: { color: colors.green, fontSize: 15, fontWeight: '700' },
  header: { gap: 5, padding: 18, borderRadius: 24, backgroundColor: '#123D33' },
  eyebrow: { color: '#C4E6D5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: '#F5FAF5', fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#CDE8DC', fontSize: 14, lineHeight: 20 },
  card: { padding: 13, gap: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  heading: { color: colors.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.35 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: '#EDF4EF' },
  input: { flex: 1, minHeight: 48, paddingVertical: 10, color: colors.ink, fontSize: 16 },
  clear: { width: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  clearText: { color: colors.green, fontSize: 23, fontWeight: '600' },
  caption: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  matches: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  match: { flexBasis: '28%', flexGrow: 1, minWidth: 86, minHeight: 54, justifyContent: 'center', gap: 2, borderWidth: 1, borderColor: colors.line, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 6 },
  matchNumber: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  result: { gap: 4, padding: 12, borderRadius: 12, backgroundColor: colors.mint },
  resultLabel: { color: colors.green, fontSize: 13, fontWeight: '700' },
  resultFloor: { color: colors.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  source: { color: colors.green, alignSelf: 'flex-start', paddingVertical: 6, fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  jump: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44 },
  floorTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  floorTab: { flex: 1, minWidth: 36, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#EDF4EF' },
  floorSelected: { backgroundColor: colors.green },
  floorNumber: { color: colors.green, fontSize: 13, fontWeight: '700' },
  floorNumberSelected: { color: '#FFFFFF' },
  routeControls: { gap: 6 },
  stairChoices: { gap: 6 },
  stairChoice: { minHeight: 44, justifyContent: 'center', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#EDF4EF' },
  pressed: { opacity: 0.7 },
});
