# Loop5 Search & Discoverability Regression Checklist

## 1) Functional checks

- [x] Search without input shows homepage content (recent + category sections) (template structure checked by UI guard).
- [x] Empty query should not throw and should not match all tools as search mode.
- [x] Exact name match (e.g., `json formatter`) returns expected tool in first page.
- [x] Case-insensitive matching works (e.g., `JSON`, `json`) via query parity.
- [x] Multi-keyword query returns aggregate results (e.g., `text processor`).
- [x] `cat:developer` returns only tools in developer category.
- [x] `cat:dev` fallback partial match returns developer related tools.
- [x] `tag:security` returns tools with security tag.
- [x] `tag:*` returns all tools with tags.
- [x] `cat:*` returns all tools with categories.
- [x] Unknown `cat:unknown` should show "No match found" with clear-and-retry action (verified in smoke by `cat:nonexistent`).
- [x] Unknown `tag:unknown` should show "No match found" with clear-and-retry action.
- [x] Entering bare prefix `cat:` or `tag:` shows guidance message for normal search usage (covered by UI guard script).
- [x] Special symbols in keywords do not crash the app (e.g., `/`, `+`, `*`, spaces around colon).
- [x] Click a quick hint chip fills query immediately and updates results (UI structure present in `HomePage.vue`, covered by UI guard script).
- [x] Search clear button resets query and hides search mode (clear handler + binding present, covered by UI guard script).
- [x] Search result card shows `Matched in` reasons.

## 2) Metadata checks

- [x] All tool metadata files include required fields: id / name / path / description / category / keywords / component / icon.
- [x] `keywords` is non-empty for every tool.
- [x] `tags` is non-empty for every tool.
- [x] No duplicate tool IDs or duplicate paths.
- [x] No duplicate entries inside a single `keywords` list.
- [x] No duplicate entries inside a single `tags` list.

## 3) Performance / compatibility checks

- [ ] Search response is interactive and stable for full tool list.
- [x] Switching themes does not alter search result list order unexpectedly (checked via `qa:loop5:theme-order`).
- [x] Route deep-link fallback still works (existing pages and 404 flow) (covered by `qa:loop5:compat`).
- [x] `npm run check:tools` passes cleanly.
- [x] `npm run build` passes.

## 4) Completion criteria

- [x] Update loop record with results and timestamp.
- [ ] Attach or document manual execution output for checklist items.

## 5) Automated validation executed

- [x] `npm run check:tools` passes.
- [x] `npm run qa:loop5:search` passes.
- [x] `npm run qa:loop5:ui` passes.
- [x] `npm run qa:loop5:compat` passes.
- [x] `npm run qa:loop5:theme-order` passes.
- [x] `npm run qa:loop5` passes.
- [x] Search smoke assertions covered: `cat:*`, `cat:developer`, `cat:nonexistent`, `cat:dev`, `cat: developer`, `tag:*`, `tag:security`, `tag:does-not-exist-xyz`, `tag:`, `json`, `JSON`, `text processor`, `json, formatter`, `json formatter`, `base64 encode`, `+/?:*`, and `/`.
- [x] Match reasons are returned for normal text searches.
