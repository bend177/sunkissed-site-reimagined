import { toast } from "sonner";
import type { Product, ProductVariant } from "@/data/products";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "sunkissedx.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "738d533b3ef902ad435692281150e749";

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<any> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    if (typeof window !== "undefined") {
      toast.error("Shopify: Payment required", {
        description:
          "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
      });
    }
    return null;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: BEST_SELLING) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount } }
          images(first: 8) { edges { node { url altText } } }
          options { name values }
          variants(first: 30) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

type Edge<T> = { node: T };

type RawProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  images: { edges: Edge<{ url: string; altText: string | null }>[] };
  options: { name: string; values: string[] }[];
  variants: {
    edges: Edge<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      compareAtPrice: { amount: string } | null;
      selectedOptions: { name: string; value: string }[];
    }>[];
  };
};

const money = (amount: string) => {
  const n = Number(amount);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

const categoryFor = (productType: string): Product["category"] => {
  const t = productType.toLowerCase();
  if (t.includes("towel") || t.includes("blanket") || t.includes("throw")) return "towels";
  if (t.includes("one piece")) return "one-piece";
  if (t.includes("separate") || t.includes("set") || t.includes("bikini")) return "swim";
  return "resort";
};

const sized = (url: string, w = 900) =>
  `${url}${url.includes("?") ? "&" : "?"}width=${w}`;

function mapProduct(node: RawProduct): Product {
  const variants: ProductVariant[] = node.variants.edges.map((v) => ({
    id: v.node.id,
    title: v.node.title,
    size:
      v.node.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ??
      (v.node.title === "Default Title" ? "one size" : v.node.title),
    price: money(v.node.price.amount),
    currencyCode: v.node.price.currencyCode,
    compareAt: v.node.compareAtPrice ? money(v.node.compareAtPrice.amount) : undefined,
    available: v.node.availableForSale,
    selectedOptions: v.node.selectedOptions,
  }));

  const images = node.images.edges.map((i) => sized(i.node.url));
  const price = money(node.priceRange.minVariantPrice.amount);
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAt = compareRaw && Number(compareRaw) > Number(price) ? money(compareRaw) : undefined;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    price,
    compareAt,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    image: images[0] ?? "",
    images,
    category: categoryFor(node.productType),
    productType: node.productType,
    tags: node.tags,
    sizes: Array.from(new Set(variants.map((v) => v.size))),
    variants,
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  const all: Product[] = [];
  let after: string | null = null;

  for (let page = 0; page < 4; page += 1) {
    const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 250, after });
    const conn = data?.data?.products;
    if (!conn) break;
    all.push(...conn.edges.map((e: Edge<RawProduct>) => mapProduct(e.node)));
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }

  return all;
}
