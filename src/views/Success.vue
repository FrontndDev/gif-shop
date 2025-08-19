<template>
  <Layout>
    <div class="success-container">
      <div class="success-card">
        <div class="success-header">
          <div class="success-icon"><i class="fas fa-check-circle"></i></div>
          <h1>Оплата прошла успешно!</h1>
          <p>Спасибо за покупку в AeroDesign. Ваш заказ обрабатывается, и вскоре вы получите все необходимые материалы.</p>
        </div>

        <div class="download-section">
          <div class="download-header">
            <h2><i class="fas fa-download"></i> Ваши файлы готовы</h2>
            <button class="download-btn" @click="simulateDownload">
              <i class="fas fa-file-archive"></i> Скачать архив
            </button>
          </div>
          <p class="muted">Архив содержит все необходимые файлы для оформления вашего профиля Steam.</p>
          <div class="file-info">
            <div class="file-info-item"><i class="fas fa-file"></i> 1 GIF файл</div>
            <div class="file-info-item"><i class="fas fa-weight-hanging"></i> 2.4 MB</div>
            <div class="file-info-item"><i class="fas fa-clock"></i> Доступен 30 дней</div>
          </div>
        </div>

        <div class="action-buttons">
          <RouterLink to="/support" class="action-btn btn-primary"><i class="fas fa-book"></i> Инструкция по установке</RouterLink>
          <RouterLink to="/shop" class="action-btn btn-secondary"><i class="fas fa-store"></i> Вернуться в магазин</RouterLink>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';

function simulateDownload(e: Event) {
  const btn = e.currentTarget as HTMLButtonElement;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Подготовка файла...';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Скачано!';
    btn.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-file-archive"></i> Скачать архив';
      btn.style.background = '';
    }, 3000);
  }, 1500);
}
</script>

<style scoped>
.success-container { max-width: 800px; margin: 60px auto; padding: 0 20px; }
.success-card { background: rgba(0,15,30,0.7); border-radius: 16px; border: 1px solid rgba(0,207,255,0.2); padding: 40px; }
.success-header { text-align: center; margin-bottom: 30px; }
.success-icon { font-size: 5rem; color: var(--primary); margin-bottom: 20px; }
.success-header h1 { font-size: 2.2rem; background: linear-gradient(90deg,#00cfff,#3399ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; font-weight: 800; }
.muted { color: rgba(255,255,255,0.7); }
.download-section { background: rgba(0,207,255,0.05); border: 1px dashed rgba(0,207,255,0.3); border-radius: 12px; padding: 25px; margin-bottom: 30px; }
.download-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.download-btn { background: linear-gradient(to right,#00cfff,#3399ff); color: #000; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
.file-info { display: flex; gap: 15px; margin-top: 15px; }
.file-info-item { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px 15px; display: flex; align-items: center; gap: 8px; font-size: .9rem; }
.action-buttons { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
.action-btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
.btn-primary { background: linear-gradient(to right,#00cfff,#3399ff); color: #000; }
.btn-secondary { background: rgba(0,207,255,0.1); color: var(--primary); border: 1px solid var(--primary); }
</style>


