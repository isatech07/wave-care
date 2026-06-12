"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import type { Order } from "@/lib/api";
import styles from "./page.module.css";

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface StoredOrder {
  order: Order;
  number: number;
}

export default function PedidoConfirmado() {
  const router = useRouter();
  const [data, setData] = useState<StoredOrder | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wc_last_order");
      if (raw) {
        setData(JSON.parse(raw));
        sessionStorage.removeItem("wc_last_order");
      }
    } catch {
      // ignora erro de parse
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (checked && !data) {
      router.replace("/");
    }
  }, [checked, data, router]);

  if (!checked || !data) {
    return null;
  }

  const { order, number } = data;
  const isPending = order.status === "PENDING";

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          {isPending ? (
            <Clock size={80} className={styles.iconPending} />
          ) : (
            <CheckCircle size={80} className={styles.icon} />
          )}
        </div>

        <h1 className={styles.title}>
          {isPending ? "Pedido Recebido!" : "Pedido Confirmado!"}
        </h1>

        <p className={styles.message}>
          {isPending
            ? "Seu pedido foi criado e está aguardando a confirmação do pagamento."
            : "Seu pedido foi criado com sucesso e está sendo processado."}
        </p>

        <div className={styles.orderBox}>
          <div className={styles.orderHeader}>
            <span className={styles.orderNumber}>Pedido #{number}</span>
            <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
          </div>

          <ul className={styles.orderItems}>
            {order.items.map((item) => (
              <li key={item.id} className={styles.orderItem}>
                <span>
                  {item.product.name}{" "}
                  <span className={styles.orderItemQty}>x{item.quantity}</span>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        {isPending && (
          <p className={styles.subMessage}>
            Você pode acompanhar o status do pagamento na aba{" "}
            <strong>Pedidos</strong> do seu perfil.
          </p>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => router.push("/perfil")}
            className={styles.button}
          >
            Ver meus pedidos
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.buttonSecondary}
          >
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
}