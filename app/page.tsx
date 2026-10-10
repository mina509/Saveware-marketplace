import Link from "next/link";
import { getSite, siteUrl } from "@/lib/site";
import { categoriesFor, featuredBySeller } from "@/lib/queries";
import { copy } from "@/lib/copy";
import ProductCard from "@/components/ProductCard";
import { Check, Drop, Pulse } from "@/components/Icons";

export const dynamic = "force-dynamic";

const promises = [
  ["Verified sellers", "Every seller and product is reviewed before it goes live."],
  ["Secure checkout", "Card, Apple Pay and Google Pay."],
  ["Fast UK delivery", "Tracked delivery across the UK."],
  ["Easy returns", "Simple returns on eligible items."],
];

export default async function Home() {
  const { site, sister } = await getSite();
  const c = copy[site.id] ?? copy.saveware;
  const [cats, own, sisterProducts] = await Promise.all([
    categoriesFor(site.id),
    featuredBySeller(site.seller_id),
    sister ? featuredBySeller(sister.seller_id, 4) : Promise.resolve([]),
  ]);

  return (
    <>
      <section className="wrap">
        <div className="hero">
          <div className="hero-copy">
            <span className="tag">{c.tagline}</span>
            <h1>{c.title}</h1>
            <p>{c.intro}</p>
            <div className="btns">
              <Link href={`/search?seller=${site.id}`} className="btn btn-primary">{c.shopLabel}</Link>
              {sister && <Link href={`/search?seller=${sister.id}`} className="btn btn-ghost">{c.sisterCta}</Link>}
            </div>
          </div>
          <div className="ph">[Hero image]</div>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="wrap">
          <div className="sec-head"><h2>Shop by category</h2></div>
          <div className="cat-grid">
            {cats.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="cat"><span>{cat.site_id === "kareo6" ? <Pulse /> : <Drop />}</span>{cat.name}</Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap">
        <div className="sec-head">
          <h2>Best sellers from {site.name}</h2>
          <Link href={`/search?seller=${site.id}`}>View all</Link>
        </div>
        <div className="grid">{own.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      {sister && sisterProducts.length > 0 && (
        <section className="wrap">
          <div className="sister-box">
            <div className="sec-head" style={{ alignItems: "center" }}>
              <div>
                <span className="kicker">{c.sisterKicker}</span>
                <h2>{c.sisterTitle}</h2>
                <p>{c.sisterText}</p>
              </div>
              <a href={siteUrl(sister)} className="btn btn-sister">Visit {sister.name}</a>
            </div>
            <div className="grid">{sisterProducts.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </section>
      )}

      <section className="wrap">
        <div className="promises">
          {promises.map(([t, d]) => (
            <div key={t} className="promise"><span><Check /></span><div><strong>{t}</strong><small>{d}</small></div></div>
          ))}
        </div>
      </section>
    </>
  );
}
