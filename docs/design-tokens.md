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