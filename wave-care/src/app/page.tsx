"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Droplet,
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
  Award,
  Shield,
  Gem,
  Sun,
  CloudSnow,
  Flower2,
  TreeDeciduous,
} from "lucide-react";

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
  season: string;
  bgColor: string;
  blobColor1: string;
  blobColor2: string;
  textColor: string;
}

interface Season {
  id: string;
  label: string;
  description: string;
  image: string;
  color: string;
  icon: React.ReactNode;
}

// Data
const gelatinSlides: GelatinSlide[] = [
  {
    id: "verao",
    name: "Summer Protection",
    subtitle: "Gelatina Estilizadora",
    description: "Definição e hidratação...",
    image: "/products/gelatina-verao.png",
    season: "Verão",

    bgColor: "#FFD89B",
    blobColor1: "#FFB347",
    blobColor2: "#FFCC70",
    textColor: "#2D1B00",
  },

  {
    id: "outono",
    name: "Autumn Regeneration",
    subtitle: "Força & Vitalidade",
    description: "Cachos definidos...",
    image: "/products/gelatina-outono.png",
    season: "Outono",

    bgColor: "#C8D5B9",
    blobColor1: "#A3B18A",
    blobColor2: "#CCD5AE",
    textColor: "#283618",
  },

  {
    id: "inverno",
    name: "Winter Shield",
    subtitle: "Nutrição Intensiva",
    description: "Nutrição profunda...",
    image: "/products/gelatina-inverno.png",
    season: "Inverno",

    bgColor: "#D6E4F0",
    blobColor1: "#A7C7E7",
    blobColor2: "#CFE8FF",
    textColor: "#0F172A",
  },

  {
    id: "primavera",
    name: "Spring Bloom",
    subtitle: "Renovação Capilar",
    description: "Definição e hidratação...",
    image: "/products/gelatina-primavera.png",
    season: "Primavera",

    bgColor: "#F8D7E8",
    blobColor1: "#F4A7C1",
    blobColor2: "#FFD6E7",
    textColor: "#5C2A3D",
  },
];

const estacoes: Season[] = [
  {
    id: "verao",
    label: "Verão",
    description: "Proteção Solar & Hidratação",
    image: "/products/verao-produtos/Summerkit-2.png",
    color: "#f5e6d3",
    icon: <Sun size={18} />,
  },
  {
    id: "outono",
    label: "Outono",
    description: "Fortalecimento & Anti-queda",
    image: "/products/outono-produtos/Autumn-Bloom-kit.png",
    color: "#d4dcc6",
    icon: <TreeDeciduous size={18} />,
  },
  {
    id: "inverno",
    label: "Inverno",
    description: "Nutrição Profunda & Proteção",
    image: "/products/inverno-produtos/inverno-kit-2.png",
    color: "#b8c4d4",
    icon: <CloudSnow size={18} />,
  },
  {
    id: "primavera",
    label: "Primavera",
    description: "Renovação & Revitalização",
    image: "/products/primavera-produtos/primavera-kit-completo.png",
    color: "#e8d4dd",
    icon: <Flower2 size={18} />,
  },
];

const produtos: Product[] = [
  {
    id: "1",
    name: "SunShield Shampoo",
    description:
      "Limpeza suave com proteção UV para cabelos expostos ao sol e maresia.",
    price: 29.9,
    originalPrice: 39.9,
    rating: 4.8,
    reviews: 234,
    image: "/products/verao-produtos/verao-shampoo.png",
    badge: "Best Seller",
    category: "Shampoo",
  },
  {
    id: "2",
    name: "Autumn Repair Mask",
    description:
      "Tratamento intensivo para recuperar fios danificados e ressecados.",
    price: 44.9,
    originalPrice: 54.9,
    rating: 4.9,
    reviews: 312,
    image: "/products/outono-produtos/outono-mascara.png",
    badge: "Best Seller",
    category: "Máscara",
  },
  {
    id: "3",
    name: "Winter Protective Cream",
    description:
      "Cria um escudo protetor contra o frio, mantendo a hidratação dos fios.",
    price: 32.9,
    originalPrice: 42.9,
    rating: 4.8,
    reviews: 267,
    image: "/products/inverno-produtos/inverno-creme.png",
    badge: "Best Seller",
    category: "Leave-in",
  },
  {
    id: "4",
    name: "Spring Bloom Gelatin",
    description:
      "Gelatina modeladora que define cachos e ondas com efeito natural.",
    price: 38.9,
    originalPrice: 48.9,
    rating: 4.7,
    reviews: 189,
    image: "/products/primavera-produtos/primavera-gelatina.png",
    badge: "Novo",
    category: "Styling",
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

const brandFeatures = [
  { icon: <Leaf size={18} />, text: "100% Natural" },
  { icon: <Award size={18} />, text: "Premiado" },
  { icon: <Shield size={18} />, text: "Dermatologicamente Testado" },
  { icon: <Gem size={18} />, text: "Ingredientes Premium" },
];

// Helper function
const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function Home() {
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
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navigate carousel
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % gelatinSlides.length);
  };

  const prevSlide = () => {
    goToSlide(
      (currentSlide - 1 + gelatinSlides.length) % gelatinSlides.length
    );
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
  const cartItemsCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const currentGelatina = gelatinSlides[currentSlide];

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
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
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
                    <ShoppingBag size={52} strokeWidth={1} />
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

      {/* ══════════════════════════════════════
          HERO SECTION — Cinematic & Premium
          ══════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-badge">
              <Sparkles size={14} />
              Cuidados Sazonais Premium
            </span>
            <h1 className="hero-title">
              A Ciência do
              <span className="hero-title-accent">Cuidado Capilar</span>
            </h1>
            <p className="hero-description">
              Fórmulas exclusivas desenvolvidas para cada estação do ano.
              Descubra a rotina perfeita para transformar seus cabelos com
              ingredientes naturais e tecnologia avançada.
            </p>
            <div className="hero-actions">
              <Link href="/quiz" className="btn btn-primary">
                Descobrir Minha Rotina
                <ArrowRight size={18} />
              </Link>
              <Link href="#colecoes" className="btn btn-secondary">
                Ver Coleções
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-image-container">
              <div className="hero-image-glow" />
              <Image
  src="/products/verao-produtos/verao-shampoo.png"
  alt="Wave Care Premium Collection"
  width={560}
  height={700}
  priority
/>
              <motion.div
                className="hero-floating-badge hero-floating-badge-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Leaf size={20} />
                <span>100% Natural</span>
              </motion.div>
              <motion.div
                className="hero-floating-badge hero-floating-badge-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <Award size={20} />
                <span>Premiado 2024</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Brand Strip */}
        <div className="brand-strip">
          <div className="brand-strip-inner">
            {brandFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="brand-strip-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                {feature.icon}
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PHILOSOPHY SECTION — Brand Story
          ══════════════════════════════════════ */}
      <section className="philosophy-section">
        <div className="philosophy-content">
          <motion.div
            className="philosophy-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label">Nossa Filosofia</span>
            <h2 className="philosophy-title">
              Cabelos que respondem às estações
            </h2>
            <p className="philosophy-description">
              Cada estação traz desafios únicos para seus cabelos. Desenvolvemos
              fórmulas específicas que trabalham em harmonia com as mudanças
              climáticas, garantindo proteção, nutrição e beleza durante todo o
              ano.
            </p>
            <div className="philosophy-features">
              <div className="philosophy-feature">
                <Droplet size={20} />
                <span>Hidratação inteligente que se adapta ao clima</span>
              </div>
              <div className="philosophy-feature">
                <Shield size={20} />
                <span>Proteção avançada contra danos ambientais</span>
              </div>
              <div className="philosophy-feature">
                <Leaf size={20} />
                <span>Ingredientes naturais de alta performance</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="philosophy-visual"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="philosophy-image-wrapper">
              <Image
                src="/products/inverno-produtos/propaganda-inverno.png"
                alt="Wave Care Philosophy"
                fill
                className="philosophy-image"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="philosophy-stat">
              <span className="philosophy-stat-number">98%</span>
              <span className="philosophy-stat-label">
                Clientes Satisfeitos
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COLLECTIONS SECTION — Seasonal
          ══════════════════════════════════════ */}
      <section className="collections-section" id="colecoes">
        <div className="collections-header">
          <motion.div
            className="collections-header-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Coleções Sazonais</span>
            <h2 className="collections-title">Kits para Cada Estação</h2>
            <p className="collections-subtitle">
              Cada estação pede um cuidado diferente. Encontre o kit ideal para
              seus fios em qualquer época do ano.
            </p>
          </motion.div>
          <div className="collections-nav">
            <button className="collections-nav-btn" aria-label="Anterior">
              <ChevronLeft size={20} />
            </button>
            <button className="collections-nav-btn" aria-label="Próximo">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="collections-grid">
          {estacoes.map((season, index) => (
            <motion.div
              key={season.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/estacoes/${season.id}`}
                className="collection-card"
              >
                <div
                  className="collection-card-bg"
                  style={{ backgroundColor: season.color }}
                >
                  <Image
                    src={season.image}
                    alt={season.label}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="collection-card-overlay" />
                <div className="collection-card-content">
                  <span className="collection-card-badge">
                    {season.icon}
                    {season.label}
                  </span>
                  <h3 className="collection-card-name">{season.label}</h3>
                  <p className="collection-card-desc">{season.description}</p>
                  <span className="collection-card-link">
                    Ver Coleção <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
    MARQUEE SECTION — Infinite Scroll
    ══════════════════════════════════════ */}
<section className="marquee-section">
  <div className="marquee-wrapper">
    <div className="marquee-track">
      {[...marqueeTexts, ...marqueeTexts].map((text, index) => (
        <span key={index} className="marquee-item">
          {text}
          <span className="marquee-separator">◆</span>
        </span>
      ))}
    </div>

    <div className="marquee-track marquee-track-reverse">
      {[...marqueeTexts, ...marqueeTexts].map((text, index) => (
        <span key={index} className="marquee-item">
          {text}
          <span className="marquee-separator">◆</span>
        </span>
      ))}
    </div>
  </div>
</section>
<br />
<br />


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
                    href={`/estacoes/${currentGelatina.id}`}
                    className="gelatin-cta"
                  >
                    Ver Produtos da Estação
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="gelatin-image-wrapper">
                  <Image
                    src={currentGelatina.image}
                    alt={currentGelatina.name}
                    width={450}
                    height={450}
                    className="gelatin-image"
                    priority
                  />
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
  
      

      {/* ══════════════════════════════════════
          PRODUCTS SECTION — Grid Display
          ══════════════════════════════════════ */}
      <section className="products-section" id="produtos">
        <div className="products-header">
          <motion.div
            className="products-header-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Mais Vendidos</span>
            <h2 className="products-title">Produtos em Destaque</h2>
            <p className="products-subtitle">
              Os mais amados pela comunidade Wave Care
            </p>
          </motion.div>
          <Link href="/produtos" className="products-view-all">
            Ver Todos
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid">
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
                  className={`product-favorite ${
                    favorites.has(product.id) ? "active" : ""
                  }`}
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
                  fill
                  className="product-image"
                  style={{ objectFit: "cover" }}
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

      {/* ══════════════════════════════════════
          QUIZ CTA SECTION — Premium Dark
          ══════════════════════════════════════ */}
      <section className="quiz-section" id="quiz">
        <motion.div
          className="quiz-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="quiz-card-left">
            <div className="quiz-icon">
              <Sparkles size={28} />
            </div>
            <span className="quiz-eyebrow">Recomendação Personalizada</span>
            <h2 className="quiz-title">Descubra seu tipo de cabelo</h2>
            <p className="quiz-description">
              Faça nosso quiz inteligente e receba recomendações personalizadas
              para seu tipo de fio, cidade e estação atual.
            </p>
          </div>
          <div className="quiz-card-right">
            <ul className="quiz-features">
              <li className="quiz-feature">
                <Check size={20} />
                <span>Análise personalizada em 2 minutos</span>
              </li>
              <li className="quiz-feature">
                <Check size={20} />
                <span>Recomendações baseadas no seu clima</span>
              </li>
              <li className="quiz-feature">
                <Check size={20} />
                <span>Rotina completa de cuidados</span>
              </li>
            </ul>
            <Link href="/quiz" className="quiz-button">
              <Sparkles size={18} />
              Fazer o Quiz
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      
    </main>
  );
}
