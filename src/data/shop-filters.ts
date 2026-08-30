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

// Most-carried colors/prints in the live catalog, so every swatch is real.
export const featuredPrints = (catalog: Product[]) =>
  [...colorsIn(catalog)]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 6)
    .map((c) => c.name);

export const SIZES = ["XS", "S", "M", "L", "XL"];

export type SortKey = "rec" | "new" | "price-asc" | "price-desc";

export const SORT_LABEL: Record<SortKey, string> = {
  rec: "Recommended",
  new: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export const priceNum = (p: Product) => Number(p.price.replace(/[^0-9.]/g, "")) || 0;
