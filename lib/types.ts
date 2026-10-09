export type Theme = { primary: string; secondary: string; ink: string };

export type Site = {
  id: string;
  domain: string;
  name: string;
  seller_id: string;
  sister_site_id: string | null;
  theme: Theme;
};

export type Category = { id: string; name: string; slug: string; site_id: string | null; sort_order: number };

export type Product = {
  id: string;
  seller_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price_pence: number;
  compare_at_pence: number | null;
  badge: string | null;
  stock: number;
  images: string[];
  certification: string | null;
  featured: boolean;
  sellers?: { name: string; slug: string } | null;
};
