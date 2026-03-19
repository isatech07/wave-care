"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./winter.module.css";
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
    img: "/products/inverno-produtos/banner-inverno.jpg",
    alt: "Inverno",
    title: "Inverno",
    subtitle:
      "Proteja seus fios do frio intenso e do ar seco. Nutrição profunda e selamento de cutículas para manter seus cabelos macios e protegidos nos dias mais frios.",
  },
  {
    img: "/products/inverno-produtos/Winter-banner.png",
    alt: "Winter Frost",
    title: "Winter Frost",
    subtitle:
      "Hidratação intensa, selamento de cutículas e proteção térmica para os dias mais frios. Seus fios nutridos do amanhecer ao entardecer.",
  },
  {
    img: "/products/inverno-produtos/inverno-kit-2.png",
    alt: "Kits de Inverno",
    title: "Kits de Inverno",
    subtitle:
      "Combos completos para cuidar dos fios durante toda a estação. Escolha o kit ideal para o seu tipo de cabelo.",
  },
];

const tips = [
  "Use máscara de nutrição profunda toda semana",
  "Aposte em leave-in para selar as cutículas abertas pelo frio",
  "Evite banhos muito quentes para não ressecar os fios",
  "Use óleos capilares para proteger contra o ar seco",
];

const products = [
  {
    name: "Winter Deep Hydration Shampoo",
    desc: "Limpeza suave com nutrição intensiva para cabelos ressecados pelo frio e ar seco.",
    price: "R$ 46,90",
    size: "400ml",
    rating: 4.8,
    reviews: 189,
    img: "/products/inverno-produtos/inverno-shampoo.png",
  },
  {
    name: "Winter Soft Repair Conditioner",
    desc: "Restaura a maciez e hidratação dos fios após exposição ao frio, vento e aquecedores.",
    price: "R$ 48,90",
    size: "400ml",
    rating: 4.7,
    reviews: 142,
    img: "/products/inverno-produtos/inverno-condicionador.png",
  },
  {
    name: "Winter Intense Repair Mask",
    desc: "Tratamento intensivo para recuperar fios danificados e ressecados pelo inverno rigoroso.",
    price: "R$ 56,90",
    size: "500g",
    rating: 4.5,
    reviews: 108,
    img: "/products/inverno-produtos/inverno-mascara.png",
  },
  {
    name: "Winter Protective Leave-in Cream",
    desc: "Cria um escudo protetor contra o frio e o vento, mantendo a hidratação e a definição dos fios.",
    price: "R$ 42,90",
    size: "500ml",
    rating: 4.6,
    reviews: 197,
    img: "/products/inverno-produtos/inverno-creme.png",
  },
  {
    name: "Winter Curl Definition Gelatin",
    desc: "Definição duradoura com proteção térmica e efeito antifrizz para os dias mais frios.",
    price: "R$ 58,90",
    size: "500g",
    rating: 4.8,
    reviews: 233,
    img: "/products/inverno-produtos/inverno-gelatina.png",
  },
  {
    name: "Winter Frost Shine Oil",
    desc: "Óleo nutritivo com aquecimento capilar e brilho instantâneo. Sela cutículas e protege do frio.",
    price: "R$ 44,90",
    size: "100ml",
    rating: 4.3,
    reviews: 87,
    img: "/products/inverno-produtos/inverno-oleo.png",
  },
];

const kits = [
  {
    name: "Winter Hydration Essential Kit",
    desc: "O combo ideal para manter os fios protegidos, hidratados e nutridos durante o inverno.",
    price: "R$ 129,90",
    rating: 4.8,
    reviews: 215,
    includes: ["Winter Deep Hydration Shampoo", "Winter Soft Repair Conditioner", "Winter Intense Repair Mask"],
    img: "/products/inverno-produtos/inverno-kit-1.png",
  },
  {
    name: "Winter Deep Care Kit",
    desc: "Tratamento completo com hidratação profunda e proteção contra o frio e o ar seco.",
    price: "R$ 199,90",
    rating: 4.8,
    reviews: 178,
    includes: ["Winter Deep Hydration Shampoo", "Winter Soft Repair Conditioner", "Winter Intense Repair Mask", "Winter Protective Leave-in Cream"],
    img: "/products/inverno-produtos/inverno-kit-2.png",
  },
  {
    name: "Winter Curl Definition Duo",
    desc: "A dupla perfeita para definição duradoura e proteção térmica no inverno.",
    price: "R$ 89,90",
    rating: 4.7,
    reviews: 134,
    includes: ["Winter Protective Leave-in Cream", "Winter Curl Definition Gelatin"],
    img: "/products/inverno-produtos/inverno-kit-3.png",
  },
  {
    name: "Winter Curl Definition Trio",
    desc: "O trio indispensável para finalizar e proteger os fios durante o inverno.",
    price: "R$ 129,90",
    rating: 4.8,
    reviews: 161,
    includes: ["Winter Protective Leave-in Cream", "Winter Curl Definition Gelatin", "Winter Frost Shine Oil"],
    img: "/products/inverno-produtos/inverno-kit-4.png",
  },
  {
    name: "Winter Shine Repair Kit",
    desc: "A combinação ideal para modelar e nutrir os fios no inverno.",
    price: "R$ 84,90",
    rating: 4.7,
    reviews: 119,
    includes: ["Winter Curl Definition Gelatin", "Winter Frost Shine Oil"],
    img: "/products/inverno-produtos/inverno-kit-5.png",
  },
  {
    name: "Winter Ultimate Care Kit",
    desc: "A experiência completa de cuidado e nutrição para enfrentar o inverno.",
    price: "R$ 259,90",
    rating: 4.9,
    reviews: 280,
    includes: [
      "Winter Deep Hydration Shampoo",
      "Winter Soft Repair Conditioner",
      "Winter Intense Repair Mask",
      "Winter Protective Leave-in Cream",
      "Winter Curl Definition Gelatin",
      "Winter Frost Shine Oil",
    ],
    img: "/products/inverno-produtos/inverno-kit-completo.png",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function Winter() {
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
            <span className={styles.heroSnow}>{slide.icon}</span>
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
            <svg viewBox="0 0 1440 110" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">

            {/* Flocos de neve */}
            <g fill="var(--bg)">

                {/* Floco 1 — cruz com pontas */}
                <g transform="translate(100, 38)" opacity="0.55">
                <rect x="-1" y="-9" width="2" height="18" rx="1"/>
                <rect x="-9" y="-1" width="18" height="2" rx="1"/>
                <rect x="-1" y="-9" width="2" height="18" rx="1" transform="rotate(45)"/>
                <rect x="-9" y="-1" width="18" height="2" rx="1" transform="rotate(45)"/>
                <circle cx="0" cy="-9" r="1.5"/><circle cx="0" cy="9" r="1.5"/>
                <circle cx="-9" cy="0" r="1.5"/><circle cx="9" cy="0" r="1.5"/>
                </g>

                {/* Floco 2 — pequeno */}
                <g transform="translate(290, 22)" opacity="0.40">
                <rect x="-0.8" y="-6" width="1.6" height="12" rx="0.8"/>
                <rect x="-6" y="-0.8" width="12" height="1.6" rx="0.8"/>
                <rect x="-0.8" y="-6" width="1.6" height="12" rx="0.8" transform="rotate(45)"/>
                <rect x="-6" y="-0.8" width="12" height="1.6" rx="0.8" transform="rotate(45)"/>
                <circle cx="0" cy="-6" r="1.2"/><circle cx="0" cy="6" r="1.2"/>
                <circle cx="-6" cy="0" r="1.2"/><circle cx="6" cy="0" r="1.2"/>
                </g>

                {/* Floco 3 — grande hexagonal */}
                <g transform="translate(490, 16)" opacity="0.65">
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2"/>
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2" transform="rotate(60)"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2" transform="rotate(60)"/>
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2" transform="rotate(120)"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2" transform="rotate(120)"/>
                <circle cx="0" cy="0" r="3"/>
                <circle cx="0" cy="-11" r="2"/><circle cx="0" cy="11" r="2"/>
                <circle cx="-9.5" cy="-5.5" r="2"/><circle cx="9.5" cy="-5.5" r="2"/>
                <circle cx="-9.5" cy="5.5" r="2"/><circle cx="9.5" cy="5.5" r="2"/>
                </g>

                {/* Floco 4 — médio hexagonal */}
                <g transform="translate(700, 14)" opacity="0.50">
                <rect x="-1" y="-8" width="2" height="16" rx="1"/>
                <rect x="-8" y="-1" width="16" height="2" rx="1"/>
                <rect x="-1" y="-8" width="2" height="16" rx="1" transform="rotate(60)"/>
                <rect x="-8" y="-1" width="16" height="2" rx="1" transform="rotate(60)"/>
                <rect x="-1" y="-8" width="2" height="16" rx="1" transform="rotate(120)"/>
                <rect x="-8" y="-1" width="16" height="2" rx="1" transform="rotate(120)"/>
                <circle cx="0" cy="0" r="2.5"/>
                </g>

                {/* Floco 5 */}
                <g transform="translate(870, 28)" opacity="0.42">
                <rect x="-0.8" y="-7" width="1.6" height="14" rx="0.8"/>
                <rect x="-7" y="-0.8" width="14" height="1.6" rx="0.8"/>
                <rect x="-0.8" y="-7" width="1.6" height="14" rx="0.8" transform="rotate(45)"/>
                <rect x="-7" y="-0.8" width="14" height="1.6" rx="0.8" transform="rotate(45)"/>
                <circle cx="0" cy="-7" r="1.3"/><circle cx="0" cy="7" r="1.3"/>
                <circle cx="-7" cy="0" r="1.3"/><circle cx="7" cy="0" r="1.3"/>
                </g>

                {/* Floco 6 — grande */}
                <g transform="translate(1060, 18)" opacity="0.60">
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2"/>
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2" transform="rotate(60)"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2" transform="rotate(60)"/>
                <rect x="-1.2" y="-11" width="2.4" height="22" rx="1.2" transform="rotate(120)"/>
                <rect x="-11" y="-1.2" width="22" height="2.4" rx="1.2" transform="rotate(120)"/>
                <circle cx="0" cy="0" r="3"/>
                <circle cx="0" cy="-11" r="2"/><circle cx="0" cy="11" r="2"/>
                <circle cx="-9.5" cy="-5.5" r="2"/><circle cx="9.5" cy="-5.5" r="2"/>
                <circle cx="-9.5" cy="5.5" r="2"/><circle cx="9.5" cy="5.5" r="2"/>
                </g>

                {/* Floco 7 — pequeno */}
                <g transform="translate(1280, 24)" opacity="0.45">
                <rect x="-0.8" y="-6" width="1.6" height="12" rx="0.8"/>
                <rect x="-6" y="-0.8" width="12" height="1.6" rx="0.8"/>
                <rect x="-0.8" y="-6" width="1.6" height="12" rx="0.8" transform="rotate(60)"/>
                <rect x="-6" y="-0.8" width="12" height="1.6" rx="0.8" transform="rotate(60)"/>
                <rect x="-0.8" y="-6" width="1.6" height="12" rx="0.8" transform="rotate(120)"/>
                <rect x="-6" y="-0.8" width="12" height="1.6" rx="0.8" transform="rotate(120)"/>
                <circle cx="0" cy="0" r="2"/>
                </g>

            </g>

            {/* Onda com picos de cristal */}
            <path d="
                M0,68
                C20,64 40,72 70,70 C90,68 105,58 130,55
                C150,53 160,58 180,62 C205,67 220,72 255,70
                C278,68 292,56 320,52 C345,49 358,54 378,60
                C400,66 415,72 450,70 C472,68 488,55 518,50
                C544,46 558,52 580,59 C600,65 615,72 655,70
                C678,68 694,55 724,50 C750,46 764,52 786,59
                C806,65 820,72 860,70 C882,68 898,54 928,49
                C955,45 968,52 990,59 C1010,65 1025,72 1062,70
                C1085,68 1100,55 1130,50 C1155,46 1168,52 1190,59
                C1210,65 1225,72 1265,70 C1288,68 1305,55 1340,52
                C1368,50 1400,58 1440,62
                L1440,110 L0,110 Z"
                fill="var(--bg)"/>

            {/* Cristais nas cristas */}
            <g fill="var(--bg)" opacity="0.25">
                <polygon points="130,55 124,47 136,47"/>
                <polygon points="320,52 314,44 326,44"/>
                <polygon points="518,50 512,42 524,42"/>
                <polygon points="724,50 718,42 730,42"/>
                <polygon points="928,49 922,41 934,41"/>
                <polygon points="1130,50 1124,42 1136,42"/>
            </g>

            </svg>
          </div>

        </div>
      </main>

      {/* ── Tips ── */}
      <section className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Dicas para o Inverno</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

          {/* Carrossel Palavras */}

      {/* ── Carrosséis ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>Linha de Produtos & Kits de Inverno</h2>
        </div>

        <ProductCarousel
          title="Linha Winter Frost"
          products={products}
          bannerSrc="/products/inverno-produtos/propaganda-inverno.png"
          bannerAlt="Linha Winter Frost"
          visibleCount={3}
        />

        <ProductCarousel
          title="Kits de Inverno"
          products={kits}
          bannerSrc="/products/inverno-produtos/propaganda-kit-inverno.png"
          bannerAlt="Kits de Inverno"
          visibleCount={3}
        />
      </section>

    </div>
  );
}