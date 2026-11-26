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



## 2026-11-25 — Fresh integration and deployment gates

- [x] Reconfirm main SHA, all requested open PRs, current heads and behind counts.
- [x] Separate PR snapshot push runs from actual PR-event checks.
- [x] Verify production Actions #587 substantive steps, Pages artifact upload and deploy step.
- [x] Measure PR #28 public Google/Bing RSS image signals; current sample has zero image metadata from both feeds.
- [x] Preserve all 273 shared legacy thumbnail assignments.
- [ ] Obtain explicit user approval before merging any PR.
- [ ] Rebase/retest PRs #13–#16 and #20/#22–#24 against latest main; PR #14 needs a narrower replacement because its documentation-only branch conflicts with current documentation.
- [ ] Establish the permanent read-only PR CI on main before treating pull_request checks as an enforced gate.
- [ ] After PR #26 approval/merge, verify production Pages deploy using Node24-compatible action pins.
- [ ] After PR #27 approval/merge, verify persisted X/social exclusion and no social thumbnail enrichment in the next production collection.
- [ ] Keep investigating only publicly disclosed publisher article metadata; do not infer article URLs from Google News source URLs or decode wrappers.
- [ ] Real mobile browser, visual layout, keyboard and interaction QA; not verified by Actions.
- [ ] Human review of relevance, date, source, category and thumbnail suitability; precision remains unmeasured.


## 2026-11-25 — Late-session audit gates
- [x] Recheck main SHA, requested PR heads and ahead/behind counts (#13–#30).
- [x] Verify Actions #587 / #45556461352, artifact size/digest and deploy step.
- [x] Confirm PR #30 genuine pull_request run #45570252997 passed tests and archive validation.
- [x] Re-open Sportskeeda article URL and observe HTTP 405; confirm PR #25 tests cover seven-day backoff and no method fallback.
- [x] Review PR #27 shared predicate across Google/Bing ingestion, merge, enrichment, metrics and default display scope.
- [x] Measure PR #28 current RSS image signals: zero in both sampled feeds.
- [ ] Obtain user approval before any merge; none performed.
- [ ] Validate PR #25 latest head through an accepted CI route; distinguish mocked 405 tests from production collector evidence.
- [ ] After approved PR #26 merge, verify a complete production Node24 Pages deployment and artifact.
- [ ] After approved PR #27 merge, verify X/Twitter exclusion in persisted metrics and thumbnails.
- [ ] Review terms and source policy before adding any direct publisher RSS feed.
- [ ] Preserve all 273 shared legacy thumbnails.
- [ ] Perform real mobile/browser, keyboard and human image-relevance QA.

## 2026-11-26 — Latest main, production and PR re-audit
- Current main: `3c93903c6e37839fd69e0a1a74851a3dac3e6174` (`data: refresh archive discovery and improvement cycle`). The data commit was produced by scheduled production run `45695468167`, whose workflow source SHA was `37998b31b12b2eb9980cff6df616b2f677a10de6`.
- Production run #45695468167: 142/142 tests, 0 failures; YouTube 15 items, Google RSS 135, Bing RSS 34; 24 new news candidates; metadata enrichment attempted 12, assigned 8, failed 3, missing 1. Validation, data commit, Pages configuration, 446,580-byte artifact upload and deploy step all succeeded. Artifact SHA-256 `ea394ffa5add0d8ffc8bdfc88673b145cf64fc6d7ebbb9870badc5ffe8d50bcc`.
- Main workflow still references checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. The actual production job emitted a Node.js 20 deprecation warning: these actions target Node20 but are forced to run on Node24. The run still succeeded. GitHub announced Node20 removal on 2026-09-23; do not describe the existing deployment as Node24-native.
- Latest production data: 729 candidates; 543 articles; 186 videos; 77 verified publisher articles; 67 verified Haewon articles; 55 publisher articles and 48 Haewon articles with provenance-backed thumbnails; 329 thumbnail assignments; 400 missing; 57 unique thumbnail URLs. Of the 329 assignments, 273 are the same unverified legacy URL. Human image labels remain 0; visual precision is unmeasured.
- Latest Google RSS diagnostics: 101 items, 98 site-level source URLs, 0 explicit publisher article URLs, 0 image signals. Bing RSS produced 34 candidates; the prior PR #28 sample (36 items) also had 0 image signals. PR #28 parser fixture tests are not proof of live feed image availability.
- All 14 currently open PRs remain unmerged. Current main comparison ahead/behind: #13 59/9, #14 134/9, #15 3/9, #16 13/9, #20 17/7, #22 13/7, #23 15/7, #24 9/7, #25 19/1, #26 8/1, #27 19/1, #28 4/1, #29 13/1, #30 19/1. PR #14 remains mergeable=false; do not merge its stale docs branch wholesale.
- PR #30 genuine pull_request run #45570252997 passed 142/142 tests and archive validation. It ran on a merge commit based on the previous main SHA 37998b31, not latest 3c93903. Its read-only workflow is not yet on main; it is not yet a shared CI gate for other PRs.
- No PR merged and no new source was added. Browser/mobile visual QA remains unverified.

## 2026-11-26 — Next verification gates
- [x] Re-read latest main, all 14 open PRs, current ahead/behind comparisons and latest production run.
- [x] Verify production Actions #45695468167: 142/142 tests, validation, data commit, Pages artifact (446,580 bytes) and deploy step.
- [x] Capture actual Node20 deprecation warning from production job; confirm PR #26 upstream Node24 runtimes and immutable commit pins.
- [x] Recheck Google RSS image diagnostics: 101 items, 0 direct article URLs, 0 image signals; confirm no feed expansion.
- [x] Identify PR #28 standalone social URL regression against PR #27 shared predicate.
- [x] Add legacy persisted-405 statusCode handling and regression test to PR #25 branch.
- [ ] Run PR #25 latest tests in Actions; do not claim passing until a real run exists.
- [ ] Obtain user approval before merging PR #30; then update/re-run open PRs against current main to establish a shared read-only CI gate.
- [ ] Obtain user approval before PR #26 merge; verify complete production Pages deployment using Node24 pins.
- [ ] Sequence PR #27 before PR #28 or port shared social predicate into #28 before any merge.
- [ ] Preserve all 273 shared legacy thumbnails; human review and browser/mobile QA remain pending.

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

## 2026-11-26 — Verification and next implementation priorities
- [x] Reconfirm main `3c93903c...`, Production run `45695468167` and PR #30 read-only run `45704287050`.
- [x] Execute PR #25 head `b152ebc4...` in an isolated read-only Actions workflow: `45718220250`, 145/145 tests and validation passed.
- [x] Re-measure first 12 unique thumbnail URLs with HEAD-only requests: `45718297315`, 1 HTTP 404, 11 image responses, no unreachable or rate-limited URLs.
- [ ] Integrate PR #27 shared X/Twitter article predicate into PR #28 Bing parser; keep original candidate URL/provenance, blank publisherArticleUrl for social destinations, add profile/post regression cases, and run tests on a current-main snapshot.
- [ ] Port PR #16 stored-vs-latest-run metric separation to current main; ensure latest run summary is passed explicitly and historical candidates never inflate current-run assignment rates.
- [ ] Port PR #20 date-first default sort; keep relevance as explicit alternate sort and retain publishedAt → discoveredAt fallback; test invalid dates and unresolved video filtering.
- [ ] Evaluate PR #26 Node24 action pins independently from PR #30 read-only CI. Verify the actual production workflow after any approved rollout.
- [ ] Run the main data collector only when intentionally requested; then independently verify tests, collection, data commit, artifact, Pages deployment and live mobile UI.
- [ ] Preserve 273 legacy thumbnail assignments, avoid automatic deletion/replacement, and keep human review labels per article.
- [ ] Do not add SBS, Yonhap or other new RSS feeds without explicit applicable permission.

## 2026-11-26 — Updated priorities after merged improvements
- [x] Merge read-only PR verification (#30) and confirm genuine PR CI.
- [x] Integrate social-safe publisher URL classification with Bing RSS image parsing, HTTP 405 retry, stored/latest-run thumbnail metrics, and date-first article ordering (#31).
- [x] Upgrade Production Pages actions to immutable Node24-compatible pins (#26).
- [x] Confirm first Node24 Production run #45728961571: 158/158 tests, data validation, data commit, Pages artifact and deployment successful.
- [x] Re-measure thumbnail response sample: 12 URLs; 11 image responses; 1 HTTP 404.
- [ ] Port PR #22's 36-query / six-pack morning-evening rotation to current main without losing PR #31's shared X/Twitter predicate. Measure per-query unique yield, overlap, explicit publisher URL rate and publication lag for at least two cycles before claiming improvement.
- [ ] Review PR #13 human article/thumbnail review controls and define a measurable, privacy-conscious path for collecting labels; current human labels remain a separate quality bottleneck.
- [ ] Keep PR #23 YouTube Data API optional and quota-bounded; never make it a required or paid core dependency.
- [ ] Keep PR #24 Cloudflare/GitHub App dispatcher in dry-run until free-tier limits, app permissions and secret handling are reviewed. Do not request secrets in chat.
- [ ] Improve article-specific thumbnail coverage through public metadata only; never bulk replace the 273 legacy shared-image assignments.
- [ ] Recheck current live site and mobile layout after a verified deployment; deployment success alone is not visual QA.
- [ ] No new publisher RSS source until explicit applicable permission is documented.

## 2026-11-26 — Next research cycle after query rotation
- [x] Merge PR #32 six-pack / 36-query editorial search rotation and per-query diagnostics.
- [x] Verify genuine PR CI #45729777536: 160/160 tests and validation.
- [x] Verify first live run #45729843156: 160/160 tests, collection, validation, data commit and Node24 Pages deployment successful.
- [x] Preserve the shared social URL predicate and Bing image parsing while porting query rotation.
- [ ] Run at least two more distinct query packs, then compare per-query unique yield, cross-query overlap, explicit publisher URL rate, title relevance proxy and publication lag.
- [ ] Only after repeated evidence, consider replacing low-yield terms such as public schedule / fanmeeting searches. Do not infer direct relevance from title keyword proxy alone.
- [ ] Add human review labels through PR #13's review workflow, then evaluate query precision against human-reviewed examples.
- [ ] Continue to keep video/fancam discovery separate from editorial RSS.
- [ ] Keep PR #23 YouTube Data API optional and nonessential; keep PR #24 external dispatcher dry-run until permissions and free-tier limits are reviewed.
- [ ] Improve provenance-backed article thumbnails; 340 assigned, 427 missing, 273 legacy shared-image assignments preserved.
- [ ] Recheck live Pages mobile UI after a separate visual QA; deploy success is not visual QA.
- [ ] Do not add new publisher RSS feeds without explicit applicable permission.

## 2026-11-26 — Next steps after human review rollout
- [x] Merge PR #34 to skip Production on Markdown-only pushes while preserving schedule, manual dispatch and PR CI.
- [x] Merge PR #35 seven-dimension human article review UI and privacy-conscious localStorage export/import.
- [x] Add per-dimension review metrics and a bounded rotating 12-URL HEAD-only accessibility audit.
- [x] Verify Production run #45730919483: 173/173 tests, validation, data commit, Node24 Pages artifact and deployment successful.
- [x] Measure legacy group without mutation: 273 assignments, 0 publisher article URLs, 199 sourceSiteUrl records, 0 alternative thumbnail candidates.
- [ ] Complete manual article review on the deployed page; export JSON from the browser and decide whether to store a sanitized, non-personal review artifact in the repository.
- [ ] Wait for the next KST evening pack 5 run, then compare with pack 4 using per-query unique yield, publisher URL rate, title proxy and publication lag.
- [ ] Continue gathering distinct pack samples; do not prune queries based on repeated same-slot runs or title keyword proxy alone.
- [ ] Review PR #23 optional YouTube API discovery; keep quota-bounded and optional, with no paid/core dependency.
- [ ] Review PR #24 Cloudflare/GitHub App dispatcher only after verifying free-tier limits, minimal permissions and user-controlled secrets. Do not request secrets in chat.
- [ ] Recheck deployed mobile UI and article review panel visually; deployment success is not visual QA.
- [ ] Preserve 273 legacy thumbnail assignments and do not add SBS/Yonhap direct RSS feeds without explicit applicable permission.

## 2026-11-26 — Continuation control
- [x] Define a mandatory clickable next-cycle action in BUTTONS_AND_ACTIONS.md with exact reusable prompt.
- [ ] Verify every subsequent final response ends with that action; treat omission as a failed acceptance criterion.
- [ ] Keep button wording and submitted prompt synchronized with operating rules and session log.


## Publication freshness measurement — 2026-11-26
- [x] Add per-query publication-age buckets: 7 days, 8–30 days, 31–90 days, over 90 days, unknown and future.
- [x] Add 7-day and 30-day freshness rates without filtering or deleting historical candidates.
- [ ] Verify PR CI and current-main merge.
- [ ] Compare at least three distinct query packs before changing search strategy; combine freshness with explicit publisher URL rate, unique yield and human-reviewed relevance labels.
- [ ] Keep stale/unknown candidates visible as historical candidates unless a separate, reviewed display policy is approved.


## Publication freshness measurement — verified 2026-11-26
- [x] Merge per-query 7-/30-day freshness rates and 7/30/90-day age buckets with unknown/future categories (PR #41).
- [x] Verify genuine PR CI #42: 190/190 tests and archive validation passed.
- [x] Verify Production #600: tests, collection, validation, data commit and Pages deployment succeeded.
- [x] Persist first live pack-5 freshness sample: 0/69 within 7 days; 8/69 within 30 days; 46/69 older than 90 days.
- [ ] Compare at least three distinct query packs before changing search strategy; combine freshness with unique yield, explicit publisher URL rate and human-reviewed relevance labels.
- [ ] Manually inspect mobile layout, tap targets, focus and review controls on the deployed Pages site.


## Human-review workflow usability — 2026-11-26
- [x] Add pure seven-dimension review-completion and pending-filter helpers.
- [x] Add pending-only view and next-unreviewed navigation to the article review panel.
- [x] Count explicit uncertain labels as reviewed without treating them as positive relevance.
- [x] Add regression tests for pending queue behavior and UI control wiring.
- [ ] Pass PR CI and archive validation; merge only after genuine success.
- [ ] Verify Production deployment and manually inspect mobile layout, focus and scrolling.
- [ ] Collect a human-reviewed sample before using query proxies to promote/demote search packs.


## Human-review workflow usability — verification checkpoint
- [x] PR #42 merged after 192/192 tests and archive validation passed.
- [ ] Production #601 collection, data commit and Pages deployment verification still running.
- [ ] Manual mobile browser QA still outstanding.


## Human-review workflow usability — Production verified 2026-11-26
- [x] PR #42 merged; PR CI #43 passed 192/192 tests and archive validation.
- [x] Production #601 completed collection, validation, data commit, Pages artifact upload and deployment.
- [x] Add pending-only view and next-pending article navigation.
- [ ] Complete real mobile/browser QA for scrolling, focus, tap targets and import/export.
- [ ] Collect human-reviewed labels; current committed relevance review set remains empty.
- [ ] Compare repeated query-pack samples with human relevance labels before promoting/demoting queries.


## Review queue continuous navigation — 2026-11-26
- [x] Inspect the pending-only queue's completion transition.
- [x] Add deterministic next-pending selection after the completed article.
- [x] Wrap to the first remaining pending item when the completed item was last in order.
- [x] Announce when all seven-dimension reviews are complete.
- [x] Add unit tests for forward progression, wraparound and no-pending state.
- [ ] Verify PR #43 CI and archive validation.
- [ ] Merge only after genuine CI success.
- [ ] Verify Production collection/data commit/Pages deployment separately.
- [ ] Complete real mobile browser/device QA; deployment and unit tests are not substitutes.


## Review queue continuous navigation — verification update
- [x] PR #43 merged as `c77d605cde6eac9476f7d187f77ac6c9c646adee` after PR CI #47 passed 193/193 tests and archive validation.
- [ ] Verify Production #602 collection, generated data commit and Pages deployment (in progress at last check).
- [ ] Complete real mobile browser/device QA; not established by CI or deployment.


## Review queue continuous navigation — Production verified
- [x] PR #43 merged after PR CI #47 passed 193/193 tests and archive validation.
- [x] Production #602 passed tests, collection, data validation, data commit, Pages artifact upload and Pages deployment.
- [x] Generated data commit `96a79935d85f23b17887b3ab20b95b780f1ab234` recorded.
- [ ] Complete real mobile browser/device QA for automatic focus, scroll, tap targets and import/export.
- [ ] Collect actual human review labels; committed relevance review set remains empty.
- [ ] Compare repeated query packs using human-reviewed relevance labels before changing query selection.


## Mobile review accessibility and local backup — 2026-11-26
- [x] Inspect existing browser test stack; repository uses Node built-in test runner and has no Playwright/Puppeteer setup or dependency.
- [x] Add 44px minimum touch targets, visible focus outlines and narrow-screen action layout for the article-review panel.
- [x] Make localStorage writes transactional and preserve old records on storage/import failure.
- [x] Improve manual JSON import/export feedback and merge only validated, currently eligible article IDs.
- [x] Add Node tests for mobile CSS/accessibility contracts and persistence/import/export error handling.
- [x] PR CI #48 passed 195/195 tests and archive validation.
- [ ] Merge PR #44 after final head/check confirmation.
- [ ] Verify post-merge Production/data commit/Pages deployment.
- [ ] Perform actual Android/mobile browser QA; automated source/CSS checks do not establish device behavior.
- [ ] Collect human-reviewed article labels; repository review set remains empty.


## Mobile review accessibility — Production verified
- [x] PR #44 merged after CI #51 passed 195/195 tests and archive validation.
- [x] Production #603 passed tests, collection, data validation, data commit, Pages artifact upload and Pages deployment.
- [x] Generated data commit `7753a02be1ad512a44348b67e483ee75038c6b7a` recorded.
- [ ] Perform real Android/mobile browser QA: narrow viewport, tap target comfort, keyboard focus, scroll/auto-advance, JSON download/import and storage quota failures.
- [ ] Collect voluntary human-review labels; repository label set remains empty.
- [ ] Compare repeated query packs using actual human-reviewed relevance, not only freshness/title proxies.
- [ ] Continue thumbnail-source investigation; latest enrichment attempted 0, 504 missing remain, preserve 273 legacy assignments.


## Review JSON and compact mobile queue — 2026-11-26
- [x] Add pure Node helper to create a schema-clean review JSON export.
- [x] Add safe merge helper validating imported schema and eligible article IDs while preserving unrelated existing labels.
- [x] Add round-trip, unknown-field stripping, allow-list, merge-preservation and invalid-import immutability tests.
- [x] Collapse individual article rows by default; next-pending opens the target before focus/scroll.
- [ ] PR CI and archive validation must pass before merge.
- [ ] Perform actual Android Chrome QA for narrow layout, disclosure, seven controls, next-item focus/scroll, refresh persistence and JSON download/import.
- [ ] Collect voluntary human review labels; committed label set remains 0.
- [ ] Do not change search packs without repeated samples and human relevance labels.
- [ ] Continue thumbnail investigation; 504 missing remain and 273 legacy assignments must not be deleted or replaced.


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


## 2026-11-26 — Post-PR #46 follow-up
- [x] Independently verify PR CI #55: 201/201 tests and archive validation for 856 candidates.
- [x] Independently verify Production #606 job, generated data commit, Pages artifact metadata and successful deployment.
- [x] Reinspect collapsed review disclosures, seven dimensions, next-pending open/focus/scroll, JSON import/export, per-dimension merge and transactional storage helper on main.
- [ ] Obtain user-reported Android Chrome QA for narrow viewport, expand/collapse, seven selects, next-pending focus/scroll, refresh persistence, JSON export/import round-trip and no automatic network transfer.
- [ ] Collect actual human article-review labels; current count 0.
- [ ] Review thumbnail candidates; current eligible 482 / reviewed 0.
- [ ] Preserve 273 legacy shared-image assignments; no deletion or bulk replacement.
- [ ] Keep search pack 5 unchanged until repeated observations and human relevance labels justify a change.


## 2026-11-26 — Next regression fix
- [x] Re-audit latest main, open PRs, latest Actions, Production #606, generated data commit and Pages artifact/deploy.
- [x] Re-read six continuity/policy documents.
- [x] Identify stale-value rollback edge case after successive review edits.
- [ ] Pass PR CI with regression test: successful edit followed by failed edit restores latest persisted value for both review dimension and expectedCategory.
- [ ] Merge only after CI + full archive validation pass.
- [ ] Recheck merged main, open PRs and Actions; record exact outcome.
- [ ] Obtain user-reported Android Chrome QA; do not substitute CI.
- [ ] Gather human article labels (0 currently) and thumbnail reviews (0/482 currently).
- Keep 273 legacy shared-image records unchanged; no new RSS without permission; no search-pack changes without repeated observations and human labels.

- Validation correction: initial PR CI run `45792852673` executed 202 tests but failed one new source-contract assertion because the test regex was over-escaped; application code and the sequence test logic were not the reported failure. The assertion escaping was corrected in commit `eaf649630c18b8607f4723ea0a2d91995fa698cd`. Re-run CI before merge; do not treat the first run as passed.

## 2026-11-26 — Final outcome: PR #48 and Production #607
- PR #48 (`fix: restore latest saved review values after failed edits`) merged successfully as `f78deda672750ee05ab12e9cb12477e24c304987`. It updates the review UI rollback to read the latest committed in-memory label for all seven dimensions and expectedCategory, with a regression test for successful edit A followed by failed edit B.
- PR CI #62 (`45792986157`) on final PR head `11bb2cb5d0c58a268ce7338285aed490c6db80ef` passed: 202 tests, 202 passed, 0 failed; archive validation passed with 856 discovery candidates, 0 human-reviewed article labels and 179 schema-valid run logs; no review labels were added.
- The earlier PR CI #57 failed only on an over-escaped test source regex. The assertion was corrected and the final #62 run passed. Intermediate superseded runs were cancelled; they are not final CI results.
- Production #607 (`45793067039`) completed successfully on merge commit `f78deda672750ee05ab12e9cb12477e24c304987`: 202/202 tests; collection and archive validation successful; generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; Pages artifact `15103711890`, 597,338 bytes, SHA-256 `42f7bd9540b7ce086d2eac5baee3f7934dff2a5452c35b241ed4d9fdac80961c`; deployment log explicitly says `Reported success!`.
- Latest generated metrics: 856 candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails. Thumbnail audit: 352 assigned / 504 missing; 80 unique URLs; 273 legacy shared-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed. Article human review labels remain 0. Google News wrapper-only metadata: 12 candidates, left untouched. No new RSS, no wrapper decoding, no access bypass, no search-pack change, no auto upload, no Playwright/Puppeteer.
- Latest main at this checkpoint is the generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; open PR search returned 0 after #48 merge. This documentation follow-up is a Markdown-only PR and does not trigger another Production run.
- Android Chrome QA remains **UNVERIFIED** because no user-reported device checklist was received. Pure Node tests, PR CI and Pages deployment do not constitute real-device QA.


## 2026-11-26 — Thumbnail review persistence reliability
- [x] Audit thumbnail review save paths against the already transactional article-review storage helper.
- [x] Make candidate labels, repeated-image labels and JSON import commit in-memory state only after `localStorage.setItem` succeeds.
- [x] Restore the most recently saved selector value and retain prior labels after a storage exception.
- [x] Add behavior tests for simulated quota failure and successful persistence; add UI integration guards.
- [x] PR CI #64: 205/205 tests passed; archive validation passed (856 discovery candidates).
- [ ] Merge PR #50 after its latest head CI (including documentation changes) passes.
- [ ] Verify Production collection, generated data commit and Pages deployment after merge; these are not yet run for PR #50 at this checkpoint.
- [ ] Obtain user-reported Android Chrome QA; automated tests are not device QA.
- [ ] Begin actual human review of the 482 eligible thumbnail candidates (0 reviewed) when the user chooses to do so. Preserve the 273 legacy shared-image assignments.


## 2026-11-26 — PR #50 completed
- [x] Merge transactional thumbnail review persistence fix after latest-head CI passed.
- [x] Verify Production #608 end-to-end, including generated data commit and Pages deployment.
- [x] Confirm 273 legacy shared-image assignments remain preserved and no thumbnail reassignment was introduced.
- [ ] Obtain user-reported Android Chrome QA for review UI, persistence and manual JSON import/export.
- [ ] Begin human review of thumbnail candidates (482 eligible / 0 reviewed) when user chooses; do not auto-label.
- [ ] Improve actual thumbnail coverage only through permitted explicit public metadata and source evidence; no new RSS or wrapper decoding without approval.


## 2026-11-26 — Thumbnail review queue visibility
- [x] Recheck the next-unreviewed candidate path against the actual collapsed card DOM.
- [x] Open the candidate's `details.thumbnail-review-disclosure` before scrolling/focusing its select.
- [x] Add helper unit tests and UI integration order assertion.
- [ ] Pass latest PR CI and archive validation; merge only after successful final-head CI.
- [ ] Verify Production collection, generated data commit and Pages deployment after merge.
- [ ] Obtain user-reported Android Chrome QA; automated CI is not device QA.
- [ ] Continue preserving the 273 legacy shared-image assignments; do not auto-label the 482 pending thumbnail candidates or 76 verified Haewon articles.


## 2026-11-26 — PR #52 completed
- [x] Fix next-thumbnail queue to open the collapsed candidate details before scrolling/focusing.
- [x] Pass final-head PR CI #74: 207/207 tests; archive validation passed.
- [x] Merge PR #52 and verify Production #609 plus generated data commit and Pages deployment.
- [ ] Obtain user-reported Android Chrome QA for queue visibility, focus, touch, and localStorage/JSON behavior.
- [ ] Start human thumbnail/article review only when user elects to do so; current counts remain 482 thumbnail candidates / 0 reviewed and 76 verified Haewon articles / 0 human review labels.
- [ ] Continue permitted thumbnail evidence investigation; preserve 273 legacy shared-image assignments and do not add unapproved RSS sources.


## 2026-11-26 — Thumbnail review auto-advance (PR candidate)
- [x] Re-audit main, open PRs, recent Actions, Production run, generated data commit and Pages artifact.
- [x] Read SESSION_LOG, PROJECT_STATUS and all six continuity documents.
- [x] Identify repeated extra-click friction in thumbnail review after successful manual saves.
- [x] Implement local-only auto-advance after confirmed storage success; preserve manual label choice and failure rollback.
- [x] Add an integration contract for success-only advancement.
- [ ] Pass final-head PR CI and full archive validation.
- [ ] Merge only after successful final-head verification.
- [ ] Verify Production collection, generated data commit and Pages deployment independently.
- [ ] Obtain user-reported Android Chrome QA; automated tests are not device QA.
- [ ] Begin actual manual review only when the user chooses; do not auto-label 482 thumbnail candidates or article records.


## 2026-11-26 — PR #54 and Production #610 final verification
- PR #54 merged as 8d2a6534371eaf302d703b98635a4db195dee175. Final-head PR CI #76 (45813584290) passed 208/208 tests, 0 failures; archive validation passed with 857 discovery candidates, 181 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #610 (45813683219) completed successfully on merge SHA 8d2a6534371eaf302d703b98635a4db195dee175. Test/collect/validate/data-commit, Pages artifact upload and Pages deployment steps all succeeded; deployment log explicitly reported “Reported success!”.
- Generated data commit: 46572b91bc23d3b74f91ae9954332858980346cd. Pages artifact 15114537998, 613,063 bytes, SHA-256 4d4bca14325820f3c0a3d83640ef620af86d60e4846438be8c4fad5895995295.
- Production #610 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google News RSS 94 items; Bing News RSS 39 items; archive validation passed. Current archive: 857 candidates (670 articles / 187 videos), 352 thumbnails assigned / 505 missing, 80 unique URLs; 273 legacy shared-image assignments retained; 482 thumbnail-review eligible / 0 reviewed; article human relevance labels 0.
- PR #54 changes only browser-local review interaction: after a manually selected label is successfully saved, the next pending candidate is opened, scrolled into view and focused. Failed storage writes preserve the previous label and do not advance. No review labels were created or uploaded.
- No collection sources, RSS, query pack, thumbnail assignments, labels, storage destination or backend changed. No new RSS, wrapper decoding, access bypass, paid service or external transmission. Android Chrome QA remains UNVERIFIED.
