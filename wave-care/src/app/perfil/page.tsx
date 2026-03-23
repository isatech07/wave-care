"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { useUser, Order, OrderItem, Product } from "@/contexts/UserContext";
import styles from "./perfil.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

// ── Ícones ───────────────────────────────────────────────────────────────────
const IUser     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IPin      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>;
const IBox      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IHeart    = ({ filled }: { filled?: boolean }) => <svg viewBox="0 0 24 24" fill={filled ? "#e05a5a" : "none"} stroke={filled ? "#e05a5a" : "currentColor"} strokeWidth={1.8}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const ISettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const ICart     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const ILogout   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IChevron  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>;
const ICheck    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>;
const ITrash    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IPlus     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IMinus    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ICard     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IPix      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const IBoleto   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="9" y1="9" x2="9" y2="15"/><line x1="13" y1="9" x2="13" y2="15"/><line x1="17" y1="9" x2="17" y2="15"/></svg>;

// ── Produtos mock (virá da loja futuramente) ──────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Shampoo Brisa do Mar",       price: 49.90, image: "🧴", category: "Shampoo"  },
  { id: "p2", name: "Máscara Nutri Oceano",        price: 69.90, image: "🫙", category: "Máscara"  },
  { id: "p3", name: "Leave-in Proteção Litorânea", price: 54.90, image: "💧", category: "Leave-in" },
  { id: "p4", name: "Óleo Reparador Marítimo",     price: 79.90, image: "✨", category: "Óleo"     },
  { id: "p5", name: "Kit Verão Completo",          price: 129.90, image: "☀️", category: "Kit"     },
  { id: "p6", name: "Kit Inverno Nutritivo",       price: 119.90, image: "❄️", category: "Kit"     },
];

const STATUS_LABEL: Record<string, string> = {
  aguardando: "Aguardando pagamento",
  confirmado: "Confirmado",
  enviado:    "Enviado",
  entregue:   "Entregue",
};
const STATUS_COLOR: Record<string, string> = {
  aguardando: styles.statusYellow,
  confirmado: styles.statusBlue,
  enviado:    styles.statusTeal,
  entregue:   styles.statusGreen,
};

type NavItem = "perfil" | "pedidos" | "favoritos" | "configuracoes";
type OrderStep = "lista" | "produtos" | "pagamento" | "confirmacao";
type PayMethod = "cartao" | "pix" | "boleto";

const navItems: { id: NavItem; label: string; Icon: () => JSX.Element }[] = [
  { id: "perfil",        label: "Perfil",       Icon: IUser     },
  { id: "pedidos",       label: "Pedidos",       Icon: IBox      },
  { id: "favoritos",     label: "Favoritos",     Icon: () => <IHeart /> },
  { id: "configuracoes", label: "Configurações", Icon: ISettings },
];

// ════════════════════════════════════════════════════════════════════════════
export default function PerfilPage() {
  const { user, isLoggedIn, updateUser, updateCapilar, logout,
          removeFavorite, addOrder } = useUser();
  const router = useRouter();

  const [activeNav,  setActiveNav]  = useState<NavItem>("perfil");
  const [saved,      setSaved]      = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cidade: "" });

  // estados de configurações
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifPromo,   setNotifPromo]   = useState(false);
  const [darkMode,     setDarkMode]     = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savedConfig,  setSavedConfig]  = useState(false);

  // estados de pedidos
  const [orderStep,    setOrderStep]    = useState<OrderStep>("lista");
  const [cart,         setCart]         = useState<OrderItem[]>([]);
  const [payMethod,    setPayMethod]    = useState<PayMethod>("cartao");
  const [cardNum,      setCardNum]      = useState("");
  const [cardName,     setCardName]     = useState("");
  const [cardExp,      setCardExp]      = useState("");
  const [cardCvv,      setCardCvv]      = useState("");
  const [address,      setAddress]      = useState("");
  const [processing,   setProcessing]   = useState(false);
  const [lastOrder,    setLastOrder]    = useState<Order | null>(null);

  useEffect(() => {
    if (user) setForm({ nome: user.nome ?? "", email: user.email ?? "", telefone: user.telefone ?? "", cidade: user.cidade ?? "" });
  }, [user]);

  useEffect(() => { if (!isLoggedIn) router.push("/auth"); }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  // ── Perfil ──
  const handleSave = () => { updateUser(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const handleLogout = () => { logout(); router.push("/"); };

  // ── Carrinho ──
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  const changeQty = (productId: string, delta: number) => {
    setCart((prev) => prev.map((i) => {
      if (i.product.id !== productId) return i;
      const q = i.quantity + delta;
      return q < 1 ? i : { ...i, quantity: q };
    }));
  };
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  // ── Pagamento ──
  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    const order: Order = {
      id: `WC-${Date.now()}`,
      items: cart,
      total: cartTotal,
      status: "confirmado",
      date: new Date().toLocaleDateString("pt-BR"),
      address,
      paymentMethod: payMethod,
    };
    addOrder(order);
    setLastOrder(order);
    setCart([]);
    setProcessing(false);
    setOrderStep("confirmacao");
  };

  // ── Configurações ──
  const handleSaveConfig = async () => {
    setSavingConfig(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingConfig(false);
    setSavedConfig(true);
    setTimeout(() => setSavedConfig(false), 2500);
  };

  // ════════════════════════════════════════════════════════════════════════
  // ABA: PERFIL
  // ════════════════════════════════════════════════════════════════════════
  const TabPerfil = (
    <>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Informações pessoais</h2>
        <div className={styles.formGrid}>
          {[
            { id: "nome",     label: "Nome",     type: "text",  key: "nome"     },
            { id: "email",    label: "Email",    type: "email", key: "email"    },
            { id: "telefone", label: "Telefone", type: "tel",   key: "telefone" },
            { id: "cidade",   label: "Cidade",   type: "text",  key: "cidade"   },
          ].map(({ id, label, type, key }) => (
            <div key={id} className={styles.formGroup}>
              <label htmlFor={id}>{label}</label>
              <input id={id} type={type}
                value={form[key as keyof typeof form]}
                placeholder={id === "telefone" ? "(XX) 99999-0000" : ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnSuccess : ""}`} onClick={handleSave}>
          {saved ? "✓ Alterações salvas!" : "Salvar alterações"}
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Perfil capilar</h2>
        {user.capilar ? (
          <div className={styles.capilarGrid}>
            <div className={styles.capilarTag}><span>Tipo</span><strong>{user.capilar.tipo}</strong></div>
            <div className={styles.capilarTag}><span>Preocupação</span><strong>{user.capilar.preocupacao}</strong></div>
            <div className={styles.capilarTag}><span>Frequência praia</span><strong>{user.capilar.frequenciaPreia}</strong></div>
            <div className={styles.capilarTag}><span>Estação crítica</span><strong>{user.capilar.estacaoCritica}</strong></div>
          </div>
        ) : (
          <p className={styles.capilarEmpty}>Você ainda não fez o quiz capilar.</p>
        )}
        <button className={styles.quizLink} onClick={() => router.push("/quiz")}>
          {user.capilar ? "Refazer quiz capilar" : "Fazer quiz capilar"}<IChevron />
        </button>
      </section>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════
  // ABA: FAVORITOS
  // ════════════════════════════════════════════════════════════════════════
  const TabFavoritos = (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>Meus Favoritos</h2>
      {(user.favorites?.length ?? 0) === 0 ? (
        <div className={styles.emptyTab}>
          <div className={styles.emptyIcon}><IHeart /></div>
          <p>Nenhum produto favoritado ainda.</p>
          <button className={styles.saveBtn} onClick={() => router.push("/loja")}>
            Explorar loja
          </button>
        </div>
      ) : (
        <div className={styles.favGrid}>
          {user.favorites.map((p) => (
            <div key={p.id} className={styles.favCard}>
              <div className={styles.favEmoji}>{p.image}</div>
              <div className={styles.favInfo}>
                <span className={styles.favCategory}>{p.category}</span>
                <strong className={styles.favName}>{p.name}</strong>
                <span className={styles.favPrice}>R$ {p.price.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className={styles.favActions}>
                <button className={styles.favAddBtn} onClick={() => { addToCart(p); setActiveNav("pedidos"); setOrderStep("produtos"); }}>
                  Comprar
                </button>
                <button className={styles.favRemoveBtn} onClick={() => removeFavorite(p.id)} aria-label="Remover dos favoritos">
                  <ITrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  // ════════════════════════════════════════════════════════════════════════
  // ABA: PEDIDOS
  // ════════════════════════════════════════════════════════════════════════

  // Tela 1 — lista de pedidos
  const PedidosLista = (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.sectionTitle}>Meus Pedidos</h2>
        <button className={styles.saveBtn} onClick={() => { setCart([]); setOrderStep("produtos"); }}>
          + Novo pedido
        </button>
      </div>
    {(user.orders?.length ?? 0) === 0 ? (
        <div className={styles.emptyTab}>
          <div className={styles.emptyIcon}><IBox /></div>
          <p>Você ainda não tem pedidos.</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {user.orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.orderDate}>{order.date}</span>
                </div>
                <span className={`${styles.orderStatus} ${STATUS_COLOR[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className={styles.orderItems}>
                {order.items.map((item) => (
                  <span key={item.product.id} className={styles.orderItem}>
                    {item.product.image} {item.product.name} ×{item.quantity}
                  </span>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <span>Pago via {order.paymentMethod === "cartao" ? "Cartão" : order.paymentMethod === "pix" ? "Pix" : "Boleto"}</span>
                <strong>R$ {order.total.toFixed(2).replace(".", ",")}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  // Tela 2 — seleção de produtos
  const PedidosProdutos = (
    <div className={styles.orderFlow}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <button className={styles.backBtn} onClick={() => setOrderStep("lista")}>← Voltar</button>
          <h2 className={styles.sectionTitle}>Escolha os produtos</h2>
        </div>
        <div className={styles.productGrid}>
          {MOCK_PRODUCTS.map((p) => {
            const inCart = cart.find((i) => i.product.id === p.id);
            return (
              <div key={p.id} className={styles.productCard}>
                <div className={styles.productEmoji}>{p.image}</div>
                <span className={styles.productCategory}>{p.category}</span>
                <strong className={styles.productName}>{p.name}</strong>
                <span className={styles.productPrice}>R$ {p.price.toFixed(2).replace(".", ",")}</span>
                {inCart ? (
                  <div className={styles.qtyRow}>
                    <button onClick={() => changeQty(p.id, -1)}><IMinus /></button>
                    <span>{inCart.quantity}</span>
                    <button onClick={() => changeQty(p.id, +1)}><IPlus /></button>
                  </div>
                ) : (
                  <button className={styles.addCartBtn} onClick={() => addToCart(p)}>
                    + Adicionar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo do carrinho */}
      {cart.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Carrinho</h2>
          <div className={styles.cartList}>
            {cart.map((item) => (
              <div key={item.product.id} className={styles.cartItem}>
                <span>{item.product.image} {item.product.name} ×{item.quantity}</span>
                <div className={styles.cartItemRight}>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                  <button className={styles.removeCartBtn} onClick={() => removeFromCart(item.product.id)}><ITrash /></button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cartTotal}>
            <span>Total</span>
            <strong>R$ {cartTotal.toFixed(2).replace(".", ",")}</strong>
          </div>
          <button className={styles.saveBtn} style={{ width: "100%" }} onClick={() => setOrderStep("pagamento")}>
            Ir para pagamento →
          </button>
        </div>
      )}
    </div>
  );

  // Tela 3 — pagamento
  const PedidosPagamento = (
    <div className={styles.orderFlow}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <button className={styles.backBtn} onClick={() => setOrderStep("produtos")}>← Voltar</button>
          <h2 className={styles.sectionTitle}>Pagamento</h2>
        </div>

        {/* Endereço */}
        <div className={styles.paySection}>
          <h3 className={styles.payLabel}>Endereço de entrega</h3>
          <textarea
            className={styles.payTextarea}
            placeholder="Rua, número, bairro, cidade – CEP"
            value={address}
            rows={2}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Método */}
        <div className={styles.paySection}>
          <h3 className={styles.payLabel}>Forma de pagamento</h3>
          <div className={styles.payMethods}>
            {([
              { id: "cartao", label: "Cartão",  Icon: ICard   },
              { id: "pix",    label: "Pix",     Icon: IPix    },
              { id: "boleto", label: "Boleto",  Icon: IBoleto },
            ] as { id: PayMethod; label: string; Icon: () => JSX.Element }[]).map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`${styles.payMethodBtn} ${payMethod === id ? styles.payMethodActive : ""}`}
                onClick={() => setPayMethod(id)}
              >
                <Icon />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Campos do cartão */}
        {payMethod === "cartao" && (
          <div className={styles.paySection}>
            <h3 className={styles.payLabel}>Dados do cartão</h3>
            <div className={styles.cardFields}>
              <input className={styles.payInput} placeholder="Número do cartão" maxLength={19}
                value={cardNum} onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())} />
              <input className={styles.payInput} placeholder="Nome no cartão"
                value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} />
              <div className={styles.cardFieldsRow}>
                <input className={styles.payInput} placeholder="MM/AA" maxLength={5}
                  value={cardExp} onChange={(e) => setCardExp(e.target.value)} />
                <input className={styles.payInput} placeholder="CVV" maxLength={3}
                  value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
          </div>
        )}

        {payMethod === "pix" && (
          <div className={`${styles.paySection} ${styles.pixBox}`}>
            <div className={styles.pixQr}>▣</div>
            <p>Escaneie o QR Code ou copie a chave Pix abaixo.</p>
            <code className={styles.pixKey}>wavecare@pagamentos.com.br</code>
          </div>
        )}

        {payMethod === "boleto" && (
          <div className={`${styles.paySection} ${styles.pixBox}`}>
            <IBoleto />
            <p>O boleto será gerado após a confirmação. Vencimento em 3 dias úteis.</p>
          </div>
        )}
      </div>

      {/* Resumo + botão pagar */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Resumo do pedido</h2>
        <div className={styles.cartList}>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <span>{item.product.image} {item.product.name} ×{item.quantity}</span>
              <span>R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
        </div>
        <div className={styles.cartTotal}>
          <span>Total</span>
          <strong>R$ {cartTotal.toFixed(2).replace(".", ",")}</strong>
        </div>
        <button
          className={styles.saveBtn}
          style={{ width: "100%", opacity: processing ? 0.7 : 1 }}
          disabled={processing || !address}
          onClick={handlePay}
        >
          {processing ? "Processando..." : `Confirmar pagamento · R$ ${cartTotal.toFixed(2).replace(".", ",")}`}
        </button>
        {!address && <p className={styles.payWarn}>Preencha o endereço de entrega.</p>}
      </div>
    </div>
  );

  // Tela 4 — confirmação
  const PedidosConfirmacao = (
    <section className={styles.card}>
      <div className={styles.confirmBox}>
        <div className={styles.confirmIcon}><ICheck /></div>
        <h2>Pedido confirmado!</h2>
        <p>Seu pedido <strong>{lastOrder?.id}</strong> foi recebido com sucesso.</p>
        <p className={styles.confirmSub}>Você receberá um e-mail de confirmação em breve.</p>
        <button className={styles.saveBtn} onClick={() => setOrderStep("lista")}>
          Ver meus pedidos
        </button>
      </div>
    </section>
  );

  const orderScreens: Record<OrderStep, JSX.Element> = {
    lista:        PedidosLista,
    produtos:     PedidosProdutos,
    pagamento:    PedidosPagamento,
    confirmacao:  PedidosConfirmacao,
  };

  // ════════════════════════════════════════════════════════════════════════
  // ABA: CONFIGURAÇÕES
  // ════════════════════════════════════════════════════════════════════════
  const TabConfiguracoes = (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>Configurações</h2>

      <div className={styles.configSection}>
        <h3 className={styles.configLabel}>Notificações</h3>
        {[
          { label: "E-mails sobre meus pedidos", state: notifEmail, setState: setNotifEmail },
          { label: "Promoções e novidades",      state: notifPromo, setState: setNotifPromo },
        ].map(({ label, state, setState }) => (
          <div key={label} className={styles.configRow}>
            <span>{label}</span>
            <button
              className={`${styles.toggle} ${state ? styles.toggleOn : ""}`}
              onClick={() => setState(!state)}
              aria-label={label}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.configLabel}>Aparência</h3>
        <div className={styles.configRow}>
          <span>Modo escuro</span>
          <button
            className={`${styles.toggle} ${darkMode ? styles.toggleOn : ""}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Modo escuro"
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.configLabel}>Conta</h3>
        <div className={styles.configRow}>
          <span>Alterar senha</span>
          <button className={styles.configAction}>Enviar link →</button>
        </div>
        <div className={`${styles.configRow} ${styles.configDanger}`}>
          <span>Excluir conta</span>
          <button className={styles.configActionDanger}>Excluir</button>
        </div>
      </div>

      <button
        className={`${styles.saveBtn} ${savedConfig ? styles.saveBtnSuccess : ""}`}
        style={{ marginTop: "0.5rem" }}
        onClick={handleSaveConfig}
        disabled={savingConfig}
      >
        {savingConfig ? "Salvando..." : savedConfig ? "✓ Configurações salvas!" : "Salvar configurações"}
      </button>
    </section>
  );

  // ════════════════════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════════════════════
  const tabContent: Record<NavItem, JSX.Element> = {
    perfil:        TabPerfil,
    pedidos:       orderScreens[orderStep],
    favoritos:     TabFavoritos,
    configuracoes: TabConfiguracoes,
  };

  return (
    <div className={`${styles.page} ${poppins.variable}`}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideCard}>
          <div className={styles.avatarWrap}><IUser /></div>
          <div className={styles.sideUserInfo}>
            <strong>{user.nome || "Usuário"}</strong>
            <span><IPin />{user.cidade || "—"}</span>
          </div>

          <nav className={styles.nav}>
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`${styles.navItem} ${activeNav === id ? styles.navActive : ""}`}
                onClick={() => { setActiveNav(id); if (id === "pedidos") setOrderStep("lista"); }}
              >
                <Icon />{label}
                  {id === "favoritos" && (user.favorites?.length ?? 0) > 0 && (
                    <span className={styles.badge}>{user.favorites?.length}</span>
                  )}

                  {id === "pedidos" && (user.orders?.length ?? 0) > 0 && (
                    <span className={styles.badge}>{user.orders?.length}</span>
                  )}
              </button>
            ))}
          </nav>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <ILogout />Sair da conta
          </button>
        </div>

        <div className={styles.cartCard}>
          <ICart />
          <span>Carrinho: <strong>{cart.reduce((s, i) => s + i.quantity, 0)} itens</strong></span>
        </div>
      </aside>

      {/* ── CONTEÚDO ── */}
      <main className={styles.main}>
        {tabContent[activeNav]}
      </main>
    </div>
  );
}