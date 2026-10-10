import { getSite, siteUrl } from "@/lib/site";
import { allActiveProductsBySeller } from "@/lib/queries";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Google Merchant Center product feed: https://www.<brand>/feed.xml */
export async function GET() {
  const { site } = await getSite();
  const base = siteUrl(site);
  const products = await allActiveProductsBySeller(site.seller_id);

  const items = products.map((p) => {
    const img = p.images[0] ? (p.images[0].startsWith("http") ? p.images[0] : base + p.images[0]) : "";
    const extra = p.images.slice(1, 10).map((i) =>
      `<g:additional_image_link>${esc(i.startsWith("http") ? i : base + i)}</g:additional_image_link>`).join("");
    return `<item>
<g:id>${esc(p.slug)}</g:id>
<g:title>${esc(p.name)}</g:title>
<g:description>${esc(p.description ?? p.name)}</g:description>
<g:link>${base}/product/${esc(p.slug)}</g:link>
${img ? `<g:image_link>${esc(img)}</g:image_link>` : ""}${extra}
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
<g:price>${(p.price_pence / 100).toFixed(2)} GBP</g:price>
<g:brand>${esc(p.sellers?.name ?? site.name)}</g:brand>
<g:condition>new</g:condition>
<g:identifier_exists>no</g:identifier_exists>
</item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${esc(site.name)}</title>
<link>${base}</link>
<description>${esc(site.name)} products</description>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
