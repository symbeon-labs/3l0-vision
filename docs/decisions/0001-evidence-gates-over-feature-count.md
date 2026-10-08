# ADR-0001 — Evidence gates over feature count

## Context

3L0 is a research/product project whose architecture can advance faster than empirical validation.

Feature accumulation can therefore create the appearance of progress without proving the operational thesis.

## Decision

The project advances through evidence gates, not feature count.

Implementation must be evaluated against the current phase exit gate and the strength of evidence actually produced.

## Why

This keeps implementation aligned with the real objective: proving an operational resolution workflow with the smallest credible system.

It also makes negative evidence useful instead of allowing unsupported assumptions to become permanent architecture.

## Consequences

- Small experiments are preferred.
- Contracts may exist before implementation, but they are not treated as validated.
- A passing test is not equivalent to field validation.
- New architecture requires a demonstrated need.

## Revisit when

Revisit only if the project's validation strategy or phase model materially changes.
