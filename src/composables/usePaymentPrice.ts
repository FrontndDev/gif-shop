import { computed } from 'vue';
import { useCart } from '../stores/cart';

export function usePaymentPrice() {
  const cart = useCart();

  const formatPriceByPaymentMethod = (price: number, priceUSD?: number, paymentMethod?: 'yookassa' | 'paypal') => {
    const useUSD = paymentMethod === 'paypal';
    const amount = useUSD && priceUSD ? priceUSD : price;
    const currency = useUSD ? '$' : '₽';
    return `${amount.toFixed(2)} ${currency}`;
  };

  const getPriceByPaymentMethod = (price: number, priceUSD?: number, paymentMethod?: 'yookassa' | 'paypal') => {
    const useUSD = paymentMethod === 'paypal';
    return useUSD && priceUSD ? priceUSD : price;
  };

  const getCurrencyByPaymentMethod = (paymentMethod?: 'yookassa' | 'paypal') => {
    return paymentMethod === 'paypal' ? '$' : '₽';
  };

  // Получаем общую сумму корзины в зависимости от способа оплаты
  const getCartTotalByPaymentMethod = (paymentMethod?: 'yookassa' | 'paypal') => {
    return cart.items.reduce((total, item) => {
      // Если это paypal и есть priceUSD в метаданных товара, используем его
      if (paymentMethod === 'paypal' && item.priceUSD) {
        return total + item.priceUSD;
      }
      return total + item.price;
    }, 0);
  };

  return {
    formatPriceByPaymentMethod,
    getPriceByPaymentMethod,
    getCurrencyByPaymentMethod,
    getCartTotalByPaymentMethod
  };
}
