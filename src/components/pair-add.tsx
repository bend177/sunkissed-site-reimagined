import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { splitTitle } from "@/data/product-details";
import { colorOf, productType } from "@/data/shop-filters";
import { useCartStore } from "@/lib/cart-store";
import { Price } from "@/components/price";

/**
 * Finds the matching counterpart piece (top <-> bottom) in the same colorway
 * so shoppers can complete the set without leaving the page.
 */
export function findPair(catalog: Product[], product: Product): Product | null {
  const type = productType(product);
  const want = type === "tops" ? "bottoms" : type === "bottoms" ? "tops" : null;
  if (!want) return null;

  const color = colorOf(product).toLowerCase();
  const matches = catalog.filter(
    (p) => p.handle !== product.handle && productType(p) === want,
  );
  return (
    matches.find((p) => colorOf(p).toLowerCase() === color) ??
    null
  );
}

export function PairAdd({ pair, product }: { pair: Product; product: Product }) {
  const [size, setSize] = useState<string | null>(
    pair.sizes.length === 1 ? pair.sizes[0]! : null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = pair.variants.find((v) => v.size === size);

  const label = productType(product) === "tops" ? "Complete the set" : "Complete the set";
  const cta = productType(product) === "tops" ? "Add bottom to bag" : "Add top to bag";

  const add = async () => {
    if (!variant) return;
    await addItem({
      variantId: variant.id,
      handle: pair.handle,
      title: pair.title,
      image: pair.image,
      size: variant.size,
      price: variant.price,
      currencyCode: variant.currencyCode,
      quantity: 1,
    });
    toast.success("Added to bag", { description: `${splitTitle(pair.title).base} - ${variant.size}` });
  };

  return (
    <section className="mt-8 border-t border-border pt-6">
      <h2 className="text-sm">{label}</h2>
      <div className="mt-4 flex gap-4">
        <Link to="/products/$handle" params={{ handle: pair.handle }} className="shrink-0">
          <img
            src={pair.image}
            alt={pair.title}
            loading="lazy"
            className="h-[124px] w-[94px] object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/products/$handle"
            params={{ handle: pair.handle }}
            className="text-[13px] leading-snug hover:underline underline-offset-4"
          >
            {splitTitle(pair.title).base}
          </Link>
          <Price product={pair} className="mt-1 text-[13px]" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pair.sizes.map((s) => {
              const available = pair.variants.some((v) => v.size === s && v.available);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={() => setSize(s)}
                  className={`min-w-9 border px-2 py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors ${
                    size === s
                      ? "border-foreground bg-ink text-background"
                      : "border-border hover:border-foreground"
                  } ${available ? "" : "cursor-not-allowed text-muted-foreground/50 line-through"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!variant || isLoading}
            onClick={add}
            className="mt-3 w-full border border-ink py-3 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {variant ? cta : "Select a size"}
          </button>
        </div>
      </div>
    </section>
  );
}
