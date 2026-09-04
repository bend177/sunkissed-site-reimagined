import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCartStore } from "@/lib/cart-store";
import { useCatalog } from "@/lib/catalog";
import { findPair } from "@/components/pair-add";
import { ApplePayButton } from "@/components/apple-pay-button";

import { splitTitle } from "@/data/product-details";
import type { Product } from "@/data/products";

const FREE_SHIPPING_THRESHOLD = 100;


export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag - Sunkissed" },
      { name: "description", content: "Review the items in your Sunkissed bag and check out." },
      { property: "og:title", content: "Your Bag - Sunkissed" },
      { property: "og:description", content: "Review the items in your Sunkissed bag and check out." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const cartTotal = items.reduce((n, i) => n + Number(i.price) * i.quantity, 0);
  const progress = Math.min(1, cartTotal / FREE_SHIPPING_THRESHOLD);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const money = (n: number) => `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 py-4 lg:py-6">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="h-[2px] w-full bg-border">
            <div
              className="h-full bg-ink transition-[width] duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[9px] uppercase tracking-[0.1em]">
            {remaining === 0
              ? "You qualify for free shipping!"
              : `${money(remaining)} away from free shipping`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Your bag is empty</p>
            <Link
              to="/shop"
              search={{ c: "all" }}
              className="mt-6 bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.18em] text-background"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">
            {/* Left column: items + complete the set */}
            <div>
              <h1 className="text-[18px] leading-none lg:text-[22px]">Your Bag</h1>
              {/* Column headers (desktop) */}
              <div className="hidden border-b border-border pb-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground lg:mt-4 lg:grid lg:grid-cols-[1fr_90px_150px_90px]">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-border border-b border-border lg:divide-y-0">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-2.5 py-3 lg:grid lg:grid-cols-[1fr_90px_150px_90px] lg:items-center lg:gap-0 lg:border-b lg:border-border"
                  >
                    <div className="flex min-w-0 flex-1 gap-2.5 lg:flex-none">
                      <Link
                        to="/products/$handle"
                        params={{ handle: item.handle }}
                        className="shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="image-bg h-[90px] w-[68px] object-cover lg:h-[120px] lg:w-[90px]"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/products/$handle"
                          params={{ handle: item.handle }}
                          className="text-[12px] leading-snug hover:underline underline-offset-4"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          <span className="uppercase tracking-[0.06em]">Size:</span>{" "}
                          <span className="text-foreground">{item.size}</span>
                        </p>

                        {/* Mobile price + stepper */}
                        <div className="mt-2.5 flex items-center gap-4 lg:hidden">
                          <span className="text-[11px]">{money(Number(item.price))}</span>
                          <Stepper
                            quantity={item.quantity}
                            disabled={isLoading}
                            onChange={(q) => updateQuantity(item.variantId, q)}
                          />
                          <button
                            type="button"
                            aria-label="Remove item"
                            disabled={isLoading}
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                          >
                            <X className="size-3.5" strokeWidth={1.25} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className="hidden text-[11px] lg:block">
                      {money(Number(item.price))}
                    </span>

                    <div className="hidden items-center gap-3 lg:flex">
                      <Stepper
                        quantity={item.quantity}
                        disabled={isLoading}
                        onChange={(q) => updateQuantity(item.variantId, q)}
                      />
                      <button
                        type="button"
                        aria-label="Remove item"
                        disabled={isLoading}
                        onClick={() => removeItem(item.variantId)}
                        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <X className="size-3" strokeWidth={1.25} />
                      </button>
                    </div>

                    <span className="hidden text-right text-[11px] lg:block">
                      {money(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <CompleteTheSet />
            </div>

            {/* Right column: sticky summary */}
            <div className="mt-6 lg:sticky lg:top-6 lg:mt-0 lg:border lg:border-border lg:bg-[oklch(0.97_0_0)] lg:p-5">
              <h2 className="text-[18px] leading-none lg:text-[20px]">Summary</h2>

              <div className="mt-3 flex items-center justify-between border-y border-border py-3 text-[15px] font-medium">
                <span>Subtotal</span>
                <span>{money(cartTotal)}</span>
              </div>

              {/* Promo code */}
              <div className="mt-4">
                <label className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Promo code
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="min-w-0 flex-1 border border-border bg-background px-3 py-2.5 text-[11px] uppercase tracking-[0.08em] outline-none focus:border-foreground"
                  />
                  <button
                    type="button"
                    className="border border-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-background"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Taxes and{" "}
                <span className="text-foreground underline underline-offset-4">shipping</span>{" "}
                calculated at checkout
              </p>
              <button
                type="button"
                onClick={checkout}
                className="mt-3 w-full bg-ink py-3.5 text-[11px] uppercase tracking-[0.18em] text-background"
              >
                Proceed to checkout
              </button>
              <ApplePayButton onClick={checkout} className="mt-2" />

              <Link
                to="/shop"
                search={{ c: "all" }}
                className="mt-3 block text-center text-[11px] underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function Stepper({
  quantity,
  disabled,
  onChange,
}: {
  quantity: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled}
        onClick={() => onChange(quantity - 1)}
        className="px-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Minus className="size-3" strokeWidth={1.5} />
      </button>
      <span className="min-w-6 text-center text-[11px]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
        className="px-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Plus className="size-3" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/**
 * Suggests the matching counterpart piece for the tops/bottoms already in the
 * bag so shoppers can complete the set right before checkout.
 */
function CompleteTheSet() {
  const catalog = useCatalog();
  const items = useCartStore((s) => s.items);

  const inBag = new Set(items.map((i) => i.handle));
  const suggestions: Product[] = [];
  for (const item of items) {
    const product = catalog.find((p) => p.handle === item.handle);
    if (!product) continue;
    const pair = findPair(catalog, product);
    if (!pair || inBag.has(pair.handle)) continue;
    if (suggestions.some((s) => s.handle === pair.handle)) continue;
    suggestions.push(pair);
  }

  if (suggestions.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Complete your set
      </h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {suggestions.slice(0, 2).map((pair) => (
          <SetSuggestion key={pair.handle} pair={pair} />
        ))}
      </div>
    </section>
  );
}

function SetSuggestion({ pair }: { pair: Product }) {
  const [size, setSize] = useState<string | null>(
    pair.sizes.length === 1 ? pair.sizes[0]! : null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = pair.variants.find((v) => v.size === size);

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
    toast.success("Added to bag", {
      description: `${splitTitle(pair.title).base} - ${variant.size}`,
    });
  };

  return (
    <div className="flex gap-4">
      <Link to="/products/$handle" params={{ handle: pair.handle }} className="shrink-0">
        <img
          src={pair.image}
          alt={pair.title}
          loading="lazy"
          className="image-bg h-[132px] w-[100px] object-cover"
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
        <p className="mt-1 text-[13px]">
          ${Number(pair.variants[0]?.price ?? 0).toFixed(0)}
        </p>
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
          {variant ? "Add to bag" : "Select a size"}
        </button>
      </div>
    </div>
  );
}
