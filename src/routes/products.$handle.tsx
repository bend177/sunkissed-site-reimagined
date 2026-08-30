import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Price } from "@/components/price";
import {
  getProductDetail,
  relatedProducts,
  type ProductDetail,
  swatchStyle,
} from "@/data/product-details";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => {
    const detail = getProductDetail(params.handle);
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.product.title} | Sunkissed`
      : "Product | Sunkissed";
    const description = loaderData
      ? `${loaderData.product.title} - $${loaderData.product.price}. ${loaderData.description}`.slice(
          0,
          158,
        )
      : "Shop Sunkissed swimwear.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData
          ? [
              { property: "og:image", content: loaderData.product.image },
              { name: "twitter:image", content: loaderData.product.image },
            ]
          : []),
      ],
    };
  },
  component: ProductPage,
});

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm lowercase"
      >
        {label}
        {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

function ProductPage() {
  const detail = Route.useLoaderData() as ProductDetail;
  const { product, base, colorName, siblings, gallery, sizes, description, fit, material } = detail;
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0]! : null);
  const related = relatedProducts(product);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <nav className="px-4 pt-6 text-xs lowercase text-muted-foreground md:px-6">
          <Link to="/" className="hover:text-foreground">
            home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" search={{ c: "all" }} className="hover:text-foreground">
            shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{base.toLowerCase()}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-8 px-4 md:px-6 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Gallery */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {gallery.map((src, i) => (
              <div
                key={src + i}
                className={`aspect-[3/4] bg-secondary ${i === 0 ? "md:col-span-2 md:aspect-[4/3]" : ""}`}
              >
                <img
                  src={src}
                  alt={`${product.title} view ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Buy rail */}
          <div className="lg:sticky lg:top-24 lg:self-start lg:pt-2">
            <h1 className="text-xl">{base}</h1>
            <Price product={product} className="mt-2" />

            <p className="mt-6 text-sm text-muted-foreground">{colorName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => {
                const label = s.title.split("-")[1]?.trim() ?? s.title;
                const active = s.handle === product.handle;
                return (
                  <Link
                    key={s.handle}
                    to="/products/$handle"
                    params={{ handle: s.handle }}
                    aria-label={label}
                    title={label}
                    className={`size-8 rounded-full border p-[3px] ${
                      active ? "border-foreground" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={label}
                      className="block size-full rounded-full object-cover"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm lowercase text-muted-foreground">select a size</span>
              <button type="button" className="text-xs lowercase underline underline-offset-4">
                size guide
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`border py-3 text-xs lowercase transition-colors ${
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  } ${sizes.length === 1 ? "col-span-5" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                size
                  ? toast.success(`${base.toLowerCase()} (${size}) added to bag`)
                  : toast("please select a size")
              }
              className="mt-4 w-full bg-foreground py-4 text-xs lowercase tracking-[0.15em] text-background transition-opacity hover:opacity-85"
            >
              add to bag
            </button>
            <button
              type="button"
              className="mt-2 w-full border border-border py-4 text-xs lowercase tracking-[0.15em] transition-colors hover:border-foreground"
            >
              buy it now
            </button>

            <p className="mt-4 flex items-center gap-1 text-xs lowercase text-muted-foreground">
              free u.s. shipping over $100 · easy returns
              <ChevronDown className="size-3" />
            </p>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{description}</p>

            <div className="mt-8">
              <Accordion label="fit & details">
                <ul className="space-y-1">
                  {fit.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="material & care">
                <ul className="space-y-1">
                  {material.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="sustainability">
                Cut in small batches from recycled and deadstock-friendly fabrics, in a family-run
                atelier. Less waste, longer wear.
              </Accordion>
              <Accordion label="shipping & delivery">
                Free U.S. shipping on orders over $100. Standard delivery in 3–5 business days.
                Returns accepted within 30 days on unworn pieces.
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-24 border-t border-border px-4 py-14 md:px-6">
          <h2 className="text-sm lowercase tracking-[0.2em]">complete the look</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
