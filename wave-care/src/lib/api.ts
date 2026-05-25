export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface MappedUser {
  id?: number;
  name?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
}

function mapUser(data: any): MappedUser {
  const user = data?.user ?? data;
  if (!user || typeof user !== 'object') return {};

  return {
    id: user.id,
    email: user.email ?? '',
    telefone: user.telefone ?? '',
    cidade: user.cidade ?? '',
    nome: user.name ?? user.nome ?? '',
  };
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
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

export async function apiUpdateUser(id: number, fields: { name?: string; email?: string; telefone?: string; cidade?: string }) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar');
  return mapUser(data);
}

export async function apiDeleteUser(id: number) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar conta');
  }

  return true;
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

export async function getProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return data;
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
 
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
 
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
 
// ==== CARRINHO ====
 
// POST /cart — adiciona item ao carrinho
 export async function apiAddCartItem(userId: number, productId: number, quantity: number): Promise<CartItem> {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao adicionar item ao carrinho');
  return data;
}
 
// GET /cart/:userId — retorna carrinho com itens e produtos populados
export async function apiGetCart(userId: number): Promise<Cart | null> {
  const res = await fetch(`${API_URL}/cart/${userId}`);
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar carrinho');
  return data;
}
 
// PUT /cart/:id — atualiza quantidade de um CartItem pelo id do item (não do produto)
export async function apiUpdateCartItem(cartItemId: number, quantity: number): Promise<CartItem> {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar quantidade');
  return data;
}
 
// DELETE /cart/:id — remove um CartItem pelo id do item
export async function apiRemoveCartItem(cartItemId: number): Promise<CartItem> {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao remover item');
  return data;
}
 
// DELETE /cart/clear/:userId — limpa todos os itens e deleta o carrinho
export async function apiClearCart(userId: number): Promise<void> {
  const res = await fetch(`${API_URL}/cart/clear/${userId}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao limpar carrinho');
  }
}
 
// === PEDIDOS ===
 
// POST /order/:userId — cria pedido a partir do carrinho e limpa o carrinho
export async function apiCreateOrder(userId: number): Promise<Order> {
  const res = await fetch(`${API_URL}/order/${userId}`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar pedido');
  return data;
}
 
// GET /order — lista todos os pedidos com itens e produtos (uso admin)
export async function apiGetAllOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/order`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao listar pedidos');
  return data;
}
 
// GET /order/:id — busca pedido por id com itens e produtos
export async function apiGetOrder(orderId: number): Promise<Order | null> {
  const res = await fetch(`${API_URL}/order/${orderId}`);
  if (res.status === 404) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar pedido');
  return data;
}
 
// PUT /order/:id — atualiza status do pedido
export async function apiUpdateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${API_URL}/order/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar status');
  return data;
}
 
// DELETE /order/:id — remove pedido e todos os seus itens
export async function apiDeleteOrder(orderId: number): Promise<void> {
  const res = await fetch(`${API_URL}/order/${orderId}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar pedido');
  }
}