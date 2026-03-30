import "./seasons.css"
import { ArrowRight } from "lucide-react"

const seasons = [
  {
    slug: "summer",
    label: "Verão",
    title: "Kit Verão",
    description: "Proteção intensa contra sol e maresia. Fórmulas leves que não pesam nos fios.",
    img: "/seasons/summer.jpg",
  },
  {
    slug: "autumn",
    label: "Outono",
    title: "Kit Outono",
    description: "Reparação e nutrição profunda para fios danificados pelo verão.",
    img: "/seasons/autumn.jpg",
  },
  {
    slug: "winter",
    label: "Inverno",
    title: "Kit Inverno",
    description: "Hidratação intensa para fios ressecados pelo frio.",
    img: "/seasons/winter.jpg",
  },
  {
    slug: "spring",
    label: "Primavera",
    title: "Kit Primavera",
    description: "Leveza, brilho e renovação para os seus fios.",
    img: "/seasons/spring.jpg",
  },
]

export default function Seasons() {
  return (
    <section className="seasons" id="estacoes">
      <div className="container">

        <div className="section-header">
          <h2>Kits por Estação</h2>
          <p>Cada estação pede um cuidado<br />diferente. Encontre o ideal para seus fios.</p>
        </div>

        <div className="season-grid">
          {seasons.map((s) => (
            <div className="season-card" key={s.slug}>
              <div className="season-image">
                <img src={s.img} alt={s.title} />
                <span className="season-badge">{s.label}</span>
              </div>
              <div className="season-info">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <a href={`/kits/${s.slug}`} className="explore-link">
                  Explorar <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}