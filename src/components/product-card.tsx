import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { siblingColors } from "@/data/product-details";
import { Price } from "@/components/price";

export function ProductCard({ product }: { product: Product }) {
  const colors = siblingColors(product);
  return (
    <Link
      to="/products/$handle"
      params={{ handle: product.handle }}
      className="group block"
    >
      <article>
        <div className="hover-zoom relative aspect-[3/4] bg-secondary">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover"
          />
          {product.compareAt && (
            <span className="absolute left-2 top-2 bg-background px-2 py-0.5 text-[11px] uppercase tracking-widest text-destructive">
              Sale
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="text-sm">{product.title}</h3>
          <Price product={product} className="shrink-0" />
        </div>
        {colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.map((c) => (
              <span
                key={c.handle}
                title={c.colorName}
                className={
                  c.current
                    ? "size-3.5 rounded-full border border-foreground ring-1 ring-foreground ring-offset-1 ring-offset-background"
                    : "size-3.5 rounded-full border border-border"
                }
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
