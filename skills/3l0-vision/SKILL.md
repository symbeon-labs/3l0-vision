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
