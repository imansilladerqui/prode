# Security Policy

## Supported versions

Only the latest deployment on the `main` branch is supported.

## Reporting a vulnerability

If you find a security issue, please report it privately to the repository owner (do not open a public issue with exploit details).

## Threat model (friends-only pool)

This app is a **closed-group** World Cup pool:

- The Supabase **anon key** is embedded in the static frontend. This is expected for SPAs.
- Each browser generates a random **UUID** in `localStorage` and registers with a display name.
- Row Level Security is **permissive** for the anon role (trust-based group).

## What is not considered a vulnerability

- Visibility of `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, or `VITE_ADMIN_USER_ID` in the built bundle
- Reading public match data and leaderboard via the anon key

## Operational checklist

- Never commit `.env` or the Supabase **service role** key
- Keep RLS enabled on tables (policies may be open for a trusted group)
- Use branch protection so CI must pass before merging to `main`
