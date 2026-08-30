import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

type Filter = "all" | "new" | "swim" | "one-piece" | "resort" | "towels";

const filters: { label: string; value: Filter }[] = [
  { label: "all", value: "all" },
  { label: "new", value: "new" },
  { label: "swim", value: "swim" },
  { label: "one pieces", value: "one-piece" },
  { label: "resort wear", value: "resort" },
  { label: "towels", value: "towels" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    c: (search["c"] as Filter | undefined) ?? "all",
  }),
  head: () => ({
    meta: [
      { title: "Shop Swimwear & Resort Wear | Sunkissed" },
      {
        name: "description",
        content:
          "Browse Sunkissed bikinis, one pieces, sarongs, beach-to-bar dresses and sand-free beach towels. Free U.S. shipping.",
      },
      { property: "og:title", content: "Shop Sunkissed" },
      {
        property: "og:description",
        content: "Bikinis, one pieces, resort wear and sand-free towels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { c } = Route.useSearch();

  const list =
    c === "all"
      ? products
      : c === "new"
        ? products.filter((p) => p.category !== "towels").slice(0, 8)
        : products.filter((p) => p.category === c);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <div className="border-b border-border px-4 py-12 md:px-6">
          <h1 className="display text-5xl md:text-7xl">
            {filters.find((f) => f.value === c)?.label ?? "all"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{list.length} pieces</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-border px-4 py-4 md:px-6">
          {filters.map((f) => (
            <Link
              key={f.value}
              to="/shop"
              search={{ c: f.value }}
              className="nav-link"
              data-active={f.value === c}
              style={f.value === c ? { borderBottom: "1px solid currentColor" } : undefined}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <section className="grid grid-cols-2 gap-x-3 gap-y-10 px-4 py-10 md:grid-cols-4 md:gap-x-4 md:px-6">
          {list.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
