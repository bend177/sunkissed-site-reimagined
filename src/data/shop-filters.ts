import { products, type Product } from "@/data/products";
import { splitTitle, swatchColor } from "@/data/product-details";

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
  const t = p.title.toLowerCase();
  if (t.includes("top")) return "tops";
  if (t.includes("bottom")) return "bottoms";
  return "sets";
};

export const colorOf = (p: Product) => splitTitle(p.title).color.trim();

export const allColors = Array.from(new Set(products.map(colorOf).filter(Boolean)))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ name, swatch: swatchColor(name) }));

export const FEATURED_PRINTS = ["Leopard", "Zebra", "Golden Leopard", "Rouge"];

export const SIZES = ["XS", "S", "M", "L", "XL"];

export type SortKey = "rec" | "new" | "price-asc" | "price-desc";

export const SORT_LABEL: Record<SortKey, string> = {
  rec: "Recommended",
  new: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export const priceNum = (p: Product) => Number(p.price.replace(/[^0-9.]/g, "")) || 0;
