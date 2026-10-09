import { searchProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; seller?: string }> }) {
  const { q = "", seller } = await searchParams;
  const products = await searchProducts(q, seller);
  const title = q ? `Results for “${q}”` : seller ? `All ${seller} products` : "All products";
  return (
    <section className="wrap">
      <div className="sec-head"><h1 className="page-title">{title}</h1><span>{products.length} products</span></div>
      {products.length ? (
        <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="empty">Nothing found. Try a different word.</div>
      )}
    </section>
  );
}
