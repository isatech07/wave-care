"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./ProductModal.module.css";

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

type TabKey = "description" | "howToUse" | "benefits";

const formatPrice = (price: number): string =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeImagePath = (path: string): string => {
  if (!path) return "/products/placeholder.jpg";
  let n = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!n.startsWith("/")) n = "/" + n;
  return n;
};

const HOW_TO_USE: Record<string, string> = {
  kit: "1. Shampoo: Aplique nos cabelos molhados, massageie e enxágue.\n2. Condicionador: Aplique nos comprimentos e pontas, deixe agir 3 min.\n3. Máscara: Use 1× por semana, deixe agir 5–10 min e enxágue.\n4. Finalize com leave-in ou óleo capilar.",
  default:
    "1. Aplique nos cabelos limpos e úmidos.\n2. Distribua uniformemente mecha por mecha.\n3. Deixe agir por 3–5 minutos.\n4. Enxágue abundantemente.\n5. Use diariamente para melhores resultados.",
};

const BENEFITS: Record<string, string> = {
  verao:
    "• Proteção contra raios UV\n• Hidratação leve e duradoura\n• Controle do frizz\n• Brilho intenso\n• Toque seco sem oleosidade",
  inverno:
    "• Hidratação profunda\n• Reparação de pontas\n• Proteção contra o frio\n• Nutrição intensa\n• Anti-frizz prolongado",
  outono:
    "• Nutrição equilibrada\n• Reposição de nutrientes\n• Maciez duradoura\n• Brilho saudável\n• Controle do volume",
  primavera:
    "• Leveza e frescor\n• Proteção contra umidade\n• Definição de cachos\n• Fragrância floral\n• Brilho natural",
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={styles.stars} aria-label={`${rating} de 5 estrelas`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span className={styles.starsEmpty}>{"☆".repeat(empty)}</span>
    </span>
  );
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductModalProps) {
  const [tab, setTab] = useState<TabKey>("description");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerClose = useCallback(() => {
    setClosing(true);
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 240);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setClosing(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, triggerClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (product?.id) {
      setImgError(false);
      setTab("description");
      setCep("");
      setShipping(null);
    }
  }, [product?.id]);

  const calcShipping = useCallback(() => {
    if (cep.length < 8) return;
    setCalculating(true);
    setTimeout(() => {
      setShipping(parseFloat((Math.random() * 30).toFixed(2)));
      setCalculating(false);
    }, 900);
  }, [cep]);

  if (!product || !isOpen) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const installment = product.price / 12;

  const stockStatus =
    product.stock === 0
      ? { label: "Esgotado", mod: styles.stockOut }
      : product.stock < 10
      ? { label: `Últimas ${product.stock} unidades`, mod: styles.stockLow }
      : { label: "Em estoque", mod: styles.stockIn };

  const imgSrc = imgError
    ? "/products/placeholder.jpg"
    : normalizeImagePath(product.image);

  const tabContent: Record<TabKey, string> = {
    description: product.description,
    howToUse: HOW_TO_USE[product.category] ?? HOW_TO_USE.default,
    benefits: BENEFITS[product.season] ?? BENEFITS.verao,
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Descrição" },
    { key: "howToUse", label: "Como usar" },
    { key: "benefits", label: "Benefícios" },
  ];

  return (
    <>
      <div
        className={`${styles.overlay} ${closing ? styles.overlayOut : ""}`}
        onClick={triggerClose}
        aria-hidden="true"
      />

      <div
        className={`${styles.modal} ${closing ? styles.modalOut : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div className={styles.header}>
          <button
            className={styles.closeBtn}
            onClick={triggerClose}
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                onError={() => setImgError(true)}
                unoptimized
                priority
              />
              {discount > 0 && (
                <span className={styles.discountPill}>−{discount}%</span>
              )}
              {product.badge && (
                <span className={styles.badgePill}>{product.badge}</span>
              )}
            </div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.infoTop}>
              <p className={styles.categoryTag}>
                {product.category === "kit" ? "Kit Completo" : "Produto Individual"}{" "}
                ·{" "}
                {product.season.charAt(0).toUpperCase() + product.season.slice(1)}
              </p>
              <h1 className={styles.title}>{product.name}</h1>
              <div className={styles.ratingRow}>
                <Stars rating={product.rating ?? 4.5} />
                <span className={styles.ratingNum}>
                  {(product.rating ?? 4.5).toFixed(1)}
                </span>
                <span className={styles.ratingCount}>
                  ({product.reviews ?? 0} avaliações)
                </span>
              </div>
            </div>

            <div className={styles.priceBlock}>
              {product.originalPrice && (
                <span className={styles.priceOld}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <div className={styles.priceRow}>
                <span className={styles.priceCurrent}>
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <span className={styles.discountTag}>{discount}% OFF</span>
                )}
              </div>
              <p className={styles.installment}>
                em até 12× de{" "}
                <strong>{formatPrice(installment)}</strong> sem juros
              </p>
            </div>

            <div className={styles.stockRow}>
              <span className={`${styles.stockDot} ${stockStatus.mod}`} />
              <span className={`${styles.stockLabel} ${stockStatus.mod}`}>
                {stockStatus.label}
              </span>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btnCart}
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {product.stock === 0 ? "Esgotado" : "Adicionar ao carrinho"}
              </button>
              <button
                className={`${styles.btnFav} ${isFavorite ? styles.btnFavActive : ""}`}
                onClick={() => onToggleFavorite(product.id)}
                aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar"}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className={styles.shippingBox}>
              <p className={styles.shippingTitle}>Calcular frete</p>
              <div className={styles.shippingRow}>
                <input
                  className={styles.cepField}
                  type="text"
                  inputMode="numeric"
                  placeholder="00000-000"
                  maxLength={8}
                  value={cep}
                  onChange={(e) =>
                    setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  onKeyDown={(e) => e.key === "Enter" && calcShipping()}
                />
                <button
                  className={styles.cepBtn}
                  onClick={calcShipping}
                  disabled={calculating || cep.length < 8}
                >
                  {calculating ? "…" : "Calcular"}
                </button>
              </div>
              {shipping !== null && (
                <p className={styles.shippingResult}>
                  {shipping === 0
                    ? "🎉 Frete Grátis!"
                    : `Frete: ${formatPrice(shipping)}`}
                </p>
              )}
            </div>
          </div>

          <div className={styles.detailsCol}>
            <div className={styles.tabs} role="tablist">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  className={`${styles.tabBtn} ${
                    tab === key ? styles.tabActive : ""
                  }`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.tabPanel} role="tabpanel">
              <pre className={styles.tabText}>{tabContent[tab]}</pre>
            </div>

            <dl className={styles.meta}>
              <div className={styles.metaRow}>
                <dt>Categoria</dt>
                <dd>
                  {product.category === "kit"
                    ? "Kit Completo"
                    : "Produto Individual"}
                </dd>
              </div>
              <div className={styles.metaRow}>
                <dt>Estação</dt>
                <dd>
                  {product.season.charAt(0).toUpperCase() +
                    product.season.slice(1)}
                </dd>
              </div>
              <div className={styles.metaRow}>
                <dt>Código</dt>
                <dd>#{String(product.id).padStart(5, "0")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}