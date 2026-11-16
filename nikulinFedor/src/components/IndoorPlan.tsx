import { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import {
  indoorPlanError,
  indoorPlanHeight,
  indoorPlanHtml,
  indoorPlanOrigin,
  type FloorSelection,
} from './indoorPlanHtml';

function showFloor(view: WebView | null, selection?: FloorSelection) {
  if (selection) view?.injectJavaScript(`window.showCampusFloor?.(${JSON.stringify(selection.level)}); true;`);
}

export default function IndoorPlan({ complexId, floorSelection }: { complexId: string; floorSelection?: FloorSelection }) {
  const map = useRef<WebView>(null);
  const source = useMemo(() => ({ html: indoorPlanHtml(complexId) }), [complexId]);
  useEffect(() => { showFloor(map.current, floorSelection); }, [floorSelection]);

  // The stock WebView on the Android 10 emulator hangs when the map receives input.
  if (Platform.OS === 'android' && Platform.Version <= 29) {
    return (
      <View style={styles.notice}>
        <Text style={styles.message}>Интерактивный план доступен на Android 11 и новее.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={map}
        source={source}
        onLoad={() => showFloor(map.current, floorSelection)}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={({ url }) =>
          url === 'about:blank' || url.startsWith(`${indoorPlanOrigin}/widget.html?`)
        }
        allowFileAccess={false}
        thirdPartyCookiesEnabled={false}
        nestedScrollEnabled
        renderError={() => (
          <View style={styles.error}>
            <Text accessibilityRole="alert">{indoorPlanError}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: indoorPlanHeight, width: '100%', overflow: 'hidden' },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  notice: { padding: 18, backgroundColor: '#EDF4EF' },
  message: { color: '#303B34', fontSize: 14, lineHeight: 20 },
});
