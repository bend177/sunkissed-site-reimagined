import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Product } from "@/data/products";
import { getProductDetail } from "@/data/product-details";
import { Price } from "@/components/price";

export function QuickAddDrawer({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const detail = getProductDetail(product.handle);
  const sizes = detail?.sizes ?? ["one size"];
  const [size, setSize] = useState<string | null>(null);

  const add = () => {
    if (!size) return;
    onOpenChange(false);
    setSize(null);
    toast.success("added to bag", {
      description: `${product.title} - size ${size}`,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-none border-border bg-background">
        <div className="mx-auto w-full max-w-lg px-5 pb-8 pt-2">
          <div className="flex items-start gap-4">
            <img
              src={product.image}
              alt={product.title}
              className="h-24 w-[72px] shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <DrawerTitle className="truncate text-sm font-normal">
                {product.title}
              </DrawerTitle>
              <Price product={product} className="mt-1" />
            </div>
            <DrawerClose aria-label="Close" className="shrink-0 pt-0.5">
              <X className="size-5" strokeWidth={1.25} />
            </DrawerClose>
          </div>

          <p className="eyebrow mt-6">select size</p>
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
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={add}
            disabled={!size}
            className="mt-5 w-full bg-ink py-4 text-xs uppercase tracking-[0.18em] text-background transition-opacity disabled:opacity-40"
          >
            {size ? "add to bag" : "select a size"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
