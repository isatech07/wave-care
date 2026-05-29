"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { usePrimaveraProducts } from "./primavera.service";
import SeasonMarquee from "@/components/seasonal/SeasonMarquee";

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

const MARQUEE_WORDS = ["Floral", "Pastel", "Leve", "Renovação", "Primavera", "Cores", "Jardim", "Delicado", "Estampado", "Fresco", "Alegre", "Novo"];

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

const AUTO_PLAY_INTERVAL = 5000;

export default function Spring() {
  const seasonData = usePrimaveraProducts();

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

      {/* Carrossel de Palavras */}
      <div style={{ margin: '3rem 0', zIndex: 1 }}>
        <SeasonMarquee
          words={MARQUEE_WORDS}
          highlightColor="#ec4899"
        />
      </div>

      {/* ── Carrosséis ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Primavera</h2>
        </div>

        <SeasonProductsSection
          seasonData={seasonData}
          lineTitle="Linha Primavera Bloom"
          kitsTitle="Kits de Primavera"
          lineBannerSrc="/products/primavera-produtos/propaganda-primavera.png"
          lineBannerAlt="Linha Primavera Bloom"
          kitsBannerSrc="/products/primavera-produtos/propaganda-primavera-2.png"
          kitsBannerAlt="Kits de Primavera"
        />
      </section>

    </div>
  );
}