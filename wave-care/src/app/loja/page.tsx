"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, Star, X, Plus, Minus, Check,
  Trash2, SlidersHorizontal, ChevronDown, Grid3X3,
  LayoutGrid, Sparkles, AlertCircle, RefreshCw, Search,
  Loader2,
} from "lucide-react";
import ProductModal from "@/components/ProductModal/ProductModal";
import { getProducts, type ApiProduct } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import "./loja.css";

type Product = ApiProduct & {
  stock: number;
  originalPrice?: number;
  badge?: string;
  featured?: boolean;
};

const SORT_OPTIONS = [
  { value: "relevantes",       label: "Mais relevantes"   },
  { value: "menor-preco",      label: "Menor preço"        },
  { value: "maior-preco",      label: "Maior preço"        },
  { value: "mais-vendidos",    label: "Mais vendidos"      },
  { value: "melhor-avaliados", label: "Melhor avaliados"   },
];

const formatPrice = (price: number): string =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeImagePath = (path: string): string => {
  if (!path) return "/products/placeholder.png";
  let n = path.trim().replace(/\s+/g, "").replace(/\/+/g, "/");
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!n.startsWith("/")) n = "/" + n;
  return n;
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
        <RefreshCw size={16} /> Tentar novamente
      </button>
    </div>
  );
}

export default function LojaPage() {
  const router = useRouter();

const {
    items, isOpen, closeCart, openCart,
    addItem, updateQuantity, removeItem,
    cartCount, cartTotal,
    createOrder, createOrderLoading,
    error: cartError,
  } = useCart();

  const [products,        setProducts]        = useState<Product[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [filtroEstacao,   setFiltroEstacao]   = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [ordenacao,       setOrdenacao]       = useState("relevantes");
  const [viewMode,        setViewMode]        = useState<"grid" | "compact">("grid");
  const [showFilters,     setShowFilters]     = useState(false);
  const [favorites,       setFavorites]       = useState<Set<number>>(new Set());
  const [notification,    setNotification]    = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [searchQuery,     setSearchQuery]     = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data.map((p) => ({ ...p, stock: p.stock ?? 0 })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtrosEstacao   = useMemo(() => ["Todos", ...[...new Set(products.map((p) => p.season))].sort()],   [products]);
  const filtrosCategoria = useMemo(() => ["Todos", ...[...new Set(products.map((p) => p.category))].sort()], [products]);

  const produtosFiltrados = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filtroEstacao   !== "Todos") result = result.filter((p) => p.season   === filtroEstacao);
    if (filtroCategoria !== "Todos") result = result.filter((p) => p.category === filtroCategoria);
    switch (ordenacao) {
      case "menor-preco":      result.sort((a, b) => a.price - b.price); break;
      case "maior-preco":      result.sort((a, b) => b.price - a.price); break;
      case "mais-vendidos":    result.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)); break;
      case "melhor-avaliados": result.sort((a, b) => (b.rating  ?? 0) - (a.rating  ?? 0)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return result;
  }, [products, searchQuery, filtroEstacao, filtroCategoria, ordenacao]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) { next.delete(productId); showNotification("Removido dos favoritos"); }
      else                     { next.add(productId);    showNotification("Adicionado aos favoritos"); }
      return next;
    });
  }, [showNotification]);

  const addToCart = useCallback((product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    showNotification(`${product.name} adicionado à sacola`);
  }, [addItem, showNotification]);

const handleCheckout = useCallback(async () => {
    try {
      const order = await createOrder();
      sessionStorage.setItem("wc_checkout_items", JSON.stringify(items));
      sessionStorage.setItem("wc_pending_order_id", String(order.id));
      closeCart();
      router.push("/checkout");
    } catch {
      // erro já em cartError do contexto
    }
  }, [createOrder, items, closeCart, router]);

  const clearFilters     = useCallback(() => { setFiltroEstacao("Todos"); setFiltroCategoria("Todos"); setOrdenacao("relevantes"); setSearchQuery(""); }, []);
  const openProductModal = useCallback((product: Product) => { setSelectedProduct(product); setIsModalOpen(true);  }, []);
  const closeModal       = useCallback(()                  => { setIsModalOpen(false);       setSelectedProduct(null); }, []);

  const hasActiveFilters = filtroEstacao !== "Todos" || filtroCategoria !== "Todos" || searchQuery.trim() !== "";

  return (
    <main className="loja-main">
      <AnimatePresence>
        {notification && (
          <motion.div className="loja-notification"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y:   0, x: "-50%" }}
            exit={{    opacity: 0, y: -20, x: "-50%" }}
          >
            <Check size={16} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão flutuante */}
      <button className="loja-floating-cart" onClick={openCart} aria-label="Abrir sacola">
        <ShoppingBag size={22} />
        {cartCount > 0 && <span className="loja-cart-badge">{cartCount}</span>}
      </button>

      {/* Sacola lateral */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="loja-cart-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside className="loja-cart-sidebar"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="loja-cart-header">
                <h2>Sua Sacola</h2>
                <button className="loja-cart-close" onClick={closeCart} aria-label="Fechar sacola">
                  <X size={20} />
                </button>
              </div>

              <div className="loja-cart-content">
                {items.length === 0 ? (
                  <div className="loja-cart-empty">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p>Sua sacola está vazia</p>
                    <span>Adicione produtos para continuar</span>
                  </div>
                ) : (
                  <ul className="loja-cart-items">
                    {items.map((item) => (
                      <motion.li key={item.id} className="loja-cart-item" layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="loja-cart-item-image">
                          <img
                            src={normalizeImagePath(item.image)}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { (e.target as HTMLImageElement).src = "/products/placeholder.png"; }}
                          />
                        </div>
                        <div className="loja-cart-item-details">
                          <h4>{item.name}</h4>
                          <span className="loja-cart-item-price">{formatPrice(item.price)}</span>
                          <div className="loja-cart-item-quantity">
                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuir"><Minus size={14} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id,  1)} aria-label="Aumentar"><Plus  size={14} /></button>
                          </div>
                        </div>
                        <button className="loja-cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remover">
                          <Trash2 size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="loja-cart-footer">
                  <div className="loja-cart-total">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  {cartError && (
                    <p style={{ color: "#dc3545", fontSize: "0.82rem", textAlign: "center", margin: "0 0 0.5rem" }}>
                      {cartError}
                    </p>
                  )}
                  <button
                    className="loja-cart-checkout"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </button>
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

      {/* Hero */}
      <section className="loja-hero">
        <motion.span className="loja-hero-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Nova coleção</motion.span>
        <motion.h1 className="loja-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Cuide do seu cabelo<br />em cada estação</motion.h1>
        <motion.p className="loja-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Produtos formulados para as necessidades reais de cada clima do verão intenso ao inverno seco.</motion.p>
      </section>

      {/* Filtros + Grid */}
      <section className="loja-content">
        <button className="loja-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={18} /> Filtros
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
              <button key={f} className={`filtro-btn ${f === filtroEstacao ? "filtro-btn--active" : ""}`} onClick={() => setFiltroEstacao(f)}>
                {f}
                {f !== "Todos" && <span className="filtro-count">{products.filter((p) => p.season === f).length}</span>}
              </button>
            ))}
          </div>
          <div className="loja-filtros-group">
            <p className="filtros-label">Categoria</p>
            {filtrosCategoria.map((f) => (
              <button key={f} className={`filtro-btn ${f === filtroCategoria ? "filtro-btn--active" : ""}`} onClick={() => setFiltroCategoria(f)}>
                {f}
              </button>
            ))}
          </div>
        </aside>

        <div className="loja-produtos">
          <div className="loja-top-bar">
            <div className="loja-top-left">
              {loading ? <div className="skeleton skeleton--count" /> : (
                <span className="loja-count">{produtosFiltrados.length} {produtosFiltrados.length === 1 ? "produto" : "produtos"}</span>
              )}
              {hasActiveFilters && (
                <div className="loja-active-filters">
                  {filtroEstacao   !== "Todos" && <span className="active-filter-tag">{filtroEstacao}   <button onClick={() => setFiltroEstacao("Todos")}><X size={12} /></button></span>}
                  {filtroCategoria !== "Todos" && <span className="active-filter-tag">{filtroCategoria} <button onClick={() => setFiltroCategoria("Todos")}><X size={12} /></button></span>}
                </div>
              )}
            </div>
            <div className="loja-top-right">
              <div className="loja-sort-wrapper" style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12, paddingRight: 12 }}>
                <Search size={18} style={{ color: "var(--loja-text-muted)", flexShrink: 0 }} />
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou categoria..." aria-label="Buscar produtos" className="loja-sort"
                  style={{ border: "none", minWidth: 200, paddingLeft: 0, paddingRight: 0, background: "transparent" }}
                />
              </div>
              <div className="loja-view-toggle">
                <button className={viewMode === "grid"    ? "active" : ""} onClick={() => setViewMode("grid")}    aria-label="Grade"><LayoutGrid size={18} /></button>
                <button className={viewMode === "compact" ? "active" : ""} onClick={() => setViewMode("compact")} aria-label="Compacto"><Grid3X3 size={18} /></button>
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
              <p>{products.length === 0 ? "Ainda não há produtos cadastrados." : "Tente ajustar os filtros."}</p>
              {hasActiveFilters && <button className="loja-empty-btn" onClick={clearFilters}>Limpar filtros</button>}
            </div>
          )}
          {!loading && !error && produtosFiltrados.length > 0 && (
            <motion.div className={`produtos-grid ${viewMode === "compact" ? "produtos-grid--compact" : ""}`} layout>
              <AnimatePresence mode="popLayout">
                {produtosFiltrados.map((product, index) => (
                  <motion.article key={product.id} className="produto-card" layout
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => openProductModal(product)} style={{ cursor: "pointer" }}
                  >
                    {product.badge && (
                      <span className={`produto-card-badge produto-card-badge--${product.badge.toLowerCase().replace(/\s+/g, "-")}`}>
                        {product.badge}
                      </span>
                    )}
                    <button className={`produto-card-favorite ${favorites.has(product.id) ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                      aria-label={favorites.has(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Heart size={18} fill={favorites.has(product.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="produto-card-img">
                      <img src={normalizeImagePath(product.image)} alt={product.name} className="produto-image"
                        style={{ width: "100%", height: "auto", aspectRatio: "1/1", objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/products/placeholder.png"; }}
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
                        <button className="produto-card-btn"
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
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