import Link from "next/link";
import type { Product } from "@/lib/types";
import { gbp } from "@/lib/format";
import AddToBasket from "./AddToBasket";
import { Box } from "./Icons";

export default function ProductCard({ p }: { p: Product }) {
  const seller = p.sellers?.name ?? "";
  return (
    <article className="card">
      <Link href={`/product/${p.slug}`} className="img">
        {p.badge && <span className="deal">{p.badge}</span>}
        {p.images[0] ? <img src={p.images[0]} alt={p.name} /> : <Box />}
      </Link>
      <div className="body">
        <span className="brand">{seller}</span>
        <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        {p.certification && <span className="cert">{p.certification} marked</span>}
        <span className="price">
          {gbp(p.price_pence)}
          {p.compare_at_pence ? <span className="was">{gbp(p.compare_at_pence)}</span> : null}
        </span>
        <AddToBasket
          inStock={p.stock > 0}
          item={{ id: p.id, slug: p.slug, name: p.name, seller, price_pence: p.price_pence, image: p.images[0] }}
        />
      </div>
    </article>
  );
}
