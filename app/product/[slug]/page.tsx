import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productBySlug } from "@/lib/queries";
import { gbp } from "@/lib/format";
import AddToBasket from "@/components/AddToBasket";
import { Box } from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await productBySlug((await params).slug);
  return { title: p?.name ?? "Product", description: p?.description ?? undefined };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await productBySlug((await params).slug);
  if (!p) notFound();
  const seller = p.sellers?.name ?? "";
  return (
    <section className="wrap">
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
          <p style={{ color: "var(--muted)" }}>{p.description ?? "Product description coming soon."}</p>
        </div>
      </div>
    </section>
  );
}
