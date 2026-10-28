# PR reconciliation before the 3L0 Vision visual implementation

**Status:** consolidation gate; visual implementation is intentionally frozen until the product baseline is reconciled.

## Decision

PR #40 must not merge visual CSS changes into an unstable functional baseline. Its current visual CSS experiment is reverted to the current `main` stylesheet in this branch; this keeps the handoff, audit, and reconciliation record while deferring design-token and component implementation. This is a sequencing decision, not a rejection of the Dark Signal direction.

## Open PR inventory and disposition

| PR | Scope | Current signal (2026-10-28) | Decision before visual implementation |
|---|---|---|---|
| [#3](https://github.com/symbeon-labs/3l0-vision/pull/3) | Agent-capability research reference | Merged; documentation is part of the current baseline | No longer a blocker. Preserve the canonical document and verify links only if its content changes. |
| [#5](https://github.com/symbeon-labs/3l0-vision/pull/5) | Experimental API / Gate 1 | Closed as superseded; old Node server and synthetic in-memory API are not the current architecture | Do not port the branch in bulk. Extract a specific missing contract only if current Vercel routes demonstrably lack it. |
| [#10](https://github.com/symbeon-labs/3l0-vision/pull/10) | Contextual-personalization architecture | Merged; documentation-only | No longer a merge blocker. Treat as proposal/reference, not proof that personalization is implemented. |
| [#14](https://github.com/symbeon-labs/3l0-vision/pull/14), [#15](https://github.com/symbeon-labs/3l0-vision/pull/15) | Inventory contracts and repository | Merged; repository and tests are present on main | Foundation exists, but it is local-storage-compatible domain code, not server-authorized multi-tenant inventory. |
| [#16](https://github.com/symbeon-labs/3l0-vision/pull/16) | Inventory operational UI | Open Draft; based on `feat/inventory-repository-balances`, not current `main`; fixed `local-demo` and browser localStorage | Do not merge as-is. Audit found mixed-unit total, no product-review gate, no negative-stock guard, and no server authorization/audit. Rebuild narrowly on current main only if inventory is in scope. |
| [#17](https://github.com/symbeon-labs/3l0-vision/pull/17) | Workspace onboarding / Case 01 activation | Merged; README + documentation | No longer a merge blocker. Verify wording only if implementation boundaries change. |
| [#35](https://github.com/symbeon-labs/3l0-vision/pull/35) | Vertical-slice acceptance contract | Closed as superseded by #45 after base advanced | Use #45 for the current-main version of the acceptance contract. |
| [#36](https://github.com/symbeon-labs/3l0-vision/pull/36) | Camera capture + local fiscal XML UI | Closed as superseded after direct comparison; functionality already present on main | Do not reopen wholesale. Create a narrow current-main PR only for a demonstrated missing behavior. No OCR/upload/fiscal-authenticity claims. |
| [#41](https://github.com/symbeon-labs/3l0-vision/pull/41) | Case 01 evidence execution plan | Closed as superseded by #44 | Use merged #44 as the canonical plan. |
| [#40](https://github.com/symbeon-labs/3l0-vision/pull/40) | Visual system + handoff/audit | Open Draft; current visual implementation is intentionally frozen | Keep this PR documentation/gating only. Reconcile functional baseline first, then make a narrow visual implementation PR. |
| [#43](https://github.com/symbeon-labs/3l0-vision/pull/43) | Production checkpoint / camera-OCR gate | Merged; roadmap records deployment/test checkpoint and explicitly leaves real camera/OCR unverified | Keep the boundary explicit; deploy readiness and synthetic tests do not validate real camera/OCR. |

| [#44](https://github.com/symbeon-labs/3l0-vision/pull/44) | Case 01 evidence execution plan | Merged; current-main documentation-only plan, CI passed | Canonical execution plan. Keep implementation status bounded to verified behavior. |
| [#45](https://github.com/symbeon-labs/3l0-vision/pull/45) | Vertical-slice acceptance contract | Open Draft; rebased on current main, CI pending | Canonical candidate for acceptance gates; do not merge until current-SHA CI passes and review is complete. |

## Consolidation order

1. **Freeze visual code:** do not merge or expand the Dark Signal CSS while the baseline is stale. Keep the handoff and audit as preparation only.
2. **Establish current main as the only functional baseline:** inspect current `app/main.js`, `app/styles.css`, auth/workspace flow, package scripts, tests, and deploy workflow.
3. **Resolve stale branches by evidence:** classify each PR as (a) still needed and re-created on current main, (b) already represented on main, or (c) obsolete and closed. Do not merge an old branch just because GitHub reports it as mergeable.
4. **Reconcile functional Case 01:** port the useful parts of #36 onto current main in small commits; resolve overlapping UI edits against the current app, not by blindly accepting either side.
5. **Reconcile API and architecture contracts:** decide whether #5 remains needed based on current server/API code; reconcile #10, #17, and #35 with actual implementation and each other; check #3 for continuing relevance.
6. **Run baseline gates:** `npm test`, `npm run build`, relevant E2E tests, and checks against the exact candidate SHA. Separately test camera permission/fallback, image capture, valid/invalid/hostile XML, workspace authorization/history, and narrow/mobile layouts.
7. **Reopen visual implementation as a focused PR:** one canonical token layer; one valid font import at the top; shared semantic states; no duplicated cascade; accessible status/error/form patterns; responsive checks at 320, 375, 768, 1024, and 1440 px.
8. **Visual release gate:** inspect the actual preview in a browser and record evidence. CI success alone is not visual or device validation. If preview access/build quota blocks inspection, report that gate as pending.

## Merge policy

- No PR is merged by this document.
- Keep #40 Draft until the functional baseline and upstream contracts are reconciled.
- Never treat an old base SHA, a non-conflicting diff, or green CI from a previous commit as validation of the current candidate.
- Keep product capabilities bounded to what is implemented and tested; local XML parsing is not fiscal validation, photo capture is not OCR, and a demo catalog is not a production inventory.


## Atualização após inspeção direta da main (2026-10-28)

A inspeção posterior confirmou que a `main` atual **já contém** o parser fiscal, o catálogo de fontes, o comparador e a integração de interface de captura de imagem/XML. Portanto, a PR #36 não deve ser tratada como a única origem da funcionalidade nem mesclada em bloco. Os três módulos de evidência e seus testes já existem na main com os mesmos blobs que a antiga branch #36. As versões de `app/main.js`, `app/capture/browser-capture.js` e `app/styles.css` diferem, então comparar e portar apenas correções ainda ausentes, se houver, após testes.

A inspeção mais recente da `main` encontrou um único `@import` no topo, mas dois blocos `:root` concorrentes que redefinem a paleta. Na branch da PR #40, a primeira fatia visual já consolidou os tokens em um único `:root`, preservou a importação de fontes no topo e removeu o bloco concorrente. Isso corrige a cascata de tokens, mas ainda exige CI no SHA candidato e revisão visual real.

O workflow `.github/workflows/test.yml` executa `npm test` e `npm run build` em push/PR. O check de Vercel observado para o commit-base da nova branch falha com link de `build-rate-limit`, que não prova falha de código, mas bloqueia a validação de preview. O resultado de CI do SHA candidato mais recente ainda precisa ser consultado; não inferir sucesso a partir de commits anteriores.

### Ajuste na sequência

1. Não copiar novamente os módulos de evidência: já estão na main.
2. Auditar diferenças de #36 apenas nos três arquivos divergentes e nos comportamentos que a main ainda não cubra.
3. Executar/verificar CI do SHA atual; registrar separadamente testes automatizados, preview e teste real da câmera.
4. Consolidar tokens e corrigir a cascata na PR visual focada; em seguida validar o SHA atual e revisar o preview quando o limite do Vercel permitir.
