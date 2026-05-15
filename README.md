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

## Frontend Architecture

Application code is organized around thin App Router files and feature-owned views:

- `src/app` keeps route wrappers, layouts, route handlers, and Next.js boundaries.
- `src/features` owns page/view code and feature server modules.
- `src/shared` owns intentionally reused UI, constants, app-wide server helpers, and cross-feature Q&A primitives.
- `src/lib` owns infrastructure such as Supabase clients, database schema helpers, routing helpers, and environment parsing.
- `src/types` owns generated and global app types.

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
