# ADR-0003 — Phase boundaries are implementation boundaries

## Context

The 3L0 roadmap contains capabilities that are strategically important but not required for the current vertical slice.

Building future-phase infrastructure early increases scope and makes validation harder to interpret.

## Decision

A roadmap phase is also an implementation boundary.

A capability may be documented or contracted for future work without being implemented in the current phase.

For the current Phase 1, the priority is the physical resolution loop:

```
CAPTURE
→ OBSERVATION
→ NORMALIZATION
→ ORC
→ RESOLUTION
→ STATE
→ ACTION
→ PERSISTENCE / EVIDENCE
```

## Why

The smallest end-to-end proof gives the clearest evidence about whether the architecture works in practice.

## Consequences

Do not pull Receiving MVP, live ERP writes, broad OCR, platform infrastructure or commercial scale into Phase 1 without new evidence and an explicit roadmap decision.

## Revisit when

Revisit when the Phase 1 exit gate is satisfied or new evidence demonstrates that a future capability is necessary to close it.
