// app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Leaf, Heart, ShoppingBag, Star, Sparkles,
  X, Plus, Minus, Check, Trash2, ChevronLeft, ChevronRight, Award,
  Sun, CloudSnow, Flower2, TreeDeciduous,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import "./home.css";

// ── Types ──────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
  season: string;
  stock: number;
}
interface Season {
  id: string;
  label: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
}
interface GelatinSlide {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  season: string;
  bgColor: string;
  blobColor1: string;
  blobColor2: string;
  textColor: string;
}

// ── Data ───────────────────────────────────────────────────────────
const seasons: Season[] = [
  { id: "verao",     label: "Verão",     description: "Proteção Solar & Hidratação",  image: "/products/verao-produtos/Summerkit-2.png",                  color: "#f5e6d3", icon: <Sun size={15} /> },
  { id: "outono",    label: "Outono",    description: "Fortalecimento & Anti-queda",  image: "/products/outono-produtos/Autumn-Bloom-kit.png",            color: "#d4dcc6", icon: <TreeDeciduous size={15} /> },
  { id: "inverno",   label: "Inverno",   description: "Nutrição Profunda & Proteção", image: "/products/inverno-produtos/inverno-kit-2.png",              color: "#b8c4d4", icon: <CloudSnow size={15} /> },
  { id: "primavera", label: "Primavera", description: "Renovação & Revitalização",    image: "/products/primavera-produtos/primavera-kit-completo.png",   color: "#e8d4dd", icon: <Flower2 size={15} /> },
];

const slides: GelatinSlide[] = [
  { id: "verao",     name: "Summer Protection", subtitle: "Gelatina Estilizadora",  description: "Definição e hidratação com proteção UV para dias ensolarados.",         image: "/products/gelatina-verao.png",     season: "Verão",     bgColor: "#F5E6C8", blobColor1: "#E8C97A", blobColor2: "#F2D98A", textColor: "#2D1B00" },
  { id: "outono",    name: "Autumn Regeneration",subtitle: "Força & Vitalidade",    description: "Cachos definidos com nutrição profunda para a estação das mudanças.",   image: "/products/gelatina-outono.png",    season: "Outono",    bgColor: "#D8E0CC", blobColor1: "#9BB085", blobColor2: "#C2D0A8", textColor: "#1E2B14" },
  { id: "inverno",   name: "Winter Shield",      subtitle: "Nutrição Intensiva",    description: "Nutrição profunda contra o frio intenso e o ar seco do inverno.",       image: "/products/gelatina-inverno.png",   season: "Inverno",   bgColor: "#D0DCE8", blobColor1: "#8AACCF", blobColor2: "#B8D0E8", textColor: "#0A1828" },
  { id: "primavera", name: "Spring Bloom",       subtitle: "Renovação Capilar",     description: "Florescimento capilar com ingredientes que revitalizam e renovam.",     image: "/products/gelatina-primavera.png", season: "Primavera", bgColor: "#F2D8E4", blobColor1: "#E8A0BC", blobColor2: "#F5C8DA", textColor: "#3D1828" },
];

const products: Product[] = [
  { id: 1, name: "SunShield Shampoo",      description: "Limpeza suave com proteção UV para cabelos expostos ao sol.",      price: 29.9, originalPrice: 39.9, rating: 4.8, reviews: 234, image: "/products/verao-produtos/verao-shampoo.png",        badge: "Best Seller", category: "Shampoo",  season: "Verão",     stock: 10 },
  { id: 2, name: "Autumn Repair Mask",     description: "Tratamento intensivo para recuperar fios danificados.",             price: 44.9, originalPrice: 54.9, rating: 4.9, reviews: 312, image: "/products/outono-produtos/outono-mascara.png",      badge: "Best Seller", category: "Máscara",  season: "Outono",    stock: 8 },
  { id: 3, name: "Winter Protective Cream",description: "Escudo protetor contra o frio mantendo hidratação dos fios.",      price: 32.9, originalPrice: 42.9, rating: 4.8, reviews: 267, image: "/products/inverno-produtos/inverno-creme.png",      badge: "Best Seller", category: "Leave-in", season: "Inverno",   stock: 6 },
  { id: 4, name: "Spring Bloom Gelatin",   description: "Gelatina modeladora que define cachos com efeito natural.",        price: 38.9, originalPrice: 48.9, rating: 4.7, reviews: 189, image: "/products/primavera-produtos/primavera-gelatina.png",badge: "Novo",        category: "Styling",  season: "Primavera", stock: 12 },
];

const marquee = ["Ingredientes Naturais","Fórmulas Sazonais","Cabelos Saudáveis","Hidratação Profunda","Proteção UV","Cruelty Free","Sustentável","Nutrição Intensa"];

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeImagePath = (path: string): string => {
  if (!path) return "/products/placeholder.png";
  let n = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!n.startsWith("/")) n = "/" + n;
  return n;
};

// ── Component ──────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    openCart,
    addItem,
    updateQuantity,
    removeItem,
    cartCount,
    cartTotal,
    createOrder,
    createOrderLoading,
    error: cartError,
    notice: globalNotice,
  } = useCart();

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("verao");

  // carousel auto-play
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavorites(p => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }, [addItem]);

  const handleCheckout = useCallback(async () => {
    try {
      const order = await createOrder();
      sessionStorage.setItem("wc_checkout_items", JSON.stringify(items));
      sessionStorage.setItem("wc_pending_order_id", String(order.id));
      closeCart();
      router.push("/checkout");
    } catch {
      // erro já em cartError do contexto
    }
  }, [createOrder, items, closeCart, router]);

  const total = cartTotal;
  const count = cartCount;
  const cur = slides[slide];
  const activeSeason = seasons.find(s => s.id === tab)!;

  return (
    <main className="hm">

      {/* Global Notification */}
      <AnimatePresence>
        {globalNotice && (
          <motion.div className="hm-notice"
            initial={{ opacity: 0, y: -14, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -14, x: "-50%" }}
          >
            <Check size={13} />{globalNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <button className="hm-cart-btn" onClick={openCart} aria-label="Abrir sacola">
        <ShoppingBag size={20} />
        {count > 0 && <span className="hm-cart-badge">{count}</span>}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="hm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
            <motion.aside className="hm-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
              <div className="hm-drawer-head">
                <div>
                  <h2>Sua Sacola</h2>
                  <span className="hm-count">{count} {count === 1 ? "item" : "itens"}</span>
                </div>
                <button className="hm-close" onClick={closeCart}><X size={18} /></button>
              </div>

              <div className="hm-drawer-body">
                {items.length === 0
                  ? <div className="hm-empty"><ShoppingBag size={40} strokeWidth={1} /><p>Sua sacola está vazia</p><span>Adicione produtos para continuar</span></div>
                  : <ul>{items.map(item => (
                      <motion.li key={item.id} className="hm-cart-item" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="hm-cart-thumb">
                          <Image
                            src={normalizeImagePath(item.image)}
                            alt={item.name}
                            width={64}
                            height={64}
                            style={{ objectFit: "cover" }}
                            onError={(e) => { (e.target as HTMLImageElement).src = "/products/placeholder.png"; }}
                          />
                        </div>
                        <div className="hm-cart-info">
                          <p>{item.name}</p>
                          <span>{fmt(item.price)}</span>
                          <div className="hm-qty">
                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                          </div>
                        </div>
                        <button className="hm-cart-rm" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                      </motion.li>
                    ))}</ul>
                }
              </div>

              {items.length > 0 && (
                <div className="hm-drawer-foot">
                  {cartError && (
                    <p style={{ color: "#dc3545", fontSize: "0.82rem", textAlign: "center", margin: "0 0 0.5rem" }}>
                      {cartError}
                    </p>
                  )}
                  <div className="hm-total"><span>Total</span><strong>{fmt(total)}</strong></div>
                  <button 
                    className="hm-checkout" 
                    onClick={handleCheckout}
                    disabled={createOrderLoading}
                  >
                    {createOrderLoading ? "Processando..." : "Finalizar Compra"}
                    {!createOrderLoading && <ArrowRight size={15} />}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="hm-hero">
        <div className="hm-hero-inner">

          {/* Copy */}
          <motion.div className="hm-hero-copy"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1>A ciência que<br /><em>transforma</em><br />seus cabelos</h1>
            <p>Fórmulas desenvolvidas para cada estação do ano. Ingredientes naturais de alta performance que se adaptam ao clima e potencializam a beleza natural dos seus fios.</p>
            <div className="hm-hero-actions">
              <Link href="/quiz" className="hm-btn-primary">Descobrir Minha Rotina <ArrowRight size={15} /></Link>
              <Link href="#colecoes" className="hm-btn-ghost">Ver Coleções</Link>
            </div>
          </motion.div>

          {/* Visual with frame */}
          <motion.div className="hm-hero-visual"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hm-frame">
              <div className="hm-frame-border" />
              <div className="hm-frame-corner hm-fc-tl" />
              <div className="hm-frame-corner hm-fc-tr" />
              <div className="hm-frame-corner hm-fc-bl" />
              <div className="hm-frame-corner hm-fc-br" />
              <Image src="/products/verao-produtos/verao-shampoo.png" alt="Wave Care" width={480} height={560} priority className="hm-hero-img" />
            </div>

            {/* Floating badges */}
            <motion.div className="hm-float hm-float-l" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
              <Leaf size={15} /><span>100% Natural</span>
            </motion.div>
            <motion.div className="hm-float hm-float-r" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
              <Award size={15} /><span>Premiado 2024</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="hm-trust">
          {["100% Natural","Premiado","Dermatologicamente Testado","Cruelty Free"].map(t => (
            <div key={t} className="hm-trust-item"><span className="hm-dot" />{t}</div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="hm-marquee-wrap">
        <div className="hm-marquee">
          {[...marquee, ...marquee].map((t, i) => (
            <span key={i} className="hm-marquee-item">{t}<span>◆</span></span>
          ))}
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <section className="hm-carousel-section">
        <div className="hm-section-head">
          <span className="hm-label">Lançamentos</span>
          <h2>Novas Gelatinas <em>Sazonais</em></h2>
        </div>

        <div className="hm-carousel" style={{ "--gc": cur.bgColor, "--gt": cur.textColor, "--gb1": cur.blobColor1, "--gb2": cur.blobColor2 } as React.CSSProperties}>
          <div className="hm-carousel-blob hm-carousel-blob-1" />
          <div className="hm-carousel-blob hm-carousel-blob-2" />

          <AnimatePresence mode="wait">
            <motion.div key={slide} className="hm-carousel-slide"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hm-carousel-info">
                <span className="hm-carousel-tag">{cur.season}</span>
                <h3>{cur.name}</h3>
                <p className="hm-carousel-sub">{cur.subtitle}</p>
                <p>{cur.description}</p>
                <Link href={`/estacoes/${cur.id}`} className="hm-carousel-cta">Ver Produtos <ArrowRight size={14} /></Link>
              </div>
              <div className="hm-carousel-img">
                <Image src={cur.image} alt={cur.name} width={380} height={380} priority style={{ objectFit: "contain" }} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="hm-carousel-nav">
            <button onClick={() => setSlide(p => (p - 1 + slides.length) % slides.length)}><ChevronLeft size={20} /></button>
            <div className="hm-carousel-dots">
              {slides.map((_, i) => <button key={i} className={i === slide ? "active" : ""} onClick={() => setSlide(i)} />)}
            </div>
            <button onClick={() => setSlide(p => (p + 1) % slides.length)}><ChevronRight size={20} /></button>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="hm-products" id="produtos">
        <div className="hm-products-head">
          <div>
            <span className="hm-label">Mais Vendidos</span>
            <h2>Produtos em <em>Destaque</em></h2>
          </div>
          <Link href="/produtos" className="hm-view-all">Ver todos <ArrowRight size={14} /></Link>
        </div>

        <div className="hm-products-grid">
          {products.map((p, i) => (
            <motion.article key={p.id} className="hm-product"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            >
              <div className="hm-product-img">
                {p.badge && <span className="hm-badge">{p.badge}</span>}
                <button className={`hm-fav ${favorites.has(p.id) ? "active" : ""}`} onClick={() => toggleFav(p.id)}>
                  <Heart size={15} fill={favorites.has(p.id) ? "currentColor" : "none"} />
                </button>
                <Image src={normalizeImagePath(p.image)} alt={p.name} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="hm-product-info">
                <div className="hm-stars"><Star size={12} fill="currentColor" /><span>{p.rating}</span><span className="hm-rev">({p.reviews})</span></div>
                <p className="hm-product-cat">{p.category}</p>
                <h3>{p.name}</h3>
                <p className="hm-product-desc">{p.description}</p>
                <div className="hm-product-foot">
                  <div><span className="hm-price">{fmt(p.price)}</span>{p.originalPrice && <span className="hm-was">{fmt(p.originalPrice)}</span>}</div>
                  <button className="hm-add" onClick={() => addToCart(p)} disabled={p.stock === 0}>
                    <Plus size={13} />{p.stock === 0 ? "Esgotado" : "Adicionar"}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── QUIZ CTA ── */}
      <section className="hm-quiz" id="quiz">
        <motion.div className="hm-quiz-card"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="hm-quiz-left">
            <div className="hm-quiz-icon"><Sparkles size={22} /></div>
            <span className="hm-label-light">Recomendação Personalizada</span>
            <h2>Descubra o cuidado<br /><em>ideal para você</em></h2>
            <p>Nosso quiz analisa seu tipo de fio e estação atual para criar uma rotina capilar completamente personalizada.</p>
          </div>
          <div className="hm-quiz-right">
            <ul>
              {["Análise em 2 minutos","Baseado no seu clima","Rotina completa de cuidados"].map(f => (
                <li key={f}><Check size={13} />{f}</li>
              ))}
            </ul>
            <Link href="/quiz" className="hm-quiz-btn"><Sparkles size={15} />Fazer o Quiz <ArrowRight size={15} /></Link>
            <p className="hm-quiz-note">Gratuito · 2 min · Sem cadastro</p>
          </div>
        </motion.div>
      </section>

    </main>
  );
}