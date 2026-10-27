# Workspace backend foundation — Case 01

## Included in this slice

- Vercel Node functions for authenticated workspace listing/creation and invitation-record creation.
- Supabase Auth token verification through `auth.getUser(token)`.
- Postgres tables for organizations, workspaces, memberships and invitation records.
- Row Level Security (RLS) to scope workspace reads to active memberships.
- Atomic RPC that creates organization + workspace + owner membership in one transaction.
- Invitation creation is restricted to active workspace owners and roles are allow-listed.

## Configuration required before runtime use

1. Create/select the Supabase project for 3L0 Vision.
2. Apply `supabase/migrations/202610270001_workspace_foundation.sql` using Supabase CLI or SQL Editor.
3. Configure `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel for the correct environments.
4. Connect the UI to Supabase Auth sign-in and pass the current access token as `Authorization: Bearer <token>`.
5. Deploy a preview and run authenticated, cross-tenant and unauthenticated integration tests.

The repository currently has no confirmed Supabase project credentials. This PR deliberately does not invent them and does not claim that the hosted backend is already live.

## API

- `GET /api/workspaces`: list workspaces where the authenticated user has active membership.
- `POST /api/workspaces`: atomically create an organization, a draft workspace and the caller's owner membership.
- `POST /api/workspaces/:id/invitations`: record a pending invitation. Only an active workspace owner may do this, and only `operator`, `reviewer`, or `read_only` roles are accepted.

All endpoints require a valid Supabase access token. Requests without one receive 401. Missing backend configuration fails closed with 503.

## Explicit limits

- This PR does not configure a Supabase project, secrets, DNS, or Vercel environment.
- Invitation records are not email delivery or accepted memberships. The Auth Admin invitation flow and acceptance/expiry lifecycle are follow-up work.
- No workspace is automatically marked active. Creation yields `draft`.
- RLS and RPC have been authored but must be applied and tested in the actual Supabase project before claiming isolation is verified.
- Operational records (inventory, observations, evidence, integrations) are not yet tenant-scoped in this migration; do not expose those workflows to multiple real customers until their schemas and policies are tenant-aware.
