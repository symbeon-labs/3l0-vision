# Vertical Slice Execution Contract

**Status:** proposed acceptance contract; not evidence of implementation or runtime validation.  
**Scope:** 3L0 Vision Phase 1, with Receiving MVP work explicitly downstream.  
**Canonical workflow:** `CAPTURE → OBSERVE → CANDIDATES → CONFIRM → SAVE → RECOGNIZE AGAIN`.

## Goal

Prove one physical-world item can be observed, resolved against persistent tenant-scoped data, confirmed by an operator when necessary, saved with provenance, and recognized again without creating duplicate entities or movements.

The UI must expose uncertainty and conflicts. AI output is an observation or candidate signal, never a verified fact by itself.

## State contract

- **RESOLVED:** deterministic rules and available evidence yield one admissible candidate; preserve the evidence and rule/version that produced the result.
- **NEEDS_CONFIRMATION:** multiple plausible candidates, a required field is missing, or the confidence/criteria threshold is not met.
- **CONFLICT:** credible sources disagree on a material field; do not silently choose one.
- **INSUFFICIENT_EVIDENCE:** available observations do not support a defensible resolution.
- **ERROR:** a technical operation failed. Keep this distinct from semantic uncertainty or conflict.

Only an explicit operator confirmation may promote a review-required candidate to a confirmed operational record. Never convert a missing value into a guessed value.

## Acceptance gates

### Gate A — Capture and observation

- [ ] Camera capture can produce a preview and a discard/retry path.
- [ ] Barcode/QR input is normalized into a typed observation with source and capture time.
- [ ] Document/XML ingestion retains the original file reference or content hash and parser/version metadata.
- [ ] Each extracted field records its source, extraction method, timestamp, and whether it is declared, observed, or operator-confirmed.
- [ ] Unsupported formats and oversized/malformed files fail with actionable messages; they do not create partial confirmed records.

### Gate B — Candidate resolution

- [ ] Normalize observations into a stable, versioned contract before matching.
- [ ] Match against a persistent catalog using explicit deterministic criteria first.
- [ ] Return zero, one, or multiple candidates without forcing a winner.
- [ ] Explain match reasons and material mismatches in a reviewable result.
- [ ] A candidate score or model output alone cannot set a record to confirmed.
- [ ] Repeated identical observations are idempotent and do not create duplicate entities.

### Gate C — Human confirmation and evidence

- [ ] The operator can confirm, reject, or defer a candidate.
- [ ] Confirmation records actor, time, selected entity, reviewed fields, and evidence references.
- [ ] Conflicting values remain visible; no source is silently overwritten.
- [ ] Evidence records carry tenant scope, provenance, stable identifiers, and integrity metadata where available.
- [ ] Rejected/deferred candidates remain in history without affecting confirmed stock.

### Gate D — Persistence and tenant isolation

- [ ] Replace browser-local storage as the source of truth for shared/multi-user workflows with authorized server-side persistence.
- [ ] Tenant identity comes from the authenticated server-side session/membership, not a client-supplied tenant ID.
- [ ] Every read/write is authorized for the active workspace and membership state.
- [ ] Use database constraints/transactions for idempotency and stock movement writes; test concurrent duplicate submissions.
- [ ] Cross-tenant reads and writes are denied, including direct API calls and revoked/inactive memberships.
- [ ] Do not claim tenant isolation validated until tests use at least two independent users in separate workspaces against the configured Supabase environment.

### Gate E — Recognize again and inventory projection

- [ ] Repeating the same capture after confirmation resolves to the same canonical entity.
- [ ] A repeated save does not duplicate evidence, entities, or stock movements.
- [ ] Stock balance includes only explicitly accepted movement states and matching units.
- [ ] Unit mismatches, ambiguous adjustments, and unresolved movements are surfaced as exceptions.
- [ ] History links observations, candidates, confirmation, evidence, and resulting movement.

### Gate F — Receiving document safety

- [ ] XML parsing has synthetic positive and negative fixtures (valid document, malformed XML, missing required nodes, oversized input, DOCTYPE/ENTITY payload).
- [ ] Parsed NF-e/NFC-e values are labelled as document declarations, not proof of physical receipt or fiscal authorization.
- [ ] XML parsing does not imply signature verification, authorization/cancellation lookup, or authenticity validation.
- [ ] Quantity declared in the document remains distinct from quantity physically counted.
- [ ] Export to a target system is review-only until mapping and validation are approved; no live write in this tranche.

## Required test matrix

| Scenario | Expected result |
| --- | --- |
| One admissible deterministic match | Candidate shown with rule/evidence; no implicit confirmation unless policy explicitly allows it |
| No candidate | `INSUFFICIENT_EVIDENCE`; no entity or stock movement created |
| Multiple plausible candidates | `NEEDS_CONFIRMATION`; operator must decide |
| Material field disagreement | `CONFLICT`; conflicting values and provenance remain visible |
| Same observation submitted twice | Idempotent result; no duplicate record |
| Same idempotency key, different payload | Reject with explicit conflict |
| Unknown product movement | Reject; no movement persisted |
| Wrong tenant or revoked membership | Deny read/write at server/database boundary |
| Two simultaneous identical writes | One canonical result; no duplicate movement |
| Unconfirmed/estimated movement | Excluded from confirmed stock balance |
| Malformed or hostile XML | Safe rejection; no partial confirmed record |
| Document quantity differs from physical count | Exception for human review; preserve both values |

## Current implementation baseline (checked 2026-10-28)

The following are repository-state observations, not blanket runtime acceptance:

- PR #24 (Supabase Auth + workspace backend foundation) is merged.
- PR #30 (resolution flow + workspace history/persistence), PR #31 (12 synthetic CASE-002 regression cases), PR #33 (persisted-status normalization), and PR #34 (reconstructed persistence integration) are merged.
- PR #31 reports 63 automated tests passing and a successful Vite production build for its recorded commit. This does not establish that all later commits or external runtime paths have passed.
- The Vision API currently uses a local deterministic resolver and a synthetic in-memory product catalog. The API code explicitly states that remote ORC, OCR, model-provider, and ERP/WMS integrations are not connected.
- PR #20 (camera capture + local fiscal XML parsing + context-source guidance) remains Draft and reports merge conflicts. Its parser is syntactic only; it does not verify fiscal authorization, signature, cancellation, authenticity, or physical receipt.
- The Agent repository documents a tested orchestration scaffold, not a connected runtime integration.
- The Portal README states that a versioned page does not by itself prove public hosting is configured.

Re-check current branch heads and CI before relying on these observations; do not infer live runtime behavior from a green deployment check alone.

## Updated execution order

1. **Stabilize the current Vision mainline:** run current-main tests/build, inspect persisted status normalization, and execute authenticated POST/GET history checks against configured Supabase.
2. **Prove tenant boundaries:** use two independent users in two workspaces; verify direct API and database-level cross-tenant reads/writes are denied, including inactive/revoked membership.
3. **Reconcile PR #20 against current main:** resolve merge conflicts, run CI and XML positive/negative fixtures, then manually test camera capture on supported mobile browsers. Keep it Draft until its acceptance gates pass.
4. **Replace the synthetic catalog for the receiving workflow:** define the canonical product source, identifier normalization, provenance, and behavior for zero/one/multiple matches.
5. **Stabilize the ORC contract:** version the observation/resolution schemas and test contract compatibility before connecting a remote ORC runtime. The current injected deterministic resolver is not a remote ORC integration.
6. **Connect the Agent through a real adapter:** test a complete task from Vision observation through bounded orchestration, authorization, review and persisted outcome.
7. **Run the vertical slice:** `CAPTURE → OBSERVE → CANDIDATES → CONFIRM → SAVE → RECOGNIZE AGAIN`, including repeat submissions and no-duplicate guarantees.
8. **Only then run a field pilot:** use authorized representative data, explicit operator consent, baseline metrics, failure logging and rollback procedures.

## Evidence labels

Use these labels in PR descriptions and status documents:

- **PROPOSED** — design or contract only.
- **IMPLEMENTED** — code exists.
- **TESTED** — automated test executed successfully.
- **VALIDATED IN REAL ENVIRONMENT** — behavior verified against configured runtime/services.
- **ACCEPTED** — acceptance criteria reviewed and explicitly met.

Do not upgrade a status label without the corresponding evidence.

## Definition of done

The vertical slice is complete only when the end-to-end path works in the configured runtime, automated tests cover the required scenarios, two-tenant isolation has been demonstrated, and the operator can trace a saved result back to its observations and evidence. A successful build or preview deployment alone is insufficient.
