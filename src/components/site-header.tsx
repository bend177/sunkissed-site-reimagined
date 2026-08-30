import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

const links = [
  { label: "new", to: "/shop", search: { c: "new" } as const },
  { label: "swim", to: "/shop", search: { c: "swim" } as const },
  { label: "one pieces", to: "/shop", search: { c: "one-piece" } as const },
  { label: "resort wear", to: "/shop", search: { c: "resort" } as const },
  { label: "towels", to: "/shop", search: { c: "towels" } as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="bg-ink py-2 text-center">
        <p className="eyebrow text-background">
          free shipping on all u.s. orders — processed within 24 hours
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 border-b border-border px-4 py-3.5 md:px-6">
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

        <Link
          to="/"
          className="display absolute left-1/2 -translate-x-1/2 text-2xl tracking-tight md:text-[28px]"
        >
          Sunkissed
        </Link>

        <div className="flex items-center gap-5">
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

      {open && (
        <div className="fixed inset-0 z-50 bg-background px-6 py-5 md:hidden">
          <div className="flex justify-end">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="size-5" strokeWidth={1.25} />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                search={l.search}
                onClick={() => setOpen(false)}
                className="display text-4xl"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/about" onClick={() => setOpen(false)} className="display text-4xl">
              about
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
