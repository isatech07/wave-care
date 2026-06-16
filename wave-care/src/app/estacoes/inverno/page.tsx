"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useInvernoProducts } from "./inverno.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";
import { useCart } from "@/contexts/CartContext";

import type { ApiProduct } from "@/lib/api";

const poppins  = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-title" });

const theme = seasonThemes.inverno;

const MARQUEE_WORDS = ["WINTER", "NUTRIÇÃO PROFUNDA", "HIDRATAÇÃO", "PROTEÇÃO TÉRMICA", "FRIO", "BRILHO", "CUIDADO", "CUTÍCULAS", "SUAVIDADE", "SELAMENTO", "INVERNO", "CABELOS SAUDÁVEIS"];

type ModalProduct = ApiProduct & { stock: number; createdAt: string };

const WinterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <line x1="12" y1="2"     x2="12" y2="22"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2"  y1="12"    x2="22" y2="12"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="5.64" y1="5.64"   x2="18.36" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="5.64"  x2="5.64"  y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2"  r="1.2" fill="currentColor" />
    <circle cx="12" cy="22" r="1.2" fill="currentColor" />
    <circle cx="2"  cy="12" r="1.2" fill="currentColor" />
    <circle cx="22" cy="12" r="1.2" fill="currentColor" />
  </svg>
);

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Winter() {
  const seasonData = useInvernoProducts();

  const { addItem, openCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [favorites, setFavorites]             = useState<Set<number>>(new Set());
  const [visible, setVisible]                 = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const openProduct = useCallback((productId: number) => {
    const found = seasonData.apiProducts?.find((p) => p.id === productId);
    if (!found) return;
    setSelectedProduct({
      ...found,
      stock: found.stock ?? 10,
      createdAt: found.createdAt ?? new Date().toISOString(),
    });
    setIsModalOpen(true);
  }, [seasonData.apiProducts]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Usado pelo ProductModal
  const addToCart = useCallback((product: ModalProduct) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    openCart();
  }, [addItem, openCart]);

  // Usado pelo SeasonProductsSection
  const addToCartById = useCallback((productId: number) => {
    const found = seasonData.apiProducts?.find((p) => p.id === productId);
    if (!found) return;
    addItem({ id: found.id, name: found.name, price: found.price, image: found.image });
    openCart();
  }, [seasonData.apiProducts, addItem, openCart]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }, []);

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable} ${visible ? styles.pageVisible : ""}`}>

      <section className={styles.hero}>
        <img src="/products/inverno-produtos/banner-principal-inverno.png" alt="Inverno" className={styles.heroImg} />
        <div className={styles.heroGrain}   aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Winter Frost</span>
          <h1 className={styles.heroTitle}>Inverno</h1>
          <p className={styles.heroSub}>
            Proteja seus fios do frio intenso e do ar seco. Nutrição profunda e selamento de
            cutículas para manter seus cabelos macios nos dias mais frios.
          </p>
        </div>
      </section>

      <div className={styles.marqueeSection}>
        <SeasonMarquee words={MARQUEE_WORDS} highlightColor="#1d4ed8" icon={<WinterIcon />} />
      </div>

      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img src="/products/inverno-produtos/propaganda-inverno.png" alt="Winter Frost" />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia de Nutrição Profunda</span>
          <h2 className={styles.editorialTitle}>Winter<br />Frost</h2>
          <p className={styles.editorialBody}>
            Hidratação intensa, selamento de cutículas e proteção térmica para os dias mais frios.
            Seus fios nutridos e protegidos do amanhecer ao entardecer.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para o clima frio e seco</p>
        </div>
      </section>

      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="inverno"
          onProductClick={openProduct}
          lineBannerSrc="/products/inverno-produtos/banner-oleo-inverno.png"
          lineBannerAlt="Linha Winter Frost"
          kitsBannerSrc="/products/inverno-produtos/banner-kit-inverno.png"
          kitsBannerAlt="Kits de Inverno"
          onAddToCart={addToCartById}
        />
      </section>

      <CartFloatingButton seasonColor={theme.primary} />
      <Cart seasonColor={theme.primary} />

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