# Agent An Fix Prompt 1

You are Agent An returning for a focused fix pass on the Celisira shell. You are not alone in the codebase. Do not revert edits made by others, and do not touch files outside your ownership unless absolutely necessary. If a required change falls outside ownership, stop and report it instead of editing it.

## Workspace

- Repo: `/Users/mi.sofool/Documents/c-e-l-i-s-i-r-a-news`

## Ownership

- `app/components/AnnouncementBar.tsx`
- `app/components/Footer.tsx`
- optionally `app/components/PageLayout.tsx` only if needed for these fixes

## Fixes Required

1. **Announcement accessibility**
   - In `AnnouncementBar`, the visible announcement text currently sits inside an `aria-hidden` track, which means assistive tech does not receive the actual message content.
   - Keep the animated visual treatment, but expose one readable announcement string to screen readers.
   - Do not create duplicate noisy announcements.

2. **Footer fallback safety**
   - `FooterMenu` has a fallback menu constant, but the current render path only mounts the menu when `footer?.menu` exists.
   - Make sure the legal/policy footer navigation still renders through the fallback menu when the footer query returns `null` or has no menu.

## Constraints

- Do not edit styles, routes, or GraphQL/view-model files.
- Keep everything SSR-safe.
- Preserve the Celisira shell direction already established.

## Deliverable

- Edit only the files needed for these two fixes.
- Report:
  - summary of changes
  - exact files changed
  - what you verified
  - whether the shell is now ready for acceptance
