import type { MetadataRoute } from "next";
import { getSite, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSite();
  const base = siteUrl(site);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/basket", "/search"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
