# Roadmap

## MVP stabilization
- [x] Build responsive static archive UI
- [x] Preserve existing NMIXX video records; disable YouTube Atom polling after robots/terms audit
- [x] Preserve historical video records and deduplicate by video ID
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


## 2026-11-26 — Repeated-image review auto-advance (PR candidate)
- [x] Re-audit main, open PRs, recent Actions, Production run, generated data commit and Pages artifact.
- [x] Re-read six continuity documents and inspect current metrics/code.
- [x] Confirm repeated-image review lacks the successful-save auto-advance already present in the primary queue.
- [x] Implement per-article repeated-group auto-advance after successful local save only.
- [x] Add integration contract for success-only advancement.
- [ ] Pass final-head PR CI and full archive validation.
- [ ] Merge only after successful final-head verification.
- [ ] Verify Production collection, generated data commit and Pages deployment independently.
- [ ] Obtain user-reported Android Chrome QA; automated tests are not device QA.
- [ ] Start manual review only when user chooses; do not auto-label the 273 repeated legacy rows, 482 thumbnail candidates or article records.


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
- [x] Inspect Production #611 partial collection result and identify the failed Bing query/error.
- [x] Confirm the current persisted failure record omits HTTP status and Content-Type.
- [x] Implement response format classification and privacy-minimal failure metadata; do not retry blindly.
- [x] Add unit tests for RSS/Atom/HTML/empty/unknown and body non-retention.
- [ ] Pass final-head PR CI and archive validation.
- [ ] Merge only after successful CI.
- [ ] Verify the next Production run's Bing query status and Pages deployment independently.


## 2026-11-26 — Persist feed diagnostics end-to-end (PR candidate)
- [x] Trace Production #612's Google HTTP 429 and Bing non-RSS failures.
- [x] Find and fix serializer dropping HTTP status, Content-Type and response format.
- [x] Capture safe diagnostic metadata for both RSS providers.
- [x] Add tests covering HTTP 429 and HTML response classification and body non-retention.
- [ ] Pass final-head PR CI and archive validation.
- [ ] Merge only after successful CI.
- [ ] Verify Production #613 data JSON actually contains diagnostic fields and assess feed outcomes.

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

 
## 2026-11-27 — Thumbnail missing-source diagnosis
- [x] Re-read latest main, operational docs, Production #614, current metrics and current source/metadata diagnostics.
- [x] Quantify source coverage separately from explicit publisher article URL coverage; preserve source-site URLs as a distinct field.
- [x] Implement evidence-based missing-thumbnail reason summaries and expose them in the read-only quality dashboard on a feature branch.
- [ ] Pass final-head PR CI and archive validation.
- [ ] Review the resulting diagnostic breakdown on the next generated quality report.
- [ ] Merge only after CI and full data validation pass.
- [ ] Verify the next Production data commit and Pages artifact/deployment separately.
- [ ] Keep Android Chrome QA pending user-provided real-device results.

 
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

 
## 2026-11-27 — Fan-facing discovery visibility
- [x] Add top-level navigation to videos, article images, discovery articles and photo-post library (feature branch).
- [x] Expose the 61 existing source-provenance-backed verified Haewon article images in a responsive gallery with original article links (feature branch).
- [x] Widen default article discovery from verified-only to Haewon article candidates while retaining all-candidate filter (feature branch).
- [x] Add explicit publisher-original/discovery-link actions and pagination for unresolved video candidates (feature branch).
- [x] Display archived official video count separately from latest feed fetched/new counts and clarify it is not channel-wide total (feature branch).
- [ ] Pass PR CI and full archive validation; merge only after success.
- [ ] Perform real Android Chrome visual/tap-target QA with user checklist.
- [ ] Design permitted public official photo-post discovery sources; do not claim photo-post collection until original post URLs and source permission are verified.
- [ ] Reassess YouTube channel-wide history only with a compliant API Data 30-day refresh/deletion lifecycle; do not enable an API-key dependency by default.

 
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

## 2026-11-27 — Priority follow-up: prove multi-event persistence
1. Complete unit tests for append-only history: old failure + later success + distinct later failure + replay dedupe + same query/different run.
2. Verify Retry-After is stored only when the response header exists and that each query is fetched once; no blind retry.
3. Pass PR CI and committed archive validation before merge.
4. Inspect the next real Production run and compare its run log with `data/query-failure-history.json`. A second event counts only if the run actually reports a different failed query. Do not synthesize production events.
5. Verify Production data commit, Pages artifact ID/hash, and deployment step independently from collection status.
6. Keep JYP Gallery/Notice manual-link-only until robots/terms/permission evidence is explicit; keep broadcaster feeds disabled until exact channel IDs, public Atom feeds, terms/robots, and item-level Haewon appearances are verified.

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

### Execution gate
- Do not create a synthetic operational failure to force a second history event.
- At the next scheduled Production run, compare the actual failed-query list with the append-only history.
- A second distinct live failure and its survival through a subsequent success are the remaining operational acceptance criteria.

## 2026-11-27 — YouTube channel identity and Atom-feed policy recheck
- Verified the M2 YouTube channel page as a verified channel with handle `@MnetM2`, exact channel ID `UCTQVIXvcHrR9jYoJ6qaBAow`, and CJ ENM copyright/identity description. Source: https://www.youtube.com/channel/UCTQVIXvcHrR9jYoJ6qaBAow
- Verified the KBS Kpop handle-to-channel mapping: `@kbskpop` resolves to channel ID `UCeLPm9yH_a_QH8n6445G-Ow`; the channel page title is KBS Kpop. KBS first-party pages already establish KBS Kpop as its official music/YouTube channel. Keep this as identity/provenance only, not a collector permission. Sources: https://www.youtube.com/channel/UCeLPm9yH_a_QH8n6445G-Ow and https://world.kbs.co.kr/service/news_view.htm?Seq_Code=189750&lang=e
- Re-read YouTube's official Terms of Service: section "Permissions and Restrictions" says automated access (robots, scrapers) is not allowed except public search engines acting in accordance with robots.txt or prior written permission; use of Content is limited as described and embeds are the allowed presentation path. Source: https://www.youtube.com/t/terms
- Read YouTube's current robots.txt: it explicitly disallows `/feeds/videos.xml` for `User-agent: *`. Source: https://www.youtube.com/robots.txt
- Direct fetches of candidate Atom URLs were blocked by the current verifier; this is not evidence of feed unavailability. However, the published robots exclusion for `/feeds/videos.xml` is affirmative evidence that the Atom path is not permitted for an ordinary automated collector under the public-search-engine exception. Therefore do not poll YouTube Atom feeds for KBS, M2, MBCkpop, or ALL THE K-POP unless written permission or a clearly applicable authorized API basis is established.
- Exact ID status: KBS Kpop `UCeLPm9yH_a_QH8n6445G-Ow`; M2 `UCTQVIXvcHrR9jYoJ6qaBAow`; MBCkpop `UCe52oeb7Xv_KaJsEzcKXJJg`; ALL THE K-POP `UCPde4guD9yFBRzkxk2PatoA`. These are identity facts only; no broadcaster feed is enabled and no video is auto-labeled broadcaster-official.
- SBSKPOP ZOOM first-party ownership and stable channel ID remain unverified. JYP Gallery/Notice remain manual-link-only due unresolved robots/terms/metadata permission.
- No YouTube API activation: the 30-day refresh/deletion lifecycle requirement remains unmet. No code/source registry change, no automated collection, and no video reclassification was made.

### Revised decision
- Remove YouTube Atom polling from the near-term implementation plan unless written permission or a separately documented authorized access basis is obtained.
- Continue only manual linking or permitted YouTube embeds. Revisit Data API only after the required 30-day refresh/deletion lifecycle is implemented and policy-reviewed.


## 2026-11-27 — YouTube source-policy correction
- [x] Disable the legacy NMIXX YouTube Atom collector after confirming the feed path is disallowed by robots.txt.
- [x] Preserve previously collected video records and provenance.
- [ ] Keep YouTube Data API disabled until a compliant 30-day refresh/deletion lifecycle is implemented and reviewed.
- [ ] Reconsider YouTube automation only after written permission or a clearly authorized access method is documented.


## 2026-11-27 — Production #621 verified
- [x] Disable YouTube Atom polling and preserve the 20 historical video records.
- [x] Remove Production workflow injection of YOUTUBE_API_KEY and hard-disable API search pending lifecycle review.
- [x] Verify a real Production run logs nmixx-youtube as skipped with zero network requests.
- [ ] Verify the next scheduled Production run at 20:17 KST separately from the push-triggered #621 run.
- [ ] Implement and review a compliant 30-day YouTube Data API refresh/deletion lifecycle before considering any API activation.


## 2026-11-27 — Production #622 schedule-event checkpoint
- [x] Confirm a real schedule-event Production run with YouTube Atom disabled and 20 historical videos preserved.
- [ ] Verify the configured 20:17 KST (11:17Z) cron slot separately; #622's event timestamp was 14:03:36 KST and does not match that slot.
- [ ] Investigate GitHub Actions schedule timing/queue delay before changing the cron configuration; preserve the current two-run schedule until evidence supports a change.

## 2026-11-27 — Scheduled-run diagnostics
- [x] Confirm cron definitions and compare them with #614/#622 Actions timestamps.
- [x] Confirm existing run logs omit GitHub's schedule expression, preventing retrospective mapping to one of two cron entries.
- [ ] Add optional `scheduleExpression` to run-log schema and logger using `github.event.schedule`.
- [ ] Verify 20:17 KST slot separately; do not assume #622 was that slot.
- [ ] After the next matching run, compare expression, Actions created/start times, and run-log startedAt; investigate without speculative cron changes.

## 2026-11-27 — Schedule-expression observability
- [x] Add optional `scheduleExpression` to run-log schema and logger, wired to `github.event.schedule`.
- [x] PR #75 CI 226/226 and archive validation passed; merged as a2eeba7763323ec7ec953c033fc01815cdcace42.
- [x] Post-merge push Production #623 passed 226/226 and deployed Pages artifact; it is not a scheduled-run confirmation.
- [ ] Verify the next 20:17 KST schedule run records `scheduleExpression: 17 11 * * *` and compare its timestamps.
- [ ] Keep #614/#622 schedule-time anomalies unresolved until new telemetry provides evidence; do not alter cron speculatively.

 
## 2026-11-27 19:08 KST — Next operational gate
- [x] Verify current main, PR #75/#76, PR #76 CI, Production #623, run log, artifact digest and deployment step.
- [x] Confirm #623 is push-triggered and not the 20:17 KST schedule slot.
- [x] Confirm #617 HTTP 429 remains the only real query failure; no synthetic failure.
- [ ] After 2026-11-27 20:17 KST, inspect the next genuine schedule run. Require event=schedule and run-log scheduleExpression='17 11 * * *'; compare startedAt, created_at and run_started_at.
- [ ] Record that run's tests, collection counts, data commit, artifact digest, deploy step and independent public URL result separately.
- [ ] Confirm whether any distinct live query failure was appended and preserved by a later successful run. If no failure occurs, leave live multi-failure acceptance pending.
- [ ] Keep YouTube Atom disabled, videos.json 20 records, Data API disabled, source restrictions, 273 legacy thumbnail group and transactional review-save flow unchanged. Android real-device QA remains user-unverified.

 
## 2026-11-27 — Post-20:17 schedule verification
- [x] Recheck live main, open PRs, recent Actions, latest Production, run log, workflow, data, artifact metadata and Production job log.
- [x] Verify #623 is push-triggered, not the 20:17 KST schedule.
- [x] Verify #623 226/226 tests, committed archive validation, collection, data commit, artifact SHA-256 and deploy-pages step.
- [x] Confirm #617 real HTTP 429 remains in append-only history through later successful runs; no synthetic failures.
- [ ] Observe a genuine schedule run for the 20:17 KST slot; none was present at 21:22 KST. Keep status unverified and root cause unknown.
- [ ] Observe the next 08:17 KST slot (2026-11-28 23:17 UTC) and require `scheduleExpression=17 23 * * *`.
- [ ] Verify a second distinct live query failure and preservation through a later success; do not manufacture failures.
- [ ] Improve article thumbnail quality only with human-reviewed labels/evidence; current review coverage is 0%, precision null. Keep 273 legacy shared assignments untouched.
- [ ] Complete Android Chrome real-device QA only when user directly checks the deployed site.

 
## 2026-11-27 22:03 KST — Fresh verification and research checkpoint
- [x] Recheck latest main, open PRs, recent Actions and latest Production.
- [x] Confirm 20:17 KST slot still has no observed Production #624 or later; keep cause unknown.
- [x] Verify #623 tests, validation, collection, data commit, artifact digest and Pages deploy steps.
- [x] Recheck #617 real 429 remains append-only; no synthetic failures.
- [x] Review current RSS and publisher image extraction code against Google Search Central and Open Graph documentation.
- [ ] Observe next 08:17 KST scheduled Production and verify exact `17 23 * * *` expression.
- [ ] Measure any retry-eligible missing explicit publisher article URLs; do not assume the 0 attempts reason without item-level evidence.
- [ ] Add human thumbnail labels; 493 eligible, 0 reviewed, precision null. Preserve 273 legacy assignments.
- [ ] Complete Android Chrome real-device QA after user direct check.


## 2026-11-27 22:10 KST — Next-cycle action
- **Visible label:** 🔄 연구 기반 재귀개선 계속하기
- **Action:** submit the full continuation prompt below.

```text
Haewon Archive 연구 기반 재귀개선을 계속한다. 최신 main SHA를 GitHub에서 실시간 조회하고 일곱 운영 문서를 먼저 읽는다. 직전 확인 main은 dd4ff74e5b4be907f34bdd0c1dffb62a7dd37030이며 PR #79는 병합되었고 열린 PR은 없었다. 최신 Actions 목록에서 Production #624 또는 이후 실행은 관찰되지 않았다. 20:17 KST 슬롯은 미관찰/원인 미확인으로 유지하며 GitHub drop/실패로 단정하지 않는다.

다음 슬롯은 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC다. Actions event=schedule, run-log trigger=github_schedule, scheduleExpression='17 23 * * *'가 모두 일치해야 한다. Actions created_at/run_started_at과 run-log startedAt을 대조한다. #614/#622는 expression이 없어 소급 추정하지 말고 cron 변경 금지.

최신 Production #623(run 45949528329)은 push 실행이다. 226/226 테스트, 전체 데이터 검증 성공, Google News 99/Bing News 31, data commit c5382d9816e114c565357f0f22eb47e1b7771b0b, artifact 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7, Pages configure/upload/deploy steps 성공. 공개 URL 직접 접근은 verifier에서 실패하여 미검증이다.

썸네일 전체 데이터 audit: discovery.json 936개 전체 Git blob을 파싱했다. 명시적 HTTPS publisherArticleUrl 111, 썸네일 누락 577, 그중 publisherArticleUrl도 있는 누락 27. 상태는 missing 17, failed 10(403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). 2026-11-27 22:10 KST 기준 재시도 가능 0/27. 7일/30일 backoff와 6시간 offset 회전, 최대 12개 제한은 기존 코드대로다. 가장 빠른 다음 eligibility는 2026-12-01T06:57:55Z. 재시도 대상이 0이므로 blind retry, 임의 HTML fetch 및 parser 확장 금지. 실제 eligible publisher page에서 extractor miss가 확인될 때만 fixture/test/구현한다.

Baseline: 936 candidates(749 articles,187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article image previews, 0 independent photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments. RSS image signals/candidates 0, 86 meta-only, thumbnail review 493 eligible/0 reviewed/precision null. #617 실제 HTTP 429만 append-only history에 남아 있으며 합성 이벤트 금지.

YouTube Atom 비활성, videos.json 20개, Data API 비활성, workflow YOUTUBE_API_KEY 전달 금지. collection-status에 networkRequests field가 없으므로 0 요청이라고 단정하지 말고 itemsFetched=0만 직접 보고한다. JYP/NMIXX Gallery·Notice 수집기 금지, SBSKPOP ZOOM 소유권 미확인, 방송사 수집기/broadcaster-official 자동분류 금지, Google News wrapper decode/access bypass 금지. 273개 레거시 공유 썸네일 및 PR #54/#56 transactional save/move/restore 흐름 보존.

다음 Production이 나타나면 tests, collection, data commit, artifact digest, Pages deploy, 공개 URL을 각각 검증한다. 일곱 문서를 매 사이클 갱신하고 PR CI 및 전체 데이터 검증 성공 후에만 병합한다. Android Chrome 실기기 QA는 사용자 직접 확인 전까지 미검증. 코드/테스트/Production/데이터/artifact/Pages/Android QA를 분리 보고하고 PR/Actions 링크와 다음 전체 지시 버튼을 제공한다. 확인하지 않은 결과를 성공으로 보고하지 않는다.
```


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Next-cycle action
- **Visible label:** 🔄 연구 기반 재귀개선 계속하기
- **Action:** submit the complete continuation prompt below.

```text
Haewon Archive 연구 기반 재귀개선을 계속한다. 최신 main SHA를 GitHub에서 실시간 조회하고 일곱 운영 문서를 먼저 읽는다. 직전 main은 7ac89feae4ac0b18bb3d99319fadd7e52ddab7de이다. 최신 Actions 목록에는 Production #624 또는 이후 실행이 없다. 20:17 KST 슬롯은 미관찰/원인 미확인으로 유지하고 drop/실패로 단정하지 않는다.

현재 확인 시각은 2026-11-27 22:19 KST다. 다음 예약은 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, expression 17 23 * * * 이다. 아직 미래이므로 성공/실패 판정하지 않는다. 실행 후 Actions event=schedule, run-log trigger=github_schedule, scheduleExpression='17 23 * * *'를 모두 대조하고 created_at/run_started_at과 startedAt을 비교한다. #614/#622 소급 추정 금지, cron 변경 금지.

최신 Production #623(run 45949528329)은 push 실행. 226/226 tests, full archive validation passed, Google News 99/Bing News 31, data commit c5382d9816e114c565357f0f22eb47e1b7771b0b, artifact 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7, Pages configure/upload/deploy success. Public URL verifier cannot access; direct public access unverified.

Full discovery.json audit at 22:19:12 KST: 936 records; explicit HTTPS publisherArticleUrl 111; missing thumbnails 577; both missing + explicit publisher URL 27. Status missing 17 (10 status 200, 7 no status), failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Current retry eligibility 0. Earliest next eligibility 2026-12-01T06:57:55.671Z. Offset 83138, max 12, selected 0. Retry rules 1/7/30 days. No blind retry or speculative HTML fetch; only add fixture/code if an eligible actual publisher page proves extractor miss.

Baseline unchanged: 936 candidates (749 articles,187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article image previews, 0 independent photos, 359 assignments, 577 missing, 273 legacy shared assignments; RSS signals/candidates 0, 86 meta-only, thumbnail review 493 eligible/0 reviewed/precision null. #617 actual HTTP 429 only, no synthetic events.

YouTube Atom disabled, videos.json 20, Data API disabled, no workflow YOUTUBE_API_KEY. collection-status has no networkRequests field; do not claim networkRequests=0. Keep JYP/NMIXX Gallery/Notice collectors disabled, SBSKPOP ZOOM ownership unconfirmed, no broadcaster collectors or broadcaster-official auto-label, no Google News wrapper decoding/access bypass. Preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.

Next cycle: live-check main, PRs, Actions, Production, data commit, artifact digest and Pages. Update all seven docs and only merge after PR CI + full archive validation. Android Chrome QA remains unverified until user checks directly. Report code/tests/Production/data/artifact/Pages/Android separately and include PR/Actions links plus a complete next-cycle button. Never report unverified success.
```

## 2026-11-27 22:31 KST — Live verification checkpoint
- Live main at start of this cycle: `d0b256db3fa4208112900387a2021683f6abbf71`; latest re-fetch confirmed it remained current. No open PRs.
- Current time is 2026-11-27 22:31 KST. The 20:17 KST / 11:17 UTC Production slot remains unobserved / cause unknown. The next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron expression `17 23 * * *`; it is still in the future. Do not label it success/failure before it runs. Afterward require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression, and compare created_at/run_started_at with startedAt. Do not infer #614/#622 expressions or change cron.
- Latest Production remains #623, run `45949528329`, event=push. Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`. Job `140341900635` succeeded; 226/226 tests, 0 failures; run-log validation passed. Google News 99, Bing News 31, YouTube skipped, queryFailures empty. Pages configure/upload/deploy steps succeeded.
- Data commit remains `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Pages artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Independent public Pages URL access remains unverified; successful deploy steps are not live-site proof.
- Current main's full Git blob for `data/discovery.json` was parsed: 936 records, 577 missing thumbnails, 111 explicit HTTPS publisherArticleUrl, 27 records with both missing thumbnail and explicit publisher URL. Nested `thumbnailMetaFetch` classes: missing 17 (10 status 200, 7 no status); failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Exact 1/7/30-day retry policy yields 0 eligible at 22:31 KST; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No requests or blind retries were made. The six-hour offset/max-12 policy is unchanged; selected count is 0.
- Quality metrics still show 936 candidates (749 articles, 187 videos), 84 verified Haewon articles, 62 verified Haewon article-image previews, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image candidates 0, 86 meta-only comparisons, review 493 eligible / 0 reviewed / precision null. Independent photos remain 0.
- `data/query-failure-history.json` still contains only the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, `videos.json` 20, Data API disabled, no workflow YOUTUBE_API_KEY injection. `collection-status.json` has no `networkRequests` field; do not claim measured networkRequests=0. Preserve all source restrictions, 273 legacy assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA remains unverified until the user checks directly. No code or collection-data change was justified in this cycle.

## Next work
1. After 2026-11-28 08:17 KST, verify the exact scheduled-run triple and timestamps before assigning a status.
2. If a new Production data commit appears, re-read the full discovery blob and recompute retry eligibility; otherwise retain zero eligible and do not retry.
3. Only add an HTML fixture/test/parser change when a retry-eligible real publisher page demonstrates a specific extraction miss.
4. Keep Android Chrome QA as user-confirmed pending.

## Next cycle — 2026-11-28 06:47 KST
1. Before 08:17 KST, keep the 17 23 * * * slot pending; do not assign success/failure early.
2. After the slot, identify the actual schedule run and require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression=17 23 * * *, and timestamp comparison. Keep the earlier #624 late run classified as the prior 17 11 slot, not this slot.
3. If a new data commit appears, fetch the complete discovery Git blob and recompute item-level retry eligibility against the current code and time. Do not infer from summary metrics or partial contents.
4. Retry only actual eligible publisher URLs under the existing 1/7/30-day policy, six-hour rotation and max 12. Only create fixture/test/parser changes if an eligible real publisher page proves a specific extraction miss.
5. Preserve the 273 legacy assignments, #617 real 429 history, YouTube/source restrictions and PR #54/#56 transactional flow.
6. Keep Android Chrome QA and direct Pages URL verification pending user/direct verification.

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


## 2026-11-28 13:54 KST — Delayed 08:17 slot confirmed as Production #625
- Live GitHub API recheck: default branch `main`; current main SHA before this documentation-only PR is `76cc186a50f2c40e7d7e85bc9fa949327145ee40`. Re-read all seven operating documents at this exact main SHA before edits.
- PR #92 remains open and unmerged (`merged=false`). Its PR verification run #122 / `46085764169` is completed-success; job `test-and-validate` passed both Unit tests and Validate committed archive data. Do not merge without explicit user approval. The PR base SHA is still `c45b0f62889fb686dd36dceb3cfb67516cda8961`, behind current main after Production #625 data commit.
- Repository-wide GitHub Actions API query `event=schedule&per_page=100` now returns `total_count=20`. Newest is Production #625 / run `46108902884`, event=schedule, created_at/run_started_at `2026-11-28T04:44:06Z`, completed success at `04:44:54Z`, head SHA `c45b0f62889fb686dd36dceb3cfb67516cda8961`. This is the delayed execution for the 2026-11-27 23:17 UTC / 2026-11-28 08:17 KST slot, approximately 5h27m after the scheduled minute. Its persisted run-log `data/run-logs/46108902884.json` records `trigger=github_schedule`, exact `scheduleExpression=17 23 * * *`, `startedAt=2026-11-28T04:44:11.000Z`, `finishedAt=2026-11-28T04:44:31.526Z`, `status=success`, and validation passed with no errors. The three required matching conditions are satisfied. Delay cause remains unknown; do not call it a missed/failed slot. No cron changes; do not infer #614/#622 retroactively.
- #625 job `140867796762` completed success. Google News RSS: 100 items, Bing News RSS: 28 items; both query sets 6/6 successful; YouTube skipped; queryFailures empty. News status: fetched 100, uniqueIncoming 94, added 41, duplicateBeforeMerge 6. Run-log source rows carry Google 100 and Bing 28. Its generic `counts.discovered/accepted/duplicates` are 0 because `scripts/run-log.mjs` currently sources these generic fields from YouTube `collection-status.itemsFetched/itemsAdded/itemsDuplicate`; with YouTube disabled this does not represent overall news discoveries. Preserve this interpretation; do not misreport 0 as no news discovery. Potential metric-schema clarity improvement is documented, but no code/schema change is made in this checkpoint.
- #625 artifact: `github-pages` ID `15248916714`, 826059 bytes, SHA-256 digest `bcd9cc060c1e92cef53c06d470c4a85ba186094b8d9c9c2f12020784da704dd7`, not expired at inspection. Configure Pages, upload artifact, and Deploy to GitHub Pages steps succeeded. Direct public Pages URL fetch was attempted but not verifiable; do not claim public URL reachability. Android Chrome real-device QA remains unverified.
- New main data commit is `76cc186a50f2c40e7d7e85bc9fa949327145ee40` (`data: refresh archive discovery and improvement cycle`), based on #625's run. Full Git-blob audit of `data/discovery.json` blob `fd819a3d51565e38a8af84b7266f8ddae59f6d1a` (1,584,165 bytes; 1,001 records) and matching `data/quality-metrics.json` / `data/news-collection-status.json` confirms: 813 articles / 188 videos; explicit publisherArticleUrl 122; assigned thumbnails 366; missing thumbnails 635; missing with explicit publisher URL 31; verified Haewon articles 90; verified Haewon with provenance thumbnail 66; RSS image candidates 0; meta-only comparison 93; thumbnail review eligible 515 / reviewed 0 / precision null. Previous audit was 962 records, 774 articles, 188 videos, publisherArticleUrl 113, assigned 360, missing 602, verified Haewon 84, preview 62, review eligible 493 / reviewed 0. Current net archive growth is 39 records (article +39; video unchanged). The 273 shared legacy thumbnail assignments remain unchanged; automatic replacement/deletion remains false.
- Full retry calculation on all 1,001 discovery Git-blob records, applying `shouldRetryThumbnailFetch` policy to publisher-URL records with missing thumbnails at 2026-11-28T04:54:00Z, returns 0 eligible. Earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No blind retry. No demonstrated retry-eligible publisher-page extractor miss, so no extractor/code change.
- Query pack remains exploratory: `improvement-cycle.json` packIndex 1/6, 1,001 cumulative candidates, current run 100 fetched candidates, 20 preserved video records, reviewed relevance 0, precision null, automatic promotion false. `videos.json` remains 20; YouTube Atom/Data API disabled; never pass `YOUTUBE_API_KEY`. `collection-status.json` has no `networkRequests` field; do not infer zero network requests. Query-failure history retains only the real #617 HTTP 429; #625 queryFailures is empty.
- Preserve all existing constraints: no Google News wrapper decode/access bypass; no JYP/NMIXX Gallery or Notice collectors; SBSKPOP ZOOM ownership unverified; no broadcaster collector or broadcaster-official auto-classification; preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Workflow cron remains exactly `17 23 * * *` and `17 11 * * *`. The next 20:17 KST / `17 11 * * *` slot is still in the future at 13:54 KST; check actual Actions event and matching run-log after it occurs. Do not pre-classify it.
- This is a documentation-only checkpoint across all seven operating documents. No code, tests, cron, production data, or artifact changes are made in this PR. Merge only after PR CI Unit tests and Validate committed archive data both succeed and with explicit user approval. Report docs, code, tests, Production, data, artifact, Pages, and Android QA separately.


## 2026-11-28 14:01 KST — pre-slot live recheck

- Live GitHub ref check: `main` remains `76cc186a50f2c40e7d7e85bc9fa949327145ee40`; this is a fresh read, not an assumption from the previous checkpoint.
- Live Actions query `event=schedule&per_page=100`: `total_count=20`; newest scheduled run remains Production #625 / run `46108902884`, created and started at `2026-11-28T04:44:06Z`. No newer scheduled run is present in this response. The next target slot, `2026-11-28 20:17 KST` (`17 11 * * *`), is still in the future at this checkpoint; do not mark it missed or successful, and do not reuse #625 as its execution.
- #625 remains the distinct delayed 08:17 KST execution already documented. Do not infer anything retroactively about #614/#622. No cron edits.
- PR #93 remains Open / unmerged, based on current main, mergeable. CI #123 / run `46109922247` job `test-and-validate` succeeded; its actual steps `Unit tests` and `Validate committed archive data` both completed successfully. PR #92 remains Open / unmerged. No merge without explicit user approval.
- No new Production means no new discovery-data or retry-eligibility audit is claimed in this checkpoint. Keep the latest verified #625 data audit as historical baseline only. Do not repeat it as a new measurement. Android Chrome QA and direct public Pages URL reachability remain unverified.
- Existing restrictions remain unchanged: YouTube Atom/Data API inactive and no `YOUTUBE_API_KEY`; exploratory query pack 1/6, human-reviewed relevance 0, precision null, no automatic promotion; no inference of zero network requests from absent `networkRequests`; only actual #617 HTTP 429 in query-failure history; no Google News wrapper decoding/access bypass; no JYP/NMIXX Gallery/Notice collector; SBSKPOP ZOOM ownership unverified; no broadcaster collector or broadcaster-official auto-classification; preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Next action: after the 20:17 KST slot, re-read current time and query the complete Actions scheduled-run list. Accept a matching run only when Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 11 * * *` all match; then compare `created_at`, `run_started_at`, and run-log `startedAt`. Only after a verified new Production, fetch the full discovery Git blob and recalculate quality/retry metrics.


## 2026-11-28 15:24 KST — PR CI and pre-slot recheck

- Live main ref remains `76cc186a50f2c40e7d7e85bc9fa949327145ee40`. All seven operating documents were re-read at this exact main SHA before this checkpoint was appended.
- PR #93 latest HEAD `bc5bc999f8dcc028fc57f746c4759d59f5249cd3` remains Open / unmerged and mergeable. Its CI #127 / run `46110269531` completed successfully. Job `test-and-validate` succeeded; the actual `Unit tests` and `Validate committed archive data` steps both completed with success. This supersedes the earlier #123 result for this latest HEAD. PR #92 remains Open / unmerged; its base is still the older `c45b0f62889fb686dd36dceb3cfb67516cda8961`. No PR was merged.
- Current time at recheck: `2026-11-28 15:24 KST`. Complete Actions listing `event=schedule&per_page=100` reports `total_count=20`; newest is still Production #625 / run `46108902884`, event=schedule, created/run_started `2026-11-28T04:44:06Z`. The target `20:17 KST` slot with expression `17 11 * * *` is still in the future. No new Production is verified; do not claim the slot has run, failed, or been missed. #625 is not the 20:17 execution. Do not infer historical #614/#622 causes. No cron edits.
- Because no new Production exists, this checkpoint performs no new discovery blob, quality-metrics, or retry-eligibility audit. Keep the #625 audit only as the last verified historical baseline. No data/artifact/Pages/Android QA result is newly claimed. Public Pages reachability and Android Chrome real-device QA remain unverified.
- Keep all project constraints: YouTube Atom/Data API disabled, no `YOUTUBE_API_KEY`; query pack exploratory 1/6, human-reviewed relevance 0, precision null, no automatic strategy promotion; absent `networkRequests` is not zero requests; preserve only actual #617 HTTP 429 in query-failure history; no Google News wrapper decode/access bypass; no JYP/NMIXX Gallery/Notice collector; SBSKPOP ZOOM ownership unverified; no broadcaster collector or broadcaster-official automatic classification; preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Next action after 20:17 KST: re-query current time and all Actions scheduled runs. A run qualifies only if Actions `event=schedule`, persisted run-log `trigger=github_schedule`, and exact `scheduleExpression=17 11 * * *` all match; compare `created_at`, `run_started_at`, and run-log `startedAt`. Only then audit the complete discovery Git blob and retry eligibility. Keep run-log generic YouTube-derived counts separate from Google/Bing source rows and actual stored-record growth.

\n## 2026-11-28 15:46 KST — Next verification step\n- Wait until after 20:17 KST, then re-read current time and query Actions `event=schedule` across the full available list. Require the Actions event, run-log trigger `github_schedule`, exact expression `17 11 * * *`, and startedAt comparison before classifying a new run as the 20:17 slot.\n- Current main `76cc186a50f2c40e7d7e85bc9fa949327145ee40`; newest schedule is #625 and belongs to the 08:17 expression `17 23 * * *`. Do not confuse it with the next slot.\n- If no matching run appears, report only “not observed”; do not infer cause. If one is confirmed, then and only then perform fresh full discovery Git-blob audit, metrics and retry eligibility.\n- Keep PR #92/#93 unmerged without explicit approval; #93 CI #133 currently passes both required checks.\n

## 2026-11-28 16:17 KST — Pre-20:17 schedule checkpoint
- Live main rechecked: `76cc186a50f2c40e7d7e85bc9fa949327145ee40`; all seven operating docs were read from this main before this checkpoint update.
- Current local time: `2026-11-28T16:17:24+09:00`. The 20:17 KST slot (`17 11 * * *`) is still in the future; do not claim it ran or failed.
- Actions `event=schedule` full list: `total_count=20`. Newest #625 / run `46108902884`, completed success; Actions created_at/run_started_at `2026-11-28T04:44:06Z`. Its persisted run log blob `23a88daca6e1f0dbcfbc7e9c2a890607bdfc1f4b` confirms `trigger=github_schedule`, expression `17 23 * * *`, startedAt `04:44:11Z`, finishedAt `04:44:31.526Z`; this is the 08:17 KST slot, not the upcoming 20:17 slot. Google News 100 and Bing News 28 are source-row counts; YouTube is skipped. Generic counts are zero and must not be interpreted as zero news discovery.
- Workflow cron expressions remain `17 23 * * *` and `17 11 * * *`; no cron changes.
- PR #92 (head `77a22fd2be82665684be6d401e31c086b1d440e0`) and PR #93 remain open/unmerged. PR #93 prior HEAD `0e0191fe346769f668ad5ef822cb87c90cd69a5b`; CI #137 / run `46118211217` on that exact HEAD passed Unit tests and Validate committed archive data. This checkpoint update is documentation-only and requires a fresh CI run for its new HEAD. No merge without explicit user approval.
- No new Production after #625 was observed before the upcoming slot; no fresh discovery audit, new metrics, or retry eligibility calculation is claimed. Prior #625 data/artifact figures remain historical only. Pages direct URL and Android Chrome QA remain unverified.
- Preserve all existing source, YouTube, query, retry, thumbnail, and transactional-save restrictions. No code, data, workflow, or cron changes in this checkpoint.


## 2026-11-28 16:22 KST — Pre-20:17 schedule checkpoint
- Local time was rechecked as `2026-11-28T16:22:08+09:00`. Live GitHub `main` was re-fetched from the branch ref endpoint and remains `76cc186a50f2c40e7d7e85bc9fa949327145ee40`; this is the current baseline, not the PR branch head.
- Re-read all seven operating documents from `main` at this SHA before editing this checkpoint. The workflow still defines exactly `17 23 * * *` and `17 11 * * *`; no cron changes.
- The 20:17 KST / 11:17 UTC slot (`17 11 * * *`) is still in the future at 16:22 KST. Therefore this is a pre-slot checkpoint: do not query/interpret a future scheduled run, claim a new Production, or run a new discovery audit. After 20:17 KST, inspect the full `event=schedule` run list and require all three Production conditions: Actions `event=schedule`, persisted run-log `trigger=github_schedule`, exact `scheduleExpression=17 11 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. A missing listing must not be described as a failed/dropped run.
- PR #92 remains Open/unmerged, head `77a22fd2be82665684be6d401e31c086b1d440e0`; PR #93 remains Open/unmerged, head `bef65a0616d23a4a4d4eebe7f4f22b710bae2b06`. Do not merge without explicit user approval. PR #93 CI #138 / run `46120558353` is completed-success on that exact HEAD; job `test-and-validate` succeeded, including separate `Unit tests` and `Validate committed archive data` steps.
- No new Production is claimed in this pre-slot checkpoint. The previous #625 (run `46108902884`) is still the prior known baseline only; it records `17 23 * * *`, not the 20:17 slot. No new dataset metrics, artifact, retry eligibility or collection outcomes are asserted.
- Keep Google News and Bing News source-row counts separate from generic YouTube-derived run-log counters. Preserve all established restrictions: YouTube Atom/Data API disabled, never pass `YOUTUBE_API_KEY`, `videos.json` remains 20, query pack exploratory only, human-reviewed relevance 0 and precision null, no automatic promotion, do not infer zero requests without `networkRequests`, retain only actual #617 HTTP 429, no Google News wrapper decoding/access bypass, no JYP/NMIXX Gallery/Notice or broadcaster collectors, SBSKPOP ZOOM ownership unverified, no broadcaster-official auto-classification, preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- No code, workflow, cron, data, or artifact change is justified before the scheduled slot. Keep direct Pages URL access and Android Chrome real-device QA marked unverified. Report docs, code, tests, Production, data, artifact, Pages and Android QA separately.


## 2026-11-28 22:51 KST — Post-20:17 schedule verification
- Current local time was checked as `2026-11-28T22:51:47+09:00`. Live GitHub `main` ref was re-fetched and remains `76cc186a50f2c40e7d7e85bc9fa949327145ee40`. All seven operating documents were read from this exact main SHA before this post-slot verification.
- GitHub Actions API filtered to `event=schedule` returned `total_count=20` (first page contains all 20). Newest schedule run remains Production #625 / run `46108902884`, Actions `created_at=2026-11-28T04:44:06Z`, `run_started_at=2026-11-28T04:44:06Z`. Its persisted run log at `data/run-logs/46108902884.json` has blob `23a88daca6e1f0dbcfbc7e9c2a890607bdfc1f4b`, `trigger=github_schedule`, `scheduleExpression=17 23 * * *`, `startedAt=2026-11-28T04:44:11.000Z`, `finishedAt=2026-11-28T04:44:31.526Z`. This is the 08:17 KST expression, not the 20:17 KST expression.
- The 20:17 KST / 11:17 UTC scheduled slot with exact expression `17 11 * * *` has no matching Actions run in the observed `event=schedule` list as of 22:51:47 KST. Record only "matching run not observed". Do not infer failure, dropped event, scheduler incident, or cause. No cron changes. The latest schedule run #625 must not be relabeled as the 20:17 slot.
- No new qualifying Production was confirmed for the 20:17 slot. Therefore no fresh full discovery Git blob audit, quality metrics, dataset growth calculation, or retry eligibility recalculation was performed. Do not relabel historical #625 data as new results. Google/Bing source rows remain separate from generic YouTube-derived run-log counts.
- Production #625's job `140867796762` completed successfully; Test/collect/validate, Pages configuration, artifact upload, metadata wait and Pages deploy steps all completed successfully. The #625 log has Google News RSS 100 and Bing News RSS 28 items, YouTube skipped/0, generic counts all 0, queryFailures empty, validation passed. These are #625's historical run results, not results for the 20:17 slot.
- PR #92 remains Open/unmerged at head `77a22fd2be82665684be6d401e31c086b1d440e0`; PR #93 remains Open/unmerged at head `6730749f64fd0484b697446ead1dedbe15978e78`. PR #93 CI #139 / run `46120952756` completed success on that exact HEAD; job `test-and-validate`, `Unit tests`, and `Validate committed archive data` all succeeded. No merge without explicit user approval.
- This post-slot update is documentation-only. No code, workflow, cron, archive data, or artifact changes. Preserve all restrictions: YouTube Atom/Data API disabled, never pass `YOUTUBE_API_KEY`, `videos.json` remains 20, query pack exploratory only, human-reviewed relevance 0 and precision null, no automatic promotion, no zero-network inference without `networkRequests`, only actual #617 HTTP 429 in failure history, no Google News wrapper decoding/access bypass, no JYP/NMIXX Gallery/Notice or broadcaster collectors, SBSKPOP ZOOM ownership unverified, no broadcaster-official auto-classification, preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Direct public Pages URL access and Android Chrome real-device QA remain unverified. Report code, tests, Production, data, artifact, Pages, and Android QA separately. Next expected scheduled slot to verify is 08:17 KST on 2026-11-29 (`17 23 * * *`); re-check actual time and live Actions evidence before classifying it.
