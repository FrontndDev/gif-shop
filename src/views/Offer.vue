<template>
  <Layout>
    <div class="container">
      <header class="page-header">
        <h1>{{ t('offer.title') }}</h1>
        <p>{{ t('offer.subtitle') }}</p>
      </header>

      <section class="highlight">
        <p><strong>{{ t('offer.attention') }}</strong></p>
      </section>

      <h2>{{ t('offer.sections.general.title') }}</h2>
      <p>{{ t('offer.sections.general.p1') }}</p>
      <p>{{ t('offer.sections.general.p2') }}</p>

      <h2>{{ t('offer.sections.terms.title') }}</h2>
      <p><strong>{{ t('offer.sections.terms.offer') }}</strong> <a href="https://aerodesign.store" target="_blank" rel="noopener">https://aerodesign.store</a>.</p>
      <p><strong>{{ t('offer.sections.terms.seller') }}</strong></p>
      <p><strong>{{ t('offer.sections.terms.site') }}</strong> <a href="https://aerodesign.store" target="_blank" rel="noopener">https://aerodesign.store</a>.</p>
      <p><strong>{{ t('offer.sections.terms.buyer') }}</strong></p>
      <p><strong>{{ t('offer.sections.terms.acceptance') }}</strong></p>
      <p><strong>{{ t('offer.sections.terms.digitalGood') }}</strong></p>
      <p><strong>{{ t('offer.sections.terms.order') }}</strong></p>

      <h2>{{ t('offer.sections.subject.title') }}</h2>
      <p>{{ t('offer.sections.subject.p1') }}</p>
      <p>{{ t('offer.sections.subject.p2') }}</p>

      <h2>{{ t('offer.sections.order.title') }}</h2>
      <p>{{ t('offer.sections.order.p1') }}</p>
      <p>{{ t('offer.sections.order.p2') }}</p>
      <p>{{ t('offer.sections.order.p3') }}</p>
      <p>{{ t('offer.sections.order.p4') }}</p>

      <h2>{{ t('offer.sections.payment.title') }}</h2>
      <p>{{ t('offer.sections.payment.p1') }}</p>
      <p>{{ t('offer.sections.payment.p2') }}</p>
      <ul>
        <li>{{ t('offer.sections.payment.method1') }}</li>
        <li>{{ t('offer.sections.payment.method2') }}</li>
      </ul>
      <p>{{ t('offer.sections.payment.p3') }}</p>

      <h2>{{ t('offer.sections.delivery.title') }}</h2>
      <p>{{ t('offer.sections.delivery.p1') }}</p>
      <ul>
        <li>{{ t('offer.sections.delivery.method1') }}</li>
        <li>{{ t('offer.sections.delivery.method2') }}</li>
      </ul>
      <p>{{ t('offer.sections.delivery.p2') }}</p>

      <h2>{{ t('offer.sections.returns.title') }}</h2>
      <p>{{ t('offer.sections.returns.p1') }}</p>
      <p>{{ t('offer.sections.returns.p2') }}</p>

      <h2>{{ t('offer.sections.responsibility.title') }}</h2>
      <p>{{ t('offer.sections.responsibility.p1') }}</p>
      <p>{{ t('offer.sections.responsibility.p2') }}</p>

      <h2>{{ t('offer.sections.privacy.title') }}</h2>
      <p>{{ t('offer.sections.privacy.p1') }} <RouterLink to="/privacy">{{ t('privacy.title') }}</RouterLink>.</p>

      <h2>{{ t('offer.sections.final.title') }}</h2>
      <p>{{ t('offer.sections.final.p1') }}</p>
      <p>{{ t('offer.sections.final.p2') }}</p>
      <p>{{ t('offer.sections.final.p3') }}</p>
      <p>{{ t('offer.sections.final.p4') }}</p>
      <p>{{ t('offer.sections.final.p5') }}</p>

      <section class="highlight">
        <p><strong>{{ t('offer.sellerDetails.title') }}</strong></p>
        <p>{{ t('offer.sellerDetails.name') }}</p>
        <p>{{ t('offer.sellerDetails.tin') }}</p>
        <p>{{ t('offer.sellerDetails.email') }}</p>
      </section>

      <div class="footer">
        <p>{{ t('offer.footer.copyright') }}</p>
        <p>{{ t('offer.footer.date') }}</p>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { RouterLink } from 'vue-router';
import { useI18n } from '../i18n';

const { t } = useI18n();
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
.page-header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 207, 255, 0.3); padding-bottom: 12px; }
h1 { color: var(--primary); font-size: 2.2rem; margin-bottom: 10px; }
h2 { color: var(--primary); font-size: 1.5rem; margin-top: 30px; margin-bottom: 15px; }
p, li { margin-bottom: 15px; font-size: 1rem; }
ul { padding-left: 20px; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.highlight { background: rgba(0,207,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--primary); }
.footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid rgba(0, 207, 255, 0.3); font-size: 0.9rem; color: #aaa; }
@media (max-width: 768px) { h1 { font-size: 1.8rem; } h2 { font-size: 1.3rem; } }
</style>


