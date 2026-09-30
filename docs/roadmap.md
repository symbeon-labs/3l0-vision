# 3L0 Vision — Strategic Roadmap

The roadmap is organized around evidence gates, not calendar promises.

## Phase 0 — Foundation
- [x] product thesis
- [x] architecture boundary
- [x] UX principles
- [x] vision contract
- [x] gamification principles
- [x] brand system
- [x] application symbol
- [x] strategic workstreams
- [x] project map
- [x] project structure
- [x] design tokens
- [x] ORC integration contract
- [ ] application shell

**Exit gate:** a normalized observation can enter the ORC boundary. Documentation and the first executable core are now in place; the application shell remains the final Phase 0 item.

## Phase 1 — Vertical Slice

Camera → barcode/OCR → observation → matching → ORC → resolution → confirmation → entity.

- [ ] camera capture
- [ ] barcode/EAN
- [ ] OCR
- [ ] observation normalization
- [ ] deterministic matching
- [ ] ORC resolution request
- [ ] resolved/uncertain/conflict states
- [ ] confirmation
- [ ] persistent entity
- [ ] evidence/history

**Exit gate:** one physical product can be identified, resolved and reused later.

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
