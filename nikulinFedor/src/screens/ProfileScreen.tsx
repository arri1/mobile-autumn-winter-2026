import { StyleSheet, Text, View } from 'react-native';

import CampusScreen from '../components/CampusScreen';
import Icon from '../components/Icon';
import { student } from '../student';
import { colors } from '../theme';
import { courseStyles } from './courseStyles';

export default function ProfileScreen() {
  return (
    <CampusScreen>
      <Text accessibilityRole="header" style={courseStyles.title}>Профиль</Text>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text aria-hidden style={styles.initials}>{student.initials}</Text>
        </View>
        <Text accessibilityRole="header" style={styles.name}>{student.name}</Text>
        <Text style={styles.group}>СВФУ · {student.group}</Text>
      </View>
      <View style={[courseStyles.card, styles.course]}>
        <View style={styles.badge}>
          <Icon name="labs" color={colors.green} />
        </View>
        <View style={styles.courseCopy}>
          <Text style={courseStyles.heading}>Мобильная разработка</Text>
          <Text style={courseStyles.muted}>Учебный проект «Кампус СВФУ»</Text>
        </View>
      </View>
    </CampusScreen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 10, borderRadius: 26, backgroundColor: colors.forest, padding: 24 },
  avatar: { width: 62, height: 62, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint, marginBottom: 6 },
  initials: { color: colors.forest, fontSize: 23, fontWeight: '800' },
  name: { color: colors.paper, fontSize: 29, fontWeight: '800', letterSpacing: -0.8 },
  group: { color: colors.lightText, fontSize: 15, lineHeight: 21 },
  course: { flexDirection: 'row', alignItems: 'center' },
  badge: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint, borderRadius: 14 },
  courseCopy: { flex: 1, gap: 3 },
});
