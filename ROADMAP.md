# Roadmap

## MVP stabilization
- [x] Build responsive static archive UI
- [x] Collect official NMIXX YouTube feed
- [x] Persist data and deduplicate by video ID
- [x] Add unit tests and JSON validation
- [x] Run collection twice daily
- [x] Configure and successfully deploy GitHub Pages
- [x] Add working recent-7-day and date-range filters
- [ ] Improve member relevance tagging without scraping or unsupported API use

## Photo link library
- [x] Add photo source-link registration form
- [x] Store drafts in the current browser
- [x] Import and export photo metadata as JSON
- [x] Validate HTTPS URLs, required fields, dates, and duplicate links
- [x] Display saved-repository links separately from browser-only drafts
- [ ] Add a simpler guided publishing workflow for updating data/photos.json
- [ ] Consider shared registration only if a safe, free, no-secret backend becomes available

## Governance and automation foundation
- [x] Add persistent ChatGPT project memory and operating rules
- [x] Define Gemini responsibilities and prohibited actions
- [x] Add protected security and collection policies
- [x] Add initial search strategy and classification rules
- [x] Add policy changelog and target JSON schemas
- [x] Enforce archive-record JSON Schema in the validator and add tests
- [x] Add operational run logs and enforce the run-log schema (success-path verified; failure-path incomplete)
- [ ] Verify Gemini API features, quotas, pricing and data terms
- [ ] Verify external scheduler and secure trigger gateway
- [ ] Implement Gemini-assisted permitted public discovery
- [ ] Implement evidence-based constrained policy updates
- [ ] Start external scheduler only after dry-run and security tests pass

## Next — prioritize actual user value
- [ ] Implement Haewon Daily from permitted official sources with change detection and original links
- [ ] Expand video discovery beyond the official feed through permitted public sources
- [ ] Add source health and per-run collection history
- [ ] Add additional official sources only when they provide supported public feeds or documented access
- [ ] Expand fan-video discovery only through sources whose automated access is permitted

## Explicit non-goals
- Copying or rehosting copyrighted photos/videos without permission
- Bypassing platform login, access controls, rate limits, or anti-bot measures
- Claiming comprehensive coverage of all Haewon appearances
- Letting Gemini rewrite application code, workflows, schemas, validators or security rules


## UI reliability
- [x] Persist a button/action inventory and UI implementation requirement in `BUTTONS_AND_ACTIONS.md`.
- [x] Add static regression checks for required primary controls.
- [ ] Add behavior tests for generated pagination/category controls and photo actions.
- [x] Guard new thumbnail enrichment against assigning the same image URL to multiple records; report assigned vs duplicate-rejected outcomes.
- [x] Persist selected article OG/Twitter image candidate evidence even when duplicate assignment is rejected.
- [x] Measure URL-unique thumbnail assignment and unique coverage; label as URL metrics, not image quality.
- [ ] Persist resolved publisher article URL and compare candidate host provenance without bypassing access restrictions.
- [ ] Build reviewed source reliability labels and visual relevance sampling before any trust score.
- [x] Track thumbnail source metadata for RSS and article OG/Twitter candidates; expose enrichment outcome and source provenance in the quality dashboard.
- [ ] Manually verify mobile tap targets, focus/keyboard and live deployed controls.

## Thumbnail provenance follow-up — 2026-11-24
- [x] Add article-ID RSS vs OG/Twitter candidate comparison metrics (RSS-only, meta-only, both, URL overlap, source/host counts, meta found/assigned rate).
- [x] Add non-destructive repeated-URL review groups with source/article evidence; never auto-delete/replace.
- [x] Render comparison and review summaries in discovery quality dashboard.
- [x] Add comparison module unit tests; isolated run passed 3/3.
- [ ] Run full test suite and CI/Pages; repair failures.
- [ ] Inspect mobile layout, focus/tap-target and deployed dashboard behavior.
- [ ] Data limitation: historical records lack RSS candidate metadata, so current RSS-vs-meta comparison is not yet representative; new collection runs should accumulate comparable candidates.

- [x] Fix escaped-newline syntax issue discovered during code review in comparison/metrics modules; fetched source confirms no literal escape sequences remain.
- [ ] Execute tests and inspect generated comparison metrics in CI; unverified due network/Actions visibility.
## Thumbnail pipeline — CI repair and next measurement stage (2026-11-24)
- [x] Fix `quality-metrics.mjs` output-string syntax error found by Actions.
- [x] Restore `repeatedUrlGroups` and `repeatedItems` metrics required by existing tests.
- [x] Verify full CI #489: 86 tests pass; collection, validation, run log, data commit and Pages deployment pass.
- [x] Persisted metadata candidate evidence on 12 sampled article records; current evidence is 12 metadata-only and 0 RSS candidates.
- [ ] Increase candidate diversity beyond repeated Google-hosted `og:image` responses; inspect allowed RSS/structured image sources and test against real articles.
- [ ] Add a human-labeled article-image suitability review queue and measured accuracy/coverage; URL uniqueness is not image relevance.
- [ ] Keep the 273-record repeated-URL group intact until human review; no automatic deletion or replacement.

## RSS image candidate and review cycle — 2026-11-24
- [x] Parse RSS Media RSS, image Enclosure, description HTML and content:encoded image markup.
- [x] Parse OG/Twitter, og:image:secure_url, link rel=image_src, itemprop=image and JSON-LD image properties.
- [x] Keep candidate source and priority separate; preserve article-specific candidate arrays and metadata fetch provenance.
- [x] Record aggregate RSS response image-tag diagnostics without persisting raw RSS bodies.
- [x] Add article-level image candidate review labels, browser-local persistence and JSON export/import.
- [x] Add review coverage, candidate suitability precision and selected-thumbnail precision calculations.
- [ ] Repair/verify latest Actions run and Pages deploy.
- [ ] Inspect the next live rssImageSignals result to determine whether Google News RSS items actually contain image tags or only text/link descriptions.
- [ ] Collect enough article-specific human labels before interpreting precision; no visual suitability accuracy is currently known.
- [ ] Review the 273-item repeated URL group without deleting or replacing images automatically.
- [ ] Manually inspect the deployed mobile review UI and local-storage import/export flow.


## Live RSS evidence and Google News wrapper isolation — 2026-11-24
- [x] Measure image-bearing structures in actual Google News RSS responses without retaining raw feed bodies.
- [x] Confirm 227 RSS items yielded zero Media RSS, image Enclosure, content:encoded or description image tags.
- [x] Confirm publisher metadata fetches remained on news.google.com; 12/12 returned wrapper-only metadata with the same Google-hosted OG image.
- [x] Keep wrapper metadata as provenance evidence but exclude it from publisher-image candidate comparison and automatic assignment.
- [x] Verify run #521 full tests, collection, validation, data commit and Pages deployment.
- [x] Verify the latest resolved-host provenance commit in Actions #525; unit tests and Pages deployment succeeded.
- [ ] Review article-level candidates manually; suitability precision remains unmeasured until labels are entered.
- [ ] Manually inspect mobile review UI and JSON import/export.
- [x] Preserve all 273 records in the repeated-URL group; no automatic deletion/replacement.


## Explicit publisher URL gating and human review measurement — 2026-11-24
- [x] Preserve RSS publisher/source site URL independently of article URL.
- [x] Populate publisherArticleUrl only from explicit HTTPS article link/GUID; never infer article URL from a publisher homepage or decode Google News redirect tokens.
- [x] Restrict metadata fetching to explicit publisherArticleUrl and preserve final host/provenance.
- [x] Persist source provenance through candidate merges and show source status on article review cards.
- [x] Add JSON schema validation and localStorage import/export for article-specific image review labels.
- [x] Load committed data/thumbnail-reviews.json into quality metrics; report candidate and selected-thumbnail precision separately.
- [x] Resolve quality metric key collision between thumbnailReview group audit and thumbnailReviewMetrics.
- [x] Actions #537 green: 112/112 tests and Pages deploy succeeded.
- [ ] Perform real-browser visual/mobile review and exercise UI controls.
- [ ] Collect human review labels; no accuracy/precision claim until reviewed samples exist.
- [ ] Investigate an independent permitted source for direct article URLs, since RSS source URL fields are site-level URLs only.


## 2026-11-24 — Bing RSS and human-review workflow
- [x] Compare free publisher RSS/Atom, Bing News RSS, Google News RSS and official public search-result paths.
- [x] Add strict Bing explicit HTTPS destination extraction with provenance; retain Google wrapper isolation.
- [x] Record article URL source counts, publisher hosts, discovery wrapper hosts and separate wrapper-only historical metadata hosts.
- [x] Add review next-unreviewed shortcut and auto-save when selecting a label.
- [x] Actions #543: 116/116 tests; collection, validation and Pages deploy succeeded.
- [ ] Verify the deployed mobile page visually and exercise localStorage and JSON file import/export in a real browser.
- [ ] Continue human labeling; do not report precision/accuracy until reviewed samples exist.
- [ ] Investigate publisher-specific official RSS/Atom feeds where they expose direct article links; keep each feed URL and publisher site URL separately.


## 2026-11-24 — Conversation continuity UX
- [x] Persist exact one-tap ChatGPT recursive-improvement prompt and label in operating rules.
- [x] Add ChatGPT conversation action to button inventory with behavior and regression requirement.
- [x] Require the assistant to include the working action after each substantial project response.
- [ ] Confirm CI and Pages after this documentation-only change.


## 2026-11-24 — Human review queue correction
- [x] Correct orphaned review shortcut: integrate into the module actually loaded by `index.html`.
- [x] Search all current filtered/sorted candidates across pages; jump to and focus the next unreviewed image.
- [x] Save labels immediately on selection using the existing validated localStorage path.
- [x] Add unit tests for queue order, HTTPS filtering and duplicate image candidate handling.
- [ ] Verify Actions and Pages after this implementation.
- [ ] Perform real-browser mobile rendering, localStorage reload and JSON file import/export round-trip when browser automation is available.


## 2026-11-24 — Latest review queue and source audit
- [x] Actions #546: 119/119 tests and GitHub Pages deploy passed.
- [x] Cross-page review queue integrated in loaded discovery view; selection auto-saves; integration regression test added.
- [x] Compare official SBS News, Sports Khan, MK and ETNews RSS offerings and document reuse/transport constraints.
- [x] Keep feeds with unverified reuse terms or HTTP-only feed endpoints out of the public collection pipeline.
- [ ] Add a publisher RSS only after validating item-level HTTPS links, feed stability, image fields, and explicit reuse terms.
- [ ] Inspect failed/missing article metadata fetches by host; do not infer absence of image metadata from fetch failures.
- [ ] Run real-browser mobile and review JSON/localStorage checks when a browser automation environment is available.
- [ ] Collect human labels; precision remains unmeasured until real labels are saved/exported and included in the repository's review dataset.


### Official feed gate (2026-11-24)
- SBS News entertainment RSS: `https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=14&plink=RSSREADER` — personal non-commercial scope only.
- Sports Khan entertainment RSS: `https://sports.khan.co.kr/rss/entertainment` — personal subscription; public redistribution requires permission.
- MK culture/entertainment RSS: `https://www.mk.co.kr/rss/30000023/` — endpoint published; usage terms and item-level links still need validation.
- ETNews latest RSS: `http://rss.etnews.com/Section901.xml` — HTTP endpoint, not accepted in HTTPS-only pipeline.
- [ ] Validate item-level RSS link fields and publisher permissions before integration; no public feed content should be copied or redistributed without a clear permitted basis.
- [x] #547: 120/120 tests, collection/validation/data commit/Pages deploy succeeded.


## 2026-11-24 — Actions #548 final baseline
- [x] #548 passed 120/120 tests and Pages deployment.
- [x] Latest baseline refreshed: 658 discovery records; 36 direct HTTPS article URLs; 41 Bing RSS candidates; 4/4 query success.
- [x] Thumbnail baseline: 299 with thumbnails; 27 unique URLs; 273 records still share one legacy URL.
- [x] Review queue baseline: 362 eligible, 0 reviewed; accuracy remains unmeasured.
- [ ] Prioritize diagnosing why 10 publisher metadata attempts yielded 0 image candidates (7 no candidate, 3 failed), segmented by host and response outcome.
- [ ] Collect real human labels through the cross-page queue and export/import workflow.
- [ ] Perform real-browser interaction checks when browser automation is available.

## Next priorities after metadata backoff
- [x] Preserve publisher metadata fetch status/errorCode/statusCode/final host/timestamp.
- [x] Back off known no-image and forbidden/not-found/rate-limited URLs instead of re-fetching each collection run.
- [x] Report metadata outcome by publisher host and final redirect host.
- [ ] Add per-host sample review of the 273-item repeated Google-hosted thumbnail group; retain all URLs and records until human review.
- [ ] Collect actual human review labels (currently 0) before making image relevance or classification accuracy claims.
- [ ] Validate direct item links and reuse terms for any official publisher RSS before integration.
- [ ] Perform real-browser responsive and local JSON import/export checks when browser automation is available.

## 2026-11-24 — #552 measured outcome
- [x] #552 passed 125/125 tests and completed collection, validation, data commit and Pages deploy.
- [x] Retry backoff worked: 3 previous 403/forbidden URLs were skipped; one alternate Sports Khan article yielded one new unique thumbnail.
- [x] Latest baseline: 662 records, 38 explicit HTTPS article URLs, 301 thumbnails, 29 unique URLs, 273 records still sharing the dominant legacy URL.
- [x] Per-host candidate and assignment rates are exposed in the UI.
- [ ] Manually review the repeated 273-record image group and candidate relevance; no human labels exist yet.
- [ ] Validate real browser/mobile layout, persistence and JSON file transfer.

## Actions #553 checkpoint
- [x] 126/126 tests; collection, validation, data commit and Pages deploy succeeded.
- [x] Current baseline refreshed: 664 records, 38 direct HTTPS article URLs, 40 Bing candidates, 301 thumbnails, 29 unique URLs.
- [x] Retry backoff prevented unnecessary repeat requests in this run (0 due attempts).
- [ ] Obtain human labels for 369 eligible thumbnail candidates.
- [ ] Investigate and review the 273-record repeated thumbnail group without automatic deletion.
- [ ] Real-browser/mobile and JSON/localStorage interaction testing remains open.

## Final checkpoint — Actions #554
- [x] 126/126 tests and Pages deploy passed.
- [x] Final metrics refreshed: 664 items, 38 direct HTTPS article URLs, 41 Bing candidates, 301 thumbnails, 29 unique URLs, 273 repeated uses.
- [ ] Human review 0/369; accuracy remains unmeasured.
- [ ] Browser/mobile and JSON/localStorage interactions remain unverified.

## Actions #555 data follow-up
- [x] 126/126 tests, collection, validation, data commit and Pages deployment passed.
- [x] Google RSS source diagnosis refreshed: 328 items, 325 site-level source URLs, 0 direct article URLs, 0 RSS image signals.
- [ ] Investigate Bing RSS non-RSS response for query "해원 엔믹스" using only later normal scheduled retries; current run was 3/4 successful, 30 candidates.
- [ ] Keep 273 repeated image assignments intact until human review; 369 review candidates remain unreviewed.
- [ ] Browser/mobile and local persistence/file-picker verification remains open.


## 2026-11-24 — Repeated-thumbnail review and explicit metadata boundaries
- [x] Diagnose the 273-record dominant image group from actual discovery records: all 273 are Google News RSS rows with no direct article URL, image source, provenance or metadata-fetch evidence.
- [x] Keep all 273 legacy image assignments unchanged; no automatic deletion or replacement.
- [x] Fix the discovery-view search-count reference that read q outside its declaration scope; add a regression guard.
- [x] Add a dedicated repeated-image disclosure panel with one shared preview, per-article labels, search and next-unreviewed navigation.
- [x] Keep review labels article-specific; do not propagate one judgment across the group.
- [x] Restrict news-to-video sync to explicit HTTPS YouTube URLs in public item metadata; remove Google News wrapper redirect following and validate YouTube hostnames.
- [x] Confirm final explicit-URL changes with Actions #560: 131/131 tests and Pages deployment succeeded.
- [ ] Obtain actual human labels for the 369 eligible candidates; accuracy remains unmeasured until labels exist.
- [ ] Inspect live browser rendering, mobile layout, keyboard focus, localStorage reload and JSON file transfer.


## Final verification — 2026-11-24
- [x] Actions #557: 130/130 tests; collection, validation, data commit and Pages deploy succeeded.
- [x] Actions #560: 131/131 tests; final explicit-URL code, collection, validation, data commit and Pages deploy succeeded.
- [ ] Manual browser/mobile, keyboard focus, localStorage and JSON file-picker/download checks remain outstanding.
- [ ] Human labels still needed for 369 candidates; no relevance precision claim is permitted before review.


## Latest operational checkpoint — Actions #562 (2026-11-24)
- [x] 131/131 tests, 0 failures; collection, validation, data commit and Pages deployment succeeded.
- [x] Confirmed Google News RSS 4/4 but no item-level article URLs or image signals in 260 items; Bing RSS 4/4 with 41 candidates.
- [ ] Human review remains 0/369; obtain labels before claiming thumbnail relevance precision.
- [ ] Manual browser/mobile and local JSON persistence/file-picker checks remain open.


## 2026-11-25 — Provenance and URL metric integrity
- [x] Verify Actions #562 run ID 45404066050: 131/131 tests, collection, validation, data commit, Pages artifact and deployment succeeded.
- [x] Separate discovery-link coverage from explicit HTTPS publisher article URL coverage (38/666).
- [x] Correct thumbnail provenance accounting to exclude records without thumbnails.
- [x] Display unverified legacy assignments and missing thumbnails separately.
- [x] Add regression tests for article URL coverage and provenance denominators.
- [ ] Verify this change set in Actions and confirm generated metrics.
- [ ] Human-review the 273 repeated URL group without deletion or bulk labels.
- [ ] Perform real-browser/mobile, keyboard, localStorage and JSON transfer checks.


## 2026-11-25 — Verified recovery and next cycle
- [x] Fix stale dashboard structural assertion; #566 confirms 133/133 tests.
- [x] Verify YouTube + RSS discovery, improvement cycle, quality generation, archive validation, data commit and Pages deployment in Actions #566.
- [x] Compare 38/666 (5.7%) -> 53/682 (7.8%) explicit HTTPS publisher URLs; confirm Google News 0/629 and Bing RSS metadata origin for all 53.
- [x] Compare thumbnails 301/666 -> 312/682; retain 273 unverified legacy repeated assignments; do not auto-delete/replace.
- [x] Correct run-log push trigger normalization and schema/test; PR #3 merged.
- [x] Verify push-trigger regression in Actions #567 (133/133); persisted run log records `github_push`.
- [ ] Expand operational run log to report news source outcomes separately from YouTube collector status.
- [ ] Review repeated 273-image group per article; collect human labels before estimating precision.
- [ ] Browser/mobile, keyboard, localStorage and JSON transfer checks remain manual and unverified.
- [ ] Prioritize explicit publisher URL metadata and article-specific image metadata on sources where public metadata already exposes these fields; no wrapper token decoding or access-control bypass.

- [x] Verify Actions #567 data validation, data commit, Pages artifact and deployment.
- [x] Recheck article URL and thumbnail metrics after the second bounded enrichment pass.
- [ ] Continue publisher-host sampling using only explicit public metadata; improve source coverage without wrapper decoding.
- [ ] Human-review the 273-record repeated-image group per article; no automatic deletion or bulk labeling.
- [ ] Expand run log to include news source outcomes separately from the YouTube collector summary.
- [ ] Complete manual browser/mobile, keyboard, localStorage and JSON import/export checks.


## 2026-11-25 — Product UX correction
- [x] Identify root cause of noisy article view: internal diagnostics, provenance, relevance scores and review controls were rendered inline for every article.
- [x] Move quality diagnostics, review tooling and per-article image candidate review behind collapsed disclosures by default.
- [x] Remove RSS URL and internal relevance/completeness score from public article cards; retain title, category, source and date.
- [x] Add regression checks for the clean reading view.
- [ ] Verify new UI commit in Actions and Pages.
- [ ] Inspect the deployed page on a real mobile browser; CI alone is not visual QA.
- [ ] Improve the actual content result mix: obtain verified article-specific thumbnails and meaningful human labels; do not count repeated legacy image assignments as distinct content wins.


## 2026-11-25 — Article-first discovery correction
- [x] Verify PR #6 and Actions #570/#571: both green, 134/134 tests, Pages deploy succeeded.
- [x] Inspect all 699 discovery records and quantify the article/video split and title-match scopes.
- [x] Identify raw RSS HTML/anchor URLs in 644 descriptions as the direct cause of code-like card text.
- [x] Identify that 185 video/fancam candidates were mixed into the article list.
- [x] Fix category filter mounting; it was defined but never invoked.
- [x] Sanitize article titles/descriptions; remove tags and embedded URLs from the reading surface.
- [x] Default to 426 Haewon-title-match article candidates; expose NMIXX-title-match (440) and all-article (514) scopes.
- [x] Hide the 273-record unverified shared legacy thumbnail from individual article previews without deleting records or review evidence.
- [x] Add deterministic relevance-scope metrics and regression tests.
- [ ] Verify this branch in Actions and deploy to Pages.
- [ ] Inspect actual mobile browser rendering, keyboard focus, and title links.
- [ ] Obtain human review labels before claiming article relevance or thumbnail precision.
- [ ] Continue collecting explicitly identified publisher article URLs and per-article image metadata from public RSS/meta fields only.


## 2026-11-25 — Prefer verified original articles by default
- [x] Measure explicit publisher article URL availability inside the article-only dataset: 54 verified publisher articles, 48 with Haewon/해원 in the title.
- [x] Change default view to verified Haewon publisher articles (48), not the wider 426 title-match candidate set.
- [x] Preserve broader Haewon/NMIXX/all-article candidate scopes as opt-in filters.
- [x] Reject HTTP, Google wrapper, root-only and credential-bearing URLs from the verified scope.
- [x] Add quality metrics and regression tests for verified article counts and scope behavior.
- [ ] Verify this refinement in Actions and Pages.
- [ ] Perform real browser/mobile visual QA; not available in the current work environment.


## 2026-11-25 — Measure verified article thumbnail coverage
- [x] Verify PR #8 default-scope deployment in Actions #577: 139/139 tests, full workflow and Pages deploy succeeded.
- [x] Audit latest verified Haewon scope: 49 articles, 39 with provenance-backed thumbnails, 10 without.
- [x] Keep provenance coverage distinct from visual relevance/precision.
- [x] Add generated quality metrics for verified publisher/Haewon article thumbnails with recorded source provenance.
- [x] Expose the counts in the collapsed diagnostics.
- [ ] Verify this metrics change in Actions and Pages.
- [ ] Obtain human thumbnail labels; precision remains unmeasured.
- [ ] Perform real browser/mobile visual and keyboard checks.


## 2026-11-25 — Verified article thumbnail metrics closure
- [x] Merge PR #9 and verify Actions #578: 139/139 tests, collection, validation and Pages deployment successful.
- [x] Publish source-provenance thumbnail counts for verified publisher and verified Haewon article scopes.
- [x] Update the default-scope baseline: 49 verified Haewon articles; 39 have provenance-backed thumbnails.
- [ ] Extend operational run logs to include RSS/news source outcomes alongside YouTube.
- [ ] Human-review thumbnail relevance and article categorization; do not infer precision from provenance.
- [ ] Perform real mobile-browser visual QA and interaction checks.


## 2026-11-25 — Complete operational source reporting
- [x] Identify run-log omission: RSS/news source outcomes were not represented in the top-level `sources` array.
- [x] Add Google News RSS and Bing News RSS outcomes and item counts alongside YouTube.
- [x] Aggregate overall run status as success/partial/skipped/failed across all sources.
- [x] Add schema-backed tests for complete, partial and mixed source outcomes.
- [ ] Verify code in Actions and Pages.


## 2026-11-25 — RSS run-log source coverage complete
- [x] Merge PR #11 and verify Actions #580: 142/142 tests, all collection/validation/Pages stages successful.
- [x] Verify persisted run log includes YouTube, Google News RSS and Bing News RSS outcomes and item counts.
- [x] Confirm successful run recorded 15 YouTube items, 73 Google News RSS items and 32 Bing News RSS candidates.
- [ ] Continue improving the actual content mix and source-verified article/image coverage.
- [ ] Perform real browser/mobile visual QA and human review.

## 2026-11-25 — Publisher URL type validation
- [x] Audit all 61 explicit HTTPS publisherArticleUrl records against their actual URL type.
- [x] Identify 3 X/Twitter social URLs incorrectly counted as publisher articles; one was an account profile URL.
- [x] Centralize URL validation across RSS/Bing ingestion, candidate merge, thumbnail enrichment and quality metrics.
- [x] Preserve social discovery candidates and original links while excluding social URLs from the verified publisher article scope.
- [x] Add regression tests for X profile/post exclusion, merge cleanup, thumbnail fetch eligibility and metric counts.
- [ ] Run PR tests and data validation in CI; main has no pull_request workflow and local GitHub clone is blocked by DNS in this environment.
- [ ] Confirm regenerated quality metrics on the next production collection run; expected verified counts above are computed against current data but not yet persisted.
 
## 2026-11-25 — Bing RSS social URL regression
- [x] Trace a newly persisted X status URL and social-hosted thumbnail to the Bing RSS parser.
- [x] Apply the shared publisher-article URL predicate to Bing RSS destinations while retaining discovery candidates and provenance.
- [x] Add an end-to-end regression test for Bing parsing, stale-record cleanup and zero social metadata fetches.
- [ ] Run branch tests and archive validation; verify the corrected counts on a subsequent production collection after approval.
 
### Verification update — Bing RSS social URL regression (2026-11-25)
- [x] Apply shared publisher URL validation to Bing RSS article destinations.
- [x] Add regression coverage for the observed X status URL, merge cleanup and blocked metadata enrichment.
- [x] Verify PR branch with a read-only Actions push snapshot: 148/148 tests and archive validation passed.
- [x] Remove the temporary verification workflow after the run.
- [ ] After user-approved merge, verify the next production collection excludes X/Twitter from publisher-article metrics and thumbnail enrichment.
