# Architecture

## System boundary

3L0 Vision is the application/product layer. ORC is the resolution infrastructure.

```text
PHYSICAL WORLD / DOCUMENTS / ENTERPRISE RECORDS
                     ↓
                  3L0 Vision
                     ↓
       observations / evidence / context
                     ↓
                    ORC
                     ↓
       resolved operational representation
                     ↓
                  3L0 Vision
                     ↓
       mapping / adapter / operator review
                     ↓
               ERP / WMS / system
```

## Input modalities

### Deterministic
- QR
- EAN / barcode
- known internal identifiers
- structured XML, including NF-e XML when available

### Extractive
- OCR
- document parsing
- image metadata

### Semantic
- computer vision
- multimodal models
- bounded decision models

### Human
- confirmation
- correction
- missing values
- exception decisions

## Resolution boundary

Vision models do not create truth. They produce observations.

A vision model may report a possible brand, visible text or candidate product with a confidence estimate. 3L0 Vision passes these observations into the resolution layer together with evidence and context. ORC determines what operational representation is supportable for the question being asked.

An identity resolution does not automatically confirm quantity received, price, expiration, packaging condition or fiscal compliance; those claims require their own evidence and rules.

## Provider independence

The product should not be coupled to one vision provider. The vision interface should allow local models, cloud APIs, OCR engines, barcode libraries and future providers while keeping the observation contract stable.

## Receiving flow — Case 01

For the first receiving experiment, the recommended operator sequence is:

```text
NF-e / XML / document
        ↓
extract document declarations
        ↓
capture the physical product
(EAN/GTIN · QR/Glyph · image/OCR · operator)
        ↓
normalize observations + evidence + context
        ↓
ORC resolution across available sources
        ↓
canonical 3L0 entity + provenance + exceptions
        ↓
versioned mapping for the target ERP/WMS
        ↓
reviewable output
        ↓
authorized live adapter only after validation
```

This is a recommended workflow order, not a requirement that every source arrive in that sequence. A document describes what was declared; it does not prove the physical item or quantity matches. The physical capture provides independent evidence. ORC resolves the relationship without allowing a QR, image or model score to bypass resolution.

## Canonical representation and interoperability

3L0 must distinguish three layers:

```text
IDENTIFIER ≠ 3L0 CANONICAL ENTITY ≠ TARGET SYSTEM RECORD
```

An identifier such as EAN, SKU or Glyph reference is a reference observed in a source. The 3L0 canonical entity is the operational representation produced by justified resolution across sources. A target-system record is the representation of that entity inside a particular ERP/WMS.

The intended downstream architecture is:

```text
PHYSICAL / DOCUMENT / ENTERPRISE SYSTEM
                ↓
          OBSERVATIONS
                ↓
           NORMALIZATION
                ↓
               ORC
                ↓
       CANONICAL 3L0 ENTITY
         + CONTEXT + EVIDENCE
                ↓
        VERSIONED TARGET MAPPING
                ↓
        VALIDATION / REVIEWABLE EXPORT
                ↓
        TARGET ADAPTER / EXPORT
                ↓
          ERP / WMS / SYSTEM
```

Mapping and adapters belong to the product/integration layer. ORC remains responsible for semantic resolution, not system-specific serialization. Target-system schema must not become the internal semantic model of 3L0. Unresolved fields remain explicit; values must not be invented to satisfy a target schema. Live writes follow mapping validation and authorization.

## Glyph boundary

Glyph is an optional physical-reference layer. In the Gate A prototype, a QR payload in the `3l0-glyph:v1:<opaque-id>` form is syntax-validated and normalized as an observation identifier. Syntax validation alone does not look up a registry, prove the record is active, prove physical attachment, or establish authenticity. Ordinary QR payloads remain generic QR observations. Malformed payloads claiming the Glyph namespace are rejected rather than silently treated as generic QR.

Gate A does not implement issuance, registry persistence, lookup, revocation, anti-counterfeit features or ERP integration.

## Non-goals

3L0 Vision is not initially:
- a new ERP;
- a generic chatbot;
- an autonomous agent with unrestricted authority;
- a mandatory QR system;
- a hardware company;
- a replacement for fiscal source systems;
- a claim of production-ready integration with every ERP.

See [Interoperability and Mapping](interoperability.md) and [ADR-0004 — Target systems remain external representations](decisions/0004-target-systems-remain-external-representations.md).
