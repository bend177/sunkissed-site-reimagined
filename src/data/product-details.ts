import type { CSSProperties } from "react";
import { editorial, type Product } from "@/data/products";
import { swatchImages } from "@/data/swatch-images";


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

export const splitTitle = (title: string): { base: string; color: string } => {
  const parts = title.split(" - ").map((s) => s.trim());
  return { base: parts[0] ?? title, color: parts.slice(1).join(" - ") ?? "" };
};

const swatchMap: Record<string, string> = {
  rouge: "oklch(0.52 0.19 26)",
  "cherry red": "oklch(0.5 0.2 27)",
  "golden leopard": "oklch(0.74 0.11 78)",
  leopard: "oklch(0.7 0.1 70)",
  zebra: "oklch(0.92 0 0)",
  "midnight bloom": "oklch(0.35 0.07 265)",
  "emerald green": "oklch(0.45 0.11 160)",
  "jackfruit green": "oklch(0.62 0.13 145)",
  "jet black": "oklch(0.18 0 0)",
  "coco white": "oklch(0.96 0.01 90)",
  "black mamba": "oklch(0.22 0.01 280)",
  "klara blue": "oklch(0.55 0.13 245)",
  turquoise: "oklch(0.72 0.11 195)",
  "spicy orange": "oklch(0.68 0.17 45)",
  "just pink": "oklch(0.78 0.11 5)",
  "cosmic purple": "oklch(0.45 0.14 300)",
  "espresso martini": "oklch(0.32 0.05 55)",
  "sunshine yellow": "oklch(0.87 0.15 95)",
  brass: "oklch(0.72 0.09 85)",
  acid: "oklch(0.86 0.18 120)",
  coral: "oklch(0.72 0.15 30)",
  eden: "oklch(0.42 0.07 165)",
  floralia: "oklch(0.78 0.09 350)",
  cheetafly: "oklch(0.76 0.1 75)",
  "wild zebra": "oklch(0.9 0.01 90)",
};

export const swatchColor = (colorName: string) =>
  swatchMap[colorName.toLowerCase()] ?? "oklch(0.8 0.02 84)";

// Prints get a small generated pattern instead of a flat fill.
const printMap: Record<string, CSSProperties> = {
  leopard: {
    backgroundColor: "oklch(0.78 0.09 72)",
    backgroundImage:
      "radial-gradient(ellipse 30% 22% at 25% 28%, oklch(0.28 0.05 60) 60%, transparent 62%), radial-gradient(ellipse 26% 20% at 68% 55%, oklch(0.28 0.05 60) 60%, transparent 62%), radial-gradient(ellipse 24% 18% at 40% 80%, oklch(0.28 0.05 60) 60%, transparent 62%), radial-gradient(ellipse 22% 18% at 85% 15%, oklch(0.28 0.05 60) 60%, transparent 62%)",
  },
  "golden leopard": {
    backgroundColor: "oklch(0.83 0.11 82)",
    backgroundImage:
      "radial-gradient(ellipse 30% 22% at 22% 30%, oklch(0.34 0.06 62) 60%, transparent 62%), radial-gradient(ellipse 26% 20% at 70% 58%, oklch(0.34 0.06 62) 60%, transparent 62%), radial-gradient(ellipse 24% 18% at 45% 82%, oklch(0.34 0.06 62) 60%, transparent 62%), radial-gradient(ellipse 22% 18% at 86% 18%, oklch(0.34 0.06 62) 60%, transparent 62%)",
  },
  zebra: {
    backgroundColor: "oklch(0.96 0 0)",
    backgroundImage:
      "repeating-linear-gradient(115deg, oklch(0.18 0 0) 0 3px, transparent 3px 8px)",
  },
  cheetafly: {
    backgroundColor: "oklch(0.8 0.1 76)",
    backgroundImage:
      "radial-gradient(ellipse 26% 20% at 26% 30%, oklch(0.3 0.05 60) 60%, transparent 62%), radial-gradient(ellipse 24% 18% at 70% 60%, oklch(0.3 0.05 60) 60%, transparent 62%), radial-gradient(ellipse 22% 16% at 44% 82%, oklch(0.3 0.05 60) 60%, transparent 62%)",
  },
  "wild zebra": {
    backgroundColor: "oklch(0.94 0.01 90)",
    backgroundImage:
      "repeating-linear-gradient(100deg, oklch(0.2 0 0) 0 3px, transparent 3px 9px)",
  },
  floralia: {
    backgroundColor: "oklch(0.9 0.04 350)",
    backgroundImage:
      "radial-gradient(circle 20% at 32% 34%, oklch(0.62 0.14 350) 60%, transparent 62%), radial-gradient(circle 16% at 70% 66%, oklch(0.55 0.1 150) 60%, transparent 62%)",
  },
  "black mamba": {
    backgroundColor: "oklch(0.22 0.01 280)",
    backgroundImage:
      "repeating-linear-gradient(115deg, oklch(0.45 0.02 280) 0 2px, transparent 2px 7px)",
  },
  "midnight bloom": {
    backgroundColor: "oklch(0.35 0.07 265)",
    backgroundImage:
      "radial-gradient(circle 22% at 30% 30%, oklch(0.72 0.09 330) 60%, transparent 62%), radial-gradient(circle 18% at 70% 65%, oklch(0.72 0.09 330) 60%, transparent 62%)",
  },
};

// Prints need the real photo texture; solid colorways look cleaner as a fill.
const PRINT_WORDS =
  /leopard|zebra|cheeta|cheetah|tiger|snake|python|mamba|floral|floralia|bloom|animal|print|paisley|gingham|stripe|check|tie.?dye/i;

export const isPrint = (colorName: string) => PRINT_WORDS.test(colorName);

// Real swatch: a tight crop of the actual product photo for that colorway.
// Where the garment sits in a full-body shot, so the crop lands on fabric.
export const swatchFocus = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("bottom")) return 62;
  if (t.includes("top") || t.includes("bra")) return 33;
  if (t.includes("towel") || t.includes("sarong") || t.includes("dress")) return 50;
  return 40;
};

export const realSwatchStyle = (
  image: string | undefined,
  colorName: string,
  focusY = 40,
  flat = false,
): CSSProperties => {
  if (swatchImages[colorName.toLowerCase()]) return swatchStyle(colorName);
  return image && isPrint(colorName)
    ? {
        backgroundImage: `url(${image})`,
        backgroundSize: flat ? "cover" : "620%",
        backgroundPosition: flat ? "50% 50%" : `50% ${focusY}%`,
        backgroundRepeat: "no-repeat",
      }
    : swatchStyle(colorName);
};


// Flat goods (towels, sarongs) photograph the print edge to edge, which makes
// the truest swatch. Prefer one of those images for a print colorway.
const flatCache = new Map<string, string | undefined>();

export const flatPrintImage = (catalog: Product[], colorName: string) => {
  const key = colorName.toLowerCase();
  if (!flatCache.has(key)) {
    const match = catalog.find(
      (p) =>
        splitTitle(p.title).color.toLowerCase() === key &&
        (p.category === "towels" || /towel|sarong|blanket|throw/i.test(p.title)),
    );
    flatCache.set(key, match?.image);
  }
  return flatCache.get(key);
};

// One entry point: real uploaded fabric chip when we have it, generated
// pattern/fill otherwise.
export const swatchFill = (
  _catalog: Product[],
  colorName: string,
  _fallbackImage?: string,
  _focusY = 40,
): CSSProperties => swatchStyle(colorName);

export const swatchStyle = (colorName: string): CSSProperties => {
  const chip = swatchImages[colorName.toLowerCase()];
  if (chip)
    return {
      backgroundImage: `url(${chip})`,
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
      backgroundRepeat: "no-repeat",
    };
  return printMap[colorName.toLowerCase()] ?? { backgroundColor: swatchColor(colorName) };
};


const editorialFill = [editorial.tops, editorial.bottoms, editorial.newArrivals, editorial.allSets];

const copyFor = (product: Product) => {
  switch (product.category) {
    case "towels":
      return {
        fit: ["Oversized", "Rolls down to fit any beach bag", "Sand free weave"],
        material: [
          "100% long-staple cotton",
          "Sand free weave",
          "Machine wash cold, tumble dry low",
        ],
      };
    case "one-piece":
      return {
        fit: ["Full coverage seat", "Adjustable straps", "Model is 175 cm wearing a size s"],
        material: ["82% recycled polyamide, 18% elastane", "Fully lined", "Hand wash cold, dry flat"],
      };
    case "resort":
      return {
        fit: ["Relaxed fit", "Midi length", "Model is 175 cm wearing a size s"],
        material: ["Sheer quick-dry blend", "Unlined", "Hand wash cold, dry flat"],
      };
    default:
      return {
        fit: ["True to size", "Mix and match tops and bottoms", "Model is 175 cm wearing a size s"],
        material: ["82% recycled polyamide, 18% elastane", "Double lined", "Hand wash cold, dry flat"],
      };
  }
};

export function getProductDetail(catalog: Product[], handle: string): ProductDetail | null {
  const product = catalog.find((p) => p.handle === handle);
  if (!product) return null;
  const { base, color } = splitTitle(product.title);
  const siblings = catalog.filter((p) => splitTitle(p.title).base === base);
  const gallery = [
    ...product.images,
    ...siblings.filter((p) => p.handle !== product.handle).map((p) => p.image),
    ...editorialFill,
  ]
    .filter(Boolean)
    .slice(0, 5);

  return {
    product,
    base,
    colorName: color || base,
    siblings,
    gallery,
    sizes: product.sizes.length ? product.sizes : ["one size"],
    description: product.description,
    ...copyFor(product),
  };
}

export function siblingColors(catalog: Product[], product: Product) {
  const { base } = splitTitle(product.title);
  const colors = catalog
    .filter((p) => splitTitle(p.title).base === base)
    .map((p) => ({
      handle: p.handle,
      colorName: splitTitle(p.title).color || base,
      swatch: swatchColor(splitTitle(p.title).color || base),
      image: p.image,
      focusY: swatchFocus(p.title),
      current: p.handle === product.handle,
    }));

  // The colorway shown on the card always leads, so its own swatch is never
  // hidden behind the +N control.
  const currentIndex = colors.findIndex((c) => c.current);
  if (currentIndex > 0) {
    const [currentColor] = colors.splice(currentIndex, 1);
    colors.unshift(currentColor);
  }
  return colors;
}

export function relatedProducts(catalog: Product[], product: Product, limit = 4) {
  const { base } = splitTitle(product.title);
  return catalog
    .filter((p) => p.handle !== product.handle && splitTitle(p.title).base !== base)
    .sort(
      (a, b) =>
        (a.category === product.category ? -1 : 0) - (b.category === product.category ? -1 : 0),
    )
    .slice(0, limit);
}
