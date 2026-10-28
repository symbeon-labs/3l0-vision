# 3L0 Vision — Design Tokens v1.0

**Direção visual:** Dark Signal. **Estado:** especificação de design; a presença dos tokens no documento não significa que a implementação esteja integrada ou validada na `main`.

The tokens define the operational visual language.

## Color roles

- `bg.base` — near-black application environment
- `fg.primary` — primary readable text
- `fg.secondary` — secondary text
- `state.capture` — cyan
- `state.resolved` — green
- `state.attention` — amber
- `state.conflict` — red
- `surface.raised` — elevated operational surface
- `border.subtle` — structural divider

## Typography

Primary: Inter. Technical: JetBrains Mono.

## Spacing

4 / 8 / 12 / 16 / 24 / 32 / 48 px.

## Radius

sm for controls, md for cards/inputs, lg for primary interactive surfaces.

## Motion

Motion communicates capture, processing, resolution and conflict. Avoid decorative animation.

## State semantics

CYAN = information entering/being observed. GREEN = resolution supported/confirmed. AMBER = attention required. RED = conflict/unresolved. BLACK = operational environment.

A color must correspond to an actual state.

## Implementation rule

Token names are stable product semantics. Concrete CSS/React/native values may evolve without changing token meaning.

## Cross-surface application

The semantic token names above are the contract. The Portal and Vision may use different concrete CSS values when their layout needs differ, but must preserve the meaning of each role.

| Semantic role | Meaning | Use rule |
|---|---|---|
| `bg.base` | Operational environment | Near-black foundation; avoid pure-black overload where it harms legibility |
| `fg.primary` | Main readable content | High contrast for headings, values and primary instructions |
| `fg.secondary` | Supporting content | Must remain readable; do not use low contrast as a substitute for hierarchy |
| `state.capture` | Observation or incoming information | Cyan; does not mean verified |
| `state.resolved` | Supported/confirmed resolution | Green only when the relevant workflow state warrants it |
| `state.attention` | Missing information or review required | Amber; must not be confused with failure or conflict |
| `state.conflict` | Unresolved contradiction | Red; explain the conflict in text, not color alone |
| `surface.raised` | Grouped content or active work area | Use restrained elevation and clear boundaries |
| `border.subtle` | Structural separation | Thin dividers that preserve grouping without visual noise |

## Shared typography and spacing

- Inter: navigation, body, headings, labels, buttons and readable operational content.
- JetBrains Mono: identifiers, codes, technical metadata and diagnostic values; avoid long body paragraphs in monospace.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 px.
- Use a consistent hierarchy and generous enough touch targets on mobile; do not compress essential actions merely to fit a desktop layout.

## Accessibility and truthful state

- Every state must have a text label or clear contextual description; color alone is insufficient.
- Keyboard focus must be visible and not obscured.
- Essential actions must not depend on hover.
- Respect `prefers-reduced-motion`.
- Decorative glow, gradients or animation must not imply confidence, completion or security.
- Synthetic examples and conceptual flows must be labeled at the point of use.

See [`docs/brand-evolution-v1.md`](./brand-evolution-v1.md) for the cross-surface application rules.


## Dark Signal — referência concreta da PR #40

A PR #40 definiu a primeira fatia de consolidação visual: um único bloco canônico `:root`, uma única fonte de verdade para a paleta e a importação tipográfica no topo da folha. Estes valores registram a direção proposta naquela implementação; antes de tratar qualquer valor como produção, conferir a folha efetiva na branch/commit candidato.

| Token CSS | Valor de referência | Função |
|---|---|---|
| `--bg` | `#080a0c` | Fundo principal |
| `--surface` | `#111519` | Superfície base de painéis |
| `--surface-2` | `#171d22` | Superfície elevada/alternativa |
| `--surface-glass` | `rgb(17 21 25 / 92%)` | Camada translúcida, uso restrito |
| `--text` | `#f4f7f8` | Texto principal |
| `--muted` | `#a0adb2` | Texto secundário |
| `--line` | `#2b363b` | Divisores e bordas estruturais |
| `--cyan` | `#78dce1` | Observação/captura |
| `--green` | `#a9e6b5` | Sinal positivo/resolução sustentada |
| `--amber` | `#f2c879` | Atenção/revisão necessária |
| `--red` | `#ff777f` | Conflito não resolvido |
| `--blue` | `#9ab4ff` | Acento auxiliar; não substitui estados semânticos |
| `--signal` | `#a9e6b5` | Sinal de ação primária da direção Dark Signal |
| `--focus-ring` | `0 0 0 3px rgb(120 220 225 / 24%)` | Indicador de foco |

### Regra de implementação

- Manter **um único bloco `:root` canônico** por folha de estilos e evitar redefinições concorrentes dos mesmos tokens no fim do arquivo.
- Manter o `@import` de Inter e JetBrains Mono no topo da folha, antes das regras CSS; carregar apenas pesos necessários.
- `color-scheme: dark` acompanha a direção escura da aplicação, mas não substitui teste de contraste nem estilos explícitos de controles nativos.
- O token `--signal` não deve ser usado para pintar todo resultado como sucesso. Estado visual precisa refletir o estado de domínio.
- Valores concretos podem evoluir mediante revisão visual; preservar o significado semântico dos tokens.
- Não declarar conformidade de contraste por inspeção dos hexadecimais apenas: verificar pares de texto/superfície e foco no produto renderizado.

## Escopo que a PR #40 não conclui

A consolidação dos tokens é uma base, não a conclusão do redesign. Aplicação consistente aos fluxos, revisão dos breakpoints 320/375/768/1024/1440 px, acessibilidade, testes do SHA candidato e inspeção visual em navegador continuam sendo gates separados. O limite diário do preview Vercel não equivale a falha de código nem a aprovação visual.
