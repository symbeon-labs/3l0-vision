# Workspace activation — first implementation slice

Status: **browser prototype only**. This slice is intentionally not a production workspace activation system.

## Scope delivered in this branch

- A workspace entry point on the 3L0 Vision home screen.
- A progressive, reviewable onboarding form for organization/workspace, pilot objective, current process, systems and success criteria.
- Domain-level validation and a versioned draft object.
- Explicit provenance: values are user-declared and unverified.
- Unit tests for valid/invalid drafts, required identifiers/timestamps and membership role validation.
- Clear UI warnings that the draft is held only in page memory.

## What it does not do

- Authenticate a user or establish identity.
- Create a persistent workspace or organization record.
- Enforce tenant/workspace authorization.
- Invite an operator or send an email.
- Persist customer answers to browser storage or a backend.
- Connect Agent, ORC or an ERP/WMS/TMS adapter as part of workspace activation.

The form must not be used with real or confidential customer information. The review screen creates an in-memory draft object for UX/domain validation only; it does not activate the workspace.

## Domain contract

`core/workspaces/contracts.js` defines a minimum `WorkspaceDraft` and membership validation. `status: "draft"` and `provenance.verificationStatus: "unverified"` are deliberate. `ownerUserId` remains null until a trusted identity/authentication layer exists.

## Acceptance checks

1. `npm test` passes the workspace contract tests.
2. `npm run build` bundles the new screen and domain module.
3. The home screen opens the onboarding and can return to the guide.
4. Invalid required fields show accessible validation messages.
5. The review summary escapes user input and shows declared/unverified provenance.
6. No customer data is written to localStorage/sessionStorage.
7. The UI explicitly states that authentication, persistence and isolation are not implemented.

## Next production slice

After the prototype is reviewed, implement a server-backed identity and organization/workspace model, persist drafts under the authenticated organization, enforce membership and resource authorization server-side, add individual operator invitations, and test cross-tenant denial. Select the authentication/database provider only after checking the deployment environment and existing credentials/configuration. Do not add a client-side-only tenant ID as a security boundary.

## Architectural references

- Canonical handoff: [PR #10 — Contextual Personalization v0.1](https://github.com/symbeon-labs/3l0-vision/pull/10)
- Workspace onboarding source: [PR #17 — Case 01 onboarding handoff](https://github.com/symbeon-labs/3l0-vision/pull/17)
