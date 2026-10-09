import { headers } from "next/headers";
import { cache } from "react";
import { db } from "./supabase";
import type { Site } from "./types";

/** Works out which brand to show from the domain the visitor used. */
export const getSite = cache(async (): Promise<{ site: Site; sister: Site | null; all: Site[] }> => {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .toLowerCase().split(":")[0].replace(/^www\./, "");

  const { data, error } = await db().from("sites").select("*");
  if (error || !data?.length) throw new Error("Could not load sites: " + (error?.message ?? "none found"));
  const all = data as Site[];

  const fallback = process.env.DEFAULT_SITE ?? "saveware";
  const site =
    all.find((s) => s.domain === host) ??
    all.find((s) => s.id === fallback) ??
    all[0];
  const sister = all.find((s) => s.id === site.sister_site_id) ?? null;
  return { site, sister, all };
});

export function siteUrl(s: Site) {
  return `https://${s.domain}`;
}
