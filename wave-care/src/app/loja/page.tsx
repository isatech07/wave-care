"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";

import "./loja.css";

// Types
interface Product {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  estacao: string;
  preco: number;
  precoOriginal?: number;
  rating: number;
  reviews: number;
  image: string;
  destaque: boolean;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Data
const produtos: Product[] = [
  // Primavera - Produtos
  {
    id: "primavera-1",
    nome: "Primavera Bloom Shampoo",
    descricao: "Shampoo nutritivo que proporciona nutrição e brilho intensos para cabelos ondulados e cacheados. Formulado com ingredientes que respeitam a curvatura natural dos fios.",
    categoria: "Shampoo",
    estacao: "Primavera",
    preco: 49.90,
    rating: 4.8,
    reviews: 245,
    image: "/products/primavera-produtos/primavera-shampoo.png",
    destaque: true,
    badge: "Mais Vendido",
  },
  {
    id: "primavera-2",
    nome: "Primavera Bloom Conditioner",
    descricao: "Condicionador desembaraçador que oferece brilho intenso e maciez. Perfeito para cabelos ondulados e cacheados que precisam de hidratação diária.",
    categoria: "Condicionador",
    estacao: "Primavera",
    preco: 49.90,
    rating: 4.7,
    reviews: 189,
    image: "/products/primavera-produtos/primavera-condicionador.png",
    destaque: false,
  },
  {
    id: "primavera-3",
    nome: "Primavera Bloom Hair Mask",
    descricao: "Máscara capilar de alta performance com tratamento intensivo para reparação e brilho. Ideal para restaurar a saúde dos fios danificados.",
    categoria: "Tratamento",
    estacao: "Primavera",
    preco: 79.90,
    precoOriginal: 99.90,
    rating: 4.9,
    reviews: 312,
    image: "/products/primavera-produtos/primavera-mascara.png",
    destaque: true,
    badge: "Promoção",
  },
  {
    id: "primavera-4",
    nome: "Primavera Bloom Leave-In Cream",
    descricao: "Creme de leave-in de alta performance que oferece tratamento intensivo sem enxágue. Proporciona hidratação prolongada e definição dos fios.",
    categoria: "Finalização",
    estacao: "Primavera",
    preco: 67.90,
    rating: 4.8,
    reviews: 203,
    image: "/products/primavera-produtos/primavera-creme.png",
    destaque: false,
  },
  {
    id: "primavera-5",
    nome: "Primavera Bloom Styling Gelatin",
    descricao: "Gelatina modeladora que oferece definição e hidratação para cabelos ondulados e cacheados. Fixação perfeita sem deixar os fios duros.",
    categoria: "Finalização",
    estacao: "Primavera",
    preco: 54.90,
    rating: 4.6,
    reviews: 156,
    image: "/products/primavera-produtos/primavera-gelatina.png",
    destaque: false,
  },
  {
    id: "primavera-6",
    nome: "Primavera Bloom Hair Oil",
    descricao: "Óleo capilar que proporciona hidratação profunda e proteção para cabelos ondulados e cacheados. Deixa os fios com brilho intenso e sedosos.",
    categoria: "Nutrição",
    estacao: "Primavera",
    preco: 89.90,
    rating: 4.7,
    reviews: 178,
    image: "/products/primavera-produtos/primavera-oleo.png",
    destaque: true,
    badge: "Novo",
  },
  {
    id: "primavera-7",
    nome: "Kit Primavera Bloom Completo",
    descricao: "Kit completo com Shampoo, Condicionador, Hair Mask, Leave-In Cream e Styling Gelatin. Tudo que você precisa para cuidar dos seus cabelos ondulados e cacheados.",
    categoria: "Kits",
    estacao: "Primavera",
    preco: 289.90,
    precoOriginal: 349.90,
    rating: 4.9,
    reviews: 423,
    image: "/products/primavera-produtos/primavera-kit-completo.png",
    destaque: true,
    badge: "Economia",
  },

  // Outono - Produtos
  {
    id: "outono-1",
    nome: "Autumn Bloom Shampoo",
    descricao: "Shampoo desembaraçador que oferece brilho intenso para cabelos ondulados e cacheados. Limpeza suave que respeita a curvatura natural dos fios.",
    categoria: "Shampoo",
    estacao: "Outono",
    preco: 52.90,
    rating: 4.7,
    reviews: 167,
    image: "/products/outono-produtos/outono-shampoo.png",
    destaque: false,
  },
  {
    id: "outono-2",
    nome: "Autumn Bloom Conditioner",
    descricao: "Condicionador com fórmula desembaraçadora e brilho intenso. Perfeito para manter os cabelos macios e hidratados durante o outono.",
    categoria: "Condicionador",
    estacao: "Outono",
    preco: 52.90,
    rating: 4.6,
    reviews: 143,
    image: "/products/outono-produtos/outono-condicionador.png",
    destaque: false,
  },
  {
    id: "outono-3",
    nome: "Autumn Bloom Hair Mask",
    descricao: "Máscara capilar com collagen e essence de alta performance. Proporciona reparação intensa e brilho duradouro para cabelos danificados.",
    categoria: "Tratamento",
    estacao: "Outono",
    preco: 84.90,
    rating: 4.8,
    reviews: 198,
    image: "/products/outono-produtos/outono-mascara.png",
    destaque: true,
    badge: "Mais Vendido",
  },
  {
    id: "outono-4",
    nome: "Autumn Bloom Leave-in Cream",
    descricao: "Creme de leave-in que oferece desembaraço e brilho intenso. Tratamento sem enxágue ideal para finalização diária dos cabelos.",
    categoria: "Finalização",
    estacao: "Outono",
    preco: 69.90,
    rating: 4.7,
    reviews: 182,
    image: "/products/outono-produtos/outono-creme.png",
    destaque: false,
  },
  {
    id: "outono-5",
    nome: "Autumn Bloom Styling Gelatin",
    descricao: "Gelatina modeladora com regeneração e fortalecimento. Perfeita para definição segura dos cachos com fixação duradoura.",
    categoria: "Finalização",
    estacao: "Outono",
    preco: 59.90,
    rating: 4.5,
    reviews: 134,
    image: "/products/outono-produtos/outono-gelatina.png",
    destaque: false,
  },
  {
    id: "outono-6",
    nome: "Autumn Bloom Hair Oil",
    descricao: "Óleo capilar que proporciona desembaraço e brilho intenso. Nutrição profunda para cabelos que sofrem com a queda sazonal do outono.",
    categoria: "Nutrição",
    estacao: "Outono",
    preco: 94.90,
    rating: 4.8,
    reviews: 212,
    image: "/products/outono-produtos/outono-oleo.png",
    destaque: true,
    badge: "Novo",
  },
  {
    id: "outono-7",
    nome: "Kit Autumn Bloom Completo",
    descricao: "Kit completo com Shampoo, Conditioner, Leave-in Cream, Hair Mask, Gelatin e Oil. Toda a linha Autumn Bloom para cuidar dos seus cabelos na estação mais charmosa do ano.",
    categoria: "Kits",
    estacao: "Outono",
    preco: 299.90,
    precoOriginal: 389.90,
    rating: 4.9,
    reviews: 356,
    image: "/products/outono-produtos/Autumn-kit-completo.png",
    destaque: true,
    badge: "Economia",
  },

  // Inverno - Produtos
  {
    id: "inverno-1",
    nome: "Winter Complete Kit Shampoo",
    descricao: "Shampoo da linha Winter Complete Kit, formulado para limpeza suave e proteção durante os dias frios. Ideal para cabelos que precisam de cuidados extras no inverno.",
    categoria: "Shampoo",
    estacao: "Inverno",
    preco: 59.90,
    rating: 4.7,
    reviews: 189,
    image: "/products/inverno-produtos/inverno-shampoo.png",
    destaque: false,
  },
  {
    id: "inverno-2",
    nome: "Winter Complete Kit Conditioner",
    descricao: "Condicionador hidratante que combate o ressecamento típico do inverno. Deixa os fios macios e desembaraçados mesmo nos dias mais frios.",
    categoria: "Condicionador",
    estacao: "Inverno",
    preco: 59.90,
    rating: 4.6,
    reviews: 156,
    image: "/products/inverno-produtos/inverno-condicionador.png",
    destaque: false,
  },
  {
    id: "inverno-3",
    nome: "Winter Complete Kit Mask",
    descricao: "Máscara capilar intensiva para hidratação profunda durante o inverno. Recupera a saúde dos fios ressecados pelo frio e vento.",
    categoria: "Tratamento",
    estacao: "Inverno",
    preco: 89.90,
    rating: 4.9,
    reviews: 278,
    image: "/products/inverno-produtos/inverno-mascara.png",
    destaque: true,
    badge: "Best Seller",
  },
  {
    id: "inverno-4",
    nome: "Winter Complete Kit Leave-in Cream",
    descricao: "Creme de leave-in da linha Winter, formulado para proteção e hidratação prolongada. Ideal para finalização nos dias mais secos.",
    categoria: "Finalização",
    estacao: "Inverno",
    preco: 74.90,
    rating: 4.7,
    reviews: 167,
    image: "/products/inverno-produtos/inverno-creme.png",
    destaque: false,
  },
  {
    id: "inverno-5",
    nome: "Winter Complete Kit Gelatin",
    descricao: "Gelatina modeladora que oferece definição e controle do frizz mesmo em dias de umidade baixa. Fixação natural para todos os tipos de cabelo.",
    categoria: "Finalização",
    estacao: "Inverno",
    preco: 64.90,
    rating: 4.5,
    reviews: 123,
    image: "/products/inverno-produtos/inverno-gelatina.png",
    destaque: false,
  },
  {
    id: "inverno-6",
    nome: "Winter Complete Kit Oil",
    descricao: "Óleo capilar nutritivo que sela a hidratação e protege os fios contra o ressecamento do inverno. Deixa os cabelos brilhantes e sedosos.",
    categoria: "Nutrição",
    estacao: "Inverno",
    preco: 99.90,
    rating: 4.8,
    reviews: 201,
    image: "/products/inverno-produtos/inverno-oleo.png",
    destaque: true,
    badge: "Novo",
  },
  {
    id: "inverno-7",
    nome: "Kit Winter Complete",
    descricao: "Kit completo com Shampoo, Conditioner, Mask, Leave-in Cream, Gelatin e Oil. Toda a proteção que seus cabelos precisam para enfrentar o inverno com saúde e beleza.",
    categoria: "Kits",
    estacao: "Inverno",
    preco: 329.90,
    precoOriginal: 429.90,
    rating: 4.9,
    reviews: 412,
    image: "/products/inverno-produtos/inverno-kit-completo.png",
    destaque: true,
    badge: "Economia",
  },

  // Verão - Produtos
  {
    id: "verao-1",
    nome: "Protetor Solar Capilar FPS 60",
    descricao: "Proteção máxima contra raios UV. Ideal para dias de praia e piscina. Fórmula resistente à água que não pesa nos fios.",
    categoria: "Nutrição",
    estacao: "Verão",
    preco: 89.90,
    rating: 4.9,
    reviews: 312,
    image: "/products/verao-produtos/verão-oleo.png",
    destaque: true,
    badge: "Best Seller",
  },
  {
    id: "verao-2",
    nome: "Mascara Hidratante",
    descricao: "Remove resíduos de produtos e oleosidade excessiva do verão. Esfoliação suave que prepara o couro cabeludo para os tratamentos.",
    categoria: "Tratamento",
    estacao: "Verão",
    preco: 54.90,
    rating: 4.5,
    reviews: 134,
    image: "/products/verao-produtos/verão-mascara.png",
    destaque: false,
  },
  {
    id: "verao-3",
    nome: "Gelatina",
    descricao: "Proteção diária contra sol, sal e cloro. Não pesa nos fios e proporciona hidratação leve para uso diário no verão.",
    categoria: "Finalização",
    estacao: "Verão",
    preco: 67.90,
    rating: 4.8,
    reviews: 221,
    image: "/products/verao-produtos/verão-gelatina.png",
    destaque: true,
  },
  {
    id: "verao-4",
    nome: "Shampoo Pós-Praia",
    descricao: "Shampoo removedor de cloro e sal, ideal para uso após praia e piscina. Limpeza profunda sem agredir os fios.",
    categoria: "Shampoo",
    estacao: "Verão",
    preco: 49.90,
    rating: 4.7,
    reviews: 178,
    image: "/products/verao-produtos/verão-shampoo.png",
    destaque: false,
  },
  {
    id: "verao-5",
    nome: "Condicionador",
    descricao: "Máscara intensiva para recuperar cabelos danificados pela exposição solar. Reparação profunda e hidratação intensa.",
    categoria: "Condicionador",
    estacao: "Verão",
    preco: 79.90,
    rating: 4.8,
    reviews: 245,
    image: "/products/verao-produtos/verão-condicionador.png",
    destaque: true,
    badge: "Mais Vendido",
  },
  {
    id: "verao-6",
    nome: "Kit Completo Verão",
    descricao: "Shampoo + Condicionador + Leave-in + Máscara para proteção completa no verão. Tudo que você precisa para cuidar dos cabelos na estação mais quente do ano.",
    categoria: "Kits",
    estacao: "Verão",
    preco: 189.90,
    precoOriginal: 229.90,
    rating: 4.9,
    reviews: 356,
    image: "/products/verao-produtos/verão-kit-completo.png",
    destaque: true,
    badge: "Economia",
  },
  {
    id: "verao-7",
    nome: "Creme Leave-in Verão",
    descricao: "Creme de leave-in da linha Verão, formulado para proteção e hidratação prolongada. Ideal para finalização nos dias quentes e para proteger os fios do sol e cloro.",
    categoria: "Finalização",
    estacao: "Verão",
    preco: 74.90,
    rating: 4.7,
    reviews: 167,
    image: "/products/verao-produtos/verão-creme.png",
    destaque: false,
  },
];

const filtrosEstacao = ["Todos", "Verão", "Inverno", "Outono", "Primavera"];
const filtrosCategoria = ["Todos", "Shampoo", "Condicionador", "Tratamento", "Finalização", "Nutrição","Kits"];

const ordenacoes = [
  { value: "relevantes", label: "Mais relevantes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "mais-vendidos", label: "Mais vendidos" },
  { value: "melhor-avaliados", label: "Melhor avaliados" },
];

// Helper function
const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function LojaPage() {
  // State
  const [filtroEstacao, setFiltroEstacao] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("relevantes");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filtered and sorted products
  const produtosFiltrados = useMemo(() => {
    let result = [...produtos];

    // Filter by estacao
    if (filtroEstacao !== "Todos") {
      result = result.filter((p) => p.estacao === filtroEstacao);
    }

    // Filter by categoria
    if (filtroCategoria !== "Todos") {
      result = result.filter((p) => p.categoria === filtroCategoria);
    }

    // Sort
    switch (ordenacao) {
      case "menor-preco":
        result.sort((a, b) => a.preco - b.preco);
        break;
      case "maior-preco":
        result.sort((a, b) => b.preco - a.preco);
        break;
      case "mais-vendidos":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case "melhor-avaliados":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }

    return result;
  }, [filtroEstacao, filtroCategoria, ordenacao]);

  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showNotification("Removido dos favoritos");
      } else {
        newFavorites.add(productId);
        showNotification("Adicionado aos favoritos");
      }
      return newFavorites;
    });
  }, [showNotification]);

  // Add to cart
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`${product.nome} adicionado à sacola`);
  }, [showNotification]);

  // Update cart quantity
  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showNotification("Item removido da sacola");
  }, [showNotification]);

  // Cart calculations
  const cartTotal = cart.reduce((total, item) => total + item.preco * item.quantity, 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Clear filters
  const clearFilters = () => {
    setFiltroEstacao("Todos");
    setFiltroCategoria("Todos");
    setOrdenacao("relevantes");
  };

  const hasActiveFilters = filtroEstacao !== "Todos" || filtroCategoria !== "Todos";

  return (
    <main className="loja-main">
      {/* Notification */}
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

      {/* Floating Cart Button */}
      <button
        className="loja-floating-cart"
        onClick={() => setIsCartOpen(true)}
        aria-label="Abrir sacola"
      >
        <ShoppingBag size={22} />
        {cartItemsCount > 0 && (
          <span className="loja-cart-badge">{cartItemsCount}</span>
        )}
      </button>

      {/* Cart Sidebar */}
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
                <button
                  className="loja-cart-close"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Fechar sacola"
                >
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
                          <Image
                            src={item.image}
                            alt={item.nome}
                            width={80}
                            height={80}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="loja-cart-item-details">
                          <h4>{item.nome}</h4>
                          <span className="loja-cart-item-price">
                            {formatPrice(item.preco)}
                          </span>
                          <div className="loja-cart-item-quantity">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="loja-cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remover item"
                        >
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
                  <button className="loja-cart-checkout">
                    Finalizar Compra
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="loja-hero">
        <motion.span
          className="loja-hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Nova coleção
        </motion.span>
        <motion.h1
          className="loja-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Cuide da sua pele
          <br />
          em cada estação
        </motion.h1>
        <motion.p
          className="loja-hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Produtos formulados para as necessidades reais de cada clima — do verão intenso ao inverno seco.
        </motion.p>
      </section>

      {/* Content */}
      <section className="loja-content">
        {/* Mobile Filter Toggle */}
        <button
          className="loja-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          Filtros
          {hasActiveFilters && <span className="filter-active-dot" />}
        </button>

        {/* Filters Sidebar */}
        <aside className={`loja-filtros ${showFilters ? "loja-filtros--open" : ""}`}>
          <div className="loja-filtros-header">
            <h3>Filtros</h3>
            {hasActiveFilters && (
              <button className="loja-filtros-clear" onClick={clearFilters}>
                Limpar
              </button>
            )}
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
                {f !== "Todos" && (
                  <span className="filtro-count">
                    {produtos.filter((p) => f === "Todos" || p.estacao === f).length}
                  </span>
                )}
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

        {/* Products Area */}
        <div className="loja-produtos">
          {/* Top Bar */}
          <div className="loja-top-bar">
            <div className="loja-top-left">
              <span className="loja-count">
                {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "produto" : "produtos"}
              </span>
              {hasActiveFilters && (
                <div className="loja-active-filters">
                  {filtroEstacao !== "Todos" && (
                    <span className="active-filter-tag">
                      {filtroEstacao}
                      <button onClick={() => setFiltroEstacao("Todos")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filtroCategoria !== "Todos" && (
                    <span className="active-filter-tag">
                      {filtroCategoria}
                      <button onClick={() => setFiltroCategoria("Todos")}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="loja-top-right">
              <div className="loja-view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                  aria-label="Visualização em grade"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={viewMode === "compact" ? "active" : ""}
                  onClick={() => setViewMode("compact")}
                  aria-label="Visualização compacta"
                >
                  <Grid3X3 size={18} />
                </button>
              </div>

              <div className="loja-sort-wrapper">
                <select
                  className="loja-sort"
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                >
                  {ordenacoes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="loja-sort-icon" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {produtosFiltrados.length === 0 ? (
            <div className="loja-empty">
              <Sparkles size={48} strokeWidth={1} />
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros para encontrar o que procura.</p>
              <button className="loja-empty-btn" onClick={clearFilters}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <motion.div
              className={`produtos-grid ${viewMode === "compact" ? "produtos-grid--compact" : ""}`}
              layout
            >
              <AnimatePresence mode="popLayout">
                {produtosFiltrados.map((produto, index) => (
                  <motion.article
                    key={produto.id}
                    className="produto-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {produto.badge && (
                      <span className={`produto-card-badge produto-card-badge--${produto.badge.toLowerCase().replace(" ", "-")}`}>
                        {produto.badge}
                      </span>
                    )}

                    <button
                      className={`produto-card-favorite ${favorites.has(produto.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(produto.id)}
                      aria-label={favorites.has(produto.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Heart
                        size={18}
                        fill={favorites.has(produto.id) ? "currentColor" : "none"}
                      />
                    </button>

                    <div className="produto-card-img">
                      <Image
                        src={produto.image}
                        alt={produto.nome}
                        width={300}
                        height={300}
                        className="produto-image"
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                    </div>

                    <div className="produto-card-info">
                      <div className="produto-card-meta">
                        <span className="produto-card-cat">{produto.categoria}</span>
                        <span className="produto-card-estacao">{produto.estacao}</span>
                      </div>

                      <h3 className="produto-card-nome">{produto.nome}</h3>

                      {viewMode === "grid" && (
                        <p className="produto-card-descricao">{produto.descricao}</p>
                      )}

                      <div className="produto-card-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{produto.rating}</span>
                        <span className="produto-card-reviews">({produto.reviews})</span>
                      </div>

                      <div className="produto-card-footer">
                        <div className="produto-card-preco">
                          <span className="preco-atual">{formatPrice(produto.preco)}</span>
                          {produto.precoOriginal && (
                            <span className="preco-original">{formatPrice(produto.precoOriginal)}</span>
                          )}
                        </div>
                        <button
                          className="produto-card-btn"
                          onClick={() => addToCart(produto)}
                        >
                          <ShoppingBag size={16} />
                          <span>Adicionar</span>
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