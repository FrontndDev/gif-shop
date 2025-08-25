<template>
  <Layout>
    <div class="page-header">
      <h2>Центр помощи AeroDesign</h2>
      <p>Подробные инструкции и ответы на все вопросы по установке оформления</p>
    </div>

    <div class="help-container">
      <!-- Частые вопросы -->
      <div class="help-section">
        <h3><i class="fas fa-question-circle"></i> Частые вопросы</h3>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 0 }" @click="toggleFaq(0)">
            <i class="fas fa-chevron-right"></i>
            <span>Как купить оформление в магазине?</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 0 }">
            <p>1. Выберите понравившееся оформление в нашем магазине<br>2. Нажмите кнопку "В корзину"<br>3. Перейдите в корзину и оформите заказ<br>4. После оплаты вы получите инструкцию по установке</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 1 }" @click="toggleFaq(1)">
            <i class="fas fa-chevron-right"></i>
            <span>Какие способы оплаты доступны?</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 1 }">
            <p>Мы принимаем:<br>- Банковские карты (Visa, Mastercard, Мир)<br>- ЮMoney<br>- Qiwi<br>- Криптовалюту (BTC, ETH, USDT)<br>- Другие способы по согласованию</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 2 }" @click="toggleFaq(2)">
            <i class="fas fa-chevron-right"></i>
            <span>Можно ли вернуть оформление?</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 2 }">
            <p>Цифровые товары возврату не подлежат, если они были скачаны. В случае технических проблем мы поможем решить их или предложим замену.</p>
          </div>
        </div>
      </div>

      <!-- Установка оформления -->
      <div class="help-section">
        <h3><i class="fas fa-download"></i> Установка оформления</h3>

        <div class="install-method recommended">
          <div class="recommended-badge">Рекомендуем</div>
          <h4>Способ 1: Автоматическая установка через расширение</h4>
          <p>Для удобства мы разработали специальное расширение, которое автоматизирует весь процесс:</p>
          <a href="https://chromewebstore.google.com/detail/steam-gif-uploader/jeoaabmjgoolmbhimhimihpkcmdhhlaj" target="_blank" class="extension-card">
            <div class="extension-icon"><i class="fab fa-chrome"></i></div>
            <div class="extension-info">
              <h5>Steam GIF Uploader</h5>
              <p>Расширение для Chrome</p>
            </div>
          </a>
          <div class="steps">
            <div class="step"><div class="step-number">1</div><div class="step-content"><p>Установите расширение из Chrome Web Store</p></div></div>
            <div class="step"><div class="step-number">2</div><div class="step-content"><p>Выберите тип витрины</p></div></div>
            <div class="step"><div class="step-number">3</div><div class="step-content"><p>Выберите GIF или изображение и нажмите "Загрузить"</p></div></div>
            <div class="step"><div class="step-number">4</div><div class="step-content"><p>Расширение автоматически откроет вкладку, вставит нужные параметры и сохранит</p></div></div>
          </div>

          <div class="local-video-container">
            <video controls :poster="previewPoster">
              <source :src="mp4Src" type="video/mp4" />
              <source :src="webmSrc" type="video/webm" />
              Ваш браузер не поддерживает HTML5 видео.
            </video>
          </div>

          <div class="pro-tip">
            <h5><i class="fas fa-lightbulb"></i> Важно!</h5>
            <p>Некоторые пользователи загружают GIF в "Витрину иллюстраций". Обязательно выбирайте "Витрину избранных" для корректного отображения лишь 1 GIF файла.</p>
          </div>
        </div>

        <div class="install-method">
          <h4>Способ 2: Ручная установка через консоль браузера</h4>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <p>Откройте эту ссылку и выберите изображение:</p>
                <a href="http://steamcommunity.com/sharedfiles/edititem/767/3/" target="_blank" class="steam-link"><i class="fab fa-steam"></i> http://steamcommunity.com/sharedfiles/edititem/767/3/</a>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <p>Когда изображение откроется на странице, откройте консоль разработчика:</p>
                <ul class="browser-commands">
                  <li><strong>Chrome:</strong> Ctrl+Shift+J</li>
                  <li><strong>Firefox:</strong> Ctrl+Shift+K</li>
                </ul>
                <p>Или щелкните правой кнопкой → "Исследовать элемент" → вкладка "Console"</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <p>Введите один из этих кодов в консоли:</p>

                <div class="code-block">
                  <p>Для обычного изображения:</p>
                  <code>$J('#image_width').val('1000');$J('#image_height').val('1');</code>
                  <button class="copy-btn" @click="copyCode(1)"><i class="far" :class="isCopied1 ? 'fa-check' : 'fa-copy'"></i> {{ isCopied1 ? 'Скопировано!' : 'Копировать' }}</button>
                </div>

                <div class="code-block">
                  <p>Для скриншота:</p>
                  <code>$J('#image_width').val('1000');$J('#image_height').val('1');$J('[name="file_type"]').val("5");</code>
                  <button class="copy-btn" @click="copyCode(2)"><i class="far" :class="isCopied2 ? 'fa-check' : 'fa-copy'"></i> {{ isCopied2 ? 'Скопировано!' : 'Копировать' }}</button>
                </div>

                <p class="warning"><i class="fas fa-exclamation-triangle"></i> Используйте только один код, не оба одновременно!</p>
                <img :src="primerGif" alt="Пример правильной вставки кода в консоль" class="step-image" />
              </div>
            </div>

            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <p>Дайте название, описание, поставьте галочку "Я подтверждаю, что являюсь автором этой иллюстрации", затем нажмите "сохранить и продолжить".</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Контакты -->
      <div class="help-section">
        <h3><i class="fas fa-headset"></i> Техническая поддержка</h3>
        <p>Если у вас остались вопросы или возникли проблемы с установкой, свяжитесь с нами:</p>
        <div class="contact-methods">
          <div class="contact-card">
            <h4><i class="fab fa-telegram"></i> Telegram</h4>
            <p>Самый быстрый способ получить помощь. Отвечаем в течение 1-2 часов в рабочее время.</p>
            <a href="https://t.me/OFFRLINE" target="_blank" class="contact-link"><i class="fas fa-paper-plane"></i> Написать в Telegram</a>
          </div>

          <div class="contact-card">
            <h4><i class="fab fa-discord"></i> Discord Сервер</h4>
            <p>Присоединяйтесь к нашему Discord-сообществу для общения, помощи и обновлений.</p>
            <a href="https://discord.gg/2GCebZRavP" target="_blank" class="contact-link"><i class="fas fa-users"></i> Присоединиться</a>
          </div>

          <div class="contact-card">
            <h4><i class="fas fa-envelope"></i> Электронная почта</h4>
            <p>Для сложных вопросов и коммерческих предложений. Отвечаем в течение 24 часов.</p>
            <a href="mailto:contact@aerodesign.store" class="contact-link"><i class="fas fa-envelope"></i> Написать письмо</a>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Layout from '../components/Layout.vue';
import previewPoster from '../../preview.png';
import primerGif from '../../primerru.gif';
import mp4Src from '../../mp4.mp4';
import webmSrc from '../../webm.webm';

const isCopied1 = ref(false);
const isCopied2 = ref(false);
const openFaqIndex = ref<number | null>(null);

function copyCode(which: 1 | 2) {
  const code1 = "$J('#image_width').val('1000');$J('#image_height').val('1');";
  const code2 = "$J('#image_width').val('1000');$J('#image_height').val('1');$J('[name=\"file_type\"]').val(\"5\");";
  const text = which === 1 ? code1 : code2;
  navigator.clipboard.writeText(text).then(() => {
    if (which === 1) {
      isCopied1.value = true;
      setTimeout(() => (isCopied1.value = false), 2000);
    } else {
      isCopied2.value = true;
      setTimeout(() => (isCopied2.value = false), 2000);
    }
  });
}

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
}
</script>

<style scoped>
.page-header { max-width: 1200px; margin: 40px auto; padding: 0 5%; text-align: center; }
.page-header h2 { font-size: 2.5rem; background: linear-gradient(90deg,#00cfff,#3399ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px; font-weight: 800; }
.page-header p { color: rgba(255,255,255,0.7); font-size: 1.1rem; max-width: 700px; margin: 0 auto; }

.help-container { max-width: 1200px; margin: 0 auto; padding: 0 5% 60px; display: grid; gap: 40px; }
.help-section { background: rgba(0, 15, 30, 0.45); padding: 30px; border-radius: 16px; border: 1px solid rgba(0, 207, 255, 0.2); backdrop-filter: blur(8px); }
.help-section h3 { color: var(--primary); font-size: 1.5rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; position: relative; padding-bottom: 10px; }

.faq-item { margin-bottom: 20px; border-bottom: 1px solid rgba(0, 207, 255, 0.1); padding-bottom: 20px; }
.faq-question { color: var(--primary); font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.faq-question i { transition: transform .3s ease; }
.faq-question.active i { transform: rotate(90deg); }
.faq-answer { color: rgba(255,255,255,0.75); line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height .3s ease, padding-top .3s ease; }
.faq-answer.show { max-height: 500px; padding-top: 10px; }

.install-method { background: rgba(0,207,255,0.05); border: 1px solid rgba(0,207,255,0.3); border-radius: 12px; padding: 20px; position: relative; margin-bottom: 30px; }
.install-method.recommended { border-color: var(--primary); }
.recommended-badge { position: absolute; top: -10px; right: 20px; background: var(--primary); color: #000; padding: 3px 10px; border-radius: 20px; font-size: .8rem; font-weight: bold; }

.steps { margin-top: 20px; }
.step { display: flex; margin-bottom: 20px; }
.step-number { background: var(--primary); color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
.step-content { flex: 1; }

.extension-card { display: flex; align-items: center; gap: 15px; background: rgba(0,207,255,0.05); border: 1px solid rgba(0,207,255,0.3); border-radius: 12px; padding: 15px; text-decoration: none; color: inherit; margin: 15px 0; transition: all .3s ease; }
.extension-card:hover { background: rgba(0,207,255,0.1); transform: translateY(-3px); }
.extension-icon { font-size: 2rem; color: var(--primary); }
.extension-info h5 { color: var(--primary); margin-bottom: 5px; }

.local-video-container { position: relative; width: 100%; margin: 15px 0; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0, 207, 255, 0.3); }
.local-video-container video { width: 100%; display: block; }

.pro-tip { background: rgba(0, 207, 255, 0.1); border-left: 3px solid var(--primary); padding: 15px; margin-top: 20px; border-radius: 0 8px 8px 0; }
.pro-tip h5 { color: var(--primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }

.browser-commands { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin: 10px 0; }
.code-block { background: rgba(0,0,0,0.3); border: 1px solid rgba(0,207,255,0.5); border-radius: 8px; padding: 12px; margin: 10px 0; position: relative; }
.code-block code { display: block; font-family: monospace; white-space: pre-wrap; margin-bottom: 10px; color: var(--primary); }
.copy-btn { background: rgba(0,207,255,0.1); border: 1px solid var(--primary); color: var(--primary); padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: all .3s ease; }
.copy-btn:hover { background: var(--primary); color: #000; }
.warning { color: #ff9f43; display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.step-image { max-width: 100%; border-radius: 8px; margin-top: 10px; border: 1px solid rgba(0, 207, 255, 0.3); }

.contact-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
.contact-card { background: rgba(0, 207, 255, 0.05); border: 1px solid rgba(0, 207, 255, 0.3); border-radius: 12px; padding: 20px; transition: all .3s ease; }
.contact-card:hover { background: rgba(0, 207, 255, 0.1); transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 207, 255, 0.2); }
.contact-card h4 { color: var(--primary); margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
.contact-card p { color: rgba(255,255,255,0.7); margin-bottom: 15px; line-height: 1.6; }
.contact-link { display: inline-flex; align-items: center; gap: 8px; color: var(--primary); text-decoration: none; transition: all .3s ease; padding: 8px 15px; background: rgba(0,207,255,0.1); border-radius: 8px; }
.contact-link:hover { background: var(--primary); color: #000; }

@media (max-width: 768px) {
  .page-header h2 { font-size: 2rem; }
  .help-section { padding: 20px; }
  .step { flex-direction: column; }
  .step-number { margin-bottom: 10px; margin-right: 0; }
}
</style>


