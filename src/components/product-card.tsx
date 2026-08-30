import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <div className="hover-zoom aspect-[3/4] bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="text-sm lowercase">{product.title}</h3>
        <p className="text-sm text-muted-foreground">${product.price}</p>
      </div>
    </article>
  );
}
