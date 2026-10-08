# ADR-0002 — Canonical concepts have one home

## Context

The project contains product, ORC, perception, interoperability and operational layers. The same word can otherwise acquire multiple meanings across documents and code.

## Decision

Every architectural or semantic concept must have one canonical home.

Other artifacts should reference that source instead of redefining the concept.

Examples:

- development behavior → `SKILL.md`
- architecture/boundaries → `docs/architecture.md`
- phases/exit gates → `docs/roadmap.md`
- decision rationale → `docs/decisions/`
- history/experiments → `docs/field-journal.md`
- implementation behavior → code/tests

## Why

One canonical home reduces contradictions, documentation drift and onboarding cost.

## Consequences

- Prefer links over duplicated explanations.
- New concepts require repository search first.
- A concept should not be duplicated merely to make a document self-contained.

## Revisit when

Revisit if the repository's source-of-truth structure changes materially.
