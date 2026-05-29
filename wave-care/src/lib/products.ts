import { useCallback, useEffect, useState } from "react";
import { ApiProduct, getProducts } from "./api";

export interface CarouselProduct {
  id?: number;
  name: string;
  desc: string;
  price: string;
  size?: string;
  rating: number;
  reviews: number;
  img?: string;
  includes?: string[];
}

export function formatPriceBRL(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function mapToCarouselProduct(product: ApiProduct): CarouselProduct {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  
  // Log the incoming product image for debugging
  console.log('Product image from API:', product.image, 'for product:', product.name);
  
  // Handle image URL construction
  let imageUrl: string | undefined;
  if (product.image) {
    // If image starts with http, use as-is
    if (product.image.startsWith('http')) {
      imageUrl = product.image;
    }
    // If image starts with /, prefix with API_URL
    else if (product.image.startsWith('/')) {
      imageUrl = `${API_URL}${product.image}`;
    }
    // Otherwise, assume it's a relative path and add /
    else {
      imageUrl = `${API_URL}/${product.image}`;
    }
    console.log('Constructed image URL:', imageUrl);
  } else {
    console.log('Product has no image field, using fallback');
    imageUrl = '/products/placeholder.png';
  }

  return {
    id: product.id,
    name: product.name,
    desc: product.description,
    price: formatPriceBRL(product.price),
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    img: imageUrl,
  };
}

export function filterProductsBySeason(products: ApiProduct[], seasonSlug: string): ApiProduct[] {
  const slug = seasonSlug.toLowerCase();
  return products.filter((p) => p.season?.toLowerCase() === slug);
}

export function splitProductsAndKits(products: ApiProduct[]) {
  const kits = products
    .filter((p) => p.category?.toLowerCase() === "kit")
    .map(mapToCarouselProduct);
  const lineProducts = products
    .filter((p) => p.category?.toLowerCase() !== "kit")
    .map(mapToCarouselProduct);
  return { products: lineProducts, kits };
}

export function useSeasonProducts(seasonSlug: string) {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [kits, setKits] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      const filtered = filterProductsBySeason(data, seasonSlug);
      const { products: lineProducts, kits: seasonKits } = splitProductsAndKits(filtered);
      setProducts(lineProducts);
      setKits(seasonKits);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar produtos";
      setError(message);
      setProducts([]);
      setKits([]);
    } finally {
      setLoading(false);
    }
  }, [seasonSlug]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, kits, loading, error, retry: load };
}
