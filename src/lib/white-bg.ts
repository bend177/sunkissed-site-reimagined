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
        // Sample the four corners + edge midpoints; a studio shot on white
        // has near-white pixels around the whole frame.
        const pts: [number, number][] = [
          [1, 1],
          [size - 2, 1],
          [1, size - 2],
          [size - 2, size - 2],
          [Math.floor(size / 2), 1],
          [Math.floor(size / 2), size - 2],
        ];
        let white = 0;
        for (const [x, y] of pts) {
          const d = ctx.getImageData(x, y, 1, 1).data;
          if (d[0]! > 225 && d[1]! > 225 && d[2]! > 225) white++;
        }
        const isWhite = white >= pts.length - 1;
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
