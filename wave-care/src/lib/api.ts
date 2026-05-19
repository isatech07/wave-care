export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface MappedUser {
  id?: number;
  name?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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