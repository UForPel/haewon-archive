# Project status

Last updated: 2026-11-20

## Governance documentation update (2026-11-19)
- Added protected `SECURITY_POLICY.md` and `COLLECTION_RULES.md`.
- Added initial `SEARCH_STRATEGY.md` and `CLASSIFICATION_RULES.md`, with tightly limited future mutable sections.
- Added `POLICY_CHANGELOG.md`.
- Added `schemas/archive-record.schema.json` and `schemas/run-log.schema.json` as contracts.
- Updated `GEMINI.md`, `PROJECT_MEMORY.md` and `AUTOMATION_PLAN.md` to enforce proposal-only Gemini behavior and trusted-workflow validation.
- `scripts/validate-data.mjs` now enforces `archive-record.schema.json` for every video and photo-link record. `run-log.schema.json` is now enforced for generated logs. The collector workflow emits a log on successful runs; failure-path logging remains incomplete.

## Schema validation implementation (2026-11-19)\n- Added `scripts/json-schema.mjs`, a dependency-free validator for the JSON Schema subset used by this repository (local `$ref`, `oneOf`, types, required/properties, additionalProperties, lengths, patterns, formats, enums/constants and array limits).\n- Added `tests/json-schema.test.mjs` for valid video/photo records and invalid types, URLs, dates, extra fields and incomplete objects.\n- Existing `validatePhotoEntries` checks remain in place, with schema validation layered on top.\n- Existing video IDs are also checked for duplicates.\n- Runtime test and Actions result must be confirmed from the latest run before marking this as tested.\n\n## Automation status — NOT IMPLEMENTED
- No external scheduler, trigger gateway, Gemini API integration, five-minute workflow, automated fan-video collector, automated photo crawler or policy updater exists.
- Existing scheduled workflow remains twice daily (UTC 23:17 and 11:17).
- Gemini must not modify app code, workflows, tests, schemas, validators, protected security/source policies or secrets.
- The current official YouTube Atom-feed collector is still the only automated collection source.

## Current inspected data and source state
- `data/videos.json`: 17 accumulated video records at inspection time.
- `data/photos.json`: empty array at inspection time.
- `data/sources.json`: NMIXX official YouTube public feed is enabled for automated collection; JYP official website and NMIXX Instagram are manual-link-only.
- Official YouTube feed returns up to 15 newest entries per fetch; it is not general fan-video search.

## Existing application implementation
- Mobile-first static archive UI
- Official NMIXX YouTube public Atom feed collector
- Video-ID deduplication and newest-first ordering
- Keyword-based Haewon relevance hint
- Unified search across video and photo-link metadata
- Type/source/date filters and expandable detail panels
- Photo source-link registration form with browser-local drafts
- JSON import/export for photo metadata
- HTTPS URL validation, duplicate URL checks, strict date checks and field-length validation
- GitHub Actions tests, collection, validation, data commit and Pages deployment

## Existing limitations
- Photo entries contain metadata and original post URLs only; original image binaries are not copied.
- Browser-local photo drafts are not shared across devices/visitors.
- No automated photo crawling exists.
- Automated video source is the official NMIXX YouTube public Atom feed only.
- Relevance is a keyword hint, not visual or human verification.
- The feed's 15-entry window cannot reconstruct content that disappears before collection.

## Verification notes
- A prior documentation push workflow run was observed successful: https://github.com/UForPel/haewon-archive/actions/runs/44413072002
- A later bot commit refreshed collection status only; this does not establish that the new governance documents or schemas are enforced at runtime.
- Re-check the latest Actions run after this documentation update. Do not assume the public UI is visually verified by a documentation-only commit.

## Next
1. Add validation for the future run-log schema when machine run logging is implemented.
2. Add a dry-run-only collection/run-log contract before integrating Gemini.
3. Verify Gemini API capabilities, current quotas and data terms from Google documentation.
4. Verify external scheduler and secure dispatch design before selecting or enabling it.


## Verified operational improvements (2026-11-20)
- Run #95 succeeded: tests, collection, archive validation, run-log generation/validation, commit and Pages deployment.
- Run #96 succeeded after changing workflow concurrency to `cancel-in-progress: false`; active runs are no longer cancelled by newer runs in the same concurrency group. Queue behavior still needs observation under repeated triggers.
- Latest collector observed 15 valid feed items, 0 additions, 17 total records. This is a successful no-new-item run, not a content-growth milestone.
- Operational run-log counts still need refinement; duplicate/rejected semantics and failure-path logging remain open.


## Discovery deduplication and category refinement — 2026-11-23
- Confirmed CI #292 and #293 success; #291/#288 failures were classifier regressions and their follow-up correction passed.
- Inspected the live discovery dataset (381 records): found 4 exact normalized-title duplicate groups (8 records) among the sampled full dataset scan. This is a conservative exact-title grouping signal, not fuzzy semantic deduplication.
- Added `groupDiscoveryDuplicates()`: normalize punctuation/case, merge only sufficiently long exact normalized titles, keep short/generic headlines separate, select a representative by relevance then recency, and expose duplicate/source counts.
- Category quality: prefer title matches before cleaned RSS description fallback to reduce publisher boilerplate overriding the article title.
- UI integration and regression tests are being committed separately. CI is required before declaring this fully verified.
- CI #294 failed during Pages deployment because the deploy step reported zero artifacts after upload had succeeded; logs show an artifact API/deployment lookup issue, not unit-test failure. #295 succeeded after syntax correction.
- Commits: `f3b5b791` (initial classifier/dedupe implementation, subsequently syntax-corrected in `c47041a6`); test/UI commits pending CI.


### Verification update — 2026-11-23
- Dedupe test commit: `3c5ad0ca`; UI grouping commit: `76b48d2c`.
- CI #297 on UI commit succeeded: unit tests, data collection/validation, artifact upload and Pages deployment all completed successfully.
- CI #296 on test-only commit had unit tests pass but Pages deployment failed after upload with the same transient artifact lookup error; #297 subsequently completed full success.
- Dedupe groups are now wired into article candidate rendering; count reflects grouped entries and cards indicate duplicate record/source counts. Exact normalized title grouping only; no fuzzy matching.


## 2026-11-23 follow-up: multi-label categories and dedupe precision
- Duplicate grouping keys: normalized exact long headline across sources; canonicalized URL for short/generic titles. URL cleanup strips tracking parameters, lowercases host, and removes fragment.
- Group representative: relevance score then publication/discovery recency; groups expose duplicate count and unique source count.
- Classification is now multi-label for matching title terms (event/brand/official/interview/performance). Description fallback only when the title yields no category, to reduce RSS boilerplate false positives. Videos remain a separate type.
- UI filters accept a selected category among multiple tags and cards show all category tags.
- CI #305 failed: extra closing brace in classifier module caused SyntaxError in discovery-search test import. Corrected in commit `f9922745`; CI #306 pending at time of update. Latest test assertion correction commit `210365c2` also pending verification.
- Commits: classifier `d129f87d`, test `43bce472`, UI `037b3c7f`, syntax fix `f9922745`, assertion fix `210365c2`.


## 2026-11-23 — Duplicate precision and metadata completeness
- Latest checks confirmed CI #307 and #308 completed successfully; #305 was a known syntax failure before correction and #306 succeeded after the brace fix.
- New dedupe behavior now prioritizes canonical URL identity over title, preventing URL-identical records with different headline text from splitting. Tracking parameters and fragments are removed; long normalized title grouping remains the fallback when URL is unavailable.
- Added metadata-completeness assessment (0–100) based on presence of descriptive title, source, valid URL, date, and thumbnail. This is explicitly a metadata completeness score, not a factual reliability or trust score.
- UI now displays completeness score alongside the existing relevance score. Test coverage includes canonical URL precedence and completeness tiers.
- Commits: code `c1b4691d`, tests `35d43ddb`, UI `8797a57d`. CI #309/#311 are in progress or pending at documentation time; verification for these latest changes is not yet claimed.


## 2026-11-23 — Collection and content quality dashboard
- Confirmed prior document runs #307 and #308 successful; prior follow-up #313 also successful.
- Added `scripts/quality-metrics.mjs` and `npm run quality`; CI generates `data/quality-metrics.json` and audits a bounded sample (12 discovery candidates, article URL and thumbnail where present) to avoid unbounded external requests.
- Metrics include per-source RSS/YouTube collection success, candidate counts, fetched/unique/added counts, duplicate counts before merge and current grouping reduction, URL/date/thumbnail field coverage by source, category counts, human-reviewed category agreement when labels exist, broken-link sample results, and missing-thumbnail count.
- UI dashboard shows collection success, source success rates, candidate totals, link audit counts, thumbnail missing count, and current duplicate grouping. Added validation for the generated metrics file and tests for summaries/link audit failures.
- Latest data snapshot at CI #333: Google News RSS 4/4 query success (100%); YouTube feed success (1/1); 19 archived videos; 473 discovery candidates; 100% URL/date field coverage and 0% thumbnail coverage for the Google News candidates; 12 link checks with 0 broken links; category counts video 139, news 280, interview 24, brand 12, performance 16, event 3, official 2. Classification accuracy is unmeasured because there are 0 human-reviewed labels; no accuracy claim is made. Current exact-title/URL duplicate grouping collapsed 0 candidate records in this snapshot.
- Development failures #321–#328 were traced to syntax issues introduced in dashboard/test edits (literal escaped newline and malformed test assertion), plus browser-only document access in the test import. These were corrected; #329 and #330 succeeded, and #333 succeeded after UI corrections. The #333 CI run verified the latest dashboard source-success display and full workflow.
- Commits: quality script `f03356b0`, script correction `dbbc319a`, bounded audit `432c8fef`, tests `3fd0b7a3`, package command `80552ff6`, review-label baseline `31422316`, UI metrics `48408cd3`, UI region `6c076851`, workflow `b12463d5`, validation `ceeeb378`, duplicate metric `5c457ea2`, test fix `708d1101`, dashboard metrics `d3d1133a`, browser guard `2e9380e6`, dashboard newline fix `7c191aa4`, source success rate code `c6260636`, test `73828c4c`, UI `77ac618f`, UI syntax correction `19852148`.


## 2026-11-23 correction — Link audit interpretation and final CI retry
- The quality report now explicitly separates hard broken links (HTTP 404/410), rate limits (429), and other unreachable/network/server errors; transient rate limiting is not mislabeled as a broken URL. The dashboard shows non-broken access errors separately.
- CI #338 succeeded after the quality-metrics script correction and generated the current quality report. Snapshot: 12 sampled candidate URLs, 0 broken, 0 rate-limited, 0 other unreachable; 473 discovery items have missing thumbnail URLs. This sample is bounded and not a full-site link scan.
- CI #343 attempt 1 passed unit tests and all collection/validation/data-commit steps but Pages deployment failed due temporary artifact lookup (0 artifacts). Attempt 2 reran the job and passed tests/collection/validation, but deployment failed because rerun created two artifacts named `github-pages`; this is a workflow rerun artifact collision, not a code/test failure. A clean new run is triggered by this documentation commit to verify the full deployment path.


## 2026-11-24 — RSS thumbnail recovery, dedupe and expanded link sample
- News RSS thumbnail extraction now checks `media:thumbnail`, `media:content`, image `enclosure`, and image markup in the decoded description (including common lazy-loading attributes and `srcset`). Only HTTPS candidates are accepted; logo/icon-like paths are skipped. Historical candidates are not retroactively enriched by this parser.
- News candidate merging now canonicalizes URL keys: hostname case/www, fragment and common tracking parameters are normalized, and query parameters sorted. The original display URL is preserved. It does not fuzzy-merge unrelated headlines.
- Link audit increased from 12 to 40 discovery records, with up to 5 concurrent requests and 3.5-second timeouts to keep the audit bounded. Audit results are sample-based, not a full crawl.
- Added tests for thumbnail metadata, description markup, unsafe/logo candidates, parser integration, and tracking-parameter deduplication; quality test asserts sampled record count.
- Classification accuracy remains unmeasured until human review labels are added; this cycle does not fabricate accuracy.
- Latest CI after all commits must be inspected before declaring the cycle verified.
