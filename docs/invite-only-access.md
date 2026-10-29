# Invite-only access and contract-scoped onboarding

Status: implementation gate and operational runbook. This document does not claim the invite lifecycle is fully implemented.

## Access policy

3L0 Vision is an invitation-only experimental environment. A public Portal link is an entry point, not permission to enter the product. An invitation must be tied to an agreed pilot/contract scope and a specific workspace.

Before inviting an external user, record and approve:
- contracting/responsible parties and authorized contacts;
- purpose and agreed pilot workflow;
- workspace and data categories allowed;
- user identity, role, and permitted operations;
- start/end date, revocation conditions, and offboarding owner;
- privacy notice, processing purpose, retention, deletion and incident contact;
- whether synthetic, low-risk, or approved operational data may be used.

An invitation must not create platform-admin privileges. The invitee receives only the explicitly assigned workspace role. No cross-workspace access is implied.

## Current code change

The application sign-in screen no longer exposes public self-registration. Existing authenticated sign-in and password recovery remain available. This is a user-interface restriction only; it is not a substitute for disabling public sign-ups in Supabase Auth.

## Required deployment controls before merging/releasing invite-only access

1. In Supabase Auth, disable public sign-ups (self-service registration) for the production project.
2. Keep only the published sign-in and password recovery flows. Do not expose a service-role key to the browser.
3. Implement invitation issuance on a server-only endpoint using a server-side administrative credential stored in the deployment environment. The endpoint must authorize the inviter before sending an invitation.
4. Persist invitations with a cryptographically random, single-use token hash, email, workspace ID, role, scope/contract reference, expiry, issuer, status, and timestamps. Never store raw invitation tokens.
5. Redeem invitations server-side only; validate token, email, expiry, status, contract/scope status, and workspace state atomically. A successful redemption creates or activates only the exact membership authorized by the invitation.
6. Revoke pending invitations and active membership when the scope expires or is terminated.
7. Add RLS and least-privilege grants for workspaces, organizations, memberships, invitations, resolution runs and evidence. Test direct Supabase access, not only API routes.
8. Verify the security-definer behavior, search path, and grants of `create_workspace_with_org`. A regular authenticated user must not be able to elevate roles, create platform-wide access, or bypass scope approval.
9. Run cross-workspace negative tests with two users and two workspaces before using real data.

## Release acceptance tests

- Signed-out users cannot access protected API routes.
- The sign-in UI does not offer account creation.
- A direct public sign-up attempt is rejected by Supabase Auth configuration.
- No invitation, expired invitation, revoked invitation, wrong email, inactive contract/scope, or unauthorized workspace is rejected.
- A valid invitation grants only the exact workspace and role stated in the invitation.
- A regular workspace member cannot issue invitations unless that role is explicitly authorized.
- User A cannot read, write, resolve, or enumerate User B's workspace records, even by calling Supabase directly.
- Session expiry and membership revocation take effect server-side.
- No service-role key or invitation secret appears in the client bundle, repository, or logs.

## Important limitation

The current repository change removes the open-registration control from the interface. It does not itself configure the Supabase project, create the invitation database/functions, or prove RLS isolation. Do not represent the invitation lifecycle as complete until the deployment controls and acceptance tests above have been completed.
