# ADR-0005 — Physical labels are optional identification accelerators

## Status

Accepted as an architectural direction; implementation and field validation remain pending.

## Context

3L0 Vision must connect observations from the physical world to operational entities and states. Some workflows already contain identifiers such as EAN, QR, internal codes, documents or system records. Other objects may have no readable marker, may carry an incorrect marker, or may present conflicting evidence.

A dedicated 3L0 label can reduce friction in repeated workflows, but making labels mandatory would introduce deployment cost, relabeling work and dependence on a physical artifact. It would also risk confusing possession of an identifier with proof of the object's identity or authenticity.

The current product principle is that the initial workflow remains markerless-capable: QR/NFC/labels can accelerate identification, but they are not prerequisites.

## Decision

1. Treat physical labels as an optional input/association mechanism within 3L0 Vision, not as the canonical identity itself.
2. Preserve markerless identification through camera observations, OCR, existing barcodes, documents, enterprise data and human confirmation.
3. Treat a scanned label as an observation and a reference to resolve, not as an automatic truth claim.
4. Keep separate:
   - the physical object observed;
   - the 3L0 canonical operational entity;
   - the identifier printed on a label;
   - the target-system record;
   - any authenticity result.
5. A label lookup may support resolution, but a valid QR or active registry record alone does not prove that the physical label is genuine or correctly attached to the object.
6. Preserve explicit outcomes such as `RESOLVED`, `UNCERTAIN` and `CONFLICT`. Technical unavailability must remain a technical failure, not be reclassified as a semantic conflict.
7. Start with conventional, testable print-and-scan formats. Any advanced physical, optical or anti-counterfeit mechanism requires a separate implementation, threat model and validation gate.
8. Keep label issuance, replacement, revocation and audit behavior in the product/integration layer; do not make the resolution core dependent on a particular label technology.

## Why

This approach makes labels useful where they lower operational friction without forcing every environment to adopt a new physical standard. It also protects the distinction between an identifier and the evidence needed to support an operational decision.

The decision aligns with the existing 3L0 architecture: observations and evidence enter the resolution workflow; the canonical entity is distinct from both source identifiers and target-system records.

## Consequences

- The capture pipeline may accept QR/label reads as one observation modality.
- A label registry or issuance module may be added when a concrete workflow requires it; it is not assumed to exist in the current implementation.
- The first prototype should compare label-assisted identification against the markerless baseline in a bounded workflow.
- Evaluation should measure first-pass read rate, association errors, time per item, exception rate, reprint/revocation handling and total cost per item.
- User interface copy must not imply authenticity or fraud prevention unless the relevant mechanism is implemented and tested.
- Any product-specific label format must remain versioned and interoperable where practical.

## Not decided here

This ADR does not select final label dimensions/materials, an identifier scheme, a production domain, a database, a cryptographic protocol, an optical substrate or a mandatory SCIC dependency.

## Revisit when

Revisit after a bounded receiving or inventory pilot demonstrates a measurable need for a dedicated label, or when tests show that existing identifiers and markerless observations are insufficient for the intended workflow.

## Related documentation

- [Architecture](../architecture.md)
- [README and product scope](../../README.md)
- Private research specification: 3L0 Glyph v0.1 (not part of the public repository)
