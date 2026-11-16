import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { SectionHeader } from '@/components/ui/section-header';
import { ErrorView } from '@/components/ui/status-views';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useSessionStore } from '@/features/auth/session-store';
import { getErrorMessage } from '@/lib/api/errors';

import { useMyReviews, useSaveReview } from '../hooks';
import type { StoreReview } from '../types';
import { RatingStars } from './rating-stars';

type StoreReviewFormProps = {
  storeId: string;
  cityId: string;
};

/** Оценка и отзыв о магазине. У пользователя один отзыв на магазин — его можно изменить. */
export function StoreReviewForm({ storeId, cityId }: StoreReviewFormProps) {
  const isAuthenticated = useSessionStore((state) => state.status === 'authenticated');
  const reviews = useMyReviews();

  if (!isAuthenticated) {
    return (
      <Card>
        <SectionHeader title="Ваш отзыв" />
        <Text color="textSecondary">Войдите, чтобы оценить магазин и оставить отзыв.</Text>
        <Button title="Войти" variant="soft" onPress={() => router.push('/sign-in')} />
      </Card>
    );
  }
  // Ждём загрузки, чтобы форма сразу открылась с сохранённым отзывом.
  if (reviews.isPending) return null;
  // Не зная о прошлом отзыве, пустую форму не показываем: отправка заменила бы его.
  if (reviews.isError) {
    return (
      <Card>
        <SectionHeader title="Ваш отзыв" />
        <ErrorView error={reviews.error} onRetry={() => reviews.refetch()} />
      </Card>
    );
  }

  const existing = reviews.data?.find((review) => review.store_id === storeId);
  return (
    <ReviewEditor
      // Новый key сбрасывает черновик, когда с сервера пришёл сохранённый отзыв.
      key={existing ? `${existing.rating}:${existing.text}` : 'new'}
      storeId={storeId}
      cityId={cityId}
      existing={existing}
    />
  );
}

type ReviewEditorProps = StoreReviewFormProps & { existing: StoreReview | undefined };

function ReviewEditor({ storeId, cityId, existing }: ReviewEditorProps) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [text, setText] = useState(existing?.text ?? '');
  const save = useSaveReview();
  const changed = rating !== (existing?.rating ?? 0) || text.trim() !== (existing?.text ?? '');

  return (
    <Card>
      <SectionHeader title="Ваш отзыв" note={existing ? 'сохранён' : null} />
      <RatingStars
        value={rating}
        onChange={(value) => {
          setRating(value);
          save.reset();
        }}
      />
      <TextField
        placeholder="Что понравилось или не понравилось"
        value={text}
        onChangeText={(value) => {
          setText(value);
          save.reset();
        }}
        multiline
        maxLength={1000}
        style={styles.text}
      />
      {save.isError ? <Notice tone="danger" text={getErrorMessage(save.error)} /> : null}
      <Button
        title={existing ? 'Обновить отзыв' : 'Отправить отзыв'}
        loading={save.isPending}
        disabled={rating === 0 || !changed}
        onPress={() => save.mutate({ storeId, cityId, rating, text: text.trim() })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  text: { minHeight: 88, paddingTop: 14, paddingBottom: 14, textAlignVertical: 'top' },
});
