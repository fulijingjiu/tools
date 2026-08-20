# Loop5 长任务（持续执行）

目标：把“可发现性体验”闭环到可验收标准，不只改 UI。

## 已完成
- [x] 首页搜索增强：新增 `cat:` 与 `tag:` 语法
- [x] 搜索支持清空按钮、快速提示（`cat:*` / `tag:*`）
- [x] 命中原因展示到卡片（ToolCard）
- [x] 搜索无结果兜底与重试入口
- [x] 本地构建验证通过（`npm run build`）

## 本轮继续项（长任务）
- [ ] 增加搜索体验回归清单（含 20+ 工具场景、边界输入、特殊符号）
- [ ] 增加“目录/标签元数据质量检查”（关键词、标签不为空、重复校验）
- [ ] 补齐公开文档：说明 Loop5 完成项、验收截图/示例与回归步骤
- [ ] 提交版本说明（v1.6）与里程碑记录
- [ ] 加入基础性能检查（>20 工具下的搜索响应目标 < 150ms）

## 执行日志
- 2026-07-30：已完成首页检索逻辑与命中原因显示，构建通过。


- 2026-07-30: check:tools script added and passes. (metadata must-have checks: name/path/description/category/keywords/tags present).


- 2026-07-30: Completed metadata quality gate enhancement and added regression checklist file.
  - Added duplicate id/path/warning detection in scripts/check-tools-metadata.mjs and kept passing via 
pm run check:tools.
  - Added loop5-regression-checklist.md with >=20+ items and edge cases.

- 2026-07-30: Added search smoke regression script and wired into Loop5 QA pipeline.
  - Added `scripts/loop5-search-smoke.mjs` for functional assertions (`cat:`, `tag:`, wildcard, multi-keyword) + basic performance check.
  - Added script entry `qa:loop5:search` and extended `qa:loop5` to include it.
  - Verified pass: `npm run qa:loop5:search`.
  - Verified pass: `npm run qa:loop5` (includes check:tools, search smoke, build).

- 2026-07-30: Continued Loop5 with stronger search regressions.
  - Fixed a bug in search smoke runner where normal-query `reasons` were dropped when sorting matches.
  - Added more assertions: unknown category, `tag:` baseline behavior, comma-separated tokenization, case-insensitive matching, and reasons visibility.
  - Re-ran `npm run qa:loop5` and it passes end-to-end (check:tools + qa:loop5:search + build).

- 2026-07-30: Further tightened search smoke coverage and reran full checks.
  - Added assertions for empty-query behavior and special-symbol token safety.
  - Added partial category match (`cat:dev`) and phrase-style match (`base64 encode`).
  - Confirmed `npm run qa:loop5` still passes.

- 2026-07-30: Added one more precision assertion to prevent false positives on exact-style terms.
  - Added `json formatter` query assertion in `scripts/loop5-search-smoke.mjs`.
  - Re-ran `npm run qa:loop5` and it continues to pass.

- 2026-07-30: Expanded smoke coverage for stability cases.
  - Added assertions for symbol-only query and spaced `cat: developer` handling.
  - Marked corresponding checklist items as covered by smoke checks in `loop5-regression-checklist.md`.
  - Re-ran `npm run qa:loop5` successfully.

- 2026-07-30: Added a lightweight UI-structure guard gate for Loop5.
  - Added `scripts/loop5-ui-guard.mjs` and script `qa:loop5:ui` to assert key search-UX source-level invariants (quick hint rendering, clear/search handlers, special-prefix guidance marker).
  - Extended `qa:loop5` to include `qa:loop5:ui`.
  - Re-ran `npm run qa:loop5`; all stages passed.

- 2026-07-30: Strengthened Loop5 guard and smoke checks for remaining UX checklist items.
  - Added assertions for `tag: security` and additional spacing/edge handling in search smoke.
  - Hardened `qa:loop5:ui` patterns for homepage default branch, recent/category sections, quick-hint click wiring, and no-result fallback action text.
  - Re-ran `npm run qa:loop5` and it passes.

- 2026-07-30: Completed and integrated Loop5 compatibility deep-link guard.
  - Added `scripts/loop5-compat-guard.mjs` checks for router catch-all history mode, `_spa_redirect` restore flow, 404 redirect script, Vue Router dependency, and GitHub Pages `.nojekyll` artifact guard.
  - Added script entry `qa:loop5:compat` and appended it into `qa:loop5`.
  - Re-ran `npm run qa:loop5` end-to-end; it now passes including `check:tools`, `qa:loop5:search`, `qa:loop5:ui`, `qa:loop5:compat`, and `build`.

- 2026-07-30: Added and validated theme-order stability automation.
  - Added `scripts/loop5-theme-order-guard.mjs` with a check that `filteredTools` ordering uses deterministic scoring+name fallback and does not reference `isDark`.
  - Added `qa:loop5:theme-order` and wired it into `qa:loop5` before `qa:loop5:compat`.
  - Re-ran `npm run qa:loop5` and confirmed all stages still pass.


