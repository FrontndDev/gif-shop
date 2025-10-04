<template>
  <Layout>
    <div class="page-header">
      <h2>{{ t('support.title') }}</h2>
      <p>{{ t('support.subtitle') }}</p>
    </div>

    <div class="help-container">
      <!-- Частые вопросы -->
      <div class="help-section">
        <h3><i class="fas fa-question-circle"></i> {{ t('support.section.faq') }}</h3>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 0 }" @click="toggleFaq(0)">
            <i class="fas fa-chevron-right"></i>
            <span>{{ t('support.faq.q1') }}</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 0 }">
            <p>{{ t('support.faq.a1') }}</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 1 }" @click="toggleFaq(1)">
            <i class="fas fa-chevron-right"></i>
            <span>{{ t('support.faq.q2') }}</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 1 }">
            <p>{{ t('support.faq.a2') }}</p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" :class="{ active: openFaqIndex === 2 }" @click="toggleFaq(2)">
            <i class="fas fa-chevron-right"></i>
            <span>{{ t('support.faq.q3') }}</span>
          </div>
          <div class="faq-answer" :class="{ show: openFaqIndex === 2 }">
            <p>{{ t('support.faq.a3') }}</p>
          </div>
        </div>
      </div>

      <!-- Установка оформления -->
      <div class="help-section">
        <h3><i class="fas fa-download"></i> {{ t('support.section.install') }}</h3>

        <div class="install-method recommended">
          <div class="recommended-badge">{{ t('support.install.recommended') }}</div>
          <h4>{{ t('support.method1.title') }}</h4>
          <p>{{ t('support.method1.desc') }}</p>
          <a href="https://chromewebstore.google.com/detail/steam-gif-uploader/jeoaabmjgoolmbhimhimihpkcmdhhlaj"
             target="_blank" class="extension-card">
            <div class="extension-icon"><i class="fab fa-chrome"></i></div>
            <div class="extension-info">
              <h5>{{ t('support.extension.name') }}</h5>
              <p>{{ t('support.extension.chrome') }}</p>
            </div>
          </a>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content"><p>{{ t('support.method1.step1') }}</p></div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content"><p>{{ t('support.method1.step2') }}</p></div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content"><p>{{ t('support.method1.step3') }}</p></div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content"><p>{{ t('support.method1.step4') }}</p></div>
            </div>
          </div>

          <!-- Локальное видео вместо YouTube -->
          <div class="local-video-container">
            <video style="width: 100%;" controls :poster="lang === 'ru' ? previewImage : previewEngImage" v-smooth-loop>
              <source v-if="lang === 'ru'" src="/mp4.mp4" type="video/mp4">
              <source v-else src="/mp4eng.mp4" type="video/webm">
              {{ t('support.video.fallback') }}
            </video>
          </div>

          <div class="pro-tip compact">
            <h5><i class="fas fa-lightbulb"></i> {{ t('support.protip.title') }}</h5>
            <div class="problem-image-container">
              <img :src="lang === 'en' ? problemEngImage : problemImage" alt="Пример проблемы с выбором витрины" class="problem-image" />
              <div class="image-caption">{{ t('support.protip.caption') }}</div>
            </div>
            <div class="solution-steps">
              <h5><i class="fas fa-check-circle"></i> {{ t('support.protip.howto') }}</h5>
              <ol>
                <li>{{ t('support.protip.step1') }}</li>
                <li>{{ t('support.protip.step2') }}</li>
                <li>{{ t('support.protip.step3') }}</li>
              </ol>
            </div>
          </div>
        </div>

        <div class="install-method">
          <h4>{{ t('support.method2.title') }}</h4>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <p>{{ t('support.method2.openLink') }}</p>
                <a href="http://steamcommunity.com/sharedfiles/edititem/767/3/" target="_blank" class="steam-link"><i
                    class="fab fa-steam"></i> http://steamcommunity.com/sharedfiles/edititem/767/3/</a>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <p>{{ t('support.method2.devtoolsIntro') }}</p>
                <ul class="browser-commands">
                  <li><strong>{{ t('support.method2.browserCommands.chrome') }}</strong> Ctrl+Shift+J</li>
                  <li><strong>{{ t('support.method2.browserCommands.firefox') }}</strong> Ctrl+Shift+K</li>
                </ul>
                <p>{{ t('support.method2.or') }}</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <p>{{ t('support.method2.enterCode') }}</p>

                <div class="code-block">
                  <p>{{ t('support.method2.image') }}</p>
                  <code>$J('#image_width').val('1000');$J('#image_height').val('1');</code>
                  <button class="copy-btn" @click="copyCode(1)"><i class="far" :class="isCopied1 ? 'fa-check' : 'fa-copy'"></i> {{ isCopied1 ? t('support.copied') : t('support.copy') }}</button>
                </div>

                <div class="code-block">
                  <p>{{ t('support.method2.screenshot') }}</p>
                  <code>$J('#image_width').val('1000');$J('#image_height').val('1');$J('[name="file_type"]').val("5");</code>
                  <button class="copy-btn" @click="copyCode(2)"><i class="far" :class="isCopied2 ? 'fa-check' : 'fa-copy'"></i> {{ isCopied2 ? t('support.copied') : t('support.copy') }}</button>
                </div>

                <div class="code-block">
                  <p>{{ t('support.method2.workshop') }}</p>
                  <code>
                    $J('[name=consumer_app_id]').val(480);
                    $J('[name=file_type]').val(0);
                    $J('[name=visibility]').val(0);
                  </code>
                  <button class="copy-btn" @click="copyCode(3)"><i class="far" :class="isCopied3 ? 'fa-check' : 'fa-copy'"></i> {{ isCopied3 ? t('support.copied') : t('support.copy') }}</button>
                </div>

                <p class="warning"><i class="fas fa-exclamation-triangle"></i> {{ t('support.method2.warning') }}</p>
                <img :src="primerGif" :alt="t('support.method2.imageAlt')" class="step-image"/>
              </div>
            </div>

            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <p>{{ t('support.method2.step4') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Контакты -->
      <div class="help-section">
        <h3><i class="fas fa-headset"></i> {{ t('support.section.support') }}</h3>
        <p>{{ t('support.contacts.description') }}</p>
        <div class="contact-methods">
          <div class="contact-card">
            <h4><i class="fab fa-telegram"></i> {{ t('support.contacts.telegramTitle') }}</h4>
            <p>{{ t('support.contacts.telegramDesc') }}</p>
            <a href="https://t.me/OFFRLINE" target="_blank" class="contact-link"><i class="fas fa-paper-plane"></i>
              {{ t('support.contacts.telegram') }}</a>
          </div>

          <div class="contact-card">
            <h4><i class="fab fa-discord"></i> {{ t('support.contacts.discordTitle') }}</h4>
            <p>{{ t('support.contacts.discordDesc') }}</p>
            <a href="https://discord.gg/2GCebZRavP" target="_blank" class="contact-link"><i class="fas fa-users"></i>
              {{ t('support.contacts.join') }}</a>
          </div>

          <div class="contact-card">
            <h4><i class="fas fa-envelope"></i> {{ t('support.contacts.emailTitle') }}</h4>
            <p>{{ t('support.contacts.emailDesc') }}</p>
            <a href="mailto:contact@aerodesign.store" class="contact-link"><i class="fas fa-envelope"></i> {{ t('support.contacts.emailCta') }}</a>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Layout from '../components/Layout.vue';
import primerGif from '../../primerru.gif';
import problemImage from '../../problemaru.png';
import problemEngImage from '../../problemaeng.png';
import previewImage from '../../public/images/preview.png';
import previewEngImage from '../../public/images/previewEng.png';
import { useI18n } from '../i18n';

const isCopied1 = ref(false);
const isCopied2 = ref(false);
const isCopied3 = ref(false);
const openFaqIndex = ref<number | null>(null);
const { t, lang } = useI18n();

function copyCode(which: 1 | 2 | 3) {
  const code1 = "$J('#image_width').val('1000');$J('#image_height').val('1');";
  const code2 = "$J('#image_width').val('1000');$J('#image_height').val('1');$J('[name=\"file_type\"]').val(\"5\");";
  const code3 = "$J('[name=consumer_app_id]').val(480);$J('[name=file_type]').val(0);$J('[name=visibility]').val(0);";

  let text = "";
  if (which === 1) text = code1;
  if (which === 2) text = code2;
  if (which === 3) text = code3;

  navigator.clipboard.writeText(text).then(() => {
    if (which === 1) {
      isCopied1.value = true;
      setTimeout(() => (isCopied1.value = false), 2000);
    } else if (which === 2) {
      isCopied2.value = true;
      setTimeout(() => (isCopied2.value = false), 2000);
    } else {
      isCopied3.value = true;
      setTimeout(() => (isCopied3.value = false), 2000);
    }
  });
}

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
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
  font-size: 2.5rem;
  background: linear-gradient(90deg, #00cfff, #3399ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  font-weight: 800;
}

.page-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
}

.help-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5% 60px;
  display: grid;
  gap: 40px;
}

.help-section {
  background: rgba(0, 15, 30, 0.45);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(0, 207, 255, 0.2);
  backdrop-filter: blur(8px);
}

.help-section h3 {
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-bottom: 10px;
}

.faq-item {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 207, 255, 0.1);
  padding-bottom: 20px;
}

.faq-question {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.faq-question i {
  transition: transform .3s ease;
}

.faq-question.active i {
  transform: rotate(90deg);
}

.faq-answer {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s ease, padding-top .3s ease;
}

.faq-answer.show {
  max-height: 500px;
  padding-top: 10px;
}

.install-method {
  background: rgba(0, 207, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  margin-bottom: 30px;
}

.install-method.recommended {
  border-color: var(--primary);
}

.recommended-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: var(--primary);
  color: #000;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: .8rem;
  font-weight: bold;
}

.steps {
  margin-top: 20px;
}

.step {
  display: flex;
  margin-bottom: 20px;
}

.step-number {
  background: var(--primary);
  color: #000;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.extension-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0, 207, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.3);
  border-radius: 12px;
  padding: 15px;
  text-decoration: none;
  color: inherit;
  margin: 15px 0;
  transition: all .3s ease;
}

.extension-card:hover {
  background: rgba(0, 207, 255, 0.1);
  transform: translateY(-3px);
}

.extension-icon {
  font-size: 2rem;
  color: var(--primary);
}

.extension-info h5 {
  color: var(--primary);
  margin-bottom: 5px;
}

.local-video-container {
  position: relative;
  width: 100%;
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 207, 255, 0.3);
}

.local-video-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* Улучшенное отображение изображения проблемы */
.problem-image-container { position: relative; margin: 15px 0; text-align: center; }
.problem-image { max-width: 100%; border-radius: 10px; border: 2px solid rgba(0, 207, 255, 0.4); box-shadow: 0 5px 20px rgba(0, 207, 255, 0.2); }
.image-caption { font-size: 0.9rem; color: var(--primary); margin-top: 10px; text-align: center; padding: 6px 12px; background: rgba(0, 207, 255, 0.1); border-radius: 6px; display: inline-block; }

.solution-steps { background: rgba(0, 207, 255, 0.1); border-left: 3px solid var(--primary); padding: 15px; margin-top: 15px; border-radius: 0 10px 10px 0; }
.solution-steps h5 { color: var(--primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; }
.solution-steps ol { padding-left: 20px; color: rgba(255, 255, 255, 0.8); margin: 0; }
.solution-steps li { margin-bottom: 8px; line-height: 1.4; font-size: 0.95rem; }
.solution-steps strong { color: var(--primary); }

.pro-tip.compact { padding: 12px; margin-top: 15px; }
.pro-tip.compact h5 { margin-bottom: 8px; font-size: 1.1rem; }

.pro-tip {
  background: rgba(0, 207, 255, 0.1);
  border-left: 3px solid var(--primary);
  padding: 15px;
  margin-top: 20px;
  border-radius: 0 8px 8px 0;
}

.pro-tip h5 {
  color: var(--primary);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.browser-commands {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
}

.code-block {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 207, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  margin: 10px 0;
  position: relative;
  overflow-x: auto;
}

.code-block code {
  display: block;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 10px;
  color: var(--primary);
}

.copy-btn {
  background: rgba(0, 207, 255, 0.1);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all .3s ease;
}

.copy-btn:hover {
  background: var(--primary);
  color: #000;
}

.warning {
  color: #ff9f43;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.step-image {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px solid rgba(0, 207, 255, 0.3);
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.contact-card {
  background: rgba(0, 207, 255, 0.05);
  border: 1px solid rgba(0, 207, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all .3s ease;
}

.contact-card:hover {
  background: rgba(0, 207, 255, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 207, 255, 0.2);
}

.contact-card h4 {
  color: var(--primary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-card p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
  line-height: 1.6;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  text-decoration: none;
  transition: all .3s ease;
  padding: 8px 15px;
  background: rgba(0, 207, 255, 0.1);
  border-radius: 8px;
}

.contact-link:hover {
  background: var(--primary);
  color: #000;
}

/* Длинные ссылки не должны ломать вёрстку на малых экранах */
.steam-link {
  word-break: break-word;
  overflow-wrap: anywhere;
}

@media (max-width: 768px) {
  .page-header h2 {
    font-size: 2rem;
  }

  .help-section {
    padding: 20px;
  }

  .step {
    flex-direction: column;
  }

  .step-number {
    margin-bottom: 10px;
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .page-header h2 {
    font-size: 1.8rem;
  }

  .page-header p {
    font-size: 1rem;
  }
}
</style>


