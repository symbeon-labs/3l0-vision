# Architecture

## System boundary

3L0 Vision is the application/product layer. ORC is the resolution infrastructure.

```
PHYSICAL WORLD
    ↓
capture / documents / identifiers / enterprise data
    ↓
3L0 Vision
    ↓
observations / assertions / evidence / context
    ↓
ORC
    ↓
resolved representation
    ↓
3L0 Vision
    ↓
operator / operational system / ERP
```

## Input modalities

### Deterministic
- QR
- EAN / barcode
- known internal identifiers
- structured XML

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

Vision models do not create truth.

They produce observations.

A vision model may say:

- possible brand: X
- visible text: Y
- possible product: Z
- confidence: 0.82

3L0 Vision passes those observations into the resolution layer together with evidence and context.

ORC decides what operational representation is supportable.

## Provider independence

The product should not be coupled to one vision provider.

The vision interface should allow:
- local models
- cloud APIs
- OCR engines
- barcode libraries
- future providers

The same observation contract should remain stable.

## Initial architecture

```
Mobile/Web Client
       ↓
Capture Service
       ↓
Observation Normalization
       ↓
Matching
       ↓
ORC Resolution
       ↓
Operational Entity
       ↓
Action / ERP / History
```

## Non-goals

3L0 Vision is not initially:
- a new ERP
- a generic chatbot
- an autonomous agent with unrestricted authority
- a mandatory QR system
- a hardware company
- a replacement for fiscal source systems


## Canonical representation and interoperability

3L0 must distinguish three layers:

```
IDENTIFIER
    ≠
3L0 CANONICAL ENTITY
    ≠
TARGET SYSTEM RECORD
```

An identifier such as EAN or SKU is evidence about a representation. A target-system record is the representation of an entity inside a particular enterprise system. The 3L0 canonical entity is the operational representation produced by resolution across sources.

The intended downstream architecture is:

```
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
        TARGET-SYSTEM MAPPING
                ↓
        TARGET ADAPTER / EXPORT
                ↓
          ERP / WMS / SYSTEM
```

The target system must not become the internal semantic model of 3L0.

Mapping and adapters belong to the product/integration layer. ORC remains responsible for semantic resolution rather than system-specific serialization.

See [Interoperability and Mapping](interoperability.md).
