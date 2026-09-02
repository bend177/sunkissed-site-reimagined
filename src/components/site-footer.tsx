import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/sunkissed-logo-black.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-6">
        <div className="col-span-2 md:col-span-1">
          <img src={logoAsset.url} alt="Sunkissed" className="-ml-[5px] h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Swimwear made for long days in the sun - sculpted fits, sand-free towels, and resort
            pieces that travel well.
          </p>
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">shop</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/shop" search={{ c: "swim" }} className="nav-link">
                swimwear
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ c: "one-piece" }} className="nav-link">
                one pieces
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ c: "resort" }} className="nav-link">
                resort wear
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ c: "towels" }} className="nav-link">
                beach towels
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">help</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="nav-link">
                our story
              </Link>
            </li>
            <li>
              <span className="nav-link">shipping</span>
            </li>
            <li>
              <span className="nav-link">returns &amp; exchanges</span>
            </li>
            <li>
              <span className="nav-link">size guide</span>
            </li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="eyebrow text-muted-foreground">newsletter</p>
          <p className="mt-4 text-sm text-muted-foreground">
            New drops, restocks, and the occasional bribe.
          </p>
          <form
            className="mt-5 flex items-center gap-3 border-b border-foreground pb-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="email address"
              aria-label="Email address"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="eyebrow">
              join
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-2 border-t border-border px-4 py-6 text-xs text-muted-foreground md:px-6">
        <p>© {new Date().getFullYear()} Sunkissed. All rights reserved.</p>
        <a
          href="https://www.instagram.com/getsunkissed"
          target="_blank"
          rel="noreferrer"
          className="nav-link capitalize"
        >
          instagram
        </a>
      </div>
    </footer>
  );
}
