# Celisira Delivery & Review Cadence

## Summary

- Codex acts as PM + reviewer throughout the migration.
- Work ships in waves, not all 10 agents at once.
- Progress is counted only from accepted deliverables.
- The only shipping target is the Hydrogen app in this repo.
- The Figma Make bundle under `C E L I S I R A V2C/` is reference-only.

## Delivery Waves

| Wave | Estimated Duration | Agents | Goal | Exit Criteria |
| --- | ---: | --- | --- | --- |
| Wave 0 | Day 1-2 | `Mai`, `Khoa` | Theme/tokens/assets, data contracts/adapters | Shared UI foundation and Shopify-facing adapter layer are ready |
| Wave 1 | Day 3-5 | `An`, `Linh`, `Binh` | Global shell, homepage, collection experience | Shell and key browse surfaces match Celisira direction |
| Wave 2 | Day 6-8 | `Chi`, `Dung` | PDP and cart experience | Add-to-cart, cart, and checkout redirect work end-to-end |
| Wave 3 | Day 9-10 | `Ha`, `Ngoc` | Account shell, search/pages/blogs/policies | No mock account data ships; all live shell links resolve cleanly |
| Wave 4 | Day 11-12 | `Phuc` + PM review | QA, hardening, responsive, a11y, perf | Build, typecheck, lint pass with no ship-blocking P1/P2 issues |

## Working Order

1. Start `Mai` and `Khoa`.
2. Start `An` only after `Mai` is accepted.
3. Start `Linh` only after both `Mai` and `Khoa` are accepted.
4. Start `Binh`, `Chi`, `Dung`, `Ha`, and `Ngoc` only after `Khoa` is accepted and the relevant upstream contracts are stable.
5. Start `Phuc` only after first-pass acceptance of `An`, `Binh`, `Chi`, `Dung`, and `Ha`.

## Review Workflow

When an agent reports completion, review in this order:

1. Bugs, regressions, and hidden risks
2. SSR and hydration safety
3. Hydrogen and Shopify fit
4. Visual parity with Celisira reference
5. Test and verification gaps

Possible outcomes:

- `Accepted`
- `Needs Fix`

Every review response must include:

- current wave
- accepted agents
- in review
- need fixes
- next agents to start
- overall progress percent

## Acceptance Criteria

- No mock product, order, cart, or account data used as shipping truth
- No browser-only logic in render paths that would break SSR
- No `figma:asset`, dead links, or `#` placeholders in live shell destinations
- Cart and checkout follow Shopify flow
- UI matches Celisira reference closely in layout, typography, color, motion, and responsive behavior
- Build, typecheck, and lint pass, or remaining issues are explicitly documented as non-blocking

## Assumptions

- Wishlist stays deferred for wave 1
- Checkout stays on Shopify redirect flow
- Existing dirty worktree changes may belong to ongoing migration work and must not be reverted without explicit direction
