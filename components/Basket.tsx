"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BasketItem = { id: string; slug: string; name: string; seller: string; price_pence: number; qty: number; image?: string };

type Ctx = {
  items: BasketItem[];
  add: (item: Omit<BasketItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  count: number;
  subtotal: number;
};

const BasketContext = createContext<Ctx | null>(null);
const KEY = "basket-v1";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: BasketItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const add: Ctx["add"] = (item, qty = 1) => {
    const found = items.find((i) => i.id === item.id);
    save(found
      ? items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      : [...items, { ...item, qty }]);
  };
  const setQty = (id: string, qty: number) =>
    save(qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i)));
  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price_pence, 0);

  return (
    <BasketContext.Provider value={{ items, add, setQty, remove, count, subtotal }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
  return ctx;
}

export function BasketCount() {
  const { count } = useBasket();
  return <span className="count" aria-label={`${count} items`}>{count}</span>;
}
