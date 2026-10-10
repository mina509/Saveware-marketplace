import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug, productsInCategory } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";
import { getSite, siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [cat, { site, all }] = await Promise.all([categoryBySlug(slug), getSite()]);
  if (!cat) return {};
  const home = all.find((s) => s.id === cat.site_id) ?? site;
  return {
    title: cat.name,
    description: `Shop ${cat.name} from ${home.name}. Fast, tracked UK delivery.`,
    alternates: { canonical: `${siteUrl(home)}/category/${cat.slug}` },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await categoryBySlug(slug);
  if (!cat) notFound();
  const products = await productsInCategory(cat.id);
  return (
    <section className="wrap">
      <div className="crumbs"><Link href="/">Home</Link> / {cat.name}</div>
      <div className="sec-head"><h1 className="page-title">{cat.name}</h1><span>{products.length} products</span></div>
      {products.length ? (
        <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="empty">No products here yet.</div>
      )}
    </section>
  );
}
