import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { editorial } from "@/data/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story | Sunkissed Swimwear" },
      {
        name: "description",
        content:
          "Sunkissed designs sculpting swimwear, resort pieces and sand-free towels for long days in the sun.",
      },
      { property: "og:title", content: "Our Story | Sunkissed" },
      {
        property: "og:description",
        content: "How Sunkissed makes swimwear for the golden hour.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: editorial.tops },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: editorial.tops },
    ],
  }),
  component: About,
});

const pillars = [
  {
    title: "Fit first",
    body: "Every style is cut, tested and re-cut on real bodies. Sculpting seams, no digging, no readjusting between the water and the bar.",
  },
  {
    title: "Fabric that lasts",
    body: "Double-lined, chlorine- and sun-resistant knits with recovery that survives more than one season.",
  },
  {
    title: "Beyond the shore",
    body: "Sand-free towels, sarongs and beach-to-bar dresses so one bag covers the whole trip.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="grid items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-16 md:px-10 md:py-24">
            <p className="eyebrow text-muted-foreground">our story</p>
            <h1 className="display mt-5 text-5xl md:text-7xl">
              Swimwear for the golden hour
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Sunkissed started with one frustration: swimwear that looked good on a hanger and
              nowhere else. We build the opposite — pieces engineered to hold their shape through
              salt water, sunscreen and long, slow afternoons.
            </p>
            <Link to="/shop" search={{ c: "all" }} className="rule-link mt-8 text-sm">
              shop the collection
            </Link>
          </div>
          <div className="hover-zoom aspect-[4/5] md:aspect-auto">
            <img
              src={editorial.tops}
              alt="Sunkissed swimwear editorial"
              className="size-full object-cover"
            />
          </div>
        </section>

        <section className="grid border-t border-border md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="border-b border-border px-4 py-12 md:border-r md:px-8">
              <h2 className="display text-3xl">{p.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </section>

        <section className="relative h-[60vh] min-h-[380px] overflow-hidden">
          <img
            src={editorial.towels}
            alt="Sunkissed sand-free beach towels on the sand"
            loading="lazy"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="display max-w-2xl text-center text-4xl text-background md:text-5xl">
              Made to be worn all summer, then the next one.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
