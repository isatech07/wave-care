"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useVeraoProducts } from "./verao.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton, type CartLineItem } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
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

const MARQUEE_WORDS = ["LEVEZA", "BRILHO", "VERÃO", "FRESCOR", "LUZ", "CALOR", "ENERGIA"];

const heroSlides = [
  {
    img: `${API}/products/verao-produtos/banner-kit-verao.jpg`,
    alt: "Verão",
    title: "Verão",
    subtitle:
      "Proteja seus fios contra o sol intenso, sal do mar e maresia. Hidratação profunda para manter seus cabelos macios e brilhantes nos dias mais quentes do litoral.",
  },
  {
    img: `${API}/products/verao-produtos/Summer-Protection-kit.png`,
    alt: "Summer Protection",
    title: "Summer Protection",
    subtitle:
      "Proteção UV, antifrizz e nutrição leve para os dias mais quentes. Seus fios brilhantes do amanhecer ao pôr do sol.",
  },
  {
    img: `${API}/products/verao-produtos/SummerKit-2.png`,
    alt: "Kits de Verão",
    title: "Kits de Verão",
    subtitle:
      "Combos completos para cuidar dos fios durante toda a estação. Escolha o kit ideal para o seu tipo de cabelo.",
  },
];

const tips = [
  "Use protetor solar capilar antes de ir à praia",
  "Enxágue os fios com água doce após o mar",
  "Hidrate profundamente 2x por semana",
  "Evite secador nos dias mais quentes",
];

const AUTO_PLAY_INTERVAL = 5000;

type ModalProduct = ApiProduct & { stock: number; createdAt: string };

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Summer() {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const seasonData = useVeraoProducts();

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = heroSlides.length;

  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setCurrent((index + total) % total);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_PLAY_INTERVAL) {
        setCurrent((c) => (c + 1) % total);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, total]);

  const openProduct = useCallback(
    (productId: number) => {
      const found = seasonData.apiProducts?.find((p) => p.id === productId);
      if (!found) return;
      setSelectedProduct({
        ...found,
        stock: found.stock ?? 10,
        createdAt: found.createdAt ?? new Date().toISOString(),
      });
      setIsModalOpen(true);
    },
    [seasonData.apiProducts]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const addToCart = useCallback((product: ModalProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const qty = item.quantity + delta;
          return qty > 0 ? { ...item, quantity: qty } : null;
        })
        .filter((item): item is CartLineItem => item !== null)
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const slide = heroSlides[current];

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable}`}>
      {/* HERO FULLSCREEN */}
      <section className={styles.heroSection}>
        <div className={styles.heroBanner}>
          {heroSlides.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt={s.alt}
              className={`${styles.heroSlide} ${i === current ? styles.heroSlideActive : ""}`}
            />
          ))}

          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>{slide.title}</h1>
            <p className={styles.heroSubtitle}>{slide.subtitle}</p>
          </div>

          <button
            onClick={() => goTo(current - 1)}
            className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className={`${styles.heroArrow} ${styles.heroArrowRight}`}
            aria-label="Próximo"
          >
            →
          </button>

          <div className={styles.heroDots}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`${styles.heroDot} ${i === current ? styles.heroDotActive : ""}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className={styles.heroWave}>
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#FCFAF7" />
            </svg>
          </div>
        </div>
      </section>

      {/* DUAS FAIXAS DIAGONAIS QUE SE CRUZAM */}
      <div style={{ position: 'relative', height: '120px', overflow: 'hidden', margin: '3rem 0', zIndex: 1 }}>
        {/* Faixa 1 — move para esquerda, inclina -3deg */}
        <div style={{
          position: 'absolute', width: '130%', marginLeft: '-15%',
          background: '#C2410C', transform: 'rotate(-3deg)',
          padding: '0.65rem 0', top: '18px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', width: 'max-content',
            whiteSpace: 'nowrap', animation: 'marqueeLeft 30s linear infinite',
          }}
          className={reduced ? styles.marqueeReducedMotion : undefined}>
            {[...Array(2)].flatMap((_, a) =>
              ['LEVEZA','BRILHO','VERÃO','FRESCOR','LUZ','CALOR','ENERGIA'].map((w, i) => (
                <span key={`a${a}${i}`} style={{
                  fontSize: '0.8rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#fff',
                  fontWeight: '500', padding: '0 1.5rem',
                }}>
                  {w} <span style={{ opacity: 0.5 }}>–</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Faixa 2 — move para direita, inclina +3deg */}
        <div style={{
          position: 'absolute', width: '130%', marginLeft: '-15%',
          background: '#1C1917', transform: 'rotate(3deg)',
          padding: '0.65rem 0', top: '58px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', width: 'max-content',
            whiteSpace: 'nowrap', animation: 'marqueeRight 30s linear infinite',
          }}
          className={reduced ? styles.marqueeReducedMotion : undefined}>
            {[...Array(2)].flatMap((_, a) =>
              ['PROTEÇÃO','BRILHO','NUTRIÇÃO','HIDRATAÇÃO','VERÃO','CALOR','LEVEZA'].map((w, i) => (
                <span key={`b${a}${i}`} style={{
                  fontSize: '0.8rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#fff',
                  fontWeight: '500', padding: '0 1.5rem',
                }}>
                  {w} <span style={{ opacity: 0.5 }}>–</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO DE DICAS */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Dicas para o Verão</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER EDITORIAL */}
      <section className={styles.editorialBanner}>
        <div className={styles.editorialOverlay}>
          <h2 className={styles.editorialTitle}>Summer Protection</h2>
          <p className={styles.editorialSubtitle}>
            Proteção contra sol, maresia e calor excessivo. Foco em brilho, definição e nutrição leve.
          </p>
        </div>
      </section>

      {/* CARROSSEL DE PRODUTOS */}
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

      {/* CARRINHO FLUTUANTE */}
      <CartFloatingButton
        count={cartCount}
        onOpen={() => setIsCartOpen(true)}
        seasonColor={theme.primary}
      />

      {/* CARRINHO */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        formatPrice={formatPrice}
        seasonColor={theme.primary}
      />

      {/* MODAL DE PRODUTO */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
        seasonTheme={{ primary: theme.primary, background: theme.background }}
      />
    </div>
  );
}
