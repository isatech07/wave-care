"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
export interface CapilarProfile {
  tipo: string;
  preocupacao: string;
  frequenciaPreia: string;
  estacaoCritica: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "aguardando" | "confirmado" | "enviado" | "entregue";

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  paymentMethod: string;
}

export interface UserData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  capilar: CapilarProfile | null;
  favorites: Product[];
  orders: Order[];
}

interface UserContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  updateUser: (data: Partial<UserData>) => void;
  updateCapilar: (capilar: CapilarProfile) => void;
  login: (data: Omit<UserData, "favorites" | "orders">) => void;
  logout: () => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: Order) => void;
}

// ─────────────────────────────────────────────
// PERSISTÊNCIA (troque por chamadas de API no futuro)
// ─────────────────────────────────────────────
const STORAGE_KEY = "wavecare_user";

function loadUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserData) : null;
  } catch { return null; }
}

function saveUser(data: UserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─────────────────────────────────────────────
// CONTEXTO
// ─────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = loadUser();
    if (stored) setUser(stored);
  }, []);

  const login = (data: Omit<UserData, "favorites" | "orders">) => {
    const full: UserData = { ...data, favorites: [], orders: [] };
    setUser(full);
    saveUser(full);
  };

  const logout = () => { setUser(null); removeUser(); };

  const updateUser = (data: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveUser(updated);
      return updated;
    });
  };

  const updateCapilar = (capilar: CapilarProfile) => updateUser({ capilar });

  const addFavorite = (product: Product) => {
    setUser((prev) => {
      if (!prev) return null;
      const already = prev.favorites.some((f) => f.id === product.id);
      if (already) return prev;
      const updated = { ...prev, favorites: [...prev.favorites, product] };
      saveUser(updated);
      return updated;
    });
  };

  const removeFavorite = (productId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, favorites: prev.favorites.filter((f) => f.id !== productId) };
      saveUser(updated);
      return updated;
    });
  };

  const isFavorite = (productId: string) =>
    user?.favorites.some((f) => f.id === productId) ?? false;

  const addOrder = (order: Order) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, orders: [order, ...prev.orders] };
      saveUser(updated);
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{
      user, isLoggedIn: !!user,
      updateUser, updateCapilar, login, logout,
      addFavorite, removeFavorite, isFavorite, addOrder,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}