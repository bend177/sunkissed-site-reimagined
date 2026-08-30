import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import logoAsset from "@/assets/sunkissed-logo-black.png.asset.json";

const links = [
  { label: "new", to: "/shop", search: { c: "new" } as const },
  { label: "swim", to: "/shop", search: { c: "swim" } as const },
  { label: "one pieces", to: "/shop", search: { c: "one-piece" } as const },
  { label: "resort wear", to: "/shop", search: { c: "resort" } as const },
  { label: "towels", to: "/shop", search: { c: "towels" } as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="bg-ink px-4 py-2.5 text-center lg:py-2">
          <p className="text-[11px] tracking-[0.02em] text-background lg:eyebrow">
            free shipping on all u.s. orders.{" "}
            <Link to="/shop" search={{ c: "new" }} className="underline underline-offset-2">
              shop new arrivals
            </Link>
          </p>
        </div>

        {/* Mobile / tablet bar: logo left, actions right (Reformation style) */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5 lg:hidden">
          <Link to="/" aria-label="Sunkissed home" className="shrink-0">
            <img src={logoAsset.url} alt="Sunkissed" className="h-[22px] w-auto" />
          </Link>
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Search">
              <Search className="size-[22px]" strokeWidth={1.25} />
            </button>
            <button type="button" aria-label="Bag">
              <ShoppingBag className="size-[22px]" strokeWidth={1.25} />
            </button>
            <button type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu className="size-[22px]" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-border px-4 py-3.5 lg:grid lg:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <nav className="flex items-center gap-6">
              {links.map((l) => (
                <Link key={l.label} to={l.to} search={l.search} className="nav-link">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" aria-label="Sunkissed home" className="shrink-0">
            <img src={logoAsset.url} alt="Sunkissed" className="h-5 w-auto md:h-[22px]" />
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-5">
            <button type="button" aria-label="Search" className="nav-link">
              <Search className="size-4" strokeWidth={1.25} />
            </button>
            <Link to="/about" className="nav-link">
              about
            </Link>
            <button type="button" aria-label="Account" className="nav-link">
              <User className="size-4" strokeWidth={1.25} />
            </button>
            <button type="button" className="nav-link flex items-center gap-1.5">
              <ShoppingBag className="size-4" strokeWidth={1.25} />
              <span className="text-sm">(0)</span>
            </button>
          </div>
        </div>
      </header>


      {/* Mobile / tablet menu - rendered outside the header so `fixed` covers the full viewport */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-background transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <img src={logoAsset.url} alt="Sunkissed" className="h-[22px] w-auto" />
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              search={l.search}
              onClick={() => setOpen(false)}
              className="group flex items-baseline justify-between border-b border-border/60 py-4"
            >
              <span className="display text-4xl leading-tight sm:text-5xl">{l.label}</span>
              <ArrowRight
                className="size-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                strokeWidth={1.25}
              />
            </Link>
          ))}
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="group flex items-baseline justify-between py-4"
          >
            <span className="display text-4xl leading-tight sm:text-5xl">about</span>
            <ArrowRight
              className="size-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.25}
            />
          </Link>
        </nav>

        <div className="flex items-center justify-between border-t border-border px-6 py-5">
          <p className="eyebrow">free u.s. shipping</p>
          <p className="eyebrow">@getsunkissed</p>
        </div>
      </div>
    </>
  );
}
