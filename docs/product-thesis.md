# Product Thesis

## Problem

Operational systems receive information about the same physical object from different sources:

- camera
- barcode
- OCR
- fiscal document
- ERP
- operator
- sensors
- previous records

These sources rarely arrive as one coherent representation.

The practical consequence is repeated work: operators identify the same thing again, retype information already available elsewhere, reconcile conflicting data manually, and spend time resolving exceptions that software does not represent explicitly.

## Thesis

3L0 Vision explores a product layer that turns heterogeneous observations and existing enterprise information into a persistent operational identity and state.

The product does not attempt to eliminate uncertainty.

It makes uncertainty explicit and reduces the amount of human work required to resolve it.

## The transformation

Instead of:

capture → form → manual entry → save

3L0 Vision explores:

capture → extract → match → resolve → confirm only when necessary → operate

## Human role

Human input is part of the resolution system.

The product should ask the operator when:
- evidence conflicts
- multiple entities match
- a required field cannot be safely inferred
- a policy requires confirmation
- a consequence is too important for automatic resolution

The product should not ask when:
- existing evidence already supports the answer
- deterministic identifiers establish identity
- the value can be inherited safely from an authoritative source

## Success condition

A successful workflow is not the one with the most automation.

It is the one that:
- minimizes unnecessary manual entry
- preserves provenance
- exposes uncertainty
- reduces duplicate entities
- produces reusable operational identity
- lets the operator act on meaningful exceptions


## Interoperability thesis

The product problem is broader than recognizing a physical item.

The same operational reality can already exist as:

- physical product;
- EAN/GTIN/SKU;
- NF-e/XML;
- ERP/WMS record;
- spreadsheet export;
- image or document;
- operator statement.

3L0 should resolve these representations into a persistent operational entity and then translate that entity into the representation required by the target operational system.

The product therefore has two distinct proofs:

1. **Resolution proof:** different observations can be resolved into one justified operational entity.
2. **Interoperability proof:** the resolved entity can be transformed into a target-system representation without losing provenance, uncertainty or required human decisions.

This does not mean integrating every ERP. The first interoperability experiment should capture the real schema/representation used by the target company, normalize it into the 3L0 canonical representation, and generate a reviewable output before any live write integration.

The strategic sequence remains:

`ONE PRODUCT → ONE RESOLUTION → ONE OPERATION → ONE TARGET REPRESENTATION → ONE MEASURABLE BENEFIT`.
