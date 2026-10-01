# 3L0 Vision — Project Skill

## Purpose

Use this skill whenever working on 3L0 Vision.

Core statement: **Tornar o mundo físico computável.**

Product principle:

> **O operador deve trabalhar nas exceções, não redigitar aquilo que o sistema já consegue descobrir, relacionar e comprovar.**

The skill is the project's **operational contract for agents**. It defines how to reason about and modify 3L0. Historical state belongs in `docs/field-journal.md`, not here.

---

## System boundary

3L0 Vision is the application/product layer.

ORC (Operational Resolution Core) is the semantic resolution infrastructure.

```
MUNDO FÍSICO
    ↓
CAPTURA / DOCUMENTO / IDENTIFICADOR
    ↓
3L0
    ↓
OBSERVAÇÃO / ASSERTION / EVIDENCE / CONTEXT
    ↓
ORC
    ↓
RESOLUÇÃO
    ↓
ESTADO OPERACIONAL
    ↓
AÇÃO / ERP / HISTÓRICO
```

3L0 owns:
- capture;
- vision/OCR;
- observations;
- UX;
- workflows;
- operational progress;
- application history;
- integrations.

ORC owns:
- Entity;
- Relation;
- Assertion;
- Evidence;
- Context;
- Resolution.

Do not move ORC semantics into 3L0 merely for implementation convenience.

---

## Semantic invariants

Never collapse:

- Observation ≠ Assertion
- Assertion ≠ Resolved State
- Evidence ≠ Identity
- Identifier ≠ Entity
- Inference ≠ Fact
- Attestation ≠ Resolution
- Conflict ≠ Failure
- Uncertainty ≠ Technical Error
- Observation time ≠ validity/state time
- Human confirmation ≠ automatic resolution
- Model confidence ≠ operational certainty

Never turn model output directly into operational truth.

Preferred chain:

```
source
→ observation/assertion
→ evidence/context
→ resolution
→ operational state
```

Avoid:

```
image → product
```

Conflict and uncertainty are meaningful semantic states, not defects to be hidden.

---

## Resolution statuses

The semantic resolution layer may produce:

```
RESOLVED
CONFLICT
UNCERTAIN
INCOMPLETE
REQUIRES_VERIFICATION
REJECTED_FOR_AUTOMATION
```

Technical errors remain separate from semantic resolution statuses.

A technical failure must not be silently converted into `UNCERTAIN`, `CONFLICT`, or another semantic state.

---

## Intelligence boundary

Prefer deterministic processing whenever identifiers, structured documents or explicit rules are sufficient.

Preferred progression:

```
QR / EAN / document
→ normalization
→ deterministic matching
→ semantic inference only when necessary
→ ORC resolution
```

Vision, OCR and AI may produce:
- observations;
- extracted values;
- candidate interpretations;
- assertions.

They do not independently establish operational truth.

Perception providers are replaceable adapters.

Current Phase 1:
- Browser BarcodeDetector is the current barcode implementation.
- ZXing-C++ is a candidate future barcode backend.
- PaddleOCR is a candidate future OCR backend.

New perception technology requires a concrete observation gap. Do not add AI, OCR, computer vision or model dependencies merely because they are available.

---

## UX principles

The operator should experience resolution, not unnecessary data entry.

Preferred flow:

```
CAPTURE
→ EXTRACT
→ MATCH
→ RESOLVE
→ CONFIRM ONLY WHEN NECESSARY
→ OPERATE
```

Rules:
- ask only what cannot be safely resolved;
- expose uncertainty and conflict;
- do not request confirmation for deterministic resolutions unless policy requires it;
- do not expose controls for workflows that are not executable;
- do not optimize the interface for speed at the expense of operational correctness.

Operational progress is not a game system.

Track real events such as:
- processed;
- automatically resolved;
- confirmed;
- attention;
- conflict;
- corrected;
- rejected;
- rework;
- duplicate;
- synchronization failure.

Do not create points, leaderboards, streaks or incentives for unsafe speed.

---

## Source of truth

Use project artifacts according to their responsibility:

| Artifact | Responsibility |
|---|---|
| `SKILL.md` | Agent behavior, guardrails and development protocol |
| `docs/architecture.md` | System architecture and boundaries |
| `docs/roadmap.md` | Phases, priorities and exit gates |
| `docs/orc-coverage.md` | ORC semantic coverage and boundary |
| `docs/project-map.md` | Repository orientation |
| `docs/field-journal.md` | Decisions, experiments, milestones, validation and historical state |

When the current state or rationale is unclear, consult `docs/field-journal.md`.

Do not copy historical project state into this skill unless it changes a permanent operating rule.

---

## Development protocol

Before changing code:

1. Understand the requested change and its operational purpose.
2. Read this skill.
3. Check `docs/roadmap.md` and the relevant exit gate.
4. Consult `docs/field-journal.md` when historical context, prior decisions or current validation state matters.
5. Locate the existing implementation responsible for the behavior.
6. Search for existing entities, states, interfaces, providers, pipeline stages, events or abstractions that may already represent the concept.
7. Check relevant contracts and tests.
8. Prefer the smallest change that satisfies the requirement.
9. Preserve provenance, uncertainty and semantic boundaries.
10. Add or update tests for changed behavior.
11. Run the relevant tests.
12. Validate runtime behavior when the change affects execution.
13. Update architecture/roadmap documentation only when the structural state actually changes.
14. Record meaningful architectural, semantic or validation milestones in the field journal.

Do not redesign the product surface or introduce new architecture before proving that the existing workflow requires it.

---

## No parallel concepts

Before introducing a new:
- entity;
- status;
- interface;
- provider;
- pipeline stage;
- event;
- abstraction;
- persistence mechanism;

search the repository for an equivalent.

If an existing primitive can be extended without changing its semantics, prefer extending it.

Do not create duplicate concepts merely because a new implementation is more convenient.

---

## Handling contradictions

When code, documentation, roadmap, tests or observed behavior disagree:

1. do not silently reconcile the discrepancy;
2. identify which artifact is authoritative for that question;
3. inspect the relevant historical decision in the field journal;
4. preserve the discrepancy until it is understood;
5. correct the appropriate artifact;
6. add or update tests when behavior changed;
7. record the decision in the field journal when it is structural or meaningful.

Observed runtime behavior takes precedence over assumptions when validating implementation.

Evidence that contradicts the thesis must be documented, not hidden.

---

## Completion levels

Do not equate implementation with validation.

Use these levels explicitly:

**IMPLEMENTED**
→ code or contract exists.

**TESTED**
→ relevant automated tests pass.

**RUNTIME VALIDATED**
→ behavior has been executed successfully in the target software environment.

**PHYSICALLY VALIDATED**
→ behavior has been tested with the intended physical device/object.

**OPERATIONALLY VALIDATED**
→ behavior has been validated in the real operational workflow with representative conditions.

A roadmap item is not complete merely because its code exists.

---

## Current development focus

The project is in:

**Phase 1 — Vertical Slice: IN PROGRESS.**

The target is:

```
REAL CAMERA / BARCODE
→ OBSERVATION
→ NORMALIZATION
→ ORC
→ RESOLUTION
→ RESOLVED / ATTENTION / CONFLICT / UNCERTAIN
→ CONFIRMATION ONLY IF NECESSARY
→ PERSISTENT ENTITY
→ EVIDENCE / HISTORY
```

The repository already contains the initial perception boundary, camera/barcode capture, observation normalization, deterministic catalog matching, local persistence and the Phase 1 orchestration skeleton.

The remaining work must be evaluated against the Phase 1 exit gate in `docs/roadmap.md`.

Do not treat the following as complete merely because contracts or placeholders exist:
- real ORC service boundary;
- evidence/history persistence;
- end-to-end human confirmation UI;
- OCR integration;
- physical device validation;
- representative end-to-end validation;
- Receiving MVP.

The immediate objective is not more vision.

It is proving that one physical product can move from capture to observation to resolution and back to a persistent operational representation with traceable evidence.

---

## Antigravity continuation

When working through Antigravity:

1. continue from the current `main` state;
2. do not restart Phase 0;
3. do not redesign the product surface without evidence;
4. read the current roadmap and field journal before substantial work;
5. validate existing implementation before adding new infrastructure;
6. preserve all semantic invariants;
7. keep perception providers behind the observation boundary;
8. prefer deterministic mechanisms when sufficient;
9. record meaningful discoveries and decisions in the field journal;
10. distinguish implementation from runtime and physical validation.

The field journal is the persistent executive memory for project evolution. Consult it whenever the reason, history or current validation state of a decision is relevant.

---

## Strategic roadmap

1. Foundation — complete
2. Vertical Slice — in progress
3. Receiving MVP
4. Field Pilot
5. Operational Expansion
6. Platform
7. Scale & Commercial Validation

Follow `docs/roadmap.md` for the authoritative phase definitions and exit gates.

---

## Decision discipline

Optimize for evidence, not feature count.

Measure, when applicable:
- identification reliability;
- resolution quality;
- provenance;
- conflict handling;
- manual-work reduction;
- operator correction;
- downstream usability;
- physical/runtime reliability.

When evidence contradicts the thesis, document it and adapt the project deliberately.
