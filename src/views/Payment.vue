<template>
  <Layout>
    <div class="page-header">
      <h2>{{ t('payment.header.title') }}</h2>
      <p>{{ t('payment.header.subtitle') }}</p>
      <p v-if="orderId" class="order-id">{{ t('payment.order.number') }}: <strong>{{ orderId }}</strong></p>
    </div>

    <div class="payment-container">
      <aside class="order-summary">
        <h3><i class="fas fa-receipt"></i> {{ t('payment.order.summary') }}</h3>

        <div v-if="loadingProduct" class="order-list">
          <div class="product-item">
            <div class="skeleton-thumb shimmer"></div>
            <div class="product-info">
              <div class="skeleton-line title shimmer"></div>
              <div class="skeleton-line w50 shimmer"></div>
            </div>
          </div>
        </div>

        <div v-else-if="items.length" class="order-list">
          <div class="product-item" v-for="(it, idx) in items" :key="String(it.id)+'_'+idx">
            <img :src="it.image || placeholder" :alt="it.name" class="product-image">
            <div class="product-info">
              <div class="product-name">{{ it.name }}</div>
              <div class="product-price">{{ formatPriceByPaymentMethod(it.price, it.priceUSD, payment) }}</div>
            </div>
          </div>
        </div>

        <div class="summary-details">
          <div class="summary-total"><span>{{ t('payment.order.total') }}:</span><span class="total-amount">{{ total.toFixed(2) }} {{ getCurrencyByPaymentMethod(payment) }}</span></div>
        </div>
      </aside>

      <main class="payment-section">
        <h3><i class="fas fa-credit-card"></i> {{ t('payment.method.title') }}</h3>
        <form @submit.prevent="onSubmit" id="payment-form">
          <div class="form-group">
            <label for="email" class="form-label">{{ t('payment.form.email') }}</label>
            <input type="email" id="email" v-model="email" class="form-control" placeholder="your@email.com" required>
            <div class="error-message" v-show="emailError">{{ t('payment.form.emailInvalid') }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Способ оплаты *</label>
            <div class="payment-methods">
              <label class="payment-method-tile">
                <input type="radio" value="yookassa" v-model="payment"/>
                <i class="payment-icon yookassa-color fas fa-credit-card"></i>
                <span class="payment-name">{{ t('payment.method.yookassa') }}</span>
                <span class="payment-description">{{ t('payment.method.yookassa.desc') }}</span>
              </label>
              <label class="payment-method-tile">
                <input type="radio" value="paypal" v-model="payment"/>
                <i class="payment-icon paypal-color fab fa-paypal"></i>
                <span class="payment-name">{{ t('payment.method.paypal') }}</span>
                <span class="payment-description">{{ t('payment.method.paypal.desc') }}</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="submitting || !items.length">
            <template v-if="submitting">
              <i class="fas fa-spinner fa-spin"></i> Обработка…
            </template>
            <template v-else>
              <i class="fas fa-lock"></i> {{ t('payment.button.pay') }} {{ total.toFixed(2) }} {{ getCurrencyByPaymentMethod(payment) }}
            </template>
          </button>

          <div class="secure-payment"><i class="fas fa-lock"></i> {{ t('payment.secure') }}</div>

          <p class="notes">
            {{ t('payment.agree.prefix') }}
            <RouterLink to="/offer">{{ t('payment.agree.offer') }}</RouterLink>
            {{ t('payment.agree.and') }}
            <RouterLink to="/privacy">{{ t('payment.agree.privacy') }}</RouterLink>
            .
            <br/>
            ИНН самозанятого: <strong>910509844791</strong>
          </p>
        </form>
      </main>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import {ref, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useCart} from '../stores/cart';
import {createPayment, createPaypalOrderRaw, createOrder, getProductById, type ApiProduct} from '../lib/api';
import { useI18n } from '../i18n';
import { usePrice } from '../composables/usePrice';
import { usePaymentPrice } from '../composables/usePaymentPrice';

const route = useRoute();
const router = useRouter();
const email = ref('');
const emailError = ref(false);
const { t, lang } = useI18n();
const payment = ref<'paypal' | 'yookassa'>(lang.value === 'en' ? 'paypal' : 'yookassa');
const placeholder = 'https://via.placeholder.com/300x300/0a1e30/00cfff?text=AeroDesign';
const cart = useCart();
const selectedProduct = ref<ApiProduct | null>(null);
const loadingProduct = ref(false);
// t and lang are already initialized above
const { getCurrency } = usePrice();
const { formatPriceByPaymentMethod, getCurrencyByPaymentMethod, getCartTotalByPaymentMethod } = usePaymentPrice();
const orderId = computed(() => (route.params.productId as string) || (sessionStorage.getItem('orderId') || ''));
const items = computed(() => {
  if (selectedProduct.value) {
    return [{
      id: selectedProduct.value.id,
      name: selectedProduct.value.title,
      price: selectedProduct.value.price,
      priceUSD: selectedProduct.value.priceUSD,
      currency: '₽',
      image: (selectedProduct.value as any).video,
      quantity: 1
    }];
  }
  return cart.items;
});
const total = computed(() => getCartTotalByPaymentMethod(payment.value));
const submitting = ref(false);

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function onSubmit() {
  if (!items.value.length) {
    alert('Корзина пуста. Добавьте товары перед оплатой.');
    return;
  }
  emailError.value = !validateEmail(email.value);
  if (emailError.value) return;
  submitting.value = true;
  // 1) Создаем заказ на бэкенде (pending)
  const orderPayload = {
    name: 'Store purchase',
    telegramDiscord: email.value || 'unknown',
    steamProfile: '-',
    style: 'store',
    colorTheme: 'store',
    details: JSON.stringify({
      items: items.value.map((i: any) => ({id: i.id, name: i.name, price: i.price, quantity: i.quantity})),
      total: Number(total.value.toFixed(2)),
      email: email.value
    })
  };
  const created = await createOrder(orderPayload as any);
  const orderId = (created as any)?.id as string;
  if (!orderId) {
    alert('Не удалось создать заказ. Попробуйте позже.');
    submitting.value = false;
    return;
  }
  sessionStorage.setItem('orderId', orderId);
  if (payment.value === 'yookassa') {
    try {
      const res = await createPayment({
        amount: Number(total.value.toFixed(2)),
        currency: 'RUB',
        description: `Оплата заказа (${items.value.length} шт.)`,
        returnUrl: window.location.origin + '/success/' + orderId,
        metadata: {
          email: email.value,
          itemsCount: String(items.value.length),
          ids: items.value.map((i: any) => i.id).join(','),
          orderId
        }
      });
      const url =
          res?.confirmation?.confirmation_url ||
          (res as any)?.confirmation?.url ||
          (res as any)?.confirmation_url ||
          (res as any)?.confirmationUrl ||
          (res as any)?.redirectUrl;
      if (url) {
        window.location.replace(url);
        return;
      }
      if ((res as any)?.status === 'succeeded' || (res as any)?.paid === true) {
        await router.push(`/success/${orderId}`);
        return;
      }
      console.error('Не удалось получить ссылку на оплату. Ответ:', res);
      alert('Не удалось получить ссылку на оплату. Попробуйте позже.');
    } catch (e: any) {
      console.error('Ошибка создания платежа:', e);
      alert(e?.message || 'Ошибка создания платежа');
    }
  }
  if (payment.value === 'paypal') {
    try {
      const res = await createPaypalOrderRaw({
        amount: Number(total.value.toFixed(2)).toFixed(2),
        currency: 'USD',
        metadata: { orderId }
      } as any);
      const approve = (res?.links || []).find((l: any) => l?.rel === 'approve')?.href;
      if (approve) {
        sessionStorage.setItem('orderId', orderId);
        window.location.href = approve;
        return;
      }
      alert('Не удалось получить ссылку approve для PayPal');
    } catch (e: any) {
      console.error('Ошибка создания PayPal заказа:', e);
      alert(e?.message || 'Ошибка создания PayPal заказа');
    }
  }
  // fallback (например, в тестовом режиме)
  setTimeout(() => router.push(`/success/${orderId}`), 500);
  submitting.value = false;
}

onMounted(async () => {
  const pid = route.params.productId as string | undefined;
  if (pid) {
    try {
      loadingProduct.value = true;
      selectedProduct.value = await getProductById(pid);
    } catch {
      selectedProduct.value = null;
    } finally {
      loadingProduct.value = false;
    }
  }
});
</script>

<style scoped>
.page-header {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 5%;
  text-align: center;
}

.page-header h2 {
  font-size: 2.2rem;
  background: linear-gradient(90deg, #00cfff, #3399ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  font-weight: 800;
}

.page-header p {
  color: rgba(255, 255, 255, 0.7);
}

.page-header .order-id {
  color: #aab8c2;
  font-size: .95rem;
  margin-top: 6px;
}

.payment-container {
  max-width: 1000px;
  margin: 0 auto 50px;
  padding: 0 5%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 30px;
}

.order-summary {
  background: rgba(0, 15, 30, 0.45);
  padding: 25px;
  border-radius: 16px;
  border: 1px solid rgba(0, 207, 255, 0.2);
}

.payment-section {
  background: rgba(0, 15, 30, 0.45);
  padding: 25px;
  border-radius: 16px;
  border: 1px solid rgba(0, 207, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.order-summary h3 {
  color: var(--primary);
  font-size: 1.2rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.product {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 207, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(0, 207, 255, 0.2);
  margin: 15px 0;
  position: relative;
}

.product-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: var(--primary);
  color: #000;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: .8rem;
  font-weight: 600;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: rgba(0, 207, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 12px;
}

.product-image {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(0, 207, 255, 0.3);
}

.product-name {
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--accent);
  font-size: .95rem;
}

.product-price {
  color: var(--primary);
  font-weight: 700;
  font-size: .95rem;
}

.product-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.product-description {
  color: #aaa;
  font-size: .9rem;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: .95rem;
  font-weight: 500;
  color: var(--primary);
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
}

.error-message {
  color: #ff4d4d;
  font-size: .8rem;
  margin-top: 5px;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 12px 0;
}

.payment-method-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 12px;
  gap: 6px;
  text-align: center;
  border: 2px solid rgba(0, 207, 255, 0.2);
  border-radius: 12px;
  background: rgba(0, 207, 255, 0.05);
  cursor: pointer;
  transition: all .2s ease;
}

.payment-method-tile input {
  position: absolute;
  opacity: 0;
}

.payment-method-tile:hover {
  transform: translateY(-2px);
}

.payment-method-tile input:checked ~ .payment-icon, .payment-method-tile input:checked ~ .payment-name {
  filter: none;
}

.payment-method-tile input:checked ~ .payment-name {
  color: var(--accent);
  font-weight: 600;
}

.payment-method-tile input:checked ~ .payment-description {
  color: rgba(255, 255, 255, 0.7);
}

.payment-method-tile:has(input:checked) {
  background: rgba(0, 207, 255, 0.1);
  border-color: var(--primary);
  box-shadow: 0 5px 15px rgba(0, 207, 255, 0.2);
  transform: translateY(-3px);
}

.payment-icon {
  font-size: 1.8rem;
}

.payment-name {
  font-size: .95rem;
  color: var(--accent);
}

.payment-description {
  font-size: .75rem;
  color: rgba(255, 255, 255, 0.6);
}

.yookassa-color {
  color: #00cfff;
}

.paypal-color {
  color: #0070ba;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 8px;
  border: none;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(90deg, #00cfff, #3399ff);
  color: #000;
}

.summary-details {
  margin-top: 12px;
  padding-top: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 207, 255, 0.3);
  font-weight: 700;
  color: var(--accent);
}

.total-amount {
  color: var(--primary);
  font-size: 1.2rem;
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: .85rem;
  margin-top: 12px;
}

.notes {
  text-align: center;
  margin-top: 20px;
  font-size: .85rem;
  color: #aaa;
}

.notes a {
  color: var(--primary);
  text-decoration: none;
}

@media (max-width: 968px) {
  .payment-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    margin: 20px auto;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .btn {
    padding: 12px 18px;
  }
}

@media (max-width: 420px) {
  .card-header h2 {
    font-size: 1.4rem;
  }

  .summary {
    padding: 16px;
  }

  .product {
    padding: 14px;
  }
}

/* Skeleton */
.skeleton-thumb {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(0, 207, 255, 0.2);
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  margin: 8px 0;
  width: 80%;
}

.skeleton-line.title {
  height: 18px;
  width: 60%;
}

.skeleton-line.w50 {
  width: 50%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 25%, rgba(255, 255, 255, 0.16) 37%, rgba(255, 255, 255, 0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
</style>


