import type { Product } from "@/data/products";
import { splitTitle, swatchColor, swatchFocus } from "@/data/product-details";

export type ProductType = "sets" | "tops" | "bottoms" | "one-pieces" | "resort" | "towels";

export const TYPE_LABEL: Record<ProductType, string> = {
  sets: "Sets",
  tops: "Tops",
  bottoms: "Bottoms",
  "one-pieces": "One Pieces",
  resort: "Dresses & Resort",
  towels: "Beach Towels",
};

export const TYPE_ORDER: ProductType[] = [
  "sets",
  "tops",
  "bottoms",
  "one-pieces",
  "resort",
  "towels",
];

export const productType = (p: Product): ProductType => {
  if (p.category === "towels") return "towels";
  if (p.category === "resort") return "resort";
  if (p.category === "one-piece") return "one-pieces";
  const tags = p.tags.map((t) => t.toLowerCase());
  const t = p.title.toLowerCase();
  if (tags.includes("top") || t.includes("top")) return "tops";
  if (tags.includes("bottom") || t.includes("bottom")) return "bottoms";
  return "sets";
};

export const colorOf = (p: Product) => splitTitle(p.title).color.trim();

export const colorsIn = (catalog: Product[]) =>
  Array.from(new Set(catalog.map(colorOf).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      swatch: swatchColor(name),
      count: catalog.filter((p) => colorOf(p) === name).length,
      image: catalog.find((p) => colorOf(p) === name)?.image ?? "",
      focusY: swatchFocus(catalog.find((p) => colorOf(p) === name)?.title ?? ""),
    }));

// Featured prints are merchandised from Shopify tags.
// Tag any product with "featured-print" to feature its colorway.
// Optionally control order with "featured-print-1", "featured-print-2", ...
// If no product is tagged, we fall back to the most-carried colorways.
const FEATURED_TAG = /^featured[-\s]?print(?:[-\s]?(\d+))?$/i;

const featuredRank = (p: Product): number | null => {
  let rank: number | null = null;
  for (const t of p.tags) {
    const m = FEATURED_TAG.exec(t.trim());
    if (!m) continue;
    const n = m[1] ? Number(m[1]) : 999;
    if (rank === null || n < rank) rank = n;
  }
  return rank;
};

export const featuredPrints = (catalog: Product[]) => {
  const ranked = new Map<string, number>();
  for (const p of catalog) {
    const rank = featuredRank(p);
    if (rank === null) continue;
    const color = colorOf(p);
    if (!color) continue;
    const prev = ranked.get(color);
    if (prev === undefined || rank < prev) ranked.set(color, rank);
  }

  if (ranked.size > 0) {
    return [...ranked.entries()]
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name);
  }

  // Fallback: colorways of the best-selling products (catalog arrives from
  // Shopify sorted by BEST_SELLING), first 6 distinct prints.
  const seen: string[] = [];
  for (const p of catalog) {
    const c = colorOf(p);
    if (c && !seen.includes(c)) seen.push(c);
    if (seen.length === 6) break;
  }
  return seen;
};


export const SIZES = ["XS", "S", "M", "L", "XL"];

export type SortKey = "rec" | "new" | "price-asc" | "price-desc";

export const SORT_LABEL: Record<SortKey, string> = {
  rec: "Recommended",
  new: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export const priceNum = (p: Product) => Number(p.price.replace(/[^0-9.]/g, "")) || 0;
