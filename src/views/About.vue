<template>
  <Layout>
    <div class="container">
      <section class="hero-section">
        <h1 class="hero-title">{{ t('about.hero.title') }}</h1>
        <p class="hero-subtitle">{{ t('about.hero.subtitle') }}</p>
      </section>

      <section class="about-content">
      <div class="designer-card">
        <div class="avatar">
          <img src="/images/avatar2.png" alt="AeroDesigner" class="avatar-img">
        </div>
        <h2 class="designer-name">{{ t('about.designer.name') }}</h2>
        <p class="designer-role">{{ t('about.designer.role') }}</p>
        <div class="social-links">
          <a href="https://www.deviantart.com/aeroidesign" target="_blank" class="social-link" title="DeviantArt">
            <i class="fab fa-deviantart"></i>
          </a>
          <a href="https://t.me/OFFRLINE" target="_blank" class="social-link" title="Telegram">
            <i class="fab fa-telegram"></i>
          </a>
          <a href="https://discord.gg/2GCebZRavP" target="_blank" class="social-link" title="Discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://funpay.com/users/2136732" target="_blank" class="social-link" title="FunPay">
            <i class="fa-solid fa-f"></i>
          </a>
        </div>
      </div>

      <div class="bio-section">
        <h2 class="bio-title">{{ t('about.bio.title') }}</h2>
        <p class="bio-text">{{ t('about.bio.text1') }}</p>
        <p class="bio-text">{{ t('about.bio.text2') }}</p>
        
        <div class="stats-grid" data-animate-id="stats-section" :class="{ 'animate-visible': isElementVisible('stats-section') }">
          <div class="stat-item">
            <span class="stat-number">{{ animatedCounters.projects }}+</span>
            <span class="stat-label">{{ t('about.stats.works') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ animatedCounters.experience }}</span>
            <span class="stat-label">{{ t('about.stats.experience') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ animatedCounters.clients }}%</span>
            <span class="stat-label">{{ t('about.stats.satisfaction') }}</span>
          </div>
        </div>
      </div>
      </section>

      <!-- Portfolio Section -->
      <section class="portfolio-carousel-section">
      <h2 class="section-title">{{ t('about.portfolio.title') }}</h2>
      <div class="carousel-container">
        <div class="carousel-track" ref="carouselTrack" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
          <div 
            v-for="(work, index) in portfolioItems" 
            :key="index"
            class="carousel-item" 
            :class="getCarouselItemClass(index)"
            @click="openFullscreen(work.image)"
          >
            <div class="work-preview">
              <video :src="work.image" :alt="work.title" autoplay muted playsinline v-smooth-loop />
            </div>
          </div>
        </div>

        <div class="carousel-controls">
          <button class="carousel-btn" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-btn" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="carousel-indicators">
        <div 
          v-for="(_, index) in portfolioItems" 
          :key="index"
          class="indicator" 
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        ></div>
      </div>
      </section>

      <!-- Fullscreen Modal -->
    <div class="fullscreen-modal" :class="{ show: showFullscreen }" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <button class="close-fullscreen" @click="closeFullscreen">
          <i class="fas fa-times"></i>
        </button>
        <video class="fullscreen-video" :src="fullscreenImage" :alt="''" autoplay muted playsinline controls v-smooth-loop />
      </div>
    </div>

      <!-- CTA Section -->
      <section class="cta-section" data-animate-id="cta-section" :class="{ 'animate-visible': isElementVisible('cta-section') }">
      <h2 class="cta-title">{{ t('about.cta.title') }}</h2>
      <p class="cta-description">{{ t('about.cta.description') }}</p>
      <div class="cta-buttons">
        <RouterLink to="/order" class="cta-btn cta-btn-primary">
          <i class="fas fa-rocket"></i>
          {{ t('about.cta.order') }}
        </RouterLink>
        <RouterLink to="/shop" class="cta-btn cta-btn-secondary">
          <i class="fas fa-shopping-bag"></i>
          {{ t('about.cta.shop') }}
        </RouterLink>
      </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section" data-animate-id="testimonials-section" :class="{ 'animate-visible': isElementVisible('testimonials-section') }">
      <h2 class="testimonials-title">{{ t('about.testimonials.title') }}</h2>
      <div class="testimonial-grid">
        <div v-for="(testimonial, index) in testimonials" :key="testimonial.id" 
             class="testimonial" 
             :data-animate-id="`testimonial-${index}`"
             :class="{ 'animate-visible': isElementVisible(`testimonial-${index}`) }">
          <p class="testimonial-text">{{ testimonial.text }}</p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <img :src="testimonial.avatar" :alt="testimonial.author">
            </div>
            <div class="author-info">
              <h4>{{ testimonial.author }}</h4>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Layout from '../components/Layout.vue';
import { useI18n } from '../i18n';

const { t } = useI18n();

// Portfolio data
const portfolioItems = ref([
  { image: '/videos/1.mp4', title: 'Cyberpunk Showcase' },
  { image: '/videos/2.mp4', title: 'Anime Art Series' },
  { image: '/videos/3.mp4', title: 'Minimal Design' },
  { image: '/videos/4.mp4', title: 'Premium Exclusive' },
  { image: '/videos/5.mp4', title: 'Gaming Themes' },
  { image: '/videos/6.mp4', title: 'Custom Designs' },
  { image: '/videos/7.mp4', title: 'Retro Collection' },
  { image: '/videos/8.mp4', title: 'Space Theme' }
]);

// Testimonials data - reactive to language changes
const testimonials = computed(() => [
  {
    id: 1,
    text: t('about.testimonials.testimonial1.text'),
    author: 'NIGHTFURYjke',
    avatar: '/images/avatar1.jpg'
  },
  {
    id: 2,
    text: t('about.testimonials.testimonial2.text'),
    author: 'Amazing17',
    avatar: '/images/avatar2.jpg'
  },
  {
    id: 3,
    text: t('about.testimonials.testimonial3.text'),
    author: 'KEkaterina',
    avatar: '/images/avatar3.jpg'
  }
]);

// Carousel state
const currentIndex = ref(0);
const showFullscreen = ref(false);
const fullscreenImage = ref('');
const carouselTrack = ref<HTMLElement>();
let autoplayInterval: number | null = null;
let touchStartX = 0;
let touchEndX = 0;

// Animation state
const visibleElements = ref(new Set<string>());

// Counter animation state
const animatedCounters = ref({
  projects: 0,
  experience: 0,
  clients: 0
});

const targetCounters = ref({
  projects: 350,
  experience: 4,
  clients: 99
});

const totalItems = computed(() => portfolioItems.value.length);

function getCarouselItemClass(index: number): string {
  const position = index - currentIndex.value;
  const adjustedPosition = position < -Math.floor(totalItems.value/2) 
    ? position + totalItems.value 
    : position > Math.floor(totalItems.value/2) 
    ? position - totalItems.value 
    : position;

  if (adjustedPosition === 0) return 'active';
  if (adjustedPosition === -1) return 'prev';
  if (adjustedPosition === 1) return 'next';
  if (adjustedPosition === -2) return 'far-prev';
  if (adjustedPosition === 2) return 'far-next';
  return 'hidden';
}

function goToSlide(index: number) {
  currentIndex.value = (index + totalItems.value) % totalItems.value;
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % totalItems.value;
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + totalItems.value) % totalItems.value;
}

function openFullscreen(image: string) {
  fullscreenImage.value = image;
  showFullscreen.value = true;
}

function closeFullscreen() {
  showFullscreen.value = false;
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'Escape') {
    closeFullscreen();
  }
}

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      prevSlide();
    }
  }
}

// Animation functions
function isElementVisible(elementId: string): boolean {
  return visibleElements.value.has(elementId);
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const elementId = entry.target.getAttribute('data-animate-id');
        if (elementId) {
          visibleElements.value.add(elementId);
          
          // Start counter animation when stats section becomes visible
          if (elementId === 'stats-section') {
            animateCounters();
          }
        }
      }
    });
  }, observerOptions);

  // Observe elements that should animate
  const elementsToAnimate = document.querySelectorAll('[data-animate-id]');
  elementsToAnimate.forEach(el => observer.observe(el));
}

function animateCounters() {
  const duration = 2000; // 2 seconds
  const steps = 60; // 60 steps for smooth animation
  const stepDuration = duration / steps;

  Object.keys(targetCounters.value).forEach((key) => {
    const target = targetCounters.value[key as keyof typeof targetCounters.value];
    const increment = target / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        animatedCounters.value[key as keyof typeof animatedCounters.value] = target;
        clearInterval(timer);
      } else {
        animatedCounters.value[key as keyof typeof animatedCounters.value] = Math.floor(current);
      }
    }, stepDuration);
  });
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  startAutoplay();
  setupScrollAnimations();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  stopAutoplay();
});
</script>

<style>
/* Глобальные стили для предотвращения горизонтального скролла */
body {
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 0;
  position: relative;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00cfff, #3399ff, #ff4d8d);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 20px rgba(0, 207, 255, 0.5)); }
  to { filter: drop-shadow(0 0 30px rgba(0, 207, 255, 0.8)); }
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #e0f7ff;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 1s ease 0.5s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 80px;
  align-items: center;
}

/* Designer Card */
.designer-card {
  background: rgba(0, 15, 30, 0.45);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.designer-card:hover {
  transform: translateY(-10px);
  border-color: #00cfff;
  box-shadow: 0 20px 40px rgba(0, 207, 255, 0.3);
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto 30px;
  background: linear-gradient(45deg, #00cfff, #9c4dff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
  z-index: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.designer-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #00cfff;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.designer-role {
  color: #e0f7ff;
  font-size: 1rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid #00cfff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00cfff;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.social-link:hover {
  background: #00cfff;
  color: #000;
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 207, 255, 0.4);
}

.bio-section {
  position: relative;
  z-index: 1;
}

.bio-title {
  font-size: 2rem;
  font-weight: 700;
  color: #00cfff;
  margin-bottom: 20px;
  position: relative;
}

.bio-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #00cfff, #9c4dff);
}

.bio-text {
  color: #e0f7ff;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.stats-grid.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-item {
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid rgba(0, 207, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  border-color: #00cfff;
  box-shadow: 0 10px 25px rgba(0, 207, 255, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #00cfff;
  display: block;
}

.stat-label {
  color: #e0f7ff;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Portfolio Carousel */
.portfolio-carousel-section {
  margin-top: 80px;
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #00cfff;
  margin-bottom: 50px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #00cfff, #9c4dff);
}

.carousel-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  height: 700px;
  perspective: 1200px;
  /* overflow: hidden; */
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.carousel-item {
  position: absolute;
  width: 500px;
  height: 650px;
  left: 50%;
  top: 50%;
  background: rgba(0, 15, 30, 0.45);
  border: 2px solid rgba(0, 207, 255, 0.2);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.carousel-item.active {
  transform: translate(-50%, -50%) translateZ(0);
  opacity: 1;
  pointer-events: auto;
  z-index: 10;
  border-color: #00cfff;
  box-shadow: 0 30px 80px rgba(0, 207, 255, 0.5);
}

.carousel-item.prev {
  transform: translate(-120%, -50%) translateZ(-80px) rotateY(20deg);
  opacity: 0.8;
  pointer-events: auto;
  z-index: 5;
}

.carousel-item.next {
  transform: translate(20%, -50%) translateZ(-80px) rotateY(-20deg);
  opacity: 0.8;
  pointer-events: auto;
  z-index: 5;
}

.carousel-item.far-prev {
  transform: translate(-180%, -50%) translateZ(-150px) rotateY(30deg);
  opacity: 0.4;
  pointer-events: none;
  z-index: 1;
}

.carousel-item.far-next {
  transform: translate(80%, -50%) translateZ(-150px) rotateY(-30deg);
  opacity: 0.4;
  pointer-events: none;
  z-index: 1;
}

.carousel-item.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) translateZ(-300px);
  z-index: 0;
}

.work-preview {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0a1e30, #06121e);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.work-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-item:hover .work-preview video {
  transform: scale(1.05);
}

.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 20;
}

.carousel-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(0, 207, 255, 0.2);
  border: 3px solid #00cfff;
  color: #00cfff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 20px rgba(0, 207, 255, 0.3);
  z-index: 20;
}

.carousel-btn:hover {
  background: #00cfff;
  color: #000;
  transform: scale(1.15);
  box-shadow: 0 10px 30px rgba(0, 207, 255, 0.6);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  z-index: 20;
  position: relative;
}

.indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(0, 207, 255, 0.3);
  border: 2px solid #00cfff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #00cfff;
  transform: scale(1.4);
  box-shadow: 0 0 20px rgba(0, 207, 255, 0.8);
}

.indicator:hover {
  background: #00cfff;
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(0, 207, 255, 0.5);
}

/* Fullscreen Modal */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fullscreen-modal.show {
  opacity: 1;
  pointer-events: auto;
}

.fullscreen-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.fullscreen-video {
  width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 30px 80px rgba(0, 207, 255, 0.4);
}

.close-fullscreen {
  position: absolute;
  top: -60px;
  right: 0;
  width: 50px;
  height: 50px;
  background: #00cfff;
  border: none;
  border-radius: 50%;
  color: #000;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 207, 255, 0.5);
}

.close-fullscreen:hover {
  transform: scale(1.15);
  box-shadow: 0 8px 25px rgba(0, 207, 255, 0.7);
}

/* CTA Section */
.cta-section {
  background: rgba(0, 15, 30, 0.45);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 16px;
  padding: 50px 40px;
  margin-top: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.cta-section.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #00cfff;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.cta-description {
  font-size: 1.2rem;
  color: #e0f7ff;
  margin-bottom: 40px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 35px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.cta-btn-primary {
  background: linear-gradient(45deg, #00cfff, #3399ff);
  color: #000;
  border: 2px solid #00cfff;
}

.cta-btn-secondary {
  background: transparent;
  color: #00cfff;
  border: 2px solid #00cfff;
}

.cta-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 207, 255, 0.4);
}

.cta-btn-primary:hover {
  background: linear-gradient(45deg, #3399ff, #00cfff);
  box-shadow: 0 15px 40px rgba(0, 207, 255, 0.6);
}

.cta-btn-secondary:hover {
  background: #00cfff;
  color: #000;
}

/* Testimonials Section */
.testimonials-section {
  background: rgba(0, 15, 30, 0.45);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 16px;
  padding: 40px;
  margin-top: 60px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.testimonials-section.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.testimonials-title {
  font-size: 2rem;
  font-weight: 700;
  color: #00cfff;
  text-align: center;
  margin-bottom: 30px;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 207, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.testimonial.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.testimonial:nth-child(1).animate-visible {
  transition-delay: 0.1s;
}

.testimonial:nth-child(2).animate-visible {
  transition-delay: 0.2s;
}

.testimonial:nth-child(3).animate-visible {
  transition-delay: 0.3s;
}

.testimonial::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 4rem;
  color: #00cfff;
  opacity: 0.3;
}

.testimonial-text {
  color: #e0f7ff;
  line-height: 1.6;
  margin-bottom: 15px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00cfff, #9c4dff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  overflow: hidden;
  position: relative;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.author-info h4 {
  color: #00cfff;
  font-weight: 600;
  margin-bottom: 2px;
}

.author-info span {
  color: #e0f7ff;
  font-size: 0.8rem;
}

@media (max-width: 968px) {
  .container {
    padding: 20px 15px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonial-grid {
    grid-template-columns: 1fr;
  }
  
  .carousel-container {
    height: 500px;
    margin: 0 10px;
  }
  
  .carousel-item {
    width: 300px;
    height: 400px;
  }
  
  .carousel-item.prev {
    transform: translate(-90%, -50%) translateZ(-60px) rotateY(15deg);
  }
  
  .carousel-item.next {
    transform: translate(-10%, -50%) translateZ(-60px) rotateY(-15deg);
  }
  
  .carousel-item.far-prev {
    transform: translate(-120%, -50%) translateZ(-100px) rotateY(20deg);
  }
  
  .carousel-item.far-next {
    transform: translate(20%, -50%) translateZ(-100px) rotateY(-20deg);
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .carousel-btn {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .designer-card {
    padding: 30px 20px;
  }
  
  .avatar {
    width: 160px;
    height: 160px;
    font-size: 3rem;
  }
  
  .carousel-container {
    height: 400px;
    margin: 0 5px;
  }
  
  .carousel-item {
    width: 250px;
    height: 320px;
  }
  
  .carousel-item.prev {
    transform: translate(-85%, -50%) translateZ(-40px) rotateY(10deg);
  }
  
  .carousel-item.next {
    transform: translate(-15%, -50%) translateZ(-40px) rotateY(-10deg);
  }
  
  .carousel-item.far-prev {
    transform: translate(-115%, -50%) translateZ(-80px) rotateY(15deg);
  }
  
  .carousel-item.far-next {
    transform: translate(15%, -50%) translateZ(-80px) rotateY(-15deg);
  }
  
  .carousel-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .testimonials-section {
    padding: 30px 20px;
  }
  
  .cta-section {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px 10px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-item {
    padding: 15px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .designer-card {
    padding: 25px 15px;
  }
  
  .avatar {
    width: 140px;
    height: 140px;
    font-size: 2.5rem;
  }
  
  .designer-name {
    font-size: 1.5rem;
  }
  
  .designer-role {
    font-size: 0.9rem;
  }
  
  .bio-title {
    font-size: 1.5rem;
  }
  
  .bio-text {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .carousel-container {
    height: 320px;
    margin: 0;
    padding: 0 10px;
  }
  
  .carousel-item {
    width: 200px;
    height: 260px;
  }
  
  .carousel-item.prev {
    transform: translate(-80%, -50%) translateZ(-30px) rotateY(8deg);
  }
  
  .carousel-item.next {
    transform: translate(-20%, -50%) translateZ(-30px) rotateY(-8deg);
  }
  
  .carousel-item.far-prev {
    transform: translate(-110%, -50%) translateZ(-60px) rotateY(12deg);
  }
  
  .carousel-item.far-next {
    transform: translate(10%, -50%) translateZ(-60px) rotateY(-12deg);
  }
  
  .carousel-btn {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
  
  .carousel-controls {
    padding: 0 20px;
  }
  
  .cta-title {
    font-size: 1.6rem;
  }
  
  .cta-description {
    font-size: 0.9rem;
  }
  
  .cta-btn {
    padding: 15px 25px;
    font-size: 1rem;
  }
  
  .testimonials-title {
    font-size: 1.6rem;
  }
  
  .testimonial {
    padding: 20px;
  }
  
  .testimonial-text {
    font-size: 0.9rem;
  }
  
  .author-avatar {
    width: 40px;
    height: 40px;
  }
  
  .author-info h4 {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .container {
    padding: 10px 5px;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 0.8rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .carousel-container {
    height: 280px;
    padding: 0 5px;
  }
  
  .carousel-item {
    width: 180px;
    height: 230px;
  }
  
  .carousel-item.prev {
    transform: translate(-75%, -50%) translateZ(-25px) rotateY(6deg);
  }
  
  .carousel-item.next {
    transform: translate(-25%, -50%) translateZ(-25px) rotateY(-6deg);
  }
  
  .carousel-item.far-prev {
    transform: translate(-105%, -50%) translateZ(-50px) rotateY(10deg);
  }
  
  .carousel-item.far-next {
    transform: translate(5%, -50%) translateZ(-50px) rotateY(-10deg);
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .carousel-controls {
    padding: 0 15px;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    font-size: 2rem;
  }
  
  .designer-card {
    padding: 20px 10px;
  }
  
  .cta-section {
    padding: 30px 15px;
  }
  
  .testimonials-section {
    padding: 25px 15px;
  }
}
</style>
