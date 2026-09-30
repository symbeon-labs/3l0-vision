# ORC Coverage in 3L0 Vision

This document is the boundary check between the research core and the product implementation.

## ORC concepts that 3L0 must preserve

| ORC concept | 3L0 representation | Product responsibility |
|---|---|---|
| Entity | core/entities | persistent operational identity |
| Relation | entity relations + resolution request | connect products, locations, operations and other entities |
| Assertion | resolution request | preserve claims without silently converting them to facts |
| Evidence | observation evidence + resolution evidence | retain source material and provenance |
| Observation | core/observations | normalize camera, OCR, barcode and document outputs |
| Context | observation/request context | preserve time, location, operation and policy context |
| Resolution | core/orc | consume inputs and produce operational representation |
| State | core/state | project resolution into operator-facing state |
| Inference | model metadata on observations/assertions | remain distinguishable from resolved state |
| Attestation | external/adjacent | never collapse into resolution |
| Temporal semantics | timestamps/context | do not assume observation time equals operational validity |
| Provenance | resolution result | explain how the result was produced |

## Critical invariants

1. Observation is not assertion.
2. Assertion is not resolved state.
3. Evidence is not identity.
4. Inference is not fact.
5. Identity is not identifier.
6. Conflict is information.
7. Resolution is contextual.
8. A resolution outcome is not automatically truth.
9. Human confirmation is an explicit operational action.
10. Technical failure is different from semantic uncertainty.

## Current implementation status

### Preserved

- Entity
- identifiers
- observations
- context
- evidence references
- resolution statuses
- provenance field
- deterministic matching
- human confirmation contract

### Still incomplete

- full assertion model
- relation model beyond lightweight references
- persistent evidence store
- resolution history/replay
- ruleset execution/versioning
- real ORC service boundary
- temporal validity semantics
- ERP synchronization

These are deliberate Phase 1+ work, not reasons to expand the product core prematurely.

## Phase 1 integration rule

The product may start with deterministic identification, but every observation must remain capable of carrying the information needed for later multimodal resolution.

Avoid:

image → product

Preserve:

source → observation → evidence/context → resolution → operational state

This document is the checklist for preventing product implementation from silently redefining ORC semantics.
