const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
  return data.user;
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
  return data;
}