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


## 2026-11-25 — Article-level review and legacy thumbnail evidence

- [x] Recheck latest main and Actions #581; confirm Pages deployment stages completed.
- [x] Verify the 701-record baseline: 49 explicit publisher HTTPS Haewon articles; 39 provenance-backed thumbnails.
- [x] Audit 273 repeated legacy assignments without deleting or relabeling them; establish zero overlap with verified Haewon articles and zero per-record alternative candidates/publisher URLs in stored data.
- [x] Add a dedicated four-dimension human review workflow (relevance, date, source, category) with browser persistence and JSON import/export (PR #13).
- [x] Add regression tests and a non-destructive legacy replacement-evidence metric.
- [ ] Run CI for PR #13; current workflow has no pull_request trigger and no local test run was possible.
- [ ] Inspect the 49 publisher pages and record human-reviewed article/date/source/category labels.
- [ ] Review 39 provenance-backed thumbnail images visually, one article at a time; review the 10 missing-image articles separately.
- [ ] Keep the 273 legacy assignments intact until each record has a verified alternative or a documented unresolved reason.
- [ ] Verify actual mobile browser layout, keyboard navigation, and review controls; until then status remains unverified.

- [x] Distinguish 148 legacy records with publisher source-site root hints from article-specific URLs (0); preserve these hints without treating them as replacements.

- [x] Add an explicit original publisher-page accessibility label; URL presence is not treated as proof of access.

- [x] Add a one-request direct publisher URL accessibility audit for the 49 verified Haewon articles; no retry, wrapper decoding, or access-control workaround.
- [ ] Review the audit's actual status results after PR validation and the next quality-data generation run.

- [x] Verify the new PR CI workflow itself: PR #15 Actions #1 passed 142/142 existing tests and archive-data validation.
- [ ] Re-run CI against PR #13's new article-review tests after the workflow is available on main.


## 2026-11-25 — Conversation handoff button
- [x] Restore exact follow-up button contract in BUTTONS_AND_ACTIONS.md and CHATGPT_OPERATING_RULES.md.
- [x] Record that documentation-only is insufficient; final response must render an actual clickable control.
- [ ] Verify the button is present at the end of every future Haewon Archive session.


## 2026-11-25 — PR review correction and image suitability

- [x] Recheck main, PRs, Actions and Pages deployment job.
- [x] Inspect PR #13 failure logs; identify duplicate exported function as the cause (113/116 tests passed; three test files failed to load).
- [x] Remove duplicate export and add explicit per-article thumbnail suitability labels.
- [x] Ensure HTTP HEAD success is recorded as http-responded, not a false claim of article readability.
- [x] Stop GET retries after 403; retain only 405 method-not-allowed fallback.
- [x] Add tests for thumbnail suitability scoring and forbidden-response non-retry.
- [ ] Obtain a fresh CI run for the latest PR #13 head after PR #15 workflow is merged to main.
- [ ] Manually verify original-page accessibility, date, source, category and relevance for all 49 records.
- [ ] Label the 39 article thumbnails individually and distinguish the 10 missing-image cases.
- [ ] Generate and compare fresh quality metrics; do not claim improvement until verified counts rise.
- [ ] Perform actual mobile browser inspection; until then mark UI as unverified.

- [x] Validate corrected PR #13 code with a temporary read-only CI run: 150/150 tests and archive validation passed; remove temporary workflow from code PR afterward.
- [ ] Investigate PR #13 mergeability state before merge; keep the CI workflow itself isolated in PR #15.


## 2026-11-25 — Second cycle follow-up

- [x] Recheck main, open PRs, latest production Actions and Pages deployment.
- [x] Audit all 49 explicit Haewon HTTPS source URLs for field presence, URL type, thumbnail presence and stored metadata status.
- [x] Separate 47 article pages from one X profile and one X post in the review taxonomy.
- [x] Identify that all 39 existing article thumbnails match persisted metadata candidate URLs (provenance match, not visual suitability).
- [x] Diagnose 10 missing thumbnails: 4 HTTP 403 failures and 6 missing outcomes; no alternative candidates stored.
- [x] Audit 273 repeated legacy records: 148 root-domain clues, 125 without sourceUrl, zero article-specific publisher URLs, zero candidate images, zero metadata fetch results; preserve all records.
- [x] Add seventh content-type review dimension, seven-field progress and corrected-category capture in PR #13.
- [x] Correct persisted-thumbnail vs latest-run assignment metric semantics in PR #16.
- [x] Verify PR #13: 152/152 tests + archive validation; remove temporary workflow afterward.
- [x] Verify PR #16: 143/143 tests + archive validation; remove temporary workflow afterward.
- [ ] Merge PR #15 read-only CI after review; then obtain native PR checks for code PRs.
- [ ] Merge PR #13 and #16 only after final diff review; then deploy and verify Pages.
- [ ] Manually review original-page accessibility, relevance, date, source, content type and category for all 49 URLs.
- [ ] Manually inspect all 39 image previews; do not count provenance as visual suitability.
- [ ] Investigate the 10 missing image cases only through permitted public metadata; stop at 403.
- [ ] Continue per-record legacy review only where a genuine direct publisher URL is available; preserve all opaque wrappers.
- [ ] Perform Playwright responsive emulation and separate real Android browser visual QA; mark each distinctly.


### Direct-page and thumbnail verification additions
- [x] Attempt standard public-page opens for all 49 explicit source URLs; preserve failed/403/timeout outcomes as unverified rather than bypassing them.
- [x] Visually spot-check 7 exact assigned thumbnail URLs against their article contexts.
- [x] Identify the Wikitree lookalike/cover article as indirect relevance; add a separate indirect label instead of forcing it into direct relevance.
- [ ] Inspect the remaining 32 exact assigned thumbnail URLs and persist one of suitable / unsuitable / uncertain per article.
- [ ] Complete human date/source/category/accessibility labels for all 49 source URLs.

- [ ] Independently open the deployed Pages URL in a real browser and verify the current release; Actions deployment success alone is not visual confirmation.


## 2026-11-25 — Fresh recursive verification (main 32832e57)

- Fresh GitHub state: main `32832e57e9e1023c62eefa4a1e8b4a76550e451b`. PR #13/#14/#15/#16 are all open and unmerged. No PR merge was performed. PR #13 review UI and PR #16 metric correction are not on main.
- Production Actions #581 (run 45508856109) completed successfully. Its job steps include both validation passes, operational log generation, Pages configuration, artifact upload and deployment. Run log records YouTube 15, Google News RSS 74, Bing News RSS 33; accepted new records 0, duplicates 15, validation passed. Deployment success is not independent browser or mobile visual verification.
- Current main discovery data: 701 total candidates, 515 articles and 186 video candidates. The verified Haewon HTTPS publisher scope remains 49 records; 47 URL shapes are publisher article pages, one X profile and one X post. All 49 have publishedAt/sourceName fields; none stores an explicit categories array. Field presence does not establish date/source accuracy; category is rule-inferred. Human metadata labels remain zero.
- 39/49 have HTTPS thumbnails with provenance, and the 39/39 exact thumbnail URLs match a persisted metadata candidate. This is provenance linkage, not visual suitability. Main `thumbnailCandidateComparison` still reports 44 metadata-found records, 0 latest-run assignments and 0% assignment because it lacks the PR #16 persisted-vs-current-run split. The latest collection attempted 0 enrichment URLs, so 0 latest-run assignments is not evidence of missing persisted assignments.
- Additional exact-thumbnail check: attempted all 32 previously unchecked URLs. Eight exact URLs rendered as images in the inspection tool; 24 returned inaccessible/internal errors. This does not complete 32/32 visual checks, and no new formal suitability labels were persisted. Previous 7 exact-URL spot checks remain context-consistent. Total 15 exact URLs have rendered in visual checks across the prior and current checks; do not claim the other 24 are visually reviewed.
- The Wikitree record `66c296a7f618669fd99b` remains indirect relevance: the story centers on another person described as a Haewon lookalike doing a cover. Do not count as direct Haewon coverage.
- The 10 missing-thumbnail cases were re-read from main data: 4 explicit 403 failures (FAM Times, BNT, X profile, allkpop) and 6 missing outcomes (one Khan/MSN syndication case, three MSN items, TVDaily, OSEN). All have zero alternative metadata candidates. No retry, access-control bypass, or inferred replacement.
- The 273 shared legacy-image records remain unchanged: 270 distinct titles, 148 with a sourceUrl clue, 125 without; 0 publisherArticleUrl, 0 discoveryUrl, 0 metadata candidates, 0 metadata-fetch records. Root-domain clues do not identify article URLs. No wrapper decoding, deletion or replacement.
- PR #13 latest review code remains unmerged; recorded Actions #8 passed 153/153 tests and archive validation. PR #16 latest metric code remains unmerged; recorded Actions #6 passed 143/143 tests and archive validation. PR #15 permanent read-only CI remains unmerged; its own Actions #1 passed 142/142 tests. These are branch-specific results, not main deployment.
- PR #14 is the documentation-only branch and has been updated with this verification. PR separation remains: #13 review UI/tests, #16 metric code/tests, #15 read-only CI, #14 docs. No merge was authorized or attempted.
- Live Pages page render and actual Android/mobile browser QA remain unverified. Actions deploy success and image URL fetch attempts are not substitutes for a real browser session.


## 2026-11-25 — Third recursive cycle: source-host provenance and public image metadata review

- Main remains `32832e57e9e1023c62eefa4a1e8b4a76550e451b`; PR #13/#14/#15/#16 remain open and unmerged. Production Actions #581 is still the latest main run observed; all 19 job steps succeeded through Pages deploy. Run log counts: YouTube 15, Google News RSS 74, Bing News RSS 33; 15 discoveries, 0 accepted, 15 duplicates; archive validation passed. Public Pages URL remains inaccessible to the inspection browser; no live render or Android QA claim.
- PR #13 branch follow-up: the review UI now exposes three distinct host fields: explicit publisherArticleUrl host, discovery URL host, and recorded publisherHost. This addresses syndication patterns and avoids collapsing platform attribution into final URL host. Added regression tests for OSEN/Chosun and MSN/Sports Kyunghyang examples plus malformed/non-HTTPS URLs. Latest head `b926e8fab1d9338bf08d7c2568f49b40f99a1767`; prior run #8 (153/153) predates this follow-up, so latest code is not CI-verified yet.
- Source audit examples:
  - OSEN record `de974fb311b152bc6141`: discovery URL host is OSEN, publisherArticleUrl host is biz.chosun.com, and the opened Chosun syndicated page carries an OSEN byline. The OSEN direct page independently shows the same headline/byline. This is a syndication/source-host distinction, not a proven wrong sourceName. Stored `publishedAt=2025-06-09T14:20Z` converts to June 9 23:20 KST, while the OSEN page states June 10 06:20 KST; date accuracy is a review candidate (local calendar day differs).
  - Record `8483bee976c1fb0427a8`: discovery URL host/source label is MSN, but publisherArticleUrl points to Sports Kyunghyang. The Sports Kyunghyang page states 2026-09-20 13:57 KST. Stored timestamp converts to 2026-09-20 07:06 KST: local calendar date matches, time differs. Treat MSN as discovery/syndication platform and Sports Kyunghyang as the explicit publisher URL; do not infer the MSN label is the original publisher.
  - Record `a49267aceb6585e0f222`: Sports Kyunghyang page states 2026-10-24 01:13 KST; stored timestamp converts to 2026-10-24 03:12 KST. Calendar date matches, exact time differs.
  - Wikitree `66c296a7f618669fd99b`: article states 2023-03-23 11:37 KST; stored timestamp converts to 13:37 KST on the same date. Its subject is another person doing a Haewon-lookalike cover, so relevance is indirect.
  - OSEN record `1410c1c68a3a1cfaa0f2`: OSEN page shows 2026-11-09 20:28 KST; stored timestamp converts to 12:28 KST on the same local date. Page image links are visible but not recorded as metadata candidates.
  - TVDaily record `f60f0f16157da91b9bf1`: page states 2026-11-18 13:36 KST; stored timestamp converts to 14:36 KST on the same local date. A page image link is visible, but it is not a persisted OG/JSON-LD candidate and was not assigned.
- Human review labels are still not persisted. Two clear indirect-relevance examples are the Wikitree lookalike-cover story and the OSEN/Chosun story centered on another person described as resembling Haewon. The X profile and X post must be contentType profile/social-post, not article pages.
- Current inferred category distribution for the 49-record scope (rule output only): news 24, interview 13, official 5, performance 5, event 2. No stored explicit category fields and no human category labels exist. Rule risk: interview currently matches generic terms such as 방송/예능/출연, and official matches broad 소식; do not treat these counts as accuracy. Manual review/corrected-category labels remain necessary.
- Rechecked the 32 previously unreviewed exact thumbnail URLs: 8 rendered as image payloads; 24 remained inaccessible to the inspection tool. The 8 visible URLs were not all compared against the exact publisher article context, so no new suitability labels were stored. Combined with the previous 7 context-checked URLs, 15/39 have rendered at least once; only the prior 7 had a documented article-context spot check.
- Six missing-thumbnail cases were reviewed within public page access only: TVDaily and OSEN pages opened and exposed image links in article content; these are not confirmed OG/JSON-LD metadata and were not added as thumbnail candidates or assigned. The other four missing-outcome pages (Sports Kyunghyang and three MSN URLs) were inaccessible to this inspection tool. Four existing 403 outcomes remain untouched; no retry, bypass, or fallback.
- PR #15 security hardening: pinned checkout v4.2.2 and setup-node v4.4.0 to verified upstream full commit SHAs; added `persist-credentials: false`. Latest head `e6573a8017f5aae0b71ad15d5b3d3a8e629e03b8`. Earlier Actions #1 (142/142) predates these edits; latest workflow commit needs a fresh run.
- PR #16 metric revalidation against actual main data: 44/44 records with persisted metadata candidates also have an HTTPS persisted thumbnail matching a candidate (0 mismatches). Latest enrichment attempted 0 URLs, found 0, assigned 0; correct latest-run assignment rate is null, not 0%. Main's current old metric still reports 44 metadata found, 0 assigned, 0%, which conflates persisted data and latest run. On the 49 Haewon subset, 39/39 existing thumbnails match persisted candidates.
- Legacy cluster unchanged: 273 repeated image assignments, 270 unique titles, 148 sourceUrl hints, 125 without sourceUrl, zero article-specific publisher URLs, zero discovery URLs, zero image candidates, zero metadata fetches. No wrapper decoding, deletion or replacement.
- Main data remains 701 candidates, 515 articles and 186 video candidates. No new accepted discovery in Actions #581.
- Next: obtain fresh CI for latest PR #13 and #15 heads after safe workflow availability; consider narrowing the category rules only after a labeled sample exists; manually complete 49 source/date/category/relevance labels; preserve unverified thumbnail and legacy states; verify Pages in a real browser and Android device.


## 2026-11-25 — PR #15 Node 24 CI hardening verification

- PR #15 latest head: `d095da244c97fcbea4e38eca624fae6112088c56`; still open and unmerged.
- Updated the read-only workflow to verified upstream immutable action commits: checkout v7.0.1 `3d3c42e5aac5ba805825da76410c181273ba90b1`, setup-node v7.1.0 `949feb2413d6458794dcd2491c4babbbce0c15c1`. Both use Node 24 action runtimes. `persist-credentials: false` remains; `package-manager-cache: false` avoids unused automatic caching. Workflow retains `contents: read`, Node 22 project runtime, `npm test`, and `npm run validate` only.
- Fresh Actions #10 / run `45541326160` on exact head `d095da244c97fcbea4e38eca624fae6112088c56`: success; 142/142 tests passed, 0 failed; archive validation passed (19 videos, 701 discovery candidates, 154 run logs, 37 source summaries, 41 links checked). No Node 20 deprecation warning in this run's log.
- This is PR #15 branch validation only; PR #15 is still not merged and does not yet provide main-wide automatic CI.
- PR #13 latest code branch `b926e8fab1d9338bf08d7c2568f49b40f99a1767` still has no fresh Actions run after its URL-host-context helper/test addition. PR #16 latest branch `fbac15bcd4142ce943cc23df236176a4a1ba4725` retains prior Actions #6 (143/143) and has no newer run.


## Article quality and thumbnail verification (2026-11-25)
- [x] Separate publisher URL host, discovery URL host and recorded publisher host in PR #13; add OSEN/ChosunBiz and MSN/Sports Kyunghyang regression fixtures.
- [x] Verify PR #13 HEAD through a temporary read-only CI harness (PR #17, Actions #11: 154/154 tests, validation passed); close temporary PR without merging.
- [x] Recheck persisted thumbnail candidates separately from latest-run enrichment: 44/44 persisted URL matches; latest run 0/0/0 and rate null.
- [x] Confirm OSEN 2025-06-10 source-page date versus stored 2025-06-09 KST date; leave source data unchanged pending human review.
- [ ] Complete human review of 49 article/source/date/category/relevance records; do not infer accuracy from keyword rules.
- [ ] Review article context for the 8 rendered thumbnails; retain 24 unavailable inspection outcomes as unknown, not unsuitable.
- [ ] Resolve missing-image candidates only from explicit public metadata; no 403 retry, access-control bypass or automatic assignment.
- [ ] Obtain fresh CI on PR #16 exact HEAD.
- [ ] Confirm live Pages rendering and Android browser behavior independently of Actions deployment status.
- [ ] Keep 273 legacy shared-thumbnail assignments unchanged until record-level evidence and human review support any migration.
