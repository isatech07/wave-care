"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiDeleteUser } from "@/lib/api";

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
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  avatar?: string; // base64 JPEG comprimido
  capilar: CapilarProfile | null;
  favorites: Product[];
  orders: Order[];
  isAdmin?: boolean;
}

// Tipo aceito pelo login: campos vindos da API
type LoginData = {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  capilar: CapilarProfile | null;
};

interface UserContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  updateUser: (data: Partial<UserData>) => void;
  updateAvatar: (rawBase64OrEmpty: string) => void;
  updateCapilar: (capilar: CapilarProfile) => void;
  login: (data: LoginData) => void;
  logout: () => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: Order) => void;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
}

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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Erro ao salvar usuário (localStorage cheio?):", e);
  }
}

function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─────────────────────────────────────────────

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = loadUser();
    if (stored) setUser(stored);
  }, []);

  // Mantém LoginData (tipagem da API) e preserva dados ao fazer re-login com mesmo e-mail
  const login = (data: LoginData) => {
    const existing = loadUser();
    const full: UserData = {
      ...data,
      avatar: existing?.email === data.email ? existing?.avatar : undefined,
      favorites: existing?.email === data.email ? (existing?.favorites ?? []) : [],
      orders: existing?.email === data.email ? (existing?.orders ?? []) : [],
      isAdmin: data.email === "admin@wavecare.com",
    };
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


  const updateAvatar = (rawBase64: string) => {
    if (!rawBase64) {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, avatar: undefined };
        saveUser(updated);
        return updated;
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 200;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
      } else {
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", 0.82);
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, avatar: compressed };
        saveUser(updated);
        return updated;
      });
    };
    img.src = rawBase64;
  };

  const updateCapilar = (capilar: CapilarProfile) => updateUser({ capilar });

  const addFavorite = (product: Product) => {
    setUser((prev) => {
      if (!prev) return null;
      if (prev.favorites.some((f) => f.id === product.id)) return prev;
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

  const deleteAccount = async (): Promise<void> => {
    if (user?.id) await apiDeleteUser(user.id);
    setUser(null);
    removeUser();
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      updateUser,
      updateAvatar,
      updateCapilar,
      login,
      logout,
      addFavorite,
      removeFavorite,
      isFavorite,
      addOrder,
      deleteAccount,
      isAdmin: !!user?.isAdmin,
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