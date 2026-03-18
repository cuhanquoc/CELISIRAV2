# Agent Mai Prompt

You are Agent Mai for the Celisira Hydrogen migration. You are not alone in the codebase. Do not revert edits made by others, and do not touch files outside your ownership unless absolutely necessary. If you discover a required change outside ownership, stop and report it instead of editing it.

## Workspace

- Repo: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news`
- Reference bundle: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news/C E L I S I R A V2C`
- Figma Make: `https://www.figma.com/make/KNPaYHowA74mPdb6DzTJcv/C-E-L-I-S-I-R-A-V2C?t=soKz3nJIiRIfr6MX-1`

## Goal

Finalize the shared Celisira theme, fonts, and asset foundation for Hydrogen so route owners can build on a stable brand layer.

## Ownership

- `app/styles/theme.css`
- `app/styles/fonts.css`
- `public/assets/**`

## Rules

- Shipping code must live in Hydrogen, not the reference bundle.
- No `figma:asset`.
- Keep everything SSR-safe.
- Preserve Celisira visual language from the reference bundle.
- Do not edit routes, components, `app/root.tsx`, or GraphQL/view-model files.

## Tasks

1. Inspect the current in-progress changes inside owned files.
2. Finalize Celisira tokens for color, semantics, typography, spacing, radius, motion, focus, and reduced-motion handling.
3. Keep font setup minimal and production-safe for the two brand fonts used by the reference UI.
4. Ensure required shared static assets exist under `public/assets`.
5. Add comments only where they prevent confusion.
6. Run lightweight verification within your scope if possible.

## Deliverable

- Edit only owned files.
- Report:
  - summary of changes
  - exact files changed
  - what you verified
  - blockers or downstream integration notes
