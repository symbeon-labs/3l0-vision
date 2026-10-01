# 3L0 Vision — Project Skill

## Purpose
Use this skill whenever working on 3L0 Vision. Preserve the boundary between the product and Operational Resolution Core (ORC).

Core statement: **Tornar o mundo físico computável.**

Product principle: **O operador deve trabalhar nas exceções, não redigitar aquilo que o sistema já consegue descobrir, relacionar e comprovar.**

## Architecture
MUNDO FÍSICO → OBSERVAÇÃO → INTERPRETAÇÃO → RESOLUÇÃO → IDENTIDADE → ESTADO OPERACIONAL → AÇÃO

3L0 owns capture, vision/OCR, observations, UX, workflows, operational progress, history and integrations.

ORC owns Entity, Relation, Assertion, Evidence, Context and Resolution.

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

Never turn model output directly into operational truth.

Preferred chain:
source → observation/assertion → evidence/context → resolution → operational state

Avoid:
image → product

## Resolution statuses
RESOLVED
CONFLICT
UNCERTAIN
INCOMPLETE
REQUIRES_VERIFICATION
REJECTED_FOR_AUTOMATION

Technical errors remain separate and must never be mapped to semantic uncertainty.

## Intelligence boundary
Prefer deterministic processing when identifiers, structured documents or explicit rules are sufficient.

QR/EAN/document → normalization → deterministic matching → semantic inference only when necessary → ORC resolution

Vision, OCR and AI produce observations, candidate interpretations or assertions. They do not independently establish truth.

Perception providers are replaceable adapters. Current Phase 1 uses browser BarcodeDetector; ZXing-C++ and PaddleOCR are candidate future providers, not ORC dependencies.

## UX
The operator experiences resolution, not data entry.

CAPTURE → EXTRACT → MATCH → RESOLVE → CONFIRM ONLY WHEN NECESSARY → OPERATE

Ask only what cannot be safely resolved. Expose uncertainty and conflict. Do not expose controls for workflows that are not executable.

## Operational progress
Operational progress is not a game system.

Track real events:
processed, automatically resolved, confirmed, attention, conflict, corrected, rejected, rework, duplicate and synchronization failure.

Do not create points, leaderboards, streaks or incentives for speed.

## Visual language
3L0 Vision. Verbal reading: Elo Vision.
Near-black environment; cyan capture; green resolution; amber attention; red conflict.
Inter for operator UI; JetBrains Mono for technical identifiers.
Use the open/broken circle, scan frame, convergence ring, confirmation mark and completion arc.
Avoid generic AI aesthetics and unnecessary animation.

## Development rules
Before changing code:
1. Check docs/roadmap.md.
2. Check docs/orc-coverage.md.
3. Check the ORC repository when semantics are involved.
4. Prefer existing primitives over parallel concepts.
5. Preserve provenance and uncertainty.
6. Add or update tests for semantic behavior.
7. Update the field journal for meaningful milestones.
8. Do not move ORC research into the product repo unless explicitly required.
9. Do not turn research hypotheses into product facts without evidence.
10. Do not expand the UI surface before the underlying workflow exists.

## Current state
Phase 0 — Foundation: COMPLETE.

Implemented:
- perception provider boundary and vision observation contract
- barcode observation normalization adapter
- replaceable vision provider registry
- application entrypoint and shell
- design foundation
- Entity and Observation models
- ORC integration contract
- ORC client
- deterministic resolver
- product-state mapping
- confirmation contract
- semantic unit tests
- ORC coverage checklist

Phase 1 — Vertical Slice: IN PROGRESS.

Target:
real camera/barcode → Observation → ORC request → resolution → resolved/conflict/uncertain → confirmation/exception → persistent operational entity → evidence/history

## Phase 1 handoff state

Implemented in the repository:
- browser camera capture with environment-facing camera
- native BarcodeDetector path when the browser supports it
- manual identifier fallback
- observation normalization with source, context, evidence and provenance
- deterministic catalog matching
- Phase 1 resolution pipeline
- local persistent catalog adapter
- resolved/uncertain/conflict state mapping
- provider-independent vision observation contract
- barcode provider boundary and registry
- semantic and pipeline test files

Not yet validated end-to-end:
- local execution of `npm test` against the current `main` state
- physical browser/device camera test
- real ORC service boundary
- OCR provider integration
- evidence/history persistence beyond the current local catalog path
- human confirmation workflow in the product UI

Known technology decisions:
- Browser BarcodeDetector is the current Phase 1 implementation.
- ZXing-C++ is a candidate future barcode backend.
- PaddleOCR is a candidate future OCR backend.
- These providers must remain adapters beneath the observation boundary and must not enter ORC semantics.

### Antigravity continuation rule

Continue from the current `main` state. Do not restart Phase 0 or redesign the product surface.

The repository was audited before this handoff. The audit found that the architecture is coherent for the current stage, while implementation is intentionally ahead of runtime validation in a few areas. The latest corrective commits on `main` are:
- `94e48a8b505232216746154c9a3158accb972da6` — valid demo EAN in the local catalog;
- `a239bef383b6814a7775257e477a58a0c0b82fdd` — `REJECTED_FOR_AUTOMATION` mapped explicitly to `ATTENTION`;
- `17cfd73ab24c8b467ef2fa62ff2baed5bdf858fd` — core tests aligned and non-automatable resolution covered;
- `d75e5ffa6248523e234dd5dc0c3292825d968aa9` — pipeline tests aligned;
- `d2b46bba6b37a670a818d39c95021b4fefef3006` — vision-provider tests aligned.

These corrections do not expand scope or change the architecture. They close concrete inconsistencies identified by the audit.

Do not treat the following as complete merely because contracts or placeholders exist: real ORC service, evidence/history persistence, end-to-end human confirmation, OCR integration, physical device validation, or Receiving MVP.

First validate the existing vertical slice locally:
1. install/use the repository dependencies if required;
2. run `npm test`;
3. fix implementation/test failures without weakening semantic invariants;
4. test the browser camera flow on a real device;
5. only then advance to the real ORC service boundary, OCR or richer perception.

Before adding a vision technology, prove the need through a concrete observation gap. Prefer adapter integration over direct coupling.

The immediate objective is not “more vision”. It is proving that one physical product can move from capture to observation to ORC resolution and back to a persistent operational identity with traceable evidence.

Do not mark a roadmap item complete merely because its code exists; distinguish implementation from runtime/physical validation.

## Strategic roadmap
1. Foundation — complete
2. Vertical Slice
3. Receiving MVP
4. Field Pilot
5. Operational Expansion
6. Platform
7. Scale & Commercial Validation

## Decision discipline
Optimize for evidence, not feature count.
Measure identification reliability, resolution quality, provenance, conflict handling, manual-work reduction, operator correction and downstream usability.
When evidence contradicts the thesis, document it instead of hiding it.
