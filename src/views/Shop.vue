<template>
  <Layout>
    <div class="search-container">
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input v-model="query" type="text" :placeholder="t('shop.search.placeholder')">
      </div>
    </div>

    <div class="filters-mobile-bar">
      <button class="filters-toggle" @click="isSidebarOpen = true">
        <i class="fas fa-sliders"></i> {{ t('shop.filters.toggle') }}
      </button>
    </div>

    <div class="sidebar-overlay" v-if="isSidebarOpen" @click="isSidebarOpen = false"></div>

    <div class="layout">
      <aside class="sidebar" :class="{ open: isSidebarOpen }">
        <div class="sidebar-title"><h3>{{ t('shop.filters.title') }}</h3></div>
        <div class="sidebar-section">
          <h4><i class="fas fa-star"></i> {{ t('shop.filters.showcase') }}</h4>
          <label class="filter-option" v-for="it in showcaseTypesL10n" :key="it.id">
            <input type="checkbox" v-model="filters.showcase" :value="it.id"/>
            <span class="checkmark"></span>
            {{ it.label }}
          </label>
        </div>
        <div class="sidebar-section">
          <h4><i class="fas fa-palette"></i> {{ t('shop.filters.color') }}</h4>
          <label class="filter-option" v-for="c in colorsL10n" :key="c.id">
            <input type="checkbox" v-model="filters.colors" :value="c.id"/>
            <span class="checkmark"></span>
            <span class="color-option" :style="{ background: c.color }"></span>{{ c.label }}
          </label>
        </div>
        <div class="sidebar-section">
          <h4><i class="fas fa-gamepad"></i> {{ t('shop.filters.topic') }}</h4>
          <label class="filter-option" v-for="tp in topicsL10n" :key="tp.id">
            <input type="checkbox" v-model="filters.topics" :value="tp.id"/>
            <span class="checkmark"></span>
            {{ tp.label }}
          </label>
        </div>
      </aside>

      <main class="content">
        <div class="gallery">
          <div v-for="p in filteredProducts" :key="p.id" class="product">
            <RouterLink :to="{ name: 'product', params: { slug: p.slug || p.id } }" class="product-link">
              <div class="preview">
                <video 
                  :src="p.video || p.poster" 
                  :alt="p.title" 
                  muted 
                  playsinline 
                  loading="lazy" 
                  preload="metadata"
                  v-smooth-loop 
                  :ref="(el) => registerVideo(el as HTMLVideoElement, p.id)"
                  @mouseenter="restartVideo"
                  @mouseleave="continueVideo"
                />
                <span v-if="p?.badge" class="product-badge" :class="p.badgeClass">{{ p.badge }}</span>
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ lang === 'en' && p.titleEn ? p.titleEn : p.title }}</h3>
                <div class="product-price">{{ formatPrice(p.price, p.priceUSD) }}</div>
              </div>
            </RouterLink>
            <div class="product-actions">
              <RouterLink class="action-btn details-btn" :to="{ name: 'product', params: { slug: p.slug || p.id } }">
                <i class="fas fa-eye"></i> {{ t('common.details') }}
              </RouterLink>
              <button class="action-btn cart-add-btn" :class="{ 'in-cart': isInCart(p.id) }" @click="addToCart(p)">
                <i class="fas fa-cart-plus"></i> {{ isInCart(p.id) ? t('common.inCart') : t('common.addToCart') }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredProducts.length === 0 && query.trim()" class="no-results">
          <div class="no-results-icon"><i class="fas fa-search"></i></div>
          <h3 class="no-results-text">{{ t('shop.search.noResults') }}</h3>
          <p class="no-results-subtitle">{{ t('shop.search.tryDifferent') }}</p>
        </div>
        
        <div class="pager" v-if="pages > 1 && !query.trim()">
          <button class="pager-btn" :disabled="page<=1 || loading" @click="goPrev"><i class="fas fa-chevron-left"></i> {{ t('common.prev') }}</button>
          <div class="pager-list">
            <template v-for="(it, idx) in pageItems" :key="String(it)+'_'+idx">
              <span v-if="it === '…'" class="pager-ellipsis">…</span>
              <button v-else class="pager-num" :class="{ active: it === page }" @click="setPage(it as number)" :disabled="loading">{{ it }}</button>
            </template>
          </div>
          <button class="pager-btn" :disabled="page>=pages || loading" @click="goNext">{{ t('common.next') }} <i class="fas fa-chevron-right"></i></button>
        </div>
      </main>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import {computed, onMounted, reactive, ref, watch, onUnmounted} from 'vue';
import {useCart} from '../stores/cart';
import {useProducts} from '../stores/products';
import { getProductsPaged } from '../lib/api';
import { useI18n } from '../i18n';
import { usePrice } from '../composables/usePrice';
import { useRoute, useRouter } from 'vue-router';
import { useVideoManager } from '../composables/useVideoManager';

const query = ref('');
const cart = useCart();
const route = useRoute();
const router = useRouter();
const { t, lang } = useI18n();
const { formatPrice, getPrice, getCurrency } = usePrice();

// Глобальный менеджер видео
const { register } = useVideoManager();
const videoUnregisterFunctions = new Map<string, () => void>();

// Определение мобильного устройства
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
};

// Регистрация видео в глобальном менеджере
function registerVideo(el: HTMLVideoElement | null, productId: string) {
  if (!el) return;
  
  // Отменяем предыдущую регистрацию для этого продукта
  const existingUnregister = videoUnregisterFunctions.get(productId);
  if (existingUnregister) {
    existingUnregister();
  }
  
  const getPriority = () => {
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportHeight = window.innerHeight;
    return Math.abs(centerY - viewportHeight / 2);
  };

  const getVisible = () => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const unregister = register(el, getPriority, getVisible);
  videoUnregisterFunctions.set(productId, unregister);
  
  // Для мобильных устройств добавляем Intersection Observer для перезапуска видео
  if (isMobile.value) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Перезапускаем видео при попадании в обзор
          el.currentTime = 0;
          el.play().catch(() => {
            // Игнорируем ошибки воспроизведения
          });
        }
      });
    }, {
      threshold: 0.5, // 50% видео должно быть видно
      rootMargin: '50px'
    });
    
    observer.observe(el);
    
    // Сохраняем observer для очистки
    (el as any).__mobileObserver = observer;
  }
}

// Очистка при размонтировании
onUnmounted(() => {
  videoUnregisterFunctions.forEach(unregister => unregister());
  videoUnregisterFunctions.clear();
});

// Обработка наведения мыши на видео (только для десктопа)
function restartVideo(event: Event) {
  if (isMobile.value) return; // Не обрабатываем на мобильных
  
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
  if (isMobile.value) return; // Не обрабатываем на мобильных
  
  const video = event.target as HTMLVideoElement;
  if (video && video.tagName === 'VIDEO') {
    // Продолжаем воспроизведение (если видео было приостановлено)
    video.play().catch(() => {
      // Игнорируем ошибки воспроизведения
    });
  }
}

type Product = ReturnType<typeof useProducts>['items'][number] & {
  poster?: string;
  badgeClass?: string;
  colors?: string[];
  topics?: string[]
};

const products = ref<Product[]>([]);
const page = ref(Math.max(1, parseInt(String((route.query as any).page || '1'), 10) || 1));
const per = ref(10);
const total = ref(0);
const pages = ref(1);
const productsStore = useProducts();
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);

// Фильтрация продуктов по поисковому запросу
const filteredProducts = computed(() => {
  if (!query.value.trim()) {
    return products.value;
  }
  
  const searchTerm = query.value.toLowerCase().trim();
  return products.value.filter(product => {
    const title = product.title.toLowerCase();
    const titleEn = product.titleEn?.toLowerCase() || '';
    
    return title.includes(searchTerm) || titleEn.includes(searchTerm);
  });
});

const filters = reactive({showcase: [] as string[], colors: [] as string[], topics: [] as string[]});
const isSidebarOpen = ref(false);

function mapProducts(list: ReturnType<typeof useProducts>['items']): Product[] {
  return list.map(p => ({
    ...p,
    poster: '/preview.png',
    badgeClass: p.badge === 'Новинка' ? 'badge-new' : p.badge === 'Скидка' ? 'badge-sale' : p.badge?.includes('Эксклюзив') ? 'badge-exclusive' : 'badge-hit',
  }));
}

function updateQueryPage(replace = true) {
  const q: Record<string, any> = { ...(route.query as any) };
  if (page.value > 1) q.page = String(page.value); else delete q.page;
  const nav = { path: route.path, query: q } as any;
  if (replace) router.replace(nav); else router.push(nav);
}

async function refreshProducts() {
  // Собираем ВСЕ выбранные значения
  const selectedShowcase = filters.showcase.map(s => s === 'featured' ? 'main' : s).filter(Boolean);
  const selectedColors = [...filters.colors];
  const selectedTopics = [...filters.topics];

  try {
    const res = await getProductsPaged({
      page: page.value,
      per: per.value,
      showcase: selectedShowcase.length ? selectedShowcase : undefined,
      profileColor: selectedColors.length ? selectedColors : undefined,
      theme: selectedTopics.length ? selectedTopics : undefined
    });
    products.value = mapProducts(res.items as any);
    total.value = res.total;
    pages.value = res.pages;
    // Если текущая страница вышла за пределы после смены фильтров
    if (pages.value >= 1 && page.value > pages.value) {
      page.value = pages.value || 1;
      updateQueryPage(true);
      return refreshProducts();
    }
    updateQueryPage(true);
  } catch (e) {
    // Fallback на старый метод без пагинации
    const apiProducts = await productsStore.fetchAll({
      showcase: selectedShowcase.length ? selectedShowcase : undefined,
      profileColor: selectedColors.length ? selectedColors : undefined,
      theme: selectedTopics.length ? selectedTopics : undefined
    });
    products.value = mapProducts(apiProducts);
    total.value = apiProducts.length;
    pages.value = 1;
    page.value = 1;
    updateQueryPage(true);
  }
}

// Мгновенно отображаем уже загруженные продукты из стора,
// а затем в фоне подтягиваем актуальные
products.value = mapProducts(productsStore.items);
onMounted(() => {
  checkMobile(); // Проверяем мобильное устройство при загрузке
  refreshProducts();
});

watch(() => ({
  showcase: filters.showcase.join(','),
  color: filters.colors.join(','),
  topic: filters.topics.join(',')
}), () => { page.value = 1; updateQueryPage(true); refreshProducts(); });

function goPrev() { if (page.value > 1) { page.value -= 1; updateQueryPage(true); refreshProducts(); } }
function goNext() { if (page.value < pages.value) { page.value += 1; updateQueryPage(true); refreshProducts(); } }

watch(() => route.query.page, (val) => {
  const newPage = Math.max(1, parseInt(String(val || '1'), 10) || 1);
  if (newPage !== page.value) {
    page.value = newPage;
    refreshProducts();
  }
});

const pageItems = computed<(number | '…')[]>(() => {
  const maxPages = pages.value;
  const current = page.value;
  const result: (number | '…')[] = [];
  const pushRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) result.push(i);
  };
  if (maxPages <= 7) {
    pushRange(1, maxPages);
    return result;
  }
  result.push(1);
  const left = Math.max(2, current - 1);
  const right = Math.min(maxPages - 1, current + 1);
  if (left > 2) result.push('…');
  pushRange(left, right);
  if (right < maxPages - 1) result.push('…');
  result.push(maxPages);
  return result;
});

function setPage(p: number) {
  if (p === page.value) return;
  page.value = p;
  updateQueryPage(true);
  refreshProducts();
}

const showcaseTypesBase = [
  {id: 'featured', labelKey: 'shop.showcase.featured'},
  {id: 'artwork', labelKey: 'shop.showcase.artwork'},
  {id: 'workshop', labelKey: 'shop.showcase.workshop'},
];
const colorsBase = [
  {id: 'red', labelKey: 'shop.color.red', color: '#ff3e3e'},
  {id: 'blue', labelKey: 'shop.color.blue', color: '#3e7dff'},
  {id: 'black', labelKey: 'shop.color.black', color: '#000000'},
  {id: 'black-white', labelKey: 'shop.color.blackWhite', color: 'linear-gradient(90deg, #000 50%, #fff 50%)'},
  {id: 'purple', labelKey: 'shop.color.purple', color: '#9c4dff'},
  {id: 'pink', labelKey: 'shop.color.pink', color: '#ff4d8d'},
  {id: 'green', labelKey: 'shop.color.green', color: '#4dff7d'},
];
const topicsBase = [
  {id: 'anime', labelKey: 'shop.topic.anime'},
  {id: 'not-anime', labelKey: 'shop.topic.notAnime'},
  {id: 'free', labelKey: 'shop.topic.free'},
];

const showcaseTypesL10n = computed(() => showcaseTypesBase.map(i => ({ id: i.id, label: t(i.labelKey) })));
const colorsL10n = computed(() => colorsBase.map(i => ({ id: i.id, label: t(i.labelKey), color: i.color })));
const topicsL10n = computed(() => topicsBase.map(i => ({ id: i.id, label: t(i.labelKey) })));


async function addToCart(p: Product) {
  // Синхронизируем цены перед добавлением товара в корзину
  try {
    await cart.syncPrices();
  } catch (error) {
    console.warn('Ошибка при синхронизации цен:', error);
  }

  cart.add({
    id: p.id, 
    name: p.title,
    titleEn: p.titleEn,
    price: p.price,
    priceUSD: p.priceUSD,
    currency: getCurrency(), 
    image: (p as any).video || p.poster, 
    quantity: 1
  });
}

const inCartIds = computed(() => new Set(cart.items.map(i => i.id)));

function isInCart(id: string) {
  return inCartIds.value.has(id);
}
</script>

<style scoped>
.filters-mobile-bar {
  display: none;
}
.search-container {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 5%;
}

.search-bar {
  position: relative;
  max-width: 600px;
  width: 100%;
}

.search-bar input {
  padding: 14px 30px 14px 50px;
  width: 100%;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(0, 207, 255, 0.5);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
}

.layout {
  display: flex;
  padding: 30px 5%;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  width: 260px;
  background: rgba(0, 15, 30, 0.45);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 207, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 120px;
}

.sidebar-title {
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h4 {
  color: var(--primary);
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  padding-left: 28px;
  min-height: 20px;
  font-size: 0.9rem;
  user-select: none;
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  border: 2px solid var(--primary);
  border-radius: 4px;
  background: transparent;
}

.filter-option:hover .checkmark {
  background-color: rgba(0, 207, 255, 0.1);
}

.filter-option input:checked ~ .checkmark {
  background-color: rgba(0, 207, 255, 0.2);
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid var(--primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.filter-option input:checked ~ .checkmark::after {
  display: block;
}

.color-option {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
}

.content {
  flex: 1;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.pager { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 24px; }
.pager-btn { padding: 10px 14px; border-radius: 8px; border: 1px solid var(--primary); background: rgba(0, 207, 255, 0.1); color: var(--primary); cursor: pointer; }
.pager-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.pager-list { display: inline-flex; gap: 6px; align-items: center; }
.pager-ellipsis { color: rgba(255,255,255,0.5); padding: 0 6px; }
.pager-num { min-width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(0, 207, 255, 0.3); background: rgba(0, 207, 255, 0.08); color: #fff; cursor: pointer; }
.pager-num.active { background: var(--primary); color: #000; border-color: var(--primary); font-weight: 700; }

.product {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #0a1e30, #06121e);
  border: 1px solid rgba(0, 207, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
}

.preview {
  height: 360px; /* 240px * 3/2 = 360px для соотношения 2:3 */
  position: relative;
  overflow: hidden;
}

.preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16px;
  /* Оптимизация производительности */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* Плавный переход при наведении */
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}

/* Hover эффекты только для десктопа */
@media (hover: hover) and (pointer: fine) {
  .preview:hover video {
    transform: translateZ(0) scale(1.05);
    filter: brightness(1.1);
  }
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge-new {
  background: #ff4d8d;
  color: #fff;
}

.badge-hit {
  background: var(--primary);
  color: #000;
}

.badge-sale {
  background: #ff9f43;
  color: #000;
}

.badge-exclusive {
  background: #9c4dff;
  color: #fff;
}

.product-info {
  padding: 18px;
  text-align: center;
}

.product-title {
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 8px;
}

.product-price {
  background: linear-gradient(90deg, #00cfff, #3399ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  font-size: 1.2rem;
}

.product-actions {
  display: flex;
  gap: 10px;
  padding: 0 18px 18px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--primary);
  background: rgba(0, 207, 255, 0.1);
  color: var(--primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
}

.cart-add-btn {
  border-color: #fff;
  color: #fff;
}

.cart-add-btn.in-cart {
  border-color: var(--primary);
  background: var(--primary);
  color: #000;
}

@media (max-width: 700px) {
  .layout { position: relative; }
  .filters-mobile-bar { display: flex; justify-content: center; padding: 0 5%; margin: 10px 0 -10px; }
  .filters-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; border: 1px solid var(--primary); background: rgba(0, 207, 255, 0.1); color: var(--primary); font-weight: 600; }
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); z-index: 250; }
  .sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 80%; max-width: 320px; transform: translateX(-110%); transition: transform .3s ease; z-index: 300; overflow-y: auto; }
  .sidebar.open { transform: translateX(0); }
}

@media (max-width: 1312px) {
  .preview {
    height: 450px;
  }
}

@media (max-width: 973px) {
  .preview {
    height: 500px;
  }
}

@media (max-width: 640px) {
  .preview {
    height: 500px;
  }

  .search-container {
    margin: 20px auto;
  }
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.no-results-icon {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 20px;
}

.no-results-text {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--accent);
}

.no-results-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>


