# Haewon Archive — Project Status

Updated: 2026-11-23 (KST)

## Current stage
- **Stage:** automated public-source discovery + archive presentation refinement.
- **Deployment:** GitHub Pages static site.
- **Core constraints:** free-first, no paid API/AI as required dependency, link-first and respectful source handling.
- **Evidence status:** automatic collection/discovery is operational; relevance is still candidate-level until human review.

## Recursive-improvement imitation (not model self-training)
- Algorithm: `bounded-recursive-imitation`, version **1.2.0**.
- Current adaptation: daily KST search-pack rotation and yield reporting.
- Evidence: candidate counts per active query and human-reviewed labels (when present).
- Automatic query promotion: disabled.
- Destructive filtering: disabled.
- Strategy changes are not promoted solely from candidate volume; minimum review threshold is a reporting floor, not proof of statistical significance.

## This update
- Removed duplicate “원문 열기” action from news cards; the title remains the outbound link.
- Added two heuristic news categories: **행사·활동** and **광고·화보**.
- Existing categories remain: 뉴스, 영상, 공식, 인터뷰·방송, 무대·공연.
- Classification is keyword-based and may overlap semantically; this is a first-pass filter, not editorial verification.

## Commit separation
- `ui:` — user-facing interface or usability changes.
- `feat:` — new capability or behavior.
- `fix:` — correctness or bug fix.
- `test:` — tests and safeguards.
- `data:` — automated data refresh only (not manual code improvement).
- `docs:` — status, logs, plans, or documentation.
- `refactor:` — internal structure without intended behavior change.
- `perf:` — performance improvements.

## Latest verified code update
- Commit: `a07d3ec` — `ui: remove duplicate news links and expand categories`
- CI run: [#282](https://github.com/UForPel/haewon-archive/actions/runs/45178641015) — in progress at status-board creation.
- Verification performed after write: fetched file from GitHub; confirmed duplicate action markup absent, new categories present, and title link retained.

## Next improvement queue
1. Wait for CI/deploy #282 and record the result; do not claim success before completion.
2. Add automated tests for category classification and news-card link structure.
3. Revisit category priority/overlap so a news item can be tagged consistently without brittle single-category precedence.
4. Improve the visible dashboard with honest counters: collection run, last successful deploy, candidate/review counts, and algorithm version.
5. Keep a human review workflow for relevance; avoid automatic promotion until evidence is adequate.

## Project log entry
2026-11-23 — UI cleanup and classification expansion. Duplicate outbound link removed; title remains clickable. Added event/activity and brand/photo category heuristics. GitHub source was read before editing, file write completed, and source re-fetched for verification. CI/deploy result pending.

## Follow-up development — 2026-11-23
- Extracted news classification into reusable `classifyDiscoveryCategory()` in `js/discovery-kind.mjs`.
- UI now calls the shared classifier rather than maintaining inline category logic.
- Category priority is explicit: event/activity, brand/photo, official, interview/broadcast, performance, then news; video detection remains first.
- Added tests for event/brand tags, priority against broad official terms, and category fallback cases.
- Commits:
  - `1b01652b` feat: extract reusable news category classifier
  - `12e5205e` refactor: use shared news category classifier
  - `71cf3efb` test: cover discovery news categories
  - `0902025f` fix: import category classifier in discovery tests
- CI runs were queued/cancelled by successive commits; latest test commit run #286 was pending at log update. Verification is pending; do not mark tests passed until CI completes.
- Next: wait for latest run; if it fails, inspect logs and fix; then continue with dashboard metrics / classifier quality review.


## Classifier quality correction — 2026-11-23
- CI run #288 failed in the category test: the broad `official` rule matched `NMIXX stage performance` before the performance rule. This was a real test failure, not a runner issue.
- Narrowed official classification to explicit official/notice/update wording; removed generic `jyp` and `nmixx` name triggers so ordinary coverage is not mislabeled official.
- Added regression assertions for generic NMIXX coverage and generic JYP artist coverage to remain `news`.
- Fix commits: `ab67171a` (classifier), `0a9b4652` (regression tests). New CI verification is pending.
