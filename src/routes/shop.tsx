import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/lib/catalog";
import {
  colorsIn,
  colorOf,
  featuredPrints,
  priceNum,
  productType,
  SIZES,
  SORT_LABEL,
  TYPE_LABEL,
  TYPE_ORDER,
  type ProductType,
  type SortKey,
} from "@/data/shop-filters";
import { swatchFill } from "@/data/product-details";


type Filter = "all" | "new" | "swim" | "one-piece" | "resort" | "towels";

const typesFor = (c: Filter): ProductType[] => {
  switch (c) {
    case "swim":
      return ["sets", "tops", "bottoms"];
    case "one-piece":
      return ["one-pieces"];
    case "resort":
      return ["resort"];
    case "towels":
      return ["towels"];
    default:
      return [];
  }
};

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
  const products = useCatalog();
  const allColors = colorsIn(products);


  const [types, setTypes] = useState<ProductType[]>(typesFor(c));
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("rec");
  const [sortOpen, setSortOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [printsAll, setPrintsAll] = useState(false);

  useEffect(() => {
    setTypes(typesFor(c));
    setColors([]);
    setSizes([]);
  }, [c]);

  const newOnly = c === "new";

  const toggle = <T,>(list: T[], set: (v: T[]) => void, value: T) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  let list = products.filter((p) => {
    if (types.length && !types.includes(productType(p))) return false;
    if (colors.length && !colors.includes(colorOf(p))) return false;
    if (
      sizes.length &&
      !p.variants.some((v) => v.available && sizes.includes(v.size.toUpperCase()))
    )
      return false;
    return true;
  });
  if (newOnly) list = list.filter((p) => p.category !== "towels").slice(0, 24);

  if (sort === "price-asc") list = [...list].sort((a, b) => priceNum(a) - priceNum(b));
  else if (sort === "price-desc") list = [...list].sort((a, b) => priceNum(b) - priceNum(a));
  else if (sort === "new") list = [...list].reverse();

  const bikiniFamily =
    types.length > 0 &&
    types.every((t) => ["sets", "tops", "bottoms", "one-pieces"].includes(t));

  const pageTitle = newOnly
    ? "New Arrivals"
    : colors.length === 1 && !types.length
      ? colors[0]!
      : bikiniFamily && types.length === 3
        ? "Bikinis"
        : types.length === 1
          ? TYPE_LABEL[types[0]!]
          : "Shop All";

  const filterCount = types.length + colors.length + sizes.length;
  const allPrints = featuredPrints(products);
  const prints = printsAll
    ? allColors.map((x) => x.name)
    : allPrints.slice(0, 3);
  const colorImage = new Map(allColors.map((x) => [x.name, x] as const));

  const chip = (on: boolean) =>
    `eyebrow border px-2.5 py-1.5 text-[10.5px] whitespace-nowrap transition-colors ${
      on ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
    }`;

  const setOnly = (t: ProductType[]) => {
    setTypes(t);
    setColors([]);
    setMobileFiltersOpen(false);
  };

  const filterBody = (
    <>
      <div>
        <p className="text-[15px]">Product Type</p>
        <div className="flex flex-col gap-3 pb-5 pt-3.5">
          {TYPE_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggle(types, setTypes, t)}
              className="flex items-center gap-2.5 text-left text-[13.5px]"
            >
              <span
                className={`flex size-[17px] shrink-0 items-center justify-center border border-foreground text-[11px] ${
                  types.includes(t) ? "bg-foreground text-background" : ""
                }`}
              >
                {types.includes(t) ? "✓" : ""}
              </span>
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <p className="pt-4 text-[15px]">Color</p>
        <div className="flex flex-col gap-2.5 pb-5 pt-3.5">
          {allColors.map((cl) => (
            <button
              key={cl.name}
              type="button"
              onClick={() => toggle(colors, setColors, cl.name)}
              className="flex items-center gap-2.5 text-left text-[13.5px]"
            >
              <span
                className={`flex size-[17px] shrink-0 items-center justify-center border border-foreground text-[11px] ${
                  colors.includes(cl.name) ? "bg-foreground text-background" : ""
                }`}
              >
                {colors.includes(cl.name) ? "✓" : ""}
              </span>
              <span
                title={cl.name}
                style={swatchFill(products, cl.name, cl.image, cl.focusY)}
                className="size-[22px] shrink-0 rounded-full ring-1 ring-border"
              />

              {cl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <p className="pt-4 text-[15px]">Size</p>
        <div className="flex gap-1.5 pb-2.5 pt-3.5">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(sizes, setSizes, s)}
              className={`flex-1 border border-foreground py-2 text-center text-[12.5px] ${
                sizes.includes(s) ? "bg-foreground text-background" : ""
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="mx-auto box-border max-w-[1440px] px-4 pt-8 md:px-12 md:pt-14">
          <h1 className="display text-[38px] leading-[1.05] md:text-[clamp(48px,5vw,72px)]">
            {pageTitle}{" "}
            <sup className="font-sans text-[12px] text-muted-foreground md:text-[15px]">
              {list.length}
            </sup>
          </h1>

          {bikiniFamily && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(
                  [
                    ["Bikini sets", ["sets"]],
                    ["Tops", ["tops"]],
                    ["Bottoms", ["bottoms"]],
                    ["One Pieces", ["one-pieces"]],
                    ["Separates", ["tops", "bottoms"]],
                  ] as [string, ProductType[]][]
                ).map(([label, t]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOnly(t)}
                    className={chip(
                      types.length === t.length && t.every((x) => types.includes(x)),
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="eyebrow text-muted-foreground">Featured Prints</span>
                {prints.map((name) => {
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColors([name])}
                      title={name}
                      className="flex items-center gap-2 text-[13.5px] transition-opacity hover:opacity-60"
                    >
                      <span
                        aria-hidden
                        style={swatchFill(products, name, colorImage.get(name)?.image, colorImage.get(name)?.focusY)}
                        className={`size-[24px] shrink-0 rounded-full ring-1 ${
                          colors.includes(name) ? "ring-2 ring-foreground" : "ring-border"
                        }`}
                      />

                      <span className="hidden sm:inline">{name}</span>
                    </button>
                  );
                })}
                {!printsAll && (
                  <button
                    type="button"
                    aria-label="Show all featured prints"
                    onClick={() => setPrintsAll(true)}
                    className="flex size-[24px] shrink-0 items-center justify-center rounded-full border border-foreground/20 text-[14px] leading-none text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
                  >
                    +
                  </button>
                )}
                {printsAll && (
                  <button
                    type="button"
                    onClick={() => setPrintsAll(false)}
                    className="text-[12px] underline underline-offset-4 hover:opacity-60"
                  >
                    Show less
                  </button>
                )}
              </div>

            </div>
          )}
        </section>

        {/* Filter toolbar */}
        <div className="mx-auto box-border flex max-w-[1440px] flex-nowrap items-center justify-between gap-2 px-4 pb-5 pt-6 md:gap-4 md:px-12 md:pb-6 md:pt-11">
          <div className="flex shrink-0 items-center gap-2 md:gap-3.5">
            <span className="whitespace-nowrap text-[11px] text-muted-foreground md:text-[13px]">
              {filterCount === 0
                ? "No Filters"
                : `${filterCount} Filter${filterCount === 1 ? "" : "s"}`}
            </span>
            {filterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setTypes([]);
                  setColors([]);
                  setSizes([]);
                }}
                className="text-[12px] underline underline-offset-[3px]"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setMobileFiltersOpen(!mobileFiltersOpen);
              }}
              className="flex items-center gap-1.5 border border-foreground px-3 py-1.5 text-[12px] transition-colors hover:bg-foreground hover:text-background"
            >
              Filters{" "}
              <span className="text-[15px] leading-none">
                {mobileFiltersOpen || sidebarOpen ? "−" : "+"}
              </span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="text-[12px] md:text-[13.5px]"
              >
                Sort by:{" "}
                <span className="underline underline-offset-[3px]">{SORT_LABEL[sort]}</span>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[60] flex min-w-[210px] flex-col border border-border bg-background p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                  {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setSort(k);
                        setSortOpen(false);
                      }}
                      className={`px-3 py-2 text-left text-[12.5px] ${
                        k === sort ? "bg-secondary font-semibold" : ""
                      }`}
                    >
                      {SORT_LABEL[k]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter panel */}
        {mobileFiltersOpen && (
          <div className="flex flex-col gap-2 border-y border-border px-4 py-4 lg:hidden">
            {filterBody}
          </div>
        )}

        <div className="mx-auto box-border flex max-w-[1440px] items-start gap-9 px-4 pb-16 md:px-12">
          <section className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
            {list.length === 0 && (
              <p className="col-span-full py-10 text-sm text-muted-foreground">
                Nothing matches those filters yet.
              </p>
            )}
          </section>

          {sidebarOpen && (
            <aside className="hidden w-[250px] shrink-0 lg:block">
              <p className="eyebrow border-b border-foreground pb-3">Filters</p>
              <div className="pt-2">{filterBody}</div>
            </aside>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
