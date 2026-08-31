import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCartStore } from "@/lib/cart-store";
import { useCatalog } from "@/lib/catalog";
import { findPair } from "@/components/pair-add";
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

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 py-10 lg:py-14">
        <h1 className="text-center text-[26px] leading-none lg:text-[30px]">Your Bag</h1>

        <div className="mx-auto mt-7 w-full max-w-[640px]">
          <div className="h-[3px] w-full bg-border">
            <div
              className="h-full bg-ink transition-[width] duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.1em]">
            {remaining === 0
              ? "You qualify for free shipping!"
              : `${money(remaining)} away from free shipping`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-20">
            <p className="text-sm text-muted-foreground">Your bag is empty</p>
            <Link
              to="/shop"
              search={{ c: "all" }}
              className="mt-8 bg-ink px-10 py-4 text-xs uppercase tracking-[0.18em] text-background"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12">
            {/* Column headers (desktop) */}
            <div className="hidden border-b border-border pb-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground lg:grid lg:grid-cols-[1fr_120px_180px_120px]">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <div className="divide-y divide-border border-b border-border lg:divide-y-0">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 py-6 lg:grid lg:grid-cols-[1fr_120px_180px_120px] lg:items-center lg:gap-0 lg:border-b lg:border-border"
                >
                  <div className="flex min-w-0 flex-1 gap-4 lg:flex-none">
                    <Link
                      to="/products/$handle"
                      params={{ handle: item.handle }}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-[132px] w-[100px] object-cover lg:h-[200px] lg:w-[150px]"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/products/$handle"
                        params={{ handle: item.handle }}
                        className="text-[14px] leading-snug hover:underline underline-offset-4"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-2 text-[12px] text-muted-foreground">
                        <span className="uppercase tracking-[0.06em]">Size:</span>{" "}
                        <span className="text-foreground">{item.size}</span>
                      </p>

                      {/* Mobile price + stepper */}
                      <div className="mt-4 flex items-center gap-4 lg:hidden">
                        <span className="text-[13px]">{money(Number(item.price))}</span>
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
                          <X className="size-4" strokeWidth={1.25} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="hidden text-[13px] lg:block">
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
                      <X className="size-4" strokeWidth={1.25} />
                    </button>
                  </div>

                  <span className="hidden text-right text-[13px] lg:block">
                    {money(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 lg:flex lg:justify-end">
              <div className="w-full lg:max-w-[420px]">
                <div className="flex items-center justify-between border-b border-border pb-4 text-[16px]">
                  <span>Subtotal</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <p className="mt-4 text-[13px] text-muted-foreground">
                  Taxes and{" "}
                  <span className="text-foreground underline underline-offset-4">shipping</span>{" "}
                  calculated at checkout
                </p>
                <button
                  type="button"
                  onClick={checkout}
                  className="mt-5 w-full bg-ink py-4 text-xs uppercase tracking-[0.18em] text-background"
                >
                  Proceed to checkout
                </button>
                <Link
                  to="/shop"
                  search={{ c: "all" }}
                  className="mt-4 block text-center text-[13px] underline underline-offset-4"
                >
                  Continue shopping
                </Link>
              </div>
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
        className="px-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className="min-w-7 text-center text-[13px]">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
        className="px-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
