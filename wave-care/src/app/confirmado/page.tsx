"use client";

/**
 * app/pedido/confirmado/page.tsx
 *
 * Tela exibida após o pedido ser criado com sucesso.
 * Busca o pedido mais recente do localStorage (salvo pelo context).
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Package, ChevronRight, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { apiGetUserOrders, type OrderApi } from "@/lib/api";
import styles from "./confirmado.module.css";

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando confirmação",
  CONFIRMED: "Confirmado",
  SHIPPED: "Em transporte",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export default function PedidoConfirmadoPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useUser();
  const [order, setOrder] = useState<OrderApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      router.replace("/login");
      return;
    }

    apiGetUserOrders(user.id).then((orders) => {
      setOrder(orders[0] ?? null); 
      setLoading(false);
    });
  }, [isLoggedIn, user?.id]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingBox}>
          <Loader2 size={36} className={styles.spin} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Ícone de sucesso */}
        <div className={styles.iconWrap}>
          <CheckCircle2 size={56} className={styles.icon} />
        </div>

        <h1 className={styles.title}>Pedido realizado!</h1>
        <p className={styles.subtitle}>
          Obrigada pela sua compra. Em breve você receberá uma atualização sobre
          seu pedido.
        </p>

        {order && (
          <>
            <div className={styles.orderBox}>
              <div className={styles.orderHeader}>
                <Package size={18} />
                <span>Pedido #{order.id}</span>
                <span className={styles.status}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <p className={styles.orderDate}>
                Realizado em {formatDate(order.createdAt)}
              </p>

              <ul className={styles.items}>
                {order.items.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <span className={styles.itemName}>
                      {item.product?.name ?? `Produto #${item.productId}`}
                    </span>
                    <span className={styles.itemQty}>x{item.quantity}</span>
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.total}>
                <strong>Total</strong>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.profileBtn}
              onClick={() => router.push("/perfil")}
            >
              Ver meus pedidos no perfil
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <button
          type="button"
          className={styles.continueBtn}
          onClick={() => router.push("/")}
        >
          Continuar comprando
        </button>
      </div>
    </main>
  );
}