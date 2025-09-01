<template>
  <Layout>
    <div class="cart-container">
      <div class="cart-header">
        <h2 class="cart-title">Ваша корзина</h2>
        <div class="cart-actions">
          <button @click="clearCart" class="continue-shopping">
            <i class="fas fa-trash"></i> Очистить корзину
          </button>
        </div>
      </div>

      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
        <h3 class="empty-cart-text">Ваша корзина пуста</h3>
        <RouterLink to="/shop" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> Продолжить покупки
        </RouterLink>
      </div>

      <template v-else>
        <table class="cart-items">
          <thead>
          <tr><th>Товар</th><th>Цена</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>
                <div class="cart-item">
                  <img :src="item.image || placeholder" :alt="item.name" class="cart-item-img" />
                  <div class="cart-item-info">
                    <div class="cart-item-title">{{ item.name }}</div>
                  </div>
                </div>
              </td>
              <td class="cart-item-price">{{ item.price.toFixed(2) }} {{ item.currency }}</td>
              <td><button class="remove-btn" @click="remove(index)"><i class="fas fa-times"></i></button></td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary">
          <h3 class="summary-title">Итого</h3>
          <div class="summary-row">
            <span>Товары ({{ items.length }})</span>
            <span class="summary-price">{{ total.toFixed(2) }} ₽</span>
          </div>
          <div class="summary-row">
            <span class="summary-total">Общая сумма</span>
            <span class="summary-price">{{ total.toFixed(2) }} ₽</span>
          </div>
          <RouterLink class="checkout-btn" to="/payment">
            <i class="fas fa-credit-card"></i> Оформить заказ
          </RouterLink>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { computed } from 'vue';
import { useCart } from '../stores/cart';

const cart = useCart();
const items = cart.items;
const total = computed(() => items.reduce((s, i) => s + i.price, 0));
const placeholder = 'https://via.placeholder.com/80x80/0a1e30/00cfff?text=Product';

function remove(index: number) { cart.removeByIndex(index); }
function clearCart() { cart.clear(); }
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
.cart-item-img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0,207,255,0.2); }
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
  .cart-item-img { width: 64px; height: 64px; }
  .cart-summary { max-width: none; margin-left: 0; }
}
.empty-cart { text-align: center; padding: 60px 0; }
.empty-cart-icon { font-size: 5rem; color: var(--primary); margin-bottom: 20px; opacity: 0.5; }
.empty-cart-text { font-size: 1.5rem; color: #e0f7ff; margin-bottom: 30px; }
.continue-shopping { display: inline-flex; align-items: center; gap: 10px; padding: 12px 25px; background: rgba(0,207,255,0.1); color: var(--primary); border-radius: 8px; text-decoration: none; border: 1px solid var(--primary); }
</style>


