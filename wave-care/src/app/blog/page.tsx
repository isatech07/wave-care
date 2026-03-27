// src/app/blog/page.tsx

import Link from "next/link"
import Image from "next/image"
import { posts } from "./data"
import "./blog.css"

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