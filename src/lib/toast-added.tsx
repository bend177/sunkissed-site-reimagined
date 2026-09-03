import { toast } from "sonner";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { openBagFlyout, isBagFlyoutOpen } from "@/lib/bag-events";

function AddedToast({
  description,
  toastId,
}: {
  description: string;
  toastId: string | number;
}) {
  const count = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  return (
    <div className="flex w-[min(440px,92vw)] items-center gap-3 rounded-full border border-border bg-background px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-background">
        <Check className="size-4" strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-tight text-foreground">
          Added to bag
        </p>
        <p className="truncate text-[12px] leading-tight text-muted-foreground">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          openBagFlyout();
          toast.dismiss(toastId);
        }}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-background transition-opacity hover:opacity-90"
      >
        <ShoppingBag className="size-3.5" strokeWidth={1.5} />
        View bag ({count})
      </button>
    </div>
  );
}

/**
 * After an item is added, shows a compact "Added to bag" toast with the item
 * description and a "View bag" button that opens the bag drawer flyout. Opens
 * on all viewports.
 */
export function notifyAddedToBag(description: string) {
  toast.custom((t) => <AddedToast description={description} toastId={t} />, {
    position: "top-center",
    duration: 4000,
  });
}
