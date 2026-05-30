"use client";

import type { ReactNode } from "react";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { ApiProduct } from "@/lib/api";
import type { CarouselProduct } from "@/lib/products";
import styles from "./SeasonProductsSection.module.css";

export interface SeasonProductsData {
  products: CarouselProduct[];
  kits: CarouselProduct[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  apiProducts?: ApiProduct[];
}

interface SeasonProductsSectionProps {
  lineTitle: string;
  kitsTitle: string;
  lineBannerSrc: string;
  lineBannerAlt: string;
  kitsBannerSrc: string;
  kitsBannerAlt: string;
  seasonData: SeasonProductsData;
  seasonId?: "verao" | "outono" | "inverno" | "primavera";
  onProductClick?: (productId: number) => void;
}

function StatusBox({ children }: { children: ReactNode }) {
  return <div className={styles.statusBox}>{children}</div>;
}

function ProductsLoading() {
  return (
    <StatusBox>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>Carregando produtos...</p>
    </StatusBox>
  );
}

function ProductsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StatusBox>
      <p className={styles.errorMessage}>{message}</p>
      <p className={styles.errorHint}>
        Verifique se o backend está rodando em http://localhost:3002
      </p>
      <button type="button" onClick={onRetry} className={styles.retryButton}>
        Tentar novamente
      </button>
    </StatusBox>
  );
}

export default function SeasonProductsSection({
  lineTitle,
  kitsTitle,
  lineBannerSrc,
  lineBannerAlt,
  kitsBannerSrc,
  kitsBannerAlt,
  seasonData,
  seasonId,
  onProductClick,
}: SeasonProductsSectionProps) {
  const { products, kits, loading, error, retry } = seasonData;

  if (loading) return <ProductsLoading />;
  if (error) return <ProductsError message={error} onRetry={retry} />;

  return (
    <>
      {products.length > 0 && (
        <ProductCarousel
          title={lineTitle}
          products={products}
          bannerSrc={lineBannerSrc}
          bannerAlt={lineBannerAlt}
          visibleCount={4}
          seasonId={seasonId}
          onProductClick={onProductClick}
        />
      )}

      {kits.length > 0 && (
        <ProductCarousel
          title={kitsTitle}
          products={kits}
          bannerSrc={kitsBannerSrc}
          bannerAlt={kitsBannerAlt}
          visibleCount={4}
          seasonId={seasonId}
          onProductClick={onProductClick}
          cardIndexOffset={products.length}
        />
      )}

      {products.length === 0 && kits.length === 0 && (
        <StatusBox>
          <p className={styles.emptyText}>Nenhum produto encontrado para esta estação.</p>
        </StatusBox>
      )}
    </>
  );
}