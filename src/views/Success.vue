<template>
  <Layout>
    <div class="success-container">
      <div class="success-card" v-if="status === 'paid'">
        <div class="success-header">
          <div class="success-icon"><i class="fas fa-check-circle"></i></div>
          <h1>{{ t('success.paid.title') }}</h1>
          <p>{{ t('success.paid.subtitle') }}</p>
        </div>

        <div class="download-section">
          <div class="download-header">
            <h2><i class="fas fa-download"></i> {{ t('success.files.title') }}</h2>
            <div class="download-list" v-if="orderData?.downloads?.length">
              <a
                v-for="(d, idx) in orderData.downloads"
                :key="d.url || idx"
                class="download-btn"
                :href="d.url"
                target="_blank"
                rel="noopener"
              >
                <i class="fas fa-file-arrow-down"></i> {{ t('success.files.download') }} {{ idx + 1 }}
              </a>
            </div>
          </div>
          <p class="muted">{{ t('success.files.note') }}</p>
          <div class="file-info">
            <div class="file-info-item"><i class="fas fa-clock"></i> {{ t('success.files.active24h') }}</div>
          </div>
        </div>

        <div class="action-buttons">
          <RouterLink to="/support" class="action-btn btn-primary"><i class="fas fa-book"></i> {{ t('success.buttons.installGuide') }}</RouterLink>
          <RouterLink to="/shop" class="action-btn btn-secondary"><i class="fas fa-store"></i> {{ t('success.buttons.backToShop') }}</RouterLink>
        </div>
      </div>

      <div class="success-card" v-else>
        <div class="success-header" style="text-align: center;">
          <div class="success-icon" v-if="status !== 'error'"><i class="fas fa-spinner fa-spin"></i></div>
          <div class="success-icon" v-else><i class="fas fa-exclamation-triangle"></i></div>
          <h1 v-if="status !== 'error'">{{ t('success.checking.title') }}</h1>
          <h1 v-else>{{ t('success.error.title') }}</h1>
          <p class="muted" v-if="status === 'checking'">{{ t('success.checking.title') }}</p>
          <p class="muted" v-else-if="status === 'pending'">{{ t('success.pending.note') }}</p>
          <p class="muted" v-else-if="status === 'error'">{{ error || t('success.error.generic') }}</p>
          <p class="muted" v-else>{{ t('success.unknown.note') }}</p>
        </div>
        <div class="action-buttons">
          <RouterLink to="/support" class="action-btn btn-primary"><i class="fas fa-life-ring"></i> Поддержка</RouterLink>
          <RouterLink to="/shop" class="action-btn btn-secondary"><i class="fas fa-store"></i> Магазин</RouterLink>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useCart } from '../stores/cart';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { getOrderStatus, resolvePaypalOrder, capturePaypalOrder } from '../lib/api';
import { useI18n } from '../i18n';

const route = useRoute();
const cart = useCart();
const { t } = useI18n();

const status = ref<'checking' | 'paid' | 'pending' | 'unknown' | 'error'>('checking');
const error = ref<string | null>(null);
const orderData = ref<Record<string, any> | null>(null);
let pollTimer: number | undefined;

async function pollStatus(orderId: string) {
  // Первый запрос сразу
  try {
    const order = await getOrderStatus(orderId);
    orderData.value = order as any;
    if (order?.status === 'paid') { status.value = 'paid'; return; }
  } catch (_) { /* ignore */ }

  // Далее каждые 5 секунд
  if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined; }
  pollTimer = window.setInterval(async () => {
    try {
      const order = await getOrderStatus(orderId);
      orderData.value = order as any;
      if (order?.status === 'paid') {
        status.value = 'paid';
        if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined; }
      }
    } catch (e: any) {
      try {
        const msg = typeof e?.message === 'string' ? e.message : '';
        const parsed = msg && msg.trim().startsWith('{') ? JSON.parse(msg) : null;
        const apiError = parsed?.error || msg;
        if (apiError && String(apiError).toLowerCase().includes('order not found')) {
          error.value = 'Заказ не найден. Проверьте ссылку или свяжитесь с поддержкой.';
          status.value = 'error';
          if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined; }
          return;
        }
      } catch (_) { /* ignore */ }
      // прочие ошибки игнорируем, продолжаем поллинг
    }
  }, 5000);
}

onMounted(async () => {
  const params = new URLSearchParams(location.search);
  const provider = params.get('provider');
  const token = params.get('token');

  // Новый PayPal-флоу: capture → resolve → fetch order
  if (provider === 'paypal' && token) {
    try {
      // 1) capture — идемпотентно
      await capturePaypalOrder(token);

      // 2) resolve → получить orderId
      const r = await resolvePaypalOrder(token);
      const orderId = r?.orderId || undefined;
      if (!orderId) {
        status.value = 'error';
        error.value = 'Не удалось определить номер заказа (orderId). Свяжитесь с поддержкой.';
        return;
      }

      // 3) получить заказ; если paid — бэк вернет downloads
      const order = await getOrderStatus(orderId);
      orderData.value = order as any;
      status.value = order?.status === 'paid' ? 'paid' : 'pending';
      cart.clear();
    } catch (e: any) {
      status.value = 'error';
      try {
        const msg = typeof e?.message === 'string' ? e.message : '';
        const parsed = msg && msg.trim().startsWith('{') ? JSON.parse(msg) : null;
        error.value = parsed?.error || parsed?.detail || 'Ошибка подтверждения PayPal';
      } catch {
        error.value = 'Ошибка подтверждения PayPal';
      }
    }
    return;
  }

  // Старый флоу: по orderId
  const paramOrderId = route.params.orderId as string | undefined;
  const storedOrderId = sessionStorage.getItem('orderId') || undefined;
  const effectiveOrderId = paramOrderId || storedOrderId;
  if (effectiveOrderId) {
    cart.clear();
    if (storedOrderId) sessionStorage.removeItem('orderId');
    try {
      const order = await getOrderStatus(effectiveOrderId);
      orderData.value = order as any;
      if (order?.status === 'paid') {
        status.value = 'paid';
      } else {
        await pollStatus(effectiveOrderId);
      }
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : '';
      try {
        const parsed = msg && msg.trim().startsWith('{') ? JSON.parse(msg) : null;
        const apiError = parsed?.error || msg;
        if (apiError && String(apiError).toLowerCase().includes('order not found')) {
          error.value = 'Заказ не найден. Проверьте ссылку или свяжитесь с поддержкой.';
          status.value = 'error';
          return;
        }
      } catch (_) { /* ignore */ }
      await pollStatus(effectiveOrderId);
    }
  } else {
    status.value = 'unknown';
  }
});

onUnmounted(() => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined; }
});

onBeforeRouteLeave(() => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = undefined; }
});

//
</script>

<style scoped>
.success-container { max-width: 800px; margin: 60px auto; padding: 0 20px; }
.success-card { background: rgba(0,15,30,0.7); border-radius: 16px; border: 1px solid rgba(0,207,255,0.2); padding: 40px; }
.success-header { text-align: center; margin-bottom: 30px; }
.success-icon { font-size: 5rem; color: var(--primary); margin-bottom: 20px; }
.success-header h1 { font-size: 2.2rem; background: linear-gradient(90deg,#00cfff,#3399ff); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; font-weight: 800; }
.muted { color: rgba(255,255,255,0.7); }
.download-section { background: rgba(0,207,255,0.05); border: 1px dashed rgba(0,207,255,0.3); border-radius: 12px; padding: 25px; margin-bottom: 30px; }
.download-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.download-list { display: flex; gap: 10px; flex-wrap: wrap; }
.download-btn { background: linear-gradient(to right,#00cfff,#3399ff); color: #000; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
.file-info { display: flex; gap: 15px; margin-top: 15px; }
.file-info-item { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px 15px; display: flex; align-items: center; gap: 8px; font-size: .9rem; }
.action-buttons { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
.action-btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
.btn-primary { background: linear-gradient(to right,#00cfff,#3399ff); color: #000; }
.btn-secondary { background: rgba(0,207,255,0.1); color: var(--primary); border: 1px solid var(--primary); }

@media (max-width: 768px) {
  .success-container { margin: 30px auto; padding: 0 16px; }
  .success-card { padding: 24px; }
  .success-header h1 { font-size: 1.6rem; }
  .download-header { flex-direction: column; align-items: stretch; gap: 12px; }
  .file-info { flex-direction: column; }
}
</style>


