import { reactive } from 'vue';

export type CartItem = {
  id: string;
  name: string;
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
  return {
    get items() { return state.items; },
    add,
    removeByIndex,
    clear
  };
}


