<template>
  <Layout>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Оформление заказа</h2>
          <p>Выберите удобный способ оплаты</p>
        </div>

        <div class="product skeleton" v-if="loadingProduct">
          <div class="skeleton-image shimmer"></div>
          <div class="product-info">
            <div class="skeleton-line title shimmer"></div>
            <div class="skeleton-line shimmer"></div>
            <div class="skeleton-line w50 shimmer"></div>
          </div>
        </div>

        <div class="product" v-else-if="items.length">
          <span class="product-badge">К оплате</span>
          <img :src="items[0].image || placeholder" alt="Товар" class="product-image" />
          <div class="product-info">
            <h3 class="product-title">{{ items[0].name }}</h3>
            <p class="product-description">Товары в корзине: {{ items.length }}</p>
            <div class="product-price">{{ total.toFixed(2) }} ₽</div>
          </div>
        </div>

        <form @submit.prevent="onSubmit" id="payment-form">
          <div class="form-group">
            <label for="email" class="form-label">Электронная почта *</label>
            <input type="email" id="email" v-model="email" class="form-control" placeholder="your@email.com" required>
            <div class="error-message" v-show="emailError">Пожалуйста, введите корректный email</div>
          </div>

          <div class="form-group">
            <label class="form-label">Способ оплаты *</label>
            <div class="payment-methods">
              <label class="payment-method">
                <input type="radio" value="paypal" v-model="payment" />
                <span>PayPal</span>
              </label>
              <label class="payment-method">
                <input type="radio" value="yookassa" v-model="payment" />
                <span>ЮKassa</span>
              </label>
            </div>
          </div>

          <div class="summary">
            <div class="summary-item"><span>Товары ({{ items.length }}):</span><span>{{ total.toFixed(2) }} ₽</span></div>
            <div class="summary-total"><span>Итого к оплате:</span><span class="total-price">{{ total.toFixed(2) }} ₽</span></div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="submitting || !items.length">
            <template v-if="submitting">
              <i class="fas fa-spinner fa-spin"></i> Обработка…
            </template>
            <template v-else>
              Перейти к оплате
              <i class="fas fa-arrow-right"></i>
            </template>
          </button>

          <p class="notes">
            ИНН самозанятого: <strong>910509844791</strong>
            <br/>
            Нажимая кнопку, вы соглашаетесь с <RouterLink to="/offer">договором оферты</RouterLink>
            и <RouterLink to="/privacy">политикой конфиденциальности</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCart } from '../stores/cart';
import { createPayment, createPaypalOrder, createOrder, getProductById, type ApiProduct } from '../lib/api';

const route = useRoute();
const router = useRouter();
const email = ref('');
const emailError = ref(false);
const payment = ref<'paypal' | 'yookassa'>('yookassa');
const placeholder = 'https://via.placeholder.com/300x300/0a1e30/00cfff?text=AeroDesign';
const cart = useCart();
const selectedProduct = ref<ApiProduct | null>(null);
const loadingProduct = ref(false);
const items = computed(() => {
  if (selectedProduct.value) {
    return [{ id: selectedProduct.value.id, name: selectedProduct.value.title, price: selectedProduct.value.price, currency: '₽', image: (selectedProduct.value as any).video, quantity: 1 }];
  }
  return cart.items;
});
const total = computed(() => items.value.reduce((s: number, i: any) => s + i.price, 0));
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
      items: items.value.map((i: any) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
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
    const res = await createPaypalOrder({ amount: Number(total.value.toFixed(2)), currency: 'USD' });
    const approve = res?.links?.find((l: any) => l.rel === 'approve')?.href;
    if (approve) {
      window.location.href = approve;
      return;
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
.container { max-width: 800px; margin: 40px auto; padding: 0 5%; }
.card { background: #141820; border-radius: 16px; padding: 30px; border: 1px solid rgba(0,207,255,0.2); }
.card-header h2 { font-size: 1.8rem; margin-bottom: 8px; background: linear-gradient(90deg,#00cfff,#3399ff); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
.card-header p { color: #aaa; }
.product { display: flex; gap: 20px; padding: 20px; background: rgba(0,207,255,0.05); border-radius: 12px; border: 1px solid rgba(0,207,255,0.2); margin: 25px 0; position: relative; }
.product-badge { position: absolute; top: -10px; right: 20px; background: var(--primary); color: #000; padding: 4px 12px; border-radius: 20px; font-size: .8rem; font-weight: 600; }
.product-image { width: 120px; height: 120px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0,207,255,0.3); }
.product-title { font-size: 1.2rem; margin-bottom: 8px; font-weight: 600; }
.product-description { color: #aaa; font-size: .9rem; margin-bottom: 8px; }
.product-price { font-size: 1.3rem; font-weight: 700; color: var(--primary); }
.form-group { margin-bottom: 20px; }
.form-label { display: block; margin-bottom: 8px; font-size: .95rem; font-weight: 500; color: var(--primary); }
.form-control { width: 100%; padding: 12px 15px; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,207,255,0.2); border-radius: 8px; color: #fff; font-size: 1rem; }
.error-message { color: #ff4d4d; font-size: .8rem; margin-top: 5px; }
.payment-methods { display: grid; grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); gap: 15px; }
.payment-method { display: flex; gap: 8px; align-items: center; padding: 12px; border: 1px solid rgba(0,207,255,0.2); border-radius: 8px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 24px; border-radius: 8px; border: none; width: 100%; cursor: pointer; font-weight: 600; }
.btn-primary { background: linear-gradient(90deg,#00cfff,#3399ff); color: #000; }
.summary { background: rgba(0,207,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(0,207,255,0.2); margin: 30px 0; }
.summary-item, .summary-total { display: flex; justify-content: space-between; margin-bottom: 12px; }
.total-price { color: var(--primary); font-size: 1.2rem; font-weight: 700; }
.notes { text-align: center; margin-top: 20px; font-size: .85rem; color: #aaa; }
.notes a { color: var(--primary); text-decoration: none; }

@media (max-width: 768px) {
  .container { margin: 20px auto; padding: 0 4%; }
  .card { padding: 20px; }
  .product { flex-direction: column; align-items: center; text-align: center; }
  .product-image { width: 100%; max-width: 260px; height: auto; }
  .payment-methods { grid-template-columns: 1fr; }
  .btn { padding: 12px 18px; }
}

@media (max-width: 420px) {
  .card-header h2 { font-size: 1.4rem; }
  .summary { padding: 16px; }
  .product { padding: 14px; }
}

/* Skeleton */
.skeleton-image { width: 120px; height: 120px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(0,207,255,0.2); }
.skeleton-line { height: 14px; border-radius: 6px; background: rgba(255,255,255,0.06); margin: 8px 0; width: 80%; }
.skeleton-line.title { height: 18px; width: 60%; }
.skeleton-line.w50 { width: 50%; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.16) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
</style>


