
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  X,
  Plus,
  Minus,
  Check,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ProductModal from "@/components/ProductModal/ProductModal";
import "./loja.css";

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

interface CartItem extends Product {
  quantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

const SORT_OPTIONS = [
  { value: "relevantes", label: "Mais relevantes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "melhor-avaliados", label: "Melhor avaliados" },
];

const formatPrice = (price: number): string =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeImagePath = (path: string): string => {
  if (!path) return "/products/placeholder.png";
  let normalized = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!normalized.startsWith("/")) normalized = "/" + normalized;
  return normalized;
};

function SkeletonCard() {
  return (
    <div className="produto-card produto-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="produto-card-info">
        <div className="skeleton skeleton--meta" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
        <div className="skeleton skeleton--footer" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="loja-error">
      <AlertCircle size={48} strokeWidth={1} />
      <h3>Ops! Algo deu errado</h3>
      <p>{message}</p>
      <button className="loja-error-btn" onClick={onRetry}>
        <RefreshCw size={16} />
        Tentar novamente
      </button>
    </div>
  );
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstacao, setFiltroEstacao] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("relevantes");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/products`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtrosEstacao = useMemo(() => {
    const seasons = [...new Set(products.map((p) => p.season))].sort();
    return ["Todos", ...seasons];
  }, [products]);

  const filtrosCategoria = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))].sort();
    return ["Todos", ...cats];
  }, [products]);

  const produtosFiltrados = useMemo(() => {
    let result = [...products];
    if (filtroEstacao !== "Todos") result = result.filter((p) => p.season === filtroEstacao);
    if (filtroCategoria !== "Todos") result = result.filter((p) => p.category === filtroCategoria);
    switch (ordenacao) {
      case "menor-preco": result.sort((a, b) => a.price - b.price); break;
      case "maior-preco": result.sort((a, b) => b.price - a.price); break;
      case "mais-vendidos": result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)); break;
      case "melhor-avaliados": result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [products, filtroEstacao, filtroCategoria, ordenacao]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    const t = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(t);
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showNotification("Removido dos favoritos");
      } else {
        next.add(productId);
        showNotification("Adicionado aos favoritos");
      }
      return next;
    });
  }, [showNotification]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`${product.name} adicionado à sacola`);
  }, [showNotification]);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const qty = item.quantity + delta;
          return qty > 0 ? { ...item, quantity: qty } : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
    showNotification("Item removido da sacola");
  }, [showNotification]);

  const clearFilters = useCallback(() => {
    setFiltroEstacao("Todos");
    setFiltroCategoria("Todos");
    setOrdenacao("relevantes");
  }, []);

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const hasActiveFilters = filtroEstacao !== "Todos" || filtroCategoria !== "Todos";

  return (
    <main className="loja-main">
      <AnimatePresence>
        {notification && (
          <motion.div
            className="loja-notification"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
          >
            <Check size={16} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="loja-floating-cart" onClick={() => setIsCartOpen(true)} aria-label="Abrir sacola">
        <ShoppingBag size={22} />
        {cartItemsCount > 0 && <span className="loja-cart-badge">{cartItemsCount}</span>}
      </button>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="loja-cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              className="loja-cart-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="loja-cart-header">
                <h2>Sua Sacola</h2>
                <button className="loja-cart-close" onClick={() => setIsCartOpen(false)} aria-label="Fechar sacola">
                  <X size={20} />
                </button>
              </div>
              <div className="loja-cart-content">
                {cart.length === 0 ? (
                  <div className="loja-cart-empty">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p>Sua sacola está vazia</p>
                    <span>Adicione produtos para continuar</span>
                  </div>
                ) : (
                  <ul className="loja-cart-items">
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        className="loja-cart-item"
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="loja-cart-item-image">
                          <img
                            src={normalizeImagePath(item.image)}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/products/placeholder.png";
                            }}
                          />
                        </div>
                        <div className="loja-cart-item-details">
                          <h4>{item.name}</h4>
                          <span className="loja-cart-item-price">{formatPrice(item.price)}</span>
                          <div className="loja-cart-item-quantity">
                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuir quantidade">
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} aria-label="Aumentar quantidade">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button className="loja-cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Remover item">
                          <Trash2 size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              {cart.length > 0 && (
                <div className="loja-cart-footer">
                  <div className="loja-cart-total">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <button className="loja-cart-checkout">Finalizar Compra</button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
      />

      <section className="loja-hero">
        <motion.span className="loja-hero-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          Nova coleção
        </motion.span>
        <motion.h1 className="loja-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Cuide do seu cabelo<br />em cada estação
        </motion.h1>
        <motion.p className="loja-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Produtos formulados para as necessidades reais de cada clima do verão intenso ao inverno seco.
        </motion.p>
      </section>

      <section className="loja-content">
        <button className="loja-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} />
          Filtros
          {hasActiveFilters && <span className="filter-active-dot" />}
        </button>

        <aside className={`loja-filtros ${showFilters ? "loja-filtros--open" : ""}`}>
          <div className="loja-filtros-header">
            <h3>Filtros</h3>
            {hasActiveFilters && <button className="loja-filtros-clear" onClick={clearFilters}>Limpar</button>}
          </div>
          <div className="loja-filtros-group">
            <p className="filtros-label">Estação</p>
            {filtrosEstacao.map((f) => (
              <button
                key={f}
                className={`filtro-btn ${f === filtroEstacao ? "filtro-btn--active" : ""}`}
                onClick={() => setFiltroEstacao(f)}
              >
                {f}
                {f !== "Todos" && <span className="filtro-count">{products.filter((p) => p.season === f).length}</span>}
              </button>
            ))}
          </div>
          <div className="loja-filtros-group">
            <p className="filtros-label">Categoria</p>
            {filtrosCategoria.map((f) => (
              <button
                key={f}
                className={`filtro-btn ${f === filtroCategoria ? "filtro-btn--active" : ""}`}
                onClick={() => setFiltroCategoria(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </aside>

        <div className="loja-produtos">
          <div className="loja-top-bar">
            <div className="loja-top-left">
              {loading ? (
                <div className="skeleton skeleton--count" />
              ) : (
                <span className="loja-count">
                  {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "produto" : "produtos"}
                </span>
              )}
              {hasActiveFilters && (
                <div className="loja-active-filters">
                  {filtroEstacao !== "Todos" && (
                    <span className="active-filter-tag">
                      {filtroEstacao}
                      <button onClick={() => setFiltroEstacao("Todos")}><X size={12} /></button>
                    </span>
                  )}
                  {filtroCategoria !== "Todos" && (
                    <span className="active-filter-tag">
                      {filtroCategoria}
                      <button onClick={() => setFiltroCategoria("Todos")}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="loja-top-right">
              <div className="loja-view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Visualização em grade">
                  <LayoutGrid size={18} />
                </button>
                <button className={viewMode === "compact" ? "active" : ""} onClick={() => setViewMode("compact")} aria-label="Visualização compacta">
                  <Grid3X3 size={18} />
                </button>
              </div>
              <div className="loja-sort-wrapper">
                <select className="loja-sort" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                  {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown size={16} className="loja-sort-icon" />
              </div>
            </div>
          </div>

          {loading && (
            <div className={`produtos-grid ${viewMode === "compact" ? "produtos-grid--compact" : ""}`}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && error && <ErrorState message={error} onRetry={fetchProducts} />}

          {!loading && !error && produtosFiltrados.length === 0 && (
            <div className="loja-empty">
              <Sparkles size={48} strokeWidth={1} />
              <h3>Nenhum produto encontrado</h3>
              <p>{products.length === 0 ? "Ainda não há produtos cadastrados." : "Tente ajustar os filtros para encontrar o que procura."}</p>
              {hasActiveFilters && <button className="loja-empty-btn" onClick={clearFilters}>Limpar filtros</button>}
            </div>
          )}

          {!loading && !error && produtosFiltrados.length > 0 && (
            <motion.div className={`produtos-grid ${viewMode === "compact" ? "produtos-grid--compact" : ""}`} layout>
              <AnimatePresence mode="popLayout">
                {produtosFiltrados.map((product, index) => (
                  <motion.article
                    key={product.id}
                    className="produto-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => openProductModal(product)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.badge && (
                      <span className={`produto-card-badge produto-card-badge--${product.badge.toLowerCase().replace(/\s+/g, "-")}`}>
                        {product.badge}
                      </span>
                    )}
                    <button
                      className={`produto-card-favorite ${favorites.has(product.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      aria-label={favorites.has(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Heart size={18} fill={favorites.has(product.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="produto-card-img">
                      <img
                        src={normalizeImagePath(product.image)}
                        alt={product.name}
                        className="produto-image"
                        style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/products/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="produto-card-info">
                      <div className="produto-card-meta">
                        <span className="produto-card-cat">{product.category}</span>
                        <span className="produto-card-estacao">{product.season}</span>
                      </div>
                      <h3 className="produto-card-nome">{product.name}</h3>
                      {viewMode === "grid" && <p className="produto-card-descricao">{product.description}</p>}
                      {product.rating != null && (
                        <div className="produto-card-rating">
                          <Star size={14} fill="currentColor" />
                          <span>{product.rating.toFixed(1)}</span>
                          {product.reviews != null && <span className="produto-card-reviews">({product.reviews})</span>}
                        </div>
                      )}
                      <div className="produto-card-footer">
                        <div className="produto-card-preco">
                          <span className="preco-atual">{formatPrice(product.price)}</span>
                          {product.originalPrice && <span className="preco-original">{formatPrice(product.originalPrice)}</span>}
                        </div>
                        <button
                          className="produto-card-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                        >
                          <ShoppingBag size={16} />
                          <span>{product.stock === 0 ? "Esgotado" : "Adicionar"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
