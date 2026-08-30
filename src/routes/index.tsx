import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { editorial, products } from "@/data/products";

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
            <div className="absolute inset-x-0 bottom-0 px-4 pb-12 md:px-6 md:pb-16">
              <p className="eyebrow rise text-background/80">the animalistique collection</p>
              <h1 className="display rise mt-3 max-w-4xl text-[13vw] text-background md:text-[7vw]">
                Designed to seduce
              </h1>
              <Link
                to="/shop"
                search={{ c: "new" }}
                className="rule-link rise mt-6 text-background"
              >
                shop the collection
              </Link>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden border-y border-border py-3">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="eyebrow flex shrink-0 gap-10 pr-10 text-muted-foreground">
                <span>sculpting fits</span>
                <span>·</span>
                <span>italian fabric</span>
                <span>·</span>
                <span>sand-free towels</span>
                <span>·</span>
                <span>free u.s. shipping</span>
                <span>·</span>
                <span>hassle-free returns</span>
                <span>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Category grid */}
        <section className="px-4 py-14 md:px-6">
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
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <h2 className="display text-5xl text-background md:text-6xl">{block.title}</h2>
                <span className="rule-link mt-3 text-background">shop now</span>
              </div>
            </Link>
          ))}
        </section>

        {/* Featured products */}
        <section className="px-4 py-16 md:px-6">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-4xl md:text-5xl">Just landed</h2>
            <Link to="/shop" search={{ c: "new" }} className="rule-link text-sm">
              shop new
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
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="display max-w-3xl text-6xl text-background md:text-7xl">
                Beach towels
              </h2>
              <p className="mt-4 max-w-md text-sm text-background/90">
                Soft. Durable. Sand-resistant. Designed for life beyond the shore.
              </p>
              <Link
                to="/shop"
                search={{ c: "towels" }}
                className="rule-link mt-6 text-background"
              >
                shop all
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-6">
          <h2 className="display text-4xl md:text-5xl">Towels, rolled &amp; ready</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
            {towels.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>

        {/* Brand note */}
        <section className="border-t border-border px-4 py-20 md:px-6">
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
