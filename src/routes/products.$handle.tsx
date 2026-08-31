import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Price } from "@/components/price";
import { catalogQueryOptions } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import {
  getProductDetail,
  relatedProducts,
  splitTitle,
  isPrint,
  type ProductDetail,
  swatchFill,
  swatchFocus,
} from "@/data/product-details";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ params, context }) => {
    const catalog = await context.queryClient.ensureQueryData(catalogQueryOptions());
    const detail = getProductDetail(catalog, params.handle);
    if (!detail) throw notFound();
    return { detail, catalog };
  },

  head: ({ loaderData }) => {
    const detail = loaderData?.detail;
    const title = detail ? `${detail.product.title} | Sunkissed` : "Product | Sunkissed";
    const description = detail
      ? `${detail.product.title} - $${detail.product.price}. ${detail.description}`.slice(0, 158)
      : "Shop Sunkissed swimwear.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(detail
          ? [
              { property: "og:image", content: detail.product.image },
              { name: "twitter:image", content: detail.product.image },
            ]
          : []),
      ],
    };
  },

  component: ProductPage,
});

function Accordion({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm"
      >
        {label}
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

function ColorGroup({
  title,
  items,
  catalog,
  currentHandle,
}: {
  title: string;
  items: { handle: string; title: string; image: string }[];
  catalog: Parameters<typeof swatchFill>[0];
  currentHandle: string;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-5">
      <p className="text-sm">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((s) => {
          const label = splitTitle(s.title).color || s.title;
          const active = s.handle === currentHandle;
          return (
            <Link
              key={s.handle}
              to="/products/$handle"
              params={{ handle: s.handle }}
              aria-label={label}
              title={label}
              className={`block size-8 shrink-0 rounded-full ring-1 ring-inset transition-shadow ${
                active
                  ? "ring-foreground"
                  : "ring-foreground/15 hover:ring-foreground/50"
              }`}
            >
              <span
                aria-hidden
                style={swatchFill(catalog, label, s.image, swatchFocus(s.title))}
                className="block size-full rounded-full"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ProductPage() {
  const { detail, catalog } = Route.useLoaderData() as {
    detail: ProductDetail;
    catalog: Parameters<typeof relatedProducts>[0];
  };
  const { product, base, colorName, siblings, gallery, sizes, description, fit, material } = detail;
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0]! : null);
  const related = relatedProducts(catalog, product, 2);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.variants.find((v) => v.size === size);

  const classicColors = siblings.filter((s) => !isPrint(splitTitle(s.title).color || s.title));
  const seasonalColors = siblings.filter((s) => isPrint(splitTitle(s.title).color || s.title));
  const selectedIsPrint = isPrint(colorName);

  const addToBag = async () => {
    if (!variant) {
      toast("Please select a size");
      return null;
    }
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
    return variant;
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <nav className="px-4 py-3 text-xs text-muted-foreground md:px-6">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" search={{ c: "all" }} className="hover:text-foreground">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{base}</span>
        </nav>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_460px] lg:gap-10 lg:px-6">
          {/* Gallery - swipeable on mobile, 2-up grid on desktop */}
          <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:gap-1 lg:overflow-visible">
            {gallery.map((src, i) => (
              <GalleryImage
                key={src + i}
                src={src}
                alt={`${product.title} view ${i + 1}`}
                eager={i === 0}
              />
            ))}
          </div>

          {/* Buy rail */}
          <div className="px-4 pt-6 md:px-6 lg:sticky lg:top-24 lg:self-start lg:px-0 lg:pt-2">
            <div className="flex items-start justify-between gap-4 lg:flex-col lg:gap-1">
              <h1 className="text-xl leading-tight">{base}</h1>
              <Price product={product} className="text-base lg:text-sm" />
            </div>

            <ColorGroup
              title={`Classic Colors${!selectedIsPrint ? `: ${colorName}` : ""}`}
              items={classicColors}
              catalog={catalog}
              currentHandle={product.handle}
            />
            <ColorGroup
              title={`Seasonal${selectedIsPrint ? `: ${colorName}` : ""}`}
              items={seasonalColors}
              catalog={catalog}
              currentHandle={product.handle}
            />

            <div className="mt-7 flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.08em]">Size</span>
              <button type="button" className="text-xs underline underline-offset-4">
                Size Chart
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              {sizes.map((s) => {
                const v = product.variants.find((x) => x.size === s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={v ? !v.available : false}
                    onClick={() => setSize(s)}
                    className={`flex-1 border px-3 py-2 text-xs uppercase transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                const added = await addToBag();
                if (added) toast.success(`${base} (${added.size}) added to bag`);
              }}
              className={`mt-4 w-full py-4 text-xs uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
                variant
                  ? "bg-foreground text-background hover:opacity-85"
                  : "border border-foreground text-foreground"
              }`}
            >
              {isLoading ? "Adding..." : variant ? "Add to bag" : "Select a size"}
            </button>

            <p className="mt-3 text-xs text-muted-foreground">
              Free U.S. shipping over $100 - easy 30 day returns
            </p>

            <div className="mt-7 border-t border-border">
              <Accordion label="Details" defaultOpen>
                <ul className="list-disc space-y-1 pl-4">
                  <li>{description}</li>
                  {fit.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  {material.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="Shipping and Returns">
                Free U.S. shipping on orders over $100. Standard delivery in 3-5 business days.
                Returns accepted within 30 days on unworn pieces.
              </Accordion>
            </div>

            {related.length > 0 && (
              <section className="mt-8 pb-14">
                <h2 className="text-sm">Complete the Look</h2>
                <div className="mt-3 grid grid-cols-2 gap-1">
                  {related.map((p) => (
                    <Link key={p.handle} to="/products/$handle" params={{ handle: p.handle }}>
                      <div className="aspect-[3/4] bg-secondary">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-xs">{splitTitle(p.title).base}</p>
                      <Price product={p} className="mt-0.5 text-xs" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
