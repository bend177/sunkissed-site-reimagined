import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";

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
        <div className="bg-ink px-4 py-2 text-center">
          <p className="eyebrow text-background">
            free shipping on all u.s. orders — processed within 24 hours
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-border px-4 py-3.5 md:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              {links.map((l) => (
                <Link key={l.label} to={l.to} search={l.search} className="nav-link">
                  {l.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="md:hidden"
            >
              <Menu className="size-5" strokeWidth={1.25} />
            </button>
          </div>

          <Link
            to="/"
            className="display shrink-0 text-2xl tracking-tight md:text-[28px]"
          >
            Sunkissed
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-5">
            <button type="button" aria-label="Search" className="nav-link hidden md:block">
              <Search className="size-4" strokeWidth={1.25} />
            </button>
            <Link to="/about" className="nav-link hidden md:block">
              about
            </Link>
            <button type="button" aria-label="Account" className="nav-link hidden md:block">
              <User className="size-4" strokeWidth={1.25} />
            </button>
            <button type="button" className="nav-link flex items-center gap-1.5">
              <ShoppingBag className="size-4" strokeWidth={1.25} />
              <span className="text-sm">(0)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu — rendered outside the header so `fixed` covers the full viewport */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-background transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <span className="display text-2xl tracking-tight">Sunkissed</span>
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
