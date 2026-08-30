export type ProductVariant = {
  id: string;
  title: string;
  size: string;
  price: string;
  currencyCode: string;
  compareAt?: string | undefined;
  available: boolean;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAt?: string | undefined;
  currencyCode: string;
  image: string;
  images: string[];
  category: "swim" | "one-piece" | "resort" | "towels";
  productType: string;
  tags: string[];
  sizes: string[];
  variants: ProductVariant[];
};

export const editorial = {
  hero: "https://www.getsunkissed.com/cdn/shop/files/cover.png?v=1787332227&width=1920",
  tops: "https://www.getsunkissed.com/cdn/shop/files/LOOK_4_021.jpg?v=1757421804&width=1400",
  bottoms: "https://www.getsunkissed.com/cdn/shop/files/LOOK_5_012.jpg?v=1757417698&width=1400",
  towels:
    "https://www.getsunkissed.com/cdn/shop/files/SUNKISSED-TOWEL.jpg?v=1733101969&width=1920",
  newArrivals:
    "https://www.getsunkissed.com/cdn/shop/files/Untitled-2_000s13sk_LOoOK-2_036.jpg?crop=center&height=1200&v=1787335440&width=1200",
  allSets:
    "https://www.getsunkissed.com/cdn/shop/files/Untitled-2_000s13_LOoOK-2_036.jpg?crop=center&height=1200&v=1787335265&width=1200",
  onePiece:
    "https://www.getsunkissed.com/cdn/shop/files/Untitled-2_0003_LOOK-2_036.png?crop=center&height=1200&v=1787334199&width=1200",
  resort:
    "https://www.getsunkissed.com/cdn/shop/files/Untitled-2.jpg?crop=center&height=1200&v=1787334655&width=1200",
};
