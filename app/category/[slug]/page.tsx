import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug, productsInCategory } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

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
