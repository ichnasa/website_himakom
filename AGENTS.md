# AGENTS.md — website_himakom

## Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — tokens in `app/globals.css` `@theme`
- **SQLite** via `better-sqlite3` — singleton in `app/utils/database.ts`
- **Auth**: JWT (`jose`), cookie `jwt_token` (httpOnly, 2h expiry)
- **Validation**: `zod`
- **PW hashing**: `bcryptjs`

## Commands
```
npm run dev      # dev server on :3000
npm run build    # production build
npm run lint     # ESLint only (no typecheck)
```
No `typecheck` script — run `npx tsc --noEmit` if needed. No test framework.

## Route groups & layout
- `(landing_page)/` — public (Navbar + Footer wrapper), route: `Beranda (/), /event`
- `(admin_page)/` — admin (Sidebar wrapper), routes: `/dashboard, /pengguna, /peminjaman-barang, /fitur, /pengaturan, /groups`
- `(admin_page)/layout.tsx` uses `<Sidebar />` (client component)
- `login/` — standalone page, no layout wrapper

## Known bugs (fix before editing)
1. **Login vs create mismatch**: `login/action.ts` compares plaintext password, but `createUserAction` stores bcrypt hash — created users can never log in.
2. **`user` table missing `role` column** in `database.ts` schema — the CREATE TABLE omits `role`, but all actions use it.
3. **`middlewareX.ts` checks wrong cookie name**: reads `token` cookie, but login sets `jwt_token` cookie.

## Architecture
- Server actions in `app/action/pengguna/action.ts`, `app/login/action.ts`, `app/sidebar/action.ts`
- All server actions: `"use server"`; receive `FormData` or plain args
- Forms use `useActionState` on client; first arg is always `prevState`/`initialState`
- DB queries: prepared statements with `:named` or `?` params; `db.prepare().run()/.get()/.all()`
- Dynamic route-based sidebar: modules stored in `module` table, toggled via `pengaturan/page.tsx`
- Sidebar listens for `window.dispatchEvent(new Event("modules:updated"))` to refetch

## Files that should be `middleware.ts` but aren't
- `middlewareX.ts` (should be `middleware.ts` at root for Next.js middleware to work)
- `proxy.ts` intended as a separate routing proxy (not auto-loaded by Next.js)

## Conventions
- `@/` path alias → project root (e.g., `@/app/utils/database`)
- Route groups: parenthesized dirs like `(admin_page)` — not part of URL
- Font: Inter 400/500/600 via next/font/google; CSS var `--font-inter`
- Design tokens: Tailwind v4 `@theme` in `globals.css` instead of `tailwind.config`
- Use `bcrypt.hash` (async) for passwords; bcryptjs not native bcrypt
