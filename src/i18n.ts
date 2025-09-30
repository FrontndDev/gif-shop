import { ref } from 'vue';
import type { SupportedLang } from './i18n/types';
import { common } from './i18n/common';
import { layout } from './i18n/layout';
import { shop } from './i18n/shop';
import { product } from './i18n/product';
import { cart } from './i18n/cart';
import { payment } from './i18n/payment';
import { success } from './i18n/success';
import { support } from './i18n/support';
import { order } from './i18n/order';
import { offer } from './i18n/offer';
import { privacy } from './i18n/privacy';

const supportedLanguages: SupportedLang[] = ['ru', 'en'];
const stored = (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null) as SupportedLang | null;

function detectLangFromNavigator(): SupportedLang {
  try {
    const code = (navigator?.language || navigator?.languages?.[0] || '').toLowerCase();
    if (code.startsWith('ru')) return 'ru';
  } catch { /* ignore */ }
  return 'en';
}

function detectInitialLang(): SupportedLang {
  if (stored && supportedLanguages.includes(stored)) return stored;
  return detectLangFromNavigator();
}

const lang = ref<SupportedLang>(detectInitialLang());

function mergeBundles(...bundles: Array<{ ru: Record<string, string>; en: Record<string, string> }>): Record<SupportedLang, Record<string, string>> {
  const out: Record<SupportedLang, Record<string, string>> = { ru: {}, en: {} };
  for (const b of bundles) {
    Object.assign(out.ru, b.ru);
    Object.assign(out.en, b.en);
  }
  return out;
}

const messages = mergeBundles(
  common,
  layout,
  shop,
  product,
  cart,
  payment,
  success,
  support,
  order,
  offer,
  privacy
);

export function useI18n() {
  function setLang(next: SupportedLang) {
    if (!supportedLanguages.includes(next)) return;
    lang.value = next;
    try { localStorage.setItem('lang', next); } catch { /* ignore */ }
  }
  function t(key: string): string {
    const dict = messages[lang.value] || messages.ru;
    return dict[key] || key;
  }
  return { lang, setLang, t };
}



