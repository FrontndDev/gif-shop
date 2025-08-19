<template>
  <Layout>
    <main class="main">
      <div class="preview-wrapper">
        <div class="preview-container">
          <span v-if="product.badge" class="badge">{{ product.badge }}</span>
          <video class="protected-video" autoplay loop muted playsinline>
            <source :src="product.video" type="video/mp4" />
          </video>
        </div>
      </div>
      <div class="info">
        <h2>{{ product.title }}</h2>
        <div class="price">{{ product.price.toFixed(2) }} €</div>
        <div class="actions">
          <button class="btn btn-cart" @click="addToCart">
            <i class="fas fa-cart-plus"></i> В корзину
          </button>
          <RouterLink class="btn btn-buy" to="/payment">
            <i class="fas fa-credit-card"></i> Купить
          </RouterLink>
        </div>
        <div class="desc">
          <p>Эффектная анимированная иллюстрация премиум-класса для оформления вашего профиля Steam.</p>
          <ul class="features">
            <li>Универсальный дизайн</li>
            <li>Оптимизированный файл</li>
            <li>Бесплатная кастомизация</li>
            <li>Высокое разрешение</li>
            <li>Быстрая доставка</li>
          </ul>
        </div>
      </div>
    </main>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '../stores/cart';

const route = useRoute();
const cart = useCart();

const catalog = {
  '1': { id: '1', title: 'Cyber Neon — Анимированная иллюстрация Steam', price: 8, video: '/mp4.mp4', badge: 'Хит продаж' },
  '2': { id: '2', title: 'Power — Анимированная иллюстрация Steam', price: 6, video: '/mp4.mp4', badge: 'Новинка' },
  '3': { id: '3', title: 'Cyberpunk 2077 — Анимированная иллюстрация Steam', price: 10, video: '/mp4.mp4', badge: 'Скидка' },
  '4': { id: '4', title: 'Exclusive Showcase — Анимированная иллюстрация Steam', price: 15, video: '/mp4.mp4', badge: 'Эксклюзив' },
};

const product = computed(() => {
  const id = (route.params.id as string) || '2';
  return catalog[id] || catalog['2'];
});

function addToCart() {
  cart.add({ id: product.value.id, name: product.value.title, price: product.value.price, currency: '€', quantity: 1 });
}
</script>

<style scoped>
.main { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 40px; max-width: 1200px; margin: 40px auto; padding: 0 5%; }
.preview-wrapper { flex: 1 1 55%; min-width: 300px; max-width: 630px; position: relative; }
.preview-container { border-radius: 16px; overflow: hidden; background: linear-gradient(145deg,#0a1e30,#06121e); border: 1px solid rgba(0,207,255,0.2); position: relative; padding-top: 150%; }
.protected-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; top: 15px; right: 15px; padding: 6px 12px; border-radius: 20px; font-size: .75rem; font-weight: 700; background: var(--primary); color: #000; }
.info { flex: 1 1 40%; min-width: 300px; display: flex; flex-direction: column; gap: 20px; background: rgba(0, 15, 30, 0.45); padding: 30px; border-radius: 16px; border: 1px solid rgba(0,207,255,0.2); }
.info h2 { font-size: 1.8rem; font-weight: 700; background: linear-gradient(90deg,#00cfff,#3399ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.price { font-size: 1.6rem; font-weight: 700; color: var(--primary); }
.actions { display: flex; gap: 12px; margin: 15px 0; flex-direction: row-reverse; justify-content: flex-end; }
.btn { padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: .95rem; cursor: pointer; transition: .3s; display: inline-flex; align-items: center; gap: 8px; border: none; text-decoration: none; }
.btn-cart { background: rgba(0,207,255,0.15); color: var(--primary); border: 1px solid var(--primary); }
.btn-buy { background: linear-gradient(90deg,#00cfff,#3399ff); color: #000; }
.desc { font-size: 1rem; color: #e0f7ff; line-height: 1.7; }
.features { margin-top: 10px; padding-left: 0; list-style: none; }
.features li { margin-bottom: 12px; padding-left: 28px; position: relative; }
.features li::before { content: "\f00c"; font-family: "Font Awesome 6 Free"; font-weight: 900; color: var(--primary); position: absolute; left: 0; top: 2px; }
</style>


