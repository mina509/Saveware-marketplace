import { db } from "./supabase";
import type { Category, Product } from "./types";

const PRODUCT_FIELDS = "*, sellers(name, slug)";

export async function categoriesFor(siteId: string): Promise<Category[]> {
  const { data } = await db().from("categories").select("*")
    .or(`site_id.eq.${siteId},shared.eq.true`).order("sort_order");
  // Own categories first, shared ones from the sister brand after
  (data ?? []).sort((a, b) => Number(a.site_id !== siteId) - Number(b.site_id !== siteId) || a.sort_order - b.sort_order);
  return (data ?? []) as Category[];
}

export async function featuredBySeller(sellerId: string, limit = 8): Promise<Product[]> {
  const { data } = await db().from("products").select(PRODUCT_FIELDS)
    .eq("seller_id", sellerId).eq("status", "active").eq("featured", true)
    .order("created_at").limit(limit);
  return (data ?? []) as Product[];
}

export async function productBySlug(slug: string): Promise<Product | null> {
  const { data } = await db().from("products").select(PRODUCT_FIELDS).eq("slug", slug).eq("status", "active").maybeSingle();
  return (data as Product) ?? null;
}

export async function categoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await db().from("categories").select("*").eq("slug", slug).maybeSingle();
  return (data as Category) ?? null;
}

export async function productsInCategory(categoryId: string): Promise<Product[]> {
  const { data } = await db().from("products").select(PRODUCT_FIELDS)
    .eq("category_id", categoryId).eq("status", "active").order("name");
  return (data ?? []) as Product[];
}

export async function searchProducts(q: string, sellerSlug?: string): Promise<Product[]> {
  let query = db().from("products").select("*, sellers!inner(name, slug)").eq("status", "active");
  const term = q.trim().replace(/[%,()]/g, " ");
  if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  if (sellerSlug) query = query.eq("sellers.slug", sellerSlug);
  const { data } = await query.order("name").limit(60);
  return (data ?? []) as Product[];
}

export async function allActiveProductsBySeller(sellerId: string): Promise<Product[]> {
  const { data } = await db().from("products").select(PRODUCT_FIELDS)
    .eq("seller_id", sellerId).eq("status", "active").order("name").limit(5000);
  return (data ?? []) as Product[];
}
