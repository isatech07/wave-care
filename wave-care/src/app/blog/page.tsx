"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { posts } from "./data";
import "./blog.css";

const FILTERS = ["Todos", "Verão", "Outono", "Inverno", "Primavera", "Guias"];
const PAGE_SIZE = 6;

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const featuredPost = posts[0];
  const allRemaining = posts.slice(1);

  const filtered =
    activeFilter === "Todos"
      ? allRemaining
      : allRemaining.filter((p) => p.tag === activeFilter);

  const visiblePosts = filtered.slice(0, visible);

  return (
    <main className="blog-main">
      <header className="blog-header">
        <p className="blog-eyebrow">Wave Care · Editorial</p>
        <h1 className="blog-title">
          Sua pele merece
          <br />
          <em>atenção o ano todo</em>
        </h1>
        <p className="blog-sub">
          Guias, rotinas e ingredientes para cada estação — escritos por quem
          entende de skincare.
        </p>
      </header>

      <div className="blog-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`blog-filter ${activeFilter === f ? "blog-filter--on" : ""}`}
            onClick={() => { setActiveFilter(f); setVisible(PAGE_SIZE); }}
          >
            {f}
          </button>
        ))}
      </div>

      <Link href={`/blog/${featuredPost.slug}`} className="blog-featured">
        <div className="blog-featured__image">
          {featuredPost.image ? (
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="blog-featured__img"
              priority
            />
          ) : (
            <div className="blog-featured__placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="blog-featured__body">
          <span className={`blog-tag ${featuredPost.tagColor}`}>
            {featuredPost.tag}
          </span>
          <h2 className="blog-featured__title">{featuredPost.title}</h2>
          <p className="blog-featured__excerpt">{featuredPost.excerpt}</p>
          <div className="blog-featured__meta">
            <strong>{featuredPost.author}</strong>
            <span className="blog-featured__dot">·</span>
            <span>{featuredPost.date}</span>
            <span className="blog-featured__dot">·</span>
            <span>{featuredPost.readTime} de leitura</span>
          </div>
          <div className="blog-featured__cta">
            <span className="blog-featured__label">Artigo em destaque</span>
            <span className="blog-featured__arrow">→</span>
          </div>
        </div>
      </Link>

      <section className="blog-grid-wrap">
        <div className="blog-section-label">
          <span>Mais recentes</span>
        </div>
        {visiblePosts.length > 0 ? (
          <div className="blog-grid">
            {visiblePosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card">
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
                <div className="blog-card__meta">
                  <span className={`blog-tag ${post.tagColor}`}>{post.tag}</span>
                  <span className="blog-card__date">{post.date}</span>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__foot">
                  <span className="blog-card__read">{post.readTime} de leitura</span>
                  <span className="blog-card__arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="blog-empty">Nenhum artigo encontrado para esta categoria.</p>
        )}
      </section>

      <div className="blog-footer-strip">
        <p>Mostrando {visiblePosts.length} de {filtered.length} artigos</p>
        {visible < filtered.length && (
          <button className="blog-load-more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Carregar mais
          </button>
        )}
      </div>
    </main>
  );
}