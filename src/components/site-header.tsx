import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import logoAsset from "@/assets/sunkissed-logo-black.png.asset.json";
import { products } from "@/data/products";
import { Price } from "@/components/price";

const nav = [
  { label: "New", c: "new" as const },
  { label: "Bikinis", c: "swim" as const },
  { label: "One Pieces", c: "one-piece" as const },
  { label: "Dresses & Resort", c: "resort" as const },
  { label: "Beach Towels", c: "towels" as const },
];

const secondary = [
  { label: "Our Story", to: "/about" as const },
  { label: "Shipping & Returns", to: "/about" as const },
  { label: "Size Guide", to: "/about" as const },
];

const bestsellers = products.slice(0, 6);
const suggestions = products.slice(6, 8);

type Fly = "search" | "bag" | null;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [fly, setFly] = useState<Fly>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const query = q.trim().toLowerCase();
  const results = query
    ? products.filter((p) => p.title.toLowerCase().includes(query))
    : bestsellers;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="bg-ink px-4 py-2 text-center">
          <p className="eyebrow text-[9.5px] text-background lg:text-[11px]">
            Free shipping on all U.S. orders. Processed within 24 hours.
          </p>
        </div>

        {/* Mobile / tablet bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 lg:hidden">
          <Link to="/" aria-label="Sunkissed home" className="shrink-0">
            <img src={logoAsset.url} alt="Sunkissed" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Bag" onClick={() => setFly("bag")}>
              <ShoppingBag className="size-[22px]" strokeWidth={1.25} />
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
                aria-label="Bag"
                onClick={() => setFly("bag")}
                onMouseEnter={() => setFly("bag")}
              >
                <ShoppingBag className="size-[21px]" strokeWidth={1.25} />
              </button>
              <button type="button" aria-label="Account">
                <User className="size-[21px]" strokeWidth={1.25} />
              </button>
            </div>
          </div>

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
                  <p className="eyebrow text-muted-foreground">
                    {fly === "bag" ? "Bag (0)" : query ? "Results" : "Bestsellers"}
                  </p>
                  <button type="button" aria-label="Close" onClick={() => setFly(null)}>
                    <X className="size-[18px]" strokeWidth={1.25} />
                  </button>
                </div>

                {fly === "bag" ? (
                  <div className="flex-1 overflow-y-auto px-6 pb-7">
                    <p className="py-4 text-sm">You haven&rsquo;t put any items in your bag.</p>
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

        <div className="flex flex-col gap-8">
          <Link
            to="/shop"
            search={{ c: "new" }}
            onClick={() => setOpen(false)}
            className="display border-b border-border pb-4 text-[34px] lowercase leading-none"
          >
            new
          </Link>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <p className="eyebrow text-muted-foreground">shop</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li>
                  <Link
                    to="/shop"
                    search={{ c: "swim" }}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    swimwear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    search={{ c: "one-piece" }}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    one pieces
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    search={{ c: "resort" }}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    resort wear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    search={{ c: "towels" }}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    beach towels
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">help</p>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                <li>
                  <Link to="/about" onClick={() => setOpen(false)} className="nav-link">
                    our story
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setOpen(false)} className="nav-link">
                    shipping
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setOpen(false)} className="nav-link">
                    returns & exchanges
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setOpen(false)} className="nav-link">
                    size guide
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setOpen(false)} className="nav-link">
                    contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <p className="eyebrow text-muted-foreground">sun mail</p>
            <p className="mt-4 text-sm text-muted-foreground">
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
              <button type="submit" className="eyebrow">
                join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-auto pt-8 text-[13px]">
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
    </>
  );
}
