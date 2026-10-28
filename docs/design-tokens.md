# 3L0 Vision — Design Tokens v0.1

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
