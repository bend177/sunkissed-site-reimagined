export type Product = {
  title: string;
  price: string;
  compareAt?: string;
  handle: string;
  image: string;
  category: "swim" | "one-piece" | "resort" | "towels";
};

const cdn = (src: string, w = 900) => `${src}${src.includes("?") ? "&" : "?"}width=${w}`;

export const products: Product[] = [
  {
    title: "Le Bandeau Strapless Top - Rouge",
    price: "79",
    handle: "le-bandeau-strapless-top-rouge",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/Sunkissed-strapless-set-lookbook-shir-levy_0006_sunk4.913644copy_a6294549-f8ae-419e-9ef7-bca5a5a566bf.jpg?v=1762528242",
    ),
  },
  {
    title: "Le Triangle Top - Golden Leopard",
    price: "79",
    handle: "le-triangle-top-golden-leopard",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/Sunkissed-strapless-set-lookbook-shir-levy_0022_sunk4_0000s_0002_sunk4.914718_b3977c17-8abd-44e8-a9b5-f7676a3d2d7d.jpg?v=1762529840",
    ),
  },
  {
    title: "Le Sporty Top - Zebra",
    price: "79",
    handle: "le-sporty-top-zebra",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-sporty-zebra6_516cadb8-2d6b-462b-804f-c621c0f86221.jpg?v=1762529060",
    ),
  },
  {
    title: "Le Bas Cheeky Bottom - Cherry Red",
    price: "79",
    handle: "le-bas-cheeky-bottom-cherry-red",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/Sunkissed-strapless-set-lookbook-shir-levy_0007_makefabriclessscrunched_94255bec-eaf2-4f1b-876c-22532dd332a8.jpg?v=1762514156",
    ),
  },
  {
    title: "Le Triangle Bottom - Midnight Bloom",
    price: "79",
    handle: "le-triangle-bottom-midnight-bloom",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/Sunkissed-strapless-set-lookbook-shir-levy_0022_sunk4_0000s_0000_sunk4.915072_25444388-ccc8-46b5-abb0-67e34ef4b308.jpg?v=1762515315",
    ),
  },
  {
    title: "Le Bas Cheeky Bottom - Emerald Green",
    price: "79",
    handle: "le-bas-cheeky-bottom-emerald-green",
    category: "swim",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/Sunkissed-strapless-set-lookbook-shir-levy_0014_makefabriclesssrunched_dd3339cc-d619-4842-a3da-490a6647adfb.jpg?v=1762513894",
    ),
  },
  {
    title: "La Sirena One Piece - Zebra",
    price: "175",
    handle: "la-sirena-one-piece-zebra",
    category: "one-piece",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/2-sunkissed-sirena-zebra_0003_LOOK2_021.jpg?v=1759321836",
    ),
  },
  {
    title: "La Sirena One Piece - Cherry Red",
    price: "175",
    handle: "la-sirena-one-piece-cherry-red",
    category: "one-piece",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-sirena-cherry-red4.jpg?v=1762642390",
    ),
  },
  {
    title: "La Sirena One Piece - Leopard",
    price: "175",
    handle: "la-sirena-one-piece-leopard",
    category: "one-piece",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-sirena-leopard1.jpg?v=1762602912",
    ),
  },
  {
    title: "Le Bon Bon - Jet Black",
    price: "160",
    handle: "le-bon-bon-black-1",
    category: "one-piece",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/One-Piece-Black-Sunkissed3.jpg?v=1762640171",
    ),
  },
  {
    title: "Beach To Bar Dress - Leopard",
    price: "160",
    handle: "dress-leopard",
    category: "resort",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-dress-leopard3.jpg?v=1759322868",
    ),
  },
  {
    title: "Beach To Bar Dress - Black Mamba",
    price: "160",
    handle: "dress-black-mamba",
    category: "resort",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/2-sunkissed-dress-black-mamba-lifestyle_0000_LOOK6_017.jpg?v=1759322918",
    ),
  },
  {
    title: "Sarong - Rouge",
    price: "68",
    handle: "sarong-rouge",
    category: "resort",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-skirt-rouge1.jpg?v=1759323098",
    ),
  },
  {
    title: "Sarong - Leopard",
    price: "68",
    handle: "sarong-leopard",
    category: "resort",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/1-sunkissed-skirt-leopard1.jpg?v=1759323124",
    ),
  },
  {
    title: "Bermuda • Sand Free Beach Towel",
    price: "54",
    handle: "striped-bermuda-towel",
    category: "towels",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/BERMUDA-ROLLED-RED-SUNKISSED-BEACH-TOWEL.png?v=1695261552",
    ),
  },
  {
    title: "Marbella • Sand Free Beach Towel",
    price: "54",
    handle: "marbella",
    category: "towels",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/MARBELLA-ROLLED-YELLOW-SUNKISSED-BEACH-TOWEL.png?v=1695261703",
    ),
  },
  {
    title: "Mykonos • Sand Free Beach Towel",
    price: "58",
    handle: "stonewashed-mykonos-towel",
    category: "towels",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/MYKONOS-ROLLED-BLUE-SUNKISSED-BEACH-TOWEL.png?v=1695261765",
    ),
  },
  {
    title: "Tel Aviv • Sand Free Beach Towel",
    price: "58",
    handle: "tie-dye-tel-aviv-towel",
    category: "towels",
    image: cdn(
      "https://cdn.shopify.com/s/files/1/0090/9341/4976/files/TELAVIV-ROLLED-RAINBOW-TIEDYE-SUNKISSED-BEACH-TOWEL.png?v=1695261881",
    ),
  },
];

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
