# 3L0 Vision — Brand Board

## Approved direction

The board defines visual direction, not functional maturity. Any screen, state or mock shown on the board must be labeled as conceptual when it does not correspond to an implemented and verified workflow.

For cross-surface alignment with the institutional Portal, see [Brand Evolution v1](./brand-evolution-v1.md).

The current approved visual direction is a dark, high-contrast operational interface built around the 3L0 segmented zero and the resolution symbol.

## Board components

1. Primary wordmark — `3L0 Vision`.
2. Application symbol — scan frame + resolution ring + confirmation mark + completion arc.
3. Logo variations — primary, monochrome and reduced.
4. Segmented zero — principal graphic device.
5. Typography — Inter + JetBrains Mono.
6. State palette — cyan, green, amber and red over near-black.
7. System icons — capture, resolve, products, history, operate and profile.
8. Product states — capture, processing, resolved, attention and conflict.

## Visual grammar

`3L0` identifies the product.
`0` represents an open operational loop: information enters, is related and resolved, and becomes actionable.

The symbol should communicate state rather than decoration:

- cyan: information entering the system;
- green: resolution supported/confirmed;
- amber: information requiring attention;
- red: unresolved conflict;
- near-black: operational environment.

## Screen language

Product screens should make the resolution process visible without exposing unnecessary implementation detail.

Recommended state progression:

CAPTURAR → PROCESSAR → CONFERIR → RESOLVER → OPERAR

Failure/uncertainty should remain visible rather than being disguised as a successful result.

## Portal and Vision relationship

- Portal compositions may be more editorial and explanatory.
- Vision screens must prioritize the current task, evidence, certainty, discrepancy and permitted next action.
- Both surfaces share logo rules, typography and semantic state colors, but must not become identical layouts.
- The visual system must not imply that planned OCR, fiscal validation, connectors, persistence or production guarantees are already available.

## Implementation rule

The visual board is the source of visual direction. `docs/ux.md` remains the source of interaction behavior, `docs/architecture.md` remains the source of product boundaries, and `docs/brand.md` remains the source of identity rules.

These documents are complementary and should not duplicate the ORC semantic specification.

## Dark Signal — expressão concreta da direção

A direção implementada inicialmente na PR #40 deve ser lida como uma linguagem de interface operacional, não apenas como “tema escuro”:

- **Ambiente:** `#080a0c`, quase preto com leve nuance fria.
- **Profundidade:** superfícies `#111519` e `#171d22`, com vidro/translucidez apenas quando não prejudicar a leitura.
- **Texto:** `#f4f7f8` para conteúdo principal e `#a0adb2` para suporte; texto secundário não pode desaparecer visualmente.
- **Estrutura:** bordas finas `#2b363b`, usadas para agrupar etapas e separar evidência sem excesso de caixas.
- **Sinal:** ciano `#78dce1` para observação, verde `#a9e6b5` para resolução sustentada, âmbar `#f2c879` para atenção e vermelho `#ff777f` para conflito.
- **Tipografia:** Inter para interface; JetBrains Mono para códigos e metadados técnicos.
- **Foco:** anel visível derivado de ciano; nunca remover o foco nativo sem alternativa equivalente.
- **Composição:** densidade operacional controlada, hierarquia clara, brilho discreto e sem ornamento que concorra com evidência ou ação.

A implementação não deve acumular duas paletas concorrentes nem redefinir tokens semânticos em uma camada CSS tardia. Ver [Design Tokens](./design-tokens.md) para valores de referência.

**Status de fidelidade:** esta seção documenta a direção da PR #40; não declara que a PR foi integrada à `main`, nem que todas as telas já foram validadas visualmente.
