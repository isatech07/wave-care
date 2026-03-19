import Link from "next/link"
import "./loja.css"

const produtos = [
  {
    id: "1",
    nome: "Protetor Solar FPS 60",
    categoria: "Verão",
    preco: "R$ 89,90",
    destaque: true,
  },
  {
    id: "2",
    nome: "Sérum Vitamina C",
    categoria: "Todo o ano",
    preco: "R$ 129,00",
    destaque: false,
  },
  {
    id: "3",
    nome: "Hidratante Noturno",
    categoria: "Inverno",
    preco: "R$ 74,90",
    destaque: true,
  },
  {
    id: "4",
    nome: "Tônico Calmante",
    categoria: "Primavera",
    preco: "R$ 58,00",
    destaque: false,
  },
  {
    id: "5",
    nome: "Óleo Facial Nutritivo",
    categoria: "Outono",
    preco: "R$ 99,00",
    destaque: false,
  },
  {
    id: "6",
    nome: "Máscara de Argila",
    categoria: "Todo o ano",
    preco: "R$ 62,50",
    destaque: true,
  },
  {
    id: "7",
    nome: "Esfoliante Suave",
    categoria: "Verão",
    preco: "R$ 54,90",
    destaque: false,
  },
  {
    id: "8",
    nome: "Creme Olhos Revigorante",
    categoria: "Inverno",
    preco: "R$ 110,00",
    destaque: false,
  },
]

const filtros = ["Todos", "Verão", "Inverno", "Outono", "Primavera", "Todo o ano"]

export const metadata = {
  title: "Loja – Wave Care",
  description: "Produtos de skincare para cada estação do ano.",
}

export default function LojaPage() {
  return (
    <main className="loja-main">
      <section className="loja-hero">
        <span className="loja-hero__badge">Nova coleção</span>
        <h1 className="loja-hero__title">Cuide da sua pele<br />em cada estação</h1>
        <p className="loja-hero__sub">
          Produtos formulados para as necessidades reais de cada clima — do verão intenso ao inverno seco.
        </p>
      </section>

      <section className="loja-content">
        <aside className="loja-filtros">
          <p className="filtros-label">Filtrar por</p>
          {filtros.map((f) => (
            <button key={f} className={`filtro-btn ${f === "Todos" ? "filtro-btn--active" : ""}`}>
              {f}
            </button>
          ))}
        </aside>

        <div className="loja-produtos">
          <div className="loja-top-bar">
            <span className="loja-count">{produtos.length} produtos</span>
            <select className="loja-sort">
              <option>Mais relevantes</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Mais novos</option>
            </select>
          </div>

          <div className="produtos-grid">
            {produtos.map((p) => (
              <div key={p.id} className="produto-card">
                {p.destaque && <span className="produto-card__badge">Destaque</span>}
                <div className="produto-card__img" />
                <div className="produto-card__info">
                  <span className="produto-card__cat">{p.categoria}</span>
                  <h3 className="produto-card__nome">{p.nome}</h3>
                  <div className="produto-card__footer">
                    <span className="produto-card__preco">{p.preco}</span>
                    <button className="produto-card__btn">Adicionar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}