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

const MARQUEE_WORDS = ["SUMMER", "PROTEÇÃO UV", "PRAIA", "HIDRATAÇÃO", "SOL", "BRILHO", "CUIDADO", "LEVEZA", "FRESCOR", "NUTRIÇÃO", "OCEANO", "CABELOS SAUDÁVEIS"];

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

  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

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

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable} ${visible ? styles.pageVisible : ""}`}>

      {/* ── HERO COMPACTO ── */}
    <section className={styles.hero}>
      <img
        src="/products/verao-produtos/banner-principal-verao.png"
        alt="Verão"
        className={styles.heroImg}
        />
 
      {/* grain overlay editorial */}
      <div className={styles.heroGrain} aria-hidden="true" />
 
      {/* gradiente escuro */}
      <div className={styles.heroOverlay} aria-hidden="true" />
 
      {/* conteúdo */}
      <div className={styles.heroContent}>
        <span className={styles.heroEyebrow}>Summer Protection</span>
        <h1 className={styles.heroTitle}>Verão</h1>
        <p className={styles.heroSub}>
          Defenda seus fios dos desafios do verão com uma proteção eficaz contra os raios solares, o sal marinho e a maresia.
        </p>
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
            src={"/products/verao-produtos/propaganda-verao.jpg"}
            alt="Summer Protection"
          />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia de Proteção UV</span>
          <h2 className={styles.editorialTitle}>Summer<br />Protection</h2>
          <p className={styles.editorialBody}>
            Proteção contra sol, maresia e calor excessivo. Foco em brilho, definição e nutrição leve para os seus fios durante toda a estação.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para o clima tropical</p>
        </div>
      </section>

      {/* ── PRODUTOS ── */}
      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="verao"
          onProductClick={openProduct}
          lineTitle="O Poder do Verão"
          kitsTitle="Cuidados Completos"
          lineBannerSrc={"products/verao-produtos/banner-creme-verao.png"}
          lineBannerAlt="Linha Summer Protection"
          kitsBannerSrc={"/products/verao-produtos/banner-kit-verao.jpg"}
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