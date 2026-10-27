# UX copy and operational states

This document is the shared language reference for the 3L0 Vision interface. Public Portal copy should describe the same capabilities and limits.

## Product language

- **Conferência de mercadorias**: user-facing task and initial product context.
- **Espaço de trabalho**: user-facing term for a workspace. Keep `workspace` in code and API contracts.
- **Código identificado**: a code was read from camera or entered manually. This does not by itself confirm product identity.
- **Correspondência encontrada**: available records match the configured resolution criteria.
- **Informações insuficientes**: the available evidence does not support a confident match.
- **Informações em conflito**: available values disagree under the applied criteria.
- **Falha técnica**: processing did not produce a resolution result. Do not present this as a product mismatch.

## Result provenance

The interface must distinguish these facts:
1. **Observed** — read from a camera, code, document, or user input.
2. **Interpreted** — extracted or normalized from an observation.
3. **Matched** — related to a candidate according to the configured rules.
4. **Confirmed** — explicitly reviewed by an authorized person or a validated deterministic rule, as documented.
5. **Persisted** — durably saved in the configured storage.
6. **Integrated** — successfully delivered to an external system and acknowledged.

Never imply that one state automatically means the next. A local demo match is not persistence, independent verification, fiscal authenticity, or proof of physical identity.

## UI rules

- Present a plain-language label before any technical state code.
- Pair state color with text and/or an icon; color alone is insufficient.
- Keep the active workspace visible in the flow.
- Provide explicit empty, loading, retry, and error states.
- Announce processing and result changes to assistive technology.
- Preserve visible keyboard focus and respect reduced-motion preferences.
- Avoid raw provider errors in user-facing messages; log technical detail for diagnostics.
- Do not claim measured time savings, production integrations, or accuracy without evidence.

## Validation checklist

- Test sign-in, sign-up, password recovery, and session expiry.
- Test no workspace, workspace load failure, and changing active workspace.
- Test a match, insufficient evidence, conflict, and technical failure.
- Confirm that demo results are described as local and non-persistent.
- Check mobile/desktop layouts, keyboard navigation, focus, and contrast.
