import { computed } from 'vue';
import { useI18n } from '../i18n';

export function usePrice() {
  const { lang } = useI18n();

  const formatPrice = (price: number, priceUSD?: number) => {
    const useUSD = lang.value === 'en';
    const amount = useUSD && priceUSD ? priceUSD : price;
    const currency = useUSD ? '$' : '₽';
    return `${amount.toFixed(2)} ${currency}`;
  };

  const getPrice = (price: number, priceUSD?: number) => {
    const useUSD = lang.value === 'en';
    return useUSD && priceUSD ? priceUSD : price;
  };

  const getCurrency = () => {
    return lang.value === 'en' ? '$' : '₽';
  };

  return {
    formatPrice,
    getPrice,
    getCurrency
  };
}
