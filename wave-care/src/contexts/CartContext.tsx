"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

import {
  apiGetCart,
  apiAddCartItem,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  apiCreateOrder,
  saveOrderLocally,
  type CartItem,   
  type Order,      
} from "@/lib/api";

import { useUser } from "@/contexts/UserContext";

export interface CartLineItem {
  id: number;           // productId
  cartItemId?: number;  // id do CartItem no backend
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartLineItem[];
  isOpen: boolean;
  loading: boolean;
  checkoutLoading: boolean;
  error: string | null;
  orderSummary: Order | null;

  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Omit<CartLineItem, "quantity" | "cartItemId">) => Promise<void>;
  updateQuantity: (productId: number, delta: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<Order>;
  dismissOrderSummary: () => void;
  cartCount: number;
  cartTotal: number;
}

// Context

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}

function fromApiItem(i: CartItem): CartLineItem {
  return {
    id: i.productId,
    cartItemId: i.id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    quantity: i.quantity,
  };
}

// Provider 

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useUser();

  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<Order | null>(null);

  const syncedRef = useRef<number | null>(null);

  // Sincroniza carrinho com backend ao logar 

  const syncWithBackend = useCallback(async (userId: number) => {
    if (syncedRef.current === userId) return;
    syncedRef.current = userId;

    setLoading(true);
    try {
      const cart = await apiGetCart(userId);
      const backendItems: CartLineItem[] = cart?.items.map(fromApiItem) ?? [];

      const localOnly = items.filter(
        (local) => !backendItems.some((b) => b.id === local.id)
      );
      for (const localItem of localOnly) {
        await apiAddCartItem(userId, localItem.id, localItem.quantity);
      }

      const finalCart = await apiGetCart(userId);
      setItems(finalCart?.items.map(fromApiItem) ?? backendItems);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      syncWithBackend(user.id);
    } else if (!isLoggedIn) {
      syncedRef.current = null;
    }
  }, [isLoggedIn, user?.id]); 

  // ── Adicionar item 

  const addItem = useCallback(
    async (product: Omit<CartLineItem, "quantity" | "cartItemId">) => {
      setError(null);

      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      if (isLoggedIn && user?.id) {
        try {
          await apiAddCartItem(user.id, product.id, 1);
          const cart = await apiGetCart(user.id);
          if (cart) setItems(cart.items.map(fromApiItem));
        } catch (err) {
          setItems((prev) => {
            const item = prev.find((i) => i.id === product.id);
            if (!item) return prev;
            if (item.quantity <= 1) return prev.filter((i) => i.id !== product.id);
            return prev.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity - 1 } : i
            );
          });
          setError(err instanceof Error ? err.message : "Erro ao adicionar item");
        }
      }
    },
    [isLoggedIn, user?.id]
  );

  // Atualizar quantidade 

  const updateQuantity = useCallback(
    async (productId: number, delta: number) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        setItems((prev) => prev.filter((i) => i.id !== productId));
        if (isLoggedIn && item.cartItemId) {
          await apiRemoveCartItem(item.cartItemId).catch(() => {});
        }
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
      );

      if (isLoggedIn && item.cartItemId) {
        try {
          await apiUpdateCartItem(item.cartItemId, newQty);
        } catch {
          setItems((prev) =>
            prev.map((i) =>
              i.id === productId ? { ...i, quantity: item.quantity } : i
            )
          );
        }
      }
    },
    [items, isLoggedIn]
  );

  //  Remover item
  const removeItem = useCallback(
    async (productId: number) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      setItems((prev) => prev.filter((i) => i.id !== productId));

      if (isLoggedIn && item.cartItemId) {
        await apiRemoveCartItem(item.cartItemId).catch(() => {
          setItems((prev) => [...prev, item]);
        });
      }
    },
    [items, isLoggedIn]
  );

  // Limpar carrinho 

  const clearCart = useCallback(async () => {
    setItems([]);
    if (isLoggedIn && user?.id) {
      await apiClearCart(user.id).catch(() => {});
    }
  }, [isLoggedIn, user?.id]);

  //  Checkout 

  const checkout = useCallback(async (): Promise<Order> => {
    if (!isLoggedIn || !user?.id) {
      throw new Error("Você precisa estar logado para finalizar o pedido");
    }
    if (items.length === 0) {
      throw new Error("Seu carrinho está vazio");
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      const order = await apiCreateOrder(user.id);
      saveOrderLocally(user.id, order);
      setOrderSummary(order);
      setItems([]);
      syncedRef.current = null;
      return order;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao finalizar pedido";
      setError(msg);
      throw err;
    } finally {
      setCheckoutLoading(false);
    }
  }, [isLoggedIn, user?.id, items]);

  const dismissOrderSummary = useCallback(() => setOrderSummary(null), []);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        loading,
        checkoutLoading,
        error,
        orderSummary,
        openCart:  () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        dismissOrderSummary,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}