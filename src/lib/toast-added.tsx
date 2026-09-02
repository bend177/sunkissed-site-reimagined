import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { isDesktopViewport, openBagFlyout } from "@/lib/bag-events";

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
      label: (
        <span className="relative inline-flex">
          <ShoppingBag className="size-4" strokeWidth={1.5} />
          <span className="absolute -right-1 -top-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-[9px] font-medium text-background">
            +
          </span>
        </span>
      ) as unknown as string,
      onClick: () => {
        window.location.href = "/cart";
      },
    },
  });
}
