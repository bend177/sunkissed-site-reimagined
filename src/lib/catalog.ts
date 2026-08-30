import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/lib/shopify";
import type { Product } from "@/data/products";

export const catalogQueryOptions = queryOptions({
  queryKey: ["shopify", "catalog"],
  queryFn: fetchCatalog,
  staleTime: 5 * 60 * 1000,
});

const EMPTY: Product[] = [];

export function useCatalog(): Product[] {
  const { data } = useQuery(catalogQueryOptions);
  return data ?? EMPTY;
}
