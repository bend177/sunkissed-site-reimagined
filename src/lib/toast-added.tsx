import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { isDesktopViewport, openBagFlyout } from "@/lib/bag-events";
import { useCartStore } from "@/lib/cart-store";

function ToastCartAction() {
  const count = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  return (
    <span className="relative inline-flex size-9 items-center justify-center rounded-full border border-ink bg-background">
      <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-ink text-[9px] leading-none text-background">
          {count}
        </span>
      )}
    </span>
  );
}

/**
 * After an item is added: on desktop, slides the header bag flyout open so
 * the shopper can review the bag. On mobile/tablet, shows the standard
 * "Added to bag" toast with a cart icon action instead.
 */
export function notifyAddedToBag(description: string) {
  if (isDesktopViewport()) {
    openBagFlyout();
    return;
  }
  toast.success("Added to bag", {
    description,
    position: "top-center",
    action: {
      label: (<ToastCartAction />) as unknown as string,
      onClick: () => {
        window.location.href = "/cart";
      },
    },
  });
}
