# 3L0 Vision — Application Foundation

Status: Phase 0 complete · Phase 1 ready to begin.

## Target structure

```text
3l0-vision/
├── app/
│   ├── capture/
│   ├── identify/
│   ├── history/
│   └── layout/
├── components/
│   ├── ui/
│   └── resolution/
├── core/
│   ├── orc/
│   ├── observations/
│   ├── entities/
│   └── state/
├── design/
│   └── tokens/
├── docs/
├── assets/
└── tests/
```

## Boundaries

`app/` owns operator-facing screens. `components/` owns reusable UI and contains no ORC semantics. `core/orc/` owns the integration client and mapping. `core/observations/` normalizes camera/OCR/barcode outputs. `core/entities/` owns operational identity and identifier association. `core/state/` owns product state projections. `design/tokens/` owns visual semantics. `tests/` owns unit, contract and integration tests.

## Phase 1 vertical slice

The first real slice is deliberately narrow:

```
CAPTURE
  → OBSERVATION
  → NORMALIZATION
  → ORC REQUEST
  → RESOLUTION
  → RESOLVED / ATTENTION / CONFLICT / UNCERTAIN
  → CONFIRM ONLY WHEN REQUIRED
  → PERSIST ENTITY
  → RECORD EVIDENCE / HISTORY
```

### Phase 1 implementation order

1. Real camera capture and permission handling.
2. Barcode/EAN extraction.
3. Manual code-entry fallback.
4. Observation normalization with source/evidence/context.
5. Real ORC service boundary or explicitly versioned adapter.
6. Deterministic resolution against a persistent catalog.
7. Resolution/exception UI.
8. Human confirmation contract when required.
9. Persistent entity/evidence/history path.
10. End-to-end tests with representative real inputs.

Nothing outside this slice should block the first working Phase 1 prototype.

## Readiness rule

Phase 1 is not complete because the screens exist. It is complete when one physical product can be captured, represented as an observation, resolved through the intended ORC boundary, persisted, and recognized again without rebuilding its identity.

## Phase 1 pipeline

The executable orchestration lives in `core/pipeline/resolution-pipeline.js`. It sequences capture → observation → normalization → candidate retrieval → ORC resolution → state projection → persistence, while keeping capture, catalog storage and ORC behind replaceable boundaries. See [Phase 1 Pipeline](phase-1-pipeline.md).
