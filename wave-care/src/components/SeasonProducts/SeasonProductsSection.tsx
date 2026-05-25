"use client";

import type { ReactNode } from "react";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { ApiProduct } from "@/lib/api";
import type { CarouselProduct } from "@/lib/products";

/** Estado vindo do hook de serviço da estação (page.tsx importa o hook local) */
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
  /** Dados carregados pelo serviço da estação — passados pela page */
  seasonData: SeasonProductsData;
  /** Id da estação para hover/reveal dos cards */
  seasonId?: "verao" | "outono" | "inverno" | "primavera";
  onProductClick?: (productId: number) => void;
}

const statusStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "3rem 1.5rem",
  textAlign: "center",
};

function StatusBox({ children }: { children: ReactNode }) {
  return <div style={statusStyle}>{children}</div>;
}

function ProductsLoading() {
  return (
    <StatusBox>
      <Spinner />
      <p style={{ margin: 0, color: "#5a5550" }}>Carregando produtos...</p>
      <style>{`@keyframes season-spin { to { transform: rotate(360deg); } }`}</style>
    </StatusBox>
  );
}

function ProductsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StatusBox>
      <p style={{ margin: 0, color: "#dc3545", fontWeight: 500 }}>{message}</p>
      <p style={{ margin: 0, color: "#5a5550", fontSize: "0.9rem" }}>
        Verifique se o backend está rodando em http://localhost:3002
      </p>
      <button
        type="button"
        onClick={onRetry}
        style={{
          padding: "0.5rem 1.25rem",
          border: "none",
          borderRadius: 6,
          background: "#2d6a5a",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        Tentar novamente
      </button>
    </StatusBox>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #2d6a5a",
        borderRadius: "50%",
        animation: "season-spin 1s linear infinite",
      }}
    />
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
          visibleCount={3}
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
          visibleCount={3}
          seasonId={seasonId}
          onProductClick={onProductClick}
          cardIndexOffset={products.length}
        />
      )}

      {products.length === 0 && kits.length === 0 && (
        <StatusBox>
          <p style={{ margin: 0, color: "#5a5550" }}>Nenhum produto encontrado para esta estação.</p>
        </StatusBox>
      )}
    </>
  );
}
