"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useVeraoProducts } from "./verao.service";
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
const theme = seasonThemes.verao;

// ── Palavras para o marquee ──────────────────────────────────────────────────
const MARQUEE_WORDS = [
  "SUMMER", "PROTEÇÃO UV", "PRAIA", "HIDRATAÇÃO", "SOL",
  "BRILHO", "CUIDADO", "LEVEZA", "FRESCOR", "NUTRIÇÃO",
  "OCEANO", "CABELOS SAUDÁVEIS",
];

// ── Tipo auxiliar ────────────────────────────────────────────────────────────
type ModalProduct = ApiProduct & { stock: number; createdAt: string };

// ── Ícone decorativo de verão ────────────────────────────────────────────────
const SummerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <line x1="12" y1="2"  x2="12" y2="5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2"  y1="12" x2="5"  y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Utilitário de formatação ─────────────────────────────────────────────────
const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── Página principal de Verão ────────────────────────────────────────────────
export default function Summer() {
  const seasonData = useVeraoProducts();
  const { addItem, openCart } = useCart();
  const { isLoggedIn } = useUser();

  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [favorites, setFavorites]             = useState<Set<number>>(new Set());
  const [visible, setVisible]                 = useState(false);

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
        <img src="/products/verao-produtos/banner-principal-verao.png" alt="Verão" className={styles.heroImg} />
        <div className={styles.heroGrain}   aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Summer Protection</span>
          <h1 className={styles.heroTitle}>Verão</h1>
          <p className={styles.heroSub}>
            Defenda seus fios dos desafios do verão com uma proteção eficaz
            contra os raios solares, o sal marinho e a maresia.
          </p>
        </div>
      </section>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div className={styles.marqueeSection}>
        <SeasonMarquee words={MARQUEE_WORDS} highlightColor="#ea580c" icon={<SummerIcon />} />
      </div>

      {/* ── Editorial Luxury ──────────────────────────────────────────── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img src="/products/verao-produtos/propaganda-verao.jpg" alt="Summer Protection" />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia de Proteção UV</span>
          <h2 className={styles.editorialTitle}>Summer<br />Protection</h2>
          <p className={styles.editorialBody}>
            Proteção contra sol, maresia e calor excessivo. Foco em brilho,
            definição e nutrição leve para os seus fios durante toda a estação.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para o clima tropical</p>
        </div>
      </section>

      {/* ── Seção de Produtos ─────────────────────────────────────────── */}
      <section className={styles.productsSection}>
        <SeasonProductsSection
          seasonData={seasonData}
          seasonId="verao"
          onProductClick={openProduct}
          lineTitle="O Poder do Verão"
          kitsTitle="Cuidados Completos"
          lineBannerSrc="products/verao-produtos/banner-creme-verao.png"
          lineBannerAlt="Linha Summer Protection"
          kitsBannerSrc="/products/verao-produtos/banner-kit-verao.jpg"
          kitsBannerAlt="Kits de Verão"
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