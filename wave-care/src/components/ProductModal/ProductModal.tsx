"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ProductModal.module.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  category: string;
  season: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  featured?: boolean;
  createdAt: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Remove acentos, espaços e barras duplicadas do caminho da imagem
 * para garantir que o path no banco bata com o arquivo físico em /public.
 */
const normalizeImagePath = (path: string): string => {
  if (!path) return "/products/placeholder.jpg";
  let normalized = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!normalized.startsWith("/")) normalized = "/" + normalized;
  return normalized;
};

const renderStars = (rating: number = 0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.stars}>
      <span className={styles.starFilled}>{"★".repeat(fullStars)}</span>
      {hasHalfStar && <span className={styles.starHalf}>½</span>}
      <span className={styles.starEmpty}>{"☆".repeat(emptyStars)}</span>
      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    </div>
  );
};

// ─── Conteúdos dinâmicos ──────────────────────────────────────────────────────

const getHowToUse = (category: string): string => {
  if (category === "kit") {
    return `1. Shampoo: Aplique nos cabelos molhados, massageie e enxágue.\n2. Condicionador: Aplique nos comprimentos e pontas, deixe agir 3 minutos e enxágue.\n3. Máscara: Aplique 1x por semana, deixe agir 5–10 minutos.\n4. Finalize com leave-in ou óleo para melhores resultados.`;
  }
  return `1. Aplique nos cabelos limpos e úmidos.\n2. Distribua uniformemente mecha por mecha.\n3. Deixe agir por 3–5 minutos.\n4. Enxágue abundantemente.\n5. Use diariamente para melhores resultados.`;
};

const getBenefits = (season: string): string => {
  const map: Record<string, string> = {
    verao:
      "• Proteção contra raios UV\n• Hidratação leve\n• Controle do frizz\n• Brilho intenso\n• Toque seco sem oleosidade",
    inverno:
      "• Hidratação profunda\n• Reparação de pontas\n• Proteção contra frio\n• Nutrição intensa\n• Anti-frizz prolongado",
    outono:
      "• Nutrição equilibrada\n• Reposição de nutrientes\n• Maciez duradoura\n• Brilho saudável\n• Controle do volume",
    primavera:
      "• Leveza e frescor\n• Proteção contra umidade\n• Definição de cachos\n• Fragrância floral\n• Brilho natural",
  };
  return map[season] ?? map.verao;
};

const getStockInfo = (
  stock: number,
  styles: Record<string, string>
): { text: string; className: string } => {
  if (stock === 0) return { text: "Esgotado", className: styles.outOfStock };
  if (stock < 10) return { text: `Últimas ${stock} unidades!`, className: styles.lowStock };
  return { text: "Em estoque", className: styles.inStock };
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<"description" | "howToUse" | "benefits">(
    "description"
  );
  const [cep, setCep] = useState("");
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloqueia scroll do body quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reseta estado de erro de imagem ao trocar de produto
  useEffect(() => {
    setImgError(false);
    setActiveTab("description");
    setCep("");
    setShippingPrice(null);
  }, [product?.id]);

  if (!product || !isOpen) return null;

  const maxInstallments = 12;
  const installmentValue = product.price / maxInstallments;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stockInfo = getStockInfo(product.stock, styles);
  const imageSrc = imgError
    ? "/products/placeholder.jpg"
    : normalizeImagePath(product.image);

  const calculateShipping = () => {
    if (!cep || cep.length < 8) return;
    setCalculating(true);
    setTimeout(() => {
      setShippingPrice(parseFloat((Math.random() * 30).toFixed(2)));
      setCalculating(false);
    }, 1000);
  };

  const seasonLabel =
    product.season.charAt(0).toUpperCase() + product.season.slice(1);

  const categoryLabel =
    product.category === "produto" ? "Produto Individual" : "Kit Completo";

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <div className={styles.modalContent}>

          {/* ── Coluna da imagem ── */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImage}>
              <Image
                src={imageSrc}
                alt={product.name}
                width={400}
                height={400}
                style={{ objectFit: "cover" }}
                onError={() => setImgError(true)}
                unoptimized
              />
            </div>

            {discount > 0 && (
              <div className={styles.discountBadge}>-{discount}%</div>
            )}
            {product.badge && (
              <div className={styles.badge}>{product.badge}</div>
            )}
          </div>

          {/* ── Coluna de informações ── */}
          <div className={styles.infoColumn}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              {renderStars(product.rating ?? 4.5)}
              <span className={styles.reviews}>
                ({product.reviews ?? 0} avaliações)
              </span>
            </div>

            <div className={styles.priceSection}>
              {product.originalPrice && (
                <span className={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className={styles.currentPrice}>
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <span className={styles.discountPercent}>{discount}% OFF</span>
              )}
            </div>

            <div className={styles.installments}>
              em até {maxInstallments}x de {formatPrice(installmentValue)} sem juros
            </div>

            <div className={styles.stock}>
              <span className={stockInfo.className}>✓ {stockInfo.text}</span>
            </div>

            <p className={styles.shortDescription}>{product.description}</p>

            <div className={styles.actions}>
              <button
                className={styles.addToCartBtn}
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
              >
                🛒 {product.stock === 0 ? "Esgotado" : "Adicionar ao carrinho"}
              </button>
              <button
                className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
                onClick={() => onToggleFavorite(product.id)}
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorite ? "❤️" : "♡"} Favoritar
              </button>
            </div>

            {/* Calcular frete */}
            <div className={styles.shipping}>
              <h4>Calcular frete</h4>
              <div className={styles.cepInput}>
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) =>
                    setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  maxLength={8}
                  inputMode="numeric"
                />
                <button
                  onClick={calculateShipping}
                  disabled={calculating || cep.length < 8}
                >
                  {calculating ? "Calculando..." : "OK"}
                </button>
              </div>
              {shippingPrice !== null && (
                <div className={styles.shippingResult}>
                  {shippingPrice === 0 ? (
                    <span>🎉 Frete Grátis!</span>
                  ) : (
                    <span>Frete: {formatPrice(shippingPrice)}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Coluna de detalhes ── */}
          <div className={styles.detailsColumn}>
            <div className={styles.tabs} role="tablist">
              {(
                [
                  { key: "description", label: "Descrição" },
                  { key: "howToUse", label: "Como usar" },
                  { key: "benefits", label: "Benefícios" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  className={`${styles.tabBtn} ${activeTab === key ? styles.active : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.tabContent} role="tabpanel">
              {activeTab === "description" && (
                <p>{product.description}</p>
              )}
              {activeTab === "howToUse" && (
                <pre className={styles.pre}>{getHowToUse(product.category)}</pre>
              )}
              {activeTab === "benefits" && (
                <pre className={styles.pre}>{getBenefits(product.season)}</pre>
              )}
            </div>

            <div className={styles.productMeta}>
              <p><strong>Categoria:</strong> {categoryLabel}</p>
              <p><strong>Estação:</strong> {seasonLabel}</p>
              <p><strong>Código:</strong> #{product.id}</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}