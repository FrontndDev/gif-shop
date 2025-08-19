<template>
  <Layout>
    <div class="page-header">
      <h2>Центр помощи AeroDesign</h2>
      <p>Подробные инструкции и ответы на все вопросы по установке оформления</p>
    </div>

    <div class="help-container">
      <div class="help-section">
        <h3><i class="fas fa-question-circle"></i> Частые вопросы</h3>

        <details class="faq-item">
          <summary class="faq-question"><i class="fas fa-chevron-right"></i> Как купить оформление в магазине?</summary>
          <div class="faq-answer">
            <p>1. Выберите оформление → 2. Нажмите "В корзину" → 3. Оформите заказ → 4. Получите инструкцию</p>
          </div>
        </details>

        <details class="faq-item">
          <summary class="faq-question"><i class="fas fa-chevron-right"></i> Какие способы оплаты доступны?</summary>
          <div class="faq-answer">
            <p>Карты (Visa, Mastercard, Мир), ЮMoney, криптовалюта и др.</p>
          </div>
        </details>
      </div>

      <div class="help-section">
        <h3><i class="fas fa-download"></i> Установка оформления</h3>

        <div class="install-method recommended">
          <div class="recommended-badge">Рекомендуем</div>
          <h4>Автоматическая установка через расширение</h4>
          <a href="https://chromewebstore.google.com/detail/steam-gif-uploader/jeoaabmjgoolmbhimhimihpkcmdhhlaj" target="_blank" class="extension-card">
            <div class="extension-icon"><i class="fab fa-chrome"></i></div>
            <div class="extension-info">
              <h5>Steam GIF Uploader</h5>
              <p>Расширение для Chrome</p>
            </div>
          </a>
          <div class="steps">
            <div class="step"><div class="step-number">1</div><div class="step-content">Установите расширение</div></div>
            <div class="step"><div class="step-number">2</div><div class="step-content">Выберите тип витрины</div></div>
            <div class="step"><div class="step-number">3</div><div class="step-content">Выберите GIF и загрузите</div></div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
</script>

<style scoped>
.page-header { max-width: 1200px; margin: 40px auto; padding: 0 5%; text-align: center; }
.page-header h2 { font-size: 2.2rem; background: linear-gradient(90deg,#00cfff,#3399ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; font-weight: 800; }
.page-header p { color: rgba(255,255,255,0.7); }
.help-container { max-width: 1200px; margin: 0 auto; padding: 0 5% 60px; display: grid; gap: 40px; }
.help-section { background: rgba(0, 15, 30, 0.45); padding: 30px; border-radius: 16px; border: 1px solid rgba(0, 207, 255, 0.2); }
.help-section h3 { color: var(--primary); font-size: 1.4rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.faq-item { margin-bottom: 15px; }
.faq-question { cursor: pointer; }
.install-method { background: rgba(0,207,255,0.05); border: 1px solid rgba(0,207,255,0.3); border-radius: 12px; padding: 20px; position: relative; }
.recommended-badge { position: absolute; top: -10px; right: 20px; background: var(--primary); color: #000; padding: 3px 10px; border-radius: 20px; font-size: .8rem; font-weight: bold; }
.steps { margin-top: 15px; }
.step { display: flex; gap: 15px; margin-bottom: 10px; }
.step-number { background: var(--primary); color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.extension-card { display: flex; align-items: center; gap: 15px; background: rgba(0,207,255,0.05); border: 1px solid rgba(0,207,255,0.3); border-radius: 12px; padding: 15px; text-decoration: none; color: inherit; margin-top: 10px; }
.extension-icon { font-size: 2rem; color: var(--primary); }
.extension-info h5 { color: var(--primary); margin-bottom: 5px; }
</style>


