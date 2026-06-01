"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useOutonoProducts } from "./outono.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";
import { useCart } from "@/contexts/CartContext";

import type { ApiProduct } from "@/lib/api";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-title" });

const theme = seasonThemes.outono;

const MARQUEE_WORDS = ["AUTUMN", "NUTRIÇÃO PROFUNDA", "ANTIFRIZZ", "HIDRATAÇÃO", "OUTONO", "BRILHO", "CUIDADO", "CUTÍCULAS", "SUAVIDADE", "SELAMENTO", "FOLHAS", "CABELOS SAUDÁVEIS"];

type ModalProduct = ApiProduct & { stock: number; createdAt: string };

const AutumnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2 C12 2, 20 6, 20 13 C20 17.4 16.4 21 12 21 C7.6 21 4 17.4 4 13 C4 6 12 2 12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <line x1="12" y1="4" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="9"  x2="8"  y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="9"  x2="16" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="13" x2="9"  y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="13" x2="15" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const formatPrice = (price: number) => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Autumn() {
  const seasonData = useOutonoProducts();
  const { addItem, openCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const openProduct = useCallback((productId: number) => {
    const found = seasonData.apiProducts?.find((p) => p.id === productId);
    if (!found) return;
    setSelectedProduct({ ...found, stock: found.stock ?? 10, createdAt: found.createdAt ?? new Date().toISOString() });
    setIsModalOpen(true);
  }, [seasonData.apiProducts]);

  const closeModal = useCallback(() => { setIsModalOpen(false); setSelectedProduct(null); }, []);

  const addToCart = useCallback((product: ModalProduct) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    openCart();
  }, [addItem, openCart]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => { const next = new Set(prev); next.has(productId) ? next.delete(productId) : next.add(productId); return next; });
  }, []);

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable} ${visible ? styles.pageVisible : ""}`}>

      <section className={styles.hero}>
        <img src="/products/outono-produtos/banner-principal-outono.png" alt="Outono" className={styles.heroImg} />
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Autumn Bloom</span>
          <h1 className={styles.heroTitle}>Outono</h1>
          <p className={styles.heroSub}>Renove seus fios com a chegada do outono. Nutrição profunda e proteção contra o ressecamento causado pelas mudanças de estação.</p>
        </div>
      </section>

      <div className={styles.marqueeSection}>
        <SeasonMarquee words={MARQUEE_WORDS} highlightColor="#92400e" icon={<AutumnIcon />} />
      </div>

      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img src="/products/outono-produtos/propaganda-kit-outono.png" alt="Autumn Bloom" />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia Antifrizz & Nutrição</span>
          <h2 className={styles.editorialTitle}>Autumn<br />Bloom</h2>
          <p className={styles.editorialBody}>Hidratação intensa, antifrizz e brilho natural para os dias mais frescos. Seus fios renovados e protegidos durante toda a transição de estação.</p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para a transição de estação</p>
        </div>
      </section>

      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData} seasonId="outono" onProductClick={openProduct}
          lineTitle="Beleza em Transição" kitsTitle="Combinações Perfeitas"
          lineBannerSrc="/products/outono-produtos/banner-gelatina-outono.png" lineBannerAlt="Linha Autumn Bloom"
          kitsBannerSrc="/products/outono-produtos/banner-kit-outono.png" kitsBannerAlt="Kits de Outono"
        />
      </section>

      <CartFloatingButton seasonColor={theme.primary} />
      <Cart seasonColor={theme.primary} />
      <ProductModal
        product={selectedProduct} isOpen={isModalOpen} onClose={closeModal}
        onAddToCart={addToCart} onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
        seasonTheme={{ primary: theme.primary, background: theme.background }}
      />
    </div>
  );
}