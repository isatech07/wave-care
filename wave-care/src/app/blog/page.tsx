import Link from "next/link"
import "./blog.css"

const posts = [
  {
    slug: "cuidados-verao",
    tag: "Verão",
    tagColor: "tag--verao",
    date: "12 Mar 2025",
    title: "Cuidados essenciais para a pele no verão",
    excerpt:
      "O sol intenso pede atenção redobrada. Descubra rotinas, protetores e hidratantes que mantêm sua pele saudável mesmo nos dias mais quentes.",
    readTime: "5 min",
  },
  {
    slug: "hidratacao-inverno",
    tag: "Inverno",
    tagColor: "tag--inverno",
    date: "28 Fev 2025",
    title: "Como hidratar a pele nos dias frios",
    excerpt:
      "O frio resseca. Conheça os ingredientes ativos que fazem a diferença e como montar uma rotina noturna de dar inveja.",
    readTime: "4 min",
  },
  {
    slug: "rotina-outono",
    tag: "Outono",
    tagColor: "tag--outono",
    date: "10 Fev 2025",
    title: "Transição de estação: sua pele pede adaptação",
    excerpt:
      "Entre o calor e o frio, a pele oscila. Saiba como ajustar sua rotina para enfrentar o outono sem ressecamento nem oleosidade.",
    readTime: "6 min",
  },
  {
    slug: "spf-guia",
    tag: "Guia",
    tagColor: "tag--guia",
    date: "01 Fev 2025",
    title: "SPF: tudo que você precisa saber sobre proteção solar",
    excerpt:
      "FPS 30, 50 ou 100? Protetor físico ou químico? Este guia completo responde as dúvidas mais comuns sobre filtro solar.",
    readTime: "8 min",
  },
  {
    slug: "vitamina-c-pele",
    tag: "Ingredientes",
    tagColor: "tag--guia",
    date: "20 Jan 2025",
    title: "Vitamina C na skincare: mitos e verdades",
    excerpt:
      "Um dos ativos mais populares do universo beauty. Descubra como usar corretamente e potencializar seus resultados.",
    readTime: "5 min",
  },
  {
    slug: "primavera-alergias",
    tag: "Primavera",
    tagColor: "tag--primavera",
    date: "05 Jan 2025",
    title: "Pele sensível na primavera: como lidar com alergias",
    excerpt:
      "O florescimento da natureza pode despertar reações na pele. Veja quais produtos evitar e quais ingredientes calmantes usar.",
    readTime: "4 min",
  },
]

export const metadata = {
  title: "Blog – Wave Care",
  description: "Dicas, guias e rotinas de cuidados para cada estação do ano.",
}

export default function BlogPage() {
  return (
    <main className="blog-main">
      <section className="blog-hero">
        <p className="blog-hero__eyebrow">Wave Care · Editorial</p>
        <h1 className="blog-hero__title">
          Sua pele merece
          <br />
          atenção o ano todo
        </h1>
        <p className="blog-hero__sub">
          Guias, rotinas e ingredientes para cada estação — escritos por quem entende de skincare.
        </p>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
              <div className="blog-card__image-placeholder" />
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span className={`blog-card__tag ${post.tagColor}`}>{post.tag}</span>
                  <span className="blog-card__date">{post.date}</span>
                </div>
                <h2 className="blog-card__title">{post.title}</h2>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <span className="blog-card__read">{post.readTime} de leitura →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}