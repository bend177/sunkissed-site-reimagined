import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Minus, Plus, Search, ShoppingBag, Trash2, User, X } from "lucide-react";
import logoAsset from "@/assets/sunkissed-logo-black.png.asset.json";
import chevronAsset from "@/assets/serif-chevron.png.asset.json";
import { useCatalog } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { Price } from "@/components/price";






const nav = [
  { label: "Bikinis", c: "swim" as const },
  { label: "One Pieces", c: "one-piece" as const },
  { label: "Dresses & Resort", c: "resort" as const },
  { label: "Beach Towels", c: "towels" as const },
  { label: "New Arrivals", c: "new" as const },
  { label: "Best Sellers", c: "best" as const },
];

type Fly = "search" | "bag" | null;

export function SiteHeader() {
  const onShop = useLocation({ select: (s) => s.pathname }).startsWith("/shop");
  const [open, setOpen] = useState(false);
  const [fly, setFly] = useState<Fly>(null);
  const [q, setQ] = useState("");
  const products = useCatalog();
  const bestsellers = products.slice(0, 6);
  const suggestions = products.slice(6, 8);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const cartTotal = items.reduce((n, i) => n + Number(i.price) * i.quantity, 0);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  useEffect(() => {
    if (fly === "bag") syncCart();
  }, [fly, syncCart]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!fly) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFly(null);
    };
    window.addEventListener("keydown", onKey);
    const small = window.matchMedia("(max-width: 1023px)").matches;
    let prev = "";
    if (small) {
      prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (small) document.body.style.overflow = prev;
    };
  }, [fly]);

  const query = q.trim().toLowerCase();
  const results = query
    ? products.filter((p) => p.title.toLowerCase().includes(query)).slice(0, 12)
    : bestsellers;


  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="bg-announcement px-3 py-2 text-center lg:px-4">
          <p className="eyebrow whitespace-nowrap text-[8px] tracking-[0.12em] text-foreground lg:text-[11px] lg:tracking-[0.18em]">
            Free US shipping on orders over $100
          </p>
        </div>

        {/* Mobile / tablet bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 lg:hidden">
          <Link to="/" aria-label="Sunkissed home" className="shrink-0">
            <img src={logoAsset.url} alt="Sunkissed" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label={`Bag (${cartCount})`}
              onClick={() => setFly("bag")}
              className="relative"
            >
              <ShoppingBag className="size-[19px]" strokeWidth={1.25} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-[9px] leading-none text-background">
                  {cartCount}
                </span>
              )}
            </button>

            <button type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu className="size-[22px]" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        {/* Desktop: logo row + nav row */}
        <div className="hidden lg:block">
          <div className="relative z-[46] flex items-center justify-between gap-8 bg-background px-6 pb-1 pt-5">
            <Link to="/" aria-label="Sunkissed home" className="shrink-0">
              <img src={logoAsset.url} alt="Sunkissed" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-6">
              {fly === "search" ? (
                <div className="search-grow flex w-[210px] items-center gap-2.5 overflow-hidden border-b border-foreground px-0.5 py-1">
                  <Search className="size-[15px] shrink-0" strokeWidth={1.25} />
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="SEARCH"
                    className="eyebrow min-w-0 flex-1 bg-transparent outline-none"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setFly("search")}
                  onMouseEnter={() => setFly("search")}
                >
                  <Search className="size-[19px]" strokeWidth={1.25} />
                </button>
              )}
              <button
                type="button"
                aria-label={`Bag (${cartCount})`}
                onClick={() => setFly("bag")}
                onMouseEnter={() => setFly("bag")}
                className="relative"
              >
                <ShoppingBag className="size-[18px]" strokeWidth={1.25} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-[9px] leading-none text-background">
                  {cartCount}
                </span>
              )}
              </button>

              <button type="button" aria-label="Account">
                <User className="size-[21px]" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          {!onShop && (
          <nav className="relative z-[46] flex items-center gap-8 bg-background px-6 pb-4 pt-3.5">
            {nav.map((l) => (
              <Link
                key={l.label}
                to="/shop"
                search={{ c: l.c }}
                className="text-[13px] font-semibold transition-opacity hover:opacity-60"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/about"
              className="text-[13px] font-semibold transition-opacity hover:opacity-60"
            >
              Our Story
            </Link>
          </nav>
          )}

          {fly && (
            <>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setFly(null)}
                className="fade-in fixed inset-0 z-[45] cursor-default bg-foreground/30"
              />
              <div
                onMouseLeave={() => setFly(null)}
                className="fly-in absolute right-0 top-full z-[55] flex h-[calc(100vh-132px)] w-[min(360px,94vw)] flex-col border-l border-border bg-background shadow-[-16px_24px_48px_rgba(0,0,0,0.14)]"
              >
                <div className="flex items-center justify-between gap-3 px-6 pb-3 pt-5">
                  <div className="flex items-baseline gap-4">
                    <p className="text-[14px]">
                      {fly === "bag"
                        ? `Bag (${cartCount})`
                        : query
                          ? "Results"
                          : "Bestsellers"}
                    </p>
                    {fly === "bag" && items.length > 0 && (
                      <Link
                        to="/cart"
                        onClick={() => setFly(null)}
                        className="text-[13px] underline underline-offset-4"
                      >
                        View more details
                      </Link>
                    )}
                  </div>
                  <button type="button" aria-label="Close" onClick={() => setFly(null)}>
                    <X className="size-[18px]" strokeWidth={1.25} />
                  </button>
                </div>

                {fly === "bag" ? (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    {items.length === 0 ? (
                      <div className="flex-1 overflow-y-auto px-6 pb-7">
                        <p className="py-4 text-sm">
                          You haven&rsquo;t put any items in your bag.
                        </p>
                        <Link
                          to="/shop"
                          search={{ c: "all" }}
                          onClick={() => setFly(null)}
                          className="eyebrow underline underline-offset-4"
                        >
                          Start Shopping
                        </Link>
                        <p className="mb-3.5 mt-8 text-[15px] font-semibold">
                          Before you go, there&rsquo;s more
                        </p>
                        <div className="grid grid-cols-2 gap-3.5">
                          {suggestions.map((p) => (
                            <Link
                              key={p.handle}
                              to="/products/$handle"
                              params={{ handle: p.handle }}
                              onClick={() => setFly(null)}
                              className="flex min-w-0 flex-col gap-1.5"
                            >
                              <img
                                src={p.image}
                                alt={p.title}
                                className="aspect-[4/5] w-full object-cover"
                              />
                              <span className="text-xs leading-snug">{p.title}</span>
                              <Price product={p} className="text-xs" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="px-6">
                          <div className="h-[3px] w-full bg-border">
                            <div
                              className="h-full bg-ink transition-[width] duration-500"
                              style={{ width: `${Math.min(1, cartTotal / 100) * 100}%` }}
                            />
                          </div>
                          <p className="mt-2.5 text-[11px] uppercase tracking-[0.1em]">
                            {cartTotal >= 100
                              ? "You qualify for free shipping!"
                              : `$${(100 - cartTotal).toFixed(0)} away from free shipping`}
                          </p>
                        </div>
                        <div className="mt-4 flex-1 space-y-6 overflow-y-auto px-6 pb-5">
                          {items.map((item) => (
                            <div key={item.variantId} className="flex gap-3.5">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-[104px] w-[78px] shrink-0 object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] leading-snug">{item.title}</p>
                                <p className="mt-1 text-[13px]">
                                  ${(Number(item.price) * item.quantity).toFixed(2)}
                                </p>
                                <p className="mt-2 text-[12px] text-muted-foreground">
                                  Size: <span className="text-foreground">{item.size}</span>
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                  <div className="flex items-center border border-border">
                                    <button
                                      type="button"
                                      aria-label="Decrease quantity"
                                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                      className="px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      <Minus className="size-3" strokeWidth={1.5} />
                                    </button>
                                    <span className="min-w-6 text-center text-[13px]">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      aria-label="Increase quantity"
                                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                      className="px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      <Plus className="size-3" strokeWidth={1.5} />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    aria-label="Remove item"
                                    onClick={() => removeItem(item.variantId)}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                  >
                                    <Trash2 className="size-4" strokeWidth={1.25} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-6 pb-5">
                          <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.1em]">
                            <span className="size-2.5 bg-ink" />
                            You may also like
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            {suggestions.map((p) => (
                              <Link
                                key={p.handle}
                                to="/products/$handle"
                                params={{ handle: p.handle }}
                                onClick={() => setFly(null)}
                                className="min-w-0"
                              >
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="aspect-[4/5] w-full object-cover"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-border px-6 py-5">
                          <div className="flex items-center justify-between text-[15px]">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={checkout}
                            className="mt-4 w-full bg-ink py-4 text-xs uppercase tracking-[0.18em] text-background"
                          >
                            Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                ) : (
                  <div className="grid flex-1 grid-cols-2 content-start gap-3.5 overflow-y-auto px-6 pb-7">
                    {results.map((p) => (
                      <Link
                        key={p.handle}
                        to="/products/$handle"
                        params={{ handle: p.handle }}
                        onClick={() => setFly(null)}
                        className="flex min-w-0 flex-col gap-1.5"
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="aspect-[4/5] w-full object-cover"
                        />
                        <span className="text-[11.5px] leading-snug">{p.title}</span>
                        <Price product={p} className="text-[11.5px]" />
                      </Link>
                    ))}
                    {results.length === 0 && (
                      <p className="col-span-2 text-sm text-muted-foreground">No matches.</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile / tablet full-screen menu */}
      <div
        className={`fixed inset-0 z-[120] flex flex-col overflow-y-auto bg-background px-5 py-4 transition-opacity duration-200 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="mb-8 flex items-center justify-between">
          <img src={logoAsset.url} alt="Sunkissed" className="h-7 w-auto" />
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="size-[22px]" strokeWidth={1.25} />
          </button>
        </div>

        <nav className="flex flex-col">
          {nav.map((l) => (
            <Link
              key={l.label}
              to="/shop"
              search={{ c: l.c }}
              onClick={() => setOpen(false)}
              className="display flex items-center justify-between border-b border-border py-4 text-[34px] lowercase leading-none"
            >
              {l.label.toLowerCase()}
              <img
                src={chevronAsset.url}
                alt=""
                aria-hidden
                className="h-[30px] w-auto opacity-50"
              />
            </Link>
          ))}
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="display flex items-center justify-between border-b border-border py-4 text-[34px] lowercase leading-none"
          >
            our story
            <img
              src={chevronAsset.url}
              alt=""
              aria-hidden
              className="h-[30px] w-auto opacity-50"
            />
          </Link>
        </nav>

        <div className="mt-auto pt-10">
          <p className="eyebrow text-muted-foreground">newsletter</p>
          <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
            New drops, restocks, and the occasional bribe.
          </p>
          <form
            className="mt-5 flex items-center gap-3 border-b border-foreground pb-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="email address"
              aria-label="Email address"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="eyebrow shrink-0">
              join
            </button>
          </form>

          <div className="mt-8 text-[13px]">
            <a
              href="https://www.instagram.com/getsunkissed"
              target="_blank"
              rel="noreferrer"
              className="nav-link lowercase"
            >
              instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
