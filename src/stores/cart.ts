import { reactive } from 'vue';
import { getProductById, type ApiProduct } from '../lib/api';

export type CartItem = {
  id: string;
  name: string;
  titleEn?: string;
  price: number;
  priceUSD?: number;
  currency: string;
  image?: string;
  quantity: number;
};

const state = reactive<{ items: CartItem[] }>({
  items: JSON.parse(localStorage.getItem('cart') || '[]')
});

function persist() {
  localStorage.setItem('cart', JSON.stringify(state.items));
}

export function useCart() {
  function add(item: CartItem) {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) existing.quantity += item.quantity; else state.items.push(item);
    persist();
  }
  
  function removeByIndex(index: number) {
    state.items.splice(index, 1);
    persist();
  }
  
  function clear() {
    state.items.length = 0;
    persist();
  }

  // Функция для синхронизации всех данных товара с актуальными данными
  async function syncPrices(): Promise<{ updated: boolean; changes: string[] }> {
    const changes: string[] = [];
    let updated = false;

    for (const item of state.items) {
      try {
        const product: ApiProduct = await getProductById(item.id);
        
        // Проверяем изменения в данных товара
        const priceChanged = product.price !== item.price || product.priceUSD !== item.priceUSD;
        const nameChanged = product.title !== item.name;
        const titleEnChanged = product.titleEn !== item.titleEn;
        const videoChanged = product.video !== item.image;
        
        if (priceChanged || nameChanged || titleEnChanged || videoChanged) {
          const itemChanges: string[] = [];
          
          // Обновляем цену
          if (priceChanged) {
            const oldPrice = item.price;
            const oldPriceUSD = item.priceUSD;
            item.price = product.price;
            item.priceUSD = product.priceUSD;
            itemChanges.push(`Цена: ${oldPrice} → ${product.price}${product.priceUSD ? ` (${oldPriceUSD} → ${product.priceUSD} USD)` : ''}`);
          }
          
          // Обновляем название
          if (nameChanged) {
            const oldName = item.name;
            item.name = product.title;
            itemChanges.push(`Название: "${oldName}" → "${product.title}"`);
          }
          
          // Обновляем английское название
          if (titleEnChanged) {
            item.titleEn = product.titleEn;
            itemChanges.push(`Название (EN): обновлено`);
          }
          
          // Обновляем видео/изображение
          if (videoChanged) {
            item.image = product.video;
            itemChanges.push(`Видео: обновлено`);
          }
          
          if (itemChanges.length > 0) {
            changes.push(`${item.name}: ${itemChanges.join(', ')}`);
            updated = true;
          }
        }
      } catch (error) {
        console.warn(`Не удалось обновить данные для товара ${item.id}:`, error);
        // Если товар больше не существует, можно удалить его из корзины
        // или оставить как есть - решайте сами
      }
    }

    if (updated) {
      persist();
    }

    return { updated, changes };
  }

  // Функция для обновления конкретного товара в корзине
  async function updateItemPrice(itemId: string): Promise<boolean> {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return false;

    try {
      const product: ApiProduct = await getProductById(itemId);
      
      if (product.price !== item.price || product.priceUSD !== item.priceUSD) {
        item.price = product.price;
        item.priceUSD = product.priceUSD;
        persist();
        return true;
      }
    } catch (error) {
      console.warn(`Не удалось обновить цену для товара ${itemId}:`, error);
    }

    return false;
  }

  return {
    get items() { return state.items; },
    add,
    removeByIndex,
    clear,
    syncPrices,
    updateItemPrice
  };
}


