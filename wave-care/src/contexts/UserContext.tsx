"use client";

import {
  createContext, useContext, useEffect, useState, ReactNode
} from "react";
import {
  apiDeleteUser, clearToken, getToken, mapUser,
  apiGetMyProfile, API_URL,
} from "@/lib/api";

export interface CapilarProfile {
  tipo: string;
  preocupacao: string;
  frequenciaPreia: string;
  estacaoCritica: string;
  diagnosis?: string;
  recommendedKit?: string;
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
  avatar?: string;
  capilar: CapilarProfile | null;
  favorites: Product[];
  orders: Order[];
  role?: string;
  isAdmin?: boolean;
}

type LoginData = {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  avatar?: string;
  capilar: CapilarProfile | null;
  role?: string;
};

interface UserContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  initializing: boolean;
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

const STORAGE_KEY  = "wavecare_user";
const AVATARS_KEY  = "wavecare_avatars";

type AvatarStore = Record<string, string>;


function loadUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserData) : null;
  } catch { return null; }
}

function saveUser(data: UserData): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { console.warn("Erro ao salvar usuário:", e); }
}

function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function loadAvatarStore(): AvatarStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(AVATARS_KEY);
    return raw ? (JSON.parse(raw) as AvatarStore) : {};
  } catch { return {}; }
}

function saveAvatarForEmail(email: string, base64: string): void {
  if (typeof window === "undefined") return;
  try {
    const store = loadAvatarStore();
    store[email] = base64;
    localStorage.setItem(AVATARS_KEY, JSON.stringify(store));
  } catch (e) { console.warn("Erro ao salvar avatar:", e); }
}

function loadAvatarForEmail(email: string): string | undefined {
  return loadAvatarStore()[email];
}

function removeAvatarForEmail(email: string): void {
  if (typeof window === "undefined") return;
  const store = loadAvatarStore();
  delete store[email];
  localStorage.setItem(AVATARS_KEY, JSON.stringify(store));
}

// ── Provider ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,         setUser]         = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const stored = loadUser();
    const token  = getToken();

    if (!token) {
      if (stored) {
        setUser({ ...stored, avatar: stored.avatar ?? loadAvatarForEmail(stored.email) });
      }
      setInitializing(false);
      return;
    }

    apiGetMyProfile()
      .then(profile => {
        if (!profile) {
          removeUser();
          clearToken();
          setUser(null);
          return;
        }

        const base = stored ?? {
          id: profile.id, nome: profile.name, email: profile.email,
          telefone: profile.telefone ?? "", cidade: profile.cidade ?? "",
          capilar: null, favorites: [], orders: [],
          role: profile.role, isAdmin: profile.role === "admin",
        };

        const merged: UserData = {
          ...base,
          // campos sempre atualizados do banco
          id:       profile.id,
          nome:     profile.name,
          email:    profile.email,
          telefone: profile.telefone ?? base.telefone,
          cidade:   profile.cidade   ?? base.cidade,
          role:     profile.role,
          isAdmin:  profile.role === "admin",
          capilar:  profile.capilar
            ? {
                tipo:            profile.capilar.tipo,
                preocupacao:     profile.capilar.preocupacao,
                frequenciaPreia: profile.capilar.frequenciaPreia,
                estacaoCritica:  profile.capilar.estacaoCritica,
                diagnosis:       profile.capilar.diagnosis,
                recommendedKit:  profile.capilar.recommendedKit,
              }
            : base.capilar,
          // avatar só existe no cliente
          avatar:    base.avatar ?? loadAvatarForEmail(profile.email),
          favorites: base.favorites ?? [],
          orders:    base.orders    ?? [],
        };

        setUser(merged);
        saveUser(merged);
      })
      .catch(() => {
        if (stored) {
          setUser({ ...stored, avatar: stored.avatar ?? loadAvatarForEmail(stored.email) });
        }
      })
      .finally(() => setInitializing(false));
  }, []);

  // ── login ────────────────────────────────────────────────────────────────
  const login = (data: LoginData) => {
    const existing    = loadUser();
    const sameAccount = existing?.email === data.email;
    const isAdmin     = data.role === "admin" || data.email === "admin@wavecare.com";

    const full: UserData = {
      ...data,
      avatar:    loadAvatarForEmail(data.email),
      favorites: sameAccount ? (existing?.favorites ?? []) : [],
      orders:    sameAccount ? (existing?.orders    ?? []) : [],
      role:      data.role ?? "user",
      isAdmin,
    };
    setUser(full);
    saveUser(full);

    // Depois do login, sincroniza imediatamente com o banco
    // (pega capilar, telefone, cidade atualizados)
    if (data.id) {
      apiGetMyProfile()
        .then(profile => {
          if (!profile) return;
          setUser(prev => {
            if (!prev) return null;
            const updated: UserData = {
              ...prev,
              telefone: profile.telefone ?? prev.telefone,
              cidade:   profile.cidade   ?? prev.cidade,
              capilar:  profile.capilar
                ? {
                    tipo:            profile.capilar.tipo,
                    preocupacao:     profile.capilar.preocupacao,
                    frequenciaPreia: profile.capilar.frequenciaPreia,
                    estacaoCritica:  profile.capilar.estacaoCritica,
                    diagnosis:       profile.capilar.diagnosis,
                    recommendedKit:  profile.capilar.recommendedKit,
                  }
                : prev.capilar,
            };
            saveUser(updated);
            return updated;
          });
        })
        .catch(() => {/* silencioso */});
    }
  };

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    removeUser();
    clearToken();
    localStorage.removeItem("wavecare_quiz_v1");
    localStorage.removeItem("wavecare_quiz_enviado");
  };

  // ── helpers de estado ────────────────────────────────────────────────────
  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveUser(updated);
      return updated;
    });
  };

  const updateAvatar = (rawBase64: string) => {
    if (!rawBase64) {
      setUser(prev => {
        if (!prev) return null;
        if (prev.email) removeAvatarForEmail(prev.email);
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
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", 0.82);
      setUser(prev => {
        if (!prev) return null;
        if (prev.email) saveAvatarForEmail(prev.email, compressed);
        const updated = { ...prev, avatar: compressed };
        saveUser(updated);
        return updated;
      });
    };
    img.src = rawBase64;
  };

  const updateCapilar = (capilar: CapilarProfile) => updateUser({ capilar });

  const addFavorite = (product: Product) => {
    setUser(prev => {
      if (!prev) return null;
      if (prev.favorites.some(f => f.id === product.id)) return prev;
      const updated = { ...prev, favorites: [...prev.favorites, product] };
      saveUser(updated);
      return updated;
    });
  };

  const removeFavorite = (productId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, favorites: prev.favorites.filter(f => f.id !== productId) };
      saveUser(updated);
      return updated;
    });
  };

  const isFavorite = (productId: string) =>
    user?.favorites.some(f => f.id === productId) ?? false;

  const addOrder = (order: Order) => {
    setUser(prev => {
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
    clearToken();
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn:    !!user,
      initializing,
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