import { useEffect, useState } from "react";

// Cache of image URL -> whether its background is (near-)white.
const cache = new Map<string, boolean>();
const pending = new Map<string, Promise<boolean>>();

function detect(src: string): Promise<boolean> {
  const hit = cache.get(src);
  if (hit !== undefined) return Promise.resolve(hit);
  const running = pending.get(src);
  if (running) return running;

  const p = new Promise<boolean>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.drawImage(img, 0, 0, size, size);
        // Sample a ring of points along all four edges; a studio shot on
        // white is mostly near-white around the frame even when the model
        // touches one or two edges.
        const pts: [number, number][] = [];
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          const t = 1 + Math.round((i / steps) * (size - 3));
          pts.push([t, 1], [t, size - 2], [1, t], [size - 2, t]);
        }
        let white = 0;
        for (const [x, y] of pts) {
          const d = ctx.getImageData(x, y, 1, 1).data;
          if (d[0]! > 225 && d[1]! > 225 && d[2]! > 225) white++;
        }
        const isWhite = white / pts.length >= 0.6;
        cache.set(src, isWhite);
        resolve(isWhite);
      } catch {
        cache.set(src, false);
        resolve(false);
      }
    };
    img.onerror = () => {
      cache.set(src, false);
      resolve(false);
    };
    img.src = src;
  }).finally(() => pending.delete(src));

  pending.set(src, p);
  return p;
}

/** True when the image appears to be shot on a white background. */
export function useWhiteBackground(src: string | undefined): boolean {
  const [isWhite, setIsWhite] = useState(() =>
    src ? (cache.get(src) ?? false) : false,
  );

  useEffect(() => {
    if (!src) {
      setIsWhite(false);
      return;
    }
    const hit = cache.get(src);
    if (hit !== undefined) {
      setIsWhite(hit);
      return;
    }
    let alive = true;
    void detect(src).then((v) => {
      if (alive) setIsWhite(v);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  return isWhite;
}
