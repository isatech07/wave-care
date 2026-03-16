import "./blog.css"
import { Clock, ArrowRight } from "lucide-react"

const posts = [
  {
    id: 1,
    category: "Cuidados",
    categoryColor: "green",
    title: "Como a Maresia Afeta Seus Cabelos",
    description: "Descubra os efeitos do sal marinho nos fios e aprenda a proteger sua cabeleira durante o verão na praia.",
    author: "Dra. Marina Costa",
    date: "14 de jan. de 2024",
    readTime: "8 min",
    img: "/blog/post1.jpg",
  },
  {
    id: 2,
    category: "Rotinas",
    categoryColor: "pink",
    title: "Rotina Capilar para Cabelos Ondulados",
    description: "Aprenda a montar uma rotina completa que realça os cachos e mantém os fios hidratados.",
    author: "Equipe Wave Care",
    date: "2 de fev. de 2024",
    readTime: "6 min",
    img: "/blog/post2.jpg",
  },
]

export default function Blog() {
  return (
    <section className="blog">
      <div className="container">

        <div className="section-header">
          <h2>Blog Wave Care</h2>
          <p>Dicas, tutoriais e conhecimento sobre cuidados capilares</p>
        </div>

        <div className="blog-list">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              <div className="blog-image">
                <img src={post.img} alt={post.title} />
                <span className={`blog-badge badge-${post.categoryColor}`}>{post.category}</span>
              </div>
              <div className="blog-info">
                <div className="blog-meta">
                  <span>{post.date}</span>
                  <span className="meta-sep"><Clock size={12} /> {post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="blog-footer">
                  <span className="blog-author">Por {post.author}</span>
                  <a href={`/blog/${post.id}`} className="read-more">
                    Ler mais <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}