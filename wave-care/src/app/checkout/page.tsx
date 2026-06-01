"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import {
  CreditCard,
  Lock,
  ChevronLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import styles from "./checkout.module.css";

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type PaymentMethod = "credit" | "pix" | "boleto";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, checkout, checkoutLoading, error } = useCart();
  const { user, isLoggedIn } = useUser();

  const [method, setMethod] = useState<PaymentMethod>("credit");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  if (!isLoggedIn) {
    router.replace("/login");
    return null;
  }

  if (items.length === 0) {
    router.replace("/");
    return null;
  }

  const handlePagar = async () => {
    try {
      /**
       * INTEGRAÇÃO FUTURA:
       * 1. Tokenize o cartão com o gateway (ex: Stripe.createToken)
       * 2. Envie o token + orderId ao backend para cobrar
       * 3. Só chame checkout() após cobrança confirmada
       *
       * Por ora: apenas cria o pedido no backend
       */
      await checkout();
      router.push("/pedido/confirmado");
    } catch {
    }
  };

  const maskCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const maskExpiry = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* Voltar */}
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <ChevronLeft size={18} />
          Voltar
        </button>

        <div className={styles.grid}>

          {/* ─── Formulário de pagamento ─── */}
          <section className={styles.formSection}>
            <h1 className={styles.title}>Pagamento</h1>

            {/* Método */}
            <div className={styles.methods}>
              {(
                [
                  { id: "credit", label: "Cartão de Crédito" },
                  { id: "pix", label: "PIX" },
                  { id: "boleto", label: "Boleto" },
                ] as { id: PaymentMethod; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.methodBtn} ${method === m.id ? styles.methodActive : ""}`}
                  onClick={() => setMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Cartão de crédito */}
            {method === "credit" && (
              <div className={styles.cardForm}>
                <div className={styles.field}>
                  <label>Número do cartão</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, number: maskCard(e.target.value) }))
                    }
                    maxLength={19}
                  />
                </div>
                <div className={styles.field}>
                  <label>Nome no cartão</label>
                  <input
                    type="text"
                    placeholder="Como está no cartão"
                    value={card.name}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))
                    }
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
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          expiry: maskExpiry(e.target.value),
                        }))
                      }
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
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PIX */}
            {method === "pix" && (
              <div className={styles.pixBox}>
                <div className={styles.pixQr}>
                  <span>QR Code será gerado após confirmar</span>
                </div>
                <p className={styles.pixInfo}>
                  Após clicar em <strong>Confirmar Pedido</strong>, você receberá
                  o QR Code e a chave PIX para pagamento. O pedido é confirmado
                  automaticamente após a detecção do pagamento.
                </p>
              </div>
            )}

            {/* Boleto */}
            {method === "boleto" && (
              <div className={styles.boletoBox}>
                <p>
                  O boleto será gerado após a confirmação. O prazo de
                  compensação é de <strong>1 a 3 dias úteis</strong>.
                </p>
                <p className={styles.boletoNote}>
                  Seu pedido só será processado após a confirmação do pagamento.
                </p>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="button"
              className={styles.payBtn}
              onClick={handlePagar}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 size={18} className={styles.spin} />
                  Processando...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Confirmar Pedido — {formatPrice(cartTotal)}
                </>
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
              {items.map((item) => (
                <li key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImg}>
                    <img
                      src={item.image || "/products/placeholder.png"}
                      alt={item.name}
                    />
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
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Frete</span>
              <span className={styles.free}>Grátis</span>
            </div>
            <div className={styles.summaryTotal}>
              <strong>Total</strong>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}