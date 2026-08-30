import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { siblingColors, swatchFill } from "@/data/product-details";
import { useCatalog } from "@/lib/catalog";
import type { Catalog } from "@/lib/catalog";
import { Price } from "@/components/price";
import { QuickAddDrawer } from "@/components/quick-add-drawer";

const COLLAPSED_COUNT = 3;

type ColorRef = ReturnType<typeof siblingColors>[number];

function SwatchChip({
  color,
  active,
  catalog,
  onHover,
}: {
  color: ColorRef;
  active: boolean;
  catalog: Catalog;
  onHover: (c: ColorRef | null) => void;
}) {
  return (
    <Link
      to="/products/$handle"
      params={{ handle: color.handle }}
      aria-label={color.colorName}
      title={color.colorName}
      onMouseEnter={() => onHover(color)}
      onFocus={() => onHover(color)}
      className={`block size-3.5 shrink-0 rounded-full ring-1 ring-inset transition-shadow ${
        active
          ? "ring-foreground"
          : "ring-foreground/15 hover:ring-foreground/50"
      }`}
      style={swatchFill(catalog, color.colorName, color.image, color.focusY)}
    />
  );
}

function Swatches({
  colors,
  current,
  onHover,
  catalog,
}: {
  colors: ColorRef[];
  current: ColorRef | null;
  onHover: (c: ColorRef | null) => void;
  catalog: Catalog;
}) {
  const [expanded, setExpanded] = useState(false);
  if (colors.length <= COLLAPSED_COUNT) {
    return (
      <div
        className="mt-1.5 flex flex-nowrap items-center gap-1"
        onMouseLeave={() => onHover(null)}
      >
        {colors.map((c) => (
          <SwatchChip
            key={c.handle}
            color={c}
            active={current?.handle === c.handle}
            catalog={catalog}
            onHover={onHover}
          />
        ))}
      </div>
    );
  }

  if (expanded) {
    return (
      <div
        className="mt-1.5 flex flex-wrap items-center gap-1"
        onMouseLeave={() => onHover(null)}
      >
        {colors.map((c) => (
          <SwatchChip
            key={c.handle}
            color={c}
            active={current?.handle === c.handle}
            catalog={catalog}
            onHover={onHover}
          />
        ))}
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="ml-0.5 text-[11px] underline underline-offset-2 text-muted-foreground hover:text-foreground"
        >
          Show less
        </button>
      </div>
    );
  }

  const visible = colors.slice(0, COLLAPSED_COUNT);
  return (
    <div
      className="mt-1.5 flex flex-nowrap items-center gap-1"
      onMouseLeave={() => onHover(null)}
    >
      {visible.map((c) => (
        <SwatchChip
          key={c.handle}
          color={c}
          active={current?.handle === c.handle}
          catalog={catalog}
          onHover={onHover}
        />
      ))}
      <button
        type="button"
        aria-label={`Show ${colors.length - COLLAPSED_COUNT} more colors`}
        title={`+${colors.length - COLLAPSED_COUNT} more`}
        onClick={() => setExpanded(true)}
        className="ml-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-[10px] leading-none text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
      >
        +
      </button>
    </div>
  );
}

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
