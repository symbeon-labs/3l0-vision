# ADR-0004 — Target systems remain external representations

## Context

Case 01 shows that operational information is distributed across physical goods, documents and enterprise systems.

The product must eventually translate resolved entities into representations accepted by those systems.

## Decision

A target ERP/WMS/company system is an external representation, not the internal semantic model of 3L0.

The canonical distinction is:

```
IDENTIFIER ≠ 3L0 CANONICAL ENTITY ≠ TARGET SYSTEM RECORD
```

Mapping and adapters belong to the product/integration layer. ORC remains responsible for semantic resolution.

## Why

This preserves interoperability without coupling the 3L0 model to one vendor, schema or workflow.

## Consequences

The first interoperability proof should use captured representations and reviewable mappings.

Live writes/API integration come only after mapping correctness is demonstrated.

## Revisit when

Revisit if evidence shows that a target-system constraint is itself a necessary part of the semantic model rather than an external representation.
