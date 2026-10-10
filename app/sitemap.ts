import type { MetadataRoute } from "next";
import { getSite, siteUrl } from "@/lib/site";
import { allActiveProductsBySeller, categoriesFor } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Each brand's sitemap lists only its own pages, so Google sees no duplicates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getSite();
  const base = siteUrl(site);
  const [cats, products] = await Promise.all([
    categoriesFor(site.id),
    allActiveProductsBySeller(site.seller_id),
  ]);
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    ...cats.filter((c) => c.site_id === site.id).map((c) => ({
      url: `${base}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7,
    })),
  ];
}
