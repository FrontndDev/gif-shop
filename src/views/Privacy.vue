<template>
  <Layout>
    <div class="container">
      <header class="page-header">
        <h1>{{ t('privacy.title') }}</h1>
        <p>{{ t('privacy.subtitle') }}</p>
      </header>

      <section class="highlight">
        <p><strong>{{ t('privacy.important') }}</strong></p>
      </section>

      <h2>{{ t('privacy.concepts.title') }}</h2>
      <p>{{ t('privacy.concepts.intro') }}</p>
      <p><strong>{{ t('privacy.concepts.personalData') }}</strong></p>
      <p><strong>{{ t('privacy.concepts.processing') }}</strong></p>
      <p><strong>{{ t('privacy.concepts.subject') }}</strong></p>
      <p><strong>{{ t('privacy.concepts.operator') }}</strong></p>

      <h2>{{ t('privacy.collection.title') }}</h2>
      <p>{{ t('privacy.collection.order.title') }}</p>
      <ul>
        <li>{{ t('privacy.collection.order.email') }}</li>
        <li>{{ t('privacy.collection.order.name') }}</li>
        <li>{{ t('privacy.collection.order.payment') }}</li>
      </ul>
      <p>{{ t('privacy.collection.technical.title') }}</p>
      <ul>
        <li>{{ t('privacy.collection.technical.ip') }}</li>
        <li>{{ t('privacy.collection.technical.browser') }}</li>
        <li>{{ t('privacy.collection.technical.cookies') }}</li>
        <li>{{ t('privacy.collection.technical.referrer') }}</li>
      </ul>

      <h2>{{ t('privacy.purposes.title') }}</h2>
      <p>{{ t('privacy.purposes.intro') }}</p>
      <ul>
        <li>{{ t('privacy.purposes.order') }}</li>
        <li>{{ t('privacy.purposes.site') }}</li>
        <li>{{ t('privacy.purposes.communication') }}</li>
        <li>{{ t('privacy.purposes.fraud') }}</li>
        <li>{{ t('privacy.purposes.legal') }}</li>
      </ul>

      <h2>{{ t('privacy.legal.title') }}</h2>
      <p>{{ t('privacy.legal.intro') }}</p>
      <ul>
        <li>{{ t('privacy.legal.consent') }}</li>
        <li>{{ t('privacy.legal.contract') }}</li>
        <li>{{ t('privacy.legal.obligations') }}</li>
      </ul>

      <h2>{{ t('privacy.storage.title') }}</h2>
      <p>{{ t('privacy.storage.intro') }}</p>
      <ul>
        <li>{{ t('privacy.storage.account') }}</li>
        <li>{{ t('privacy.storage.payment') }}</li>
        <li>{{ t('privacy.storage.orders') }}</li>
      </ul>

      <h2>{{ t('privacy.protection.title') }}</h2>
      <p>{{ t('privacy.protection.intro') }}</p>
      <ul>
        <li>{{ t('privacy.protection.ssl') }}</li>
        <li>{{ t('privacy.protection.access') }}</li>
        <li>{{ t('privacy.protection.updates') }}</li>
      </ul>
      <p>{{ t('privacy.protection.payment') }}</p>

      <h2>{{ t('privacy.transfer.title') }}</h2>
      <p>{{ t('privacy.transfer.intro') }}</p>
      <ul>
        <li>{{ t('privacy.transfer.payment') }}</li>
        <li>{{ t('privacy.transfer.hosting') }}</li>
        <li>{{ t('privacy.transfer.government') }}</li>
      </ul>
      <p>{{ t('privacy.transfer.noMarketing') }}</p>

      <h2>{{ t('privacy.cookies.title') }}</h2>
      <p>{{ t('privacy.cookies.intro') }}</p>
      <ul>
        <li>{{ t('privacy.cookies.cart') }}</li>
        <li>{{ t('privacy.cookies.analytics') }}</li>
        <li>{{ t('privacy.cookies.preferences') }}</li>
      </ul>
      <p>{{ t('privacy.cookies.disable') }}</p>

      <h2>{{ t('privacy.rights.title') }}</h2>
      <p>{{ t('privacy.rights.intro') }}</p>
      <ul>
        <li>{{ t('privacy.rights.access') }}</li>
        <li>{{ t('privacy.rights.correction') }}</li>
        <li>{{ t('privacy.rights.deletion') }}</li>
        <li>{{ t('privacy.rights.withdraw') }}</li>
      </ul>
      <p>{{ t('privacy.rights.contact') }}</p>

      <h2>{{ t('privacy.changes.title') }}</h2>
      <p>{{ t('privacy.changes.right') }}</p>
      <p>{{ t('privacy.changes.law') }}</p>

      <section class="highlight">
        <p><strong>{{ t('privacy.contact.title') }}</strong></p>
        <p>{{ t('privacy.contact.name') }}</p>
        <p>{{ t('privacy.contact.tin') }}</p>
        <p>{{ t('privacy.contact.email') }}</p>
        <p>{{ t('privacy.contact.date') }}</p>
      </section>

      <div class="footer">
        <p>{{ t('privacy.footer.copyright') }}</p>
        <p>{{ t('privacy.footer.lastUpdate') }}</p>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { useI18n } from '../i18n';

const { t } = useI18n();
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
.page-header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid rgba(0, 207, 255, 0.3); padding-bottom: 20px; }
h1 { color: var(--primary); font-size: 2.2rem; margin-bottom: 10px; }
h2 { color: var(--primary); font-size: 1.5rem; margin-top: 30px; margin-bottom: 15px; }
p, li { margin-bottom: 15px; font-size: 1rem; }
ul { padding-left: 20px; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.highlight { background: rgba(0,207,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--primary); }
.footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(0, 207, 255, 0.3); font-size: 0.9rem; color: #aaa; }
@media (max-width: 768px) {
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.3rem; }
}
</style>


