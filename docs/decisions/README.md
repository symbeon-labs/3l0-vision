# 3L0 Vision — Architectural Decisions

This directory records decisions that are important enough to preserve their rationale.

It is intentionally small.

Do not create an ADR for routine implementation choices. Create one when a decision changes or constrains:

- a system boundary;
- a semantic invariant;
- a phase boundary;
- an integration strategy;
- a canonical representation;
- a rule that a future contributor could reasonably question.

## Decision format

Each decision contains:

- **Context** — why the decision was necessary;
- **Decision** — what was chosen;
- **Why** — why this option;
- **Consequences** — what it enables and limits;
- **Revisit when** — evidence that would justify changing it.

## Current decisions

- [ADR-0001 — Evidence gates over feature count](0001-evidence-gates-over-feature-count.md)
- [ADR-0002 — Canonical concepts have one home](0002-canonical-concepts-have-one-home.md)
- [ADR-0003 — Phase boundaries are implementation boundaries](0003-phase-boundaries-are-implementation-boundaries.md)
- [ADR-0004 — Target systems remain external representations](0004-target-systems-remain-external-representations.md)

New decisions should link to the relevant roadmap, architecture or field-journal entry rather than duplicating it.
