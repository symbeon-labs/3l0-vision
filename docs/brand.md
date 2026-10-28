# 3L0 Vision — Brand System

## Identity

**Written:** 3L0 Vision  
**Verbal:** Elo Vision

`3L0` is intentionally written with the numeric zero. The distinction between written and spoken identity is part of the brand.

## Core statement

**Tornar o mundo físico computável.**

Supporting line:

**Conectando o mundo operacional.**

## Concept

3L0 Vision connects observations from the physical world with evidence, systems and operational decisions.

The visual system represents:

OBSERVAR
↓
RELACIONAR
↓
RESOLVER
↓
OPERAR

## Primary logo

The primary wordmark is **3L0 Vision**.

The zero is the central visual element. It is an open segmented ring representing connection, passage, convergence, resolution and completion.

## Symbol

The application symbol combines:
- scan-frame corners
- segmented resolution ring
- confirmation mark
- completion arc

The symbol is a functional state language, not decorative ornament.

## State language

| State | Visual role |
|---|---|
| Cyan | observation / capture |
| Green | resolution / confirmation |
| Amber | attention / intermediate |
| Red | conflict / unresolved |
| Near-black | environment / base |

The colors communicate system state.

## Typography

### Primary interface
**Inter** — navigation, labels, body copy, actions and operational information.

### Technical layer
**JetBrains Mono** — identifiers, codes, diagnostics and technical metadata.

## Interface direction

- near-black background
- high contrast
- thin structural dividers
- restrained glow
- compact spacing
- rounded but technical controls
- strong hierarchy
- minimal ornament

The multicolor gradient belongs primarily to the identity mark and state language.

## Logo variations

### Primary
Full-color segmented zero with white `3L`.

### Monochrome
White/near-white mark for contexts where color is unavailable.

### Reduced
Simplified `3L0` mark for small placements.

### Symbol
Resolution/capture icon for application surfaces.

## Product states

| State | Visual role |
|---|---|
| CAPTURANDO | Cyan |
| CONFERINDO | Cyan / Green |
| RESOLVENDO | Green |
| ATENÇÃO | Amber |
| CONFLITO | Red |
| RESOLVIDO | Green |

The visual state must correspond to an actual operational condition.

## Voice

Direct, operational, calm and precise.

Prefer: **Produto identificado.**

over: AI-hype or unsupported certainty.

Prefer: **Informações incompletas.**

over: anthropomorphic or vague failure language.

## Brand boundaries

3L0 Vision should not visually or verbally present itself as:
- a generic AI assistant;
- an e-commerce application;
- a conventional ERP;
- a futuristic consumer gadget;
- a gamified productivity app.

Its visual identity belongs to **operational resolution**.

## Public narrative and product maturity

The public-facing narrative follows the same principle as the interface: make the operational process understandable without implying certainty that the system has not earned.

### Institutional layer — Portal

The Portal explains the product thesis, operational context, possible use cases and current maturity. It is not the operational application and must not suggest that its illustrations execute real processing.

Preferred framing:
- **Core thesis:** make the physical world computable.
- **Operational expression:** connect observations, digital evidence and information systems.
- **Product value:** organize evidence, surface discrepancies and support a traceable next step.
- **Human role:** keep review and authorization visible wherever evidence is incomplete or conflicting.

### Application layer — Vision

The Vision is the experimental operational surface. It should prioritize task, evidence, state, uncertainty and next action over marketing copy. A link to the application does not guarantee access, availability or production readiness.

### Maturity language

Every public claim must fit one of these categories:
- **Available and verified:** directly accessible and checked in the referenced environment.
- **Experimental:** available for bounded testing, with limitations disclosed.
- **In development / validation:** being implemented or tested; not a production guarantee.
- **Planned:** an intended direction, not a current capability.

Do not present OCR coverage, fiscal validation, physical identity, ERP/WMS connectivity, shared persistence, security guarantees, performance gains or field results as proven without specific evidence for the relevant environment and workflow.

### Cross-surface consistency

- The Portal can explain the vision; the Vision must show the actual state of the workflow.
- Use the same terms for capture, evidence, comparison, discrepancy, review and resolution.
- Visual polish is not evidence of functional maturity.
- State colors must reflect actual state, not be used as promotional emphasis.
- Keep product claims calm, bounded and verifiable.

## Brand-board reference

The approved direction is a dark, structured identity board containing the primary wordmark, application symbol, logo variations, segmented-zero studies, typography, state palette, system icons, and capture/processing/resolved/attention/conflict screens.

The board is a visual reference for implementation; it does not replace the semantic product specifications.

## Dark Signal — referência visual aplicada

A direção visual concreta do Vision usa superfícies frias quase pretas, estrutura discreta e sinais cromáticos funcionais. A primeira consolidação proposta na PR #40 definiu os valores de referência: fundo `#080a0c`, superfícies `#111519`/`#171d22`, texto `#f4f7f8`, texto secundário `#a0adb2`, borda `#2b363b`, ciano `#78dce1`, verde `#a9e6b5`, âmbar `#f2c879` e vermelho `#ff777f`.

A regra estrutural é tão importante quanto a paleta: **um único bloco canônico de tokens por folha CSS** e a importação tipográfica no topo. Não permitir camadas concorrentes que redefinam cores e tornem o estado efetivo imprevisível. Ver [Design Tokens](./design-tokens.md) para valores e limites completos.

Esta é a direção registrada para implementação, não uma declaração de que a PR #40 foi mesclada ou de que a revisão visual final foi concluída.
