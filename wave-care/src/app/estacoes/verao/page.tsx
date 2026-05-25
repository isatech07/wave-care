"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useVeraoProducts } from "./verao.service";
import { seasonThemes } from "@/lib/seasonThemes";
import MarqueeStrip from "@/components/seasonal/MarqueeStrip";
import SeasonParticles from "@/components/seasonal/SeasonParticles";
import SeasonHero from "@/components/seasonal/SeasonHero";
import Cart, { CartFloatingButton, type CartLineItem } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import type { ApiProduct } from "@/lib/api";

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
    img: "/products/verao-produtos/banner-kit-verao.jpg",
    alt: "Verão",
    title: "Verão",
    subtitle:
      "Proteja seus fios contra o sol intenso, sal do mar e maresia. Hidratação profunda para manter seus cabelos macios e brilhantes nos dias mais quentes do litoral.",
  },
  {
    img: "/products/verao-produtos/Summer-Protection - kit.png",
    alt: "Summer Protection",
    title: "Summer Protection",
    subtitle:
      "Proteção UV, antifrizz e nutrição leve para os dias mais quentes. Seus fios brilhantes do amanhecer ao pôr do sol.",
  },
  {
    img: "/products/verao-produtos/Summer Kit-2.png",
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
      <SeasonParticles seasonId="verao" theme={theme} />

      <MarqueeStrip words={MARQUEE_WORDS} separator="☀" theme={theme} />

      <SeasonHero seasonId="verao" theme={theme}>
        <main className={styles.hero}>
          <div className={styles.heroBanner}>
            {heroSlides.map((s, i) => (
              <img
                key={i}
                src={s.img}
                alt={s.alt}
                className={`${styles.heroBannerImg} ${i === current ? styles.heroBannerImgActive : ""}`}
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
                <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
              </svg>
            </div>
          </div>
        </main>
      </SeasonHero>

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

      <section className={styles.protectionSection} id="collection">
        <div className={styles.protectionBanner}>
          <div className={styles.protectionOverlay}>
            <h2 className={styles.protectionTitle}>Summer Protection</h2>
            <p className={styles.protectionDesc}>
              Proteção contra sol, maresia e calor excessivo. Foco em brilho, definição e nutrição leve.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Verão</h2>
        </div>

        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="verao"
          onProductClick={openProduct}
          lineTitle="Linha Summer Protection"
          kitsTitle="Kits de Verão"
          lineBannerSrc="/products/verao-produtos/propaganda-verão.jpg"
          lineBannerAlt="Linha Summer Protection"
          kitsBannerSrc="/products/verao-produtos/propaganda-kit-verão.png"
          kitsBannerAlt="Kits de Verão"
        />
      </section>

      <CartFloatingButton
        count={cartCount}
        onOpen={() => setIsCartOpen(true)}
        seasonColor={theme.primary}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        formatPrice={formatPrice}
        seasonColor={theme.primary}
      />

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
