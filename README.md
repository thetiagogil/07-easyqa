Easyqa is a Next.js, TypeScript, Joy UI app backed by the shared Supabase project.

## Environment

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a legacy fallback.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Contract

The app uses:

- `core.profiles` for shared identity/profile data.
- `easyqa.*` tables for app data.
- `easyqa` RPCs for mutations that must derive the current user from Supabase Auth.

Google login is intentionally not enabled.

## Verification

```bash
npm run lint
npm run build
```
