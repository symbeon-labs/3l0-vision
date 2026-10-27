# Workspace onboarding and Case 01 pilot

Status: architectural handoff for implementation. This document does not claim authentication, multi-tenant isolation, or the pilot flow is implemented.

## Decision

3L0 Portal and 3L0 Vision remain separate repositories and deployment surfaces.

- **3L0 Portal**: public product narrative, capabilities, scope, and entry point.
- **3L0 Vision**: authenticated product experience, onboarding, workspace, operational app, and pilot data.
- **3L0 Agent**: orchestration and skill selection; it must not become the system of record for workspace identity or authorization.
- **3L0 Core Vault**: private canonical context, decisions, sensitive pilot documentation, and internal research.
- **ORC**: semantic resolution of observations, evidence, entities, and context; not authentication, tenant authorization, or an ERP adapter.

The portal may link to Vision using the deployed URL. A link is not an authentication boundary. Vision must enforce authentication and authorization itself.

## Pilot model

The first workspace is the platform operator's workspace, owned by the platform operator and used to configure and supervise Case 01. The external operator is a separately invited user with the minimum role required to perform the agreed operational workflow.

Recommended initial records:

- `Workspace`: stable ID, display name, status, owner user ID, created/updated timestamps.
- `Membership`: workspace ID, user ID, role, status, invited/activated timestamps.
- `BusinessProfile`: workspace ID, business type, operation description, products/categories, approximate operational volume, systems used, documents/sources, current process, pain points, desired outcomes, and review status.
- `PilotCase`: stable case ID (`CASE-01`), workspace ID, status, agreed workflow, success measures, open questions, and change log.
- `EvidenceReference`: workspace/case scope, evidence type, source, capture time, provenance, and access policy. Store actual files in an appropriately protected storage layer, not in public repositories.
- `OnboardingEvent`: actor, event type, timestamp, and schema version; avoid copying sensitive answers into general application logs.

The operator workspace and the Case 01 business workspace must not be conflated. The platform operator can administer the pilot through an explicit, auditable support/admin membership. The external operator must not inherit platform-wide access.

## Onboarding journey

1. Visitor selects **Acessar o ambiente de experimentação** on the public Portal.
2. Vision checks authentication. If signed out, show the sign-in/invitation screen.
3. A new invited user accepts an invitation; open self-service registration only if the pilot policy explicitly allows it.
4. User sees the workspace invitation and role before accepting.
5. Workspace owner or authorized admin completes the business profile based on the Case 01 map.
6. Onboarding shows a reviewable summary and asks the owner to confirm it. Distinguish user-provided facts, observed evidence, and assumptions.
7. Create/activate the Case 01 workspace only after the profile and pilot scope are reviewed.
8. Configure the first workflow: receiving and checking goods against document declarations and the existing product/system records.
9. Invite the operator as a limited user. Start in assisted/manual confirmation mode; no silent ERP writes.
10. Capture baseline metrics and record corrections as structured feedback before changing product behavior.

## Business profile fields derived from the Case 01 map

Preserve the source questionnaire's sections:

1. Operation: business type, goods received/moved/delivered, approximate volume, common products, participants.
2. Current process: ordered steps and responsible roles.
3. Information and systems: POS/ERP, spreadsheets, documents, payment/accounting sources, multiple-source lookups.
4. Checking and control: what is checked, product identifiers, quantity confirmation, manual transcription, double-check conditions.
5. Problems: slowest steps, error points, rework, hard cases, how discrepancies are resolved.
6. Time and impact: duration, frequency, participants, impact types.
7. Desired improvements: tasks to remove, useful automatic information, expected improvements, past attempts.
8. Notes: additional context and examples.

Do not treat inferred or prefilled answers as verified business facts. The filled Case 01 document contains contextual assumptions and approximate information (including approximate monthly revenue); the business owner must review and approve the profile before it is used to configure the workspace. Collect only data needed for the pilot, with a clear purpose and retention policy.

## Role and permission baseline

- `platform_admin`: manage platform configuration and explicitly authorized support access.
- `workspace_owner`: manage own workspace profile, invite/remove workspace members, review pilot scope.
- `operator`: run assigned workflow, capture evidence, submit observations, and flag discrepancies.
- `reviewer`: confirm or reject operational proposals within the assigned workspace.
- `read_only`: view permitted records and reports.

This is a proposed minimum role model, not an implemented authorization system. Enforce permissions server-side on every data operation; hiding a UI control is not authorization.

## Repository boundaries and data flow

```text
3L0 Portal (public)
   └── link → 3L0 Vision (auth + workspace + onboarding + app)
                    ├── Agent: orchestration and authorized skills
                    ├── ORC: semantic resolution
                    └── protected storage: workspace data and evidence
3L0 Core Vault (private)
   └── canonical decisions, pilot playbook, sensitive research
```

- Portal must not store business profile responses or pilot evidence.
- Vision owns the user-facing workspace experience and operational records.
- Agent receives only the context required for a task and must obey workspace permissions.
- ORC receives normalized observations/evidence/context needed for resolution, not broad workspace credentials.
- Vault stores canonical internal context and decision records; it is not a substitute for runtime application storage.
- No credentials, session tokens, business documents, or customer data in Git.

## Security and privacy gates before external pilot use

- Real authentication provider and verified session handling.
- Server-side workspace membership checks and tenant-scoped data access.
- Invitation lifecycle and revocation.
- Secure file storage with access control and retention/deletion policy.
- Audit trail for membership changes, approvals, and operational corrections.
- Data minimization, notice/purpose, and access review for personal/business information.
- Backup/recovery and error handling.
- No production ERP write until mapping, authorization, and rollback behavior are validated.

Until these gates are met, use synthetic data or explicitly approved low-risk pilot data and label the experience as a controlled prototype.

## Pilot success criteria

Record baseline before measuring improvement. At minimum:

- time to check a received item/document;
- number of manual re-entries per item;
- mismatch detection rate and false-positive rate;
- percentage of items requiring human review;
- unresolved exceptions and correction time;
- successful export/mapping rate to the target system;
- operator-reported usability and failure points.

Do not claim efficiency gains until measured against a baseline.

## Implementation sequence

1. **P0 — Entry link:** add Portal CTA to the Vision deployment and clearly label it as a controlled experiment.
2. **P1 — Auth boundary:** implement sign-in/invitation flow in Vision using a real auth provider.
3. **P2 — Workspace primitives:** workspace, membership, roles, server-side access enforcement.
4. **P3 — Business onboarding:** multi-step form based on Case 01 sections, draft/save, review and owner confirmation.
5. **P4 — Pilot setup:** create CASE-01 workspace and activate one limited operator user; operator account is invited, not shared.
6. **P5 — Operational vertical slice:** receiving, document evidence, physical observation, matching, exception review, export.
7. **P6 — Agent/ORC integration:** scoped context and permission-aware tools; no privileged side effects without explicit authorization.
8. **P7 — Metrics and iteration:** baseline, event log, correction loop, weekly pilot review.

## Acceptance criteria for the first implementation slice

- Portal has a visible, keyboard-accessible link to the Vision deployment.
- Vision's entry screen distinguishes sign-in from invitation/onboarding.
- No claim of real authentication until a provider and server-side checks are connected.
- The Case 01 form covers the eight source sections and supports draft/review/confirmation.
- Workspace profile and membership data are scoped to a workspace ID.
- A limited operator role cannot access platform administration or another workspace.
- Seed/demo data is clearly marked; the fixed `local-demo` browser namespace is not described as secure multi-tenancy.
- Tests cover access denial across workspaces and the onboarding status transitions.
