import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCartStore } from "@/lib/cart-store";

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

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 lg:py-16">
        <h1 className="text-center text-[15px] font-semibold">Your Bag</h1>
        <p className="eyebrow mt-4 text-center text-[10px] tracking-[0.14em]">
          Free US shipping on orders over $100
        </p>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-16">
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
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
            {/* Items */}
            <div className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 py-5">
                  <Link
                    to="/products/$handle"
                    params={{ handle: item.handle }}
                    className="shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-32 w-24 object-cover lg:h-40 lg:w-32"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to="/products/$handle"
                          params={{ handle: item.handle }}
                          className="text-sm leading-snug hover:underline underline-offset-4"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Size {item.size}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-3 py-2 disabled:opacity-40"
                        >
                          <Minus className="size-3" strokeWidth={1.5} />
                        </button>
                        <span className="min-w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-3 py-2 disabled:opacity-40"
                        >
                          <Plus className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        disabled={isLoading}
                        onClick={() => removeItem(item.variantId)}
                        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <Trash2 className="size-4" strokeWidth={1.25} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="h-fit lg:sticky lg:top-40">
              <div className="border border-border p-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  type="button"
                  onClick={checkout}
                  className="mt-5 w-full bg-ink py-4 text-xs uppercase tracking-[0.18em] text-background"
                >
                  Checkout
                </button>
                <Link
                  to="/shop"
                  search={{ c: "all" }}
                  className="eyebrow mt-4 block text-center underline underline-offset-4"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
