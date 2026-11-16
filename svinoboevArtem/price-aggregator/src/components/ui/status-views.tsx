import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage, NetworkError } from '@/lib/api/errors';
import { Spacing } from '@/theme';

import { Button } from './button';
import { Icon, type IconName } from './icon';
import { Text } from './text';

export function LoadingView() {
  const colors = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

type ErrorViewProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const offline = error instanceof NetworkError;
  return (
    <StatusLayout
      icon={offline ? 'wifiOff' : 'warning'}
      tone="danger"
      title={offline ? 'Нет соединения' : 'Не удалось загрузить данные'}
      description={offline ? 'Проверьте интернет и попробуйте ещё раз.' : getErrorMessage(error)}
      action={onRetry ? <Button title="Повторить" variant="soft" onPress={onRetry} /> : null}
    />
  );
}

type EmptyViewProps = {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
};

export function EmptyView({ title, description, icon = 'basket', action }: EmptyViewProps) {
  return <StatusLayout icon={icon} title={title} description={description} action={action} />;
}

type StatusLayoutProps = EmptyViewProps & { tone?: 'primary' | 'danger' };

function StatusLayout({ icon, title, description, action, tone = 'primary' }: StatusLayoutProps) {
  const colors = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: tone === 'danger' ? colors.dangerTint : colors.tint },
        ]}>
        <Icon
          name={icon ?? 'basket'}
          size={30}
          color={tone === 'danger' ? colors.danger : colors.primary}
        />
      </View>
      <View style={styles.texts}>
        <Text variant="heading" style={styles.center}>
          {title}
        </Text>
        {description ? (
          <Text color="textSecondary" style={styles.center}>
            {description}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { gap: Spacing.xs, maxWidth: 300 },
  center: { textAlign: 'center' },
});
