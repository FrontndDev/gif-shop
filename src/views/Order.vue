<template>
  <Layout>
    <div class="page-header">
      <h2>{{ t('order.title') }}</h2>
      <p>{{ t('order.subtitle') }}</p>
    </div>
    <div class="order-container">
      <form class="order-form" @submit.prevent="submit">
        <div class="form-row">
          <div class="form-group">
            <label for="name">{{ t('order.form.name') }}</label>
            <input id="name" v-model="form.name" type="text" class="form-control" :placeholder="t('order.form.name.placeholder')"
                   required/>
          </div>
          <div class="form-group">
            <label>{{ t('order.form.contact') }}</label>
            <input v-model="form.telegramDiscord" type="text" class="form-control" :placeholder="t('order.form.contact.placeholder')" required/>
          </div>
        </div>
        <div class="form-group">
          <label for="steam">{{ t('order.form.steam') }}</label>
          <input id="steam" v-model="form.steamProfile" type="url" class="form-control"
                 :placeholder="t('order.form.steam.placeholder')" required/>
        </div>
        <div class="form-group">
          <label for="style">{{ t('order.form.style') }}</label>
          <select id="style" v-model="form.style" class="form-control" required>
            <option value="" disabled selected>{{ t('order.form.style.choose') }}</option>
            <option value="minimal">{{ t('order.form.style.minimal') }}</option>
            <option value="cyberpunk">{{ t('order.form.style.cyberpunk') }}</option>
            <option value="anime">{{ t('order.form.style.anime') }}</option>
            <option value="game-themed">{{ t('order.form.style.gameThemed') }}</option>
            <option value="custom">{{ t('order.form.style.custom') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="theme">{{ t('order.form.color') }}</label>
          <select id="theme" v-model="form.colorTheme" class="form-control" required>
            <option value="" disabled selected>{{ t('order.form.color.choose') }}</option>
            <option value="blue">{{ t('order.form.color.blue') }}</option>
            <option value="red">{{ t('order.form.color.red') }}</option>
            <option value="purple">{{ t('order.form.color.purple') }}</option>
            <option value="green">{{ t('order.form.color.green') }}</option>
            <option value="dark">{{ t('order.form.color.dark') }}</option>
            <option value="custom">{{ t('order.form.color.custom') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="details">{{ t('order.form.details') }}</label>
          <textarea id="details" v-model="form.details" class="form-control"
                    :placeholder="t('order.form.details.placeholder')" required></textarea>
        </div>
        <button class="form-submit" :disabled="submitting"><i class="fas fa-paper-plane"></i>
          {{ submitting ? t('order.submitting') : t('order.submit') }}
        </button>
      </form>
      <div class="order-info">
        <h3>{{ t('order.howWeWork') }}</h3>
        <div class="info-item"><h4><i class="fas fa-comments"></i> {{ t('order.workflow.consultation.title') }}</h4>
          <p>{{ t('order.workflow.consultation.desc') }}</p></div>
        <div class="info-item"><h4><i class="fas fa-pencil-ruler"></i> {{ t('order.workflow.design.title') }}</h4>
          <p>{{ t('order.workflow.design.desc') }}</p></div>
        <div class="info-item"><h4><i class="fas fa-check-circle"></i> {{ t('order.workflow.approval.title') }}</h4>
          <p>{{ t('order.workflow.approval.desc') }}</p></div>
        <div class="info-item"><h4><i class="fas fa-rocket"></i> {{ t('order.workflow.implementation.title') }}</h4>
          <p>{{ t('order.workflow.implementation.desc') }}</p></div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import Layout from '../components/Layout.vue';
import type {CreateOrderRequest} from '../lib/api';
import {sendTelegramOrder} from '../lib/api';
import { useI18n } from '../i18n';

const form = reactive<CreateOrderRequest>({
  name: '', telegramDiscord: '', steamProfile: '', style: '', colorTheme: '', details: ''
});
const submitting = ref(false);
const success = ref(false);
const error = ref<string | null>(null);
const { t } = useI18n();

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
    alert(t('order.success'));
  } catch (e: any) {
    error.value = e?.message || t('order.error');
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

.form-control option {
  background: rgba(0, 15, 30, 0.95);
  color: #fff;
  padding: 8px;
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


