"use client";

import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import styles from "./Cart.module.css";

export interface CartLineItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartLineItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  formatPrice: (price: number) => string;
  normalizeImage?: (path: string) => string;
  /** Cor primária da estação — badge e botão finalizar; omitir = estilo original */
  seasonColor?: string;
}

const defaultNormalize = (path: string) => {
  if (!path) return "/products/placeholder.png";
  let n = path.trim();
  if (!n.startsWith("/")) n = "/" + n;
  return n;
};

/** Sacola lateral — mesma estrutura da loja, com theming opcional por estação */
export default function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  formatPrice,
  normalizeImage = defaultNormalize,
  seasonColor,
}: CartProps) {
  const accent = seasonColor ?? "#245850";
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden />
      <aside className={styles.sidebar} role="dialog" aria-label="Sacola de compras">
        <div className={styles.header}>
          <h2>Sua Sacola</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fechar sacola">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Sua sacola está vazia</p>
            </div>
          ) : (
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img src={normalizeImage(item.image)} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                    <div className={styles.qty}>
                      <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} aria-label="Diminuir">
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} aria-label="Aumentar">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemove(item.id)}
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button
              type="button"
              className={styles.checkout}
              style={seasonColor ? { background: accent } : undefined}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

/** Botão flutuante da sacola (usado quando o painel está fechado) */
export function CartFloatingButton({
  count,
  onOpen,
  seasonColor,
}: {
  count: number;
  onOpen: () => void;
  seasonColor?: string;
}) {
  const accent = seasonColor ?? "#245850";

  return (
    <button
      type="button"
      className={styles.floatingBtn}
      style={seasonColor ? { background: accent } : undefined}
      onClick={onOpen}
      aria-label="Abrir sacola"
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span className={styles.badge} style={seasonColor ? { background: accent } : undefined}>
          {count}
        </span>
      )}
    </button>
  );
}
