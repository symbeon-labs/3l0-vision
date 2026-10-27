# Inventory data foundation v0.1

Status: initial domain contract; not yet wired to persistent storage or the customer UI.

## Purpose

Create one canonical representation for inventory products, stock movements, and evidence so the dashboard, import/export workflows, and Skills consume the same data contract rather than inventing separate models.

## Records

### Inventory product

- `tenantId`: tenant ownership boundary; required.
- `productId`: stable internal identity; required.
- `sku`, `identifiers`: optional external identifiers.
- `name`, `unit`: human-readable product fields.
- `state`: `CONFIRMED`, `IMPORTED`, `ESTIMATED`, `CONFLICTING`, or `NEEDS_REVIEW`.
- `attributes`: extensible non-canonical attributes.
- `provenance`: source type/reference, actor, observation/import time, contract version.
- `createdAt`, `updatedAt`: ISO timestamps.

### Stock movement

- Stable `movementId`, `tenantId`, and `productId`.
- `type`: `OPENING_BALANCE`, `RECEIPT`, `ISSUE`, `ADJUSTMENT`, `RETURN`, `TRANSFER_IN`, or `TRANSFER_OUT`.
- Positive numeric `quantity` plus explicit `direction` (`IN`, `OUT`, `ADJUSTMENT`). Quantity is positive to avoid encoding direction twice in its sign.
- `occurredAt`, `source`, optional `sourceReference`, and required `idempotencyKey`.
- State, evidence references, provenance, and metadata.

A stock balance must be derived from accepted movements under an explicit policy. Do not silently treat imported, estimated, conflicting, or unreviewed rows as confirmed stock.

### Evidence

- Stable `evidenceId`, `tenantId`, `kind`, `source`, and `capturedAt`.
- Optional `contentRef` and `contentHash`; extracted fields; provenance and metadata.
- Evidence references do not themselves prove authenticity. Hashing can help detect byte changes only when the reference and expected hash are trusted.

## Boundaries and invariants

1. Tenant scope is present on every record and must be enforced by repositories/services; a UI filter is not authorization.
2. Preserve the original import/evidence and row-level provenance when normalizing data.
3. Import adapters must validate and preview before writing; repeated submissions need idempotency/duplicate handling.
4. Conflicting evidence remains visible; never choose a winner silently.
5. This contract does not implement a database, tenant authorization, stock balance projection, import/export, dashboard, or Skill activation.
6. Date values are normalized to ISO 8601 UTC strings at the contract boundary.
7. Contract version starts at `inventory.v0.1` and must evolve deliberately.

## Next vertical slice

1. Repository adapter with tenant-scoped reads/writes and idempotent movement creation.
2. Deterministic stock balance projection with tests for receipt, issue, return, adjustment, and conflict policy.
3. Customer dashboard backed by that projection.
4. CSV import preview/validation and CSV export from the same canonical records.
5. XML/PDF/DOCX only after their schemas/templates and supported document types are explicitly defined.
6. Dynamic Skill tabs driven by a capability catalog plus effective authorization; UI visibility must never grant permission.
