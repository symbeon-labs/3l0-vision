# 3L0 Vision — Fiscal Resolution Layer

## Status

Architecture boundary defined. Runtime implementation intentionally deferred until the Receiving MVP.

## Position in the system

The Fiscal Resolution Layer is downstream of ORC.

```
PHYSICAL / DOCUMENT / ERP
        ↓
OBSERVATION
        ↓
NORMALIZATION / CONTEXT
        ↓
ORC RESOLUTION
        ↓
RESOLVED ENTITY + OPERATIONAL CONTEXT
        ↓
FISCAL RESOLUTION LAYER
        ↓
FISCAL RESULT + LEGAL BASIS + SOURCE + VERSION
        ↓
TAX CALCULATION / COMPLIANCE
        ↓
NF-e / ERP / APURAÇÃO
```

## Responsibility

ORC answers:

> What entity is this, what is its operational state, and what resolution can be supported by the available evidence and context?

Fiscal Resolution answers:

> Given the resolved entity, operation, jurisdiction, regime, date and other fiscal context, what fiscal treatment applies and why?

Tax calculation is a downstream concern.

## Hard boundaries

- Fiscal rules must never silently establish physical/product identity.
- NCM/NBS and CST/cClassTrib are fiscal classification inputs, not identity truth.
- Observation time is not automatically fiscal validity time.
- Model confidence is not fiscal certainty.
- Technical retrieval/execution failure is not a fiscal semantic conflict.
- Fiscal results must retain normative provenance and ruleset version.
- Unresolved fiscal interpretation must remain explicitly unresolved or require verification.

## Planned modules

```
core/fiscal/
├── context/
├── classification/
├── resolution/
├── rules/
├── sources/
└── contracts/
```

These modules are an architectural target, not a reason to expand the Phase 1 camera slice.

## Implementation order

1. Fiscal context contract.
2. Classification snapshot contract.
3. Source/provenance registry.
4. Fiscal resolution contract.
5. Versioned rule evaluation.
6. Calculation trace.
7. Official-source synchronization/reconciliation.
8. Human verification workflow.
9. Integration with Receiving MVP.

## Relationship with official infrastructure

The 3L0 should prefer authoritative Brazilian tax sources and official services/data where available rather than recreating the complete normative calculation stack.

The current official RTC infrastructure already exposes classifications, legal foundations, NCM/NBS, rates and tax calculation capabilities. The 3L0 fiscal layer should therefore act as an integration and traceability boundary around resolved operational context, not as a parallel tax authority.

## Non-goal for Phase 1

Do not add tax calculation, fiscal classification automation or fiscal API calls to the camera vertical slice merely because the fiscal boundary exists.

The boundary is being established now so the Receiving MVP can consume it without redefining ORC semantics.
