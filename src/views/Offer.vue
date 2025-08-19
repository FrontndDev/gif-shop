<template>
  <Layout>
    <div class="container">
      <h1>Публичная оферта</h1>
      <p>о заключении договора купли-продажи цифровых товаров</p>
      <section class="highlight">
        <p><strong>Внимание:</strong> совершая покупку в интернет-магазине AeroDesign, вы подтверждаете своё согласие с условиями оферты.</p>
      </section>
      <h2>1. Общие положения</h2>
      <p>Оферта является официальным предложением заключить договор купли-продажи цифровых товаров.</p>
      <h2>2. Термины и определения</h2>
      <p>Оферта, Продавец, Сайт, Покупатель, Акцепт, Цифровой товар, Заказ.</p>
      <h2>3. Предмет оферты</h2>
      <p>Продавец обязуется предоставить покупателю цифровой товар, покупатель — оплатить.</p>
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
</style>


