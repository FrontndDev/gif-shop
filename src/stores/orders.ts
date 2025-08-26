import { defineStore } from 'pinia';
import { createOrder, type CreateOrderRequest } from '../lib/api';

type Order = { id: string } & CreateOrderRequest & Record<string, unknown>;

export const useOrders = defineStore('orders', {
  state: () => ({ items: [] as Order[], submitting: false, error: null as string | null }),
  actions: {
    async submit(payload: CreateOrderRequest): Promise<Order> {
      this.submitting = true; this.error = null;
      try {
        const res = await createOrder(payload) as Order;
        this.items.unshift({ ...payload, ...res } as Order);
        return res;
      } catch (e: any) {
        this.error = e?.message || 'Не удалось отправить заявку';
        throw e;
      } finally {
        this.submitting = false;
      }
    }
  }
});


