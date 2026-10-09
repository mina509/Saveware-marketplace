"use client";
import { useState } from "react";
import { useBasket, BasketItem } from "./Basket";

export default function AddToBasket({ item, inStock, withQty = false }: {
  item: Omit<BasketItem, "qty">; inStock: boolean; withQty?: boolean;
}) {
  const { add } = useBasket();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      {withQty && (
        <div className="qty">
          <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <strong>{qty}</strong>
          <button aria-label="Increase quantity" onClick={() => setQty(qty + 1)}>+</button>
        </div>
      )}
      <button className="add" onClick={onAdd} disabled={!inStock}>
        {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to basket"}
      </button>
    </>
  );
}
