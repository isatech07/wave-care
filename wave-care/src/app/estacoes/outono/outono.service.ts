import { useCallback, useEffect, useState } from "react";
import { API_URL, type ApiProduct } from "@/lib/api";
import {
  type CarouselProduct,
  filterProductsBySeason,
  splitProductsAndKits,
} from "@/lib/products";

const SEASON_SLUG = "outono";

/** Busca produtos no backend e filtra apenas os da estação outono */
export async function getProdutosOutono(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return filterProductsBySeason(data, SEASON_SLUG);
}

/** Separa linha de produtos e kits no formato dos carrosséis */
export async function getCarrosselOutono() {
  const filtered = await getProdutosOutono();
  return splitProductsAndKits(filtered);
}

/** Hook de carregamento — mesmo comportamento que antes, com fetch no serviço */
export function useOutonoProducts() {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [kits, setKits] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { products: lineProducts, kits: seasonKits } = await getCarrosselOutono();
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, kits, loading, error, retry: load };
}
