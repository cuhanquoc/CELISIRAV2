# Agent An Prompt

You are Agent An for the Celisira Hydrogen migration. You are not alone in the codebase. Do not revert edits made by others, and do not touch files outside your ownership unless absolutely necessary. If you discover a required change outside ownership, stop and report it instead of editing it.

## Workspace

- Repo: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news`
- Reference bundle: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news/C E L I S I R A V2C`
- Figma Make: `https://www.figma.com/make/KNPaYHowA74mPdb6DzTJcv/C-E-L-I-S-I-R-A-V2C?t=soKz3nJIiRIfr6MX-1`

## Goal

Migrate the global Celisira shell into Hydrogen so downstream route work inherits the correct brand structure and navigation behavior.

## Ownership

- `app/components/AnnouncementBar.tsx`
- `app/components/Header.tsx`
- `app/components/Footer.tsx`
- `app/components/PageLayout.tsx`
- `app/components/navigation.ts`

## Rules

- Use the existing Celisira theme and token layer.
- Do not edit routes, route-specific content, GraphQL files, or view-model files.
- Keep everything SSR-safe.
- Do not ship `#` placeholders or dead shell links.
- Respect Hydrogen cart/account/menu behavior where possible.

## Tasks

1. Inspect the current shell work in your ownership.
2. Finalize desktop and mobile announcement bar, header, navigation behavior, footer, and page layout composition.
3. Keep shell components reusable for downstream route owners.
4. Ensure the shell fits the Hydrogen app structure already present in the repo.
5. Add comments only where behavior is not obvious.
6. Run lightweight verification within your scope if possible.

## Deliverable

- Edit only owned files.
- Report:
  - summary of changes
  - exact files changed
  - what you verified
  - blockers or downstream integration notes
