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


## 2026-11-24 — RSS thumbnail backfill and headline deduplication cycle
- Re-inspected the live dataset: 585 discovery records, 0 thumbnails (0%); Google News RSS rows had 100% URL/date coverage. Existing metrics still reflect a snapshot before the new enrichment logic.
- Google News RSS payloads do not reliably include thumbnails; research confirms RSS image metadata is generally absent, so publisher-page metadata is a free but best-effort fallback. See [Google News RSS limitations](https://cloro.dev/blog/google-news-rss/) and [RSS image troubleshooting](https://hushread.com/blog/rss-feed-images-not-showing).
- Implemented bounded publisher-page Open Graph/twitter image extraction for missing Google News candidates, max 12 attempts per run, 3 concurrent requests, 5-second timeout. Backfill selection rotates every 6 hours and writes recovered thumbnails back to existing discovery records. Existing thumbnails are preserved; failed fetches do not drop candidates.
- Collector now merges long normalized exact headlines before opaque Google News URL tokens and merges thumbnail/date/description metadata into existing records. Short/generic headlines fall back to canonical URL dedupe.
- Quality metrics now expose thumbnail enrichment attempts/found/missing/failed, exact normalized headline groups and before/after duplicate collapse, and exact single-label classification agreement plus per-category review counts. Human review remains zero until actual labels are entered.
- UI shows duplicate merge before/after and thumbnail-enrichment outcomes.
- CI verification is pending for the latest commit; see Actions. Earlier attempts during this cycle failed due an undefined thumbnail-enrichment variable, which was corrected. Do not treat the latest run as complete until final test/deploy status is checked.


### Actual data effect — verified 2026-11-23 23:41 UTC
- Discovery candidates: 616.
- Thumbnails: 84/616 (14%), up from 0% at baseline. The latest run's bounded enrichment returned 12/12 images (0 missing, 0 failed); publisher-page extraction is best-effort and the backfill will continue rotating through missing records.
- Incoming duplicate merge: 210 fetched rows → 194 after dedupe, 16 collapsed (latest snapshot). Canonical title/URL aliases prevent duplicate URL validator failures.
- Link audit: 40 sample candidate records checked; 0 broken, 0 rate-limited, 0 unreachable. This is not a full crawl.
- Human category review: 0 samples; accuracy remains unmeasured.
- Latest CI #381: unit tests, collection, quality generation, archive validation, log validation, and artifact upload passed; GitHub Pages deployment status failed on the platform response. Earlier #377 completed successfully end-to-end. Re-check latest Actions before claiming a full current run.


## 2026-11-24 — Thumbnail URL reuse audit
- Added a quality-metrics audit for normalized exact thumbnail URL reuse and image-host distribution; this detects literal URL reuse only and does not claim visual duplicate detection.
- Dashboard now reports thumbnail coverage, unique URLs, repeated URL groups/items, and top image hosts.
- Tests added for URL fragment normalization, repeat detection, missing URLs and host breakdown.
- Code/test/UI commits: `0540ab7d`, `9f3d3ee8`, `ccd7fe75`. CI must validate this cycle before it is marked verified.


## 2026-11-24 — Thumbnail quality response checks (in progress)
- Added bounded HEAD sampling of distinct thumbnail URLs, checking response status and `Content-Type`; non-image responses, broken (404/410), unreachable, and 429 are separated.
- Added heuristic flags for reused thumbnail URLs, logo/icon-like path names, and small-size URL hints. These are triage clues only; no visual classifier is implemented, and article relevance cannot be verified from URL metadata alone.
- Actual dataset anomaly from the current quality snapshot: 144 candidate records share a single thumbnail URL (`lh3.googleusercontent.com`), with 474 records missing thumbnails. This suggests the current enrichment pipeline may repeatedly assign the same image; the URL audit exposed it, but the image must be inspected before declaring it a bad image.
- CI issue observed: run #388 reached deployment but failed because `deploy-pages` could not find the `github-pages` artifact. Tests and earlier steps were successful. New audit code is being validated after syntax fixes; do not mark this cycle complete yet.


## 2026-11-24 — Thumbnail quality audit & Pages retry fix
- Quality audit sample (CI #401): 1 distinct thumbnail URL checked; HTTP 200, `image/png`. Dataset snapshot: 168 thumbnail assignments across 618 candidates use the same URL (167 repeated assignments); 450 candidates have no thumbnail. This confirms a URL reuse anomaly, not visual proof of wrong content.
- URL heuristics flag repeated URLs; path-name and small-size hints are implemented but no visual classifier. Article/image relevance remains unverified.
- Unit tests passed in CI #401 attempt 1 and attempt 2. Collection, metrics, validation, and artifact upload also succeeded.
- Pages deploy failed because artifact name `github-pages` was duplicated across workflow attempts. Workflow now uses an attempt-specific artifact name and matching deploy input (`github-pages-${{ github.run_attempt }}`) to make retries deterministic. CI for this pipeline fix is pending.


## 2026-11-24 — Thumbnail concentration follow-up (audit, not root-cause fix)
- Current main dataset is 618 candidates: 192 have thumbnails, 426 are missing, and all 192 assignments point to one exact URL. This is a newer snapshot than the previous 168/450 report; counts changed during collection.
- Eight inspected sample records have different video/article titles and Google News redirect URLs but the same stored image URL. This confirms the dataset-level concentration, not the image's visual relevance.
- Collector review: no dedicated thumbnail URL cache was found in the checked collector path; RSS extraction takes the first eligible image candidate; OG enrichment only runs on missing thumbnails and also accepts the first eligible OG/Twitter image. Merge preserves an existing thumbnail first and only uses incoming when the prior value is empty, so it does not normally overwrite a non-empty thumbnail. The current sample does not contain raw RSS response snapshots, so whether upstream RSS supplies one shared image or OG enrichment is responsible cannot be conclusively reproduced yet.
- Added concentration metrics (dominant URL count/share and warning) plus tests; dashboard displays a warning without claiming visual classification. Code/test/UI commits: 203105ff, 57f4f75e, adc19bb7.
- Pages CI runs #402/#404 both failed at deployment: upload logged artifact name `github-pages-1`, but deploy-pages reported 0 matching artifacts. Workflow now restores the standard `github-pages` artifact name/input. This correction is not yet verified by a successful Pages deployment.
- Next root-cause step: capture raw RSS and enrichment HTML for a controlled sample, record thumbnail provenance, then compare RSS media candidates vs OG metadata and persisted merge values before changing extraction logic.


## 2026-11-24 — Persistent UI action inventory
- User explicitly called out button/action omission. Added `BUTTONS_AND_ACTIONS.md` as a permanent inventory of existing controls and mandatory behavior/testing checks.
- Added regression assertions in `tests/index-structure.test.mjs` for main button markup and pagination/import control presence. Dynamic category/pagination behavior still needs module-level behavior tests and live visual/tap verification.
- Operating rules now require checking and updating button inventory during UI work. This is a requirement/guardrail update, not a claim of new UI buttons being added.


## Thumbnail enrichment duplicate-image safeguard (2026-11-24)
- Collector now rejects a thumbnail assignment when its normalized HTTPS URL is already assigned to another existing record or another record enriched in the same run. Existing records are preserved; this guard is non-destructive and applies only to new enrichment assignments.
- Enrichment outcome distinguishes raw metadata images found from images actually assigned and duplicate-image rejections. This prevents 'found' from overstating usable distinct assignments.
- Code commit: 231f7c91; test commit: 8a5c8a6d; metrics/status commits: 5ee77c62, 45f3097d, 437fa274.
- Research-informed rationale: closed-loop coding-agent literature emphasizes executable feedback and revision; this change is bounded and testable rather than adopting speculative autonomous behavior. See the 2026 self-evolving coding-agent survey and empirical software-agent trajectory study.
- Limit: existing repeated thumbnail assignments are not automatically removed. Image similarity across different URLs is not detected. CI validation is pending.


## Verification update — thumbnail duplicate assignment safeguard (2026-11-24)
- CI #430: unit tests passed; YouTube/news collection, dedupe, improvement cycle, quality generation and data/log validation passed. Pages deployment failed at deploy-pages artifact lookup (upload succeeded, API returned zero matching artifacts).
- Live generated metrics: enrichment attempted 12, found 11 metadata image URLs, assigned 0, duplicateRejected 11, failed 1. This means the guard successfully prevented 11 repeated assignments but did not improve thumbnail coverage; existing data still has 273 records sharing one URL and 345 missing thumbnails.
- UI does not yet display the found/assigned/rejected distinction; metrics are in generated JSON. Next UI/UX improvement is to surface these outcomes and investigate provenance, not inflate coverage.


## Thumbnail provenance and dashboard — 2026-11-24
- Added RSS candidate source tracking: `media:thumbnail`, `media:content`, `enclosure`, RSS-description HTML. Article metadata candidates record `og:image`, `twitter:image`, or `twitter:image:src`. Candidate list is bounded to 8 and HTTPS-only; logo/icon-like URLs remain excluded.
- New enrichment records include thumbnail source and candidates. Run status retains up to the bounded 12 recent attempts with candidate URL/source, assignment state, and status. Raw error messages are excluded from public provenance status.
- Quality metrics expose source counts (`thumbnailProvenance.assignedBySource`) and per-attempt provenance. Dashboard now shows found vs assigned vs duplicate rejected vs missing/failed and source host/type details.
- Existing records are not retroactively changed: latest data has 619 candidates, and all 619 report unknown provenance. This is an honest legacy-data limitation, not a missing new feature.
- CI #447 passed unit tests, collection, improvement cycle, quality metrics, validation, data/log checks, and Pages deployment. Run: https://github.com/UForPel/haewon-archive/actions/runs/45305421956. Live UI visual/mobile check was not completed; web page open returned an inaccessible/internal error.
- Latest enrichment: 12/12 metadata URLs found, 0 assigned, 12 duplicate-rejected; all candidate URLs were the same Google-hosted image. Thumbnail coverage remains 273/619 and missing 346; concentration remains 44%.
- Research reviewed: IPTC MetaWatch provenance rationale (https://metawatch.iptc.org/about/) and recent software-agent process discipline/verification work (https://arxiv.org/abs/2606.22678; https://arxiv.org/abs/2610.39468). Applied bounded provenance and test/CI feedback; did not treat agent papers as image-quality evidence.


## Thumbnail provenance cycle — verified 2026-11-24
- Collector provenance labels: RSS media tags (media:thumbnail, media:content, enclosure), RSS description HTML, article meta (og:image, twitter:image, twitter:image:src). Candidate lists bounded to 8; HTTPS only; obvious logos/icons excluded. New thumbnail assignment stores source and candidate metadata. Merge preserves provenance; public run status exposes bounded results without raw error strings.
- Metrics/UI: quality report exposes source counts and bounded attempt details; dashboard shows attempted/found/assigned/duplicate-rejected/missing/failed, legacy source counts, recent candidate source and host. No new buttons; BUTTONS_AND_ACTIONS.md updated.
- Latest run #450 success: tests, collection, improvement cycle, metrics, archive/run-log validation and Pages deploy. https://github.com/UForPel/haewon-archive/actions/runs/45305590376. Run #448 had a Pages deploy failure after tests/data validation passed; subsequent #450 succeeded.
- Latest data: 619 candidates; 273 thumbnail records; 346 missing; 1 unique thumbnail URL; 273 records share it (44%). Enrichment: 12 attempted, 9 found, 0 assigned, 9 duplicate-rejected, 3 failed. Every recent found candidate was the same Google-hosted og:image. All 619 existing records have thumbnailSource=unknown because historical source provenance was not saved.
- Research references: IPTC MetaWatch provenance/metadata-loss context https://metawatch.iptc.org/about/; engineering process verification references RigorBench https://arxiv.org/abs/2606.22678 and Soei https://arxiv.org/abs/2610.39468. These do not directly prove image relevance; they support provenance and verification design.
- Live page visual/mobile inspection was not completed: web open returned an inaccessible/internal result. CI deploy success is not a visual inspection.


## Pages artifact lookup race — 2026-11-24
- Deploy logs showed upload succeeded and artifact ID was issued, but deploy-pages immediately queried metadata and found 0 artifacts. Subsequent REST query confirmed the artifact existed for that same run. This is an artifact-metadata visibility race, not an upload failure.
- Workflow updated to upload-pages-artifact v4 and adds a bounded 10-second metadata wait before deploy-pages. CI #455 verified the updated workflow and Pages deployment succeeded: https://github.com/UForPel/haewon-archive/actions/runs/45306133839.
- Latest metrics from #455: 12 attempted, 12 image URLs found, 0 assigned, 12 duplicate rejected, 0 failed; 619 candidates, 273 thumbs, 346 missing, 1 unique URL, dominant share 44%, provenance unknown for all legacy records.
