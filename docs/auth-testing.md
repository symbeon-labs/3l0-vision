# 3L0 Vision — Supabase Auth test checklist

## Required Vercel environment variables

Set these variables for **Development, Preview, and Production** in Vercel → Project Settings → Environment Variables:

- `VITE_SUPABASE_URL`: project URL from Supabase → Project Settings / API.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (`sb_publishable_...`).

Redeploy after changing variables. Never put a Supabase secret or `service_role` key in a `VITE_*` variable.

For local development, copy `.env.example` to `.env.local` and set the real values.

## Supabase Auth settings

1. In Authentication → URL Configuration, set the Site URL to the deployed 3L0 Vision URL.
2. Add the exact Vercel preview and production origins to Redirect URLs as needed.
3. Confirm the email/password provider is enabled.
4. For signup tests, check whether email confirmation is enabled; a user may need to confirm their address before sign-in.

## Acceptance tests

- [ ] Opening the app signed out displays the authentication screen, not the product workflow.
- [ ] Invalid credentials are rejected with a visible message.
- [ ] A registered user can sign in and reach the home screen.
- [ ] Refreshing while signed in restores the session.
- [ ] Sign out returns to the authentication screen.
- [ ] Password recovery reports a neutral result and uses the configured redirect URL.
- [ ] A new signup handles email confirmation without assuming a session exists.
- [ ] Database access is tested with a real authenticated session; RLS, not the UI, must enforce workspace boundaries.
- [ ] Test a second user and confirm they cannot read another user's workspaces or memberships.
- [ ] Test both Vercel Preview and Production after environment variables are configured.

## Current boundary

The current app is a Vite single-page application, not a Next.js app. The auth gate protects the client workflow and uses Supabase's validated user session. It does not make client-side code a security boundary: any future data/API operation must still rely on Postgres RLS or server-side authorization. The product catalog remains local demo data until a persistent repository is integrated.
