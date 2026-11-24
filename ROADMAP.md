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
