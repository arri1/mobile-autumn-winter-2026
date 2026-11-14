import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import ModelViewer from '../components/ModelViewer';
import { buildings } from '../models';
import { colors } from '../theme';

export default function HomeScreen() {
  const [building, setBuilding] = useState(buildings[0]);

  return (
    <CampusScreen>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.eyebrow}>ЯКУТСК</Text>
          <Text style={styles.headerBadge}>3D</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>Кампус СВФУ</Text>
        <Text style={styles.subtitle}>Учебные корпуса и планы этажей</Text>
      </View>

      <View accessibilityRole="tablist" accessibilityLabel="Корпуса СВФУ" style={styles.buildings}>
        {buildings.map((item) => {
          const selected = building.id === item.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              aria-selected={selected}
              onPress={() => setBuilding(item)}
              style={({ pressed }) => [styles.building, selected && styles.buildingSelected, pressed && styles.pressed]}
            >
              <View style={[styles.buildingDot, { backgroundColor: selected ? colors.mint : item.accent }]} />
              <Text style={[styles.buildingLabel, selected && styles.buildingLabelSelected]}>{item.shortName}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.buildingCopy}>
          <Text accessibilityRole="header" style={styles.buildingTitle}>{building.name}</Text>
          <Text style={styles.address}>{building.address}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Этажей</Text>
            <Text style={styles.detailValue}>{building.levels}</Text>
          </View>
          {building.height !== undefined && (
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Высота</Text>
              <Text style={styles.detailValue}>{building.height} м</Text>
            </View>
          )}
        </View>

        {building.id === 'kfen' && building.floorPlan && (
          <Link href="/kfen" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Войти в КФЕН">
              <View style={styles.enter}>
                <View style={styles.enterCopy}>
                  <Text style={styles.enterTitle}>Войти в КФЕН</Text>
                  <Text style={styles.enterSubtitle}>Этажи и поиск аудиторий</Text>
                </View>
                <Text aria-hidden style={styles.enterArrow}>→</Text>
              </View>
            </Pressable>
          </Link>
        )}

        <ModelViewer key={building.id} building={building} />
        <View style={styles.notes}>
          <Text style={styles.caption}>Контур из OpenStreetMap. Детали фасада восстановлены по фото приближённо.</Text>
          <View style={styles.sources}>
            <Link href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={styles.source}>
              © OpenStreetMap contributors
            </Link>
            <Link href={building.footprintSource} target="_blank" rel="noopener noreferrer" style={styles.source}>
              Контур здания ↗
            </Link>
          </View>
          {!building.floorPlan && <Text style={styles.caption}>Поэтажный план пока недоступен.</Text>}
        </View>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 5, padding: 18, borderRadius: 24, backgroundColor: '#123D33' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  eyebrow: { color: '#C4E6D5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  headerBadge: { color: '#E3F5EB', borderColor: '#6A9F8B', borderWidth: 1, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3, fontSize: 11, fontWeight: '800' },
  title: { color: '#F5FAF5', fontSize: 32, letterSpacing: -1.1, fontWeight: '800' },
  subtitle: { color: '#CDE8DC', fontSize: 14, lineHeight: 20 },
  buildings: { flexDirection: 'row', gap: 8 },
  building: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 6, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  buildingSelected: { backgroundColor: colors.green, borderColor: colors.green },
  buildingDot: { width: 7, height: 7, borderRadius: 4 },
  buildingLabel: { flexShrink: 1, color: colors.ink, fontSize: 14, fontWeight: '700' },
  buildingLabelSelected: { color: colors.paper },
  card: { padding: 13, gap: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper },
  buildingCopy: { gap: 4, paddingHorizontal: 3 },
  buildingTitle: { color: colors.ink, fontSize: 20, lineHeight: 25, fontWeight: '800', letterSpacing: -0.4 },
  address: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detail: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, backgroundColor: '#EDF4EF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  detailLabel: { color: colors.muted, fontSize: 12 },
  detailValue: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  enter: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: colors.mint },
  enterCopy: { flex: 1, gap: 3 },
  enterTitle: { color: colors.green, fontSize: 16, fontWeight: '800' },
  enterSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  enterArrow: { color: colors.green, fontSize: 22 },
  notes: { gap: 3, paddingHorizontal: 3 },
  caption: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12 },
  source: { color: colors.green, fontSize: 11, lineHeight: 17, paddingVertical: 4, textDecorationLine: 'underline' },
  pressed: { opacity: 0.7 },
});
