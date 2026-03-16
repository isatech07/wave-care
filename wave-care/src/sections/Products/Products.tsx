import "./products.css"

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= Math.floor(rating) ? "filled" : i - 0.5 <= rating ? "half" : ""}`}
        >★</span>
      ))}
    </div>
  )
}

const products = [
  {
    id: 1,
    category: "TRATAMENTO",
    title: "Wave Care Marine Protection Oil",
    description: "Proteção solar e brilho intenso",
    rating: 3.5,
    reviews: 234,
    price: "R$ 189,90",
    oldPrice: "R$ 219,90",
    discount: "-14%",
    img: "/products/product1.jpg",
  },
  {
    id: 2,
    category: "LIMPEZA",
    title: "Wave Care Hydra Shampoo",
    description: "Limpeza suave e hidratação",
    rating: 4,
    reviews: 456,
    price: "R$ 89,90",
    oldPrice: null,
    discount: null,
    img: "/products/product2.jpg",
  },
]

export default function Products() {
  return (
    <section className="products">
      <div className="container">

        <div className="section-header">
          <h2>Produtos em Destaque</h2>
          <p>Os mais amados pela comunidade Wave Care</p>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.img} alt={p.title} />
                {p.discount && <span className="discount-badge">{p.discount}</span>}
              </div>
              <div className="product-info">
                <span className="product-category">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="product-rating">
                  <Stars rating={p.rating} />
                  <span className="review-count">({p.reviews})</span>
                </div>
                <div className="product-price">
                  <strong>{p.price}</strong>
                  {p.oldPrice && <s>{p.oldPrice}</s>}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}