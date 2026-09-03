import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

import { notifyAddedToBag } from "@/lib/toast-added";
import type { Product } from "@/data/products";
import { siblingColors, swatchFill, splitTitle } from "@/data/product-details";
import { useCatalog } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { Price } from "@/components/price";
import { QuickAddDrawer } from "@/components/quick-add-drawer";

const VISIBLE_COUNT = 3;

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
          className="flex h-3.5 items-center gap-0.5 text-[11px] leading-none text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <Minus className="size-2.5 shrink-0" strokeWidth={2} />
          ) : (
            <>
              <Plus className="size-2.5 shrink-0" strokeWidth={2} />
              <span className="-translate-y-px tabular-nums leading-none">{extra}</span>
            </>
          )}
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
    notifyAddedToBag(`${splitTitle(product.title).base} - size ${variant.size}`);
  };

  if (product.variants.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-background/95 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
      <p className="px-3 pt-2.5 text-[11px] uppercase tracking-widest text-muted-foreground">
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
            className="flex-1 px-1.5 py-1.5 text-xs uppercase tracking-[0.08em] transition-colors hover:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            {v.size}
          </button>
        ))}
      </div>
    </div>
  );
}

function Gallery({
  images,
  alt,
  sale,
}: {
  images: string[];
  alt: string;
  sale: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ left: 0 });
    setIndex(0);
  }, [images[0]]);

  const scrollTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  return (
    <div className="image-bg relative aspect-[3/4] overflow-hidden">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.clientWidth) setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex size-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === 0 ? alt : ""}
            loading={i === 0 ? "lazy" : "lazy"}
            className="size-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollTo(index - 1);
            }}
            disabled={index === 0}
            className="absolute left-1.5 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:!opacity-0 lg:flex"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollTo(index + 1);
            }}
            disabled={index === images.length - 1}
            className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/80 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 disabled:!opacity-0 lg:flex"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`size-1 rounded-full transition-colors ${
                  i === index ? "bg-foreground" : "bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {sale && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white py-1 pl-1.5 pr-2 text-[8px] font-normal uppercase tracking-[0.2em] text-black shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
          <span className="size-1 rounded-full bg-[#BA2C33]" />
          Sale
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const catalog = useCatalog();
  const colors = siblingColors(catalog, product);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<(typeof colors)[number] | null>(null);
  const current = active ?? colors.find((c) => c.current) ?? null;

  const images =
    active && active.image
      ? [active.image]
      : product.images.length > 0
        ? product.images
        : [product.image];

  return (
    <article>
      <div className="group relative">
        <Link
          to="/products/$handle"
          params={{ handle: current?.handle ?? product.handle }}
          className="block"
        >
          <Gallery images={images} alt={product.title} sale={Boolean(product.compareAt)} />
        </Link>
        <HoverQuickAdd product={product} />
      </div>


      <div className="mt-2.5">
        <div className="flex items-center justify-between gap-2">
          <Link to="/products/$handle" params={{ handle: product.handle }} className="min-w-0">
            <h3 className="product-meta truncate">{splitTitle(product.title).base}</h3>
          </Link>
          <button
            type="button"
            aria-label={`Quick add ${product.title}`}
            onClick={() => setOpen(true)}
            className="relative mr-3 shrink-0 self-center text-foreground transition-opacity hover:opacity-70 lg:hidden"
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} />
            <span className="absolute -right-1 -top-1.5 flex size-3 items-center justify-center rounded-full bg-ink text-background ring-[1.5px] ring-background">
              <Plus className="size-2" strokeWidth={3} />
            </span>
          </button>
          <Price product={product} className="shrink-0 hidden lg:block" />
        </div>
        <Price product={product} className="mt-0.5 lg:hidden" />
        {colors.length > 1 && (
          <Swatches
            colors={colors}
            current={current}
            onHover={setActive}
            catalog={catalog}
          />
        )}
      </div>

      <QuickAddDrawer product={product} open={open} onOpenChange={setOpen} />
    </article>
  );
}

