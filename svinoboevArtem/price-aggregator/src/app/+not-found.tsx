import { router, Stack } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { EmptyView } from '@/components/ui/status-views';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Не найдено' }} />
      <EmptyView
        icon="map"
        title="Такой страницы нет"
        description="Возможно, ссылка устарела."
        action={<Button title="На главную" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
