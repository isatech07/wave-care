import Link from "next/link"
import Image from "next/image"
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
    // Coloque o caminho da imagem aqui, ex: "/images/blog/cuidados-verao.jpg"
    image:"/blog/blog-1.png",
  },
  {
    slug: "hidratacao-inverno",
    tag: "Primavera",
    tagColor: "tag--primavera",
    date: "1 Set 2025",
    title: "Renovação capilar: prepare-se para a primavera",
    excerpt:
      "Dicas para revitalizar seus fios após o inverno e começar a estação com tudo.",
    readTime: "4 min",
    image: "/blog/blog-2.png",
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
    image: "/blog/blog-3.png",
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
    image:"/blog/blog-4.png",
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
    image:"/blog/blog-5.jpg",
  },
  {
    slug: "Cronograma",
    tag: "Cuidado",
    tagColor: "tag--guia",
    date: "05 Jan 2025",
    title: "Cronograma capilar: o guia completo",
    excerpt:
      "Aprenda a montar seu conograma de hidratação, nutrição e recontrução perfeito.",
    readTime: "4 min",
    image: "/blog/blog-6.png",
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
              {/* Área da imagem */}
              <div className="blog-card__image-wrapper">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className="blog-card__image"
                  />
                ) : (
                  // Placeholder exibido enquanto não há imagem real
                  <div className="blog-card__image-placeholder" aria-hidden="true" />
                )}
              </div>

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