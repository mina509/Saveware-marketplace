# saveware / kareo6 marketplace — website

One Next.js app serving two brands. The brand is chosen from the domain:
saveware.co.uk → saveware, kareo6medical.co.uk → kareo6 (see the `sites` table).

## Settings
Edit `wrangler.jsonc` → `vars`:
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` — from Supabase › Project Settings › API (public keys, safe in code)
- `DEFAULT_SITE` — brand shown on preview links (`saveware` or `kareo6`)

## Deploy on Cloudflare
Workers & Pages › Create › Import a repository › pick this repo.
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`

Then Settings › Domains & Routes › add `saveware.co.uk`, `www.saveware.co.uk`,
`kareo6medical.co.uk`, `www.kareo6medical.co.uk`.

## Local development (optional)
`npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.
