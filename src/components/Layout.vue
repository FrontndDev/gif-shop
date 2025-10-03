<template>
  <div>
    <div id="particles-js"></div>
    <div class="glow-effect"></div>
    <div class="glow-effect"></div>
    <header class="header">
      <RouterLink to="/" class="logo">
        <i class="fa-solid fa-paintbrush logo-icon"></i>
        <h1>AeroDesign</h1>
      </RouterLink>
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Меню">
        <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>
      <nav :class="{ open: isMenuOpen }">
        <RouterLink to="/shop" active-class="active" @click="closeMenu"><i class="fas fa-store"></i> {{ t('layout.nav.shop') }}
        </RouterLink>
        <RouterLink to="/order" @click="closeMenu"><i class="fas fa-pencil-ruler"></i> {{ t('layout.nav.order') }}</RouterLink>
        <RouterLink to="/support" @click="closeMenu"><i class="fas fa-question-circle"></i> {{ t('layout.nav.support') }}</RouterLink>
        <RouterLink to="/about" @click="closeMenu"><i class="fas fa-user"></i> {{ t('layout.nav.about') }}</RouterLink>
        <RouterLink to="/cart" class="cart-btn" @click="closeMenu">
          <i class="fas fa-shopping-cart"></i>
          {{ t('layout.nav.cart') }} <span class="cart-count">{{ cartCount }}</span>
        </RouterLink>
        <div class="lang-switch">
          <button class="lang-btn" :class="{ active: lang === 'ru' }" @click="setLang('ru')">RU</button>
          <button class="lang-btn" :class="{ active: lang === 'en' }" @click="setLang('en')">EN</button>
        </div>
      </nav>
    </header>

    <slot/>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-column">
          <h3>AeroDesign</h3>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 20px;">
            {{ t('layout.footer.tagline') }}
          </p>
          <div class="social-links">
            <a href="https://t.me/OFFRLINE" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
            <a href="https://discord.gg/2GCebZRavP" target="_blank" class="social-link"><i
                class="fab fa-discord"></i></a>
            <a href="https://www.deviantart.com/aeroidesign" target="_blank" class="social-link"><i
                class="fab fa-deviantart"></i></a>
          </div>
        </div>
        <div class="footer-column">
          <h3>{{ t('layout.footer.menu') }}</h3>
          <ul class="footer-links">
            <li>
              <RouterLink to="/shop"><i class="fas fa-chevron-right"></i> {{ t('layout.nav.shop') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/order"><i class="fas fa-chevron-right"></i> {{ t('layout.nav.order') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/support"><i class="fas fa-chevron-right"></i> {{ t('layout.nav.support') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/about"><i class="fas fa-chevron-right"></i> {{ t('layout.nav.about') }}</RouterLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>{{ t('layout.footer.legal') }}</h3>
          <ul class="footer-links">
            <li>
              <RouterLink to="/offer"><i class="fas fa-file-contract"></i> {{ t('layout.footer.offer') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/privacy"><i class="fas fa-shield-alt"></i> {{ t('layout.footer.privacy') }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="legal-note">{{ t('layout.footer.tax') }}</div>
      <div class="copyright">{{ t('layout.footer.copyright') }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {RouterLink} from 'vue-router';
import {useCart} from '../stores/cart';
import { useI18n } from '../i18n';

const cart = useCart();
const cartCount = computed(() => cart.items.length);

const { t, lang, setLang } = useI18n();

const isMenuOpen = ref(false);

function closeMenu() {
  isMenuOpen.value = false;
}

onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).particlesJS) {
    (window as any).particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": ["#00cfff", "#ffffff", "#3399ff"]
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#00cfff",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1.5,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 0.5
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  padding: 20px 5%;
  background: rgba(0, 10, 20, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 207, 255, 0.2);
  min-height: 70px;
  transition: all 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8rem;
  color: var(--primary);
  margin-right: 10px;
  transition: all 0.3s ease;
}

header h1 {
  font-size: 2rem;
  background: linear-gradient(90deg, #00cfff, #3399ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.3s ease;
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

nav a {
  color: #99ccff;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 8px 0;
  transition: all 0.3s ease;
  white-space: nowrap;
}

nav a.active, nav a.router-link-active {
  color: #fff;
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 10px;
  background: rgba(0, 207, 255, 0.08);
  border: 1px solid rgba(0, 207, 255, 0.3);
}

.lang-btn {
  background: transparent;
  border: 1px solid rgba(0, 207, 255, 0.4);
  color: #99ccff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s ease;
}

.lang-btn:hover {
  background: rgba(0, 207, 255, 0.12);
  color: #fff;
}

.lang-btn.active {
  background: linear-gradient(90deg, #00cfff, #3399ff);
  color: #000;
  border-color: var(--primary);
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 207, 255, 0.25);
}

.cart-btn {
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-count {
  background: var(--accent);
  color: #000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid rgba(0, 207, 255, 0.3);
  color: #99ccff;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 300;
  position: relative;
}

.footer {
  background: rgba(0, 10, 20, 0.85);
  padding: 40px 5%;
  margin-top: 60px;
  border-top: 1px solid rgba(0, 207, 255, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-links {
  list-style: none;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 207, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.legal-note {
  text-align: center;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.copyright {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Планшеты и маленькие ноутбуки */
@media screen and (max-width: 1024px) {
  .header {
    padding: 16px 4%;
    gap: 20px;
  }

  nav {
    gap: 20px;
  }

  header h1 {
    font-size: 1.7rem;
  }

  .logo-icon {
    font-size: 1.6rem;
  }
}

/* Планшеты в портретной ориентации */
@media screen and (max-width: 900px) {
  .header {
    padding: 14px 3%;
    gap: 15px;
  }

  .menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 12px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .menu-toggle:hover {
    background: rgba(0, 207, 255, 0.1);
    border-color: var(--primary);
  }

  nav {
    display: none;
  }

  nav.open {
    display: flex;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 8px;
    background: rgba(0, 10, 20, 0.98);
    backdrop-filter: blur(15px);
    padding: 20px 3%;
    border-bottom: 1px solid rgba(0, 207, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 200;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  nav.open .lang-switch {
    justify-content: center;
    width: 100%;
    margin-top: 8px;
  }

  nav a {
    padding: 14px 0;
    font-size: 1rem;
    border-bottom: 1px solid rgba(0, 207, 255, 0.1);
    transition: all 0.3s ease;
  }

  nav a:hover {
    background: rgba(0, 207, 255, 0.05);
    padding-left: 10px;
  }

  nav a:last-of-type {
    border-bottom: none;
  }
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .header {
    padding: 12px 3%;
    gap: 12px;
  }

  header h1 {
    font-size: 1.4rem;
    letter-spacing: 0.5px;
  }

  .logo-icon {
    font-size: 1.4rem;
    margin-right: 6px;
  }

  .menu-toggle {
    padding: 8px 10px;
    font-size: 1rem;
  }

  nav.open {
    top: 64px;
    padding: 16px 3%;
  }

  nav a {
    padding: 12px 0;
    font-size: 0.95rem;
  }

  .cart-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
  }

  .lang-switch {
    padding: 3px;
  }

  .lang-btn {
    padding: 5px 8px;
    font-size: 0.9rem;
  }
}

/* Очень маленькие экраны */
@media (max-width: 480px) {
  .header {
    padding: 10px 2%;
    gap: 8px;
    min-height: 60px;
  }

  header h1 {
    font-size: 1.1rem;
    letter-spacing: 0px;
  }

  .logo-icon {
    font-size: 1.1rem;
    margin-right: 3px;
  }

  .menu-toggle {
    padding: 6px 8px;
    font-size: 0.9rem;
  }

  nav.open {
    top: 58px;
    padding: 12px 2%;
    gap: 4px;
  }

  nav a {
    padding: 10px 0;
    font-size: 0.9rem;
  }

  .cart-btn {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .cart-count {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
  }

  .lang-btn {
    padding: 4px 6px;
    font-size: 0.8rem;
  }
}

/* Ландшафтная ориентация на мобильных устройствах */
@media (max-width: 768px) and (orientation: landscape) {
  .header {
    padding: 8px 3%;
    min-height: 50px;
  }

  nav.open {
    top: 50px;
    padding: 8px 3%;
    gap: 4px;
  }

  nav a {
    padding: 8px 0;
    font-size: 0.9rem;
  }
}

/* Улучшения для больших экранов */
@media screen and (min-width: 1440px) {
  .header {
    padding: 24px 6%;
  }

  nav {
    gap: 35px;
  }

  header h1 {
    font-size: 2.2rem;
  }

  .logo-icon {
    font-size: 2rem;
  }

  nav a {
    font-size: 1.05rem;
    padding: 10px 0;
  }
}
</style>


