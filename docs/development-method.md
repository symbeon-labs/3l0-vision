# 3L0 Vision — Development Method

## Purpose

This document defines the smallest repeatable method for developing 3L0 without inflating scope.

It exists so a collaborator can continue the project from the repository itself, without relying on undocumented personal context.

The method is:

```
PROBLEM
  ↓
CONTEXT
  ↓
DECISION
  ↓
SMALLEST IMPLEMENTATION
  ↓
TEST
  ↓
EVIDENCE
  ↓
VALIDATION
  ↓
NEXT DECISION
```

The objective is not to maximize features or documentation. It is to maximize **verified operational progress per unit of implementation effort**.

---

## 1. Before touching code

A contributor must answer:

1. What operational problem is being changed?
2. Which phase and exit gate does it belong to?
3. What existing concept already represents this?
4. Which artifact is authoritative for the decision?
5. What is the smallest implementation that can prove or falsify the requirement?

Read, in this order when relevant:

1. `skills/3l0-vision/SKILL.md`
2. `docs/roadmap.md`
3. relevant architecture/contract document
4. `docs/field-journal.md` for history or prior decisions
5. the implementation and its tests

Do not start by designing a new subsystem.

---

## 2. Define the change

Every implementation task should have a bounded statement:

**Need:** what must become possible?

**Current behavior:** what happens now?

**Target behavior:** what should happen?

**Evidence:** how will we know it works?

**Non-goal:** what will deliberately remain outside this change?

If the non-goal cannot be stated, the scope is probably not bounded enough.

---

## 3. Reuse before creating

Before adding a new:

- entity;
- status;
- interface;
- provider;
- pipeline stage;
- event;
- persistence mechanism;
- abstraction;

search the repository for an equivalent.

The canonical concept must have one home.

Extend an existing primitive when its semantics remain correct.

Create a new primitive only when the existing one cannot represent the requirement without becoming ambiguous or overloaded.

When a new architectural concept is created, record the decision.

---

## 4. Implement the smallest verifiable increment

Prefer:

```
one behavior
→ one implementation
→ one test
→ one observable result
```

Avoid speculative infrastructure.

Do not add a provider, model, database, API, adapter, abstraction or UI surface only because it may be useful later.

A future need is not current scope.

---

## 5. Preserve semantic boundaries

Implementation must preserve the project invariants:

- Observation ≠ Assertion
- Assertion ≠ Resolved State
- Evidence ≠ Identity
- Identifier ≠ Entity
- Inference ≠ Fact
- Conflict ≠ Failure
- Uncertainty ≠ Technical Error
- Model confidence ≠ Operational certainty

Never shortcut a boundary to make a demo easier.

Technical failure must remain technically observable. Semantic uncertainty must remain semantically observable.

---

## 6. Validate in increasing strength

Use the following levels:

| Level | Meaning |
|---|---|
| IMPLEMENTED | Code or contract exists |
| TESTED | Relevant automated tests pass |
| RUNTIME VALIDATED | Executed successfully in the target software environment |
| PHYSICALLY VALIDATED | Tested with the intended physical object/device |
| OPERATIONALLY VALIDATED | Tested in the real workflow with representative conditions |

Do not promote a result to a stronger level without the corresponding evidence.

---

## 7. Documentation rule

Documentation follows implementation and evidence.

Update documentation only when one of these changes:

- a system boundary;
- a permanent semantic rule;
- a roadmap phase or exit gate;
- a meaningful architectural decision;
- a validated experiment;
- the current project state.

Do not create documentation to describe speculative implementation.

Use the existing sources of truth:

| Artifact | Role |
|---|---|
| `README.md` | Orientation and current public project state |
| `SKILL.md` | Development behavior and guardrails |
| `docs/architecture.md` | Architecture and boundaries |
| `docs/roadmap.md` | Phases and exit gates |
| `docs/decisions/` | Why important decisions were made |
| `docs/field-journal.md` | History, experiments and validation |
| `docs/cases/` | Operational cases and their evidence |
| Code/tests | Actual implementation behavior |

If information already has a canonical home, link to it instead of copying it.

---

## 8. Scope discipline

The following rule is mandatory:

> **If it is not required to validate the current phase, do not build it.**

A task may be added to the roadmap when future value is clear, but it does not become current implementation scope without an explicit phase decision.

For Phase 1, the priority remains the physical vertical slice.

Do not advance to Receiving MVP, live ERP integration, broad OCR, platform work or commercial scale merely because the contracts for those capabilities exist.

---

## 9. Completion

A task is complete only when:

1. the intended behavior is implemented;
2. relevant tests are updated and pass;
3. runtime behavior is validated when applicable;
4. evidence is recorded when the task produces meaningful validation;
5. affected documentation is updated only if its structural truth changed.

A passing test does not prove field validity.

A field result does not automatically prove commercial value.

Keep these claims separate.

---

## 10. When a collaborator gets stuck

Do not invent a new direction.

Use this sequence:

```
READ SKILL
→ CHECK ROADMAP
→ CHECK EXISTING CONCEPTS
→ CHECK FIELD JOURNAL
→ INSPECT CODE/TESTS
→ FORM SMALLEST HYPOTHESIS
→ IMPLEMENT
→ TEST
→ RECORD RESULT
```

If two artifacts disagree, do not silently choose one. Identify the authoritative artifact, investigate the history, then correct the appropriate source.

---

## 11. Current project rule

The current project objective is:

```
REAL PRODUCT
→ CAPTURE
→ OBSERVATION
→ NORMALIZATION
→ ORC
→ RESOLUTION
→ STATE
→ ACTION
→ PERSISTENCE / EVIDENCE
```

The next step is determined by the Phase 1 exit gate and evidence from Case 01.

The repository should become more capable through validation, not through uncontrolled accumulation of features.
