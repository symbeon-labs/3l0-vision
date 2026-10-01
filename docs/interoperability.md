# 3L0 Vision — Interoperabilidade e Mapeamento Operacional

Status: **architectural direction · Phase 2**

## Purpose

The 3L0 must not learn an enterprise system as its internal semantic model.

Its role is to resolve heterogeneous representations of the same operational reality and translate the resolved representation into the schema required by a target operational system.

The canonical direction is:

```
PHYSICAL / DOCUMENT / ENTERPRISE SYSTEM
              ↓
        OBSERVATIONS
              ↓
         NORMALIZATION
              ↓
             ORC
              ↓
     3L0 CANONICAL ENTITY
       + CONTEXT + EVIDENCE
              ↓
      TARGET SYSTEM MAPPING
              ↓
       ERP / WMS / SYSTEM
```

## Canonical principle

**Identifier ≠ Entity ≠ System Record.**

A barcode, SKU or internal code identifies a representation. The enterprise record is a representation inside a particular system. The 3L0 entity is the operational representation resolved across sources.

Therefore:

```
EAN/SKU
  ↓
identifier

ERP record
  ↓
system representation

3L0 entity
  ↓
resolved operational representation
```

These must not be collapsed into one primitive.

## Inputs

The interoperability probe may accept:

- product image;
- QR / EAN / barcode;
- NF-e XML;
- NF image/PDF;
- ERP/WMS export;
- CSV/XLSX;
- structured product registration;
- screenshot or captured representation of the target system;
- operator-provided values.

These are **observations or source representations**, not automatically authoritative truth.

## Target-system capture

The first interoperability experiment should be able to receive a representation of how the company currently registers a product.

Examples:

- screenshot;
- exported spreadsheet;
- CSV/XLSX;
- PDF;
- structured sample record;
- manually transcribed field list.

The objective is not to automate the system immediately.

The objective is to discover and document:

- field names;
- field types;
- required fields;
- optional fields;
- identifiers;
- enumerations;
- relationships;
- source of each field;
- fields that require human confirmation;
- fields that can be resolved from authoritative sources;
- fields that are local to the target system.

## Mapping

The mapping layer translates between the canonical 3L0 representation and the target system representation.

Conceptually:

```
3L0 canonical field
        ↓
mapping rule
        ↓
target-system field
```

Example:

```
canonical.product.identifiers.ean
        ↓
target.ean

canonical.product.description
        ↓
target.description

canonical.product.unit
        ↓
target.unit_measure

canonical.fiscal.ncm
        ↓
target.ncm
```

The mapping must preserve provenance and unresolved states.

A field that cannot be safely resolved must remain unresolved or require confirmation. It must not be filled by invention.

## Adapter boundary

The integration architecture should evolve toward:

```
3L0 Canonical Representation
            ↓
       Mapping Contract
            ↓
      Target Adapter
            ↓
      Enterprise System
```

The adapter owns system-specific transport and serialization.

The canonical model must not become coupled to one ERP/WMS.

## Validation order

Do not begin with live ERP writes.

### Probe A — Representation capture

Collect the real product representations already used by the company.

### Probe B — Canonical normalization

Transform those representations into a stable 3L0 canonical structure.

### Probe C — Resolution

Relate physical product, document and enterprise representation through ORC.

### Probe D — Target mapping

Generate the structure expected by the target system.

### Probe E — Export

Initially produce JSON/CSV/XLSX or another reviewable representation.

### Probe F — Live integration

Only after the mapping is validated operationally, implement authenticated API/import/write adapters.

## Phase relationship

This capability belongs primarily to the **Receiving MVP / Phase 2**.

Phase 1 proves:

```
ONE PHYSICAL PRODUCT
→ OBSERVATION
→ RESOLUTION
→ PERSISTENT IDENTITY
```

Phase 2 proves:

```
PHYSICAL PRODUCT
+ DOCUMENT
+ ENTERPRISE REPRESENTATION
→ RESOLUTION
→ CANONICAL ENTITY
→ TARGET-SYSTEM REPRESENTATION
→ RECEIVING DECISION
```

## What this does not mean

This layer does not mean:

- replacing the ERP;
- recreating the ERP data model;
- building live integrations before validation;
- treating screenshots as authoritative records;
- turning every target-system field into an ORC primitive;
- moving enterprise-specific semantics into the ORC core.

The target system remains a consumer and source of operational representations.

## Success criterion

The interoperability capability is proven when the same real product can be represented from multiple sources and the system can:

1. preserve the source of each value;
2. resolve the representations into one operational entity when justified;
3. expose conflicts and missing information;
4. generate the target-system representation without silently inventing data;
5. allow a human to review unresolved mappings;
6. reproduce the mapping from a versioned contract.

The commercial integration comes after this proof, not before it.
