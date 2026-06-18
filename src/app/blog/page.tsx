"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { posts } from "./data";
import "./blog.css";

// ── Constantes ──────────────────────────────────────────────────────────────────
const FILTERS = ["Todos", "Verão", "Outono", "Inverno", "Primavera", "Guias"];
const PAGE_SIZE = 6;

// ── Componente principal ────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Post em destaque (primeiro) e restante
  const featuredPost = posts[0];
  const allRemaining = posts.slice(1);

  // Filtragem por tag
  const filtered = useMemo(() => {
    if (activeFilter === "Todos") return allRemaining;
    return allRemaining.filter((p) => p.tag === activeFilter);
  }, [activeFilter]);

  const visiblePosts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisible(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisible((prev) => prev + PAGE_SIZE);
  };

  // ── Renderização ─────────────────────────────────────────────────────────────
  return (
    <main className="blog-main">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero__content">
          <span className="blog-hero__eyebrow">Editorial</span>
          <h1 className="blog-hero__title">
            Histórias de<br />
            <em>beleza & cuidado</em>
          </h1>
          <p className="blog-hero__sub">
            Guias, rotinas e ingredientes para cada estação — escritos por quem
            entende de skincare.
          </p>
        </div>
        <div className="blog-hero__visual">
          <div className="blog-hero__shape" />
          <div className="blog-hero__accent" />
        </div>
      </section>

      {/* Filtros */}
      <nav className="blog-filters" aria-label="Filtrar artigos por categoria">
        <span className="blog-filters__label">Filtrar por:</span>
        <div className="blog-filters__list">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`blog-filter ${activeFilter === filter ? "blog-filter--active" : ""}`}
              onClick={() => handleFilterClick(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
      </nav>

      {/* Artigo em Destaque (assimétrico) */}
      <Link href={`/blog/${featuredPost.slug}`} className="blog-featured">
        <div className="blog-featured__media">
          {featuredPost.image ? (
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="blog-featured__img"
              priority
            />
          ) : (
            <div className="blog-featured__placeholder" />
          )}
          <div className="blog-featured__overlay">
            <span className={`blog-tag blog-tag--large ${featuredPost.tagColor}`}>
              {featuredPost.tag}
            </span>
          </div>
        </div>
        <div className="blog-featured__body">
          <h2 className="blog-featured__title">{featuredPost.title}</h2>
          <p className="blog-featured__excerpt">{featuredPost.excerpt}</p>
          <div className="blog-featured__meta">
            <span className="blog-featured__author">{featuredPost.author}</span>
            <span className="blog-featured__dot">·</span>
            <span>{featuredPost.date}</span>
            <span className="blog-featured__dot">·</span>
            <span>{featuredPost.readTime} de leitura</span>
          </div>
          <span className="blog-featured__cta">
            Ler artigo completo
            <span className="blog-featured__arrow">→</span>
          </span>
        </div>
      </Link>

      {/* Grade de artigos recentes */}
      <section className="blog-grid-section">
        <h2 className="blog-grid-section__title">Artigos Recentes</h2>
        {visiblePosts.length > 0 ? (
          <div className="blog-grid">
            {visiblePosts.map((post, index) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className={`blog-card ${index === 0 ? "blog-card--large" : ""}`}
              >
                <div className="blog-card__image-wrap">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                      className="blog-card__image"
                    />
                  ) : (
                    <div className="blog-card__image-placeholder" />
                  )}
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__header">
                    <span className={`blog-tag ${post.tagColor}`}>{post.tag}</span>
                    <span className="blog-card__date">{post.date}</span>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <span className="blog-card__read">{post.readTime} de leitura</span>
                    <span className="blog-card__arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="blog-empty">Nenhum artigo encontrado para esta categoria.</p>
        )}

        {/* Carregar mais */}
        {hasMore && (
          <div className="blog-load-more-wrap">
            <button className="blog-load-more" onClick={handleLoadMore}>
              Carregar mais artigos
              <span className="blog-load-more__icon">↓</span>
            </button>
            <p className="blog-load-more__count">
              Exibindo {visiblePosts.length} de {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}