# Celisira Progress Tracker

## Snapshot

- Current wave: `Wave 1`
- Accepted agents: `Mai`, `Khoa`, `An`, `Linh`, `Binh`, `Chi`, `Dung`, `Ha`
- In review: `None`
- Need fixes: `Ngoc`
- Active agents: `None`
- Next agents to start: `Phuc`
- Overall progress: `65%`

## Progress Scale

- `0%`: nothing accepted
- `15%`: Wave 0 accepted
- `40%`: Wave 1 accepted
- `65%`: Wave 2 accepted
- `85%`: Wave 3 accepted
- `100%`: Wave 4 accepted and no ship blockers remain

## Wave Log

### Wave 0

- Status: `Accepted`
- Agents: `Mai`, `Khoa`
- Goal: shared theme/assets foundation and Shopify-facing data contract layer
- Risks:
  - repo already contains in-progress dirty changes
  - storefront env is not linked yet
- Review notes:
  - `Mai` accepted on theme/token/assets scope
  - `Khoa` accepted on GraphQL contract and view-model adapter scope
  - residual non-blocker: font delivery may be revisited later for privacy/perf hardening if self-hosting becomes necessary

### Wave 1

- Status: `Accepted`
- Agents: `An`, `Linh`, `Binh`
- Goal: shell, home, collection
- Review notes:
  - `An` accepted after fix pass for announcement accessibility and footer fallback safety
  - `Linh` accepted after removing broken homepage newsletter POST behavior while preserving the section UI
  - `Binh` accepted after fixing collection-route money typing and safe filter parsing

### Wave 2

- Status: `Accepted`
- Agents: `Chi`, `Dung`
- Goal: PDP, cart
- Review notes:
  - `Chi` accepted on PDP migration scope
  - `Dung` accepted after fixing cart route loader/output typing to return `null` instead of leaking `undefined`

### Wave 3

- Status: `In progress`
- Agents: `Ha`, `Ngoc`
- Goal: account shell, search/pages/blogs/policies
- Review notes:
  - `Ha` accepted on account shell migration scope
  - `Ngoc` needs one fix pass for a search-route article typing regression

### Wave 4

- Status: `Pending`
- Agents: `Phuc`
- Goal: QA, hardening, parity, release readiness

## Agent Status Table

| Agent | Scope | Status | Notes |
| --- | --- | --- | --- |
| Mai | Theme, fonts, shared assets | Accepted | Shared token layer, fonts, and logo asset are ready for downstream work |
| Khoa | GraphQL contracts, view-models | Accepted | Shared query layer and view-model adapters are ready for downstream route owners |
| An | Global shell | Accepted | Fix pass landed: announcement is accessible and footer fallback menu now renders safely |
| Linh | Homepage | Accepted | Homepage migrated with safe newsletter UI and Shopify-backed sections |
| Binh | Collection experience | Accepted | Collection routes migrated to Shopify data with fixed typing on money/filter paths |
| Chi | Product detail page | Accepted | PDP migrated with Hydrogen variant/cart flow preserved |
| Dung | Cart experience | Accepted | Cart route typing fixed and Celisira cart flow remains on real Hydrogen cart primitives |
| Ha | Account shell | Accepted | Account routes reskinned without introducing fake customer/order data |
| Ngoc | Search/pages/blogs/policies | Needs Fix | Search articles path assumes `article.blog` exists but current search fragment/type does not provide it |
| Phuc | QA, hardening, perf | Waiting | Starts after core feature wave first-pass acceptance |
