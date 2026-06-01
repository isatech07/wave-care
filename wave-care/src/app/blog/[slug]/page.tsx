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

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  const { addItem, openCart } = useCart();
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getProducts()
      .then((all) => {
        // filtra só os produtos do post pelo productId
        const ids = post?.products.map((p) => p.productId) ?? [];
        setApiProducts(all.filter((p) => ids.includes(p.id)));
      })
      .catch(console.error);
  }, [post]);

  if (!post) return notFound();

  const handleAddToCart = (product: ApiProduct) => {
    addItem({
      id:    product.id,
      name:  product.name,
      price: product.price,
      image: product.image,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    openCart();
  };

  return (
    <main className="post-main">

      {/* ── Breadcrumb ── */}
      <nav className="post-breadcrumb">
        <Link href="/blog" className="post-breadcrumb__back">
          ← Volta ao Blog
        </Link>
        <span className={`blog-tag ${post.tagColor}`}>{post.tag}</span>
      </nav>

      <article className="post-article">

        {/* ── Cabeçalho ── */}
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

        {/* ── Imagem hero ── */}
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

        {/* ── Lead ── */}
        <p className="post-lead">{post.excerpt}</p>

        {/* ── Conteúdo ── */}
        <div className="post-body">
          {post.content.map((paragraph, index) => (
            <p key={index} className="post-body__paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* ── Produtos do banco ── */}
        {apiProducts.length > 0 && (
          <section className="post-products">
            <h2 className="post-products__title">Produtos Recomendados</h2>
            <div className="post-products__grid">
              {apiProducts.map((product) => {
                const added = addedIds.has(product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card__image-wrapper">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="product-card__image"
                      />
                    </div>
                    <div className="product-card__info">
                      <div className="product-card__rating">
                        <span className="product-card__stars">
                          ⭐ {product.rating ?? "—"}
                        </span>
                        <span className="product-card__reviews">
                          ({product.reviews ?? 0})
                        </span>
                      </div>
                      <h3 className="product-card__name">{product.name}</h3>
                      <p className="product-card__description">
                        {product.description}
                      </p>
                      <div className="product-card__footer">
                        <strong className="product-card__price">
                          {product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </strong>
                        <button
                          className="product-card__btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          {added ? "adicionado ✓" : "adicionar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </article>

      <CartFloatingButton />
      <Cart />

    </main>
  );
}