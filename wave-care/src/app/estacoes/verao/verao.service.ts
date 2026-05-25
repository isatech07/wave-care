import { useCallback, useEffect, useState } from "react";
import { API_URL, type ApiProduct } from "@/lib/api";
import {
  type CarouselProduct,
  filterProductsBySeason,
  splitProductsAndKits,
} from "@/lib/products";

const SEASON_SLUG = "verao";

/** Busca produtos no backend e filtra apenas os da estação verão */
export async function getProdutosVerao(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return filterProductsBySeason(data, SEASON_SLUG);
}

/** Separa linha de produtos e kits no formato dos carrosséis */
export async function getCarrosselVerao() {
  const filtered = await getProdutosVerao();
  return splitProductsAndKits(filtered);
}

/** Hook de carregamento — mesmo comportamento que antes, com fetch no serviço */
export function useVeraoProducts() {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [kits, setKits] = useState<CarouselProduct[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filtered = await getProdutosVerao();
      setApiProducts(filtered);
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, kits, apiProducts, loading, error, retry: load };
}
