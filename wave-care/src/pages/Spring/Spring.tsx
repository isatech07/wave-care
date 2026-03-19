"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./spring.module.css";
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
    img: "/products/primavera-produtos/banner-kit-primavera.png",
    alt: "Primavera",
    title: "Primavera",
    subtitle:
      "Desperte seus fios com a leveza e o frescor da nova estação. Hidratação floral e nutrição profunda para cabelos que florescem a cada lavagem.",
  },
  {
    img: "/products/primavera-produtos/bloom-kit-completo.png",
    alt: "Primavera Bloom",
    title: "Primavera Bloom",
    subtitle:
      "Extrato de flores, antifrizz e nutrição delicada para os dias de renovação. Seus fios radiantes do amanhecer à noite.",
  },
  {
    img: "/products/primavera-produtos/bloom-kit-2.png",
    alt: "Kits de Primavera",
    title: "Kits de Primavera",
    subtitle:
      "Combos completos para renovar os fios na nova estação. Escolha o kit ideal para o seu tipo de cabelo.",
  },
];

const tips = [
  "Aposte em máscaras florais para revitalizar os fios após o inverno",
  "Use leave-in leve para combater a umidade da estação",
  "Hidrate com ingredientes botânicos 2x por semana",
  "Finalize com óleo floral para selar a cutícula e dar brilho",
];

const products = [
  {
    name: "Bloom Shampoo",
    desc: "Limpeza suave com extrato de flores e proteção contra umidade excessiva da primavera.",
    price: "R$ 42,90",
    size: "400ml",
    rating: 4.8,
    reviews: 198,
    img: "/products/primavera-produtos/primavera-shampoo.png",
  },
  {
    name: "Bloom Conditioner",
    desc: "Restaura a maciez e o brilho dos fios com fragrância floral suave e duradoura.",
    price: "R$ 45,80",
    size: "400ml",
    rating: 4.7,
    reviews: 162,
    img: "/products/primavera-produtos/primavera-condicionador.png",
  },
  {
    name: "Bloom Repair Mask",
    desc: "Tratamento botânico intensivo para revitalizar fios ressecados pelo inverno com nutrição floral.",
    price: "R$ 56,90",
    size: "500g",
    rating: 4.5,
    reviews: 134,
    img: "/products/primavera-produtos/primavera-mascara.png",
  },
  {
    name: "Floral Bloom Leave-In",
    desc: "Forma um véu protetor leve com essências florais, controlando o frizz e devolvendo a definição.",
    price: "R$ 49,90",
    size: "500ml",
    rating: 4.7,
    reviews: 211,
    img: "/products/primavera-produtos/primavera-creme.png",
  },
  {
    name: "Bloom Definition Jelly",
    desc: "Definição duradoura com fixação leve e perfume floral que dura o dia todo.",
    price: "R$ 48,90",
    size: "500g",
    rating: 4.8,
    reviews: 243,
    img: "/products/primavera-produtos/primavera-gelatina.png",
  },
  {
    name: "Bloom Hair Oil",
    desc: "Óleo floral ultraleve com brilho instantâneo. Sela as pontas, controla o frizz e realça os cachos.",
    price: "R$ 41,90",
    size: "100ml",
    rating: 4.3,
    reviews: 107,
    img: "/products/primavera-produtos/primavera-oleo.png",
  },
];

const kits = [
  {
    name: "Spring Essential Kit",
    desc: "O combo ideal para renovar os fios na primavera, com limpeza, condicionamento e tratamento floral.",
    price: "R$ 129,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Bloom Shampoo", "Bloom Conditioner", "Bloom Repair Mask"],
    img: "/products/primavera-produtos/primavera-kit-1.png",
  },
  {
    name: "Spring Full Bloom",
    desc: "Tratamento completo com proteção botânica e hidratação profunda para os dias de renovação.",
    price: "R$ 189,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Bloom Shampoo", "Bloom Conditioner", "Bloom Repair Mask", "Floral Bloom Leave-In"],
    img: "/products/primavera-produtos/primavera-kit-2.png",
  },
  {
    name: "Spring Definition Duo",
    desc: "A dupla perfeita para definição duradoura e controle do frizz nos dias de primavera.",
    price: "R$ 89,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Floral Bloom Leave-In", "Bloom Definition Jelly"],
    img: "/products/primavera-produtos/primavera-kit-3.png",
  },
  {
    name: "Spring Finishing Trio",
    desc: "O trio indispensável para finalizar os fios com toque floral e brilho na primavera.",
    price: "R$ 109,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Floral Bloom Leave-In", "Bloom Definition Jelly", "Bloom Hair Oil"],
    img: "/products/primavera-produtos/primavera-kit-4.png",
  },
  {
    name: "Spring Styling Duo",
    desc: "A combinação ideal para modelar e nutrir os fios com fragrância floral na primavera.",
    price: "R$ 69,90",
    rating: 4.8,
    reviews: 250,
    includes: ["Bloom Definition Jelly", "Bloom Hair Oil"],
    img: "/products/primavera-produtos/primavera-kit-5.png",
  },
  {
    name: "Spring Total Bloom",
    desc: "A experiência completa de florescimento para os seus fios na nova estação.",
    price: "R$ 249,90",
    rating: 4.9,
    reviews: 300,
    includes: [
      "Bloom Shampoo",
      "Bloom Conditioner",
      "Bloom Repair Mask",
      "Floral Bloom Leave-In",
      "Bloom Definition Jelly",
      "Bloom Hair Oil",
    ],
    img: "/products/primavera-produtos/primavera-kit-completo.png",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Spring() {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setCurrent((index + total) % total);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed >= AUTO_PLAY_INTERVAL) {
        setCurrent((c) => (c + 1) % total);
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
            <span className={styles.heroFlower}>{slide.icon}</span>
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
        <h2 className={styles.sectionTitle}>Dicas para a Primavera</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>


      {/* ── Carrosséis ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Primavera</h2>
        </div>

        <ProductCarousel
          title="Linha Primavera Bloom"
          products={products}
          bannerSrc="/products/primavera-produtos/propaganda-primavera.png"
          bannerAlt="Linha Primavera Bloom"
          visibleCount={3}
        />

        <ProductCarousel
          title="Kits de Primavera"
          products={kits}
          bannerSrc="/products/primavera-produtos/propaganda-primavera-2.png"
          bannerAlt="Kits de Primavera"
          visibleCount={3}
        />
      </section>

    </div>
  );
}