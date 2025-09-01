<template>
  <Layout>
    <div class="page-header">
      <h2>Заказать оформление профиля</h2>
      <p>Создаем уникальные и персонализированные оформления профиля Steam</p>
    </div>
    <div class="order-container">
      <form class="order-form" @submit.prevent="submit">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Ваше имя</label>
            <input id="name" v-model="form.name" type="text" class="form-control" placeholder="Как к вам обращаться?"
                   required/>
          </div>
          <div class="form-group">
            <label>Telegram/Discord</label>
            <input v-model="form.telegramDiscord" type="text" class="form-control" placeholder="username" required/>
          </div>
        </div>
        <div class="form-group">
          <label for="steam">Ссылка на профиль Steam</label>
          <input id="steam" v-model="form.steamProfile" type="url" class="form-control"
                 placeholder="https://steamcommunity.com/id/yourprofile" required/>
        </div>
        <div class="form-group">
          <label for="style">Стиль оформления</label>
          <select id="style" v-model="form.style" class="form-control" required>
            <option value="" disabled selected>Выберите стиль</option>
            <option value="minimal">Минимализм</option>
            <option value="cyberpunk">Киберпанк</option>
            <option value="anime">Аниме</option>
            <option value="game-themed">Игровая тематика</option>
            <option value="custom">Индивидуальный дизайн</option>
          </select>
        </div>
        <div class="form-group">
          <label for="theme">Цветовая гамма</label>
          <select id="theme" v-model="form.colorTheme" class="form-control" required>
            <option value="" disabled selected>Выберите цветовую гамму</option>
            <option value="blue">Синяя</option>
            <option value="red">Красная</option>
            <option value="purple">Фиолетовая</option>
            <option value="green">Зеленая</option>
            <option value="dark">Темная</option>
            <option value="custom">Индивидуальная</option>
          </select>
        </div>
        <div class="form-group">
          <label for="details">Детали оформления</label>
          <textarea id="details" v-model="form.details" class="form-control"
                    placeholder="Пожелания, любимые игры, персонажи..." required></textarea>
        </div>
        <button class="form-submit" :disabled="submitting"><i class="fas fa-paper-plane"></i>
          {{ submitting ? 'Отправка...' : 'Отправить заявку' }}
        </button>
      </form>
      <div class="order-info">
        <h3>Как мы работаем</h3>
        <div class="info-item"><h4><i class="fas fa-comments"></i> Консультация</h4>
          <p>Обсуждаем ваши пожелания.</p></div>
        <div class="info-item"><h4><i class="fas fa-pencil-ruler"></i> Дизайн</h4>
          <p>Создаем концепцию и правим по вашим замечаниям.</p></div>
        <div class="info-item"><h4><i class="fas fa-check-circle"></i> Утверждение</h4>
          <p>Подтверждаем финальную версию.</p></div>
        <div class="info-item"><h4><i class="fas fa-rocket"></i> Реализация</h4>
          <p>Загружаем оформление в ваш профиль.</p></div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import Layout from '../components/Layout.vue';
import type {CreateOrderRequest} from '../lib/api';
import {sendTelegramOrder} from '../lib/api';

const form = reactive<CreateOrderRequest>({
  name: '', telegramDiscord: '', steamProfile: '', style: '', colorTheme: '', details: ''
});
const submitting = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit() {
  submitting.value = true;
  error.value = null;
  try {
    await sendTelegramOrder(form);
    success.value = true;
    // Optionally reset form
    form.name = '';
    form.telegramDiscord = '';
    form.steamProfile = '';
    form.style = '';
    form.colorTheme = '';
    form.details = '';
    alert('Заявка отправлена! Мы свяжемся с вами.');
  } catch (e: any) {
    error.value = e?.message || 'Не удалось отправить заявку';
    alert(error.value);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page-header {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 5%;
  text-align: center;
}

.page-header h2 {
  font-size: 2.2rem;
  background: linear-gradient(90deg, #00cfff, #3399ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  font-weight: 800;
}

.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5% 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.order-form, .order-info {
  background: rgba(0, 15, 30, 0.45);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(0, 207, 255, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--primary);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.5);
  border-radius: 8px;
  color: #fff;
}

textarea.form-control {
  min-height: 120px;
}

.form-submit {
  background: linear-gradient(90deg, #00cfff, #3399ff);
  color: #000;
  border: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.order-info h3 {
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 18px;
}

.info-item h4 {
  color: var(--primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.info-item p {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .order-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 500px) {
  .form-row {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
}
</style>


