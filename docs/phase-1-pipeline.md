# Phase 1 — Resolution Pipeline

The Phase 1 pipeline is the executable backbone of the first vertical slice.

## Pipeline

```text
PHYSICAL INPUT
      ↓
CAPTURE
      ↓
OBSERVATION
      ↓
NORMALIZATION
      ↓
CANDIDATE RETRIEVAL
      ↓
ORC RESOLUTION
      ↓
RESOLUTION STATE
   ┌──┼──────────────┐
   ↓  ↓              ↓
RESOLVED  ATTENTION  CONFLICT / UNCERTAIN
   ↓
PERSISTENCE
   ↓
EVIDENCE / HISTORY
```

The operator-facing product may represent these stages as:

```text
CAPTURAR → ENTENDER → CONFERIR → RESOLVER → OPERAR
```

These are UX labels. The pipeline stages remain explicit in code.

## Responsibilities

| Stage | Responsibility | Must not do |
|---|---|---|
| Capture | obtain physical input | decide identity |
| Observation | represent what was observed | declare operational truth |
| Normalization | standardize representation | invent missing facts |
| Candidate retrieval | provide entities relevant to the question | silently choose a winner |
| ORC | resolve observations in context | hide uncertainty/conflict |
| State | project resolution into product state | redefine ORC semantics |
| Persistence | retain resolved operational identity/evidence | persist unresolved guesses as facts |

## Adapter boundaries

The pipeline receives two external adapters:

- `captureAdapter.capture(input)` — camera, scanner, manual code or future capture source.
- `entityRepository` — candidate retrieval and persistence.

The ORC boundary is represented by `OrcClient`.

This keeps hardware, catalog storage and ORC deployment replaceable without changing the semantic pipeline.

## Resolution rule

The pipeline does not convert:

```
image → product
```

It preserves:

```
source → observation → evidence/context → ORC resolution → operational state
```

A deterministic match can produce `RESOLVED`. Ambiguity remains `CONFLICT`. Lack of sufficient evidence remains `UNCERTAIN`.

## Persistence rule

Only a `RESOLVED` result with exactly one resolved entity is persisted by the current foundation pipeline.

`CONFLICT`, `UNCERTAIN`, `INCOMPLETE`, `REQUIRES_VERIFICATION` and `REJECTED_FOR_AUTOMATION` remain available to the exception/confirmation layer rather than being silently persisted as identity.

## Phase 1 completion

The pipeline is considered proven when a physical product can:

1. enter through a real capture source;
2. produce a normalized observation;
3. cross the intended ORC boundary;
4. resolve or explicitly remain unresolved;
5. persist its operational identity when resolution is valid;
6. be recognized again without rebuilding the identity.
