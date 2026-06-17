"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { posts } from "../data";
import "../blog.css";
import { getProducts, type ApiProduct } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import Cart, { CartFloatingButton } from "@/components/Cart/Cart";

// ── Constantes ──────────────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

// ── Página do Post ──────────────────────────────────────────────────────────────
export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  const { addItem, openCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ── Carrega produtos reais associados ao post ─────────────────────────────────
  useEffect(() => {
    if (!post) return;

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const all = await getProducts();
        const ids = post.products?.map((p) => p.productId) ?? [];
        setRelatedProducts(all.filter((p) => ids.includes(p.id)));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [post]);

  if (!post) return notFound();

  // ── Adicionar ao carrinho ────────────────────────────────────────────────────
  const handleAddToCart = (product: ApiProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    openCart();
  };

  // ── Renderização ─────────────────────────────────────────────────────────────
  return (
    <main className="post-main">
      {/* Breadcrumb estilizado */}
      <nav className="post-breadcrumb">
        <Link href="/blog" className="post-breadcrumb__back">
          ← Blog
        </Link>
        <span className="post-breadcrumb__divider">/</span>
        <span className={`blog-tag ${post.tagColor}`}>{post.tag}</span>
      </nav>

      <article className="post-article">
        {/* Cabeçalho refinado */}
        <header className="post-header">
          <h1 className="post-header__title">{post.title}</h1>
          <div className="post-header__meta">
            <span className="post-header__author">{post.author}</span>
            <span className="post-header__dot">·</span>
            <span>{post.date}</span>
            <span className="post-header__dot">·</span>
            <span className="post-header__read">{post.readTime} de leitura</span>
          </div>
        </header>

        {/* Imagem de capa com moldura elegante */}
        <div className="post-hero-image">
          <Image
            src={post.image || PLACEHOLDER_IMAGE}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="post-hero-image__img"
            priority
          />
          <div className="post-hero-image__overlay" />
        </div>

        {/* Texto introdutório (lead) */}
        <p className="post-lead">{post.excerpt}</p>

        {/* Corpo do artigo com tipografia melhorada */}
        <div className="post-body">
          {post.content.map((paragraph, index) => (
            <p key={index} className="post-body__paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Produtos recomendados */}
        {loadingProducts ? (
          <section className="post-products">
            <h2 className="post-products__title">Produtos que aparecem neste artigo</h2>
            <div className="post-products__grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="product-card product-card--skeleton">
                  <div className="product-card__image-skeleton" />
                  <div className="product-card__info">
                    <div className="skeleton-line skeleton-line--title" />
                    <div className="skeleton-line skeleton-line--text" />
                    <div className="skeleton-line skeleton-line--text short" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : relatedProducts.length > 0 ? (
          <section className="post-products">
            <h2 className="post-products__title">Produtos que aparecem neste artigo</h2>
            <div className="post-products__grid">
              {relatedProducts.map((product) => {
                const added = addedIds.has(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card__image-wrapper">
                      <Image
                        src={product.image || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="product-card__image"
                      />
                    </div>
                    <div className="product-card__info">
                      <div className="product-card__rating">
                        <span className="product-card__stars">
                          {product.rating ? `★ ${product.rating.toFixed(1)}` : "—"}
                        </span>
                        <span className="product-card__reviews">
                          ({product.reviews ?? 0} avaliações)
                        </span>
                      </div>
                      <h3 className="product-card__name">{product.name}</h3>
                      <p className="product-card__description">{product.description}</p>
                      <div className="product-card__footer">
                        <strong className="product-card__price">
                          {product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </strong>
                        <button
                          className={`product-card__btn ${added ? "product-card__btn--added" : ""}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={added}
                        >
                          {added ? "Adicionado ✓" : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </article>

      <CartFloatingButton />
      <Cart />
    </main>
  );
}