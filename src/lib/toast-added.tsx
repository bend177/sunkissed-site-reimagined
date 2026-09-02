import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

/**
 * Shows the standard "Added to bag" toast with a cart icon action that
 * takes the shopper to the cart page so they can review what they added.
 */
export function notifyAddedToBag(description: string) {
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
