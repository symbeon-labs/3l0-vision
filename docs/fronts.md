# 3L0 Vision — Strategic Workstreams

The project is organized as coordinated workstreams rather than a feature list.

## 01 — Resolution Core Integration
**Objective:** make ORC usable by the product without duplicating its semantics.

Scope:
- ORC integration contract;
- observation/assertion/evidence exchange;
- resolution requests and outcomes;
- provenance;
- uncertainty/conflict;
- human confirmation;
- resolution history.

**Gate:** one real workflow can enter heterogeneous inputs and receive a traceable resolution.

## 02 — Capture & Vision
**Objective:** turn physical-world signals into normalized observations.

Scope:
- camera capture;
- barcode/EAN;
- QR;
- OCR;
- image preprocessing;
- product/object detection;
- provider abstraction;
- confidence/model metadata;
- poor-connectivity behavior.

**Principle:** deterministic signals first; semantic vision only when necessary.

**Gate:** benchmarked recognition on representative real-world images.

## 03 — Identity & Product Data
**Objective:** create persistent operational identity without repeated reconstruction.

Scope:
- entity creation;
- identifier association;
- multiple identifiers;
- canonical fields;
- provenance;
- duplicate detection;
- field status;
- history.

**Gate:** the same physical product can be recognized again without rebuilding its record.

## 04 — Operational Workflows
**Objective:** turn resolution into logistics actions.

Initial:
- receiving;
- inventory;
- product registration.

Then:
- transfer;
- sale;
- return;
- fulfillment;
- supplier delivery.

Every workflow defines input, operational question, resolution, human exception, state transition, downstream action and evidence.

**Gate:** measurable reduction of manual reconciliation.

## 05 — Enterprise & Fiscal Integration
**Objective:** use information companies already possess.

Scope:
- ERP adapters;
- NF-e/XML;
- supplier data;
- internal catalogs;
- stock systems;
- synchronization;
- mapping;
- read-only/shadow modes;
- controlled write-back.

**Gate:** one real source and one real downstream integration.

## 06 — Operator Experience
**Objective:** make resolution faster and safer than manual registration.

Scope:
- capture;
- processing;
- resolved;
- attention;
- conflict;
- history;
- batch operations;
- confirmation;
- recovery;
- accessibility.

**Core metric:** manual work avoided per operation.

## 07 — Operational Intelligence & Evaluation
**Objective:** measure whether automation is actually useful.

Scope:
- resolution rate;
- automatic resolution;
- human intervention;
- false resolution;
- conflict rate;
- duplicate rate;
- OCR correction;
- latency;
- synchronization failures;
- cost per resolved operation.

**Gate:** product decisions are driven by measured outcomes.

## 08 — Trust, Security & Governance
**Objective:** keep automation auditable and controllable.

Scope:
- authentication/authorization;
- evidence access;
- sensitive data;
- audit trail;
- model/rule provenance;
- human override;
- rollback;
- incident investigation;
- retention.

**Gate:** consequential automated resolutions have a reconstructable decision path.

## 09 — Platform & Reliability
**Objective:** make the product dependable before expanding its surface.

Scope:
- API;
- persistence;
- queues;
- retries;
- observability;
- idempotency;
- caching;
- offline synchronization;
- failure recovery;
- performance;
- deployment.

**Gate:** pilot workloads run repeatedly without manual system repair.

## 10 — Field Hardware
**Objective:** accelerate physical operations where software alone is insufficient.

Optional:
- mobile device;
- Bluetooth thermal printer;
- labels;
- scanner;
- NFC.

Hardware is an accelerator, not a prerequisite.

**Gate:** hardware demonstrably improves throughput or identification reliability.

## 11 — Deployment & Business Validation
**Objective:** prove measurable operational value.

Scope:
- target customer profile;
- deployment model;
- onboarding;
- workflow configuration;
- pricing hypotheses;
- support burden;
- integration cost;
- ROI measurement.

**Gate:** a real organization completes the workflow repeatedly and economic value can be measured.

## Dependency model

ORC → Resolution Core → Capture/Vision + Identity/Data → Operational Workflows → Enterprise Integration → UX/Evaluation → Trust/Reliability → Hardware/Business.

Workstreams may progress in parallel, but no downstream surface should hide a missing semantic dependency.

## Strategic rule

**Build the smallest vertical slice that crosses all critical layers before expanding horizontally.**
