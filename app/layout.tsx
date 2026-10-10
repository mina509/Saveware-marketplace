import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSite, siteUrl } from "@/lib/site";
import { categoriesFor } from "@/lib/queries";
import { copy } from "@/lib/copy";
import { BasketProvider, BasketCount } from "@/components/Basket";
import { Cart, User } from "@/components/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSite();
  const c = copy[site.id];
  return {
    metadataBase: new URL(siteUrl(site)),
    openGraph: { siteName: site.name, type: "website", locale: "en_GB" },
    title: { default: `${site.name} — ${c?.tagline.toLowerCase() ?? ""}`, template: `%s | ${site.name}` },
    description: c?.intro,
    icons: { icon: `/logos/${site.id}.svg` },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, sister } = await getSite();
  const cats = await categoriesFor(site.id);
  const c = copy[site.id] ?? copy.saveware;
  const style = {
    "--primary": site.theme.primary,
    "--secondary": site.theme.secondary,
    "--ink": site.theme.ink,
    "--sister": sister?.theme.primary ?? site.theme.secondary,
  } as React.CSSProperties;

  return (
    <html lang="en-GB">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={style}>
        <BasketProvider>
          <div className="topbar"><div className="wrap">
            <span>{c.freeShip} · Tracked UK delivery</span>
            <Link href="/basket">Track order</Link>
          </div></div>

          <header className="site">
            <div className="wrap head">
              <Link href="/" className="logo" aria-label={`${site.name} home`}>
                <img src={`/logos/${site.id}.svg`} alt={site.name} />
              </Link>
              <form className="search" action="/search">
                <label htmlFor="q" className="sr">Search products</label>
                <input id="q" name="q" type="search" placeholder="Search health & medical products…" />
                <button>Search</button>
              </form>
              <nav className="icons">
                <Link href="/basket" aria-label="Account"><User /><span>Account</span></Link>
                <Link href="/basket" aria-label="Basket"><Cart /><span>Basket</span><BasketCount /></Link>
              </nav>
            </div>
            <div className="wrap">
              <nav className="cats-nav">
                {cats.map((cat) => <Link key={cat.id} href={`/category/${cat.slug}`}>{cat.name}</Link>)}
                {sister && <Link className="sister" href={`/search?seller=${sister.id}`}>{sister.name}</Link>}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site">
            <div className="wrap foot">
              <div>
                <span className="ft-logo"><img src={`/logos/${site.id}.svg`} alt={site.name} /></span>
                <span>{c.footer} Part of the saveware &amp; kareo6 group.</span>
              </div>
              <div>
                <strong>Shop</strong>
                <Link href="/search">All products</Link>
                {sister && <a href={siteUrl(sister)}>{sister.name}</a>}
              </div>
              <div>
                <strong>Help</strong>
                <span>Delivery &amp; returns</span>
                <span>Contact us</span>
                <span>Sell with us</span>
              </div>
              <div>
                <strong>Get the app</strong>
                <span>Shop every seller in one marketplace. Coming soon.</span>
              </div>
            </div>
          </footer>
        </BasketProvider>
      </body>
    </html>
  );
}
