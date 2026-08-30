import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { siblingColors, swatchFill } from "@/data/product-details";
import { useCatalog } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { Price } from "@/components/price";
import { QuickAddDrawer } from "@/components/quick-add-drawer";

const VISIBLE_COUNT = 5;

type ColorRef = ReturnType<typeof siblingColors>[number];

function SwatchChip({
  color,
  active,
  catalog,
  onHover,
}: {
  color: ColorRef;
  active: boolean;
  catalog: Product[];
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
  catalog: Product[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? colors : colors.slice(0, VISIBLE_COUNT);
  const extra = colors.length - VISIBLE_COUNT;

  return (
    <div
      className="mt-1.5 flex flex-wrap items-center gap-1"
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
      {extra > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="ml-0.5 text-[11px] leading-none text-muted-foreground hover:text-foreground"
        >
          {expanded ? "Show less" : `+${extra}`}
        </button>
      )}
    </div>
  );
}


function HoverQuickAdd({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const add = async (variant: Product["variants"][number]) => {
    await addItem({
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      image: product.image,
      size: variant.size,
      price: variant.price,
      currencyCode: variant.currencyCode,
      quantity: 1,
    });
    toast.success("Added to bag", {
      description: `${product.title} - size ${variant.size}`,
      position: "top-center",
    });
  };

  if (product.variants.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-background/95 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
      <p className="px-3 pt-2.5 text-[11px] lowercase text-muted-foreground">
        quick add
      </p>
      <div className="flex items-stretch overflow-x-auto px-1.5 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {product.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            disabled={!v.available || isLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void add(v);
            }}
            className="flex-1 px-1.5 py-1.5 text-xs lowercase transition-colors hover:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            {v.size}
          </button>
        ))}
      </div>
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
      <div className="group relative">
        <Link
          to="/products/$handle"
          params={{ handle: current?.handle ?? product.handle }}
          className="block"
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
        <HoverQuickAdd product={product} />
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <Link to="/products/$handle" params={{ handle: product.handle }}>
            <h3 className="truncate text-[13px] leading-snug">{product.title}</h3>
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
          className="shrink-0 p-0.5 text-foreground transition-opacity hover:opacity-60 lg:hidden"
        >
          <Plus className="size-5" strokeWidth={1} />
        </button>
      </div>

      <QuickAddDrawer product={product} open={open} onOpenChange={setOpen} />
    </article>
  );
}

