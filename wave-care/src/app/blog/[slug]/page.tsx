

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { posts } from "../data"
import "../blog.css"

type Props = {
  params: Promise<{ slug: string }>
}

// Gera as rotas estáticas para cada post
export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

// Gera o metadata dinâmico para cada post (SEO)
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} – Wave Care`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) return notFound()

  return (
    <main className="post-main">

      {/* ── Breadcrumb ── */}
      <nav className="post-breadcrumb">
        <Link href="/blog" className="post-breadcrumb__back">
          ← Volta ao Blog
        </Link>
        <span className={`blog-card__tag ${post.tagColor}`}>{post.tag}</span>
      </nav>

      {/* ── Cabeçalho do post ── */}
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-header__title">{post.title}</h1>
          <div className="post-header__meta">
            <span className="post-header__author">✍ {post.author}</span>
            <span className="post-header__dot">·</span>
            <span className="post-header__date">{post.date}</span>
            <span className="post-header__dot">·</span>
            <span className="post-header__read">{post.readTime} de leitura</span>
          </div>
        </header>

        {/* Imagem principal */}
        <div className="post-hero-image">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 740px"
            className="post-hero-image__img"
            priority
          />
        </div>

        {/* Subtítulo / resumo */}
        <p className="post-lead">{post.excerpt}</p>

        {/* Parágrafos do conteúdo */}
        <div className="post-body">
          {post.content.map((paragraph, index) => (
            <p key={index} className="post-body__paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* ── Produtos Recomendados ── */}
        {post.products.length > 0 && (
          <section className="post-products">
            <h2 className="post-products__title">Produtos Recomendados</h2>
            <div className="post-products__grid">
              {post.products.map((product, index) => (
                <div key={index} className="product-card">
                  {/* Imagem do produto */}
                  <div className="product-card__image-wrapper">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="product-card__image"
                    />
                  </div>

                  {/* Infos do produto */}
                  <div className="product-card__info">
                    <div className="product-card__rating">
                      <span className="product-card__stars">⭐ {product.rating}</span>
                      <span className="product-card__reviews">({product.reviews})</span>
                    </div>
                    <h3 className="product-card__name">{product.name}</h3>
                    <p className="product-card__description">{product.description}</p>
                    <div className="product-card__footer">
                      <strong className="product-card__price">{product.price}</strong>
                      <button className="product-card__btn">adicionar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}