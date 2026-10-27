# Supabase Auth — 3L0 Vision

This repository is a Vite + vanilla JavaScript application, not Next.js. Auth is implemented with `@supabase/supabase-js`; the UI guard uses hash routes because the existing app is a client-rendered SPA.

## Environment

Set these variables in local `.env.local` and Vercel Project Settings → Environment Variables:

```dotenv
VITE_SUPABASE_URL=https://rirjbxxberauixyxezzk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Only the publishable key belongs in a browser build. Never add a `service_role` or `sb_secret_` key to Vite variables, GitHub, or client code. After changing environment variables, redeploy.

Install pinned dependency from the repository root:

```bash
npm install @supabase/supabase-js
```

Commit the generated lockfile. Do not use a floating production dependency.

## Route integration

Import `createRouteGuard` from `./app/auth/route-guard.js` into `app/main.js` and mount the existing home/capture flow through its `renderPublic` callback. The private route callback must render the operator workspace only after the guard provides a verified Supabase user. Use `#/login`, `#/signup` and `#/app` (private). Routes `#/workspace` and `#/history` are reserved and private.

Because this app builds to static Vite assets, a JavaScript route guard is a UX gate, not a server security boundary. Every actual data access must still be enforced by Supabase RLS. Never rely on hidden buttons or client state as authorization.

## Database boundary

Project: `3L0-VISION`  
Supabase URL: `https://rirjbxxberauixyxezzk.supabase.co`

Existing workspace tables have RLS enabled. Workspace membership is the tenant boundary. Application data tables added later must also enable RLS and scope rows to the authenticated user's active workspace membership. Do not store all users' catalog records in one unrestricted table. Keep service-role/secret credentials server-side.

## Manual test gate

1. With Vercel env vars absent, sign-in and sign-up should be disabled with a configuration message.
2. With variables present, opening `#/app` in a private browser must show Auth, not workspace content.
3. Sign in with the test account; valid credentials should reach `#/app`.
4. Reload the private route; session should persist.
5. Sign out; private route must show Auth again.
6. Try an invalid password and verify a readable failure without exposing secrets.
7. Create a disposable test account; verify signup confirmation behavior matches Supabase Auth settings.
8. Query a workspace with no active membership; it must not be visible via the Data API.
9. Run `npm test` and `npm run build`, then smoke-test the Vercel deployment.
10. Test the access boundary using a second test account before considering multi-user data ready.

## Current limitation

Auth UI and guard modules exist in this branch, but must be wired into the existing `app/main.js` and protected workspace/data view before claiming full route protection. This is intentional: the current landing page is the only implemented product flow, and no private workspace route exists yet. Do not ship by changing `main` directly; use the feature branch and review the diff/CI first.
