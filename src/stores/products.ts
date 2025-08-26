import { defineStore } from 'pinia';
import { getProductById, getProducts, type ApiProduct } from '../lib/api';

type ProductsState = {
  items: ApiProduct[];
  byId: Record<string, ApiProduct>;
  loading: boolean;
  error: string | null;
};

export const useProducts = defineStore('products', {
  state: (): ProductsState => ({ items: [], byId: {}, loading: false, error: null }),
  getters: {
    getById: (state) => (id: string) => state.byId[id] || null
  },
  actions: {
    async fetchAll(params?: { showcase?: string | string[]; profileColor?: string | string[]; theme?: string | string[] }): Promise<ApiProduct[]> {
      // если нет фильтров — возвращаем кэш немедленно, а обновление делаем в фоне
      if (!params && this.items.length) {
        // fire-and-forget обновление
        this._backgroundRefresh();
        return this.items;
      }
      this.loading = true; this.error = null;
      try {
        const data = await getProducts(params);
        this.items = data;
        const map: Record<string, ApiProduct> = {};
        for (const p of data) map[p.id] = p;
        this.byId = map;
        return data;
      } catch (e: any) {
        this.error = e?.message || 'Не удалось загрузить продукты';
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async _backgroundRefresh() {
      try {
        const data = await getProducts();
        this.items = data;
        const map: Record<string, ApiProduct> = {};
        for (const p of data) map[p.id] = p;
        this.byId = map;
      } catch {
        // ignore background errors
      }
    },
    async fetchById(id: string): Promise<ApiProduct> {
      if (this.byId[id]) return this.byId[id];
      this.loading = true; this.error = null;
      try {
        const p = await getProductById(id);
        this.byId[id] = p;
        if (!this.items.find(i => i.id === id)) this.items.push(p);
        return p;
      } catch (e: any) {
        this.error = e?.message || 'Не удалось загрузить продукт';
        throw e;
      } finally {
        this.loading = false;
      }
    }
  }
});


