# 3L0 Vision — Strategic Roadmap

The roadmap is organized around evidence gates, not calendar promises.

## Current checkpoint — 2026-10-28

**Repository:** `symbeon-labs/3l0-vision`  
**Production commit:** `be4ed3537c7fdc48172d2af9bfc3f696007f1fc6` — merge of PR #42  
**Deployment:** Vercel production deployment reached `READY`. This confirms deployment status, not browser/device-level acceptance.

### Verified in code and automated checks

- [x] CSS font imports consolidated at the top of `app/styles.css`; duplicate import removed.
- [x] `npm test`: 99 passed, 0 failed on the corrected branch before merge.
- [x] `npm run build`: passed without the previous CSS import-order warning.
- [x] Synthetic CASE-002 integration: all 12 scenarios pass through capture adapter → observation → candidate lookup → ORC → state → persistence gate.
- [x] The synthetic integration test explicitly excludes camera hardware.

### Current release gate — camera and OCR

- [ ] Open the deployed app in a real browser/device and verify camera permission, capture, denial/recovery and file-upload fallback.
- [ ] Verify that a captured/uploaded image reaches a real OCR/perception provider and returns extracted observations. The current automated test results do **not** establish this.
- [ ] Trace the returned observation through ORC/resolution and verify resolved, attention, conflict and uncertain states.
- [ ] Verify persistence and history behavior, including that uncertain/conflicting outcomes are not silently persisted as resolved identities.
- [ ] Record representative real-image results, failure cases and runtime/browser evidence.

**Status:** deployment is ready and the automated synthetic suite is green. The real camera → OCR → ORC → persistence path remains **unverified** until these release-gate checks are completed. Do not mark Phase 1 complete based on build success or synthetic tests alone.


## Phase 0 — Foundation

- [x] product thesis
- [x] architecture boundary
- [x] UX principles
- [x] vision contract
- [x] operational progress principles
- [x] brand system
- [x] application symbol
- [x] strategic workstreams
- [x] project map
- [x] project structure
- [x] design tokens
- [x] ORC integration contract
- [x] application shell
- [x] executable foundation loop
- [x] semantic unit tests

**Exit gate:** a normalized observation can enter the ORC-shaped boundary and the operator can execute the first capture → resolution → state loop. Phase 0 is complete.

## Phase 1 — Vertical Slice

**Goal:** replace the simulated input/resolver path with one real physical-product resolution loop.

```
CÂMERA / BARCODE
→ OBSERVAÇÃO
→ NORMALIZAÇÃO
→ ORC
→ RESOLUÇÃO
→ RESOLVIDO / ATENÇÃO / CONFLITO / INCERTO
→ CONFIRMAÇÃO SOMENTE SE NECESSÁRIA
→ ENTIDADE PERSISTENTE
→ EVIDÊNCIA / HISTÓRICO
```

### Build order

- [x] real camera capture + permission/recovery (browser implementation; physical validation pending)
- [x] barcode/EAN extraction
- [x] manual code-entry fallback
- [x] observation normalization with source/evidence/context
- [x] Phase 1 pipeline orchestration skeleton
- [ ] real ORC service boundary or versioned adapter
- [x] deterministic matching against persistent catalog (local persistence adapter)
- [ ] OCR as a secondary observation path
- [ ] resolution/exception UI
- [x] human confirmation contract (semantic contract; UI workflow remains pending)
- [x] persistent entity (local catalog adapter)
- [ ] evidence/history
- [ ] end-to-end tests with representative inputs

### Perception architecture

- [x] provider boundary for vision/perception
- [x] provider-independent vision observation contract
- [x] barcode normalization adapter boundary
- [x] replaceable provider registry
- [ ] production barcode backend evaluation (ZXing-C++ / WebAssembly)
- [ ] OCR provider evaluation and integration

### Guardrails

- [ ] no image → product shortcut
- [ ] no model confidence → operational certainty shortcut
- [ ] no technical error → semantic uncertainty mapping
- [ ] no confirmation prompt for deterministic resolutions that do not require policy confirmation
- [ ] no UI control for an unavailable workflow
- [ ] no progress percentage without a real denominator

**Exit gate:** one physical product can be captured, represented as an observation, resolved through the intended versioned ORC boundary, persisted, and recognized again without rebuilding its identity. Implementation alone does not close the gate; runtime and physical validation are required.

## Fiscal Resolution Layer — Architectural Boundary

The fiscal capability is a downstream layer of ORC, not part of ORC itself and not part of the Phase 1 camera vertical slice.

```
PHYSICAL / DOCUMENT / ERP
→ OBSERVATION
→ NORMALIZATION / CONTEXT
→ ORC RESOLUTION
→ RESOLVED ENTITY + OPERATIONAL CONTEXT
→ FISCAL RESOLUTION LAYER
→ FISCAL RESULT + LEGAL BASIS + SOURCE + VERSION
→ TAX CALCULATION / COMPLIANCE
→ NF-e / ERP / APURAÇÃO
```

### Boundary rules

- ORC resolves operational identity and state; fiscal resolution consumes that result.
- NCM/NBS and CST/cClassTrib are fiscal classification inputs, never identity truth.
- Fiscal rules are versioned and temporally valid.
- Fiscal outcomes retain legal basis, authoritative source and ruleset version.
- Technical source/execution failures remain technical failures.
- Unresolved fiscal interpretation remains explicit and can require human verification.
- The 3L0 should integrate authoritative tax infrastructure rather than recreate the entire normative calculation stack.

### Delivery timing

**Phase 1:** establish contracts/documentation only. No tax calculation in the camera slice.

**Phase 2 — Receiving MVP:** implement fiscal context, classification and resolution integration after physical/product identity is resolved.

**Later:** calculation, compliance, document generation and broader fiscal automation.

See `core/fiscal/README.md`, `docs/tax-ruleset-architecture.md` and `docs/tax-research.md`.

## Phase 2 — Receiving MVP
**Goal:** prove that 3L0 can reconcile the physical product, document and the representation already used by the enterprise system, then produce a reviewable representation for that target system.

```text
PRODUCT + NF-e/XML + ERP/WMS REPRESENTATION + OPERATOR
                    ↓
             3L0 OBSERVATIONS
                    ↓
               NORMALIZATION
                    ↓
                   ORC
                    ↓
          CANONICAL 3L0 ENTITY
             + CONTEXT/EVIDENCE
                    ↓
             TARGET MAPPING
                    ↓
          TARGET SYSTEM FORMAT
                    ↓
          RECEIVING DECISION
```

### Build order

- [ ] collect representative product records from the target system
- [ ] capture target-system field/schema representation
- [ ] define canonical product representation
- [x] define initial versioned target mapping contract (code-level foundation; real target schema still pending)
- [x] source-preserving document-item observation contract (accepts already-extracted fields)\n- [ ] raw NF-e/XML parsing, structural validation and file ingestion
- [ ] physical product capture after/alongside document review (EAN/GTIN, QR/Glyph, image/OCR, operator)
- [ ] ERP/WMS lookup or import adapter
- [ ] product matching across physical/document/system representations through ORC
- [ ] explicit reconciliation of declared quantity vs physically received quantity
- [ ] missing-field resolution without inventing values
- [x] generic required-source-field validation and explicit mapping transforms\n- [ ] mapping validation against the real target schema and its enumerations
- [x] reviewable in-memory target payload with mapping version and field provenance\n- [ ] serialized JSON/CSV/XLSX export artifact
- [ ] receiving workflow
- [ ] exception queue
- [ ] audit/evidence history
- [ ] live ERP/system adapter only after mapping validation

### Recommended receiving sequence

```text
NF-e/XML → document declarations → physical product observation → ORC resolution
→ canonical 3L0 entity → versioned ERP mapping → reviewable output
```

This is the recommended sequence for Case 01, not a requirement that sources arrive in that order. Each source remains a separate observation. Document identity, physical identity, received quantity and fiscal classification are distinct claims and must not be inferred from one another automatically.

### Guardrails

- target-system schema must not become the 3L0 semantic model;
- screenshots/exports are observations of the enterprise representation, not automatic truth;
- Identifier ≠ Entity ≠ System Record;
- unresolved mapping remains explicit;
- no live write integration before the mapping is validated with real data;
- fiscal calculation remains downstream of operational resolution.

**Exit gate:** one real product, represented by physical observation + document + enterprise-system data, can be resolved into a canonical 3L0 entity and transformed into a reviewable target-system representation with provenance, explicit conflicts and no silently invented fields.


NF-e / ERP / Product + Camera / Barcode + Operator → 3L0 → identity/data/conflicts → receiving decision.

- [ ] NF-e/XML ingestion
- [ ] ERP lookup
- [ ] product matching
- [ ] missing-field resolution
- [ ] receiving workflow
- [ ] exception queue
- [ ] audit history

**Exit gate:** measured comparison against the existing manual workflow.

## Phase 3 — Field Pilot

- [ ] real operator
- [ ] real products
- [ ] real network conditions
- [ ] representative images
- [ ] failure taxonomy
- [ ] telemetry
- [ ] offline/recovery
- [ ] integration reliability

Measure manual entries avoided, automatic resolution, human intervention, false resolution, time per operation, duplicates and sync failures.

**Exit gate:** measurable improvement without unacceptable false resolutions.

## Phase 4 — Operational Expansion

Priority:
1. inventory
2. transfer
3. return
4. supplier delivery
5. fulfillment
6. sale

**Exit gate:** multiple workflows reuse the same entities and evidence history.

## Phase 5 — Platform

- [ ] API
- [ ] integration adapters
- [ ] pluggable vision providers
- [ ] resolution service
- [ ] rule/policy versioning
- [ ] observability
- [ ] multi-tenant boundaries
- [ ] deployment tooling

**Exit gate:** a second workflow consumes the same core without copying semantics.

## Phase 6 — Scale & Commercial Validation

- [ ] deployment model
- [ ] onboarding
- [ ] customer configuration
- [ ] ROI instrumentation
- [ ] pricing hypothesis
- [ ] support model
- [ ] security posture
- [ ] reliability targets

**Exit gate:** repeated real-world use with measurable economic value.

## Early non-goals

No priority yet for large feature catalogs, autonomous agents, complex gamification, mandatory QR/NFC, custom hardware manufacturing, ERP replacement or broad logistics coverage before one workflow is proven.

## North-star metric

> **Operational work eliminated per successfully resolved operation.**


## Phase 2 execution status — 2026-10-21

The initial code tranche adds a source-preserving document-item observation contract and a generic versioned target-mapping function. The mapper only accepts `RESOLVED`, records missing fields and provenance, and returns `REVIEW_REQUIRED` or `INVALID_MAPPING_INPUT`; it never writes to a target system. These components are foundations, not an end-to-end Receiving MVP. Raw NF-e XML parsing, real ERP schema, canonical persistence, cross-source ORC reconciliation, UI, export artifacts and field validation remain pending. See `docs/phase-2-execution-log.md`.
