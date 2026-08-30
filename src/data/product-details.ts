import { products, editorial, type Product } from "@/data/products";

export type ProductDetail = {
  product: Product;
  base: string;
  colorName: string;
  siblings: Product[];
  gallery: string[];
  description: string;
  fit: string[];
  material: string[];
  sizes: string[];
};

const splitTitle = (title: string): { base: string; color: string } => {
  const parts = title.split("—").map((s) => s.trim());
  return { base: parts[0] ?? title, color: parts[1] ?? "" };
};


const swatchMap: Record<string, string> = {
  rouge: "oklch(0.52 0.19 26)",
  "cherry red": "oklch(0.5 0.2 27)",
  "golden leopard": "oklch(0.74 0.11 78)",
  leopard: "oklch(0.7 0.1 70)",
  zebra: "oklch(0.92 0 0)",
  "midnight bloom": "oklch(0.35 0.07 265)",
  "emerald green": "oklch(0.45 0.11 160)",
  "jet black": "oklch(0.18 0 0)",
  "black mamba": "oklch(0.22 0.01 280)",
};

export const swatchColor = (colorName: string) =>
  swatchMap[colorName.toLowerCase()] ?? "oklch(0.8 0.02 84)";

const editorialFill = [editorial.tops, editorial.bottoms, editorial.newArrivals, editorial.allSets];

const sizesFor = (product: Product) =>
  product.category === "towels" ? ["one size"] : ["xs", "s", "m", "l", "xl"];

const copyFor = (product: Product) => {
  switch (product.category) {
    case "towels":
      return {
        description:
          "Sand simply falls off. Woven from ultra-fine long-staple cotton, this towel dries fast, packs flat and only gets softer with every swim.",
        fit: ["Oversized 90 x 170 cm", "Rolls down to fit any beach bag", "Fringed finish"],
        material: ["100% long-staple cotton", "Sand free weave", "Machine wash cold, tumble dry low"],
      };
    case "one-piece":
      return {
        description:
          "A sculpted one piece cut from our signature double-lined fabric. Smooths, lifts and stays exactly where you put it — from first swim to last drink.",
        fit: ["Full coverage seat", "Adjustable straps", "Model is 175 cm wearing a size s"],
        material: ["82% recycled polyamide, 18% elastane", "Fully lined", "Hand wash cold, dry flat"],
      };
    case "resort":
      return {
        description:
          "The layer that takes you from towel to table. Lightweight, breathable and cut to move — designed to be thrown over anything.",
        fit: ["Relaxed fit", "Midi length", "Model is 175 cm wearing a size s"],
        material: ["Sheer quick-dry blend", "Unlined", "Hand wash cold, dry flat"],
      };
    default:
      return {
        description:
          "Our best-selling shape in a buttery, second-skin fabric. Double lined, fully reversible-feeling and tested in real waves — no adjusting required.",
        fit: ["True to size", "Mix and match tops and bottoms", "Model is 175 cm wearing a size s"],
        material: ["82% recycled polyamide, 18% elastane", "Double lined", "Hand wash cold, dry flat"],
      };
  }
};

export function getProductDetail(handle: string): ProductDetail | null {
  const product = products.find((p) => p.handle === handle);
  if (!product) return null;
  const { base, color } = splitTitle(product.title);
  const siblings = products.filter((p) => splitTitle(p.title).base === base);
  const gallery = [
    product.image,
    ...siblings.filter((p) => p.handle !== product.handle).map((p) => p.image),
    ...editorialFill,
  ].slice(0, 5);

  return {
    product,
    base,
    colorName: color || base,
    siblings,
    gallery,
    sizes: sizesFor(product),
    ...copyFor(product),
  };
}

export function relatedProducts(product: Product, limit = 4) {
  const { base } = splitTitle(product.title);
  return products
    .filter((p) => p.handle !== product.handle && splitTitle(p.title).base !== base)
    .sort((a, b) => (a.category === product.category ? -1 : 0) - (b.category === product.category ? -1 : 0))
    .slice(0, limit);
}
