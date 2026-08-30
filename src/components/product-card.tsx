import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { siblingColors, swatchFill } from "@/data/product-details";
import { useCatalog } from "@/lib/catalog";
import { Price } from "@/components/price";
import { QuickAddDrawer } from "@/components/quick-add-drawer";

export function ProductCard({ product }: { product: Product }) {
  const catalog = useCatalog();
  const colors = siblingColors(catalog, product);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof colors)[number] | null>(null);
  const current = active ?? colors.find((c) => c.current) ?? null;

  return (
    <article>
      <Link
        to="/products/$handle"
        params={{ handle: current?.handle ?? product.handle }}
        className="group block"
      >
        <div className="hover-zoom relative aspect-[3/4] bg-secondary">
          <img
            src={current?.image ?? product.image}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover"
          />
          {product.compareAt && (
            <span className="absolute left-2 top-2 bg-background px-2 py-0.5 text-[11px] uppercase tracking-widest text-foreground">
              Sale
            </span>
          )}
        </div>
      </Link>

      <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <Link to="/products/$handle" params={{ handle: product.handle }}>
            <h3 className="truncate text-sm">{product.title}</h3>
          </Link>
          <Price product={product} className="mt-0.5" />
          {colors.length > 1 && (
            <Swatches
              colors={colors}
              current={current}
              onHover={setActive}
              catalog={catalog}
            />
          )}
        </div>
        <button
          type="button"
          aria-label={`Quick add ${product.title}`}
          onClick={() => setOpen(true)}
          className="shrink-0 p-0.5 text-foreground transition-opacity hover:opacity-60"
        >
          <Plus className="size-5" strokeWidth={1} />
        </button>
      </div>

      <QuickAddDrawer product={product} open={open} onOpenChange={setOpen} />
    </article>
  );
}
