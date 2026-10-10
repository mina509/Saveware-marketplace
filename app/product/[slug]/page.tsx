import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productBySlug } from "@/lib/queries";
import { getSite, siteUrl, siteForSeller } from "@/lib/site";
import { gbp } from "@/lib/format";
import AddToBasket from "@/components/AddToBasket";
import { Box } from "@/components/Icons";

export const dynamic = "force-dynamic";

const abs = (base: string, src: string) => (src.startsWith("http") ? src : base + src);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [p, { site, all }] = await Promise.all([productBySlug((await params).slug), getSite()]);
  if (!p) return { title: "Product" };
  const home = siteUrl(siteForSeller(all, p.seller_id, site));
  const description = (p.description ?? `${p.name} from ${p.sellers?.name ?? site.name}.`).slice(0, 160);
  return {
    title: p.name,
    description,
    alternates: { canonical: `${home}/product/${p.slug}` },
    openGraph: { title: p.name, description, url: `${home}/product/${p.slug}`, images: p.images.map((i) => abs(home, i)) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [p, { site, all }] = await Promise.all([productBySlug((await params).slug), getSite()]);
  if (!p) notFound();
  const seller = p.sellers?.name ?? "";
  const home = siteUrl(siteForSeller(all, p.seller_id, site));

  // Structured data Google reads for rich results (price, stock, brand)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    description: p.description ?? p.name,
    image: p.images.map((i) => abs(home, i)),
    brand: { "@type": "Brand", name: seller },
    offers: {
      "@type": "Offer",
      url: `${home}/product/${p.slug}`,
      priceCurrency: "GBP",
      price: (p.price_pence / 100).toFixed(2),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: seller },
    },
  };

  return (
    <section className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="crumbs"><Link href="/">Home</Link> / {p.name}</div>
      <div className="product">
        <div className="gallery">{p.images[0] ? <img src={p.images[0]} alt={p.name} /> : <Box />}</div>
        <div className="info">
          <span className="brand">Sold by {seller}</span>
          <h1>{p.name}</h1>
          {p.certification && <span className="cert">{p.certification} marked</span>}
          <span className="price">
            {gbp(p.price_pence)}
            {p.compare_at_pence ? <span className="was">{gbp(p.compare_at_pence)}</span> : null}
          </span>
          <span style={{ color: p.stock > 0 ? "var(--primary)" : "#B42318", fontWeight: 700 }}>
            {p.stock > 0 ? "In stock" : "Out of stock"}
          </span>
          <AddToBasket withQty inStock={p.stock > 0}
            item={{ id: p.id, slug: p.slug, name: p.name, seller, price_pence: p.price_pence, image: p.images[0] }} />
          <div style={{ color: "var(--muted)", whiteSpace: "pre-line" }}>{p.description ?? "Product description coming soon."}</div>
        </div>
      </div>
    </section>
  );
}
