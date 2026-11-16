import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Text } from '@/components/ui/text';
import { useSessionStore } from '@/features/auth/session-store';
import { useCartStore } from '@/features/cart/cart-store';
import { ProductImage } from '@/features/catalog/components/product-image';
import { useProductByBarcode } from '@/features/catalog/hooks';
import { useCityStore } from '@/features/city/city-store';
import { ApiError, getErrorMessage } from '@/lib/api/errors';
import { formatPrice } from '@/lib/format';
import { Radius, Spacing } from '@/theme';

import type { ScanResult } from '../classify-scan';
import type { FnsReceiptQr } from '../fns-receipt';
import { useSubmitReceipt } from '../hooks';

type ScanResultPanelProps = {
  result: ScanResult;
  onRescan: () => void;
};

export function ScanResultPanel({ result, onRescan }: ScanResultPanelProps) {
  return (
    <Card>
      {result.kind === 'product' ? <ProductResult barcode={result.barcode} /> : null}
      {result.kind === 'receipt' ? <ReceiptResult receipt={result.receipt} /> : null}
      {result.kind === 'unknown' ? (
        <View style={styles.content}>
          <Text variant="heading">Код не распознан</Text>
          <Text color="textSecondary">
            Подойдёт штрихкод товара (EAN-13, EAN-8) или QR-код кассового чека.
          </Text>
        </View>
      ) : null}
      <Button title="Сканировать ещё" variant="secondary" onPress={onRescan} />
    </Card>
  );
}

function ProductResult({ barcode }: { barcode: string }) {
  const hasCity = useCityStore((state) => state.city !== null);
  const product = useProductByBarcode(barcode);
  const addItem = useCartStore((state) => state.addItem);
  const inCart = useCartStore(
    (state) => state.items.find((item) => item.product.id === product.data?.id)?.quantity ?? 0,
  );

  if (!hasCity) {
    return (
      <View style={styles.content}>
        <Text variant="heading">Штрихкод {barcode}</Text>
        <Text color="textSecondary">Выберите город, чтобы увидеть цены на товар.</Text>
        <Button title="Выбрать город" variant="soft" onPress={() => router.push('/city')} />
      </View>
    );
  }
  if (product.isPending) {
    return <Text color="textSecondary">Ищем товар {barcode}…</Text>;
  }
  if (product.isError) {
    const notFound = product.error instanceof ApiError && product.error.status === 404;
    return (
      <View style={styles.content}>
        <Text variant="heading">{notFound ? 'Товар не найден' : 'Ошибка поиска'}</Text>
        <Text color="textSecondary">
          {notFound
            ? `Штрихкода ${barcode} пока нет в каталоге этого города.`
            : getErrorMessage(product.error)}
        </Text>
      </View>
    );
  }

  const item = product.data;
  return (
    <View style={styles.content}>
      <View style={styles.product}>
        <ProductImage product={item} style={styles.image} iconSize={22} />
        <View style={styles.productText}>
          <Text variant="heading" numberOfLines={2}>
            {item.name}
          </Text>
          {item.min_price !== null ? (
            <Text color="textSecondary">от {formatPrice(item.min_price)} в вашем городе</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          title={inCart > 0 ? `В корзине: ${inCart}` : 'В корзину'}
          icon="plus"
          variant="soft"
          style={styles.action}
          onPress={() => addItem(item)}
        />
        <Button
          title="Подробнее"
          style={styles.action}
          onPress={() => {
            router.dismiss();
            router.push({
              pathname: '/catalog/product/[productId]',
              params: { productId: item.id },
            });
          }}
        />
      </View>
    </View>
  );
}

function ReceiptResult({ receipt }: { receipt: FnsReceiptQr }) {
  const isAuthenticated = useSessionStore((state) => state.status === 'authenticated');
  const cityId = useCityStore((state) => state.city?.id);
  const submit = useSubmitReceipt();
  const date = new Date(receipt.dateTime).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <View style={styles.content}>
      <Text variant="heading">Чек на {formatPrice(receipt.total)}</Text>
      <Text color="textSecondary">{date}</Text>

      {!isAuthenticated ? (
        <>
          <Text color="textSecondary">Войдите, чтобы отправлять чеки и обновлять цены.</Text>
          <Button title="Войти" onPress={() => router.push('/sign-in')} />
        </>
      ) : submit.isSuccess ? (
        <Notice tone="success" text="Чек принят и ждёт обработки. Статус — в профиле." />
      ) : (
        <>
          {submit.isError ? <Notice tone="danger" text={getErrorMessage(submit.error)} /> : null}
          {!cityId ? <Notice text="Сначала выберите город." /> : null}
          <Button
            title="Отправить чек"
            loading={submit.isPending}
            disabled={!cityId}
            onPress={() => cityId && submit.mutate({ receipt, cityId })}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.sm },
  product: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  image: { width: 64, height: 64, borderRadius: Radius.md },
  productText: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  action: { flex: 1, paddingHorizontal: Spacing.md },
});
