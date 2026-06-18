"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  apiGetUserOrders,
  apiGetAllOrders,
  apiUpdateOrderStatus,
  saveOrderLocally,
  type OrderApi,
} from "@/lib/api";
import { useUser } from "@/contexts/UserContext";
import styles from "./OrderStatus.module.css";

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (d: string) =>
  new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof STATUS_OPTIONS)[number];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Aguardando",    color: "#92400e", bg: "#fef3c7" },
  CONFIRMED: { label: "Confirmado",    color: "#065f46", bg: "#d1fae5" },
  SHIPPED:   { label: "Em transporte", color: "#1e40af", bg: "#dbeafe" },
  DELIVERED: { label: "Entregue",      color: "#3b0764", bg: "#f3e8ff" },
  CANCELLED: { label: "Cancelado",     color: "#991b1b", bg: "#fee2e2" },
};

const STEPPER_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const STEPPER_LABELS: Record<string, string> = {
  PENDING:   "Aguardando",
  CONFIRMED: "Confirmado",
  SHIPPED:   "Enviado",
  DELIVERED: "Entregue",
};

function OrderStepper({ status }: { status: string }) {
  const currentIndex = STEPPER_STEPS.indexOf(status as OrderStatus);

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperTrack}>
        {STEPPER_STEPS.map((step, i) => {
          const isPast    = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={step} className={styles.stepperStep}>
              <div
                className={[
                  styles.stepperDot,
                  isPast    ? styles.stepperDotActive  : "",
                  isCurrent ? styles.stepperDotCurrent : "",
                ].join(" ")}
              />
              <span
                className={[
                  styles.stepperLabel,
                  isPast    ? styles.stepperLabelActive  : "",
                  isCurrent ? styles.stepperLabelCurrent : "",
                ].join(" ")}
              >
                {STEPPER_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderStatus() {
  const { user, isLoggedIn } = useUser();
  const isAdmin = (user as any)?.role === "admin";

  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
  if (!isLoggedIn || !user?.id) return;
  setLoading(true);
  setError(null);
  try {
    const data = isAdmin
      ? await apiGetAllOrders()
      : await apiGetUserOrders(user.id);
    setOrders(data.map(o => ({ ...o, status: o.status.toUpperCase() as any })));
  } catch (err) {
    setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadOrders();
  }, [isLoggedIn, user?.id]); 

  const handleStatusChange = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await apiUpdateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
      if (updated.userId) saveOrderLocally(updated.userId, updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isAdmin ? (
            <><ShieldCheck size={20} /> Todos os Pedidos</>
          ) : (
            <><Package size={20} /> Meus Pedidos</>
          )}
        </h2>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={loadOrders}
          aria-label="Recarregar pedidos"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader2 size={28} className={styles.spin} />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <Package size={40} strokeWidth={1} />
          <p>Nenhum pedido encontrado</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => {
            const meta = STATUS_META[order.status as OrderStatus] ?? STATUS_META.PENDING;
            const isExpanded = expanded === order.id;
            const isCancelled = order.status === "CANCELLED";

            return (
              <li key={order.id} className={styles.card}>

                {/* ── Cabeçalho clicável ── */}
                <button
                  type="button"
                  className={styles.cardHeader}
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className={styles.cardMeta}>
                    <span className={styles.orderId}>Pedido #{order.id}</span>
                    {isAdmin && (
                      <span className={styles.userId}>Usuário #{order.userId}</span>
                    )}
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>

                  <div className={styles.cardRight}>
                    <span
                      className={styles.badge}
                      style={{ color: meta.color, background: meta.bg }}
                    >
                      {meta.label}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* ── Resumo dos itens  ── */}
                <div className={styles.cardSummary}>
                  <ul className={styles.summaryItems}>
                    {order.items.map((item) => (
                      <li key={item.id} className={styles.summaryItem}>
                        <span className={styles.summaryItemName}>
                          {item.product?.name ?? `Produto #${item.productId}`} x{item.quantity}
                        </span>
                        <span className={styles.summaryItemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.summaryFooter}>
                    <span className={styles.summaryCount}>
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                    </span>
                    <span className={styles.summaryTotal}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* ── Stepper ── */}
                {!isCancelled && <OrderStepper status={order.status} />}

                {/* ── Detalhe expandido ── */}
                {isExpanded && (
                  <div className={styles.detail}>
                    <ul className={styles.items}>
                      {order.items.map((item) => (
                        <li key={item.id} className={styles.item}>
                          <div className={styles.itemImg}>
                            <img
                              src={item.product?.image || "/products/placeholder.png"}
                              alt={item.product?.name}
                            />
                          </div>
                          <div className={styles.itemInfo}>
                            <span className={styles.itemName}>
                              {item.product?.name ?? `Produto #${item.productId}`}
                            </span>
                            <span className={styles.itemSub}>
                              {item.quantity}x · {formatPrice(item.price)}
                            </span>
                          </div>
                          <span className={styles.itemTotal}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Controle de status — só admin */}
                    {isAdmin && (
                      <div className={styles.adminControls}>
                        <label className={styles.adminLabel}>Atualizar status:</label>
                        <div className={styles.statusBtns}>
                          {STATUS_OPTIONS.map((s) => {
                            const m = STATUS_META[s];
                            return (
                              <button
                                key={s}
                                type="button"
                                className={`${styles.statusBtn} ${
                                  order.status === s ? styles.statusBtnActive : ""
                                }`}
                                style={
                                  order.status === s
                                    ? { color: m.color, background: m.bg, borderColor: m.color }
                                    : {}
                                }
                                disabled={order.status === s || updatingId === order.id}
                                onClick={() => handleStatusChange(order.id, s)}
                              >
                                {updatingId === order.id && order.status !== s ? (
                                  <Loader2 size={12} className={styles.spin} />
                                ) : null}
                                {m.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}