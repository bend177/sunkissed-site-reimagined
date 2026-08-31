import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { editorial } from "@/data/products";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunkissed - Swimwear, Resort Wear & Sand-Free Towels" },
      {
        name: "description",
        content:
          "Sunkissed swimwear: sculpted bikinis, one pieces, beach-to-bar dresses and sand-free towels. Free shipping on all U.S. orders.",
      },
      { property: "og:title", content: "Sunkissed - Swimwear Made For The Sun" },
      {
        property: "og:description",
        content: "Sculpted swim, resort wear and sand-free towels. Designed to seduce.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: editorial.hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: editorial.hero },
    ],
  }),
  component: Home,
});

const categories = [
  { label: "new arrivals", count: 64, image: editorial.newArrivals, c: "new" as const },
  { label: "all sets", count: 51, image: editorial.allSets, c: "swim" as const },
  { label: "one piece", count: 8, image: editorial.onePiece, c: "one-piece" as const },
  { label: "resort wear", count: 10, image: editorial.resort, c: "resort" as const },
];

function Home() {
  const products = useCatalog();
  const featured = products.filter((p) => p.category !== "towels").slice(0, 8);
  const towels = products.filter((p) => p.category === "towels").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative">
          <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden md:h-[92vh]">
            <img
              src={editorial.hero}
              alt="Sunkissed Animalistique swimwear campaign"
              className="size-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-ink/10" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-12">
              <p className="eyebrow rise text-background/80">the animalistique collection</p>
              <div className="rise mt-3 flex items-end justify-between gap-1 md:gap-6">
                <h1 className="display whitespace-nowrap text-[13vw] leading-[0.95] text-background md:text-[7vw]">
                  Designed to seduce
                </h1>
                <Link
                  to="/shop"
                  search={{ c: "new" }}
                  className="shrink-0 whitespace-nowrap pb-1 text-xs lowercase text-background md:text-base"
                >
                  shop now &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* Category grid */}
        <section className="px-4 py-8 md:px-6 md:py-10">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-4xl md:text-5xl">Shop by category</h2>
            <Link to="/shop" search={{ c: "all" }} className="rule-link text-sm">
              view all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to="/shop"
                search={{ c: cat.c }}
                className="group block"
              >
                <div className="hover-zoom aspect-[3/4] bg-secondary">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm lowercase">{cat.label}</span>
                  <span className="text-sm text-muted-foreground">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Split editorial */}
        <section className="grid md:grid-cols-2">
          {[
            { title: "Tops", image: editorial.tops, c: "swim" as const },
            { title: "Bottoms", image: editorial.bottoms, c: "swim" as const },
          ].map((block) => (
            <Link
              key={block.title}
              to="/shop"
              search={{ c: block.c }}
              className="hover-zoom relative block aspect-[4/5] md:aspect-[4/5]"
            >
              <img
                src={block.image}
                alt={`Sunkissed ${block.title.toLowerCase()}`}
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
                <h2 className="display text-5xl leading-[0.95] text-background md:text-6xl">
                  {block.title}
                </h2>
                <span className="pb-1 text-sm lowercase text-background md:text-base">
                  shop now &rarr;
                </span>
              </div>

            </Link>
          ))}
        </section>

        {/* Featured products */}
        <section className="px-4 py-10 md:px-6 md:py-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-4xl md:text-5xl">Just landed</h2>
            <Link to="/shop" search={{ c: "new" }} className="rule-link text-sm">
              shop new arrivals
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
            {featured.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>

        {/* Towels feature */}
        <section className="relative">
          <div className="relative h-[70vh] min-h-[440px] overflow-hidden">
            <img
              src={editorial.towels}
              alt="Sunkissed sand-free beach towels"
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/25" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-12">
              <p className="max-w-md text-sm text-background/90">
                Soft. Durable. Sand-resistant. Designed for life beyond the shore.
              </p>
              <div className="mt-3 flex items-end justify-between gap-6">
                <h2 className="display text-6xl leading-[0.95] text-background md:text-7xl">
                  Beach towels
                </h2>
                <Link
                  to="/shop"
                  search={{ c: "towels" }}
                  className="pb-1 text-sm lowercase text-background md:text-base"
                >
                  shop now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>


        <section className="px-4 py-10 md:px-6 md:py-12">
          <h2 className="display text-4xl md:text-5xl">Towels, rolled &amp; ready</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
            {towels.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>

        {/* Brand note */}
        <section className="border-t border-border px-4 py-12 md:px-6 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-muted-foreground">since the first summer</p>
            <p className="display mt-5 text-4xl md:text-5xl">
              Made for the golden hour, the salt water, and everything after.
            </p>
            <Link to="/about" className="rule-link mt-7 text-sm">
              our story
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
