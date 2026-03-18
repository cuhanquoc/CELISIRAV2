# Agent Khoa Prompt

You are Agent Khoa for the Celisira Hydrogen migration. You are not alone in the codebase. Do not revert edits made by others, and do not touch files outside your ownership unless absolutely necessary. If you discover a required change outside ownership, stop and report it instead of editing it.

## Workspace

- Repo: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news`
- Reference bundle: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news/C E L I S I R A V2C`
- Figma Make: `https://www.figma.com/make/KNPaYHowA74mPdb6DzTJcv/C-E-L-I-S-I-R-A-V2C?t=soKz3nJIiRIfr6MX-1`

## Goal

Finalize the Shopify data contract and adapter layer so downstream UI work can consume clean Hydrogen-friendly view models instead of raw schema or mock data.

## Ownership

- `app/graphql/storefront/**`
- `app/graphql/customer-account/CelisiraAccountShellQuery.ts`
- `app/lib/view-models/**`

## Rules

- Do not edit routes, components, styles, or `app/root.tsx`.
- Do not add mock business logic.
- Favor small, composable view-model helpers for home, collection, product, cart, and account shell.
- Respect existing Hydrogen and Shopify conventions in the repo.

## Tasks

1. Inspect the current in-progress files in your ownership.
2. Finalize GraphQL query and fragment organization for Celisira home, collection, product, cart, and account shell needs.
3. Finalize shared view-model adapters and helper types that map Shopify data cleanly to UI needs.
4. Ensure exports and index files are coherent for route consumers.
5. Add comments only where a mapping decision is not obvious.
6. Run lightweight verification within your scope if possible.

## Deliverable

- Edit only owned files.
- Report:
  - summary of changes
  - exact files changed
  - what you verified
  - blockers or downstream integration notes
