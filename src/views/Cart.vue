<template>
  <Layout>
    <div class="cart-container">
      <!-- Уведомление об изменении цен -->
      <div v-if="showPriceNotification" class="price-notification">
        <div class="notification-content">
          <i class="fas fa-info-circle"></i>
          <div class="notification-text">
            <strong>{{ t('cart.priceUpdated') }}</strong>
            <ul class="price-changes">
              <li v-for="change in priceChanges" :key="change">{{ change }}</li>
            </ul>
          </div>
          <button @click="showPriceNotification = false" class="notification-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="cart-header">
        <h2 class="cart-title">{{ t('cart.title') }}</h2>
        <div class="cart-actions">
          <button @click="clearCart" class="continue-shopping">
            <i class="fas fa-trash"></i> {{ t('cart.clear') }}
          </button>
        </div>
      </div>

      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
        <h3 class="empty-cart-text">{{ t('cart.empty') }}</h3>
        <RouterLink to="/shop" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> {{ t('cart.continue') }}
        </RouterLink>
      </div>

      <template v-else>
        <table class="cart-items">
          <thead>
          <tr><th>{{ t('cart.table.product') }}</th><th>{{ t('cart.table.price') }}</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>
                <div class="cart-item">
                  <video :src="item.image || placeholder" :alt="item.name" class="cart-item-video" autoplay muted playsinline v-smooth-loop @mouseenter="restartVideo" @mouseleave="continueVideo" />
                  <div class="cart-item-info">
                    <div class="cart-item-title">{{ lang === 'en' && item.titleEn ? item.titleEn : item.name }}</div>
                  </div>
                </div>
              </td>
              <td class="cart-item-price">{{ formatPriceByPaymentMethod(item.price, item.priceUSD, paymentMethod) }}</td>
              <td><button class="remove-btn" @click="remove(index)"><i class="fas fa-times"></i></button></td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary">
          <h3 class="summary-title">{{ t('common.total') }}</h3>
          
          <!-- Переключатель способа оплаты -->
          <div class="payment-method-selector">
            <label class="payment-method-option">
              <input type="radio" v-model="paymentMethod" value="yookassa" />
              <span>YooKassa (₽)</span>
            </label>
            <label class="payment-method-option">
              <input type="radio" v-model="paymentMethod" value="stripe" />
              <span>Stripe ($)</span>
            </label>
            <label class="payment-method-option">
              <input type="radio" v-model="paymentMethod" value="paypal" />
              <span>PayPal ($)</span>
            </label>
          </div>

          <div class="summary-row">
            <span>{{ t('common.items') }} ({{ items.length }})</span>
            <span class="summary-price">{{ total.toFixed(2) }} {{ getCurrencyByPaymentMethod(paymentMethod) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-total">{{ t('cart.summary.overall') }}</span>
            <span class="summary-price">{{ total.toFixed(2) }} {{ getCurrencyByPaymentMethod(paymentMethod) }}</span>
          </div>
          <RouterLink class="checkout-btn" to="/payment">
            <i class="fas fa-credit-card"></i> {{ t('common.checkout') }}
          </RouterLink>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { computed, ref, onMounted } from 'vue';
import { useCart } from '../stores/cart';
import { useI18n } from '../i18n';
import { usePrice } from '../composables/usePrice';
import { usePaymentPrice } from '../composables/usePaymentPrice';

const cart = useCart();
const items = computed(() => cart.items);
const placeholder = 'https://via.placeholder.com/80x80/0a1e30/00cfff?text=Product';
const { t, lang } = useI18n();
const { getCurrency } = usePrice();
const { formatPriceByPaymentMethod, getCurrencyByPaymentMethod, getCartTotalByPaymentMethod } = usePaymentPrice();

// Состояние выбранного способа оплаты
const paymentMethod = ref<'yookassa' | 'paypal' | 'stripe'>(lang.value === 'en' ? 'paypal' : 'yookassa');

// Общая сумма в зависимости от способа оплаты
const total = computed(() => getCartTotalByPaymentMethod(paymentMethod.value));

// Состояние для уведомлений об изменении цен
const priceChanges = ref<string[]>([]);
const showPriceNotification = ref(false);

function remove(index: number) { cart.removeByIndex(index); }
function clearCart() { cart.clear(); }

// Синхронизация цен при загрузке корзины
onMounted(async () => {
  if (items.value.length > 0) {
    try {
      const result = await cart.syncPrices();
      if (result.updated) {
        priceChanges.value = result.changes;
        showPriceNotification.value = true;
        
        // Автоматически скрыть уведомление через 5 секунд
        setTimeout(() => {
          showPriceNotification.value = false;
        }, 5000);
      }
    } catch (error) {
      console.warn('Ошибка при синхронизации цен:', error);
    }
  }
});

// Обработка наведения мыши на видео
function restartVideo(event: Event) {
  const video = event.target as HTMLVideoElement;
  if (video && video.tagName === 'VIDEO') {
    // Перезапускаем видео с начала
    video.currentTime = 0;
    video.play().catch(() => {
      // Игнорируем ошибки воспроизведения
    });
  }
}

function continueVideo(event: Event) {
  const video = event.target as HTMLVideoElement;
  if (video && video.tagName === 'VIDEO') {
    // Продолжаем воспроизведение (если видео было приостановлено)
    video.play().catch(() => {
      // Игнорируем ошибки воспроизведения
    });
  }
}
</script>

<style scoped>
.cart-container { max-width: 1200px; margin: 40px auto; padding: 0 5%; }
.cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.cart-title { font-size: 2rem; background: linear-gradient(90deg, #00cfff, #3399ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
.cart-actions { display: flex; gap: 15px; }
.cart-items { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
.cart-items th { text-align: left; padding: 15px 10px; color: var(--primary); font-weight: 600; border-bottom: 1px solid rgba(0,207,255,0.2); }
.cart-items td { padding: 20px 10px; border-bottom: 1px solid rgba(0,207,255,0.2); vertical-align: middle; }
.cart-item { display: flex; align-items: center; gap: 20px; }
.cart-item-video { 
  width: 80px; 
  height: 80px; 
  border-radius: 8px; 
  object-fit: cover; 
  border: 1px solid rgba(0,207,255,0.2); 
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}

.cart-item:hover .cart-item-video {
  transform: scale(1.1);
  filter: brightness(1.2);
}
.cart-item-title { font-weight: 600; margin-bottom: 5px; color: #e0f7ff; }
.cart-item-price { color: var(--primary); font-weight: 600; }
.remove-btn { color: #ff4d4d; background: transparent; border: none; cursor: pointer; font-size: 1.2rem; }
.cart-summary { background: linear-gradient(145deg, #0a1e30, #06121e); border-radius: 16px; padding: 30px; border: 1px solid rgba(0,207,255,0.2); margin-left: auto; max-width: 400px; }
.summary-title { font-size: 1.5rem; color: var(--primary); margin-bottom: 20px; font-weight: 600; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,207,255,0.2); }
.summary-total { font-size: 1.2rem; font-weight: 700; color: #e0f7ff; }
.summary-price { color: var(--primary); font-weight: 700; }
.checkout-btn { width: 100%; padding: 15px; background: linear-gradient(90deg, #00cfff, #3399ff); color: #000; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px; }

@media (max-width: 768px) {
  .cart-items thead { display: none; }
  .cart-items, .cart-items tbody, .cart-items tr, .cart-items td { display: block; width: 100%; }
  .cart-items tr { border: 1px solid rgba(0,207,255,0.2); border-radius: 12px; margin-bottom: 15px; padding: 12px; }
  .cart-items td { padding: 10px 0; border: none; }
  .cart-item { gap: 12px; }
  .cart-item-video { width: 64px; height: 64px; }
  .cart-summary { max-width: none; margin-left: 0; }
}
.empty-cart { text-align: center; padding: 60px 0; }
.empty-cart-icon { font-size: 5rem; color: var(--primary); margin-bottom: 20px; opacity: 0.5; }
.empty-cart-text { font-size: 1.5rem; color: #e0f7ff; margin-bottom: 30px; }
.continue-shopping { display: inline-flex; align-items: center; gap: 10px; padding: 12px 25px; background: rgba(0,207,255,0.1); color: var(--primary); border-radius: 8px; text-decoration: none; border: 1px solid var(--primary); }

.payment-method-selector { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,207,255,0.2); }
.payment-method-option { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; cursor: pointer; color: #e0f7ff; }
.payment-method-option input[type="radio"] { accent-color: var(--primary); }
.payment-method-option:hover { color: var(--primary); }

/* Стили для уведомления об изменении цен */
.price-notification {
  background: linear-gradient(135deg, #ff9f43, #ff6b6b);
  border: 1px solid #ff9f43;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 15px;
  animation: slideDown 0.3s ease-out;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #000;
}

.notification-content i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.notification-text {
  flex: 1;
}

.notification-text strong {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
}

.price-changes {
  margin: 0;
  padding-left: 20px;
  font-size: 0.9rem;
}

.price-changes li {
  margin-bottom: 4px;
}

.notification-close {
  background: transparent;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


