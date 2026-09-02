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
import { splitTitle } from "@/data/product-details";
import { Price } from "@/components/price";
import { useCartStore } from "@/lib/cart-store";

export function QuickAddDrawer({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const variants = product.variants;
  const [size, setSize] = useState<string | null>(
    variants.length === 1 ? (variants[0]?.size ?? null) : null,
  );
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const variant = variants.find((v) => v.size === size);

  const add = async () => {
    if (!variant) return;
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
    onOpenChange(false);
    setSize(variants.length === 1 ? (variants[0]?.size ?? null) : null);
    toast.success("Added to bag", {
      description: `${product.title} - size ${variant.size}`,
      position: "top-center",
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
                {splitTitle(product.title).base}
              </DrawerTitle>
              <Price product={product} className="mt-1" />
            </div>
            <DrawerClose aria-label="Close" className="shrink-0 pt-0.5">
              <X className="size-5" strokeWidth={1.25} />
            </DrawerClose>
          </div>

          <p className="eyebrow mt-6">SELECT SIZE</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                onClick={() => setSize(v.size)}
                className={`border py-3 text-xs uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                  size === v.size
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={add}
            disabled={!variant || isLoading}
            className="mt-5 w-full bg-ink py-4 text-xs uppercase tracking-[0.18em] text-background transition-opacity disabled:opacity-40"
          >
            {isLoading ? "ADDING..." : variant ? "ADD TO BAG" : "SELECT A SIZE"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
