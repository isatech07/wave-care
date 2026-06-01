"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import styles from "./Cart.module.css";
import { useCart } from "@/contexts/CartContext";

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function normalizeImage(path: string) {
  if (!path) return "/products/placeholder.png";
  let n = path.trim();
  if (!n.startsWith("/")) n = "/" + n;
  return n;
}

interface CartProps {

  seasonColor?: string;
}

export default function Cart({ seasonColor }: CartProps) {
  const accent = seasonColor ?? "#245850";
  const router = useRouter();

  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    checkout,
    checkoutLoading,
    error,
    orderSummary,
    dismissOrderSummary,
    cartTotal,
    loading,
  } = useCart();

  const handleFinalizarPedido = async () => {
    try {
      await checkout();
    } catch {
    }
  };

  const handleContinuar = () => {
    dismissOrderSummary();
    closeCart();
    router.push("/pedido/confirmado");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} aria-hidden />
      <aside
        className={styles.sidebar}
        role="dialog"
        aria-label="Sacola de compras"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2>Sua Sacola</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Fechar sacola"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.empty}>
              <Loader2 size={32} className={styles.spin} />
              <p>Carregando carrinho...</p>
            </div>
          ) : items.length === 0 ? (
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
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price)}
                    </span>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Resumo pós-pedido */}
        {orderSummary ? (
          <div className={styles.orderSummary}>
            <div className={styles.orderSummaryHeader}>
              <h3>Pedido Confirmado!</h3>
              <span className={styles.orderNumber}>#{orderSummary.id}</span>
            </div>
            <div className={styles.orderSummaryItems}>
              {orderSummary.items?.map((item) => (
                <div key={item.id} className={styles.orderSummaryItem}>
                  <span className={styles.orderItemName}>
                    {item.product.name}
                  </span>
                  <span className={styles.orderItemQty}>x{item.quantity}</span>
                  <span className={styles.orderItemPrice}>
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.orderSummaryTotal}>
              <span>Total</span>
              <strong>{formatPrice(orderSummary.total)}</strong>
            </div>
            <button
              type="button"
              className={styles.checkout}
              style={{ background: accent }}
              onClick={handleContinuar}
            >
              Ver meu pedido
            </button>
          </div>
        ) : (
          items.length > 0 && (
            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button
                type="button"
                className={styles.checkout}
                style={{ background: accent }}
                onClick={handleFinalizarPedido}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 size={16} className={styles.spinInline} />
                    Processando...
                  </>
                ) : (
                  "Finalizar Compra"
                )}
              </button>
            </div>
          )
        )}
      </aside>
    </>
  );
}

/** Botão flutuante da sacola */
export function CartFloatingButton({
  seasonColor,
}: {
  seasonColor?: string;
}) {
  const accent = seasonColor ?? "#245850";
  const { cartCount, openCart } = useCart();

  return (
    <button
      type="button"
      className={styles.floatingBtn}
      style={{ background: accent }}
      onClick={openCart}
      aria-label="Abrir sacola"
    >
      <ShoppingBag size={22} />
      {cartCount > 0 && (
        <span className={styles.badge} style={{ background: accent }}>
          {cartCount}
        </span>
      )}
    </button>
  );
}