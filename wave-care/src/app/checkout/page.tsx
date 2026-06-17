"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { apiConfirmPayment, getOrderNumberForUser, saveOrderLocally, type Order } from "@/lib/api";
import { Lock, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import styles from "./checkout.module.css";
import type { CartLineItem } from "@/contexts/CartContext";

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type PaymentMethod = "card" | "pix" | "boleto";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, loading } = useCart();
  const { user, isLoggedIn, initializing } = useUser();

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [ready, setReady] = useState(false);
  const [snapshotItems, setSnapshotItems] = useState<CartLineItem[]>([]);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (initializing || loading) return;

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    const storedItems = sessionStorage.getItem("wc_checkout_items");
    const storedOrderId = sessionStorage.getItem("wc_pending_order_id");

    if (!storedItems && items.length === 0) {
      router.replace("/");
      return;
    }

    if (storedItems) {
      try { setSnapshotItems(JSON.parse(storedItems)); } catch { /* ignora */ }
    }

    const orderId = storedOrderId ? Number(storedOrderId) : null;
    setPendingOrderId(orderId);
    setReady(true);
  }, [initializing, loading, isLoggedIn, items.length]);

  if (!ready) {
    return (
      <main className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "4rem 0" }}>
          <Loader2 size={32} className={styles.spin} />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Carregando...</p>
        </div>
      </main>
    );
  }

  const displayItems = items.length > 0 ? items : snapshotItems;
  const displayTotal = items.length > 0
    ? cartTotal
    : snapshotItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePagar = async () => {
    const orderIdToUse = pendingOrderId ?? Number(sessionStorage.getItem("wc_pending_order_id"));

    if (!orderIdToUse) {
      setPayError("Pedido não encontrado. Volte ao carrinho e tente novamente.");
      return;
    }

    if (method === "card") {
      const { number, name, expiry, cvv } = card;
      if (!number.trim() || !name.trim() || !expiry.trim() || !cvv.trim()) {
        setPayError("Preencha todos os dados do cartão.");
        return;
      }
    }

    setPayLoading(true);
    setPayError(null);

    try {
      const confirmedOrder: Order = await apiConfirmPayment(orderIdToUse, method);

      const orderWithItems: Order = {
        ...confirmedOrder,
        items: confirmedOrder.items?.length
          ? confirmedOrder.items
          : displayItems.map((i, idx) => ({
              id: idx,
              orderId: confirmedOrder.id,
              productId: i.id,
              quantity: i.quantity,
              price: i.price,
              product: {
                id: i.id,
                name: i.name,
                price: i.price,
                image: i.image ?? "",
                description: "",
                category: "",
                season: "",
              },
            })),
      };

      if (user?.id) {
        saveOrderLocally(user.id, orderWithItems);
        const number = getOrderNumberForUser(user.id, orderWithItems.id);
        sessionStorage.setItem(
          "wc_last_order",
          JSON.stringify({ order: orderWithItems, number })
        );
      }

      sessionStorage.removeItem("wc_checkout_items");
      sessionStorage.removeItem("wc_pending_order_id");

      router.push("/pedido/confirmado");
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setPayLoading(false);
    }
  };

  const maskCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const maskExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={18} />
          Voltar
        </button>

        <div className={styles.grid}>
          {/* ─── Formulário de pagamento ─── */}
          <section className={styles.formSection}>
            <h1 className={styles.title}>Pagamento</h1>

            {pendingOrderId && (
              <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "1rem" }}>
                Pedido <strong>#{pendingOrderId}</strong> criado — aguardando pagamento
              </p>
            )}

            <div className={styles.methods}>
              {[
                { id: "card", label: "Cartão de Crédito" },
                { id: "pix", label: "PIX" },
                { id: "boleto", label: "Boleto" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.methodBtn} ${method === m.id ? styles.methodActive : ""}`}
                  onClick={() => setMethod(m.id as PaymentMethod)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className={styles.cardForm}>
                <div className={styles.field}>
                  <label>Número do cartão</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => setCard((c) => ({ ...c, number: maskCard(e.target.value) }))}
                    maxLength={19}
                  />
                </div>
                <div className={styles.field}>
                  <label>Nome no cartão</label>
                  <input
                    type="text"
                    placeholder="Como está no cartão"
                    value={card.name}
                    onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Validade</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: maskExpiry(e.target.value) }))}
                      maxLength={5}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>CVV</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "pix" && (
              <div className={styles.pixBox}>
                <div className={styles.pixQr}>
                  <span>QR Code será gerado após confirmar</span>
                </div>
                <p className={styles.pixInfo}>
                  Após clicar em <strong>Confirmar Pagamento</strong>, você receberá o QR Code
                  e a chave PIX. O pedido é confirmado automaticamente após o pagamento.
                </p>
              </div>
            )}

            {method === "boleto" && (
              <div className={styles.boletoBox}>
                <p>O boleto será gerado após a confirmação. Prazo: <strong>1 a 3 dias úteis</strong>.</p>
                <p className={styles.boletoNote}>Seu pedido só será processado após confirmação do pagamento.</p>
              </div>
            )}

            {payError && <p className={styles.error}>{payError}</p>}

            <button
              type="button"
              className={styles.payBtn}
              onClick={handlePagar}
              disabled={payLoading}
            >
              {payLoading ? (
                <><Loader2 size={18} className={styles.spin} /> Processando...</>
              ) : (
                <><Lock size={16} /> Confirmar Pagamento — {formatPrice(displayTotal)}</>
              )}
            </button>

            <div className={styles.security}>
              <ShieldCheck size={16} />
              <span>Pagamento 100% seguro e criptografado</span>
            </div>
          </section>

          {/* ─── Resumo do pedido ─── */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>
            <ul className={styles.summaryItems}>
              {displayItems.map((item) => (
                <li key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImg}>
                    <img src={item.image || "/products/placeholder.png"} alt={item.name} />
                    <span className={styles.summaryItemQty}>{item.quantity}</span>
                  </div>
                  <div className={styles.summaryItemInfo}>
                    <span className={styles.summaryItemName}>{item.name}</span>
                    <span className={styles.summaryItemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(displayTotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Frete</span>
              <span className={styles.free}>Grátis</span>
            </div>
            <div className={styles.summaryTotal}>
              <strong>Total</strong>
              <strong>{formatPrice(displayTotal)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}