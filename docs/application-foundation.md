# 3L0 Vision — Application Foundation

Status: Phase 0.

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

## First vertical slice

Capture → Observation → ORC request → Resolution → Resolved/Conflict/Uncertain → Human confirmation.

Nothing outside this loop should block the first working prototype.