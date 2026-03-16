import styles from "./summer.module.css";
import { Poppins, Playfair_Display } from "next/font/google";

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

const tips = [
  "Use protetor solar capilar antes de ir à praia",
  "Enxágue os fios com água doce após o mar",
  "Hidrate profundamente 2x por semana",
  "Evite secador nos dias mais quentes",
];

const products = [
  {
    name: "Summer Shield Shampoo",
    desc: "Limpeza suave com proteção UV para cabelos expostos ao sol e maresia.",
    price: "R$ 39,90",
    size: "400ml",
    rating: 4.8,
    reviews: 204,
  },
  {
    name: "Summer Shield Conditioner",
    desc: "Restaura a hidratação dos fios após exposição solar, devolvendo maciez.",
    price: "R$ 42,80",
    size: "400ml",
    rating: 4.8,
    reviews: 146,
  },
  {
    name: "Golden Repair Oil",
    desc: "Óleo reparador com filtro solar que sela as cutículas e elimina o frizz.",
    price: "R$ 54,90",
    size: "60ml",
    rating: 4.9,
    reviews: 312,
  },
  {
    name: "Beach Leave-In Cream",
    desc: "Leave-in leve que protege e define os cachos durante todo o dia na praia.",
    price: "R$ 36,50",
    size: "250ml",
    rating: 4.7,
    reviews: 178,
  },
];

export default function Summer() {
  return (
    <div
      className={`${styles.container} ${poppins.variable} ${playfair.variable}`}
    >

      <main className={styles.hero}>
        <div className={styles.heroBanner}>
          <img src="/seasons/banner-kit-verao.jpg" alt="Verão" />

          <div className={styles.heroOverlay}>
            <span className={styles.heroSun}>☀️</span>
            <h1 className={styles.heroTitle}>Verão</h1>
            <p className={styles.heroSubtitle}>
              Proteja seus fios contra o sol intenso, sal do mar e maresia.
              Hidratação profunda para manter seus cabelos macios e brilhantes
              nos dias mais quentes do litoral.
            </p>
          </div>

          {/* Onda na base */}
          <div className={styles.heroWave}>
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
                fill="var(--bg)"
              />
            </svg>
          </div>
        </div>
      </main>

      {/* Tips */}
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

      {/* Protection */}
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

      {/* Products */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2 className={styles.sectionTitle}>
            Linha de Produtos e Kits de Verão
          </h2>
        </div>
        <div className={styles.productsGrid}>
          {products.map((product, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.productRating}>
                  <span className={styles.ratingStar}>★</span>
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>
                    ({product.reviews})
                  </span>
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    {product.price} – {product.size}
                  </span>
                  <button className={styles.addButton}>Adicionar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

            {/* Products */}
      <section className={styles.productsSection}>
        <div className={styles.productsGrid}>
          {products.map((product, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.productRating}>
                  <span className={styles.ratingStar}>★</span>
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>
                    ({product.reviews})
                  </span>
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    {product.price} – {product.size}
                  </span>
                  <button className={styles.addButton}>Adicionar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

                  {/* Products */}
      <section className={styles.productsSection}>
        <div className={styles.productsGrid}>
          {products.map((product, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImage}></div>
              <div className={styles.productInfo}>
                <div className={styles.productRating}>
                  <span className={styles.ratingStar}>★</span>
                  <span className={styles.ratingValue}>{product.rating}</span>
                  <span className={styles.ratingCount}>
                    ({product.reviews})
                  </span>
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    {product.price} – {product.size}
                  </span>
                  <button className={styles.addButton}>Adicionar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}