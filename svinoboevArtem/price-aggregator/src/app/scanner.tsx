import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { classifyScan, type ScanResult } from '@/features/scanner/classify-scan';
import { ScanResultPanel } from '@/features/scanner/components/scan-result-panel';
import { Radius, Spacing } from '@/theme';

/** Сканер штрихкодов EAN-13/EAN-8 и QR-кодов чеков ФНС (ТЗ, п. 4.3). */
export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState('');
  const insets = useSafeAreaInsets();
  const cameraReady = permission?.granted === true;

  function handleScan({ data }: BarcodeScanningResult) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResult(classifyScan(data));
  }

  function submitManual() {
    if (!code.trim()) return;
    setResult(classifyScan(code));
    setManual(false);
  }

  function rescan() {
    setResult(null);
    setCode('');
  }

  function renderBody() {
    if (result) return <ScanResultPanel result={result} onRescan={rescan} />;

    if (manual) {
      return (
        <Card>
          <Text variant="heading">Ввести код вручную</Text>
          <TextField
            placeholder="Штрихкод или строка QR чека"
            value={code}
            onChangeText={setCode}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={submitManual}
          />
          <View style={styles.actions}>
            <Button
              title="Отмена"
              variant="secondary"
              style={styles.action}
              onPress={() => setManual(false)}
            />
            <Button
              title="Найти"
              style={styles.action}
              disabled={!code.trim()}
              onPress={submitManual}
            />
          </View>
        </Card>
      );
    }

    if (!cameraReady) {
      return (
        <Card>
          <Text variant="heading">Нужен доступ к камере</Text>
          <Text color="textSecondary">
            Камера используется только для сканирования штрихкодов и QR-кодов чеков. Код можно
            ввести и вручную.
          </Text>
          {permission?.canAskAgain === false ? (
            <Button title="Открыть настройки" onPress={() => Linking.openSettings()} />
          ) : (
            <Button title="Разрешить доступ" onPress={requestPermission} />
          )}
          <Button title="Ввести код вручную" variant="soft" onPress={() => setManual(true)} />
        </Card>
      );
    }

    return (
      <View style={styles.hint} pointerEvents="none">
        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.hintText}>Наведите камеру на штрихкод товара или QR-код чека</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraReady ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'qr'] }}
          // Пока показан результат или ручной ввод, сканирование на паузе —
          // иначе колбэк срабатывает на каждом кадре.
          onBarcodeScanned={result || manual ? undefined : handleScan}
        />
      ) : null}

      <StatusBar style="light" />
      {/* Отступы считаем сами: SafeAreaView внутри fullScreenModal не всегда получает инсеты. */}
      <View
        style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        pointerEvents="box-none">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
          pointerEvents="box-none">
          <View style={styles.toolbar}>
            <RoundButton icon="close" label="Закрыть" onPress={() => router.back()} />
            <View style={styles.toolbarGroup}>
              {cameraReady && !result ? (
                <RoundButton
                  icon="keyboard"
                  label="Ввести код вручную"
                  onPress={() => setManual((value) => !value)}
                />
              ) : null}
              {cameraReady ? (
                <RoundButton
                  icon={torch ? 'torchOff' : 'torchOn'}
                  label={torch ? 'Выключить фонарик' : 'Включить фонарик'}
                  onPress={() => setTorch((value) => !value)}
                />
              ) : null}
            </View>
          </View>
          {renderBody()}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

type RoundButtonProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
};

function RoundButton({ icon, label, onPress }: RoundButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.roundButton, { opacity: pressed ? 0.6 : 1 }]}>
      <Icon name={icon} size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const CORNER = 34;

const styles = StyleSheet.create({
  // Экран всегда тёмный: это видоискатель, а не страница приложения.
  container: { flex: 1, backgroundColor: '#0B120E' },
  fill: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: Spacing.lg, gap: Spacing.lg },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between' },
  toolbarGroup: { flexDirection: 'row', gap: Spacing.sm },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 18, 14, 0.6)',
  },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1 },
  hint: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  frame: { width: 250, height: 250 },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: '#FFFFFF' },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: Radius.xl,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: Radius.xl,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: Radius.xl,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: Radius.xl,
  },
  hintText: { color: '#FFFFFF', textAlign: 'center', maxWidth: 260 },
});
