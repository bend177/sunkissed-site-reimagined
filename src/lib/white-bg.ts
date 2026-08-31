import { useEffect, useState } from "react";

export type BgKind = "white" | "gray" | "other";

// Cache of image URL -> detected background kind.
const cache = new Map<string, BgKind>();
const pending = new Map<string, Promise<BgKind>>();

function detect(src: string): Promise<BgKind> {
  const hit = cache.get(src);
  if (hit !== undefined) return Promise.resolve(hit);
  const running = pending.get(src);
  if (running) return running;

  const p = new Promise<BgKind>((resolve) => {
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
        // Sample a ring of points along all four edges; a studio shot on a
        // seamless backdrop is mostly uniform around the frame even when the
        // model touches one or two edges.
        const pts: [number, number][] = [];
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          const t = 1 + Math.round((i / steps) * (size - 3));
          pts.push([t, 1], [t, size - 2], [1, t], [size - 2, t]);
        }
        let white = 0;
        let gray = 0;
        let uniform = 0;
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        const samples: number[][] = [];
        for (const [x, y] of pts) {
          const d = ctx.getImageData(x, y, 1, 1).data;
          const r = d[0]!;
          const g = d[1]!;
          const b = d[2]!;
          samples.push([r, g, b]);
          rSum += r;
          gSum += g;
          bSum += b;
          const neutral = Math.abs(r - g) < 12 && Math.abs(g - b) < 12;
          if (r > 225 && g > 225 && b > 225 && neutral) white++;
          else if (r > 200 && neutral) gray++;
        }
        const n = pts.length;
        const rAvg = rSum / n;
        const gAvg = gSum / n;
        const bAvg = bSum / n;
        for (const [r, g, b] of samples) {
          if (
            Math.abs(r - rAvg) < 18 &&
            Math.abs(g - gAvg) < 18 &&
            Math.abs(b - bAvg) < 18
          )
            uniform++;
        }
        let kind: BgKind = "other";
        // A near-white seamless backdrop gets blended onto the gray container.
        if (white / n >= 0.6) kind = "white";
        // A light-gray seamless backdrop already matches the container - render
        // it as-is so multiply doesn't double-darken it.
        else if (gray / n >= 0.6 && uniform / n >= 0.7) kind = "gray";
        cache.set(src, kind);
        resolve(kind);
      } catch {
        cache.set(src, "other");
        resolve("other");
      }
    };
    img.onerror = () => {
      cache.set(src, "other");
      resolve("other");
    };
    img.src = src;
  }).finally(() => pending.delete(src));

  pending.set(src, p);
  return p;
}

/** Detected background kind for the image ("white" | "gray" | "other"). */
export function useBackgroundKind(src: string | undefined): BgKind {
  const [kind, setKind] = useState<BgKind>(() =>
    src ? (cache.get(src) ?? "other") : "other",
  );

  useEffect(() => {
    if (!src) {
      setKind("other");
      return;
    }
    const hit = cache.get(src);
    if (hit !== undefined) {
      setKind(hit);
      return;
    }
    let alive = true;
    void detect(src).then((v) => {
      if (alive) setKind(v);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  return kind;
}

/** True when the image appears to be shot on a white background. */
export function useWhiteBackground(src: string | undefined): boolean {
  return useBackgroundKind(src) === "white";
}
