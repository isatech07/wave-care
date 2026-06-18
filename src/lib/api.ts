export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

//  Token 
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
export function mapUser(raw: any): MappedUser {
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

export interface MappedUser {
  id?: number;
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  foto?: string;
  role?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  category: string;
  season: string;
  stock?: number;
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

export interface OrderApi extends Order {}

export interface AdminUserListItem {
  id: number;
  name: string;
  email: string;
  telefone: string | null;
  cidade: string | null;
  foto: string | null;
  role: string;
}

export async function apiGetAllUsers(): Promise<AdminUserListItem[]> {
  return authFetch(`${API_URL}/users`);
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

export async function createProduct(data: Omit<ApiProduct, 'id' | 'createdAt'>): Promise<ApiProduct> {
  return authFetch(`${API_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<Omit<ApiProduct, 'id' | 'createdAt'>>): Promise<ApiProduct> {
  return authFetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return authFetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
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

export async function apiGetCart(userId: number): Promise<Cart | null> {
  try {
    return await authFetch(`${API_URL}/cart/${userId}`);
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.includes('não encontrado')) return null;
    throw err;
  }
}

export async function apiUpdateCartItem(cartItemId: number, quantity: number): Promise<CartItem> {
  return authFetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function apiRemoveCartItem(cartItemId: number): Promise<void> {
  return authFetch(`${API_URL}/cart/${cartItemId}`, { method: 'DELETE' });
}

export async function apiClearCart(userId: number): Promise<void> {
  return authFetch(`${API_URL}/cart/clear/${userId}`, { method: 'DELETE' });
}

// Pedidos 

export async function apiCreateOrder(
  userId: number,
  paymentMethod: 'pix' | 'card' | 'boleto' = 'card'
): Promise<Order> {
  return authFetch(`${API_URL}/order`, {
    method: 'POST',
    body: JSON.stringify({ paymentMethod }),
  });
}

export async function apiConfirmPayment(orderId: number, paymentMethod: string): Promise<Order> {
  return authFetch(`${API_URL}/order/${orderId}/pay`, {
    method: 'PUT',
    body: JSON.stringify({ paymentMethod }),
  });
}

function normalizeOrder(o: any): Order {
  return {
    ...o,
    status: (o.status as string).toUpperCase() as OrderStatus,
  };
}

export async function apiGetAllOrders(): Promise<Order[]> {
  const data = await authFetch(`${API_URL}/order`);
  return data.map(normalizeOrder);
}

export async function apiGetOrder(orderId: number): Promise<Order | null> {
  try {
    return await authFetch(`${API_URL}/order/${orderId}`);
  } catch {
    return null;
  }
}

export async function apiUpdateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const statusMap: Record<OrderStatus, string> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'canceled',
  };
  const data = await authFetch(`${API_URL}/order/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: statusMap[status] }),
  });
  return normalizeOrder(data);
}

export async function apiDeleteOrder(orderId: number): Promise<void> {
  return authFetch(`${API_URL}/order/${orderId}`, { method: 'DELETE' });
}

// ✅ Agora busca do backend em vez do localStorage
export async function apiGetUserOrders(userId: number): Promise<Order[]> {
  try {
    const data = await authFetch(`${API_URL}/order/user/${userId}`);
    return data.map(normalizeOrder);
  } catch {
    return [];
  }
}

export async function apiGetOrdersByUser(userId: number): Promise<Order[]> {
  try {
    const data = await authFetch(`${API_URL}/order/user/${userId}`);
    return data.map(normalizeOrder);
  } catch {
    return [];
  }
}

// Mantido como fallback para compatibilidade
export function saveOrderLocally(userId: number, order: Order): void {
  if (typeof window === 'undefined') return;
  const key = `wavecare_orders_${userId}`;
  const existing: Order[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  const updated = [order, ...existing.filter((o) => o.id !== order.id)];
  localStorage.setItem(key, JSON.stringify(updated));
}

export async function getOrderDisplayNumber(userId: number, orderId: number): Promise<number> {
  try {
    const orders = await apiGetOrdersByUser(userId);
    const chronological = [...orders].reverse();
    const idx = chronological.findIndex((o) => o.id === orderId);
    return idx === -1 ? chronological.length : idx + 1;
  } catch {
    return orderId;
  }
}

export function getOrderNumberForUser(userId: number, orderId: number): number {
  if (typeof window === 'undefined') return orderId;
  const key = `wavecare_orders_${userId}`;
  const orders: Order[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  const chronological = [...orders].reverse();
  const index = chronological.findIndex((o) => o.id === orderId);
  return index === -1 ? chronological.length + 1 : index + 1;
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

export interface QuizResult extends QuizApiResult {
  hairType: string
  createdAt: string
}

export async function apiSubmitQuiz(payload: QuizPayload): Promise<QuizApiResult> {
  const token = getToken();
  const res = await fetch(`${API_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erro ao enviar quiz');
  return data;
}

export async function apiGetMyQuizResult(): Promise<QuizResult | null> {
  try {
    return await authFetch(`${API_URL}/quiz/me`);
  } catch (err: any) {
    if (err.message?.includes('404') || err.message?.includes('não encontrado')) return null;
    throw err;
  }
}

// ── Perfil unificado ──────────────────────────────────────────────────────────

export interface MyProfile {
  id: number
  name: string
  email: string
  telefone: string | null
  cidade: string | null
  foto?: string | null
  role: string
  capilar: {
    tipo: string
    preocupacao: string
    frequenciaPreia: string
    estacaoCritica: string
    diagnosis: string
    recommendedKit: string
    updatedAt: string
  } | null
}

export async function apiGetMyProfile(): Promise<MyProfile | null> {
  try {
    return await authFetch(`${API_URL}/users/me/profile`);
  } catch (err: any) {
    if (
      err.message?.includes('401') ||
      err.message?.includes('403') ||
      err.message?.includes('Unauthorized')
    ) return null;
    throw err;
  }
}

// ── favorito ──────────────────────────────────────────────────────────

export async function apiGetMyFavorites(): Promise<ApiProduct[]> {
  return authFetch(`${API_URL}/favorites`);
}

export async function apiAddFavorite(productId: number): Promise<void> {
  return authFetch(`${API_URL}/favorites/${productId}`, { method: 'POST' });
}

export async function apiRemoveFavorite(productId: number): Promise<void> {
  return authFetch(`${API_URL}/favorites/${productId}`, { method: 'DELETE' });
}

export async function apiCheckFavorite(productId: number): Promise<boolean> {
  return authFetch(`${API_URL}/favorites/${productId}/check`);
}