"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useVeraoProducts } from "./verao.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton, type CartLineItem } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";

import type { ApiProduct } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-title",
});

const theme = seasonThemes.verao;

const MARQUEE_WORDS = ["SUMMER", "Colorido", "Praia", "Floral", "Shorts", "Vestidos", "Sandálias", "Verão", "Sol", "Calor", "Estampado", "Fresco"];

const heroSlides = [
  {
    img: `${API}/products/verao-produtos/banner-kit-verao.jpg`,
    alt: "Verão",
    title: "Verão",
    subtitle: "Proteja seus fios contra o sol intenso, sal do mar e maresia.",
  },
  {
    img: `${API}/products/verao-produtos/Summer-Protection-kit.png`,
    alt: "Summer Protection",
    title: "Summer Protection",
    subtitle: "Proteção UV, antifrizz e nutrição leve para os dias mais quentes.",
  },
  {
    img: `${API}/products/verao-produtos/SummerKit-2.png`,
    alt: "Kits de Verão",
    title: "Kits de Verão",
    subtitle: "Combos completos para cuidar dos fios durante toda a estação.",
  },
];

const tips = [
  { icon: "☀️", text: "Use protetor solar capilar antes de ir à praia" },
  { icon: "🌊", text: "Enxágue os fios com água doce após o mar" },
  { icon: "💧", text: "Hidrate profundamente 2x por semana" },
  { icon: "🌬️", text: "Evite secador nos dias mais quentes" },
];

const AUTO_PLAY_INTERVAL = 5000;
type ModalProduct = ApiProduct & { stock: number; createdAt: string };
const SummerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Summer() {
  const seasonData = useVeraoProducts();
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent((index + total) % total);
    startTimeRef.current = Date.now();
  }, [total]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= AUTO_PLAY_INTERVAL) {
        setCurrent((c) => (c + 1) % total);
        startTimeRef.current = Date.now();
      }
    }, 200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, total]);

  const openProduct = useCallback((productId: number) => {
    const found = seasonData.apiProducts?.find((p) => p.id === productId);
    if (!found) return;
    setSelectedProduct({ ...found, stock: found.stock ?? 10, createdAt: found.createdAt ?? new Date().toISOString() });
    setIsModalOpen(true);
  }, [seasonData.apiProducts]);

  const closeModal = useCallback(() => { setIsModalOpen(false); setSelectedProduct(null); }, []);

  const addToCart = useCallback((product: ModalProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id !== productId) return item;
      const qty = item.quantity + delta;
      return qty > 0 ? { ...item, quantity: qty } : null;
    }).filter((item): item is CartLineItem => item !== null));
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => { const next = new Set(prev); next.has(productId) ? next.delete(productId) : next.add(productId); return next; });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const slide = heroSlides[current];

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable} ${visible ? styles.pageVisible : ""}`}>

      {/* ── HERO COMPACTO ── */}
      <section className={styles.hero}>
        <div className={styles.heroSlides}>
          {heroSlides.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt={s.alt}
              className={`${styles.heroSlide} ${i === current ? styles.heroSlideActive : ""}`}
            />
          ))}
          <div className={styles.heroGrain} aria-hidden="true" />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Coleção Verão 2025</span>
          <h1 className={styles.heroTitle}>{slide.title}</h1>
          <p className={styles.heroSub}>{slide.subtitle}</p>
        </div>

        {/* Setas compactas */}
        <button onClick={() => goTo(current - 1)} className={`${styles.arrow} ${styles.arrowL}`} aria-label="Anterior">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => goTo(current + 1)} className={`${styles.arrow} ${styles.arrowR}`} aria-label="Próximo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className={styles.marqueeSection}>
        <SeasonMarquee words={MARQUEE_WORDS} highlightColor="#ea580c"
          icon={<SummerIcon />}  />
      </div>

      {/* ── BANNER EDITORIAL ── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img
            src={`${API}/products/verao-produtos/banner-kit-verao.jpg`}
            alt="Summer Protection"
          />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Linha Exclusiva</span>
          <h2 className={styles.editorialTitle}>Summer<br />Protection</h2>
          <p className={styles.editorialBody}>
            Proteção contra sol, maresia e calor excessivo. Foco em brilho, definição e nutrição leve para os seus fios durante toda a estação.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Desenvolvida para o clima brasileiro</p>
        </div>
      </section>

      {/* ── PRODUTOS ── */}
      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="verao"
          onProductClick={openProduct}
          lineTitle="Linha Summer Protection"
          kitsTitle="Kits de Verão"
          lineBannerSrc={`${API}/products/verao-produtos/propaganda-verao.jpg`}
          lineBannerAlt="Linha Summer Protection"
          kitsBannerSrc={`${API}/products/verao-produtos/propaganda-kit-verao.png`}
          kitsBannerAlt="Kits de Verão"
        />
      </section>

      {/* ── CARRINHO ── */}
      <CartFloatingButton count={cartCount} onOpen={() => setIsCartOpen(true)} seasonColor={theme.primary} />
      <Cart
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}
        items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart}
        formatPrice={formatPrice} seasonColor={theme.primary} onClearCart={() => setCart([])}
      />
      <ProductModal
        product={selectedProduct} isOpen={isModalOpen} onClose={closeModal}
        onAddToCart={addToCart} onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
        seasonTheme={{ primary: theme.primary, background: theme.background }}
      />
    </div>
  );
}