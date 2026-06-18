"use client";

import { useState } from "react";
import SeasonCard from "@/components/seasonal/SeasonCard";
import styles from "./ProductCarousel.module.css";

const normalizeImagePath = (path?: string): string => {
  if (!path) return "/products/placeholder.svg";
  let normalized = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!normalized.startsWith("/")) normalized = "/" + normalized;
  return normalized;
};

interface Product {
  id?: number;
  name: string;
  desc: string;
  price: string;
  size?: string;
  rating: number;
  reviews: number;
  img?: string;
  includes?: string[];
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
  bannerSrc?: string;
  bannerAlt?: string;
  visibleCount?: number;
  className?: string;
  seasonId?: "verao" | "outono" | "inverno" | "primavera";
  onProductClick?: (productId: number) => void;  
  onAddToCart?: (productId: number) => void;     
  cardIndexOffset?: number;
}

export default function ProductCarousel({
  title,
  products = [],
  bannerSrc,
  bannerAlt = "Banner",
  visibleCount = 4,
  className = "",
  seasonId,
  onProductClick,
  onAddToCart,   
  cardIndexOffset = 0,
}: ProductCarouselProps) {
  const [index, setIndex] = useState<number>(0);
  const maxIndex = Math.max(0, products.length - visibleCount);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const visibleProducts = products.slice(index, index + visibleCount);

  return (
    <div className={`${styles.carouselWrapper} ${className}`}>

      <div className={styles.carouselHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.carouselEyebrow}>Descubra</span>
          <h2 className={styles.carouselTitle}>{title}</h2>
        </div>
        {products.length > visibleCount && (
          <div className={styles.headerNav}>
            <button onClick={prev} disabled={index === 0} className={styles.arrowBtn} aria-label="Anterior">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={next} disabled={index >= maxIndex} className={styles.arrowBtn} aria-label="Próximo">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {bannerSrc ? (
        <div className={styles.carouselBanner}>
          <img
            src={normalizeImagePath(bannerSrc)}
            alt={bannerAlt}
            onError={(e) => { (e.target as HTMLImageElement).src = "/products/placeholder.svg"; }}
          />
          <div className={styles.bannerOverlay} />
          <span className={styles.bannerLabel}>{title}</span>
        </div>
      ) : (
        <div className={styles.carouselBanner}>
          <div className={styles.bannerPlaceholder}>
            <span className={styles.bannerIcon}>🌸</span>
          </div>
        </div>
      )}

      <div className={styles.carouselCards}>
        {visibleProducts.map((product, i) => {
          const cardInner = (
            <div
              className={styles.carouselCard}
              role={onProductClick && product.id ? "button" : undefined}
              tabIndex={onProductClick && product.id ? 0 : undefined}
              onClick={() => product.id && onProductClick?.(product.id)}
              onKeyDown={(e) => {
                if (product.id && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onProductClick?.(product.id);
                }
              }}
            >
              <div className={styles.cardImage}>
                <img
                  src={normalizeImagePath(product.img)}
                  alt={product.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/products/placeholder.svg"; }}
                />
                <div className={styles.cardImageOverlay} />
                <div className={styles.cardBadge}>
                  <span className={styles.badgeStar}>★</span>
                  {product.rating}
                  <span style={{ opacity: 0.5, fontWeight: 400 }}>({product.reviews})</span>
                </div>
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.productRating}>
                  <span className={styles.ratingStar}>★</span>
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>({product.reviews})</span>
                </div>
                <h3 className={styles.cardName}>{product.name}</h3>
                <div className={styles.cardBody}>
                  <p className={styles.cardDesc}>{product.desc}</p>
                  {product.includes && product.includes.length > 0 && (
                    <ul className={styles.kitList}>
                      {product.includes.map((item, j) => (
                        <li key={j} className={styles.kitItem}>
                          <span className={styles.kitDot}>·</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPriceBlock}>
                    <span className={styles.cardPrice}>{product.price}</span>
                    {product.size && <span className={styles.cardSize}>{product.size}</span>}
                  </div>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!product.id) return;
                      if (onAddToCart) onAddToCart(product.id);
                      else onProductClick?.(product.id);
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          );

          const cardKey = `${index}-${i}-${product.id ?? product.name}`;

          if (seasonId) {
            return (
              <SeasonCard key={cardKey} seasonId={seasonId} index={cardIndexOffset + index + i} className={styles.carouselCardWrap}>
                {cardInner}
              </SeasonCard>
            );
          }

          return <div key={cardKey}>{cardInner}</div>;
        })}
      </div>

      {products.length > visibleCount && (
        <div className={styles.dots}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              aria-label={`Ir para o item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}