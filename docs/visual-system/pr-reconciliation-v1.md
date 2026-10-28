# PR reconciliation before the 3L0 Vision visual implementation

**Status:** consolidation gate; visual implementation is intentionally frozen until the product baseline is reconciled.

## Decision

PR #40 must not merge visual CSS changes into an unstable functional baseline. Its current visual CSS experiment is reverted to the current `main` stylesheet in this branch; this keeps the handoff, audit, and reconciliation record while deferring design-token and component implementation. This is a sequencing decision, not a rejection of the Dark Signal direction.

## Open PR inventory and disposition

| PR | Scope | Current signal | Decision before visual implementation |
|---|---|---|---|
| [#3](https://github.com/symbeon-labs/3l0-vision/pull/3) | Agent-capability research reference | Documentation-only; branch is 92 commits behind current main | Review relevance and canonical link; merge only if still current, otherwise close as superseded after verifying the document is represented elsewhere. |
| [#5](https://github.com/symbeon-labs/3l0-vision/pull/5) | Experimental API / Gate 1 | Branch is 92 commits behind main; touches `app/main.js`, `app/styles.css`, package/config, server and tests; currently non-mergeable | Do not merge as-is. Extract only still-needed API/test work onto a fresh branch from current main, or close as superseded after checking current API state. |
| [#10](https://github.com/symbeon-labs/3l0-vision/pull/10) | Contextual-personalization architecture | Documentation-only; 4 commits ahead but 78 behind main | Compare its canonical architecture contract against current docs and keep one source of truth. Rebase/recreate the doc-only change or close if already incorporated. |
| [#17](https://github.com/symbeon-labs/3l0-vision/pull/17) | Workspace onboarding / Case 01 activation | README + documentation; 2 commits ahead but 78 behind main | Verify README change and reconcile onboarding contract with the current authenticated workspace flow. No runtime merge until checked against current auth and tenant boundaries. |
| [#35](https://github.com/symbeon-labs/3l0-vision/pull/35) | Vertical-slice acceptance contract | Documentation-only; 1 commit ahead but 36 behind main | Keep as the acceptance-gate reference if still accurate; refresh it against current main and the current implementation before declaring gates satisfied. |
| [#36](https://github.com/symbeon-labs/3l0-vision/pull/36) | Camera capture + local fiscal XML | Non-mergeable; overlaps `app/main.js` and `app/styles.css`; 9 commits ahead but 36 behind main | Highest-priority functional reconciliation before visual work. Rebase/recreate on current main, preserve authenticated workspace behavior, and run tests/build plus browser and hostile XML cases. No OCR/upload/fiscal authenticity claims. |
| [#40](https://github.com/symbeon-labs/3l0-vision/pull/40) | Visual system + handoff/audit | Visual experiment overlaps the stylesheet; branch is 16 commits behind main | Keep Draft. This branch is documentation/gating only until #36 and relevant upstream contracts are reconciled. Re-apply visual changes as a new, narrow implementation diff afterward. |

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
