# 3L0 Vision — Inventory Operational Safety Contract v1

**Status:** implementation contract; not evidence that inventory is production-ready.  
**Baseline:** `main` at `6260caa6c54ec644ac5257a74cdb36a817adde5a` when this branch was created.

## Purpose

Define the smallest safe transition from the local inventory prototype to a workspace-scoped operational workflow. Do not merge the existing PR #16 as-is: its UI uses a fixed `local-demo` tenant and browser `localStorage`, while server-side authorization and durable audit are absent.

## Required invariants

1. **Actor and workspace:** every read/write derives the actor from the verified Supabase bearer token. The client-supplied workspace ID is only a selector; verify an active `workspace_memberships` row for the authenticated user on every request. Never trust a tenant/workspace ID from a product or movement payload.
2. **Server persistence:** operational inventory records must be persisted server-side under workspace scope. Browser storage may remain a clearly labeled demo/offline prototype, but must not be represented as shared inventory or an audit record.
3. **Product review gate:** a product in `NEEDS_REVIEW`, `CONFLICTING`, or any non-approved state cannot receive/issue stock movements as confirmed operations. Preserve unresolved observations as evidence, not as accepted stock.
4. **Unit compatibility:** each product has a canonical unit. A movement must use that unit or pass through an explicit, tested conversion rule. Never aggregate unrelated units (for example, units, kg and liters) into a single “total stock” metric.
5. **Negative stock:** default policy is reject an outgoing movement that would make the balance negative. Enforce this atomically on the server, not only in UI validation. Any future allow-negative policy must be explicit, workspace-configured, and audited.
6. **Idempotency and concurrency:** require an idempotency key. Enforce uniqueness and balance mutation in a database transaction/atomic RPC to prevent double submissions and concurrent overselling.
7. **Audit trail:** accepted and rejected attempts must carry actor, workspace, action, product, quantity/unit, timestamp, source/evidence reference, and outcome/reason. Audit entries are append-only; corrections use compensating movements, not silent edits.
8. **Evidence vs. decision:** XML parsing, OCR, barcode recognition, catalog matching, or AI interpretation are evidence signals, not proof of fiscal authenticity or physical receipt. Keep source, extracted values, verification status, and human confirmation separate.
9. **Least privilege:** use the caller's Supabase user client/RLS or a narrowly scoped server-side authorization path. Do not expose service-role secrets to the browser or bypass workspace membership.
10. **Failure behavior:** missing schema/configuration, membership failure, transaction conflict, and persistence failure must fail closed. Do not report success when durable persistence failed.

## Minimum API contract

- `GET /api/v1/inventory?workspaceId=...`: return only products and balances for an authorized workspace; use a consistent response envelope and no-store caching.
- `POST /api/v1/inventory/products`: validate name, canonical unit, identifiers and review state; default imported/observed products to `NEEDS_REVIEW`.
- `POST /api/v1/inventory/movements`: validate product/workspace scope, movement type, positive finite quantity, canonical unit, review gate, idempotency key, and non-negative balance atomically.
- Error responses use stable codes for `workspace_required`, `workspace_forbidden`, `product_not_found`, `product_needs_review`, `unit_mismatch`, `insufficient_stock`, `idempotency_conflict`, and `persistence_unavailable`.

These routes are a target contract; do not imply they exist until implemented and tested.

## Acceptance matrix

| Case | Expected result |
|---|---|
| Missing/invalid bearer token | 401; no data read/write |
| User not an active workspace member | 403; no cross-workspace disclosure |
| Payload tries to override workspace/tenant | Ignore/reject override; scope comes from authorized request |
| Product is `NEEDS_REVIEW` or `CONFLICTING` | Movement rejected; evidence can remain reviewable |
| Movement unit differs from product unit | Reject unless an explicit conversion exists |
| Outgoing quantity exceeds balance | 409/422; balance unchanged |
| Same idempotency key + same payload | Return original result without duplicate movement |
| Same idempotency key + different payload | Conflict; no mutation |
| Two concurrent issues compete for same stock | At most one succeeds if only one can preserve policy |
| Database write/audit fails | Transaction rolls back; no success response |
| Receipt and issue in compatible units | Correct product-specific balance |
| Dashboard across kg, L and units | No misleading combined quantity |
| Correction of an accepted movement | Append compensating movement; preserve original history |

## Implementation sequence

1. Inspect and document the actual Supabase schema, RLS policies and deployment configuration before adding tables/routes.
2. Add a migration with workspace-scoped product, movement and append-only audit tables, constraints, indexes, and RLS. Use database-side transaction/RPC for movement + balance guard + audit.
3. Add unit-testable domain validation and authenticated API handlers; validate workspace membership server-side.
4. Add tests for authorization, review state, unit mismatch, idempotency, negative stock, concurrency/transaction rollback, and audit.
5. Connect the UI to the API only after the server contract and tests pass. Remove fixed `local-demo` tenant from operational paths; preserve demo mode only when visibly labeled.
6. Run `npm test`, `npm run build`, inspect the exact candidate SHA and deploy preview. Do not merge if DB schema or RLS behavior cannot be verified.

## Known boundary

The current `core/inventory/repository.js` is an injected-storage repository with localStorage-compatible behavior. It is suitable for domain tests and a single-browser prototype, not a multi-user inventory system. Existing workspace membership and resolution-run tables provide patterns, but do not themselves implement inventory persistence or inventory RLS.