<template>
  <Layout>
    <div class="container">
      <h1>Политика конфиденциальности</h1>
      <p>интернет-магазина AeroDesign</p>
      <section class="highlight">
        <p><strong>Важно:</strong> используя сайт AeroDesign и совершая покупки, вы соглашаетесь с условиями обработки персональных данных.</p>
      </section>
      <h2>1. Основные понятия</h2>
      <p>Политика применяется ко всем пользователям сайта AeroDesign.</p>
      <h2>2. Какие данные мы собираем</h2>
      <ul><li>Адрес электронной почты</li><li>Имя (никнейм)</li><li>Технические данные (IP, cookies)</li></ul>
      <h2>3. Цели обработки данных</h2>
      <ul><li>Оформление и выполнение заказов</li><li>Коммуникация с покупателями</li></ul>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
h1 { color: var(--primary); font-size: 2.2rem; margin-bottom: 10px; }
h2 { color: var(--primary); font-size: 1.5rem; margin-top: 30px; margin-bottom: 15px; }
.highlight { background: rgba(0,207,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--primary); }
ul { padding-left: 20px; }
</style>


