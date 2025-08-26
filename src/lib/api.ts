// Lightweight API client using fetch
// Uses VITE_API_URL if provided, otherwise relies on Vite dev proxy for /api

export type ApiProduct = {
  id: string;
  title: string;
  price: number;
  video?: string;
  badge?: string;
};

export type CreateOrderRequest = {
  name: string;
  telegramDiscord: string;
  steamProfile: string;
  style: string;
  colorTheme: string;
  details: string;
};

const baseUrl = import.meta.env?.VITE_API_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getProducts(params?: { showcase?: string | string[]; profileColor?: string | string[]; theme?: string | string[] }): Promise<ApiProduct[]> {
  const search = new URLSearchParams();
  const appendParam = (key: string, value?: string | string[]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(v => { if (v) search.append(key, v); });
    } else {
      search.append(key, value);
    }
  };
  appendParam('showcase', params?.showcase);
  appendParam('profileColor', params?.profileColor);
  appendParam('theme', params?.theme);
  const qs = search.toString();
  const path = `/api/products${qs ? `?${qs}` : ''}`;
  return request<ApiProduct[]>(path);
}

export function getProductById(id: string): Promise<ApiProduct> {
  return request<ApiProduct>(`/api/products/${id}`);
}

export function createOrder(payload: CreateOrderRequest): Promise<{ id: string } & Record<string, unknown>> {
  return request(`/api/orders`, { method: 'POST', body: JSON.stringify(payload) });
}


