# Receiving vertical slice — execution plan

## Product boundary
The first validated workflow is receiving inspection for a bounded product catalog. Other use cases remain roadmap items until this path passes its evidence gate.

## Single resolution path
The target path is: Vision capture/manual identifier → normalized observation → authenticated API → workspace authorization → resolver → persisted resolution run → history/review. The browser must not silently treat its local demo resolver as the production path.

## Evidence gates
- [x] Confirm API currently uses synthetic in-memory candidates and does not persist outcomes.
- [x] Confirm Supabase project has workspace tables and active membership records.
- [x] Add a workspace-scoped persistence schema and RLS migration in version control.
- [x] Update API to persist every returned resolution outcome, including unresolved/conflict states.
- [ ] Apply migration to the intended Supabase environment and verify RLS with two users/workspaces.
- [ ] Wire the Vision UI to the authenticated API as its single resolution path.
- [ ] Add history retrieval UI and end-to-end tests.
- [ ] Replace synthetic catalog with a bounded, imported test catalog.
- [ ] Run a physical receiving pilot and record baseline/time/error metrics.

## Explicit limitations
The API still uses a synthetic in-memory catalog and deterministic resolver. This tranche adds durable operation history but does not make the product production-ready, connect the frontend, or establish real-world accuracy. Do not claim ERP/WMS, OCR, fiscal validation, or external ORC integration.

## Pilot measures
Capture total operations, correct resolutions, false resolutions, insufficient evidence, conflicts, human corrections, median time per item, and technical failures. Do not optimize only for automatic-resolution rate; incorrect resolution is a critical failure.
