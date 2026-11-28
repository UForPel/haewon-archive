# Project status

Last updated: 2026-11-27

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

## Thumbnail candidate comparison — 2026-11-24
- Implemented pure article-level comparison module `js/thumbnail-comparison.mjs`: pairs RSS candidates stored on discovery items with OG/Twitter candidates from enrichment results by article ID; reports source counts, host counts, shared URL overlap, RSS-only/meta-only/both-source counts, and found/assigned rate.
- Quality metrics now add `thumbnailCandidateComparison` and `thumbnailReview`. The review groups preserve article ID/title/original URL/current thumbnail/source and are explicitly non-destructive: no automatic deletion or replacement.
- Discovery quality UI renders candidate comparison summary, source/host counts and repeated-thumbnail review groups. Existing 273 repeated URL records are not changed.
- Added 3 module tests; isolated Node test execution passed (3/3). Full repository suite, CI and Pages deployment still pending. UI/mobile manual inspection not performed.


## Article-level thumbnail comparison — verified 2026-11-24
- Implemented `js/thumbnail-comparison.mjs`; per article ID it compares stored RSS candidates with OG/Twitter candidates from the enrichment result. It reports source and host counts, overlap, RSS-only/meta-only/both, metadata-found and assigned counts, and found-to-assigned rate.
- `scripts/quality-metrics.mjs` emits comparison and non-destructive repeated-thumbnail evidence groups. `js/discovery-view.mjs` displays comparison totals/source/hosts and expandable evidence links (current image URL plus up to 30 article links per group). No automatic image deletion/replacement.
- Fresh generated metrics: 12 compared articles, 0 RSS candidates, 12 metadata-only, 0 both-source, 0 shared RSS/meta URLs; 12 metadata candidates found, 0 assigned (0%). All 12 candidates use one Google-hosted URL. RSS candidate arrays are absent from legacy records; the collector can preserve candidates on new incoming records, but a longer data accumulation period is required for a representative comparison.
- Re-review group: 1 repeated URL, 273 article records with source URLs preserved. Manual visual relevance and rights review is still required.
- Tests: full CI run #469 passed unit tests and all collection/metrics/validation/Pages steps. Run: https://github.com/UForPel/haewon-archive/actions/runs/45313154823. Live mobile visual verification not performed.
- A prior #467 run failed due to an incorrect module import extension in quality-metrics; corrected in #468. #468 passed; #469 is the end-to-end success on final UI changes.
- Research: Media RSS distinguishes item-level thumbnail metadata and can carry multiple candidate resources; RSS enclosure is generic attached media. Official sources: https://www.rssboard.org/media-rss and https://www.rssboard.org/rss-specification. This supports candidate provenance comparison but not image relevance itself. Image licensing/credit metadata preservation: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata.


## Thumbnail candidate persistence — 2026-11-24
- Collector now persists article metadata candidate arrays on the selected enrichment records, including duplicate-rejected candidates; the dashboard comparator can read this per-record evidence. RSS candidates and metadata candidates remain separate.
- Quality metrics now expose unique-thumbnail assignment rate and unique-image coverage alongside URL repetition/concentration. These measure URL uniqueness, not visual relevance, rights, or source trust.
- Existing records were not deleted or auto-replaced. The 273-record repeated URL remains in the review evidence list.
- Tests added for persistence and comparison; local test execution unavailable in this session. Final CI/Pages run is pending verification.
- Google News redirect use is limited to ordinary public redirect-following requests; no opaque redirect decoding or access-control bypass is added. Resolved publisher URLs are not yet retained.

## Recursive improvement cycle — 2026-11-24 continuation
- Candidate persistence, URL uniqueness metrics and dashboard were committed previously. This continuation corrected escaped-newline syntax in js/thumbnail-comparison.mjs and scripts/quality-metrics.mjs (commits 843a490 and b24bd71). Post-update GitHub fetch confirms both files contain no literal escaped-newline sequences.
- Local tests, Actions status, deployed Pages and visual/mobile checks remain unverified. Local clone failed because github.com DNS was unavailable. Actions page fetch was blocked.
- RSS candidates cannot be reconstructed for historical records; trust/visual accuracy requires human review labels before any score is published.
## Recursive improvement cycle — 2026-11-24 (CI repair and collection verification)
- Run #487 failed: `scripts/quality-metrics.mjs` line 83 contained a newline inside a single-quoted string. Corrected in `91d48b9`.
- Run #488 then surfaced two missing backwards-compatible fields in thumbnail URL audit (`repeatedUrlGroups`, `repeatedItems`). Restored in `0fded07`.
- Run #489 passed: 86/86 unit tests; YouTube/news collection, metrics, data validation, run-log generation/validation, data commit, Pages artifact and Pages deployment all succeeded. https://github.com/UForPel/haewon-archive/actions/runs/45319384393
- Generated snapshot: 620 candidates, 273 with thumbnail, 347 missing; 1 unique thumbnail URL shared by 273 records. New article metadata evidence persisted for 12 sampled records, but 0 RSS candidates, 12 metadata-only, 0 assignments, 12 duplicate rejections (same `lh3.googleusercontent.com` URL).
- Candidate persistence is verified, candidate diversity and article-specific relevance are not. No image records were deleted or auto-replaced. A labeled human review process is still needed before publishing suitability accuracy.

## RSS image candidate extraction and human review — 2026-11-24
- [x] Extend RSS extraction to Media RSS thumbnail/content, image Enclosure, description HTML and content:encoded image markup.
- [x] Extend article-page extraction to OG/Twitter (including secure_url), link rel=image_src, itemprop=image and JSON-LD image/thumbnailUrl/contentUrl.
- [x] Persist per-article candidate source/priority and fetch provenance; merge candidate arrays instead of dropping later evidence.
- [x] Add aggregate live RSS response diagnostics (item counts and image-bearing tag counts only; raw feed bodies are not stored).
- [x] Add article-level candidate review UI and browser-local labels with JSON import/export.
- [x] Add candidate suitability precision and selected-thumbnail precision metrics; both remain unmeasured until labels are entered.
- [x] Preserve repeated legacy thumbnail URLs; no automatic delete or replacement.
- [ ] Confirm current full CI and Pages deployment on the latest code.
- [ ] Use the next successful collection to inspect rssImageSignals and compare actual RSS image tags/candidates with article metadata candidates.
- [ ] Obtain human review labels before reporting suitability precision; do not call this classifier accuracy.
- [ ] Inspect deployed mobile UI, keyboard focus and label persistence/export/import.

### Verification and repair notes
- #493 and #490 succeeded before this implementation batch, including Pages deployment.
- #500–#510 included failed test runs caused by malformed escaped line breaks/regex in collector changes; #509 also exposed a test fixture count expectation error. These were identified from Actions logs and corrected in later commits.
- At this checkpoint #514 was running tests and #516 was queued. Do not treat these as passed.
- Historical baseline: 620 articles; 273 thumbnail URLs assigned; 347 missing; 1 URL shared by 273 articles; 0 persisted RSS candidate articles; 12 metadata candidate sets. The new live RSS tag diagnostics have not yet run successfully.
- Browser-local review labels are not a shared backend. JSON export/import is the current free static-site persistence path.


## Live RSS diagnosis and Google News wrapper isolation — 2026-11-24
- [x] Run the new RSS image-signal diagnostics against actual Google News RSS responses.
- [x] Confirm 227 live RSS items contained 0 Media RSS thumbnail/content tags, 0 image Enclosure tags, 0 content:encoded entries, 0 description image tags and 0 image-bearing items.
- [x] Confirm 12 metadata fetches stayed on news.google.com, returned the same generic OG image and did not reach publisher article pages.
- [x] Quarantine wrapper-only metadata as google-news-wrapper:og:image; keep it as evidence, exclude it from publisher metadata comparisons and automatic thumbnail assignment.
- [x] Verify run #521: unit tests, collection, data validation, data commit, Pages artifact and Pages deployment succeeded.
- [ ] Verify latest metadata-host provenance commit with pending Actions #525.
- [ ] Gather human review labels and measure candidate/selected-thumbnail precision; no image suitability accuracy is available yet.
- [ ] Manually inspect deployed mobile review controls and browser-local label export/import.
- [x] Preserve the 273-item repeated URL group without automatic deletion or replacement.

### Current evidence
- RSS: 227 items, 0 image-bearing structures, 0 RSS image candidates.
- Metadata: 12 attempts, 0 publisher candidates, 0 assignments, 12 wrapper-only; final response host news.google.com for all 12.
- Historical archive: 620 items, 273 with thumbnails, 347 without; one URL repeated 273 times.
- Browser-local review labels are not shared across devices; JSON export/import is the current static-site persistence mechanism.


## Explicit publisher URL gating, source provenance and review metrics — 2026-11-24
- [x] Parse and preserve RSS source URL separately from article URL.
- [x] Only accept a direct HTTPS article link/GUID outside Google wrapper domains as publisherArticleUrl.
- [x] Fetch article metadata only for explicitly identified publisherArticleUrl; do not fetch Google News wrappers or publisher homepages.
- [x] Preserve sourceUrl, publisherArticleUrl, final response URL/host, metadata candidate source and priority.
- [x] Preserve source and metadata provenance across archive merges.
- [x] Add article-card provenance status and source-site link.
- [x] Add review JSON schema validation, localStorage persistence, import/export and persistent repository JSON input for metrics.
- [x] Wire candidate and selected-thumbnail precision into quality metrics without colliding with repeated-image review-group data.
- [x] Verify Actions #537: 112/112 tests, collection, validation, data commit and Pages deployment succeeded.
- [ ] Manually inspect deployed mobile UI and click through review/save/import/export in a real browser.
- [ ] Gather human labels; current eligible=285, reviewed=0, precision=unmeasured.
- [x] Preserve the legacy 273-record repeated URL group without deletion or replacement.

### Latest measured evidence
- RSS items=173; sourceUrl items=173; explicit publisherArticleUrl items=0.
- RSS image signals=0 for Media RSS, image Enclosure, content:encoded and description image tags.
- Metadata enrichment attempts=0 because no explicit article URLs were present; wrapper URL fetches are not attempted.
- Archive=620 items; 273 with thumbnails; 347 missing; one URL repeated 273 times.
- Review metrics=285 eligible article/image candidates; 0 reviewed; 0% coverage; precision=null.


## 2026-11-24 — Bing News RSS source expansion and review workflow
- [x] Rechecked main and Actions #538 baseline; #538 succeeded on commit 2236088, followed by the automated data commit.
- [x] Added Bing News RSS as a parallel public discovery source. Four of four query feeds succeeded in the measured run.
- [x] Only accept an HTTPS article URL explicitly exposed by Bing's ordinary `url` query parameter; never decode Google News wrapper tokens or infer URLs from text.
- [x] Persist discovery wrapper URL, candidate source, publisherArticleUrl, publisherHost, optional sourceUrl and metadata final-host evidence separately.
- [x] Add source-level and host-level article URL provenance metrics, including separate historical wrapper-only metadata hosts.
- [x] Add article URL provenance to the quality summary and preserve Google/YouTube metric ordering.
- [x] Add a review queue shortcut; selecting a label auto-clicks the existing save action and the next-unreviewed action scrolls to the candidate row.
- [x] Add Bing parser/provenance tests; Actions #543 passed 116/116 tests, collection, validation, data commit and Pages deployment.
- [x] Keep JSON import/export validation and round-trip tests green.
- [ ] Manually verify deployed mobile rendering, localStorage persistence and actual file picker/download round-trip in a real browser; CI unit tests do not verify these interactions.

### Latest measured evidence (Actions #543)
- Bing News RSS: 4/4 queries successful; 41 RSS candidates; 35 article-level HTTPS URLs retained in discovery data.
- Archive: 655 discovery items; 35 items with explicit publisherArticleUrl; 35 Bing-origin items.
- Thumbnail enrichment: 12 attempts; 10 assigned; 1 missing; 1 failed.
- Thumbnail audit: 292/655 items have a thumbnail; 20 unique thumbnail URLs; one legacy URL remains repeated 273 times.
- Candidate/image suitability precision remains unmeasured until human labels are submitted.
- No destructive merge, deletion or replacement of the legacy repeated-URL group.


## 2026-11-24 — Restore persistent one-tap conversation continuation
- [x] Confirmed operating rules required a ChatGPT follow-up button, but the exact reusable prompt and explicit control inventory entry were not persisted together.
- [x] Recorded button label, surface, behavior, full prompt payload and omission-prevention rule in `CHATGPT_OPERATING_RULES.md` and `BUTTONS_AND_ACTIONS.md`.
- [x] This control is a ChatGPT conversation action, not an archive website button.
- [ ] Verify documentation commit's Actions/Pages run; actual button must be rendered in the assistant's next substantial project response.


## 2026-11-24 — Review queue implementation correction
- [x] Rechecked Actions #545: all 116 tests passed; collection, data validation, data commit, Pages artifact upload and deployment all succeeded.
- [x] Verified latest main data commit `cf3eb2f` after the workflow's automated refresh.
- [x] Found a real integration defect: `js/review-workflow.mjs` contained a review shortcut, but `index.html` did not load that module. The previously reported "next unreviewed" control was therefore not present in the deployed app.
- [x] Moved the queue behavior into the already-loaded `js/discovery-view.mjs` module and made it search all currently filtered/sorted items, not only the visible page.
- [x] Consolidated candidate enumeration and added pure tests for HTTPS filtering, duplicate image candidates, cross-page navigation and completed review labels.
- [ ] Run CI and verify the new deployed UI. Real browser interaction and localStorage/file-picker testing remain pending unless an actual browser becomes available.


## 2026-11-24 — Cross-page review queue deployed; public RSS source audit
- [x] Actions #546 passed 119/119 tests, collection, validation, data commit and Pages deployment.
- [x] Code commit `8f348f2` implemented cross-page review queue in the actual loaded discovery view; latest automated data commit is `b675a1c173a664bb12772cefe834d384129b6927`.
- [x] Latest data: 657 discovery records; 35 explicit HTTPS publisher article URLs; 40 Bing RSS candidates across 4/4 successful Bing queries.
- [x] Thumbnail baseline unchanged: 299/657 have thumbnails; 27 distinct thumbnail URLs; one URL is assigned to 273 records. Latest enrichment sample: 9 attempts, 0 candidates found/assigned, 5 missing, 4 failed.
- [x] Audited official publisher RSS landing pages: SBS News and Sports Khan expose RSS directories; MK exposes an entertainment/culture feed; ETNews exposes section feeds but its published endpoints are HTTP. The SBS page limits RSS to personal non-commercial use; Sports Khan describes personal reading and warns against public redistribution without rights-holder permission.
- [x] Decision: do not add these feeds to the public repository until direct item URL behavior and reuse permissions are verified. Listing a feed endpoint is not proof that item-level URLs/images can be republished.
- [x] Bing News RSS remains a best-effort free discovery source, not a guaranteed/versioned API. Accept only explicitly exposed HTTPS article URL values and preserve the wrapper as provenance; no Google opaque token decoding.
- [x] Open Graph protocol documents `og:image` and optional image metadata, but it does not guarantee that every publisher page exposes a usable image. Current sample found 0 candidates in 9 attempts; distinguish missing metadata from failed fetches.
- [x] Added a static integration regression test to ensure the review queue remains wired to the module actually loaded by `index.html`.
- [ ] Real-browser visual/mobile rendering, localStorage persistence across reload, and actual file-picker/download JSON round-trip remain unverified; web retrieval is not a substitute for browser interaction.


### Official RSS candidate inventory (checked 2026-11-24)
| Publisher | Official feed endpoint | Evidence / constraint | Decision |
|---|---|---|---|
| SBS News entertainment | `https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=14&plink=RSSREADER` | Official RSS directory; personal non-commercial use only | Do not redistribute feed content on public archive until scope is clarified |
| Sports Khan entertainment | `https://sports.khan.co.kr/rss/entertainment` | Official RSS directory; personal subscription purpose; public sharing requires rights-holder permission | Not integrated |
| Maeil Business culture/entertainment | `https://www.mk.co.kr/rss/30000023/` | Official RSS directory lists the feed; feed-specific reuse terms and item URL semantics not verified | Hold for permission and XML validation |
| ETNews latest | `http://rss.etnews.com/Section901.xml` | Official directory lists HTTP feed endpoints | Do not use HTTP feed in the HTTPS-only collection pipeline |

Official source directories: SBS `https://news.sbs.co.kr/news/rss.do`, Sports Khan `https://sports.khan.co.kr/rss`, MK `https://www.mk.co.kr/rss/`, ETNews `https://www.etnews.com/rss/`.
The directory pages prove that feed endpoints are published, not that each RSS item's link is a direct HTTPS publisher article URL or that image/content republication is permitted. Item-level XML and reuse permissions remain unverified.


## 2026-11-24 — Final verification after Actions #548
- [x] Actions #548 completed successfully: 120/120 tests, public data collection, validation, data commit and Pages deployment.
- [x] Documentation commit: `f3057c6968dd480784f75908f851fc5e96075388`; latest automated data commit after #548: `0162f3dbf580e5c06265ef18820c941d613ed65e`.
- [x] Latest measured dataset: 658 discovery records; 36 explicit HTTPS article URLs; 36 Bing-origin items; 41 Bing RSS candidates; 4/4 Bing queries successful.
- [x] Latest thumbnail metrics: 299/658 records have thumbnails; 27 unique thumbnail URLs; one URL appears on 273 records.
- [x] Latest metadata enrichment: 10 attempts; 0 found; 0 assigned; 7 missing; 3 failed.
- [x] Human review metrics: 362 eligible image candidates; 0 reviewed; coverage 0%; precision remains null/unmeasured.
- [ ] Real browser/mobile rendering, localStorage persistence after reload, and actual JSON file-picker/download round-trip remain unverified.

## 2026-11-24 — Metadata retry and host diagnostics cycle
- Latest baseline before this change: 659 discovery items, 300 thumbnails, 28 distinct thumbnail URLs, dominant URL used by 273 items; 37 explicit HTTPS publisher article URLs and 41 Bing RSS candidates from 4/4 successful queries.
- Google News RSS contributed 172 items with source-site metadata but 0 item-level publisher article URLs and 0 RSS image signals. The sourceUrl is a publisher/site URL, not an article URL; no inference or wrapper decoding is allowed.
- Actions #551 passed its Unit tests, collection, bounded improvement, quality generation, validation, data commit, Pages artifact upload and deployment.
- The new collector records fetch status code, stable error class, final article URL/host and timestamp. It now backs off: missing metadata 7 days; forbidden/not-found/rate-limited 7 days; transient network/server errors 1 day; found/assigned/duplicate-rejected/wrapper-only 30 days.
- Latest #551 enrichment attempted 3 URLs and all 3 returned HTTP 403 (x.com, famtimes.co.kr, bntnews.co.kr); these are now classified as forbidden and deferred for 7 days rather than retried each run.
- Historical publisher metadata records show 27 found results with matching article-level thumbnail provenance; host metrics now count these legacy successful assignments rather than incorrectly reporting 0%.
- Added per-publisher diagnostics to the quality report and UI: attempts, metadata found, assigned, missing, failed, duplicate-rejected, error classes, and final redirect hosts.
- Open Graph official protocol specifies og:image as basic metadata and allows multiple image values, but it is publisher-supplied metadata, not a guaranteed universal extraction endpoint. Source: https://ogp.me/ (checked 2026-11-24; authoritative protocol, limited to markup semantics).
- Browser rendering, responsive/mobile appearance, localStorage persistence across reload, and real file-picker/download round-trip remain unverified. Static module integration tests do not replace a real browser test.
## 2026-11-24 — Actions #552 verified improvement checkpoint
- Actions #552 run ID 45397522807 completed successfully: 125/125 tests, public YouTube/news collection, bounded improvement cycle, quality report, validation, data commit, Pages artifact upload and deploy all passed.
- Feature commit: 98552aa57eaecafab672dd68107cc324d45032f3. Automated data commit after #552: 08df9d43500aaef04c20fe4f1051fb5fab68c0d4.
- Data baseline after #552: 662 discovery records; 38 explicit HTTPS publisher article URLs (38 Bing-origin); 41 Bing RSS candidates; 4/4 Bing queries successful.
- Thumbnail baseline after #552: 301/662 records have thumbnails; 29 unique thumbnail URLs; dominant repeated URL still appears on 273 records. This is +1 thumbnail and +1 unique URL versus the pre-cycle baseline (300/659, 28 unique); the repeated group was not deleted or merged.
- Latest enrichment cycle: 1 attempt, 1 metadata candidate found, 1 assigned, 0 missing, 0 failed. The newly assigned item is an explicitly linked Sports Khan HTTPS article with an HTTPS og:image candidate.
- The three prior HTTP 403 failures were not re-requested on #552 because the new seven-day forbidden backoff applied. This demonstrates the retry policy is active; it does not prove those publishers will become accessible later.
- Cumulative historical host diagnostics are now displayed with candidate discovery rate, assignment-after-discovery rate, error classes and final redirect hosts. Do not mistake historical host aggregates for this run's one-item sample.
- Human review remains 0/369 candidates (0%); image relevance precision remains unmeasured. Browser rendering, mobile appearance, localStorage reload and actual JSON file picker/download round-trip remain unverified.
## 2026-11-24 — Actions #553 final verification
- Actions #553 run ID 45397817669 succeeded: 126/126 tests; YouTube and news collection, bounded improvement cycle, quality generation, validation, data commit, Pages artifact upload and deploy all succeeded.
- UI diagnostic rate display commit: cce994fe0b8deed8d33517332bd25af40bd7a1ea. Automated data commit after #553: 1907407858f6774979a232d0a0751ce906deb88c.
- Latest data: 664 discovery records; 38 explicit HTTPS publisher article URLs, all from Bing News RSS; 40 Bing candidates; 4/4 Bing queries successful.
- Latest thumbnail audit: 301/664 have thumbnails; 29 unique thumbnail URLs; the same legacy URL remains assigned to 273 records. Compared with #552, 2 records were added but no new thumbnail was assigned.
- #553's enrichment sample made 0 new attempts because all eligible targets were still inside their retry windows. This is the intended backoff behavior, not a collection failure.
- Human review: 369 eligible candidates, 0 reviewed, 0% coverage; precision remains unmeasured.
- Per-host metrics include historical results. Google News has 12 wrapper-only metadata fetches, which remain excluded from article URL inference. The 273 repeated image records remain preserved for human review.
- Actions confirms Pages deployment step succeeded. Interactive browser rendering and manual mobile/localStorage/file-picker checks remain unverified; the public page could not be independently rendered by the available text-only web viewer.
## 2026-11-24 — Actions #554 final check
- Actions #554 run ID 45398079496 completed successfully: 126/126 tests, collection, improvement cycle, quality generation, validation, data commit and Pages deployment all passed.
- Final automated data commit after #554: 0046bb119be9d31b6702c0a80c43228d1752bae8.
- Final data: 664 discovery items; 38 explicit HTTPS publisher article URLs (38 Bing-origin); 41 Bing candidates; 4/4 Bing queries successful.
- Final image audit: 301/664 records have thumbnails; 29 unique URLs; dominant legacy URL remains assigned to 273 records.
- Final review audit: 369 eligible candidate labels, 0 reviewed, 0% coverage; precision is null/unmeasured.
- Enrichment made 0 attempts in #554 because eligible targets remained within retry windows. This is expected backoff behavior.
- Browser visual/mobile rendering, localStorage reload and real file-picker/download round-trip remain unverified.
## 2026-11-24 — Actions #555 final data diagnosis
- Actions #555 run ID 45398346939 succeeded: 126/126 tests; collection, quality generation, validation, data commit and Pages deployment all passed.
- Latest automated data commit: a469c116f6b0f4c3b5ae6f5d4cd7906d580ab010.
- Latest data: 665 discovery records; 38 explicit HTTPS publisher article URLs; 38 Bing-origin article records; Bing News RSS 3/4 successful queries and 30 candidates. The failed Bing query '해원 엔믹스' returned a non-RSS body ('Bing RSS 응답이 아닙니다'); Google News RSS remained 4/4 successful.
- Google RSS diagnostics: 328 item records, 325 site-level sourceUrl values, 0 item-level publisherArticleUrl values, and 0 media:thumbnail/media:content/enclosure/description/content:encoded image signals. Do not treat sourceUrl as a direct article URL or infer an image URL.
- Latest thumbnail audit: 301/665 with thumbnails, 29 distinct URLs, one Google-hosted URL reused on 273 records; 364 records have no thumbnail. Human review remains 0/369 (0%); precision unmeasured.
- Latest enrichment attempted 0 URLs because the retry backoff excluded all eligible targets. No new thumbnails were assigned in #555.
- Deduplication report for this run: 358 incoming items to 316 normalized candidates (42 collapsed). This is candidate-level deduplication, not deletion of archive history.
- The Bing non-RSS response is recorded as a source-specific transient response-format failure. Retry only on a later scheduled cycle; do not switch to wrapper decoding or bypass access controls.

## 2026-11-24 — Repeated-thumbnail review and URL provenance hardening
- Recomputed the live main data baseline before implementation: 665 discovery records; 301 records with thumbnails; 29 distinct thumbnail URLs; one dominant URL used by 273 records (41% of all candidates); 364 records without thumbnails.
- The dominant 273-record group is not merely a generic repeated URL statistic: all 273 rows are Google News RSS records, all have no publisherArticleUrl, no thumbnailSource, no thumbnailProvenance, no metadata-fetch evidence and no article-specific image candidate. Preserve them as unresolved legacy assignments; do not infer image origin, relevance, or rights.
- Human review baseline: 369 eligible image candidates, 0 reviewed, 0% coverage; candidate and selected-thumbnail precision remain unmeasured.
- Latest RSS sample: 172 Google News RSS items, 172 site-level sourceUrl values, 0 item-level publisher article URLs, 0 RSS media/enclosure/description image signals. The site URL is not an article URL. Latest Bing collection sample was 4/4 queries successful, 40 Bing candidates, and 38 explicit HTTPS publisher article URLs retained in the cumulative archive.
- Static source inspection found a discovery-view render bug: render() referenced q outside the scope where q was declared. The count update now reads the current search field directly; a regression test guards against the out-of-scope reference.
- Added a dedicated repeated-thumbnail review disclosure panel. It shows the shared preview once, exposes per-article title/source/link and independent labels, supports search and next-unreviewed navigation, and never applies a label to every article in the group.
- Hardened news-to-video synchronization: accept only explicit HTTPS YouTube URLs present in publisherArticleUrl or url metadata on recognized YouTube hosts. Do not fetch or follow Google News wrapper URLs to infer a destination. Existing videos remain intact; this only restricts new additions.
- Commits: 6e7b612045dbd63f87d326ae5efdf334cdcdb2e6 (review UI, helper, tests, styles); b9f8ac9063f1769c2fc743b033a20cd716760a25, 159a8890a76e299fafa739c1c89cf7847f5ac9b5, and 379d5e3757f4b33406bfb78aff91c0aeb9a82b9d are the URL-policy implementation and corrective follow-ups; the final source state is at 379d5e3.
- Actions #557 initially passed its Unit tests, collection, discovery, validation and quality steps, but its final data-commit step was still running at this checkpoint. Actions #560 for the final explicit-URL code state was pending. Do not claim either final run or Pages deployment succeeded until the run records confirm it.
- Research checked 2026-11-24: MDN documents native details/summary disclosure behavior and keyboard activation; W3C WCAG 2.2 focus-order guidance says focus order must preserve meaning and operability; GitHub's Pages deployment guide describes the artifact-upload/deploy workflow. These are authoritative platform/accessibility references, not proof of this app's live rendering or conformance.
- Browser rendering, responsive/mobile layout, actual localStorage reload, and real JSON file-picker/download behavior remain unverified. The text-only web viewer could not open the deployed Pages URL.


## Final verification update — Actions #557 and #560 (2026-11-24)
- Actions #557 run ID 45402689201 completed successfully: 130/130 tests; collection, validation, operational run log, data commit, Pages artifact upload and Pages deployment all succeeded. Its data commit was b5a2468e1f2067ef0f5d5cc43bb9bbc60ac95b36.
- Actions #557's Google News RSS requests returned HTTP 503 for all 4 queries. Bing News RSS succeeded 4/4 with 41 candidates. This was recorded as a transient source-specific response failure; no access workaround or wrapper decoding was attempted.
- Actions #560 run ID 45403295725 completed successfully on the final explicit-URL code state: 131/131 tests, 0 failures; collection, validation, data commit, Pages artifact upload and deployment all succeeded. Its data commit was 4f0e17feea00adcf0398fdf4e3da7c8ef3842777.
- #560 recovered Google News RSS to 4/4 successful queries. It returned 172 items with 172 site-level source URLs, 0 explicit publisher article URLs, and 0 RSS image signals. Bing was 4/4 with 41 candidates; total fetched 213, unique 193, and 4 additions.
- The current measured image baseline remains 665 discovery items, 301 thumbnails, 29 unique URLs, 273 uses of the dominant legacy URL, and 364 missing thumbnails. Enrichment attempted 0 URLs because all eligible URLs remained within retry windows; this is expected backoff, not a fetch failure.
- Human review remains 0/369 (0%); selected-thumbnail precision and candidate precision are unmeasured. The new group UI makes review easier but does not fabricate labels.
- Pages deployment is verified by Actions #560. Live visual/mobile rendering, localStorage reload and actual file-picker/download behavior remain unverified.


## Latest data and deployment checkpoint — Actions #562 (2026-11-24)
- Latest inspected main before this documentation checkpoint: d2b1a624e0666d677f07fdfd0b9e3cd985910904.
- Actions #562 run ID 45404066050 completed successfully: 131/131 tests, 0 failed; collection, validation, data commit, Pages artifact upload and Pages deployment all succeeded.
- Latest data: 666 discovery records; 301 thumbnail-bearing; 29 distinct thumbnail URLs; dominant legacy URL on 273 records; 365 records without thumbnails.
- Human review remains 0/369, 0% coverage; candidate and selected-thumbnail precision are still unmeasured.
- Google News RSS succeeded 4/4 and returned 260 items. 258 had site-level sourceUrl; 0 had direct publisher article URLs; 0 had image-bearing RSS signals. Bing succeeded 4/4 with 41 candidates. Combined collection: 301 fetched, 275 unique, 6 additions.
- Cumulative explicit HTTPS publisher article URLs remain 38, all from Bing News RSS metadata. Do not infer direct article URLs from Google News source-site links.
- Thumbnail enrichment attempted 0 URLs because the eligible URLs remained inside retry windows. This is expected backoff, not a fetch failure.
- The repeated-image panel and explicit-URL-only video resolver are included in the successfully deployed Pages artifact. Manual browser/mobile, localStorage and JSON transfer checks remain unverified.


## 2026-11-25 — Metric integrity and explicit article URL coverage (implementation pending CI)
- Main head before this change: c125d24b0c44dc0245893a13aeb0c97c4ebfcbc6; latest data snapshot: 666 discovery records.
- Verified Actions #562 (run ID 45404066050) directly: job succeeded; all 19 steps succeeded, including 131/131 tests, collection, quality metrics, validation, data commit, Pages artifact upload and deployment. Artifact `github-pages`: 389,175 bytes, SHA-256 f518a69cf916e8ceabf4badfe23599a63baa29f4702b4bdb4659f2f505d78a7a.
- Explicit HTTPS publisher article URLs: 38/666 (5.7%), all Bing News RSS. Google News RSS sample: 260 items, 0 direct publisher article URLs and 0 image-bearing RSS structures. Old URL coverage counted discovery wrapper links and was not article URL coverage.
- Thumbnails: 301/666; 273 use one exact legacy URL; 365 missing. The 273 repeated records have no source/provenance evidence and remain untouched.
- Corrected metric design: separate assigned thumbnails, unverified legacy assignments and missing thumbnails; source rows distinguish discovery-link coverage from explicit publisher article URL coverage.
- Research checked 2026-11-25: RSS 2.0.11 canonical spec (2009-03-30): https://www.rssboard.org/rss-specification ; Media RSS 1.5.1 (2009-12-11): https://www.rssboard.org/media-rss ; GitHub Actions workflow-run API docs: https://docs.github.com/en/rest/actions/workflow-runs?apiVersion=2026-03-10 ; GitHub Pages deployment guide: https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically . RSS/Media RSS are authoritative format specifications but do not guarantee a publisher supplies item-level article/image metadata. CI success does not establish browser correctness.
- Browser/mobile rendering, keyboard focus, localStorage reload and file-picker round-trip remain unverified. New metric changes require their own green Actions run.


## 2026-11-25 — Actions #566 recovery and measured baseline
- Main at run start: `bb9c6e0053b317810209ab3fd3df3d4dd6c3cdd6`; Actions #566 / run ID `45490686021` completed successfully. All 19 operational steps succeeded; 133/133 unit tests passed; YouTube and RSS discovery succeeded; quality report and archive validation passed; data commit, Pages artifact upload and Pages deployment succeeded.
- Data commit produced by the run: `e5df579c40eabd338b870cc3d98141f4dba67a20`. Pages artifact: 406,791 bytes; SHA-256 `f1bfd91de4ca73a1a164938f759c79fe67699b364f13f9420d99d4eb42d99ef4`.
- Baseline comparison (#562): explicit HTTPS publisher article URLs 38/666 (5.7%) -> 53/682 (7.8%), +15 records and +2.1 percentage points. Google News still 0/629 explicit publisher URLs; all 53 explicit URLs are from Bing News RSS metadata. No wrapper decoding or redirect following was used.
- Thumbnails: 301/666 -> 312/682 (+11); coverage 45.2% -> 45.7%. Missing: 365 -> 370 because the archive grew by 16 items. Verified provenance: 39/312 (37 og:image, 2 twitter:image; 12.5%, rounded 13%); unverified legacy remains 273. Dominant repeated image remains 273 records; 1 repeated URL group, 40 unique thumbnail URLs. No old image was deleted or automatically replaced.
- Bounded enrichment: 12 attempts, 11 assigned, 1 failed; candidate metadata and final hosts retained. Response audit sampled 12 unique URLs: 11 valid image responses and 1 HTTP 404. These are a small sample, not a relevance-precision estimate. Human review remains pending; repeated group is marked review-required.
- Root cause of #564 failure: stale UI structural assertion expected removed label `기존 이미지 출처 기록`. PR #2 updated it to assert `썸네일 출처 검증`, `출처 미확인 레거시`, and `썸네일 없음`; #566 confirms 133/133.
- Additional log defect found in run `45490686021`: GitHub push trigger was normalized to `unknown`. This change maps it to `github_push`, extends the JSON schema and tests it. Run log only identifies the YouTube collector as a source; news-source outcomes remain in `data/news-collection-status.json` and are not conflated with the YouTube record.
- Browser validation: Pages deployment succeeded, but a real browser session/mobile visual, keyboard, localStorage and file-picker round-trip were not available; a web text fetch of the Pages URL was inaccessible, so do not claim browser verification.
- Research basis unchanged: RSS 2.0.11 and Media RSS 1.5.1 are format specifications; their optional metadata does not guarantee article/image availability. GitHub Actions/Pages results are authoritative for workflow/deployment status, not UI behavior.


## 2026-11-25 — Run-log trigger correction merged; CI pending
- PR #3 merged as `6e8e527f71be330dd38da169fc1f48153f724b4b`: GitHub push events now map to `github_push`; schema enum and regression test updated.
- Actions #566 verified the preceding main revision end-to-end (133/133 tests, collection, validation, data commit, 406,791-byte Pages artifact and successful deployment). It predates PR #3, so it does not verify the new trigger test.
- Actions #567 / run ID `45491071500` verified the PR #3 merge commit: 133/133 tests, all 19 workflow steps and Pages deployment succeeded. The persisted run log records `trigger: github_push`.


## 2026-11-25 — Post-fix verification and second enrichment pass
- Actions #567: run ID `45491071500`, head `6e8e527f71be330dd38da169fc1f48153f724b4b`; completed success. 133/133 tests passed; YouTube and RSS discovery, improvement cycle, quality report, archive validation, log validation, data commit, artifact upload and Pages deployment all succeeded.
- Persisted run log confirms `trigger: github_push`, `status: success`, validation passed.
- Pages artifact: 411,213 bytes; SHA-256 `d2e6843218154b1574aa946d681a34061d454643a1483c69462fe18add4b80ba`.
- Latest metrics after #567: 682 records; explicit publisher HTTPS article URLs 53 (7.8%), Google News 0/629; thumbnails 315 (46.2%), missing 367, unverified legacy 273, verified provenance 42 (40 og:image, 2 twitter:image; 13% of assigned); unique image URLs 43. The 273 repeated image group remains review-required.
- Latest bounded metadata enrichment: 3/3 assigned, 0 failures. This is a bounded sample, not a representative precision estimate. The earlier #566 pass was 11/12 assigned, 1 failure.
- PR #4 documentation-only merge occurred after #567's workflow head; it did not change runtime code. Current main includes its documentation changes.


## 2026-11-25 — Reading-view cleanup (PR validation pending)
- Latest inspected main before UI work: `5e37b22a87e5f4ffb10426abdaa3f97778bb1e18`; latest observed Actions #569 succeeded (133/133 tests and Pages deploy). This is CI/deployment evidence only, not visual confirmation.
- User feedback identified a product-level failure: article cards exposed internal relevance/completeness scores, URL provenance and per-item image review controls inline; the quality dashboard rendered dense technical diagnostics in the reading flow. The documented ChatGPT continuation action was also omitted from the actual response.
- Implemented on branch `ux/presentation-cleanup`: concise article cards show title/category/source/date; per-article candidate review, global review tools and technical quality diagnostics are collapsed by default; raw RSS source links and internal scores are removed from the public card.
- Added structural regression checks for collapsed disclosures and clean card content. Pending PR/Actions/Pages verification; real browser/mobile appearance and interaction remain unverified.
- Honest scope: this improves presentation, not the underlying content coverage. The 273-record repeated legacy thumbnail group remains unverified and is not deleted or relabeled.


## 2026-11-25 — Article discovery reading quality correction (PR/CI pending)
- Verified base main before this cycle: `cf732a816e0ea645df8b52160f32434ea60043b3`. PR #6 is merged as `89d6ecf`. Actions #570 and #571 both completed successfully; each ran 134/134 tests (0 failures), and all workflow steps including data validation, data commit and Pages deployment succeeded. #571 head: `3fbfc6ea10096b711bdf9b3bddc476a02e25dae3`.
- Actual dataset audit (699 discovery candidates): 514 classified as article candidates and 185 as video/fancam candidates. Title keyword matches: 426 article candidates mention Haewon/해원; 440 mention NMIXX/엔믹스. These are deterministic title-match counts, not human relevance-accuracy estimates.
- 644/699 descriptions contain RSS HTML markup and a URL-bearing anchor. The old card renderer assigned the raw description to `textContent`, which explains the visible HTML/URL clutter. The article list also mixed 185 video/fancam candidates into the news section. The category renderer was defined but never called, leaving the category controls unmounted.
- Thumbnail audit: 316/699 have a thumbnail URL, but 273 share one unverified legacy Google-hosted URL with no per-article provenance. Only 43 assignments have recorded `og:image`/`twitter:image` provenance. The repeated 273 assignments are now hidden in the public card preview (not deleted or relabeled); their records remain available for review.
- Implemented on `ux/article-reading-filter`: sanitize titles/descriptions into plain text (strip HTML tags and embedded URLs); separate video candidates from article cards; default the article list to title-matched Haewon items; add NMIXX-related and all-article scopes; mount category filters; hide the unverified shared legacy thumbnail from per-article previews; add relevance counts to generated quality metrics; improve mobile filter touch targets.
- Regression tests cover text sanitization, relevance scopes, video/article separation, metrics, mounted category controls and hidden unverified shared thumbnails.
- Pending: PR Actions and Pages deployment for this branch. Real browser/mobile appearance, keyboard operation and link behavior remain unverified. No claim of visual QA is made.


## 2026-11-25 — Verified-original-URL default (PR/CI pending)
- Latest deployed main before this refinement: Actions #574, 138/138 tests, all collection/validation/data-commit/Pages-deploy steps successful; post-run data commit `8ea01f32315855e2672c7b2f8b9635e0698c905b`.
- Recounted the 699-record dataset after #574: 514 article candidates, 185 video candidates; 54 article candidates have explicit publisher HTTPS URLs; 48 of those have Haewon/해원 in the title. The wider title-only scopes remain 426 Haewon and 440 NMIXX article candidates.
- Changed the default article scope from all 426 Haewon title matches to the 48 Haewon articles with an explicitly recorded, valid HTTPS publisher article URL. Broader candidate scopes remain available as separate controls; no records are deleted.
- Added URL validation rejecting HTTP, root-only, credential-bearing and Google wrapper URLs from the verified default scope. Generated quality metrics now distinguish verified publisher articles and verified Haewon articles.
- Pending PR/Actions/Pages validation. Browser/mobile visual checks remain unverified.


## 2026-11-25 — Verified-article thumbnail coverage metric (PR/CI pending)
- Latest deployed main: Actions #577, 139/139 tests passed; all collection, validation, data commit, artifact upload and Pages deployment steps succeeded. Run head `5e1671d260930dbddb3f75091fcc45260072ef5f`; data refresh commit `e6811cbe4652c60931971f74ae210701df8d10c5`. Pages artifact: 424,033 bytes.
- Latest data: 701 candidates; 515 article candidates and 186 video candidates; 55 article candidates have explicit publisher HTTPS URLs; 49 have Haewon/해원 in the title and pass the verified-URL scope.
- Among the 49 default-scope Haewon articles, 39 have an HTTPS thumbnail with recorded `og:image` or `twitter:image` provenance; 10 do not. This is provenance coverage, not a visual relevance judgment.
- Overall thumbnail assignments: 317/701; 273 remain one shared unverified legacy URL; 42 `og:image` + 2 `twitter:image` are provenance-known; 384 records have no thumbnail. The shared 273 remain suppressed in article previews but retained in data.
- Added generated metrics for provenance-backed thumbnail coverage within verified publisher articles and verified Haewon articles, and exposed those counts in the collapsed diagnostics. Tests added.
- PR/Actions/Pages validation for this metric addition is pending. Browser/mobile visual verification and human relevance labels remain outstanding.


## 2026-11-25 — Verified article thumbnail provenance metrics deployed
- PR #9 merged: `4e37a7e41a2d4e834f81e283248d7c061dd2f28a`.
- Actions #578 completed successfully: 139/139 tests passed, 0 failures; RSS/YouTube collection, quality metrics, archive/run-log validation, data commit, Pages artifact and Pages deployment all succeeded.
- Data refresh commit after the run: `373b72bb6e2c5b73faa13e3ab44c210ec4da642f`. Pages artifact: 425,550 bytes.
- Latest quality report: 701 candidates; 515 articles; 186 video candidates; 55 verified publisher articles; 49 verified Haewon-title articles; 43 verified publisher articles with provenance-backed thumbnails; 39 verified Haewon articles with provenance-backed thumbnails.
- Overall thumbnails: 317 assigned, 384 missing; 273 shared unverified legacy assignments remain suppressed from individual card previews; source provenance is 42 og:image + 2 twitter:image. Overall provenance coverage is 14%.
- The default article view is the 49 verified Haewon publisher articles. Wider Haewon/NMIXX/all-article scopes remain available.
- The run log records `github_push`, success and passed validation, but its `sources` array still only describes YouTube; news results remain in the separate news status file. This operational-log gap remains open.
- Browser/mobile visual QA and human relevance/thumbnail labels remain unverified. Source provenance does not prove visual relevance.


## 2026-11-25 — Operational run log source coverage (PR/CI pending)
- Latest main before this change: `c2b9707d0549b8fb881cb6f534146b3dd2f2faf0`; Actions #579 passed 139/139 tests and deployed Pages.
- Confirmed defect: `data/run-logs/<runId>.json` listed only `nmixx-youtube`, even though the same workflow also ran Google News RSS and Bing News RSS. Detailed RSS outcomes existed only in `data/news-collection-status.json`.
- Implemented on `ops/include-news-sources-in-run-log`: run log now records separate `nmixx-youtube`, `google-news-rss`, and `bing-news-rss` source outcomes and item counts. Overall status becomes partial if one source fails while another succeeds; error codes are sanitized constants.
- Added tests for complete, partial and mixed source outcomes. PR/Actions/Pages validation pending.


## 2026-11-25 — RSS source outcomes now included in operational logs
- PR #11 merged as `f86d3f72325873d0f6ffa25ffb4f6f20722e2abd`.
- Actions #580 completed successfully: 142/142 tests passed; all collection, quality, validation, data-commit, artifact-upload and Pages-deployment stages succeeded.
- The persisted `data/run-logs/45508560515.json` now records all three sources: NMIXX YouTube (15), Google News RSS (73), Bing News RSS (32); all three succeeded and validation passed.
- Latest data commit: `92eb392cf8db69d0b6769528302df33dd2d30d65`.
- Content baseline remains 701 candidates: 515 articles, 186 videos, 55 verified publisher articles, 49 verified Haewon articles, 39 verified Haewon articles with provenance-backed thumbnails. Thumbnail state: 317 assigned, 384 missing, 273 unverified shared legacy assignments retained but hidden from article previews.
- Browser/mobile visual QA and human relevance/thumbnail labels remain unverified.


## 2026-11-25 — Conversation continuation action regression
- Reaffirmed the mandatory bottom-of-response ChatGPT action label **🔄 연구 기반 재귀개선 계속하기**.
- User-typed messages and corrections must not suppress the action. The action submits the full reusable recursive-improvement prompt from `CHATGPT_OPERATING_RULES.md`; a textual label alone is insufficient.
- The requirement was already present in operating guidance; this update addresses the failure to render the action in the actual assistant response. Documentation commit: `653405c1f422e53d67cf43ea13250d6abe7332d9`; follow-up session-log commit is being recorded separately. Verify Actions/Pages for the resulting commits.



## 2026-11-25 — Fresh audit: main, PR queue, Actions and Pages

- Re-read GitHub state. Main remains `37998b31b12b2eb9980cff6df616b2f677a10de6`. No PR was merged or closed in this audit.
- Production Actions run #587 (run ID `45556461352`) used workflow head `d85484c426ef0f67e3a3ddf16da76276315664e1`; all 19 substantive steps succeeded: tests, YouTube/RSS collection, discovery sync, improvement cycle, quality metrics, both validations, data commit, Pages configuration, artifact upload and Pages deploy. The run produced a 434,230-byte Pages artifact. Its successful deploy step is not independent browser/mobile QA.
- Current production workflow still uses checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. PR #26 proposes Node24-compatible pinned releases; production migration is not yet verified.
- Latest main quality data: 707 candidates (521 articles, 186 videos), 61 publisherArticleUrl values, 321 assigned thumbnails, 273 shared legacy assignments retained, 386 missing thumbnails, 49 unique thumbnail URLs. Of the 61 publisher URLs, 3 are X/social URLs; PR #27 is still unmerged. The current run's metrics show 60 verified publisher articles and 51 verified Haewon articles, so social URL exclusion has not reached production.
- The 273 repeated legacy assignments remain preserved and excluded from individual article preview; do not delete or bulk-replace them.
- PR #25–#28 remain open, each 0 commits behind main. Their passing runs are temporary push-triggered read-only snapshot runs, not PR-event checks: #25 144/144, #26 142/142, #27 147/147, #28 145/145. PR #28 live public RSS sample: Google 57 items (57 source URLs, 0 publisher article URLs, 0 image signals); Bing 36 items (36 explicit article URLs, 0 image signals); 93 fetched, 85 unique, 8 duplicates, 2 additions. This demonstrates missing feed-provided image metadata, not a parser failure.
- PRs #13–#16 are 8 commits behind main; #20/#22–#24 are 6 commits behind. PR #14 is mergeable=false and its 8-file diff is documentation-only. Main's 8 intervening commits changed BUTTONS_AND_ACTIONS.md, PROJECT_STATUS.md and SESSION_LOG.md, overlapping PR #14's edits to all three; do not merge the stale branch wholesale.
- Pages API read was rejected by the GitHub connector, so Pages configuration is verified by the workflow step, not by an independent API read. Mobile browser, visual layout, keyboard and deployed content QA remain unverified.
- Official GitHub notice: Node 20 was removed from Actions runners on 2026-09-23; JavaScript actions now run on Node 24. Keep PR #26 as a production compatibility gate. Source: https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/


## 2026-11-25 — Late-session live audit
- Main remains 37998b31b12b2eb9980cff6df616b2f677a10de6. Main workflow still uses checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4.
- PRs #13–#30 are open and unmerged. Ahead/behind main: #13 59/8; #14 134/8; #15 3/8; #16 13/8; #20 17/6; #22 13/6; #23 15/6; #24 9/6; #25 17/0; #26 8/0; #27 19/0; #28 4/0; #29 7/0; #30 19/0. PR #14 remains mergeable=false; do not merge its stale documentation branch wholesale.
- PR #30 head 243a676b730772bbf74fec2827b9fe6f17f1d06f received genuine pull_request run #45570252997; checkout, setup, unit tests and archive validation succeeded. The workflow is not active on main until approved and merged.
- Production run #587 / #45556461352: 142/142 tests; collection, quality, validation, data commit, Pages configuration, 434,230-byte artifact upload and deploy step succeeded. Artifact SHA-256 8ffb3b7cbb28e53622ee348bddc50a8264a8cc5f270d81feb1a93bc0742bb6df. Browser/mobile QA remains unverified.
- The exact Sportskeeda article URL was re-opened on 2026-11-25 and returned HTTP 405. PR #25 tests simulate 405 and assert method-not-allowed, seven-day backoff, article retention and no method fallback; latest PR head has no genuine PR-event run.
- PR #26 snapshot #45564928105 passed 142 tests and validation, but did not exercise production Pages deployment. Its Node24-compatible action pins remain a proposal pending approval.
- PR #27 head fb531e4a4d22ed050f0b6242e76fec2d0550f74f is 19 ahead/0 behind. Push snapshot #45616074455 passed 148/148 and validation; it is not a PR-event run or production result. The Bing X-status fix preserves the candidate but excludes publisherArticleUrl and metadata enrichment.
- PR #28 live Google/Bing RSS sample has zero image signals. Parser support cannot create absent feed metadata. Preserve all 273 shared legacy thumbnails.
- Production data remains 707 candidates, 61 publisherArticleUrl values including 3 X/social URLs, 60 verified publisher articles, 51 verified Haewon articles, 321 thumbnail assignments (273 shared legacy), 386 missing and 49 unique thumbnail URLs. Human image labels remain zero.
- No PR merged; main data and deployment were not changed by this audit.

## 2026-11-26 — Latest main, production and PR re-audit
- Current main: `3c93903c6e37839fd69e0a1a74851a3dac3e6174` (`data: refresh archive discovery and improvement cycle`). The data commit was produced by scheduled production run `45695468167`, whose workflow source SHA was `37998b31b12b2eb9980cff6df616b2f677a10de6`.
- Production run #45695468167: 142/142 tests, 0 failures; YouTube 15 items, Google RSS 135, Bing RSS 34; 24 new news candidates; metadata enrichment attempted 12, assigned 8, failed 3, missing 1. Validation, data commit, Pages configuration, 446,580-byte artifact upload and deploy step all succeeded. Artifact SHA-256 `ea394ffa5add0d8ffc8bdfc88673b145cf64fc6d7ebbb9870badc5ffe8d50bcc`.
- Main workflow still references checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. The actual production job emitted a Node.js 20 deprecation warning: these actions target Node20 but are forced to run on Node24. The run still succeeded. GitHub announced Node20 removal on 2026-09-23; do not describe the existing deployment as Node24-native.
- Latest production data: 729 candidates; 543 articles; 186 videos; 77 verified publisher articles; 67 verified Haewon articles; 55 publisher articles and 48 Haewon articles with provenance-backed thumbnails; 329 thumbnail assignments; 400 missing; 57 unique thumbnail URLs. Of the 329 assignments, 273 are the same unverified legacy URL. Human image labels remain 0; visual precision is unmeasured.
- Latest Google RSS diagnostics: 101 items, 98 site-level source URLs, 0 explicit publisher article URLs, 0 image signals. Bing RSS produced 34 candidates; the prior PR #28 sample (36 items) also had 0 image signals. PR #28 parser fixture tests are not proof of live feed image availability.
- All 14 currently open PRs remain unmerged. Current main comparison ahead/behind: #13 59/9, #14 134/9, #15 3/9, #16 13/9, #20 17/7, #22 13/7, #23 15/7, #24 9/7, #25 19/1, #26 8/1, #27 19/1, #28 4/1, #29 13/1, #30 19/1. PR #14 remains mergeable=false; do not merge its stale docs branch wholesale.
- PR #30 genuine pull_request run #45570252997 passed 142/142 tests and archive validation. It ran on a merge commit based on the previous main SHA 37998b31, not latest 3c93903. Its read-only workflow is not yet on main; it is not yet a shared CI gate for other PRs.
- No PR merged and no new source was added. Browser/mobile visual QA remains unverified.

## 2026-11-26 — Focused PR findings
- PR #25 latest head includes a further compatibility fix: seven-day backoff now also recognizes persisted `statusCode:405` even where the old record still says `errorCode:network-error`. This covers the current Sportskeeda diagnostic record. Commits: `3911e6238c0d352ab2aa2b78ea0216549a8d3e69`, `b152ebc4a291b824b6aef6dc3fc782b5f1412967`. A regression test covers day 1, day 6 and day 7. No PR Actions run exists for the latest head; test execution remains unverified.
- PR #26 action pins were checked against upstream action.yml and commit objects: checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1; JavaScript actions use Node24 and the upload composite uses upload-artifact v7.0.0 (Node24). Main production has not used these pins.
- PR #27 centralizes social URL rejection for Google/Bing article parsing, merge cleanup, metadata enrichment eligibility, publisher quality metrics and default verified-Haewon view. Main still counts 3 X URLs as publisherArticleUrl values; the PR has no PR-event run. Its earlier push snapshot #45616074455 passed 148/148 plus validation, but that is not a PR run or production evidence.
- PR #28 adds useful Bing RSS image parsing/diagnostics but its standalone patch still sets `publisherArticleUrl: articleUrl` and counts explicit Bing destinations as publisher URLs without the PR #27 social-host predicate. Do not merge #28 alone; port its image parser onto the shared-predicate version or sequence it after #27 with regression tests.
- Source policy remains: only NMIXX official YouTube Atom is automatically allowlisted. SBS RSS terms limit use to personal noncommercial use; Yonhap content terms likewise restrict use to personal/noncommercial, and the Korean Digital News Content Use Rules limit RSS to personal PC use and prohibit public redistribution/re-RSS without permission. No new feed may be added to the public Pages collector without explicit publisher permission.

## 2026-11-26 — Additional quality-audit clarification
- The latest quality report's host summary still classifies Sportskeeda as `network-error`. A previous live fetch of the exact URL returned HTTP 405. The current summary does not expose that record's stored `statusCode`, so do not claim the persisted row definitely contains 405. PR #25's new statusCode fallback protects the legacy row if that field is present; whether a one-time data migration is needed remains unverified.
- The latest thumbnail response audit sampled 12 unique URLs: 11 returned image content and one Sportalkorea image URL returned HTTP 404. This is a small sample, not a global image-validity rate.

## 2026-11-26 — PR #30 refreshed against latest main
- After updating the PR #30 session log, genuine pull_request run #45704287050 checked merge commit `53b3d5b`, which merged PR head `fc619f0e623fdda9931f72e7f59da66c50c76b68` into current main `3c93903c6e37839fd69e0a1a74851a3dac3e6174`.
- The read-only job succeeded: 142/142 tests, 0 failures, and `npm run validate` succeeded. No artifact upload or Pages deployment was attempted.
- PR #30 is still open/unmerged. The shared PR CI workflow remains absent from main until user-approved merge.

## 2026-11-26 — Remaining legacy PR review
- PR #13's seven-dimension article review UI is still not in main. Current production review metrics remain 0 human labels; browser-local thumbnail review labels are not a substitute for article review. Branch is 9 commits behind main and needs a fresh merge-base review.
- PR #16 addresses a real metric ambiguity: current main reports `metaFound:56` from persisted metadata candidates beside `metaAssigned:8` from the latest run, producing a potentially misleading 14% ratio. Its branch adds separate latest-run attempted/found/assigned fields and persisted-thumbnail matching counts. Current main still calls the old two-argument comparison function. Rebase/integrate this after reviewing PR #27's shared URL predicate.
- PR #20 proposes date-first default sorting and explicit unresolved-video filtering. Current main still sorts news by relevance score first, then date; the requested date-first behavior is not deployed. PR #20 is 7 commits behind and should be refreshed before merge.
- PR #22 expands the search vocabulary to 36 terms with four-query run rotation; current production still requests four news queries per run and records searchPack 2. PR #23 adds optional YouTube Data API discovery; it is not active in main and must remain optional, quota-bounded and nonessential to the free core.
- PR #24 is a Cloudflare/GitHub App dispatch dry-run only. It does not implement the external scheduler or automated collection; no App, Worker or secret configuration is active.
- PR #15 is an older read-only PR-CI proposal and is 9 commits behind; PR #30 is the newer tested version. Keep #15 unmerged rather than duplicating the CI gate.

## 2026-11-26 — Live checkpoint and verification results
- Reconfirmed production main: `3c93903c6e37839fd69e0a1a74851a3dac3e6174`; scheduled Production run `45695468167` completed successfully. Its source checkout was `37998b31...`, then the collector committed refreshed data to main. Treat workflow success and current-main identity separately.
- PR #30 read-only verification `45704287050` succeeded on head `fc619f0e...`: unit tests and archive validation passed; it did not collect data, commit data, upload Pages or deploy. Its workflow remains only on the PR branch, not main.
- PR #25 latest code head `b152ebc4...` was tested on isolated branch `verify/pr25-http405-b152ebc4`. First attempt failed because `npm ci` requires a lockfile that this repository does not contain. The corrected read-only run `45718220250` passed 145/145 tests and `npm run validate`; the PR #25 branch itself was not changed by this test harness.
- A fresh HEAD-only thumbnail audit `45718297315` checked 12 unique URLs: 11 image responses, 1 HTTP 404 (Sportalkorea CDN), no unreachable, 429, or non-image successes. Audit workflow is on isolated branch `audit/thumbnail-head-sample-20261126`; no data or Pages writes.
- Current main metrics: 729 candidates (543 articles / 186 videos), 78 publisherArticleUrl values including 3 X URLs incorrectly counted, 329 thumbnail assignments, 57 unique thumbnail URLs, 400 missing. Preserve the 273-record legacy shared-image group. Human review labels remain 0.
- PR #27 social URL predicate and PR #28 Bing image parser are not integrated. PR #28 parser currently assigns an explicit Bing destination to publisherArticleUrl without applying PR #27's social-host predicate; merging independently risks reintroducing X misclassification. Require one combined patch and Bing X profile/post regression tests.
- PR #16's persisted-vs-latest-run metric separation and PR #20's date-first default sorting remain absent from main. Current main still uses relevance-first sorting and ambiguous comparison metrics (persisted metaFound 56 vs latest-run assigned 8). Keep these improvements as separate, testable changes.
- PR #26 Node24 action pinning is separate from PR #30 CI. Main production workflow still uses checkout/setup-node v4, configure-pages v5, upload-pages-artifact v4 and deploy-pages v4; the PR #26 pinned upgrade has not run or deployed.
- No PR merged. No new RSS source added. Browser/mobile visual QA remains unverified.

## 2026-11-26 — Merged code and production checkpoint
- Current main: `1bfb09e4a082188a0e79fe2aa2092cd7089005d8`.
- PR #30 read-only PR CI merged at `a55ec1d3...`; PR #31 combined social-safe Bing RSS, PR #25 HTTP 405 retry, PR #16 metrics and PR #20 date-first discovery merged at `ec20b983...`; PR #26 Node24 Pages action migration merged at `a88e765b...`.
- PR #31 genuine PR CI #45728565226: 158/158 tests, zero failures, validation passed. PR #26 latest-base PR CI #45728849319: 142/142 tests, zero failures, validation passed.
- Production run #45728961571 on the Node24 action pins succeeded: 158/158 tests, collection, validation, data commit, Pages artifact and deployment all succeeded. Node20 deprecation warning absent. Generated data commit `1bfb09e4...`.
- Latest data: 736 candidates (550 articles / 186 videos), 76 explicit publisher article URLs, 65 verified Haewon article candidates, 333 assigned thumbnails, 403 missing, 61 unique thumbnail URLs. The 273 unverified legacy shared-image assignments remain intact.
- Latest thumbnail audit: 12 unique URLs, 11 image responses and one HTTP 404 (Sportalkorea CDN); no non-image successful responses, unreachable URLs or rate limits. This is a small diagnostic sample, not a global rate.
- Latest run metadata enrichment: attempted 0 / found 0 / assigned 0; no new metadata fetches were needed in that run. Persisted candidate metrics remain separately reported.
- Search still uses pack 2, four queries per run: 오해원 방송 (36), 해원 엔믹스 기사 (110), NMIXX Haewon appearance (11), Haewon NMIXX event (19). Candidate counts are per query and overlap is possible; do not sum them as unique global records.
- No new RSS feeds were added. SBS/Yonhap and other publisher feeds remain excluded pending explicit applicable permission. No archive data was bulk-deleted or rewritten to remove the 273 legacy group.
- PRs #15, #16, #20, #25, #27, #28 were closed as superseded by merged PR #30/#31. PR #26 and #31 are merged. PR #29 is the documentation update PR. PR #13, #22, #23 and #24 remain separate future work.
- Browser/mobile visual QA is still not independently verified.

## 2026-11-26 — Query rotation merged and first live measurement
- Current main: `891b2d74c2b30341613e0b49f163e14f0e2b95df`.
- PR #32 merged at `1f7fc3fb624b827e91b2a797d7f4b7f63d2f8b79`: 36 editorial queries across six packs of six, deterministic KST morning/evening rotation, separate video/fancam discovery, and per-query yield/freshness diagnostics. PR #22 is closed as superseded.
- PR #32 genuine PR CI #45729777536 passed 160/160 tests and validation. An intermediate run #45729619855 failed because query URL normalization stripped the potentially meaningful `source` parameter; the filter was narrowed to known tracking parameters and regression tests now preserve content-bearing `source`/ `ref` parameters.
- First Production run using the six-pack query rotation: #45729843156 succeeded with 160/160 tests, collection, validation, data commit and Pages deployment. Node20 deprecation warning absent. Data commit: `891b2d74...`.
- Run used pack index 4 (sixth? zero-based pack 4 = fifth pack) in the KST morning slot. Google RSS returned 54 candidates, Bing RSS 20; 767 total candidates (580 articles / 187 videos), 85 verified publisher articles and 70 verified Haewon article candidates.
- Per-query sample: 오해원 팬미팅 기사 11 candidates / 0 explicit publisher URLs / 36% title-keyword proxy / median lag 13,481.6h; NMIXX Haewon festival 16 / 8 / 38% / 6,593.6h; Haewon stage appearance news 1 / 1 / 100% / 808.1h; 해원 공연 행사 11 / 1 / 64% / 9,304.6h; NMIXX Haewon showcase 13 / 10 / 62% / 9,710.6h; Haewon public schedule 2 / 0 / 100% / 38,497.8h. Title-keyword match is only a relevance proxy, not human-confirmed precision.
- One pack is only an initial sample. Do not prune or promote query packs based on this single run. Compare at least two more distinct packs and multiple cycles for unique yield, overlap, explicit publisher URL rate and publication lag.
- Thumbnail assignments 340, missing 427, unique URLs 68; 273 legacy shared-image assignments remain unchanged. Latest 12-URL response sample still has 11 image responses and one Sportalkorea HTTP 404; no unreachable, rate-limited or non-image successful responses.
- This run's metadata enrichment attempted 10, found 7, assigned 7, missing 1, failed 2.
- No new RSS feed source was added. SBS/Yonhap are still only discovery candidates via existing search providers; no publisher RSS feed allowlist expansion.
- PR #14 closed as superseded by docs PR #29; PR #22 closed as superseded by PR #32. PR #13, #23 and #24 remain separate.
- Mobile/browser visual QA remains unverified.

## 2026-11-26 — Human review and bounded publisher audit merged
- Current main: `48c0963e683c8e40e5454860e919d8439922a5f8`.
- PR #34 merged: Production `push: main` ignores Markdown-only changes; twice-daily schedule, manual workflow_dispatch and read-only PR CI remain enabled. This prevents docs-only merges from repeating a full collection and deployment.
- PR #35 merged: local seven-dimension article review UI, per-dimension summaries, legacy thumbnail evidence audit and bounded publisher accessibility audit. PR #13 is closed as superseded.
- Production run #45730919483 after PR #35 succeeded: 173/173 tests, validation, data commit, Pages artifact and deployment; Node20 deprecation warning absent. Generated data commit `48c0963...`.
- Current archive: 795 candidates (608 articles / 187 videos), 87 explicit publisher article URLs, 71 verified Haewon article candidates, 342 assigned thumbnails, 453 missing, 70 unique thumbnail URLs. The 273 unverified legacy shared-image assignments remain untouched.
- Legacy group audit: 273 assignments; 0 records with explicit publisherArticleUrl; 199 have sourceSiteUrl; 0 have explicit alternative thumbnail candidates; metadata outcome is not-attempted for all 273. No evidence justifies automatic replacement or deletion.
- Publisher accessibility audit: rotating HEAD-only sample of 12 out of 71 verified Haewon article URLs; 10 HTTP responses, 2 blocked (403), 0 paywall, 0 not-found, 0 uncertain. No GET fallback or access-control bypass.
- Thumbnail response sample: 12 unique URLs; 11 image responses and one HTTP 404 (Sportalkorea CDN); no unreachable, 429 or non-image successful responses.
- Six-pack query rotation remains at pack index 4 in the two latest push-triggered runs; these are repeated same-slot samples, not independent packs. Latest query rows: 54 candidates across six queries, with explicit publisher URL rates from 0% to 100% and very wide publication lag. Wait for the next scheduled KST evening slot (pack 5) before comparing a distinct pack.
- Human review UI stores labels in browser localStorage only. JSON export/import is manual; labels are not automatically uploaded or committed. Actual mobile visual QA is still unverified.
- No new RSS feed sources were added. SBS/Yonhap remain excluded as direct feeds pending explicit applicable permission.
- Only PRs #23 (optional YouTube API search) and #24 (Cloudflare/GitHub App dry-run) remain open. No API key, external app secret or paid service was configured.

## 2026-11-26 — Latest cycle record
- Main at start of cycle: `dde9b465...`; latest main after merges and production data commit: `891b2d74c2b30341613e0b49f163e14f0e2b95df`.
- PR #32 merged: 36 unique editorial search phrases across six packs, twice-daily KST rotation, query-level diagnostics. PR CI #45729777536 passed 160/160; Production #45729843156 passed 160/160, collection, validation, data commit and Pages deployment.
- First sample pack index 4: 54 Google RSS and 20 Bing RSS candidates; archive 767 candidates (580 articles, 187 videos), 85 verified publisher articles and 70 verified Haewon candidates. Query-level quality indicators are provisional; title-keyword match is not human-reviewed precision.
- Thumbnail state: 340 assigned, 427 missing, 68 unique URLs; 273 legacy shared-image assignments preserved. Latest 12-URL response sample: 11 image responses and one Sportalkorea HTTP 404.
- No new publisher RSS source. SBS/Yonhap direct feeds remain excluded pending explicit applicable permission.
- Mobile/browser visual QA remains unverified.
- **Required response invariant:** every completed cycle must end with the clickable “🔄 재귀개선 계속하기” action defined in BUTTONS_AND_ACTIONS.md. A manually typed user continuation does not waive this requirement.


## 2026-11-26 — Live repository audit and publication-freshness improvement
- Verified current main SHA: `68b467748d524d437d75ed5de33adbd4ced5e6c4`; no open PRs at audit time.
- Latest Production run #599 (`45732608330`) succeeded through tests, collection, data validation/commit and GitHub Pages deployment. Latest PR verification run #41 (`45742755947`) succeeded on the continuation-button documentation branch.
- Current production data at collection time: 797 discovery candidates; latest news pass fetched 76 candidates and added 4. Google RSS: 55 items, 0 explicit publisher article URLs and 0 image signals. Bing RSS: 21 items, 21 explicit publisher URLs and 0 image signals. Existing 273-record shared-thumbnail group remains preserved.
- Per-query publication-lag medians ranged from 808.5 to 38,498.2 hours in the current sample. This demonstrates a material freshness-measurement gap; title keyword match is only a proxy and must not be described as relevance precision.
- Implemented on a review branch: mutually exclusive publication-age buckets (within 7 days, 8–30 days, 31–90 days, over 90 days, unknown, future) and 7-/30-day candidate rates per query. This is diagnostic only: it does not delete or filter historical candidates.
- Verified: PR #41 merged; PR CI #42 passed 190/190 tests and archive validation. Production #600 passed collection, data validation/commit, Pages artifact upload and deployment. Mobile visual QA remains separate and unverified.
- Automation remains GitHub Actions twice daily. Cloudflare dispatch is dry-run-only; no external scheduler is active. No paid service, new publisher RSS source, external contact or secret transfer was used.


## 2026-11-26 — Publication freshness diagnostics verified in Production
- PR #41 merged successfully as `fa4c91474e6edee71c8b3416e569bf5b3cef98a4`; latest main data commit is `4643892a7d1a293adaafe8d7c926011b0027fd5e`.
- Genuine PR run #42 (`45748429788`) passed 190/190 tests, 0 failures, and `npm run validate` confirmed the current archive. PR #41 was mergeable and merged after CI success.
- Production run #600 (`45748513047`) succeeded end-to-end: tests, one collection pass, validation, data commit, Pages artifact upload and Pages deployment. Run log is schema-valid and records 23.7 seconds duration.
- Production sample pack 5: 69 incoming candidates, 62 unique URLs, 23 newly added; 6/6 Google and 6/6 Bing queries succeeded. Current archive: 818 discovery candidates, 187 discovery-video candidates and 20 official-feed video records.
- Freshness results: 0/69 within 7 days; 8/69 (11.6%) within 30 days; 15/69 in days 31–90; 46/69 older than 90 days; 0 unknown and 0 future dates. This confirms that search-result freshness is a real limitation; it does not establish low relevance or justify destructive filtering.
- Google RSS: 27 items, 0 explicit publisher article URLs, 0 image signals. Bing RSS: 42 items, all 42 with explicit publisher URLs, 0 RSS image signals. No new publisher feed was added.
- Thumbnail enrichment: 9 attempts, 7 found and assigned, 2 missing, 0 failed. Archive thumbnail state: 349 assigned, 469 missing, 77 unique URLs; all 273 unverified legacy shared-image assignments remain preserved.
- Mobile browser/tap-target/visual QA remains unverified. Deployment success is not a substitute for that review.


## 2026-11-26 — Mobile-friendly human-review queue improvement (PR pending)
- Current main at cycle start: `a3e0bfd6c316ca5f789fa0af75fa7cee071d1167`; open PRs: 0. Latest Actions: PR CI #42 and Production #600 succeeded, but both predate the current docs-only main commits; Production data commit remains `4643892a7d1a293adaafe8d7c926011b0027fd5e`.
- Current review baseline: 75 eligible verified-Haewon article candidates; `data/relevance-reviews.json` is empty (`[]`); human-reviewed relevance precision remains unavailable. Review labels stay browser-local and require manual JSON export/import.
- Chosen bottleneck: make the existing seven-dimension human review queue practical on a phone by filtering incomplete records and jumping to the next incomplete article. No automatic upload or public-label publication is introduced.
- Implemented on branch `feat/review-queue-mobile-20261126`: pure queue helpers, pending-only filter, next-pending navigation, and automatic removal from the pending view when all seven dimensions are complete. Uncertain is a valid explicit judgment and counts as reviewed, not as positive relevance.
- PR CI, archive validation, merge and post-merge Production/Pages verification pending. Mobile visual/tap-target QA remains unverified until a real browser check.
- No candidate deletion, RSS expansion, external contact, paid dependency, secret transfer or change to the 273 legacy thumbnail group.


## 2026-11-26 — Review queue PR merged; Production verification running
- PR #42 merged successfully as `753b4323c4712c7a5580d336b30240894cca73c0`.
- Genuine PR CI #43 (`45751819231`) passed 192/192 tests, zero failures; archive validation passed with 818 discovery candidates, 20 official video records, 6 query metrics, 0 relevance-review labels and 172 schema-valid run logs.
- Production run #601 (`45751857291`) was triggered by the code merge and is currently in progress. Collection/data commit/Pages deployment are not yet confirmed.
- Mobile real-device QA remains unverified.


## 2026-11-26 — Review queue Production #601 verified
- PR #42 merged as `753b4323c4712c7a5580d336b30240894cca73c0`; PR CI #43 (`45751819231`) passed 192/192 tests, zero failures, and archive validation.
- Production #601 (`45751857291`) completed successfully: 192/192 tests, YouTube/news collection, validation, data commit, Pages artifact upload and deployment. Generated data commit: `45af9e62b6b06da3abf99399897c5c6f0b186475` (parent: PR merge SHA).
- Latest main after documentation checkpoint: `50786b74664a7cf680f008ac6b905cd3904823f7`; generated data commit is an ancestor. Open PRs: 0.
- Production data: 855 discovery candidates (668 article / 187 video); 76 verified Haewon article candidates; 98 verified publisher article candidates; 351 thumbnail assignments, 504 missing, 79 unique URLs. The 273 legacy shared-image assignments are still preserved.
- Run #601 news sample: 94 fetched / 88 unique / 39 added; Google and Bing each completed all 6 query requests. Pack 5 had 0/94 within 7 days and 7/94 within 8–30 days; 70/94 were older than 90 days. Do not infer relevance precision from title proxies or change pack selection from this single run.
- Metadata enrichment attempted 2, assigned 2, missing 0, failed 0. Thumbnail response audit: 11/12 image responses, one Sportalkorea 404.
- Review labels remain 0 in repository; the new pending-only/next-pending controls are deployed, but the real mobile visual/tap-target QA remains unverified. Public-site web preview could not be fetched by the research browser; Actions deployment success is confirmed.


## 2026-11-26 — Review queue auto-advance (PR #43 pending)
- Live baseline rechecked: main `9beb7c115af632679d916c600a7be872f74ba2fc`; zero open PRs before this cycle. Latest known production checkpoint remains #601 with generated data commit `45af9e62b6b06da3abf99399897c5c6f0b186475`; the latest Actions run list could not be retrieved through the available GitHub connector in this cycle, so no newer run is claimed.
- Follow-up diagnosis: after the final one of seven review dimensions is completed in pending-only mode, the row is removed by a full render but focus is not advanced. This interrupts consecutive mobile review.
- PR #43 adds deterministic next-pending selection, advances after completion, wraps to the first remaining pending article, and announces the all-complete state. Labels remain localStorage-only with manual JSON import/export.
- Added regression tests for forward progression, wraparound and empty queue. PR CI/archive validation and merge remain pending at this checkpoint; real mobile/device QA remains unverified.
- No data files, sources, secrets, legacy thumbnails or collection behavior changed. No paid service, automatic upload or new RSS source was added.


## 2026-11-26 — PR #43 merged; Production #602 running
- PR #43 merged successfully as `c77d605cde6eac9476f7d187f77ac6c9c646adee`.
- PR CI #47 (`45752743361`) passed on the final PR head `4a2e4557d6081ec17dc9453833a9b9263a55185c`: 193/193 tests and archive validation passed.
- Production run #602 (`45752794835`) is running on main SHA `c77d605cde6eac9476f7d187f77ac6c9c646adee`. Collection/data commit/Pages deployment are not yet verified at this checkpoint.
- Open PRs: 0. Real mobile visual/device QA remains unverified.


## 2026-11-26 — PR #43 and Production #602 fully verified
- PR #43 merged as `c77d605cde6eac9476f7d187f77ac6c9c646adee`; PR CI #47 passed 193/193 tests and archive validation.
- Production #602 (`45752794835`) completed successfully on the merge SHA: 193/193 tests, collection, validation, generated data commit, Pages artifact upload and Pages deployment.
- Generated data commit: `96a79935d85f23b17887b3ab20b95b780f1ab234`. Pages artifact ID `15086646238`, size 563,048 bytes, SHA-256 `f300b9b7537d901a53d56374aac7a8d0eeaf4d7987047be01c6f615f17b6538b`; deployment created for `c77d605cde6eac9476f7d187f77ac6c9c646adee`.
- Production dataset: 856 candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles; 352 thumbnail assignments, 504 missing, 80 unique URLs. All 273 legacy shared-image assignments remain unchanged.
- News collection: 99 fetched / 92 unique / 3 added; six of six queries succeeded on Google and Bing. Google RSS had 56 items but zero explicit publisher article URLs and zero image signals; Bing RSS had 43 explicit publisher URLs but zero image signals. Thumbnail enrichment attempted 1 and assigned 1.
- Final main after documentation checkpoints: `dd06a9638e8bf4e7365e1b66e21f4dedd08ed6f5`; open PRs: 0. Real mobile visual/device QA remains unverified.


## 2026-11-26 — Mobile review accessibility and safe backup (PR #44)
- Baseline main at cycle start: `3d35001afe150e352769e95b269ff3195cdb7a57`; open PRs 0. Production #602 succeeded; generated data commit `96a79935d85f23b17887b3ab20b95b780f1ab234`; Pages artifact `15086646238` was uploaded and deployment created for the PR #43 merge SHA.
- Rechecked PR #43 auto-advance code in main and current archive data: 856 candidates, 76 verified Haewon articles, 0 committed human-review labels; 352 assigned thumbnails, 504 missing; 273 legacy shared-thumbnail assignments preserved.
- Repository has Node's built-in test runner only (`node --test`), no Playwright/Puppeteer dependency or browser-test config. Avoid adding a paid or unnecessary browser dependency. CSS/UI contract tests do not substitute for real device QA.
- PR #44 adds 44px minimum review control targets, narrow-screen layout, visible keyboard focus, transactional localStorage writes, and clearer JSON import/export success/failure messages. Imports remain schema-validated and browser-local; no automatic upload.
- PR CI #48 passed 195/195 tests, zero failures, and archive validation (856 candidates, 20 videos, six query metrics, zero human labels, 174 schema-valid run logs). PR #44 merge and subsequent Production/Pages verification pending at this checkpoint.
- Real Android/mobile visual and touch QA remains unverified.


## 2026-11-26 — PR #44 and Production #603 verified
- PR #44 merged as `a81bbdbded2841aa9c45beaa74c5c98b22ae7891`; PR CI #51 (`45753687344`) passed 195/195 tests, 0 failures, and archive validation.
- Production #603 (`45753737275`) completed successfully on merge SHA `a81bbdbded2841aa9c45beaa74c5c98b22ae7891`: tests, collection, validation, data commit, Pages artifact upload and Pages deployment all succeeded.
- Generated data commit `7753a02be1ad512a44348b67e483ee75038c6b7a`. Pages artifact `15086806938`, 568,237 bytes, SHA-256 `4c8191bd6feb35c6b183cec17297922e265f9b3b0e9e166373031a2b0591571b`; deployment created for merge SHA.
- Production data: 856 candidates (669 articles / 187 videos), 76 verified Haewon articles; 352 assigned thumbnails, 504 missing, 80 unique thumbnail URLs. The 273 legacy shared-image assignments remain unchanged.
- News run: 74 fetched / 67 unique / 2 added; Google and Bing 6/6 queries each. Google RSS 32 items / 0 explicit publisher article URLs / 0 image signals; Bing 42 items / 42 explicit publisher URLs / 0 image signals. Thumbnail enrichment attempted 0 and assigned 0.
- Review labels remain 0; real Android/mobile viewport, touch and visual QA remains outstanding. No browser automation dependency was added.
- Latest main after data commit: `7753a02be1ad512a44348b67e483ee75038c6b7a`; no open PRs.


## 2026-11-26 — Review JSON safeguards and compact queue (PR candidate)

Baseline main 8eca12b0f2ca032b58135d206a1141dbaa49c8a4; open PRs 0. Production #604 (45759271205) passed 195 tests, collection and validation. Generated data commit fbfaa5512ebff0c93db70ff11d7ee9bb4ad01b54. Pages artifact 15088809574, 571098 bytes, SHA-256 a4b872c7a4b335b6d6dc8344f1e408a72bb03babc77d164988e6e2162857df8d; Pages deployment reported success for 8eca12b0f2ca032b58135d206a1141dbaa49c8a4. Data: 856 candidates, 76 verified Haewon articles, 0 human labels, 352 thumbnails assigned / 504 missing; 273 legacy shared-image assignments retained. Production #604 news: 67 fetched / 60 unique / 2 added; Google and Bing each 6/6 queries. Google RSS 26 items, 0 explicit publisher URLs, 0 image signals. Bing RSS 41 items, 41 explicit publisher URLs, 0 image signals. Thumbnail enrichment 0 attempted / 0 assigned.

PR candidate adds pure Node JSON export/merge helpers, round-trip and invalid-import tests, and collapsed per-article review disclosures. Next-pending opens the selected disclosure before focus/scroll.

No Playwright/Puppeteer dependency, backend, automatic review-label upload, new RSS source, query-pack edit or bulk thumbnail operation.

Real Android/mobile visual, touch, focus and download/import QA remains unperformed and must not be inferred from CI.


## 2026-11-26 — PR #45 merged and Production #605 verified
- PR #45 merged as ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba. Its final genuine PR CI run 45761773556 passed 199/199 tests, 0 failures, and archive validation (856 discovery candidates). An earlier CI attempt failed because imported labels replaced entire existing rows; the merge helper was corrected to merge per dimension, preserving untouched fields, and the rerun passed.
- Production #605 run 45761832690 succeeded end-to-end on merge SHA ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba: 199/199 tests, collection, validation, generated data commit, Pages artifact upload and Pages deployment.
- Generated data commit e923ffa726fd0d942155645660ba5a9786afad11. Pages artifact 15089978823, 573273 bytes, SHA-256 8ba6e1492ea761a0d99332600865eb404b9d39e46cf5684c84fac5b596b9f072. Deployment created for merge SHA and reported success.
- Latest data: 856 candidates (669 articles / 187 videos), 76 verified Haewon articles, 0 committed human labels, 352 assigned thumbnails / 504 missing; 273 legacy shared-image assignments remain unchanged. Thumbnail provenance: 72 OG:image, 5 twitter:image, 1 link:image_src, 1 twitter:image:src and 273 unverified legacy assignments. No legacy replacement/deletion.
- Production #605 news: 94 Google and 38 Bing RSS items seen; 6/6 queries succeeded on each provider; 94 fetched / 87 unique incoming / 2 added. RSS image diagnostics: Google 56 items, 0 explicit publisher URLs, 0 image signals; Bing 38 explicit publisher URLs, 0 image signals. Thumbnail enrichment 0 attempted / 0 found / 0 assigned.
- PR #45 adds validated JSON export/import round-trip helpers, merges per dimension while preserving unrelated local labels, filters imported IDs to eligible articles, and collapses review rows by default. Next-pending opens the active row before focus/scroll. Labels remain localStorage-only; JSON transfer is manual.
- No browser automation dependency, backend, automatic upload, new RSS source, search-pack modification or thumbnail reassignment was added. No actual Android/mobile QA was performed. Node tests and Pages deployment are not device QA.
- Next manual Android Chrome pass: narrow viewport; expand/collapse row; tap seven selects; use next-pending and verify open/focus/scroll; refresh to verify persistence; export and re-import JSON; confirm per-dimension merge and no network upload. Do not clear storage to simulate quota errors.


## 2026-11-26 — Thumbnail missing-source breakdown from all 856 discovery records
- Parsed the current main data/discovery.json blob directly and counted all 856 records: exactly 504 have no thumbnail URL. By discovery source: Google News RSS 480; Bing News RSS 24; other sources 0.
- Google 480: 468 are metadata not-attempted with no explicit publisher article URL; 12 are wrapper-only with no publisher article URL. The Google wrapper is not decoded or treated as an article/image source.
- Bing 24: 13 metadata status missing (6 HTTP 200 with no image candidate and 7 with no recorded response code); 10 failed metadata attempts with an explicit publisher article URL (8 HTTP 403 forbidden, 1 HTTP 405 method-not-allowed, 1 HTTP 405 network-error); 1 failed HTTP 403 with no publisher article URL.
- These figures explain the present data gap without assuming the articles have no images on their publisher pages. The 13 missing/10 failed Bing outcomes are metadata-fetch results, not visual suitability judgments.
- Separate assignment state: 352 thumbnail URLs assigned, comprising 273 unverified legacy shared-image assignments and 79 provenance-backed assignments (72 og:image, 5 twitter:image, 1 link:image_src, 1 twitter:image:src). All 273 legacy assignments remain untouched; their audit still reports 0 publisher article URLs, 199 site-level source URLs and 0 alternative candidates.
- No automatic replacement/deletion, wrapper decoding, access-control bypass, new RSS source or search-pack change was made. Continue evaluating only explicitly supplied HTTPS image candidates and preserve source provenance.


## 2026-11-26 — Explicit storage-failure behavior test (PR candidate)
- Rechecked main at `c6d297622a8a5c2022bd852c5b8661e58b6c10f8`: 0 open PRs; latest Production #605 run `45761832690` completed successfully on merge SHA `ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba`; latest generated data commit remains `e923ffa726fd0d942155645660ba5a9786afad11`; Pages artifact `15089978823` uploaded and deployment reported success. No newer Production run was present at the audit time.
- Re-read all six project documents and inspected deployed review UI/module/tests. The review UI has seven dimension selects plus an additional optional category correction field; rows are collapsed by default, and next-pending opens/focuses the selected row. Labels remain localStorage-only with manual JSON export/import.
- Gap found in test quality: prior storage-failure test only asserted source text, not the behavior of a throwing storage adapter. Added pure helper `persistArticleReviewLabels(storage, key, current, next)` that returns the prior labels unchanged if `setItem` throws, and commits next labels only after storage accepts the serialized value. UI now uses this helper.
- Added deterministic Node tests with a simulated `QuotaExceededError` and a successful storage adapter. This is a storage contract test, not a real Android quota test or browser test. PR CI is pending; do not treat these tests as passed until workflow evidence arrives.
- No Playwright/Puppeteer, backend, automatic upload, new RSS source, search-pack change, collection change or thumbnail mutation. Human review labels remain 0; 273 legacy shared thumbnails remain untouched; 504 missing thumbnails remain as previously diagnosed.
- Actual Android Chrome QA is still outstanding. User can validate collapsed rows, all seven selectors, next-pending focus/scroll, refresh persistence, JSON export/import, and manual network observation in Chrome. No storage clearing or risky quota manipulation is needed.


## 2026-11-26 — PR #46 verification correction
- PR #46 head `46ad9baa0f82877fbcd6b01cef1640da1276bd11` passed the rerun CI #55 (`45778972275`): 201 tests passed, 0 failed; `data/discovery.json` validated with 856 candidates. The earlier CI #54 (`45778885121`) failed only because an existing source-contract assertion still expected the old inline assignment; the assertion was updated to check the extracted transactional helper. PR #46 was squash-merged as `8edb0e1b836061967466d018189292c5f5d5b3b0`.
- Production #606 (`45779027835`) was triggered on merge SHA `8edb0e1b836061967466d018189292c5f5d5b3b0` and was still in progress at this documentation checkpoint. Do not mark its collection, data commit or Pages deployment successful until independently confirmed.
- Storage-failure behavior is now covered by pure Node tests: simulated QuotaExceededError preserves the prior labels; successful storage commits the complete next value. This does not simulate a real phone's browser quota or prove actual Android UX.


## 2026-11-26 — Production #606 final verification
- Production #606 run `45779027835` completed successfully on merge SHA `8edb0e1b836061967466d018189292c5f5d5b3b0`. It ran 201/201 tests, archive validation passed with 856 discovery candidates, generated data commit `78dbc39663e56a9165affb7ddf317cae0ba4b215`, uploaded Pages artifact `15097491496` (584,825 bytes; SHA-256 `71a771fb66b224455312bfe548f6b50dceb1bfc842ebb4508dd2f0a94f71d093`) and Pages deployment reported success for the merge SHA.
- Production run log: 15 YouTube candidates discovered, 0 accepted, 15 duplicates; Google News RSS 71 items, Bing News RSS 40 items; all 6 Google and all 6 Bing queries succeeded. News collection fetched 71, 64 unique incoming, 2 added. Google RSS image signals 0/31; Bing RSS image signals 0/40; thumbnail enrichment attempted 0 / assigned 0. Search pack remains 5.
- Latest data still contains 856 candidates, 352 assigned thumbnails / 504 missing, 273 unverified legacy shared assignments retained, and 79 provenance-backed assignments. Thumbnail review: 482 eligible, 0 reviewed; article human review labels remain 0. No search-pack or thumbnail reassignment change was made.
- PR #46 was merged as `8edb0e1...`; PR CI #55 passed 201/201 tests and validation. The earlier PR CI #54 failure was an outdated source-contract assertion; the assertion was updated and the rerun passed.
- Real Android Chrome visual/touch/focus/refresh/download-import QA remains outstanding. Do not claim it from CI or deployment. Labels remain localStorage-only and manual JSON transfer only; no backend or automatic upload. No Playwright/Puppeteer dependency was added.


## 2026-11-26 — Post-PR #46 verified baseline
- Main: `61c7e63210651a7e86f4e08171833a0f50b49b06`; open PRs: 0 at audit time.
- PR #46 merged as `8edb0e1b836061967466d018189292c5f5d5b3b0`; PR CI #55 passed 201/201 tests and archive validation (856 candidates).
- Production #606 (`45779027835`) independently verified successful through collection, validation, generated data commit `78dbc39663e56a9165affb7ddf317cae0ba4b215`, Pages artifact `15097491496` and successful Pages deployment.
- Current archive: 856 discovery candidates; article review labels 0; thumbnail review 482 eligible / 0 reviewed; 352 thumbnail assignments / 504 missing. Preserve 273 legacy shared-image assignments.
- Current main UI/code contains collapsed review rows, seven review dimensions, next-pending open/focus/scroll, manual JSON import/export, per-dimension merge and transactional storage failure recovery.
- **Android Chrome QA: UNVERIFIED.** No user-reported device checklist was received in this cycle. CI, source inspection and Pages deployment are not device QA.
- Review labels remain localStorage-only with user-initiated JSON transfer; no automatic upload. Search pack 5 unchanged; no new RSS sources or bulk thumbnail changes.


## 2026-11-26 — Review UI failed-write rollback regression
- Fresh baseline main: `f3db7e17606386e04fe43895d4d3b48434ccce5a`; PR #47 merged; 0 open PRs at audit time. Latest PR CI #56 and Production #606 succeeded.
- Production #606 data commit: `78dbc39663e56a9165affb7ddf317cae0ba4b215`; Pages artifact `15097491496` (584,825 bytes; SHA-256 `71a771fb66b224455312bfe548f6b50dceb1bfc842ebb4508dd2f0a94f71d093`); Pages deploy step successful.
- New code finding: if a review field was saved successfully and a subsequent edit failed, the UI could revert to the value captured at initial render rather than the most recently saved value. Correction-category selector had the same stale fallback.
- Fix prepared on `fix/review-ui-rollback-to-latest-saved-label-20261126`: shared `getArticleReviewValue(labels, articleId, field)` reads the last committed label; both selectors now use it after failed writes. Regression covers successful first edit then simulated QuotaExceededError on second edit.
- Data baseline: 856 candidates; 669 article / 187 video; 99 verified publisher articles; 76 verified Haewon; 58 provenance-thumbnail verified Haewon. Article labels 0; thumbnail review 482/0; 352 assigned / 504 missing; 273 legacy shared-image assignments retained.
- Android Chrome QA remains **UNVERIFIED** pending user-reported checklist results. Review data stays localStorage + manual JSON only.

- Validation correction: initial PR CI run `45792852673` executed 202 tests but failed one new source-contract assertion because the test regex was over-escaped; application code and the sequence test logic were not the reported failure. The assertion escaping was corrected in commit `eaf649630c18b8607f4723ea0a2d91995fa698cd`. Re-run CI before merge; do not treat the first run as passed.

## 2026-11-26 — Final outcome: PR #48 and Production #607
- PR #48 (`fix: restore latest saved review values after failed edits`) merged successfully as `f78deda672750ee05ab12e9cb12477e24c304987`. It updates the review UI rollback to read the latest committed in-memory label for all seven dimensions and expectedCategory, with a regression test for successful edit A followed by failed edit B.
- PR CI #62 (`45792986157`) on final PR head `11bb2cb5d0c58a268ce7338285aed490c6db80ef` passed: 202 tests, 202 passed, 0 failed; archive validation passed with 856 discovery candidates, 0 human-reviewed article labels and 179 schema-valid run logs; no review labels were added.
- The earlier PR CI #57 failed only on an over-escaped test source regex. The assertion was corrected and the final #62 run passed. Intermediate superseded runs were cancelled; they are not final CI results.
- Production #607 (`45793067039`) completed successfully on merge commit `f78deda672750ee05ab12e9cb12477e24c304987`: 202/202 tests; collection and archive validation successful; generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; Pages artifact `15103711890`, 597,338 bytes, SHA-256 `42f7bd9540b7ce086d2eac5baee3f7934dff2a5452c35b241ed4d9fdac80961c`; deployment log explicitly says `Reported success!`.
- Latest generated metrics: 856 candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails. Thumbnail audit: 352 assigned / 504 missing; 80 unique URLs; 273 legacy shared-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed. Article human review labels remain 0. Google News wrapper-only metadata: 12 candidates, left untouched. No new RSS, no wrapper decoding, no access bypass, no search-pack change, no auto upload, no Playwright/Puppeteer.
- Latest main at this checkpoint is the generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; open PR search returned 0 after #48 merge. This documentation follow-up is a Markdown-only PR and does not trigger another Production run.
- Android Chrome QA remains **UNVERIFIED** because no user-reported device checklist was received. Pure Node tests, PR CI and Pages deployment do not constitute real-device QA.


## 2026-11-26 — Thumbnail review storage rollback fix (PR #50)
- Fresh baseline main: `88c61699108ec3854c35d23813a4fd4558e73730`; open PRs: 0 before this change. Latest prior PR CI #63 and Production #607 were successful.
- Code change on `fix/thumbnail-review-storage-rollback-20261126`: added `persistThumbnailReviewLabels` and routed individual candidate labels, repeated-image labels and JSON import through a transactional save gate. In-memory labels are replaced only after `localStorage.setItem` succeeds; failed writes retain the prior labels and restore the visible select to its last saved value.
- PR #50 CI #64 (`45794572903`) passed: 205 tests, 205 passed, 0 failed. Archive validation passed: 856 discovery candidates, 0 human article labels, 179 schema-valid run logs, 55 source summaries and 41 links checked.
- This PR does not alter collection, discovery data, RSS sources, search pack, thumbnail assignments or the 273 legacy shared-image records. It does not add a backend or automatic upload; review labels remain localStorage-only with manual JSON transfer.
- PR #50 has not yet been merged at this checkpoint. Production collection, generated-data commit and Pages deployment for this code change are therefore **PENDING** until merge and a separate Production run.
- Android Chrome visual/touch/focus/refresh/download-import QA remains **UNVERIFIED**. Node storage-adapter tests and CI are not device QA.


## 2026-11-26 — PR #50 and Production #608 final verification
- PR #50 merged successfully as `f8d27ee656b20847e293c8cd422b9d9de59ec4a0`; final PR head `7e22a7fdc057b8993881ff202a60cc0493927ca4`.
- Final PR CI #68 (`45794717623`) passed: 205 tests, 205 passed, 0 failed. Archive validation passed with 856 discovery candidates, 0 human article labels, 179 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #608 (`45794790709`) completed successfully on merge SHA. Test/collect/validate/data-commit, Pages artifact upload and Pages deployment steps all succeeded; deployment log explicitly reported `Reported success!`.
- Generated data commit: `d3d44f6252c7cdc8b01266d4779a54d262a8c029`. Pages artifact `15104173207`, 602,298 bytes, SHA-256 `e441ecf28b60a6d85ae6a86649f4083d9140f042e2f85cbd6611142b713d6e05`.
- Latest data metrics: 856 discovery candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails. Thumbnail assignments 352 / missing 504; 80 unique URLs; 273 legacy shared-image assignments preserved; 79 provenance-backed assignments; 482 thumbnail-review eligible / 0 reviewed; article human review labels 0.
- Production #608: 15 YouTube candidates, 0 accepted, 15 duplicates; Google RSS 71 and Bing RSS 40 items; all 6 queries succeeded for each provider; news fetched 71 / 64 unique incoming / 2 added. Thumbnail enrichment 0 attempted / 0 assigned. No collection coverage or thumbnail gain is claimed from this run.
- The six required continuity documents were updated in PR #50 before merge. This follow-up entry records final Production outcome.
- Android Chrome QA remains **UNVERIFIED**. CI and Pages deployment are not real-device testing.


## 2026-11-26 — Thumbnail next-review queue disclosure fix (PR #52)
- Fresh audit baseline main: `50644f26ee629c240d9e41c1fd119f7df4788c81`; open PRs 0 before this change. Latest PR CI #69 and Production #608 succeeded; Production data commit `d3d44f6252c7cdc8b01266d4779a54d262a8c029`, Pages artifact `15104173207` deployed successfully.
- Current metrics remain 856 candidates, 669 article / 187 video; 352 assigned / 504 missing thumbnails; 80 unique URLs; 273 legacy shared-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed; 76 verified Haewon articles / 0 human article review labels.
- Code finding: the “다음 미검수 후보” queue located the row and attempted scroll/focus, but each candidate's controls are inside a collapsed `details.thumbnail-review-disclosure`. The queue did not set the disclosure's `open` property, so the target controls could remain hidden when focus was attempted.
- PR #52 adds `revealThumbnailReviewRow`, opens the matching disclosure, then defers scroll/focus to the next animation frame. Unit tests cover opening and missing-row cases; integration test asserts open → scroll → focus order.
- Official basis: MDN documents that closed `details` content is hidden and setting `HTMLDetailsElement.open=true` reveals it: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details and https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/open
- PR #52 CI and merge are pending at this checkpoint. No Production collection, data commit or Pages deployment has run for this change.
- No collection sources, RSS, review labels, thumbnails, legacy assignments, or storage paths changed. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — PR #52 and Production #609 final verification
- PR #52 merged as `f9eb50cb35d51427facdbd199f7ac1cdff26a720`; final PR head `736833dfa01e162acec28e6fa0a0b5d7afc6b2ae`.
- Final-head PR CI #74 (`45796812639`) passed: 207 tests, 207 passed, 0 failed. Archive validation passed: 856 candidates at PR CI time, 180 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #609 (`45796902589`) completed successfully on merge SHA; tests/collection/validation/data commit and Pages deployment all passed. Deployment log explicitly reports `Reported success!`.
- Production generated data commit: `5351bc276aa5b1dd5c9286caf9a6156f273318e9`. Pages artifact `15105556263`, 606,867 bytes, SHA-256 `a90856560a15baff8d7c49f51ff75b4e6a1d884a7df195f64276d96b1af3f751`.
- Production #609 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google News RSS 71, Bing News RSS 43; run validation passed. Final archive: 857 candidates (670 articles / 187 videos), 352 assigned / 505 missing thumbnails, 80 unique thumbnail URLs; 273 legacy shared-image assignments preserved; 482 thumbnail review candidates / 0 reviewed; article human review labels 0.
- PR #52 is a UI visibility/focus fix only. No sources, RSS, thumbnail assignments, human review labels, or storage destinations changed. No collection improvement or thumbnail gain is claimed.
- Android Chrome QA remains **UNVERIFIED**; Node tests and Pages deployment are not device QA.


## 2026-11-26 — Thumbnail review auto-advance (PR candidate)
- Fresh baseline main: ed6f42d0f44be385b2b8c01b1201b803c93bb5e7; open PRs 0. Latest PR CI #75 succeeded; Production #609 succeeded, generated data commit 5351bc276aa5b1dd5c9286caf9a6156f273318e9, Pages artifact 15105556263.
- Latest production metrics: 857 discovery candidates; 352 thumbnail assignments / 505 missing; 80 unique URLs; 273 legacy shared-image assignments retained; 482 thumbnail review candidates / 0 reviewed; 0 human article relevance labels.
- Bottleneck: the thumbnail queue requires an additional “next pending” button click after every successful manual label save, despite the article review queue already supporting auto-advance.
- Branch feat/thumbnail-review-auto-advance-20261126 updates the existing queue after successful localStorage persistence only. It reuses the existing find-next, open-disclosure, scroll and focus behavior. Failed storage writes do not advance and preserve the prior label.
- Added an integration test that checks advancement is scheduled only after the successful persistence branch. PR CI and archive validation are pending.
- No labels were generated, uploaded or committed; no source/collection/thumbnail data changed. Preserve 273 legacy assignments; no new RSS, wrapper decoding, access bypass or paid dependency.
- Android Chrome QA remains UNVERIFIED until the user reports actual device results.


## 2026-11-26 — PR #54 and Production #610 final verification
- PR #54 merged as 8d2a6534371eaf302d703b98635a4db195dee175. Final-head PR CI #76 (45813584290) passed 208/208 tests, 0 failures; archive validation passed with 857 discovery candidates, 181 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #610 (45813683219) completed successfully on merge SHA 8d2a6534371eaf302d703b98635a4db195dee175. Test/collect/validate/data-commit, Pages artifact upload and Pages deployment steps all succeeded; deployment log explicitly reported “Reported success!”.
- Generated data commit: 46572b91bc23d3b74f91ae9954332858980346cd. Pages artifact 15114537998, 613,063 bytes, SHA-256 4d4bca14325820f3c0a3d83640ef620af86d60e4846438be8c4fad5895995295.
- Production #610 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google News RSS 94 items; Bing News RSS 39 items; archive validation passed. Current archive: 857 candidates (670 articles / 187 videos), 352 thumbnails assigned / 505 missing, 80 unique URLs; 273 legacy shared-image assignments retained; 482 thumbnail-review eligible / 0 reviewed; article human relevance labels 0.
- PR #54 changes only browser-local review interaction: after a manually selected label is successfully saved, the next pending candidate is opened, scrolled into view and focused. Failed storage writes preserve the previous label and do not advance. No review labels were created or uploaded.
- No collection sources, RSS, query pack, thumbnail assignments, labels, storage destination or backend changed. No new RSS, wrapper decoding, access bypass, paid service or external transmission. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — Repeated-image review auto-advance (PR candidate)
- Fresh baseline main 78f0d3854e1338c5a5c94705dc2fc54fbcaf4734; open PRs 0; PR CI #77 and Production #610 succeeded; data commit 46572b91bc23d3b74f91ae9954332858980346cd; Pages artifact 15114537998.
- Latest production: 857 candidates (670 articles / 187 videos), 100 explicit publisher article URLs, 76 verified Haewon articles, 352 thumbnails assigned / 505 missing, 80 unique URLs, 273 legacy shared-image assignments, 482 thumbnail-review eligible / 0 reviewed, 0 article human review labels.
- 273 legacy records have no publisher article URL and no alternative image candidate URLs; 199 do have source-site URLs, which are not substituted for explicit article URLs. Preserve all 273 assignments. 12 Google News wrapper-only metadata entries remain untouched.
- New bottleneck: repeated-image group review did not auto-advance after successful per-article label saves, unlike the single-candidate review queue. PR candidate reuses the existing filtered next-pending action after a successful localStorage write only. Failed writes do not advance.
- Added integration contract. CI/merge/Production/Pages pending. No labels generated/uploaded, no source changes, and no automated image replacement.
- Android Chrome QA remains UNVERIFIED pending user-reported device checklist.


## 2026-11-26 — PR #56 and Production #611 final verification
- PR #56 merged as 747bb2c4be7cc9bb4fdafacfc10a823570d66db1. Final-head PR CI run 45815041255 succeeded: 209/209 tests passed, 0 failed; archive validation passed with 857 discovery candidates, 182 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #611 run 45815117814 completed with workflow conclusion success, but the collection run log status is partial: YouTube 15 seen / 0 accepted / 15 duplicates; Google News RSS 68; Bing News RSS 37 with 5 of 6 Bing queries successful (one query failure). Archive validation passed. Do not describe source collection as fully complete.
- Generated data commit b3091b027e3ea73211b6766c09833ac98916a790. Pages artifact 15115206223, 615,604 bytes, SHA-256 e96baee3a414ea23e335e27710fad205fe5a463845d947d8959804973c985de4. Deployment step succeeded and log reported “Reported success!”.
- Latest metrics generated 2026-11-26T11:57:06Z: 857 candidates (670 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 100 explicit publisher article URLs, 352 assigned thumbnails / 505 missing, 80 unique URLs, 273 legacy shared-image assignments preserved, 482 thumbnail review candidates / 0 reviewed, 0 article human review labels.
- The 273 legacy assignments have 0 explicit publisher article URLs, 0 alternative thumbnail candidate URLs, and 199 source-site URLs. Source-site URLs are not substituted for article URLs. All 273 remain untouched. The 12 wrapper-only Google News metadata entries remain untouched.
- PR #56 adds success-only auto-advance to the repeated-image review panel, reusing the current filtered next-pending article action. Labels remain per article, local-only; failed writes restore the saved value and do not advance.
- No new RSS/source, no Google News wrapper decoding, no access bypass, no automatic review labels/upload, no paid dependency, no external transmission. Android Chrome QA remains UNVERIFIED; it requires user-reported device results.
- Latest main after data commit: b3091b027e3ea73211b6766c09833ac98916a790. Documentation-only finalization PR follows; it does not trigger another Production collection.


## 2026-11-26 — Bing RSS failure diagnostics (PR candidate)
- Production #611 completed workflow/deployment successfully but the collection log was partial: 5/6 Bing queries succeeded; “Haewon international interview” returned non-RSS content. The saved run data lacks HTTP status and Content-Type, so root cause remains unverified.
- Branch fix/bing-rss-failure-diagnostics-20261126 adds RSS/Atom/HTML/empty/unknown classification and stores only response status, Content-Type and classification for Bing failures. No body, credentials, personal data, or extra retry is stored/sent.
- This is observability, not a claim that the Bing failure itself is fixed. PR CI and a subsequent Production run are pending.


## 2026-11-26 — Persist RSS failure diagnostics end-to-end (PR candidate)
- Production #612 was partial: Google News 3/6 queries succeeded (three HTTP 429); Bing 5/6 succeeded (one non-RSS response); workflow validation and Pages deployment succeeded.
- A follow-up code audit found the first diagnostic patch's metadata was stripped by `main()` when serializing failure arrays. This branch persists the allowlisted fields (query, error, HTTP status, Content-Type, response format) for both Google and Bing failures. Response bodies are never stored; no retries added.
- Added tests for end-to-end collector failure metadata and serializer privacy. PR CI / next Production verification pending.

## 2026-11-26 — PR #59 and Production #613 final verification
- PR #59 merged as 76bcd07a289dac9ef15b77404a72967d586378f8. Final-head PR CI #82 (45816347231) passed 213/213 tests, 0 failures; archive validation passed with 857 candidates, 184 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #613 (45816436196) completed successfully; collection run log status success, validation passed. Google News RSS 6/6 queries succeeded with 98 items; Bing News RSS 6/6 succeeded with 43 candidates; YouTube search 15 candidates / 0 accepted / 15 duplicates. No source query failures occurred in this run.
- Production #613 data commit: 9b47fd4ab2a46163fff794b2dc4e70f892ab0c7f. Pages artifact 15116535964, 622,569 bytes, SHA-256 b4fb09ff5037880f2b44fde3b935a30606ab0fb3004816d1805165dc2c512e8b. Deployment log explicitly reported “Reported success!”.
- The previous Production #612 had Google 3/6 queries fail with HTTP 429 and Bing 1/6 return non-RSS; this subsequent run had 6/6 success for both providers. This shows the earlier failures did not recur in this run, but does not prove their underlying cause or guarantee they will not recur.
- PR #59 also fixed the telemetry serialization gap: the collector's failure metadata is now passed through the status writer. Tests verify HTTP status, Content-Type and coarse response format are retained without storing response bodies. Because Production #613 had no failures, there were no failure rows to inspect in production; end-to-end failure persistence is supported by tests, and should be rechecked on any future failed query.
- Latest metrics generated 2026-11-26T12:05:53Z: 857 candidates (670 articles / 187 videos), 100 explicit publisher article URLs, 76 verified Haewon articles, 352 thumbnails assigned / 505 missing, 80 unique URLs, 273 legacy shared-image assignments, 482 thumbnail-review candidates / 0 reviewed, 0 article human review labels.
- All 273 legacy assignments remain unchanged; 0 have publisher article URLs, 0 have alternative thumbnail candidates, 199 have source-site URLs. 12 wrapper-only Google News metadata entries remain untouched.
- Android Chrome QA remains UNVERIFIED pending actual user checklist results. No labels were generated/uploaded, no new RSS sources added, no wrapper decoding, no access bypass, no paid service or external data transmission.
- Latest code/data main before this documentation-only finalization: 9b47fd4ab2a46163fff794b2dc4e70f892ab0c7f. Documentation-only PR will not trigger another Production run.

 
## 2026-11-27 — Evidence-based thumbnail missing-source diagnostics (PR pending)
- Fresh main at cycle start was `190e106ff83ebd26f61fa09f3e51fe0d79128cde`; Production #614 subsequently generated data commit/main `f2d63d5f6bf9dd4c19c3082f4b83effc3427d8a0`. Current latest metrics: 883 candidates (696 articles / 187 videos), 106 explicit publisher article URLs, 83 verified Haewon articles, 355 assigned thumbnails / 528 missing, 83 unique thumbnail URLs, dominant legacy image 273 assignments (31% of all candidates), 488 review candidates / 0 reviewed.
- Source-level baseline: Google News sourceName has 773 records, 273 already assigned thumbnails and 500 missing; publisher article URL count is 0. Other source rows together have 110 records, 82 assigned and 28 missing. These are current persisted-source labels, not a claim that every Google News URL was independently tested.
- The 273 legacy assignments remain unchanged: 0 explicit publisher article URLs, 0 alternative image candidates, 202 source-site URLs, and all 273 metadata outcomes remain not-attempted. Source-site URLs are not treated as article URLs.
- Selected improvement: add evidence-only missing-thumbnail reason classification and source coverage to quality metrics, then expose counts in the existing read-only quality dashboard. Categories distinguish Google News wrapper without verified publisher URL, no explicit publisher article URL, publisher fetch failure/error code, no image candidate in publisher metadata, candidate found/not assigned, duplicate rejection, and metadata not attempted/unrecorded. No URL/body is copied into the new summary.
- Implemented on branch `feat/thumbnail-missing-source-diagnostics-20261127`: helper/aggregator in `scripts/quality-metrics.mjs`, focused tests in `tests/quality-metrics.test.mjs`, dashboard display in `js/discovery-view.mjs`, and dashboard integration test. PR and CI are pending; this is not merged or Production-verified.
- Production #614 run 45889430699 completed all ten job steps successfully. Generated data commit `f2d63d5f6bf9dd4c19c3082f4b83effc3427d8a0`; Pages artifact 15149979794, 635,720 bytes, SHA-256 `a50dfe36a62cfa85f4b644a20f15ce1b65e535bf4dac56dbd53eb13205f52080`; upload and deployment steps succeeded.
- PR #54 and #56 save handlers were re-read: both call the transactional localStorage helper and advance only inside the success branch; failure restores the previous saved label and does not advance. Existing tests cover the persistence helper and both success-only integration paths. No user labels were generated or uploaded.
- Android Chrome QA remains UNVERIFIED pending the user's actual device checklist. No RSS sources, retries, wrapper decoding, access bypass, paid dependency, external data transfer, or legacy-label mutation.

 
## 2026-11-27 — PR #61 merged; Production #615 and live diagnostics verified
- PR #61 merged successfully as `60af6e3dea0e0732b4d6545882b315fe2cfd40e7`. Final-head PR CI #86 passed 216/216 tests (0 failures); committed archive validation passed with 883 candidates, 186 schema-valid run logs, 57 source summaries and 41 links checked.
- Production #615 (run 45913527537) completed successfully. Production workflow itself ran 216/216 tests and validated 902 discovery candidates, 187 schema-valid run logs, 57 source summaries and 41 checked links. The run log status is success.
- Latest data commit: `57bce05ac0511521c65c5ea27aa38c6a39141cd9`, parent is PR merge commit `60af6e3dea0e0732b4d6545882b315fe2cfd40e7`.
- Pages artifact 15160453872, 645,559 bytes, SHA-256 `a17a0b4d13d9ac6ce1e9366933cb509e06fbf427ae9fa85e29d270a8fc956be3`; artifact upload, Pages deploy and final “Reported success!” all verified.
- Latest metrics generated 2026-11-26T23:53:22.393Z: 902 candidates (715 articles / 187 videos), 106 explicit publisher article URLs, 83 verified Haewon articles, 355 thumbnails assigned / 547 missing, 83 unique image URLs, 273 dominant legacy assignments (30% of all candidates), 488 thumbnail review candidates / 0 reviewed, 0 article human-review labels.
- Current source breakdown: Google News 792 records, 273 assigned and 519 missing; explicit publisher article URLs 0. Among missing Google News records, 507 are explicitly classified as wrapper without publisher article URL and 12 as wrapper-only metadata; 449 have a source-site URL, which is not a publisher article URL. The other source rows total 110 records, with 28 missing.
- Latest missing-reason totals: 507 Google News wrapper without publisher article URL; 12 wrapper-only not followed; 9 publisher fetch failures tagged forbidden; 17 publisher pages with no supported image candidate; 1 method-not-allowed; 1 network error. All 547 missing records received an evidence-based category (0 unclassified). The 9 forbidden rows are a metadata-access outcome, not permission to retry or bypass.
- Current RSS metadata: Google News 224 items / 221 sourceUrl / 0 publisherArticleUrl / 0 image signals; Bing 52 items / 51 explicit publisherArticleUrl / 0 image signals. Both providers had 6/6 successful queries; failedQueries and bingFailedQueries are empty. Production #615 saw 15 YouTube candidates, all 15 duplicates; news collection added 23 candidates. No actual RSS failure occurred, so the persisted failure row path from PR #59 remains covered by tests but has not been exercised by a new production failure.
- The 273 legacy image assignments remain unchanged: 0 publisher article URLs, 0 alternative candidate URLs, 202 source-site URLs; metadata outcome not-attempted for all 273. Do not bulk-label, delete or replace them.
- PR #61 adds only evidence-based aggregate diagnostics and dashboard display; it does not fetch additional URLs or modify collection policies. Android Chrome QA remains UNVERIFIED pending the user's real-device checklist.
- No new RSS sources, wrapper decoding, sourceUrl substitution, blind retries, access bypass, paid services, external data transfer, or automated review labels.

 
## 2026-11-27 — Fan-facing content visibility update (PR pending)
- Current main baseline: `a9b597d5538ee066a1ee69a7902e8e418c2b48df`; Production #615 data commit `57bce05ac0511521c65c5ea27aa38c6a39141cd9`.
- Latest persisted video archive contains 20 NMIXX Official channel videos. Production #615 feed response contained 15 entries, added 0 and retained 20. Optional YouTube Data API search was skipped because `YOUTUBE_API_KEY` is not configured. This is not the total channel upload count.
- Discovery dataset contains 902 candidates (715 article / 187 unresolved video candidate classifications); 187 is not 187 verified video URLs. Google News wrapper video candidates have no explicit YouTube video URL and must remain candidates.
- Standalone photo-post library `data/photos.json` remains empty. There is no automated official SNS/photo-post collector. Existing JYP website and NMIXX Instagram source entries are manual-link-only.
- 61 verified Haewon article records currently have source-provenance-backed image thumbnails. A feature branch now exposes these 61 unique article preview images in a responsive gallery; they are article thumbnails, not standalone official photo posts.
- Branch `feat/fan-facing-discovery-gallery-20261127`: adds top archive navigation, visible image gallery, broader default Haewon article candidate scope, explicit source links, all-page unresolved video candidate pagination, and live video coverage explanation. PR/CI pending.
- YouTube Data API playlist pagination is technically low-quota (playlistItems.list: 1 unit/call; default most-method quota 10,000/day), but Developer Policies require non-authorized API data such as titles/creator names/descriptions to be refreshed or deleted within 30 days. No permanent API backfill is activated until compliant retention/refresh behavior and user choice are established.
- No original photo files are copied, no API key requested, no new RSS feeds enabled, and no legacy image assignments or human labels modified.
- Android Chrome QA remains unverified pending user real-device checklist.

 
## 2026-11-27 — Production #616 and official photo source discovery
- PR #62 merged as `c789b9a7c38241c0d6e893cca11b3e2870276b70`; final-head PR CI #88 passed 218/218 tests and archive validation passed for 902 candidates. Production #616 (run 45915909274) completed successfully; data refresh commit/main `b5ca63188b34fe8b3f3cc5a96912d6d89b96a4ee`.
- Production #616 Pages artifact 15162296412, 657,992 bytes, SHA-256 `9f10b21bc69a27502821925cb476cb9206555cd2d2b552be734065b0c1dfb177`; artifact upload and Pages deployment steps succeeded.
- Latest metrics: 903 discovery candidates (716 articles / 187 unresolved video candidates), 106 explicit publisher article URLs, 83 verified Haewon articles, 61 verified Haewon article images with source provenance, 355 assigned thumbnails / 548 missing, 83 unique thumbnail URLs, 273 legacy shared-image assignments. `data/videos.json` remains 20 NMIXX channel videos; latest official feed fetched 15, added 0. `data/photos.json` remains 0 standalone photo-post records.
- Production #616 collected 5 new news candidates; NMIXX YouTube Atom feed and Google/Bing RSS collection succeeded. The 187 discovery video candidates are not 187 verified YouTube URLs.
- New public official photo source discovered: NMIXX official website Gallery at https://nmixx.jype.com/gallery. Current public page displays 34 gallery pages; official Notice also lists Haewon concept-photo posts. Search/open evidence: https://nmixx.jype.com/gallery and https://nmixx.jype.com/notice. The next PR adds a direct link to this official gallery in the archive.
- PR #63 also aligns `quality-metrics.json` `defaultScope` metadata with the broadened Haewon-candidate default in the public article view. PR/CI pending.
- The official Gallery link is a user-facing route to existing official photos; it does not mean this repository has begun automated photo-post collection. `data/photos.json` stays empty until a permitted public listing/image metadata path is implemented and validated. No image files are copied or rehosted.
- Android Chrome real-device QA remains unverified pending the user's checklist. Preserve 273 legacy thumbnail assignments; no automatic labels, API keys, new RSS feeds or access bypass.

 
## 2026-11-27 — PR #63 merged; official gallery link live; Production #617 diagnostics exercised
- PR #63 merged as `a7d4ae26b154a1219ec4ba34f7d24002d31b20ce`; final-head PR CI #89 passed 218/218 tests, and archive validation passed for 903 discovery candidates, 20 schema-valid videos, 0 photo-post records, 188 run logs, 57 source summaries and 41 checked links.
- Production #617 (run 45916213360) completed its workflow and Pages deployment successfully. Data commit/main: `87e1e859c2762680c13ff4d3c487e158164d86ed`, parent PR merge `a7d4ae26b154a1219ec4ba34f7d24002d31b20ce`.
- Pages artifact 15161774593, 662,120 bytes, SHA-256 `a37263f12ec5d64e78db3439ec16f168ddd5327a251e13f4c862a14cfd58c244`; upload and deployment steps succeeded.
- Latest metrics generated 2026-11-27T00:21:21.098Z: 903 discovery candidates (716 article / 187 unresolved video candidates), 106 explicit publisher article URLs, 83 verified Haewon articles, 61 source-provenance-backed Haewon article images, 355 assigned thumbnails / 548 missing, 83 unique image URLs, 273 legacy shared-image assignments. Videos remain 20; last feed fetched 15 and added 0. Standalone `data/photos.json` remains 0.
- Production #617 Google News RSS returned 5/6 successful queries; Bing RSS 6/6. The one actual Google News failure is persisted in `data/news-collection-status.json`: query `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`. This directly exercises PR #59's failure-diagnostic persistence path. Do not retry blindly; leave the failed query recorded and respect rate limiting. Production run log correctly marks Google News partial and overall run partial while validation and Pages deployment succeed.
- The official photo gallery shortcut is now live in the photo/image section: https://nmixx.jype.com/gallery. It opens JYP's public Gallery; the archive still does not automatically copy or collect photo originals. The 61 local cards remain article-image previews, distinct from official photo posts.
- `discoveryRelevance.defaultScope` now reports `haewon-title-match`, aligned with the actual default article UI.
- No API key, new RSS source, external data transfer, wrapper decoding, access bypass, blind retry, auto-review label, or mutation of the 273 legacy image assignments.
- Android Chrome QA remains unverified until the user completes the real-device checklist.

## 2026-11-27 — Official photo permission boundary and video-origin provenance
- Official NMIXX Gallery is publicly viewable (34 pages), but the readable page exposes only generic image items and JYP copyright notice; robots.txt could not be retrieved, and no terms or explicit permission for automated image metadata extraction were verified. Keep JYP Gallery/Notice manual-link-only; do not add a collector, infer image URLs, download/rehost photos, or populate data/photos.json. Article-image previews (61) remain distinct from standalone photo posts (0).
- NMIXX Notice exposes public post number/title/date entries (58 pages), including Haewon concept-photo notices. This is evidence for a useful human-browsable source, not permission to crawl it.
- The persisted 20 video records all originate from the NMIXX artist channel. The public Atom feed currently returns 15 recent entries per observed run; the archive's 20 are accumulated records, not channel-wide coverage. Existing text-keyword relevance is 2/20 and is not human appearance verification. Keep the optional YouTube Data API disabled unless a compliant 30-day refresh/deletion lifecycle is implemented.
- Video provenance is explicit: artist-official, broadcaster-official, or unverified. The NMIXX Atom feed and known channel ID populate artist-official; direct YouTube links discovered in news and non-NMIXX search results remain unverified unless channel identity is independently verified. No broadcaster sources are enabled yet.
- Research leads for later human review: M2, MBCkpop, KBS Kpop, SBSKPOP ZOOM, and ALL THE K-POP. Do not fetch their feeds or add them to the automatic source registry in this cycle. Verify channel ownership, public feed availability, source terms/robots, and Haewon-specific video identity before proposing a collector.
- PR #54/#56 queue contract remains: advance only after successful local persistence; on storage failure restore the prior saved value and do not advance. Integration tests assert success-only scheduling; persistence behavior is separately tested. No review labels are generated, uploaded, or altered.
- Preserve 273 legacy shared-thumbnail assignments, the HTTP 429 diagnostic for query '오해원 근황', and Android Chrome QA as unverified.

## Final verification — Production #618 (2026-11-27)
- PR #64 merged after PR CI #90 passed; merge commit `b5b1a434fb3520617007d67058deddca084dd440`. Production #618 completed successfully: https://github.com/UForPel/haewon-archive/actions/runs/45918702731
- Production run log `data/run-logs/45918702731.json` records status `success`, validation passed with no errors, NMIXX feed 15 entries seen (0 added, 15 duplicates), Google News 329 candidates and Bing 50 candidates. News queries: Google 6/6 and Bing 6/6 successful; 14 discovery candidates added; total candidates 913 (726 article, 187 unresolved video).
- Current metrics: 20 stored NMIXX artist-channel videos, all carrying `artist-official` and the verified NMIXX channel ID; 61 provenance-backed Haewon article-image previews; 0 standalone photo-post records. Thumbnail metrics: 913 records, 558 missing (355 assigned by subtraction); the 273-record shared legacy image group remains `review-required` and unchanged.
- Pages artifact 15163044172, 674154 bytes, SHA-256 `8d2b7058e8fa601c654d2ac6d69edb91b7be3e288a80797376ebdd1729ab6213`; artifact upload and Pages deploy steps both succeeded. The live site URL could not be independently opened/verified in this check. Android Chrome real-device QA remains unverified.
- The earlier Production #617 partial run (run ID `45916213360`) had a Google News query failure: `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`; no blind retry was performed. Production #618 later succeeded 6/6. The latest status snapshot is now the successful run and has overwritten the earlier per-query failure detail; the partial run log remains, but append-only per-query failure history is still a follow-up gap to close.
- Latest data commit at the end of Production #618: `553151c75580506ee9518c461aa552d8716807eb`; it is the parent of the documentation-only finalization commit that records this verification.

## 2026-11-27 — Append-only query failure history and source-policy review
- Root cause: `data/news-collection-status.json` is a latest-run snapshot and is overwritten on each collection. Before this change, `data/run-logs/*.json` only stored source-level error codes, so individual failed query/status/content-type details were not durable.
- Add `data/query-failure-history.json` as an append-only event list keyed by runId + sourceId + query. A later successful run adds no deletion/update for an earlier failure; replaying the same run key is deduplicated. The initial backfill records only the confirmed Production #617 Google News failure: query `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`, response format `html`, run ID `45916213360`, occurred at the recorded run start time. No Retry-After value was present in the available historical evidence, so it is omitted.
- New Google/Bing failure rows capture Retry-After only when the HTTP response actually supplies that header. Every query is attempted once; `retryAttempted:false` is recorded. No automatic retry/backoff has been introduced. Run logs now include query-level failures and preserve status/content type/format/retry metadata. Production #617 run log is backfilled with its confirmed query failure.
- `validate-data.mjs` validates the append-only history shape and duplicate event keys. Tests cover 429 metadata, one-request/no-blind-retry behavior, history retention after a later success, replay deduplication, and run-log query-level details.
- JYP/NMIXX Gallery and Notice remain manual-link-only. Publicly visible listings are not permission to crawl or reuse images. robots.txt and a content-collection permission/terms basis could not be verified; JYP's public privacy policy is not an image-crawling license. No image collector or hidden endpoint was added. Keep article-image previews (61) separate from standalone photo posts (0).
- Broadcaster research: KBS's own site lists KBS Kpop and KBS published a channel feature; iMBC identifies MBCkpop as its YouTube K-pop channel; MBC PLUS owns the ALL THE K-POP brand and publishes clips with MBC PLUS copyright. MnetPlus content pages refer to M2 YouTube distribution. However, channel IDs, public Atom feeds, each channel's robots/terms, and Haewon-specific individual videos were not all verified. SBSKPOP ZOOM ownership was not established from a first-party source in this pass. Therefore no broadcaster channel is added to `data/sources.json`, and no video is newly marked `broadcaster-official`.
- Preserve 273 legacy shared-thumbnail assignments and PR #54/#56 transactional review queue behavior. Android Chrome real-device QA remains unverified.

## 2026-11-27 — Failure-history serializer correction follow-up
- PR #65 was merged after final-head PR CI #93 passed (219 tests and committed-data validation). Merge commit: `4082f1d51ae037ea9d1a823c91f750f86ecdc984`.
- Production #619 (`45926252892`) ran the collectors, but failed during `validate-data.mjs` at the query-failure-history JSON parse step. Root cause: the serializer wrote the two literal characters backslash+n after the JSON object instead of a real newline. The failed workflow did not commit refreshed data and did not upload/deploy a Pages artifact. Do not report Production #619 as successful.
- Follow-up fix extracts `serializeQueryFailureHistory`, writes a real newline, and adds a test that parses the serialized JSON and distinguishes a real newline from a literal backslash+n. Re-run full PR CI and Production after merge before declaring the history persistence live.
- Main's committed `data/query-failure-history.json` remains valid and still contains the single confirmed #617 429 event; no new failure or Retry-After value is inferred from #619.
- All source-policy decisions remain unchanged: JYP Gallery/Notice manual-link-only; no broadcaster feeds enabled; preserve 273 legacy shared thumbnails and transactional PR #54/#56 review flow. Android Chrome QA remains unverified.

## 2026-11-27 — Production #620 final verification
- PR #66 fixes the failure-history JSON serializer and was merged after final-head PR CI #95 succeeded (220/220 tests plus committed archive validation). Merge commit: `d61bc9aba38d4c8636828df2767bb3a67440be53`.
- Production #619 (`45926252892`) failed during validation because the first serializer emitted a literal backslash+n suffix. It did not commit refreshed data or deploy Pages. This was corrected in PR #66; do not count #619 as a successful deployment.
- Production #620 succeeded end-to-end: https://github.com/UForPel/haewon-archive/actions/runs/45926600456. Collection and archive validation passed; Google News 6/6 queries and Bing 6/6 queries succeeded; NMIXX Atom feed returned 15 entries (0 added, 15 duplicates); Google RSS returned 160 items and Bing RSS 49 items; 5 new discovery candidates were added; cumulative candidates 914 (727 article, 187 unresolved video).
- Run log `data/run-logs/45926600456.json` records status `success`, `queryFailures: []`, validation passed with no errors. The append-only `data/query-failure-history.json` still contains the one backfilled #617 failure (`오해원 근황`, HTTP 429, `text/html; charset=UTF-8`, no Retry-After recorded, no retry attempted). A later success did not erase it.
- Current quality metrics: 107 explicit publisher article URLs, 83 verified Haewon articles, 61 provenance-backed Haewon article-image previews; 20 stored NMIXX artist-channel videos; 0 standalone photo-post records. Thumbnails: 356 assigned, 558 missing, 84 unique image URLs; all 273 legacy shared-thumbnail assignments remain unchanged.
- Production #620 data commit: `ba3f3da5fc6f82580f25dd26177216cfd65108fb`. Pages artifact `15166123904`, 689,587 bytes, SHA-256 `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`. Artifact upload and Pages deployment steps both succeeded. The known Pages URL could not be independently opened through the current verifier; report deployment-step success, not independent live-site verification.
- First-party source review: KBS World explicitly references KBS KPOP YouTube distribution; iMBC references the MBCkpop YouTube channel; MBC PLUS's own site identifies ALL THE K-POP and its official clip pages include MBC PLUS copyright; MnetPlus describes selected program simulcasts on M2 YouTube. These sources establish channel/program relationships but do not yet verify stable channel IDs, public Atom feed availability, robots/terms for automated feed collection, or individual Haewon appearances for all five proposed channels. SBSKPOP ZOOM ownership remains unverified. No broadcaster feed is enabled and no item is newly marked `broadcaster-official`.
- JYP Gallery/Notice remain manual-link-only: robots.txt and automated collection permission were not verified. No photo collector, hidden endpoint, image download or rehosting was added. Android Chrome real-device QA remains unverified.

## 2026-11-27 — Multi-event failure-history audit
- Current main checkpoint: `518b464bf0f9943db840a238f4facf6a23f929bd`; no open PRs at audit start. PR #65 and #66 are merged.
- Production #620 is successful and has `queryFailures: []`; the append-only history still has the single confirmed #617 429 event. This validates survival through one successful later run, but not yet two distinct live failure events across separate Production runs.
- Added focused unit coverage for multi-run append semantics, successful-run retention, idempotent replay, different-run same-query events, actual Retry-After header capture, and one-request-per-query behavior. Pending PR CI and live Production #621 confirmation.
- Latest quality baseline: 914 candidates (727 article / 187 unresolved video); 107 explicit publisher article URLs; 83 verified Haewon articles; 61 article-image previews; 20 NMIXX artist-channel videos; 0 standalone photo posts; 356 assigned / 558 missing thumbnails; 84 unique image URLs; 273 legacy shared-thumbnail assignments unchanged.
- Production #620 artifact/deploy steps succeeded; independent live-site and Android Chrome real-device QA are still unverified.

## 2026-11-27 — Production #621 pending checkpoint (13:30 KST)
- Re-read the seven operating/source-policy documents from current main `d4aa61fc43819e1f2b272cc1aade188af3779240`; current open PR count is 0 and latest main is unchanged at this checkpoint.
- Queried the latest 30 Actions runs and verified no Production #621 or later Production run exists yet. Latest production run remains #620 (run 45926600456); #619 (45926252892) is a separate failed run. At 13:30 KST, the next configured schedule `17 11 * * *` UTC is still in the future (20:17 KST). Do not infer or fabricate a #621 result.
- Production #620's committed run log reports success, Google/Bing queries 6/6 each, 5 added candidates, total 914 candidates, and no queryFailures. Its history file still contains only the confirmed #617 Google News 429 event; it has no Retry-After field because no header was observed. This confirms retention through one later successful run, not a second live failure event.
- Re-fetched Production #620 job steps: test/collect/validate/commit, Pages configuration, artifact upload, and deploy-pages all succeeded. The workflow job log reports 220/220 tests and 0 failures (run #620 predates PR #67/#68). Artifact 15166123904 is 689,587 bytes; downloaded ZIP SHA-256 independently recomputed as `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`. Public Pages URL could not be opened through the independent web verifier; report deployment-step success, not live-site verification.
- Latest PR CI #97 and #98 both independently logged 222/222 tests, 0 failures, and successful committed-data validation. The serializer real-newline regression, append-only multi-run unit test, Retry-After actual-header-only test, and no-blind-retry fetch-count test all passed in both PR runs.
- Current committed history still has exactly one real event: run 45916213360 / google-news-rss / `오해원 근황` / HTTP 429 / retryAttempted false. No synthetic event was inserted.
- Quality metrics re-read from main: 914 candidates (727 article, 187 video), 107 publisher article URLs, 83 verified Haewon articles, 61 article-image previews, 0 standalone photo records, 356 assigned thumbnails, 558 missing, 84 unique image URLs, and 273 legacy shared assignments.
- Source policy remains unchanged: JYP Gallery/Notice manual-link-only; broadcaster feeds remain disabled; MBCkpop and ALL THE K-POP IDs are provenance leads only, not permission to collect. KBS/M2 exact ID and feed-policy evidence remains incomplete; SBSKPOP ZOOM ownership remains unverified. No item-level broadcaster-official auto-classification.
- No Production dispatch was performed: only read-only workflow inspection is available. Android Chrome real-device QA remains unverified.

## 2026-11-27 — YouTube channel identity and Atom-feed policy recheck
- Verified the M2 YouTube channel page as a verified channel with handle `@MnetM2`, exact channel ID `UCTQVIXvcHrR9jYoJ6qaBAow`, and CJ ENM copyright/identity description. Source: https://www.youtube.com/channel/UCTQVIXvcHrR9jYoJ6qaBAow
- Verified the KBS Kpop handle-to-channel mapping: `@kbskpop` resolves to channel ID `UCeLPm9yH_a_QH8n6445G-Ow`; the channel page title is KBS Kpop. KBS first-party pages already establish KBS Kpop as its official music/YouTube channel. Keep this as identity/provenance only, not a collector permission. Sources: https://www.youtube.com/channel/UCeLPm9yH_a_QH8n6445G-Ow and https://world.kbs.co.kr/service/news_view.htm?Seq_Code=189750&lang=e
- Re-read YouTube's official Terms of Service: section "Permissions and Restrictions" says automated access (robots, scrapers) is not allowed except public search engines acting in accordance with robots.txt or prior written permission; use of Content is limited as described and embeds are the allowed presentation path. Source: https://www.youtube.com/t/terms
- Read YouTube's current robots.txt: it explicitly disallows `/feeds/videos.xml` for `User-agent: *`. Source: https://www.youtube.com/robots.txt
- Direct fetches of candidate Atom URLs were blocked by the current verifier; this is not evidence of feed unavailability. However, the published robots exclusion for `/feeds/videos.xml` is affirmative evidence that the Atom path is not permitted for an ordinary automated collector under the public-search-engine exception. Therefore do not poll YouTube Atom feeds for KBS, M2, MBCkpop, or ALL THE K-POP unless written permission or a clearly applicable authorized API basis is established.
- Exact ID status: KBS Kpop `UCeLPm9yH_a_QH8n6445G-Ow`; M2 `UCTQVIXvcHrR9jYoJ6qaBAow`; MBCkpop `UCe52oeb7Xv_KaJsEzcKXJJg`; ALL THE K-POP `UCPde4guD9yFBRzkxk2PatoA`. These are identity facts only; no broadcaster feed is enabled and no video is auto-labeled broadcaster-official.
- SBSKPOP ZOOM first-party ownership and stable channel ID remain unverified. JYP Gallery/Notice remain manual-link-only due unresolved robots/terms/metadata permission.
- No YouTube API activation: the 30-day refresh/deletion lifecycle requirement remains unmet. No code/source registry change, no automated collection, and no video reclassification was made.


## 2026-11-27 — YouTube Atom collector disabled after policy/code audit
- **Verified policy conflict:** Production #620 (run 45926600456) actually fetched 15 entries from nmixx-youtube; the source registry still had enabled: true, and scripts/collect-youtube.mjs made a direct request to /feeds/videos.xml.
- YouTube's official robots.txt disallows /feeds/videos.xml for User-agent: *; Terms restrict automated access except the robots-compliant public-search-engine case or prior written permission. An official channel identity is not an exception.
- Code change in review: disable all Atom network requests; mark the legacy source policy: disabled and enabled: false; preserve all existing data/videos.json records; keep the pure video merge helper for other permitted workflows.
- YouTube Data API was not used in Production #620: the job log shows YOUTUBE_API_KEY empty and skipped-no-api-key. The workflow previously exposed the secret mapping, so this change removes that secret mapping and hard-disables the API entrypoint until the 30-day refresh/deletion lifecycle is implemented and reviewed.
- Production #620: 220 tests passed at that run's code version; collection log status success; Google News 6/6 and Bing News 6/6; 5 new candidates; 914 total candidates (727 articles, 187 videos); history retained one confirmed #617 429 event.
- #620 data commit: ba3f3da5fc6f82580f25dd26177216cfd65108fb. Artifact 15166123904, 689,587 bytes, SHA-256 e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31. Artifact upload and deploy-pages steps succeeded; independent live-site verification remains unavailable.
- #619 remains a separate failure: run 45926252892 failed at query-failure-history JSON validation due a literal backslash-n serialization defect; no successful data commit or Pages deployment was recorded for #619. PR #66 fixed this before #620.
- Latest main at audit start: ca55d79c0c30e3bc4d401ee1411289629317e31c; open PRs: 0. Production #621 was not present at this check; scheduled run at 20:17 KST was still pending.
- Article-image previews remain 61; standalone photo records remain 0; preserve 273 legacy shared-thumbnail assignments. Android Chrome real-device QA remains unverified.


## 2026-11-27 — Production #621 post-merge verification
- PR #71 merged as 535a3e812a87b6ab145d65eeb8d7fd7c84fdf518 after PR CI #45943174220 passed 223/223 tests and committed-data validation.
- Latest main after Production #621 data commit: bf5e6b925b2c5cae351fc7759b2ae088fce110b6.
- Production #621 run 45943216118 succeeded (push event). It ran 223/223 tests; YouTube Atom collector logged disabled / 0 network requests / 20 historical videos retained. YouTube Data API logged disabled-policy; API secret is no longer injected by the workflow.
- Run log: nmixx-youtube skipped (0 items); Google News and Bing News succeeded; queryFailures empty; 10 new candidates; 922 cumulative candidates. Full validation passed: videos 20, photos 0, run logs 192 valid, query-failure history 1 event.
- The one event remains #617's actual Google News 429 (query 오해원 근황); no second live failure occurred. No synthetic failure or Retry-After value was added.
- Artifact 15173364036 (719,896 bytes), SHA-256 digest 76815c94c3f2cac80dcbe99adc914c395ced735150c97641a181d8a9dc1e860c. Artifact upload and deploy-pages steps succeeded. Public Pages URL could not be independently opened; live-site status is not independently verified.
- Current quality metrics: 922 candidates (735 article, 187 video), 111 publisher article URL items, 84 verified Haewon articles, 62 article-image previews, 0 standalone photos, 359 assigned thumbnails, 563 missing, 273 legacy shared assignments.
- 20:17 KST scheduled run remains pending; #621 was push-triggered. Android Chrome real-device QA remains unverified.


## 2026-11-27 — Scheduled Production #622 verification
- Production #622 run 45943513107 completed successfully (event=schedule), with 223/223 tests, full archive validation, artifact upload and deploy-pages success.
- The run started 05:03:36Z / 14:03:36 KST. This does not match the configured 20:17 KST cron slot (11:17Z); treat #622 as a schedule event with a timestamp discrepancy, not confirmed evidence for the requested 20:17 slot. The 20:17 KST execution remains pending verification.
- YouTube Atom source skipped, 0 network requests, 20 historical video records retained; YouTube Data API disabled-policy. Google News/Bing News successful, queryFailures empty.
- Data commit 9de65fa731e459bf6238b7983169be1788644525. Artifact 15172754616, 724,180 bytes, SHA-256 a3510de9411c6449c2848c0eb231fcdbc408358f872fa28f5c8b2e5a903c1dbb. Deployment steps succeeded; independent public Pages access remains unverified.
- Failure history still contains only the real #617 HTTP 429; no additional failure and no synthetic event. #622 test count 223/223.
- Current #622 metrics: 936 candidates (749 article, 187 video), 111 publisherArticleUrl items, 84 verified Haewon articles, 62 article-image previews, 0 standalone photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments.
- PR #73 merged after 223/223 CI; current main at the time of this log update is resolved live in GitHub, not hard-coded into the next prompt. Android Chrome QA remains unverified.

## 2026-11-27 — Schedule trigger observability
- Latest main at audit start: 65d53b239eff93ffbea46b87940af7b4c3c0308e; open PRs 0.
- Production workflow cron: `17 11 * * *` (20:17 KST) and `17 23 * * *` (08:17 KST next day), UTC.
- #614 (20:13:18Z) and #622 (05:03:36Z) are reported as schedule events but their recorded starts do not match either cron instant. Workflow files at both run heads contain the same two expressions. Existing run logs omit `github.event.schedule`; exact trigger expression is not recoverable. Root cause remains unknown.
- #622 fully succeeded: 223/223 tests; archive validation passed; 20 videos retained; 0 Atom network requests; Data API disabled-policy; one actual #617 failure preserved; 936 candidates. Data commit 9de65fa731e459bf6238b7983169be1788644525; artifact 15172754616 digest a3510de9411c6449c2848c0eb231fcdbc408358f872fa28f5c8b2e5a903c1dbb; Pages deploy step succeeded, public URL unverified.
- At 15:00 KST, requested 20:17 KST run is still future. New PR records exact schedule expression for future runs; do not change cron based on unexplained evidence.

## 2026-11-27 — Schedule-expression instrumentation merged; Production #623
- PR #75 merged as `a2eeba7763323ec7ec953c033fc01815cdcace42`; CI #105 passed 226/226 and committed-data validation. Production #623 (45949528329) separately passed 226/226, archive validation, artifact upload and deploy-pages.
- PR #75 adds optional `scheduleExpression` to run-log schema/logger and wires `github.event.schedule` into the Production environment. Existing logs remain valid; push events omit this optional field.
- #623 is a push event, not the 20:17 schedule. Run log has github_push, no scheduleExpression (expected); YouTube Atom disabled, zero requests, 20 stored videos; Data API disabled-policy; Google/Bing successful; queryFailures empty.
- Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact 15176047291 (731041 bytes), SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Deploy step succeeded; live public URL remains unverified.
- Failure history still contains only the real #617 HTTP 429. No new real failure, no synthetic entry.
- #614 and #622 are schedule events with timestamps that do not match the configured UTC cron entries; exact event cron cannot be recovered because older logs omitted github.event.schedule. The next 20:17 KST scheduled run is still pending and must be verified separately.
- Current metrics: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl items, 84 verified Haewon articles, 62 article-image previews, 0 standalone photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments.
- Android Chrome real-device QA remains unverified.

 
## 2026-11-27 19:08 KST — Latest independently checked state
- Main SHA: 63f3c9c2daf0732252ac2c1e330cedaead0daeb5. Open PR/issue search: none. PR #75 and #76 merged.
- PR #76 CI: run 45949751531, 226/226, 0 failures; committed archive data validation passed.
- Production #623 (run 45949528329) was push-triggered, not schedule-triggered. It passed 226/226 tests, committed-data validation, collection and deploy-pages job steps. Data commit: c5382d9816e114c565357f0f22eb47e1b7771b0b.
- Artifact: 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7. Pages deployment step succeeded; public URL was not independently accessible to verifier.
- Collection: Google News 99 items; Bing News 31 items; queryFailures empty. YouTube Atom disabled / networkRequests 0 / 20 existing video records retained. Data API disabled and no YOUTUBE_API_KEY passed in the workflow.
- Failure history: exactly one actual #617 HTTP 429 retained; no second live failure and no synthetic event. Android Chrome real-device QA remains unverified.
- 20:17 KST scheduled run remains pending at 19:08 KST. Verify cron expression and timestamps on the next genuine schedule event; do not classify #623 as schedule evidence.

 
## 2026-11-27 21:22 KST — Post-20:17 operational checkpoint
- Latest main at checkpoint start: `ceed2b68e7f3e76a70b1e1740fafa0e41e677230`; PR #77 merged; no open PRs found.
- PR #77 CI #107: 226/226 tests, 0 failures; committed archive validation passed.
- The 20:17 KST / 11:17 UTC slot passed, but no Production #624 or later Production run was found in the live Actions list. Latest Production remains #623 (event=push); the requested schedule is **not observed / unverified**.
- Production #623: 226/226 tests, data validation passed, Google News 99 / Bing News 31, data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`.
- Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`; Pages deploy action reported success. Public URL direct open inaccessible to verifier; live site and UI unverified.
- Current metrics: 936 candidates (749 articles, 187 videos); 111 publisher URLs; 84 verified Haewon articles; 62 article-image previews; 0 independent photos; 359 assigned thumbnails; 577 missing; 273 legacy shared assignments.
- Failure history retains only real #617 HTTP 429 (`retryAttempted=false`, no Retry-After) through later successful runs. No second live failure; no synthetic event.
- YouTube Atom disabled, 20 video records preserved, Data API disabled/no workflow key injection. All source-policy boundaries unchanged.
- Android Chrome real-device QA remains unverified. No code change in this checkpoint.

 
## 2026-11-27 22:03 KST — Live checkpoint
- Latest main at start: `933118349f54a07c2bab9a50b6bd6d1ec9794611`; no open PRs before documentation update.
- 20:17 KST schedule: no Production #624 or later present in fresh Actions listing at 22:03 KST. Latest Production remains #623 push; slot unobserved, cause unknown.
- #623: 226/226 tests, archive validation passed, Google News 99 / Bing News 31, data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`.
- Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`; Pages configure/upload/deploy steps succeeded. Direct public URL access failed in verifier; live URL/UI unverified.
- Data: 936 candidates (749 articles, 187 videos); 111 publisherArticleUrl; 84 verified Haewon articles; 62 article-image previews; 0 independent photos; 359 assigned thumbnails; 577 missing; 273 legacy shared assignments.
- Feed image evidence: 0 RSS image signals in 68 Google and 31 Bing RSS items; 0 RSS image candidates; enrichment attempts 0 in #623. Comparison 86 meta-only, no RSS candidates. 493 review eligible/0 reviewed; precision null.
- Existing extractor already covers RSS media/enclosure/HTML and publisher OG/Twitter/image_src/itemprop/JSON-LD. No proven defect; no code change. Preserve article relevance and provenance; do not accept arbitrary logos/wrapper images.
- #617 real 429 remains in append-only history. YouTube Atom disabled; 20 videos preserved; no YOUTUBE_API_KEY workflow injection. Android Chrome real-device QA unverified.
- Next scheduled slot 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, expression `17 23 * * *`.


## 2026-11-27 22:10 KST — Live checkpoint
- [x] Recheck live main, open PRs, latest Actions, Production #623, run log, artifact digest, job steps and data commit.
- [x] Re-read all seven canonical documents.
- [x] Parse full discovery.json and calculate exact retry eligibility: 27 missing + explicit publisher URL; 0 eligible at 22:10 KST.
- [x] Confirm #623 is push, not schedule; 20:17 slot remains unobserved, cause unknown.
- [ ] After 2026-11-28 08:17 KST, inspect the next scheduled Production; require event=schedule + trigger=github_schedule + scheduleExpression='17 23 * * *'.
- [ ] Compare Actions created_at/run_started_at with run-log startedAt; verify tests, collection, data commit, artifact digest, Pages deploy and public URL independently.
- [ ] Recompute retry eligibility from full current discovery.json at next data refresh; max 12 targets, no blind retries. Earliest current eligibility: 2026-12-01T06:57:55Z.
- [ ] Add HTML fixture tests only if an eligible actual publisher page demonstrates an extraction gap. Preserve 273 legacy assignments and source policies.
- [ ] Complete Android Chrome QA only after user's direct check.


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Checkpoint
- [x] Live main/open PR/Actions checked; all seven docs re-read.
- [x] #623 Production run log, job, tests, data commit, artifact digest and Pages steps rechecked.
- [x] Full discovery.json blob re-parsed; 27 missing + explicit publisher URL, 0 eligible; earliest eligibility 2026-12-01T06:57:55.671Z.
- [x] Retry policy, offset 83138, max 12 confirmed from code; no blind retry.
- [x] Public Pages URL retried; verifier could not access; direct public access remains unverified.
- [ ] After 2026-11-28 08:17 KST, verify schedule event + github_schedule trigger + expression 17 23 * * * and timestamp alignment.
- [ ] Recheck next Production tests, collection, data commit, artifact SHA-256, Pages deployment and public URL independently.
- [ ] Recompute retry eligibility from the next full data blob; do not attempt early retries.
- [ ] Add HTML fixture tests only if an eligible actual publisher page demonstrates a missed metadata image.
- [ ] Android Chrome QA awaits user's direct check.

## 2026-11-27 22:31 KST — Live verification checkpoint
- Live main at start of this cycle: `d0b256db3fa4208112900387a2021683f6abbf71`; latest re-fetch confirmed it remained current. No open PRs.
- Current time is 2026-11-27 22:31 KST. The 20:17 KST / 11:17 UTC Production slot remains unobserved / cause unknown. The next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron expression `17 23 * * *`; it is still in the future. Do not label it success/failure before it runs. Afterward require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression, and compare created_at/run_started_at with startedAt. Do not infer #614/#622 expressions or change cron.
- Latest Production remains #623, run `45949528329`, event=push. Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`. Job `140341900635` succeeded; 226/226 tests, 0 failures; run-log validation passed. Google News 99, Bing News 31, YouTube skipped, queryFailures empty. Pages configure/upload/deploy steps succeeded.
- Data commit remains `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Pages artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Independent public Pages URL access remains unverified; successful deploy steps are not live-site proof.
- Current main's full Git blob for `data/discovery.json` was parsed: 936 records, 577 missing thumbnails, 111 explicit HTTPS publisherArticleUrl, 27 records with both missing thumbnail and explicit publisher URL. Nested `thumbnailMetaFetch` classes: missing 17 (10 status 200, 7 no status); failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Exact 1/7/30-day retry policy yields 0 eligible at 22:31 KST; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No requests or blind retries were made. The six-hour offset/max-12 policy is unchanged; selected count is 0.
- Quality metrics still show 936 candidates (749 articles, 187 videos), 84 verified Haewon articles, 62 verified Haewon article-image previews, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image candidates 0, 86 meta-only comparisons, review 493 eligible / 0 reviewed / precision null. Independent photos remain 0.
- `data/query-failure-history.json` still contains only the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, `videos.json` 20, Data API disabled, no workflow YOUTUBE_API_KEY injection. `collection-status.json` has no `networkRequests` field; do not claim measured networkRequests=0. Preserve all source restrictions, 273 legacy assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA remains unverified until the user checks directly. No code or collection-data change was justified in this cycle.

## Status classification at this checkpoint
- IMPLEMENTED: current static archive and existing collection/review workflows.
- TESTED: Production #623 test suite and committed-data validation passed.
- DEPLOYED: Production #623 Pages artifact and deploy steps succeeded.
- UNVERIFIED: public Pages URL direct access and Android Chrome real-device rendering.
- NOT OBSERVED: the 20:17 KST schedule slot; cause unknown. The next slot has not occurred yet.

## 2026-11-28 06:47 KST — Current verified status
- Main: dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2 (live GitHub lookup).
- PRs: none open at pre-branch check; current documentation-only PR is created from this SHA and awaits CI.
- Production #624: successful schedule event; Actions event=schedule; run-log trigger=github_schedule; scheduleExpression=17 11 * * *; started 19:59:31Z. This is the prior 20:17 KST slot, observed late by 8h42m27s. Delay cause unknown. It is distinct from the upcoming 08:17 KST slot (17 23 * * *), which was future at 06:47 KST.
- Tests/data validation: 226/226 tests passed, 0 failed; run-log validation passed. Google News 193, Bing News 36, all six queries successful, no queryFailures; YouTube skipped.
- Data: 962 candidates (774 article, 188 video); 113 explicit publisher URLs; 602 missing thumbnails, 28 missing with publisher URL; 360 assigned thumbnails (273 legacy shared); 84 verified Haewon articles; 62 article-image previews; 0 RSS image candidates; review 493 eligible / 0 reviewed / precision null.
- Thumbnail gate: 2 explicit page attempts in #624, 1 OG assignment, 1 no-candidate result. Recomputed retry eligibility at 06:47 KST: 0; earliest next 2026-12-01T06:57:55.671Z. No speculative retry or code change.
- Artifact/Pages: artifact 15228811375, 770763 bytes, SHA-256 a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd; configure/upload/deploy succeeded. Public URL direct access unverified.
- Unverified: Android Chrome real-device QA; direct public Pages reachability.

## 2026-11-28 06:47 KST — Documentation PR completion
- The seven-document update was submitted as PR #84 and CI run #114 (46072826084) completed successfully. Its Unit tests and Validate committed archive data steps both passed.
- PR #84 was merged after those checks, using squash merge. Merge commit / verified main immediately after merge: f2ca4cc33ecde38501a35c7332e6f0584f25a6ce. Post-merge open-PR search returned none.
- This finalization note corrects the interim status in this cycle's checkpoint: PR #84 is merged, not awaiting CI. It was documentation-only; no collector or dataset code was changed.
- Production #624 remains a separate successful schedule run for the prior 20:17 KST slot, delayed by 8h42m27s; cause unknown. The distinct 08:17 KST slot (17 23 * * *) was still in the future at 06:47 KST.

## 2026-11-28 06:47 KST — Final audit correction
- Arithmetic correction: cron minute 11:17:00Z to Actions created_at/run_started_at 19:59:27Z is 8 hours 42 minutes 27 seconds (not 8h42m10s). Run-log startedAt 19:59:31Z is 8h42m31s after the scheduled clock. The slot classification remains unchanged: delayed observed schedule event; delay cause unknown.
- PR #85 CI run #115 (46072938784) passed Unit tests and Validate committed archive data; PR #85 was merged. Main at the start of this correction PR: bfcb34d73e5c05ee8692c12a6500dff2c4375f10. No open PRs were found after the merge.

## 2026-11-28 07:00 KST — Pre-slot live verification
- Re-fetched GitHub main at checkpoint: `39ff7cf62e971e4e61d18ef9bbb1bda7d355fa0c`; it matches the previous handoff SHA. Open PR search returned 0.
- Re-read all seven operating documents from this exact main SHA before recording this checkpoint.
- Current local time was independently checked as 2026-11-28T07:00:51+09:00. The next scheduled slot 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC (`17 23 * * *`) is still future. No success/failure verdict. Workflow currently contains both `17 23 * * *` and `17 11 * * *`; no cron changes.
- Production #624 / Actions run 46060489526 is confirmed separately: Actions event=schedule, created_at/run_started_at=2026-11-27T19:59:27Z; job 140713285787 started 19:59:29Z and succeeded. The exact committed run log `data/run-logs/46060489526.json` records trigger=github_schedule, scheduleExpression=`17 11 * * *`, startedAt=19:59:31.000Z, finishedAt=19:59:52.735Z, status=success, validation.passed=true, Google News 193, Bing News 36, YouTube skipped, queryFailures empty. This is the prior 20:17 KST slot, delayed by 8h42m27s from the cron minute to Actions created_at; cause remains unknown.
- #624 artifact metadata: github-pages artifact 15228811375, 770763 bytes, not expired. Earlier verified SHA-256 remains a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Job steps configure-pages, upload-pages-artifact, and deploy-pages succeeded. Direct public URL access remains unverified.
- Current main still carries #624 data commit `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2` (parent 330b5fb7dbdeef689a5117b087cc1ee42a34a747); the documentation commits after it did not create a new Production/data run.
- Re-read the full discovery Git blob `9059841c0577269da3be828dfa15660b86fd926d` via Git blob API and parsed all 962 records. Current audit: 602 missing thumbnails; 113 explicit HTTPS publisherArticleUrl; 28 missing+explicit HTTPS publisher URLs. The 28 break down into 18 `thumbnailMetaFetch.status=missing` (11 HTTP 200, 7 without status code) and 10 failed (8 HTTP 403/forbidden, 1 HTTP 405/method-not-allowed, 1 HTTP 405/network-error). Exact current `shouldRetryThumbnailFetch` implementation was read from `scripts/collect-news.mjs`: missing=7 days; failed normally=1 day but 405/not-found/forbidden/rate-limited/method-not-allowed=7 days; assigned/found/duplicate-rejected/wrapper-only=30 days. Recomputed at 2026-11-28 07:00 KST: 0 retry-eligible; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No blind requests.
- Quality metrics generated 2026-11-27T19:59:41.083Z: 962 candidates (774 article, 188 video); 113 explicit publisher URLs; 360 assigned thumbnails (273 unverified legacy, 77 OG, 8 twitter:image, 1 link:image_src, 1 twitter:image:src); 602 missing; 84 verified Haewon articles; 62 verified Haewon article previews; RSS image candidates 0; 87 meta-only comparisons; review 493 eligible/0 reviewed/precision null.
- #624 collection-status is YouTube-only and has no networkRequests field; do not infer 0 requests. videos.json still 20; YouTube Atom and Data API remain disabled; no YOUTUBE_API_KEY workflow injection. Query-failure history contains only the actual #617 HTTP 429 (runId 45916213360); no synthetic failures.
- Recursive-improvement state is exploratory: 6-query rotation pack 1/6, cumulative candidates 962, current-run candidates 193, 20 video records; 0 human-reviewed relevance labels, precision null, no automatic strategy promotion. Keep query-pack rotation only; preserve candidates.
- No code/data changes are justified before the next slot: retry eligibility is zero and no concrete eligible-page extractor miss exists. Preserve 273 legacy shared thumbnails, PR #54/#56 transactional save/move/restore, all source restrictions, and no Google News wrapper decoding/access bypass.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. This checkpoint PR updates documentation only; merge only after PR CI and committed-data validation both pass.

## 2026-11-28 07:14:52 KST — Live pre-slot checkpoint
- Re-queried local time: 2026-11-28T07:14:52+09:00. The 08:17 KST / 2026-11-27 23:17 UTC slot (17 23 * * *) is still future; keep pending. No cron edits.
- Re-fetched live main from GitHub: 96b6b9a46ab2fca0ad8b41d80c2874d6146949d0; repository default branch is main. Open PR search returned 0. PR #87 is merged at this SHA; CI #117 / run 46074127871 passed both Unit tests and Validate committed archive data.
- Re-read all seven operating documents at this exact main SHA before this update.
- Latest Production in the current Actions run list remains #624 / 46060489526; no newer Production run is present. #624 is the distinct prior 20:17 KST delayed schedule run: event=schedule, created_at/run_started_at=2026-11-27T19:59:27Z; exact run log records trigger=github_schedule, expression=17 11 * * *, startedAt=19:59:31.000Z, finishedAt=19:59:52.735Z. Delay from 11:17:00Z cron minute to Actions start is 8h42m27s; cause unknown. Do not conflate with the future 08:17 slot or infer #614/#622.
- #624 job 140713285787 succeeded. Unit tests/data validation and collection/deployment workflow step succeeded; Pages configuration, artifact upload and deploy steps all succeeded. Artifact 15228811375 (github-pages) is 770,763 bytes and not expired. Previously verified SHA-256: a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Direct public URL access remains unverified.
- #624 run log/data state remains: Google News 193, Bing News 36, YouTube skipped, queryFailures empty; 226/226 tests and committed archive validation passed; data commit dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2. No new Production means no new full discovery-blob audit was required this checkpoint.
- Last full discovery audit remains 962 records (774 articles, 188 videos), 113 explicit HTTPS publisherArticleUrl, 602 missing thumbnails, 28 missing+explicit URL; assigned 360 (273 legacy shared), 84 verified Haewon articles, 62 article-image previews, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Last exact retry audit: 0 eligible, earliest next eligibility 2026-12-01T06:57:55.671Z. No blind retry or speculative extractor change.
- Quality/improvement state remains exploratory: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion. Current workflow schedule entries verified as 17 23 * * * and 17 11 * * *.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; no networkRequests inference from collection-status; only actual #617 HTTP 429 in failure history; no JYP/NMIXX Gallery/Notice collectors, no broadcaster collector/auto-classification, no Google News wrapper decoding/access bypass; preserve 273 legacy assignments and PR #54/#56 transactional save/move/restore.
- No code/data change is justified: the next slot is pending, no newer Production exists, retry eligibility is zero, and no concrete eligible-page extractor miss is evidenced. Android Chrome real-device QA and public Pages direct access remain unverified.
- This checkpoint is documentation-only across the seven operating documents. Merge only after PR CI and committed-data validation both pass.

## 2026-11-28 08:20 KST — Post-slot live verification
- Re-fetched live main from GitHub: 45f400154ecb073d31dd28ad626df6c254d27313. Re-read all seven operating documents at this exact SHA before this checkpoint. Open PR search returned 0.
- Current time is 2026-11-28 08:20 KST. The 08:17 KST / 2026-11-27 23:17 UTC schedule slot (cron 17 23 * * *) has elapsed.
- Queried GitHub Actions filtered to event=schedule: 19 runs returned; newest remains Production #624 / 46060489526, created_at/run_started_at=2026-11-27T19:59:27Z. No schedule run after the target 23:17:00Z slot was observed at this checkpoint. This is recorded as "slot elapsed; matching run not observed", NOT as a failed run, dropped schedule, or confirmed GitHub omission. Recheck later for delayed arrival. No run-log for the target slot is available because no matching Actions run is currently visible.
- Workflow file at current main still contains cron expressions 17 23 * * * and 17 11 * * *; no changes made.
- Distinct prior Production #624 remains: Actions event=schedule; run-log trigger=github_schedule, scheduleExpression=17 11 * * *, startedAt=2026-11-27T19:59:31.000Z, finishedAt=19:59:52.735Z. This belongs to the prior 20:17 KST slot and started 8h42m27s after its cron minute; delay cause unknown. Do not conflate with 08:17 slot or infer #614/#622 retroactively.
- #624 remains successful: 226/226 tests, committed data validation passed, Google News 193, Bing News 36, YouTube skipped, queryFailures empty. Data commit dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2. Pages artifact 15228811375, 770763 bytes, not expired; known SHA-256 a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Configure/upload/deploy succeeded; direct public URL access remains unverified.
- No newer Production means the prior full discovery audit remains the latest: 962 records (774 articles, 188 videos), 113 explicit HTTPS publisherArticleUrl, 602 missing thumbnails, 28 missing+explicit URL; 360 assigned (273 legacy shared), 84 verified Haewon articles, 62 article-image previews, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Do not claim a new audit was performed.
- Last exact retry audit remains 0 eligible, earliest next eligibility 2026-12-01T06:57:55.671Z. Preserve 1/7/30-day policy, six-hour offset rotation and max 12; no blind retry or speculative extractor change.
- Recursive improvement remains exploratory: query pack 1/6, cumulative candidates 962, current run 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; no networkRequests inference; only actual #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors, broadcaster collectors or broadcaster-official auto-classification, Google News wrapper decoding/access bypass; preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and public Pages direct access remain unverified. No code/data change justified because no new Production, no retry-eligible targets, and no evidenced eligible-page extractor miss.
- This checkpoint is documentation-only across all seven operating documents. Merge only after PR CI and committed archive data validation both pass.


## 2026-11-28 08:42 KST — Delayed-schedule recheck and operating checkpoint
- Re-queried local time: 2026-11-28T08:42:29+09:00. Re-fetched the live `main` branch ref from GitHub: `37daaefd22bc574b80553a529ca2ae13e7cb76b4`; repository default branch remains `main`. Open PR search returned 0 before this documentation branch was opened.
- Re-read all seven operating documents at this exact main SHA before editing.
- Queried GitHub Actions `event=schedule` through the Actions runs API: `total_count=19`. The newest schedule run remains Production #624 / run `46060489526`, created_at/run_started_at `2026-11-27T19:59:27Z`. No schedule run after the 2026-11-27 23:17:00Z / 2026-11-28 08:17 KST slot is present in the returned schedule-run list at 08:42 KST. Record only as "slot elapsed; matching run not observed"; do not label it failed, dropped, omitted, or a confirmed scheduler incident. No cron changes.
- Current `.github/workflows/collect-and-deploy.yml` was fetched from main. Its schedule expressions remain exactly `17 23 * * *` and `17 11 * * *`.
- Keep #624 separate from the 08:17 slot. #624 is Actions `event=schedule`, created_at/run_started_at `2026-11-27T19:59:27Z`; its persisted run log `data/run-logs/46060489526.json` records `trigger=github_schedule`, `scheduleExpression=17 11 * * *`, `startedAt=2026-11-27T19:59:31.000Z`, `finishedAt=2026-11-27T19:59:52.735Z`. This is the prior 20:17 KST / 11:17 UTC schedule execution, with Actions creation 8h42m27s after the cron minute; cause unknown. Do not infer anything retroactively about #614 or #622.
- Rechecked #624 job logs and steps: job `140713285787` succeeded; 226 tests passed, 0 failed; committed archive validation passed; source outcomes were Google News RSS success / 193 items, Bing News RSS success / 36 items, NMIXX YouTube skipped / 0 items; queryFailures is empty. The run committed data as `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2`.
- #624 Pages artifact remains `15228811375`, `770763` bytes, SHA-256 `a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd`. Configure Pages, artifact upload, and deploy steps succeeded. Direct public Pages URL access remains unverified.
- PR #89 is confirmed merged at `2026-11-27T23:22:19Z`, merge/main SHA `37daaefd22bc574b80553a529ca2ae13e7cb76b4`. Its CI #119 / run `46082095163` passed Unit tests and Validate committed archive data. No new Production has appeared since #624; therefore no fresh discovery-data audit or new dataset metrics are claimed.
- The last full discovery audit remains historical only: 962 records (774 articles, 188 videos), explicit HTTPS publisherArticleUrl 113, missing thumbnails 602, missing+explicit URL 28, assigned thumbnails 360 (273 legacy shared), verified Haewon articles 84, article-image previews 62, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Do not describe these as a new 08:42 audit.
- Last exact retry audit remains 0 eligible, earliest next eligibility `2026-12-01T06:57:55.671Z`. Preserve missing 7-day, failed general 1-day, specified 405/not-found/forbidden/rate-limited/method-not-allowed 7-day, and assigned/found/duplicate-rejected/wrapper-only 30-day backoff; preserve six-hour offset rotation and max 12. No blind retry. Only an evidenced extractor miss on an actually retry-eligible publisher article justifies a fixture, test, or code change.
- Recursive improvement remains exploratory: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; do not infer zero network requests from collection-status; preserve only the real #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors, no broadcaster collector or broadcaster-official auto-classification, no Google News wrapper decoding/access bypass; preserve all 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. No code/data change is justified at this checkpoint: no new Production, no retry-eligible target, and no evidenced eligible-page extractor miss.
- This cycle is documentation-only across all seven operating documents. The checkpoint is on a branch/PR; merge only after the PR verification workflow reports both Unit tests and Validate committed archive data successful. Report docs, code, tests, Production, data, artifact, Pages, and Android QA separately.


## 2026-11-28 08:57 KST — Post-slot schedule recheck
- Current local time was checked as `2026-11-28T08:57:53+09:00`. Live GitHub `main` ref was re-fetched and resolved to `470d81003e130f841a81b8edab0a8689a78624ff`; this was not assumed from the prior conversation. Open PR count before this checkpoint branch was created: 0.
- Re-read all seven operating documents at this exact main SHA before edits.
- GitHub Actions `event=schedule` API returned `total_count=19`; newest remains Production #624 / run `46060489526`, created_at/run_started_at `2026-11-27T19:59:27Z`. No schedule run after the 2026-11-27 23:17:00Z / 2026-11-28 08:17 KST slot is present as of 08:57:53 KST. Record only "slot elapsed; matching run not observed"; do not claim failure, dropped event, omission, or scheduler incident. No cron changes.
- Workflow `.github/workflows/collect-and-deploy.yml` was re-read at main: schedule expressions remain exactly `17 23 * * *` and `17 11 * * *`.
- The latest Production run in the recent Actions list remains #624; no newer Production `push`, `schedule`, or `workflow_dispatch` run was observed. Therefore do not perform or claim a new full discovery audit.
- #624 was independently rechecked: Actions event=schedule; created_at/run_started_at `2026-11-27T19:59:27Z`; persisted run log `data/run-logs/46060489526.json` blob `71a8d6ded07b368d22ad0fc7168cea97705d51d0`; run-log trigger `github_schedule`; scheduleExpression `17 11 * * *`; startedAt `2026-11-27T19:59:31.000Z`; finishedAt `2026-11-27T19:59:52.735Z`. It is the distinct previous 20:17 KST / 11:17 UTC slot execution, with Actions creation 8h42m27s after that cron minute; cause remains unknown. Do not infer #614/#622 retroactively or conflate them with the 08:17 slot.
- #624 job `140713285787` completed successfully; committed archive validation passed with no errors; Google News RSS success / 193 items; Bing News RSS success / 36 items; NMIXX YouTube skipped / 0 items; queryFailures empty. Data commit remains `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2`.
- Pages artifact remains `15228811375`, name `github-pages`, size `770763` bytes, not expired. Previously verified SHA-256 `a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd`; configure/upload/deploy steps had succeeded. Direct public Pages URL access remains unverified.
- PR #90 remains merged; CI #120 / run `46084057990` passed Unit tests and Validate committed archive data. Current main remains `470d81003e130f841a81b8edab0a8689a78624ff`.
- Last full discovery audit is historical only: 962 records (774 article, 188 video), explicit HTTPS publisherArticleUrl 113, missing thumbnails 602, missing+explicit URL 28, assigned thumbnails 360 (273 legacy shared), verified Haewon articles 84, article-image previews 62, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. These are not new 08:57 metrics.
- Last retry audit remains 0 eligible; earliest next eligibility `2026-12-01T06:57:55.671Z`. Preserve existing backoff: missing 7 days; failed general 1 day; 405/not-found/forbidden/rate-limited/method-not-allowed 7 days; assigned/found/duplicate-rejected/wrapper-only 30 days; six-hour offset rotation; max 12. No blind retry. Only a demonstrated extractor miss on a genuinely retry-eligible publisher page justifies a fixture/test/code change.
- Exploratory recursive improvement remains: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null; no automatic strategy promotion.
- Preserve all project constraints: YouTube Atom and Data API disabled; `videos.json` 20; never inject `YOUTUBE_API_KEY`; do not infer zero network requests because `collection-status` lacks `networkRequests`; preserve only real #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors; SBSKPOP ZOOM ownership unverified; no broadcaster collector or broadcaster-official auto-classification; no Google News wrapper decoding/access bypass; preserve all 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. No code/data change is justified: no new Production, no retry-eligible target, no evidenced eligible-page extractor miss. This cycle is documentation-only across all seven operating docs; merge only after PR CI passes both Unit tests and Validate committed archive data. Report docs, code, tests, Production, data, artifact, Pages, and Android QA separately.


## 2026-11-28 09:01 KST — Actions observability checkpoint
- Live repository metadata confirms default branch `main`; latest main SHA at this checkpoint is `c45b0f62889fb686dd36dceb3cfb67516cda8961`. PR #91 is merged. Its verification run #121 / `46085424796` was independently checked: Unit tests and Validate committed archive data both succeeded.
- Re-read all seven operating documents at the exact main SHA before this documentation update.
- Current local time supplied by the runtime is 2026-11-28 09:01 KST. The 08:17 KST slot for `17 23 * * *` has elapsed; however, the available GitHub connector exposes PR-triggered runs for a commit and per-run jobs/artifacts, but does not expose the repository-wide workflow-runs listing filtered by `event=schedule`. The direct Actions API and Actions web page were inaccessible through the available read interface. Therefore the current schedule-run count, newest schedule run, and whether a delayed matching run has appeared cannot be independently established in this checkpoint.
- Do not convert the unavailable Actions listing into a claim that no run exists, and do not label the slot failed, omitted, dropped, or a scheduler incident. No cron change. Do not infer #614 or #622 retroactively.
- #624 remains independently inspectable as a distinct prior Production: its persisted run log records `trigger=github_schedule`, `scheduleExpression=17 11 * * *`, `startedAt=2026-11-27T19:59:31.000Z`, and `finishedAt=2026-11-27T19:59:52.735Z`; it must not be conflated with the 08:17 KST slot. Its job and Pages artifact metadata were re-fetched; do not treat this as proof that no later Production exists.
- Because no authoritative current Actions schedule list was available, no new Production classification, discovery Git-blob audit, retry-eligibility recalculation, or dataset metrics are claimed. The last complete discovery and retry audits remain historical only. No blind retry and no speculative extractor change.
- Workflow configuration at this main SHA still contains exactly `17 23 * * *` and `17 11 * * *`; this checkpoint makes no workflow or cron changes.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. The direct URL check could not be completed through the available web interface. Report documentation, code, tests, Production, data, artifact, Pages, and Android QA separately.
- This is a documentation-only checkpoint. Merge only after the PR verification workflow passes both Unit tests and Validate committed archive data.
