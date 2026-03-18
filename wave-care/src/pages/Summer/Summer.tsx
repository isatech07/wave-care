"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./summer.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-title",
});

const heroSlides = [
  {
    img: "/products/verao-produtos/banner-kit-verao.jpg",
    alt: "Verão",
    title: "Verão",
    subtitle:
      "Proteja seus fios contra o sol intenso, sal do mar e maresia. Hidratação profunda para manter seus cabelos macios e brilhantes nos dias mais quentes do litoral.",
  },
  {
    img: "/products/verao-produtos/Summer-Protection - kit.png",
    alt: "Summer Protection",
    title: "Summer Protection",
    subtitle:
      "Proteção UV, antifrizz e nutrição leve para os dias mais quentes. Seus fios brilhantes do amanhecer ao pôr do sol.",
  },
  {
    img: "/products/verao-produtos/Summer Kit-2.png",
    alt: "Kits de Verão",
    title: "Kits de Verão",
    subtitle:
      "Combos completos para cuidar dos fios durante toda a estação. Escolha o kit ideal para o seu tipo de cabelo.",
  },
];

const tips = [
  "Use protetor solar capilar antes de ir à praia",
  "Enxágue os fios com água doce após o mar",
  "Hidrate profundamente 2x por semana",
  "Evite secador nos dias mais quentes",
];

const products = [
  {
    name: "SunShield Shampoo",
    desc: "Limpeza suave com proteção UV para cabelos expostos ao sol e maresia.",
    price: "R$ 39,90",
    size: "400ml",
    rating: 4.8,
    reviews: 204,
    img: "/products/verao-produtos/verão-shampoo.png",
  },
  {
    name: "SunShield Conditioner",
    desc: "Restaura a hidratação dos fios após exposição solar, devolvendo maciez.",
    price: "R$ 42,80",
    size: "400ml",
    rating: 4.6,
    reviews: 156,
    img: "/products/verao-produtos/verão-condicionador.png",
  },
  {
    name: "Summer Repair Mask",
    desc: "Tratamento intensivo de alta performance para recuperar fios danificados pelo sol e maresia.",
    price: "R$ 54,90",
    size: "500g",
    rating: 4.3,
    reviews: 116,
    img: "/products/verao-produtos/verão-mascara.png",
  },
  {
    name: "Heat & Sun Leave-In",
    desc: "Forma um filme protetor invisível contra raios UV, calor excessivo, mantendo definição do cabelo.",
    price: "R$ 49,90",
    size: "500ml",
    rating: 4.7,
    reviews: 205,
    img: "/products/verao-produtos/verão-creme.png",
  },
  {
    name: "Summer Definition Jelly",
    desc: "Definição duradoura com efeito natural e toque leve.",
    price: "R$ 46,90",
    size: "500g",
    rating: 4.8,
    reviews: 250,
    img: "/products/verao-produtos/verão-gelatina.png",
  },
  {
    name: "Golden Shine Oil",
    desc: "Óleo nutritivo leve com brilho instantâneo. Controla o frizz, sela pontas e realça os cachos.",
    price: "R$ 44,90",
    size: "100ml",
    rating: 4.2,
    reviews: 98,
    img: "/products/verao-produtos/verão-oleo.png",
  },
];

const kits = [
  {
    name: "Summer Essential Kit",
    desc: "O combo ideal para manter os fios protegidos, hidratados e luminosos durante o verão.",
    price: "R$ 129,90",
    rating: 4.8,
    reviews: 250,
    includes: ["SunShield Shampoo", "SunShield Conditioner", "Summer Repair Mask"],
    img: "/products/verao-produtos/verão-kit-1.png",
  },
  {
    name: "Summer Full Protection",
    desc: "Tratamento completo com proteção térmica e solar. Além da limpeza e hidratação profunda.",
    price: "R$ 189,90",
    rating: 4.8,
    reviews: 250,
    includes: ["SunShield Shampoo", "SunShield Conditioner", "Summer Repair Mask", "Heat & Sun Leave-In"],
    img: "/products/verao-produtos/verão-kit-2.png",
  },
  {
    name: "Summer Definition Duo",
    desc: "A dupla perfeita para definição duradoura e controle do frizz no verão.",
    price: "R$ 89,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Heat & Sun Leave-In", "Summer Definition Jelly"],
    img: "/products/verao-produtos/verão-kit-3.png",
  },
  {
    name: "Summer Finishing Trio",
    desc: "O trio indispensável para finalizar os fios durante o verão.",
    price: "R$ 109,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Heat & Sun Leave-In", "Summer Definition Jelly", "Golden Shine Oil"],
    img: "/products/verao-produtos/verão-kit-4.png",
  },
  {
    name: "Summer Styling Duo",
    desc: "A combinação ideal para modelar e nutrir os fios no verão.",
    price: "R$ 74,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Summer Definition Jelly", "Golden Shine Oil"],
    img: "/products/verao-produtos/verão-kit-5.png",
  },
  {
    name: "Summer Total Protection",
    desc: "A experiência completa de cuidado para o verão.",
    price: "R$ 249,90",
    rating: 4.9,
    reviews: 300,
    includes: [
      "SunShield Shampoo",
      "SunShield Conditioner",
      "Summer Repair Mask",
      "Heat & Sun Leave-In",
      "Summer Definition Jelly",
      "Golden Shine Oil",
    ],
    img: "/products/verao-produtos/verão-kit-completo.png",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Summer() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = heroSlides.length;

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setCurrent((index + total) % total);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_PLAY_INTERVAL) {
        setCurrent((c) => (c + 1) % total);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, total]);

  const slide = heroSlides[current];

  return (
    <div className={`${styles.container} ${poppins.variable} ${playfair.variable}`}>

      {/* ── Hero com carrossel automático ── */}
      <main className={styles.hero}>
        <div className={styles.heroBanner}>

          {heroSlides.map((s, i) => (
            <img
              key={i}
              src={s.img}
              alt={s.alt}
              className={`${styles.heroBannerImg} ${i === current ? styles.heroBannerImgActive : ""}`}
            />
          ))}

          <div className={styles.heroOverlay}>
            <span className={styles.heroSun}>{slide.icon}</span>
            <h1 className={styles.heroTitle}>{slide.title}</h1>
            <p className={styles.heroSubtitle}>{slide.subtitle}</p>
          </div>

          <button onClick={() => goTo(current - 1)} className={`${styles.heroArrow} ${styles.heroArrowLeft}`} aria-label="Anterior">←</button>
          <button onClick={() => goTo(current + 1)} className={`${styles.heroArrow} ${styles.heroArrowRight}`} aria-label="Próximo">→</button>

          <div className={styles.heroDots}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`${styles.heroDot} ${i === current ? styles.heroDotActive : ""}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>


          <div className={styles.heroWave}>
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
            </svg>
          </div>
        </div>
      </main>

      {/* ── Tips ── */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Dicas para o Verão</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Protection ── */}
      <section className={styles.protectionSection} id="collection">
        <div className={styles.protectionBanner}>
          <div className={styles.protectionOverlay}>
            <h2 className={styles.protectionTitle}>Summer Protection</h2>
            <p className={styles.protectionDesc}>
              Proteção contra sol, maresia e calor excessivo.
              Foco em brilho, definição e nutrição leve.
            </p>
          </div>
        </div>
      </section>

      {/* ── Carrosséis ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Verão</h2>
        </div>

        <ProductCarousel
          title="Linha Summer Protection"
          products={products}
          bannerSrc="/products/verao-produtos/propaganda-verão.jpg"
          bannerAlt="Linha Summer Protection"
          visibleCount={3}
        />

        <ProductCarousel
          title="Kits de Verão"
          products={kits}
          bannerSrc="/products/verao-produtos/propaganda-kit-verão.png"
          bannerAlt="Kits de Verão"
          visibleCount={3}
        />
      </section>

    </div>
  );
}