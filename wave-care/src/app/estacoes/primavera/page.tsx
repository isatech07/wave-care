"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { usePrimaveraProducts } from "./primavera.service";
import { seasonThemes } from "@/lib/seasonThemes";
import Cart, { CartFloatingButton, type CartLineItem } from "@/components/Cart/Cart";
import ProductModal from "@/components/ProductModal/ProductModal";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";

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

const theme = seasonThemes.primavera;

const MARQUEE_WORDS = [
  "PRIMAVERA",
  "HIDRATAÇÃO FLORAL",
  "ANTIFRIZZ",
  "RENOVAÇÃO",
  "BLOOM",
  "BRILHO",
  "CUIDADO",
  "LEVEZA",
  "FRESCOR",
  "BOTÂNICO",
  "FLORES",
  "CABELOS SAUDÁVEIS",
];

type ModalProduct = ApiProduct & { stock: number; createdAt: string };

const SpringIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Pétala superior */}
    <path d="M12 2 C10 5, 10 8, 12 9 C14 8, 14 5, 12 2Z" fill="currentColor" opacity="0.9" />
    {/* Pétala direita */}
    <path d="M22 12 C19 10, 16 10, 15 12 C16 14, 19 14, 22 12Z" fill="currentColor" opacity="0.9" />
    {/* Pétala inferior */}
    <path d="M12 22 C14 19, 14 16, 12 15 C10 16, 10 19, 12 22Z" fill="currentColor" opacity="0.9" />
    {/* Pétala esquerda */}
    <path d="M2 12 C5 14, 8 14, 9 12 C8 10, 5 10, 2 12Z" fill="currentColor" opacity="0.9" />
    {/* Pétala sup-dir */}
    <path d="M19 5 C16.5 6.5, 15 9, 15.5 10.5 C17 11, 19.5 9.5, 19 5Z" fill="currentColor" opacity="0.7" />
    {/* Pétala inf-dir */}
    <path d="M19 19 C19.5 14.5, 17 13, 15.5 13.5 C15 15, 16.5 17.5, 19 19Z" fill="currentColor" opacity="0.7" />
    {/* Pétala inf-esq */}
    <path d="M5 19 C7.5 17.5, 9 15, 8.5 13.5 C7 13, 4.5 14.5, 5 19Z" fill="currentColor" opacity="0.7" />
    {/* Pétala sup-esq */}
    <path d="M5 5 C4.5 9.5, 7 11, 8.5 10.5 C9 9, 7.5 6.5, 5 5Z" fill="currentColor" opacity="0.7" />
    {/* Centro */}
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </svg>
);

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Spring() {
  const seasonData = usePrimaveraProducts();

  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

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
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
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
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div
      className={`${styles.container} ${poppins.variable} ${playfair.variable} ${
        visible ? styles.pageVisible : ""
      }`}
    >
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <img
          src="/products/primavera-produtos/banner-principal-primavera.png"
          alt="Primavera"
          className={styles.heroImg}
        />

        {/* grain overlay editorial */}
        <div className={styles.heroGrain} aria-hidden="true" />

        {/* gradiente escuro */}
        <div className={styles.heroOverlay} aria-hidden="true" />

        {/* conteúdo */}
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Primavera Bloom</span>
          <h1 className={styles.heroTitle}>Primavera</h1>
          <p className={styles.heroSub}>
            Desperte seus fios com a leveza e o frescor da nova estação. Hidratação
            floral e nutrição profunda para cabelos que florescem a cada lavagem.
          </p>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className={styles.marqueeSection}>
        <SeasonMarquee
          words={MARQUEE_WORDS}
          highlightColor="#be185d"
          icon={<SpringIcon />}
        />
      </div>

      {/* ── BANNER EDITORIAL ── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImg}>
          <img
            src="/products/primavera-produtos/propaganda-primavera.png"
            alt="Primavera Bloom"
          />
          <div className={styles.editorialImgOverlay} />
        </div>
        <div className={styles.editorialText}>
          <span className={styles.editorialLabel}>Tecnologia Floral & Antifrizz</span>
          <h2 className={styles.editorialTitle}>
            Primavera
            <br />
            Bloom
          </h2>
          <p className={styles.editorialBody}>
            Extrato de flores, antifrizz e nutrição delicada para os dias de renovação.
            Seus fios radiantes e hidratados do amanhecer à noite.
          </p>
          <div className={styles.editorialDivider} />
          <p className={styles.editorialNote}>Ideal para a renovação dos fios</p>
        </div>
      </section>

      {/* ── PRODUTOS ── */}
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

      {/* ── CARRINHO ── */}
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
        onClearCart={() => setCart([])}
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