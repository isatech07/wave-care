"use client";

import styles from "./summer.module.css";

// — Icons inline (sem dependência extra) —
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const tips = [
  { icon: <SunIcon />, text: "Use protetor solar capilar antes de ir à praia" },
  { icon: <SunIcon />, text: "Enxague os fios com água doce após o mar" },
  { icon: <SunIcon />, text: "Hidrate profundamente 2x por semana" },
  { icon: <SunIcon />, text: "Evite secar/alisar nos dias mais quentes" },
];

const products = [
  {
    tag: "kit 2PÇ",
    name: "Wave Care SunKiss Shampoo",
    desc: "Limpeza suave com proteção UV, mantém a cor e o brilho dos fios.",
    oldPrice: "R$ 45,90 • 400ml",
    price: "R$ 45,90",
    badge: "NOVO",
    color: "#C17B3A",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care SunKiss Conditioner",
    desc: "Condicionamento intenso com filtro solar para fios protegidos e macios.",
    oldPrice: "R$ 42,90 • 400ml",
    price: "R$ 42,90",
    badge: "NOVO",
    color: "#A0522D",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care SunKiss Repair Mask",
    desc: "Máscara reparadora com manteiga de karité e óleo de argan.",
    oldPrice: "R$ 89,90 • 500g",
    price: "R$ 89,90",
    badge: null,
    color: "#8B4513",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care Nourish Sun Leave-In",
    desc: "Leave-in leve com proteção UV e nutrição profunda sem pesar.",
    oldPrice: "R$ 56,90 • 240ml",
    price: "R$ 56,90",
    badge: "MAIS VENDIDO",
    color: "#B8860B",
  },
  {
    tag: "kit 3PÇ",
    name: "Wave Care Summer Definition Jelly",
    desc: "Gel definidor de ondas e cachos com proteção contra o sal e o calor.",
    oldPrice: "R$ 62,90 • 250g",
    price: "R$ 62,90",
    badge: null,
    color: "#CD853F",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care Sunkiss Serum Oil",
    desc: "Sérum em óleo com vitamina E para brilho intenso e proteção solar.",
    oldPrice: "R$ 72,90 • 60ml",
    price: "R$ 72,90",
    badge: "NOVO",
    color: "#DAA520",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care Summer Essential Kit",
    desc: "Kit completo shampoo + condicionador + máscara para o verão.",
    oldPrice: "R$ 120,00",
    price: "R$ 99,90",
    badge: null,
    color: "#A0522D",
  },
  {
    tag: "kit 3PÇ",
    name: "Wave Care Summer Ampoule Liss",
    desc: "Ampola de tratamento intensivo com queratina e filtro UV.",
    oldPrice: "R$ 85,00",
    price: "R$ 69,90",
    badge: "OFERTA",
    color: "#8B3A0F",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care Summer Meditation Tea",
    desc: "Tratamento capilar com chá verde e proteção contra poluição e sol.",
    oldPrice: "R$ 78,90",
    price: "R$ 78,90",
    badge: null,
    color: "#B8860B",
  },
  {
    tag: "kit 2PÇ",
    name: "Wave Care Summer Finishing Tea",
    desc: "Finalizador leve com extrato de chá branco para fios disciplinados.",
    oldPrice: "R$ 68,90",
    price: "R$ 68,90",
    badge: null,
    color: "#C17B3A",
  },
  {
    tag: "kit 3PÇ",
    name: "Wave Care Summer BrightUp",
    desc: "Iluminador capilar com reflexos dourados e proteção UV intensa.",
    oldPrice: "R$ 92,90",
    price: "R$ 92,90",
    badge: "NOVO",
    color: "#DAA520",
  },
  {
    tag: "kit 5PÇ",
    name: "Wave Care Summer Protection",
    desc: "Kit premium de 5 produtos para proteção total durante o verão.",
    oldPrice: "R$ 199,90",
    price: "R$ 169,90",
    badge: "KIT",
    color: "#8B4513",
  },
];

export default function Summer() {
  return (
    <main className={styles.main}>
      {/* ——— HERO ——— */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>✦ Verão</p>
          <p className={styles.heroSubtitle}>Proteção Solar · Hidratação</p>
          <p className={styles.heroBody}>
            Proteja seus fios contra o sol intenso, sal do mar e maresia.
            Hidratação profunda para manter seus cabelos macios e brilhantes
            nos dias mais quentes do litoral.
          </p>
        </div>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImagePlaceholder}>
            <div className={styles.beachScene}>
              <div className={styles.sky} />
              <div className={styles.sea} />
              <div className={styles.sand} />
              <div className={styles.productsPreview}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={styles.productBottle} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— DICAS ——— */}
      <section className={styles.tips}>
        <h2 className={styles.tipsTitle}>Dicas para o Verão</h2>
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>{tip.icon}</span>
              <p className={styles.tipText}>{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— SUMMER PROTECTION BANNER ——— */}
      <section className={styles.banner}>
        <div className={styles.bannerText}>
          <div className={styles.bannerDivider} />
          <h2 className={styles.bannerTitle}>Summer Protection</h2>
          <p className={styles.bannerDesc}>
            Proteção contra sol, maresia e calor excessivo.
            <br />
            Foco em brilho, definição e nutrição leve.
          </p>
        </div>
        <div className={styles.bannerProducts}>
          <div className={styles.bannerBg}>
            <span className={styles.bannerWatermark}>SUMMER PROTECTION</span>
          </div>
          <div className={styles.productLineup}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={styles.lineupBottle}
                style={{ "--i": i, "--h": [110, 120, 90, 130, 80, 95][i] + "px" } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ——— PRODUTOS ——— */}
      <section className={styles.products}>
        <h2 className={styles.productsTitle}>Linha de Produtos e Kits de Verão</h2>
        <div className={styles.productsGrid}>
          {products.map((p, i) => (
            <div key={i} className={styles.productCard}>
              <div
                className={styles.productImage}
                style={{ "--clr": p.color } as React.CSSProperties}
              >
                <div className={styles.productBottleCard} />
                {p.badge && (
                  <span
                    className={styles.badge}
                    data-type={
                      p.badge === "NOVO"
                        ? "new"
                        : p.badge === "MAIS VENDIDO"
                        ? "hot"
                        : p.badge === "KIT"
                        ? "kit"
                        : "offer"
                    }
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{p.tag}</span>
                <h3 className={styles.productName}>{p.name}</h3>
                <p className={styles.productDesc}>{p.desc}</p>
                <div className={styles.productPricing}>
                  <span className={styles.productOldPrice}>{p.oldPrice}</span>
                  <span className={styles.productPrice}>{p.price}</span>
                </div>
                <button className={styles.addBtn}>Adicionar ao carrinho</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}