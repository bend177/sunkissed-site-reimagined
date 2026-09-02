const OPEN_BAG_EVENT = "open-bag-flyout";

/**
 * Opens the header bag flyout. Call this after an item is added on desktop
 * so the cart slides in. On mobile the toast is shown instead (see
 * notifyAddedToBag).
 */
export function openBagFlyout() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_BAG_EVENT));
}

export function onOpenBagFlyout(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(OPEN_BAG_EVENT, handler);
  return () => window.removeEventListener(OPEN_BAG_EVENT, handler);
}

/** True on desktop breakpoints (lg and up, >= 1024px). */
export function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}
