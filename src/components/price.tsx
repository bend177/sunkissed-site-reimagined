import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

export function Price({ product, className }: { product: Product; className?: string }) {
  if (product.compareAt) {
    return (
      <p className={cn("product-meta", className)}>
        <span className="text-foreground">${product.price}</span>{" "}
        <span className="text-muted-foreground line-through">${product.compareAt}</span>
      </p>
    );
  }
  return <p className={cn("product-meta text-muted-foreground", className)}>${product.price}</p>;
}
