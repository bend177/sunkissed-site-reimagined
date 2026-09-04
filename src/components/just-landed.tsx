import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/data/products";

/**
 * "Just landed" section. On mobile it shows the first row of products, then a
 * horizontally scrollable peek of the remaining products (starting half-way
 * into the second row), with a "Show more" toggle below that expands the full
 * grid. Desktop shows the full grid with no collapse.
 */
export function JustLanded({ products }: { products: Product[] }) {
  const [expanded, setExpanded] = useState(false);
  const first = products.slice(0, 2);
  const rest = products.slice(2);

  return (
    <section className="px-4 py-10 md:px-6 md:py-12">
      <div className="flex items-end justify-between gap-6">
        <h2 className="display text-4xl md:text-5xl">Just landed</h2>
        <Link to="/shop" search={{ c: "new" }} className="rule-link text-sm">
          shop new arrivals
        </Link>
      </div>

      {/* Mobile: first row + scrollable peek of the rest */}
      <div className="mt-8 md:hidden">
        {expanded ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10">
              {first.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
            {rest.length > 0 && (
              <div className="-mx-4 mt-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex snap-x snap-mandatory gap-x-3 px-4">
                  {rest.map((p) => (
                    <div
                      key={p.handle}
                      className="w-[calc(50vw-1.125rem)] shrink-0 snap-start"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {rest.length > 0 && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rule-link flex items-center gap-1.5 text-sm"
            >
              {expanded ? (
                <>
                  Show less <Minus className="size-3.5" strokeWidth={1.5} />
                </>
              ) : (
                <>
                  Show more <Plus className="size-3.5" strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tablet/desktop: full grid */}
      <div className="mt-8 hidden grid-cols-4 gap-x-4 gap-y-10 md:grid">
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </section>
  );
}
