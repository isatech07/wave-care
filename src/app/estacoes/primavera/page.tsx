"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { usePrimaveraProducts } from "./primavera.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { apiGetMyFavorites, apiAddFavorite, apiRemoveFavorite } from "@/lib/api";

import type { ApiProduct } from "@/lib/api";

// ── Fontes ────────────────────────────────────────────────────────────────────
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-title" });

// ── Tema da estação ──────────────────────────────────────────────────────────
const theme = seasonThemes.primavera;

// ── Palavras para o marquee ──────────────────────────────────────────────────
const MARQUEE_WORDS = [
  "PRIMAVERA", "HIDRATAÇÃO FLORAL", "ANTIFRIZZ", "RENOVAÇÃO", "BLOOM", "BRILHO",
  "CUIDADO", "LEVEZA", "FRESCOR", "BOTÂNICO", "FLORES", "CABELOS SAUDÁVEIS"
];

// ── Tipo auxiliar ────────────────────────────────────────────────────────────
type ModalProduct = ApiProduct & { stock: number; createdAt: string };

// ── Ícone decorativo de primavera ────────────────────────────────────────────
const SpringIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2 C10 5, 10 8, 12 9 C14 8, 14 5, 12 2Z" fill="currentColor" opacity="0.9" />
    <path d="M22 12 C19 10, 16 10, 15 12 C16 14, 19 14, 22 12Z" fill="currentColor" opacity="0.9" />
    <path d="M12 22 C14 19, 14 16, 12 15 C10 16, 10 19, 12 22Z" fill="currentColor" opacity="0.9" />
    <path d="M2 12 C5 14, 8 14, 9 12 C8 10, 5 10, 2 12Z" fill="currentColor" opacity="0.9" />
    <path d="M19 5 C16.5 6.5, 15 9, 15.5 10.5 C17 11, 19.5 9.5, 19 5Z" fill="currentColor" opacity="0.7" />
    <path d="M19 19 C19.5 14.5, 17 13, 15.5 13.5 C15 15, 16.5 17.5, 19 19Z" fill="currentColor" opacity="0.7" />
    <path d="M5 19 C7.5 17.5, 9 15, 8.5 13.5 C7 13, 4.5 14.5, 5 19Z" fill="currentColor" opacity="0.7" />
    <path d="M5 5 C4.5 9.5, 7 11, 8.5 10.5 C9 9, 7.5 6.5, 5 5Z" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </svg>
);

// ── Utilitário de formatação ─────────────────────────────────────────────────
const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Página principal de Primavera ────────────────────────────────────────────
export default function Spring() {
  const seasonData = usePrimaveraProducts();
  const { addItem, openCart } = useCart();
  const { isLoggedIn } = useUser();

  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);

  // ── Efeitos ─────────────────────────────────────────────────────────────────
  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    async function loadFavorites() {
      if (!isLoggedIn) {
        setFavorites(new Set());
        return;
      }
      try {
        const favs = await apiGetMyFavorites();
        setFavorites(new Set(favs.map((f) => f.id)));
      } catch {
        setFavorites(new Set());
      }
    }
    loadFavorites();
  }, [isLoggedIn]);

  // ── Handlers do modal de produto ──────────────────────────────────────────
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

  // ── Ações de carrinho ──────────────────────────────────────────────────────
  const addToCart = useCallback((product: ModalProduct) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    openCart();
  }, [addItem, openCart]);

  // ── Favoritos (comportamento otimista) ─────────────────────────────────────
  const toggleFavorite = useCallback(async (productId: number) => {
    if (!isLoggedIn) {
      alert("Faça login para favoritar produtos.");
      return;
    }

    const isFav = favorites.has(productId);

    setFavorites((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(productId) : next.add(productId);
      return next;
    });

    try {
      if (isFav) {
        await apiRemoveFavorite(productId);
      } else {
        await apiAddFavorite(productId);
      }
    } catch {
      // Reverte em caso de erro
      setFavorites((prev) => {
        const next = new Set(prev);
        isFav ? next.add(productId) : next.delete(productId);
        return next;
      });
    }
  }, [favorites, isLoggedIn]);

  // ── Renderização ───────────────────────────────────────────────────────────
  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable} ${visible ? styles.pageVisible : ""}`}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <img src="/products/primavera-produtos/banner-principal-primavera.png" alt="Primavera" className={styles.heroImg} />
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Primavera Bloom</span>
          <h1 className={styles.heroTitle}>Primavera</h1>
          <p className={styles.heroSub}>
            Desperte seus fios com a leveza e o frescor da nova estação. Hidratação floral
            e nutrição profunda para cabelos que florescem a cada lavagem.
          </p>
        </div>
      </section>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div className={styles.marqueeSection}>
        <SeasonMarquee words={MARQUEE_WORDS} highlightColor="#be185d" icon={<SpringIcon />} />
      </div>

      {/* ── Editorial Luxury ──────────────────────────────────────────── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img src="/products/primavera-produtos/propaganda-primavera.png" alt="Primavera Bloom" />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia Floral & Antifrizz</span>
          <h2 className={styles.editorialTitle}>Primavera<br />Bloom</h2>
          <p className={styles.editorialBody}>
            Extrato de flores, antifrizz e nutrição delicada para os dias de renovação.
            Seus fios radiantes e hidratados do amanhecer à noite.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para a renovação dos fios</p>
        </div>
      </section>

      {/* ── Seção de Produtos ─────────────────────────────────────────── */}
      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="primavera"
          onProductClick={openProduct}
          lineTitle="Leveza e Movimento"
          kitsTitle="Vitalidade Natural"
          lineBannerSrc="/products/primavera-produtos/banner-shampoo-primavera.png"
          lineBannerAlt="Linha Primavera Bloom"
          kitsBannerSrc="/products/primavera-produtos/banner-produtos-primavera.png"
          kitsBannerAlt="Kits de Primavera"
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