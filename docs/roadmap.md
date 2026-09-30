# 3L0 Vision — Strategic Roadmap

The roadmap is organized around evidence gates, not calendar promises.

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

- [x] real camera capture + permission/recovery
- [x] barcode/EAN extraction
- [x] manual code-entry fallback
- [x] observation normalization with source/evidence/context
- [x] Phase 1 pipeline orchestration skeleton
- [ ] real ORC service boundary or versioned adapter
- [x] deterministic matching against persistent catalog (local persistence adapter)
- [ ] OCR as a secondary observation path
- [ ] resolution/exception UI
- [ ] human confirmation contract
- [ ] persistent entity
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

**Exit gate:** one physical product can be captured, represented as an observation, resolved through the intended ORC boundary, persisted, and recognized again without rebuilding its identity.

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
