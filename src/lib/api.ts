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

// Payments
export function createPayment(payload: {
  amount: number;
  currency: 'RUB' | 'EUR' | 'USD';
  description?: string;
  returnUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<{ id?: string; confirmation?: { confirmation_url?: string } } & Record<string, any>> {
  return request(`/api/payments/create`, { method: 'POST', body: JSON.stringify(payload) });
}

// Orders status
export function getOrderStatus(orderId: string): Promise<{ status: string } & Record<string, any>> {
  return request(`/api/orders/${orderId}`);
}

// YooKassa payment status passthrough
// Removed payment status passthrough from frontend usage per new flow

// PayPal
export function createPaypalOrder(payload: { amount: number; currency: 'USD' | 'EUR'; }): Promise<{ id: string; links?: Array<{ rel: string; href: string }> }> {
  return request(`/api/paypal/orders/create`, { method: 'POST', body: JSON.stringify(payload) });
}

export function capturePaypalOrder(orderId: string): Promise<Record<string, any>> {
  return request(`/api/paypal/orders/${orderId}/capture`, { method: 'POST' });
}

// Telegram order relay
export function sendTelegramOrder(payload: CreateOrderRequest): Promise<{ ok: boolean } & Record<string, any>> {
  return request(`/api/telegram/order`, { method: 'POST', body: JSON.stringify(payload) });
}


