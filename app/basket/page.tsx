"use client";
import Link from "next/link";
import { useBasket } from "@/components/Basket";
import { gbp } from "@/lib/format";

const FREE_SHIPPING = 3000;
const SHIPPING = 399;

export default function BasketPage() {
  const { items, setQty, remove, subtotal } = useBasket();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING;

  if (!items.length) {
    return (
      <section className="wrap">
        <h1 className="page-title" style={{ marginBottom: 20 }}>Your basket</h1>
        <div className="empty">Your basket is empty. <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Start shopping</Link></div>
      </section>
    );
  }

  return (
    <section className="wrap">
      <h1 className="page-title" style={{ marginBottom: 20 }}>Your basket</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((i) => (
            <div key={i.id} className="basket-row">
              <div className="grow">
                <span className="brand">{i.seller}</span>
                <div><Link href={`/product/${i.slug}`} style={{ fontWeight: 500 }}>{i.name}</Link></div>
                <button className="link-btn" onClick={() => remove(i.id)}>Remove</button>
              </div>
              <div className="qty">
                <button aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                <strong>{i.qty}</strong>
                <button aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <strong style={{ minWidth: 80, textAlign: "right" }}>{gbp(i.qty * i.price_pence)}</strong>
            </div>
          ))}
        </div>
        <aside className="summary" style={{ flex: "1 1 280px" }}>
          <div className="line"><span>Subtotal</span><span>{gbp(subtotal)}</span></div>
          <div className="line"><span>Delivery</span><span>{shipping ? gbp(shipping) : "Free"}</span></div>
          <div className="line total"><span>Total</span><span>{gbp(subtotal + shipping)}</span></div>
          <button className="btn btn-primary" disabled style={{ opacity: .6 }}>Checkout — coming soon</button>
        </aside>
      </div>
    </section>
  );
}
