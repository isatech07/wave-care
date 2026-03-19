"use client";

import { useState } from "react";
import styles from "./ProductCarousel.module.css";

// ── Tipagens ──────────────────────────────────────
interface Product {
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
}

// ── Componente ────────────────────────────────────
export default function ProductCarousel({
  title,
  products = [],
  bannerSrc,
  bannerAlt = "Banner",
  visibleCount = 3,
  className = "",
}: ProductCarouselProps) {
  const [index, setIndex] = useState<number>(0);
  const maxIndex = Math.max(0, products.length - visibleCount);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const visibleProducts = products.slice(index, index + visibleCount);

  return (
    <div className={`${styles.carouselWrapper} ${className}`}>

      {/* Banner lateral esquerdo */}
      <div className={styles.carouselBanner}>
        {bannerSrc ? (
          <img src={bannerSrc} alt={bannerAlt} />
        ) : (
          <div className={styles.bannerPlaceholder}>
            <span className={styles.bannerIcon}>🌸</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={styles.carouselContent}>

        {/* Título centralizado */}
        <div className={styles.carouselHeader}>
          <span className={styles.carouselTitle}>{title}</span>
        </div>

        {/* Setas + Cards */}
        <div className={styles.carouselRow}>

          <button
            onClick={prev}
            disabled={index === 0}
            className={styles.arrowBtn}
            aria-label="Anterior"
          >←</button>

          {/* Cards */}
          <div className={styles.carouselCards}>
            {visibleProducts.map((product: Product, i: number) => (
              <div key={`${index}-${i}`} className={styles.carouselCard}>

                <div className={styles.cardImage}>
                  {product.img ? (
                    <img src={product.img} alt={product.name} />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
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
                        {product.includes.map((item: string, j: number) => (
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
                      {product.size && (
                        <span className={styles.cardSize}>{product.size}</span>
                      )}
                    </div>
                    <button className={styles.addButton}>Adicionar</button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={index >= maxIndex}
            className={styles.arrowBtn}
            aria-label="Próximo"
          >→</button>

        </div>

        {/* Bolinhas */}
        {products.length > visibleCount && (
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_: unknown, i: number) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                aria-label={`Ir para o item ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}