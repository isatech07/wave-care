export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

//  Token 
// Chave usada para salvar o JWT no localStorage
const TOKEN_KEY = 'wavecare_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

// Fetch autenticado 
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Erro ${res.status}`);
  return data;
}

// Tipos 

export interface MappedUser {
  id?: number;
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  foto?: string;
  role?: string;
}

function mapUser(raw: any): MappedUser {
  const u = raw?.user ?? raw;
  if (!u || typeof u !== 'object') return {};
  return {
    id:       u.id,
    email:    u.email    ?? '',
    telefone: u.telefone ?? '',
    cidade:   u.cidade   ?? '',
    foto:     u.foto     ?? undefined,
    role:     u.role     ?? 'user',
    nome:     u.name     ?? u.nome ?? '',
  };
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  season: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  badge?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  id: number;         
  quantity: number;
  cartId: number;
  productId: number;
  product: ApiProduct;
  createdAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: ApiProduct;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

//  Auth / Usuário 


export async function apiLogin(email: string, password: string): Promise<MappedUser> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');

  if (data.access_token) saveToken(data.access_token);

  return mapUser(data.user);
}

/** POST /users/register */
export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar');
  return data;
}

/** PUT /users/:id — requer JWT */
export async function apiUpdateUser(
  id: number,
  fields: { name?: string; email?: string; telefone?: string; cidade?: string },
): Promise<MappedUser> {
  const data = await authFetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  return mapUser(data);
}

/** DELETE /users/:id — requer JWT */
export async function apiDeleteUser(id: number): Promise<true> {
  await authFetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  return true;
}

// Produtos

export async function getProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return data;
}

//  Carrinho 

export async function apiAddCartItem(
  userId: number,
  productId: number,
  quantity: number
): Promise<CartItem> {
  return authFetch(`${API_URL}/cart`, {
    method: 'POST',
    body: JSON.stringify({ userId, productId, quantity }),
  });
}

/** GET /cart/:userId — requer JWT */
export async function apiGetCart(userId: number): Promise<Cart | null> {
  try {
    return await authFetch(`${API_URL}/cart/${userId}`);
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.includes('não encontrado')) return null;
    throw err;
  }
}

/** PUT /cart/:cartItemId — requer JWT */
export async function apiUpdateCartItem(cartItemId: number, quantity: number): Promise<CartItem> {
  return authFetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

/** DELETE /cart/:cartItemId — requer JWT */
export async function apiRemoveCartItem(cartItemId: number): Promise<void> {
  return authFetch(`${API_URL}/cart/${cartItemId}`, { method: 'DELETE' });
}

/** DELETE /cart/clear/:userId — requer JWT */
export async function apiClearCart(userId: number): Promise<void> {
  return authFetch(`${API_URL}/cart/clear/${userId}`, { method: 'DELETE' });
}

// Pedidos 

export async function apiCreateOrder(userId: number): Promise<Order> {
  return authFetch(`${API_URL}/order/${userId}`, { method: 'POST' });
}

/** GET /order — requer JWT + admin */
export async function apiGetAllOrders(): Promise<Order[]> {
  return authFetch(`${API_URL}/order`);
}

/** GET /order/:id — requer JWT */
export async function apiGetOrder(orderId: number): Promise<Order | null> {
  try {
    return await authFetch(`${API_URL}/order/${orderId}`);
  } catch {
    return null;
  }
}

/** PUT /order/:id — requer JWT + admin */
export async function apiUpdateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  return authFetch(`${API_URL}/order/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/** DELETE /order/:id — requer JWT + admin */
export async function apiDeleteOrder(orderId: number): Promise<void> {
  return authFetch(`${API_URL}/order/${orderId}`, { method: 'DELETE' });
}

const ordersKey = (userId: number) => `wavecare_orders_${userId}`;

export function saveOrderLocally(userId: number, order: Order): void {
  if (typeof window === 'undefined') return;
  const key = ordersKey(userId);
  const existing: Order[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  const updated = [order, ...existing.filter((o) => o.id !== order.id)];
  localStorage.setItem(key, JSON.stringify(updated));
}

export function apiGetUserOrders(userId: number): Order[] {
  if (typeof window === 'undefined') return [];
  const key = ordersKey(userId);
  return JSON.parse(localStorage.getItem(key) ?? '[]');
}

export async function apiGetOrdersByUser(userId: number): Promise<Order[]> {
  try {
    return await authFetch(`${API_URL}/order/user/${userId}`)
  } catch {
    return []
  }
}

// ── Quiz ─────────────────────────────────────────────────────────────────────
 
export interface QuizPayload {
  city: string
  hairType: string
  beachFrequency: string
  sunProtection: string
  wetHair: string
  hairState: string
  chemicalProcess: string
  season: string
}
 
export interface QuizApiResult {
  diagnosis: string
  scores: Record<string, number>
  season: string
  recommendedKit: string
}
 
/** POST /quiz — envia resultado ao banco; userId vai via JWT no header */
export async function apiSubmitQuiz(payload: QuizPayload): Promise<QuizApiResult> {
  const token = getToken()
  const res = await fetch(`${API_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Erro ao enviar quiz')
  return data
}