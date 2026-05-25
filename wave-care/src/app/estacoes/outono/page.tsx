"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { Poppins, Playfair_Display } from "next/font/google";
import SeasonProductsSection from "@/components/SeasonProducts/SeasonProductsSection";
import { useOutonoProducts } from "./outono.service";

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
    img: "/products/outono-produtos/banner-kit-outono.png",
    alt: "Outono",
    title: "Outono",
    subtitle:
      "Renove seus fios com a chegada do outono. Nutrição profunda e proteção contra o ressecamento causado pelo tempo frio e as mudanças de estação.",
  },
  {
    img: "/products/outono-produtos/Autumn-Bloom-kit.png",
    title: "Autumn Bloom",
    subtitle:
    "Hidratação intensa, antifrizz e brilho natural para os dias mais frescos. Seus fios nutridos do amanhecer ao entardecer.",
  },
  {
    img: "/products/outono-produtos/Autumn-kit-2.png",
    alt: "Kits de Outono",
    title: "Kits de Outono",
    subtitle:
      "Combos completos para cuidar dos fios durante toda a estação. Escolha o kit ideal para o seu tipo de cabelo.",
  },
];

const tips = [
  "Hidrate os fios com máscaras nutritivas semanalmente",
  "Use leave-in para proteger contra o ressecamento",
  "Reduza o uso de calor para preservar a umidade natural",
  "Aposte em óleos capilares para selar as cutículas",
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Autumn() {
  const seasonData = useOutonoProducts();

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
            <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">

            {/* Onda principal com silhueta de folhas empilhadas */}
            <path d="
                M0,62
                C30,56 55,74 90,65 C115,59 130,46 165,50
                C195,53 210,70 255,64 C278,60 292,46 328,50
                C360,53 378,72 420,65 C448,60 465,45 503,49
                C538,53 555,70 600,64 C630,59 648,44 688,48
                C725,52 742,70 788,64 C815,59 835,44 873,48
                C912,52 928,70 975,64 C1002,59 1020,44 1058,48
                C1098,52 1115,70 1162,64 C1188,59 1205,44 1243,48
                C1282,52 1300,70 1350,64 C1385,59 1410,50 1440,56
                L1440,100 L0,100 Z"
                fill="var(--bg)"/>

            </svg>
          </div>

        </div>
      </main>

      {/* ── Tips ── */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Dicas para o Outono</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Protection - Carrossel de Palavras ── */}

      {/* ── Carrosséis ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Outono</h2>
        </div>

        <SeasonProductsSection
          seasonData={seasonData}
          lineTitle="Linha Autumn Bloom"
          kitsTitle="Kits de Outono"
          lineBannerSrc="/products/outono-produtos/propaganda-outono.png"
          lineBannerAlt="Linha Autumn Bloom"
          kitsBannerSrc="/products/outono-produtos/propaganda-kit-outono.png"
          kitsBannerAlt="Kits de Outono"
        />
      </section>

    </div>
  );
}