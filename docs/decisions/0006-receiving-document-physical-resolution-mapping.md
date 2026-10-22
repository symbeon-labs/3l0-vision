# ADR-0006 — Receiving reconciles document, physical item and target-system representation

## Status

Accepted as the recommended architecture for the Case 01 experiment. End-to-end implementation and field validation remain pending.

## Context

Case 01 records repeated reconciliation across physical merchandise, fiscal documents, product catalogues and enterprise records. These sources represent the same operational reality but do not automatically prove the same claims. A fiscal document describes declared items and quantities; physical observation provides independent evidence; ERP/WMS records use system-specific identifiers and schemas.

## Decision

For the first receiving workflow, use this recommended sequence:

```text
NF-e/XML/document
→ document declarations
→ physical product observation
→ normalized observations + provenance/context
→ ORC resolution
→ canonical 3L0 entity
→ versioned target-system mapping
→ validated reviewable output
→ authorized live adapter only after validation
```

1. Prefer structured NF-e XML when available and authorized; preserve source values and provenance. OCR/PDF/image parsing is an alternative path, not an equivalent source of certainty.
2. Observe the physical product independently using available identifiers, camera/OCR and operator confirmation.
3. Resolve the relationship between document item, physical observation and enterprise record through ORC. No identifier, QR label, image or model confidence bypasses resolution.
4. Keep identity, received quantity, price, expiration, packaging condition and fiscal classification as distinct claims requiring appropriate evidence.
5. Maintain the canonical 3L0 entity independently from identifiers and target ERP/WMS records.
6. Apply a versioned mapping in the product/integration layer; preserve provenance, unresolved fields, validation results and transformation rules.
7. Produce a reviewable output first. Do not write live to an ERP/WMS until schema, mapping, error handling, authorization and the operational workflow are validated.
8. Keep technical failures separate from semantic outcomes such as `UNCERTAIN` or `CONFLICT`.

## Why

This sequence is grounded in the Case 01 receiving problem and creates a bounded experiment. It separates what the document declares from what is physically observed and what the target system stores. It also enables the same canonical entity to be mapped to different ERP schemas without making one vendor's schema the semantic model of 3L0.

## Consequences

- NF-e/XML ingestion, physical capture, ORC reconciliation and target mapping are distinct components.
- The first integration output is reviewable, not an automatic ERP write.
- Target mappings require versioning and validation against the actual system schema.
- Gate A for Glyph only validates and normalizes a versioned QR reference; it does not implement registry lookup, issuance, revocation or authenticity proof.
- This decision describes intended architecture; it does not claim that end-to-end NF-e ingestion, ERP mapping or live integration is already implemented.

## Revisit when

Revisit after the controlled receiving experiment if evidence shows a different sequence is operationally better, if the target-system constraints change the required mapping contract, or if measured results show the workflow does not reduce effort without increasing incorrect resolutions.

## References

- [Architecture](../architecture.md)
- [Interoperability and Mapping](../interoperability.md)
- [Strategic Roadmap](../roadmap.md)
- [ADR-0004 — Target systems remain external representations](0004-target-systems-remain-external-representations.md)
