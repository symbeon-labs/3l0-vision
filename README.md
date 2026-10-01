# 3L0 Vision

> Tornando o mundo físico computável.

3L0 Vision is the product layer built around the Operational Resolution Core (ORC).

It turns the operational work of identifying, understanding and registering things in the physical world into a continuous resolution-assisted workflow.

The product observes the world through cameras, OCR, identifiers, documents, enterprise systems and human confirmation; resolves heterogeneous signals into operational identities and states; and exposes only the decisions and exceptions that require action.

## Core flow

MUNDO FÍSICO → OBSERVAÇÃO → INTERPRETAÇÃO → RESOLUÇÃO → IDENTIDADE → ESTADO OPERACIONAL → AÇÃO

## Product principle

**The operator should work on exceptions, not retype the entire world.**

3L0 Vision is not an ERP replacement and does not make AI output a fact automatically. Intelligence interprets. Rules determine. Evidence records.

## Relationship with ORC

3L0 Vision is the product experience.

ORC is the independent research and semantic infrastructure behind it.

- ORC asks: **How can heterogeneous assertions, evidence, entities and context be resolved into a traceable operational representation?**
- 3L0 Vision asks: **How can a person use that capability in real operations?**

Repository:
- ORC: https://github.com/symbeon-labs/operational-resolution-core
- 3L0 Vision: https://github.com/symbeon-labs/3l0-vision

## Initial product

The first product surface is vision-assisted operational identification:

- camera capture
- barcode / QR recognition
- OCR
- visual observations
- deterministic matching
- evidence and provenance
- human confirmation when uncertainty remains
- product/entity creation
- operational state
- ERP synchronization

The initial workflow is deliberately markerless-capable. QR/NFC/labels are accelerators, not prerequisites.

## Resolution pipeline

camera / document / identifier / ERP / human
→ observations and assertions
→ ORC
→ resolution
→ operational entity
→ action or exception

## Brand

- [Brand system](docs/brand.md)
- [Brand board](docs/brand-board.md)
- [Application symbol](assets/3l0-vision-symbol.svg)

## UX

The operator does not fill a long product-registration form.

The system:

1. captures
2. extracts
3. matches
4. resolves
5. asks only what is missing
6. records the resulting state

Example:

Product X — 500 ml

✓ Identity
✓ EAN
✓ Description
✓ Unit

⚠ NCM requires confirmation
⚠ Sale price not defined

## Design direction

The visual language is based on:

- near-black environment
- high-contrast interface
- restrained cyan / green / amber / red state language
- clean sans-serif operator UI
- technical typography for identifiers and diagnostics
- capture → resolution → completion as the central visual metaphor

The 3L0 symbol is the product identity. The open/broken circular form represents connection, resolution and completion.

## Current status

Research validated enough to begin a product repository, but the product itself remains experimental.

This repository should favor:
- small experiments
- measurable workflows
- real operational cases
- explicit uncertainty
- provenance
- reversible decisions
- integration over duplication

It should not prematurely claim:
- universal product recognition
- autonomous truth determination
- perfect OCR
- zero human intervention
- replacement of ERP systems

## Roadmap

### Phase 0 — Foundation
- product architecture
- design system
- core application shell
- capture flow
- ORC integration boundary

### Phase 1 — Vertical Slice (in progress)
- real camera/barcode input
- OCR as a secondary observation path
- observation normalization with evidence/context
- deterministic matching against persistent data
- intended ORC integration boundary
- resolved/attention/conflict/uncertain UI
- confirmation only when required
- persistent entity and evidence/history

### Phase 2 — Operational MVP
- product entity lifecycle
- evidence/history
- exception handling
- batch operations
- ERP integration prototype

### Phase 3 — Field Pilot
- real establishment workflow
- operator telemetry
- resolution metrics
- failure analysis
- hardware/label experiments

### Phase 4 — Platform
- integrations
- API
- pluggable vision providers
- field workflows
- additional operational domains

## Status

**Phase 0 — Foundation: complete. Phase 1 — Vertical Slice: in progress.**

The repository is intentionally not presenting the Phase 0 demo as a production vision system. The current shell proves the semantic loop; Phase 1 replaces simulated input and the local deterministic adapter with real physical-world capture and the intended ORC boundary.

## Phase 0 foundation

The initial foundation now includes the ORC integration contract, design-token specification and application architecture target.

- [ORC Integration Contract](docs/orc-integration-contract.md)
- [Design Tokens](docs/design-tokens.md)
- [Application Foundation](docs/application-foundation.md)

## Strategic organization

- [Project Map](docs/project-map.md)
- [Strategic Workstreams](docs/fronts.md)
- [Strategic Roadmap](docs/roadmap.md)
- [Use Cases](docs/use-cases.md)
- [Model Strategy](docs/model-strategy.md)

The product is developed through evidence gates and coordinated workstreams rather than an unrestricted feature backlog.


## Estado atual

**Fase 0 — Fundação: concluída.**

**Fase 1 — Vertical Slice: em andamento.**

O próximo passo não é adicionar telas ou gamificação. É fazer um produto físico real atravessar o caminho captura → observação → normalização → ORC → resolução → persistência → reutilização.

O repositório já possui a fundação executável da Fase 1:

`captura → observação → normalização → catálogo → ORC-shaped resolution → estado`

O próximo marco não é iniciar a Fase 1, mas fechar seu vertical slice: substituir o resolver local pelo boundary ORC versionado, completar exceção/confirmação/histórico e validar o fluxo em dispositivo físico.


## Project Memory

- [3L0 Project Skill](skills/3l0-vision/SKILL.md) — regras para continuidade e desenvolvimento.
- [Field Journal](docs/field-journal.md) — histórico, decisões, estado atual e próximos marcos.
- [Phase 1 Gate](docs/roadmap.md) — ordem de implementação, guardrails e critério de saída.
