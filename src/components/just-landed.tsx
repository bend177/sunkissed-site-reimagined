import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/data/products";

/**
 * "Just landed" section. On mobile it shows the first row of products, then a
 * peek of the second row behind a white gradient with a "Show more" toggle that
 * reveals the rest. Desktop shows the full grid with no collapse.
 */
export function JustLanded({ products }: { products: Product[] }) {
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [collapsedH, setCollapsedH] = useState<number | null>(null);
  const [fullH, setFullH] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const items = grid.children;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (!isMobile || items.length < 3) {
        setCollapsedH(null);
        setFullH(null);
        return;
      }
      const rowPitch =
        (items[2] as HTMLElement).offsetTop -
        (items[0] as HTMLElement).offsetTop;
      const topRowTop = (items[0] as HTMLElement).offsetTop;
      setCollapsedH(topRowTop + rowPitch + Math.round(rowPitch * 0.45));
      setFullH(grid.scrollHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products]);

  const onMobile = collapsedH !== null;
  const collapsed = onMobile && !expanded;

  return (
    <section className="px-4 py-10 md:px-6 md:py-12">
      <div className="flex items-end justify-between gap-6">
        <h2 className="display text-4xl md:text-5xl">Just landed</h2>
        <Link to="/shop" search={{ c: "new" }} className="rule-link text-sm">
          shop new arrivals
        </Link>
      </div>

      <div className="relative mt-8">
        <div
          ref={gridRef}
          className="relative grid grid-cols-2 gap-x-3 gap-y-10 overflow-hidden transition-[max-height] duration-500 ease-out md:grid-cols-4 md:gap-x-4"
          style={
            onMobile
              ? { maxHeight: collapsed ? collapsedH! : fullH! }
              : undefined
          }
        >
          {products.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>

        {onMobile && collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/85 to-transparent md:hidden" />
        )}

        {onMobile && (
          <div className="mt-5 flex justify-center md:hidden">
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
    </section>
  );
}
