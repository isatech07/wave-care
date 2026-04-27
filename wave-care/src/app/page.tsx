"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Droplet,
  Wind,
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Summer from "@/pages/Summer/Summer";
import Autumn from "@/pages/Autumn/Autumn";
import Winter from "@/pages/Winter/Winter";
import Spring from "@/pages/Spring/Spring";

import "./home.css";

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface GelatinSlide {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  bgColor: string;
  blobColor1: string;
  blobColor2: string;
  textColor: string;
  season: string;
}

// Data
const gelatinSlides: GelatinSlide[] = [
  {
    id: "verao",
    name: "Summer Protection",
    subtitle: "Gelatina Estilizadora",
    description: "Definição e hidratação para cabelos ondulados e cacheados durante o verão",
    image: "/products/gelatina-verao.png",
    bgColor: "#f5e6d3",
    blobColor1: "#d4a574",
    blobColor2: "#c4956a",
    textColor: "#8b5a2b",
    season: "Verão",
  },
  {
    id: "outono",
    name: "Gelatin Outono",
    subtitle: "Regeneration & Strength",
    description: "Cachos definidos e brilho intenso para os dias mais frios do outono",
    image: "/products/gelatina-outono.png",
    bgColor: "#d4dcc6",
    blobColor1: "#6b7f3a",
    blobColor2: "#8fa055",
    textColor: "#4a5828",
    season: "Outono",
  },
  {
    id: "inverno",
    name: "Winter Complete Kit",
    subtitle: "Gelatin",
    description: "Nutrição profunda e proteção contra o ressecamento do inverno",
    image: "/products/gelatina-inverno.png",
    bgColor: "#b8c4d4",
    blobColor1: "#7a8fa8",
    blobColor2: "#5a7090",
    textColor: "#2c3e50",
    season: "Inverno",
  },
  {
    id: "primavera",
    name: "Primavera Bloom",
    subtitle: "Styling Gelatin",
    description: "Definição e hidratação para renovar seus cabelos na primavera",
    image: "/products/gelatina-primavera.png",
    bgColor: "#c25a7c",
    blobColor1: "#a14466",
    blobColor2: "#d47a98",
    textColor: "#ffffff",
    season: "Primavera",
  },
];

const estacoes = [
  {
    id: "verao",
    label: "Verão",
    description: "Proteção Solar & Hidratação",
    image: "/products/verao-produtos/Summer kit-2.png",
  },
  {
    id: "outono",
    label: "Outono",
    description: "Fortalecimento & Anti-queda",
    image: "/products/outono-produtos/Autumn-Bloom-kit.png",
  },
  {
    id: "inverno",
    label: "Inverno",
    description: "Nutrição Profunda & Anti-ressecamento",
    image: "/products/inverno-produtos/inverno-kit-2.png",
  },
  {
    id: "primavera",
    label: "Primavera",
    description: "Renovação & Revitalização",
    image: "/products/primavera-produtos/primavera-kit-completo.png",
  },
];

const produtos: Product[] = [
  {
    id: "1",
    name: "SunShield Shampoo",
    description: "Limpeza suave com proteção UV para cabelos expostos ao sol e maresia.",
    price: 29.90,
    originalPrice: 39.90,
    rating: 4.8,
    reviews: 234,
    image: "/products/verao-produtos/verão-shampoo.png",
    badge: "Best Seller",
    category: "Shampoo",
  },
  {
    id: "2",
    name: "Autumn Repair Mask",
    description: "Tratamento intensivo para recuperar fios danificados e ressecados pela queda de temperatura.",
    price: 44.90,
    originalPrice: 54.90,
    rating: 4.9,
    reviews: 312,
    image: "/products/outono-produtos/outono-mascara.png",
    badge: "Best Seller",
    category: "Máscara",
  },
  {
    id: "3",
    name: "Winter Protective Leave-in Cream",
    description: "Cria um escudo protetor contra o frio e o vento, mantendo a hidratação e a definição dos fios.",
    price: 32.90,
    originalPrice: 42.90,
    rating: 4.8,
    reviews: 267,
    image: "/products/inverno-produtos/inverno-creme.png",
    badge: "Best Seller",
    category: "Leave-in",
  },
  {
    id: "4",
    name: "Primavera Bloom Styling Gelatin",
    description: "Gelatina modeladora que ajuda a definir cachos e ondas com efeito natural.",
    price: 38.90,
    originalPrice: 48.90,
    rating: 4.7,
    reviews: 189,
    image: "/products/primavera-produtos/primavera-gelatina.png",
    badge: "Novo",
    category: "Óleo",
  },
];

const marqueeTexts = [
  "Ingredientes Naturais",
  "Fórmulas Sazonais",
  "Cabelos Saudáveis",
  "Hidratação Profunda",
  "Proteção UV",
  "Cruelty Free",
  "Sustentável",
  "Nutrição Intensa",
];

// Helper function
const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Home() {
  const searchParams = useSearchParams();
  const estacao = searchParams.get("estacao");

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gelatinSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navigate carousel
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % gelatinSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + gelatinSlides.length) % gelatinSlides.length);
  };

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
  }, []);

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
    showNotification(`${product.name} adicionado à sacola`);
  }, []);

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
  }, []);

  // Show notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const currentGelatina = gelatinSlides[currentSlide];

  // Se tiver uma estação selecionada, mostra a página específica
  if (estacao === "verao") {
    return (
      <main className="home-main">
        <section className="estacao-section estacao-fade-in">
          <Summer />
        </section>
      </main>
    );
  }

  if (estacao === "outono") {
    return (
      <main className="home-main">
        <section className="estacao-section estacao-fade-in">
          <Autumn />
        </section>
      </main>
    );
  }

  if (estacao === "inverno") {
    return (
      <main className="home-main">
        <section className="estacao-section estacao-fade-in">
          <Winter />
        </section>
      </main>
    );
  }

  if (estacao === "primavera") {
    return (
      <main className="home-main">
        <section className="estacao-section estacao-fade-in">
          <Spring />
        </section>
      </main>
    );
  }
  
  // Home page padrão com carrinho e produtos
  return (
    <main className="home-main">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="notification"
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
        className="floating-cart-button"
        onClick={() => setIsCartOpen(true)}
        aria-label="Abrir sacola"
      >
        <ShoppingBag size={22} />
        {cartItemsCount > 0 && (
          <span className="cart-badge">{cartItemsCount}</span>
        )}
      </button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              className="cart-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="cart-header">
                <h2>Sua Sacola</h2>
                <button
                  className="cart-close"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Fechar sacola"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="cart-content">
                {cart.length === 0 ? (
                  <div className="cart-empty">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p>Sua sacola está vazia</p>
                    <span>Adicione produtos para continuar</span>
                  </div>
                ) : (
                  <ul className="cart-items">
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="cart-item-image">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <span className="cart-item-price">
                            {formatPrice(item.price)}
                          </span>
                          <div className="cart-item-quantity">
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
                          className="cart-item-remove"
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
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <button className="cart-checkout-button">
                    Finalizar Compra
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <motion.span
            className="home-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Cuidados sazonais
          </motion.span>
          <motion.h1
            className="home-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cabelos saudáveis
            <br />
            <span>em cada estação</span>
          </motion.h1>
          <motion.p
            className="home-hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Descubra a rotina perfeita para seu tipo de cabelo, adaptada para
            cada época do ano com produtos que promovem saúde, beleza e
            autoestima.
          </motion.p>
          <motion.div
            className="home-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/quiz" className="home-button home-button-primary">
              Descobrir rotina
            </Link>
            <Link href="#produtos" className="home-button home-button-secondary">
              Conhecer produtos
            </Link>
          </motion.div>
        </div>
        <div className="home-hero-image">
          <motion.div
            className="home-product-rotating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            
          </motion.div>
        </div>
      </section>

      {/* Gelatin Carousel Section */}
      <section className="gelatin-carousel-section">
        <div className="gelatin-carousel-header">
          <h2 className="gelatin-carousel-title">Novos Produtos</h2>
          <p className="gelatin-carousel-subtitle">
            Definição e cuidado especial para cada época do ano
          </p>
        </div>

        <div 
          className="gelatin-carousel"
          style={{ 
            "--bg-color": currentGelatina.bgColor,
            "--blob-color-1": currentGelatina.blobColor1,
            "--blob-color-2": currentGelatina.blobColor2,
            "--text-color": currentGelatina.textColor,
          } as React.CSSProperties}
        >
          {/* Animated Background Blobs */}
          <div className="gelatin-blobs">
            <motion.div 
              className="blob blob-1"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="blob blob-2"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -15, 0],
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="blob blob-3"
              animate={{ 
                scale: [1, 1.08, 1],
                rotate: [0, 8, 0],
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Carousel Content */}
          <div className="gelatin-carousel-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="gelatin-slide"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="gelatin-info">
                  <span className="gelatin-season-badge">{currentGelatina.season}</span>
                  <h3 className="gelatin-name">{currentGelatina.name}</h3>
                  <p className="gelatin-subtitle">{currentGelatina.subtitle}</p>
                  <p className="gelatin-description">{currentGelatina.description}</p>
                  <Link 
                    href={`/?estacao=${currentGelatina.id}`} 
                    className="gelatin-cta"
                  >
                    Ver Produtos da Estação
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="gelatin-image-wrapper">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image
                      src={currentGelatina.image}
                      alt={currentGelatina.name}
                      width={450}
                      height={450}
                      className="gelatin-image"
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="gelatin-nav">
            <button 
              className="gelatin-nav-btn" 
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="gelatin-dots">
              {gelatinSlides.map((_, index) => (
                <button
                  key={index}
                  className={`gelatin-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="gelatin-nav-btn" 
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Estações Section */}
      <section className="home-estacoes">
        <div className="home-estacoes-header">
          <h2 className="home-estacoes-title">Kits por Estação</h2>
          <p className="home-estacoes-description">
            Cada estação pede um cuidado diferente. Encontre o ideal para seus
            fios.
          </p>
        </div>

        <div className="home-estacoes-grid">
          {estacoes.map(({ id, label, description, image }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/?estacao=${id}`} className="home-estacao-card">
                <div className="estacao-image-wrapper">
                  <Image
                    src={image}
                    alt={label}
                    width={300}
                    height={200}
                    className="estacao-image"
                  />
                </div>
                <div className="home-estacao-card-content">
                  <h3 className="home-estacao-label">{label}</h3>
                  <p className="home-estacao-description">{description}</p>
                  <span className="home-estacao-link">
                    Ver produtos <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quiz Section */}
      <section className="quiz-section" id="quiz">
        <div className="quiz-card">
          <Sparkles className="quiz-icon" size={32} />
          <h2 className="quiz-title">Descubra seu tipo de cabelo</h2>
          <p className="quiz-description">
            Faça nosso quiz inteligente e receba recomendações personalizadas
            para seu tipo de fio, cidade e estação.
          </p>
          <Link href="/quiz" className="quiz-button">
            <Sparkles size={18} />
            Fazer o Quiz
          </Link>
        </div>
      </section>

      

      {/* Marquee Section */}
      <section className="marquee-section">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...marqueeTexts, ...marqueeTexts].map((text, index) => (
              <span key={index} className="marquee-item">
                {text}
                <span className="marquee-separator">•</span>
              </span>
            ))}
          </div>
          <div className="marquee-track marquee-track-reverse">
            {[...marqueeTexts, ...marqueeTexts].map((text, index) => (
              <span key={index} className="marquee-item">
                {text}
                <span className="marquee-separator">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    

      {/* Produtos Section */}
      <section className="home-produtos" id="produtos">
        <div className="home-produtos-header">
          <h2 className="home-produtos-title">Produtos em Destaque</h2>
          <p className="home-produtos-description">
            Os mais amados pela comunidade Wave Care
          </p>
        </div>

        <div className="home-produtos-grid">
          {produtos.map((product, index) => (
            <motion.article
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="product-image-wrapper">
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <button
                  className={`product-favorite ${favorites.has(product.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={
                    favorites.has(product.id)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <Heart
                    size={20}
                    fill={favorites.has(product.id) ? "currentColor" : "none"}
                  />
                </button>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={380}
                  className="product-image"
                />
              </div>

              <div className="product-info">
                <div className="product-rating">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="product-reviews">({product.reviews})</span>
                </div>

                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="price-current">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="price-original">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    className="product-add-button"
                    onClick={() => addToCart(product)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      </main>
  );
}