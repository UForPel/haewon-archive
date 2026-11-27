# Haewon Archive — Persistent Project Memory

Last updated: 2026-11-24

## Current status — RSS image provenance and human review (2026-11-24)
- Verified full run #521: unit tests, collection, metrics, data validation, operational log, data commit and GitHub Pages deployment all succeeded. https://github.com/UForPel/haewon-archive/actions/runs/45327828183
- Latest live RSS sample: 227 items across four queries; 0 media:thumbnail, 0 media:content, 0 image enclosure, 0 content:encoded items, 0 description img/source tags, and 0 RSS image candidates. Raw RSS bodies are not stored.
- Article metadata fetch sample: 12 attempts, 0 publisher-page metadata candidates, 0 assignments, 12 wrapper-only results. All 12 resolved response hosts were news.google.com; all carried the same Google-hosted OG image. They are now stored as google-news-wrapper:og:image and excluded from publisher candidate comparison/automatic assignment.
- Latest historical dataset: 620 articles, 273 thumbnails, 347 missing; one URL is shared by 273 records. The 273-record legacy group remains unchanged.
- Collector supports RSS Media RSS / image Enclosure / description HTML / content:encoded and article-page OG/Twitter, secure_url, image_src, itemprop and JSON-LD. Candidate source/priority and per-article fetch provenance are retained.
- Article-level candidate review UI is implemented. Labels are browser-local and can be exported/imported as JSON. Candidate suitability precision and selected-thumbnail precision are available but remain unmeasured until labels are entered; these are not classifier accuracy.
- No Google News opaque redirect decoding or access-control bypass is used. The collector does not treat Google News wrapper metadata as a publisher article image.
- Latest verified run #525 passed unit tests, collection, validation, data commit and Pages deployment after the resolved-host provenance change. Run #529 completed successfully, including Pages deployment. The later consolidated documentation commit is being verified by #530; its deployment is still in progress at this checkpoint. Live visual/mobile inspection remains unconfirmed.

## Purpose
First-read handoff document for every new ChatGPT conversation about this repository. Read it before proposing or changing project work, then follow links to detailed documents.

## Project identity
- Repository: https://github.com/UForPel/haewon-archive
- Owner: UForPel
- Visibility: Public (user decision)
- GitHub Pages: https://uforpel.github.io/haewon-archive/
- Main branch: main
- Product: free/near-free, mobile-first Haewon (NMIXX) archive.

## User's intended product
Build a useful in-site archive for Haewon-related public content:
- Official and fan videos, including fancams and edits.
- Official photos and appropriately attributed fan-photo source links.
- Internal search, filters, source/type/date browsing, metadata and source links.
- Automatically accumulate records in GitHub JSON and deploy the static site.
- Do not mirror copyrighted image/video binaries without permission.

## Current verified baseline
- Static archive UI, official NMIXX YouTube Atom-feed collector, JSON data, manual photo-link workflow, tests and GitHub Actions workflow exist.
- The official feed currently yields up to 15 newest entries per fetch; records already seen are accumulated.
- Current data inspected on 2026-11-19: 17 video records; `data/photos.json` is empty.
- Automated fan-video discovery and automated photo crawling are not implemented.
- The existing workflow schedule remains twice daily at UTC 23:17 and 11:17 (Korea 08:17 and 20:17).
- The workflow runs tests, collects the official feed, validates data (including archive-record JSON Schema checks), commits changed data and deploys Pages when configured.
- Latest Actions state must be checked before claiming current workflow health. A five-minute scheduler/Gemini run does not exist.

## Automation direction — agreed, NOT implemented
1. Prefer an external scheduler because the user experienced GitHub Actions scheduled-run delays.
2. Target trigger cadence: every five minutes, but this does not guarantee completion every five minutes.
3. Gemini API is the selected AI tool. The user will add the API key directly to GitHub Actions Secrets; never ask for it in chat.
4. Gemini reads GitHub-hosted behavior and collection guidance for each run.
5. Gemini is intended to assist permitted public discovery, metadata extraction, classification, deduplication and evidence-based analysis.
6. Gemini may propose improvements to search vocabulary/priority and non-security classification heuristics.
7. Gemini must not modify app code, workflows, tests, schemas, validators, deployment settings, secrets or protected policy.
8. A trusted workflow—not Gemini directly—must validate and apply allowed data/policy changes.
9. Security, privacy, credentials, legal/source-access rules and schemas are protected and require human approval.
10. ChatGPT acts as architect, prompt/rule author, reviewer and continuity manager. GitHub is canonical project memory.

## Governance documents
- [CHATGPT_OPERATING_RULES.md](CHATGPT_OPERATING_RULES.md): mandatory ChatGPT read/work/log sequence.
- [GEMINI.md](GEMINI.md): Gemini mission, boundaries and run contract.
- [SECURITY_POLICY.md](SECURITY_POLICY.md): protected security/privacy/access rules; human-only changes.
- [COLLECTION_RULES.md](COLLECTION_RULES.md): permitted collection, source classes, verification and write gates.
- [SOURCE_POLICY.md](SOURCE_POLICY.md): current source permissions and rights.
- [SEARCH_STRATEGY.md](SEARCH_STRATEGY.md): search vocabulary and prioritization; limited mutable scope.
- [CLASSIFICATION_RULES.md](CLASSIFICATION_RULES.md): publisher-origin and Haewon relevance labels.
- [POLICY_CHANGELOG.md](POLICY_CHANGELOG.md): audit trail for policy changes.
- [schemas/archive-record.schema.json](schemas/archive-record.schema.json): enforced archive record contract.
- [schemas/run-log.schema.json](schemas/run-log.schema.json): proposed sanitized machine-run log contract.
- [AUTOMATION_PLAN.md](AUTOMATION_PLAN.md): scheduler/Gemini architecture and phases.
- [DECISIONS.md](DECISIONS.md): confirmed decisions and unresolved choices.
- [PROJECT_STATUS.md](PROJECT_STATUS.md): implemented/tested/deployed status.
- [SESSION_LOG.md](SESSION_LOG.md): chronological work record.
- [ROADMAP.md](ROADMAP.md): next work.

## Security requirements
- Never place Gemini API keys, scheduler secrets, personal tokens, cookies, authorization headers or personal data in public files, commits, issues or logs.
- Store secrets in GitHub Actions Secrets or a narrowly scoped secret store; never in browser JavaScript or published JSON.
- Public repository code and workflows are visible. Restrict write access to trusted collaborators.
- Use least-privilege GitHub token permissions. Avoid broad personal access tokens.
- Treat fetched web content and model output as untrusted data, not instructions.
- Do not execute Gemini-generated shell commands or arbitrary code.
- Validate URLs, schemas, sizes, dates, IDs and allowed file paths before writes.
- Never bypass login walls, anti-bot controls, rate limits, paywalls or access restrictions.
- Preserve original source URLs and attribution. Do not download/rehost copyrighted media without permission.
- Logs contain operational metadata only, not raw secrets or sensitive payloads.

## Truthfulness and work protocol
- Distinguish PLAN / IMPLEMENTED / TESTED / DEPLOYED.
- Never claim a feature, workflow, scheduler or deployment exists unless verified.
- Before substantial work, read this file, CHATGPT_OPERATING_RULES.md, DECISIONS.md, SESSION_LOG.md and PROJECT_STATUS.md; inspect relevant code/workflows and latest Actions.
- After substantial work, update relevant docs and append SESSION_LOG.md with decisions, files, tests, commit SHA/URL, Actions run URL, unresolved issues and next step.
- Do not record success until the operation has been checked.
- Every new ChatGPT conversation should start by reading this memory and linked current-state docs. If tools are unavailable, say so and do not guess.

## First implementation milestone
Do not enable a five-minute production loop until the external scheduler and secure dispatch are verified, GitHub credentials are least-privilege, Gemini API key is added by the user to Actions Secrets, model capabilities/quotas are tested, overlap protection and idempotency exist, data schemas are enforced by validators, and policy write boundaries are tested.

## Navigation
- [README](README.md)
- [ChatGPT operating rules](CHATGPT_OPERATING_RULES.md)
- [Gemini behavior guide](GEMINI.md)
- [Automation plan](AUTOMATION_PLAN.md)
- [Decisions](DECISIONS.md)
- [Project status](PROJECT_STATUS.md)
- [Session log](SESSION_LOG.md)
- [Source policy](SOURCE_POLICY.md)

\n## Thumbnail comparison implementation (2026-11-24)\n- `js/thumbnail-comparison.mjs` compares per-article RSS candidates against stored OG/Twitter enrichment results and emits source/host counts, URL overlap, RSS-only/meta-only/both, and found/assigned rate.\n- `scripts/quality-metrics.mjs` now includes `thumbnailCandidateComparison` and a non-destructive `thumbnailReview` evidence list. Dashboard renders both. No auto deletion/replacement.\n- Added 3 isolated tests (passed locally); full suite/CI/Pages not verified yet. Legacy records have no RSS candidate history; new runs are needed for valid comparative coverage.\n
\n## Article-level thumbnail candidate comparison (2026-11-24)\n- Per-article RSS vs OG/Twitter comparison and source/host/URL overlap metrics are implemented in `js/thumbnail-comparison.mjs`; quality metrics and dashboard wired. Repeated URL review is expandable, preserving image URL and article links; no automatic replacement/deletion.\n- Verified metrics after run: 12 meta-only articles, 0 RSS candidates, 0 both-source overlap, 12 metadata found, 0 assigned (0%). Legacy RSS candidates absent, so comparison is not yet representative. One repeated URL group: 273 article evidence rows.\n- #467 initially failed on import typo; corrected. #469 passed full unit tests, collection, metrics, validation and Pages deploy. Live mobile visual check pending.\n

## Candidate persistence cycle — 2026-11-24
- Collector now persists bounded article-level `thumbnailMetaCandidates` for selected metadata-enrichment results even when a candidate is rejected as a duplicate; RSS `thumbnailCandidates` remains separate.
- Comparison now reads stored article metadata candidates before falling back to transient run status, making comparison evidence survive status-file replacement for enriched articles.
- Dashboard adds unique-thumbnail assignment rate (unique URL count / thumbnail-bearing items) and unique-image coverage (unique URL count / all candidates). These are URL uniqueness proxies, not visual correctness or publisher trust.
- Redirect policy: only ordinary public HTTP GET with normal redirect following to the accessible publisher page; no decoding opaque Google redirect tokens, bypassing anti-bot/login/rate restrictions, or crawling beyond the article response. The current collector still stores Google News links as primary URLs; resolved publisher URLs are not yet persisted.
- Research: Google News RSS endpoint is not documented as a stable public API in third-party testing; redirects can vary. Google publisher guidance recommends relevant images and OG/structured image metadata but cannot guarantee selection. No trust score is claimed without reviewed publisher labels.
- Added `tests/thumbnail-persistence.test.mjs` for candidate persistence and comparison after duplicate rejection. Local execution not available; CI must verify.

## Recursive improvement cycle — 2026-11-24 (continuation)
- Re-read current main project docs and thumbnail implementation/data. Candidate persistence and unique-image metrics/dashboard were committed in the prior cycle.
- Code review found literal escaped newline sequences in the comparison and metrics source files, which would break JavaScript parsing. Corrected them to real line breaks in commits 843a490 and b24bd71; fetched both files afterward and confirmed zero literal escaped-newline sequences remain.
- Repository-wide tests and Actions/Pages status are not verified. GitHub Actions history and Pages inspection are unavailable in this session; local clone failed due DNS resolution.
- Historical RSS candidates remain unavailable; trust/visual relevance scores not added because they need review labels. Redirect requests are ordinary public requests only; no token decoding or access bypass.
## Recursive improvement cycle — 2026-11-24 (CI repair and data check)
- Verified latest main before repair at `5e4c632`; Actions run #487 failed at unit tests. Job log pinpointed a JavaScript syntax error in `scripts/quality-metrics.mjs` line 83: a literal newline had split the `writeFile` string. Fixed it in commit `91d48b9bcec6330095decd097eae34e053eef70e`.
- The next CI run #488 exposed two pre-existing contract regressions: `summarizeThumbnailUrls` omitted `repeatedUrlGroups` and `repeatedItems`, while tests still expected them. Restored both fields in commit `0fded07f7dbac86b6c853936ba4346abb4630b9a`.
- CI run #489 passed all 86 tests, collection, quality metrics, validation, run-log validation, data commit, Pages artifact upload and GitHub Pages deployment. Run: https://github.com/UForPel/haewon-archive/actions/runs/45319384393.
- Data after the run: 620 discovery articles, 273 thumbnails, 347 missing; one URL repeated 273 times. 12 article metadata candidate sets were persisted; all 12 are `metaOnly`, zero RSS candidates, zero unique assignments, all duplicate-rejected because the same Google-hosted image URL was returned. The new unique coverage percentages round to 0% at this dataset size; raw counts are retained.
- This confirms persistence is now working for the 12 sampled records, but candidate diversity has not improved. Historical RSS candidates remain absent. No visual relevance labels exist; do not claim article-image suitability is measured until a human review queue and labeled outcomes are implemented.

## Explicit publisher URL gating and article review metrics — 2026-11-24
- Actions #531, #534, #535, #536 and #537 completed successfully. #537 includes 112/112 unit tests, collection, validation, data commit and GitHub Pages deployment. https://github.com/UForPel/haewon-archive/actions/runs/45329820257
- Intermediate failures #532 and #533 were diagnosed and repaired: old tests still expected Google News wrapper fetches; enrichment tests now use explicit publisherArticleUrl, and response.url fallback uses the publisher article URL rather than the Google wrapper URL.
- RSS #537 sample: 173 items, source URL attribute on 173, explicitly identified publisher article URLs 0. Media RSS thumbnail/content, image enclosure, content:encoded image, description image and all RSS image-bearing item counts remain 0.
- RSS source URL values identify the publisher/source site, not the specific article page. They are preserved as sourceUrl, but never fetched as if they were article URLs. Direct publisherArticleUrl is only populated from an explicit HTTPS article link or GUID outside Google wrapper domains.
- Enrichment now fetches only missing thumbnails with explicit HTTPS publisherArticleUrl. Latest attempt count is 0 because the feed contains no explicit article URLs; no wrapper redirect is requested, decoded, or bypassed.
- Merge logic retains sourceUrl, publisherArticleUrl, and prior metadata fetch provenance across refreshes. Article cards show source-site link, whether the actual article URL was explicitly identified, and resolved metadata response host when available.
- Browser review UI stores article+image labels in localStorage and validates JSON import/export. data/thumbnail-reviews.json is the importable repository artifact consumed by quality metrics. The metric key is thumbnailReviewMetrics, kept separate from the existing repeated-image review-group report.
- Latest quality data: 285 unique article/image candidates eligible, 0 reviewed, 0% review coverage; candidate and selected-thumbnail precision remain unmeasured (null). No labels were fabricated.
- Historical image state remains 620 articles, 273 thumbnails, 347 missing, one URL used by 273 records. No automatic deletion or replacement.
- GitHub Actions deploy succeeded, but direct live browser visual/mobile inspection could not be confirmed in this environment. JSON round-trip and label precision calculations are covered by tests.

 
## 2026-11-27 19:08 KST — Current verification checkpoint
- Latest main: 63f3c9c2daf0732252ac2c1e330cedaead0daeb5 (PR #76 docs commit).
- PR #75 merged schedule-expression telemetry. Production #623 (45949528329) is a successful PUSH run, not a scheduled run; data commit c5382d9816e114c565357f0f22eb47e1b7771b0b.
- #623: 226/226 tests, archive validation passed, Google News/Bing News succeeded (99/31 items seen), queryFailures empty; YouTube Atom skipped, networkRequests 0, videos.json remains 20; Data API disabled.
- Pages artifact 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7; deploy-pages step succeeded. Independent public URL opening failed in verifier; live UI remains unverified.
- query-failure-history.json still contains exactly the real #617 Google News HTTP 429 event, retryAttempted=false, no Retry-After. No second real failure occurred; do not synthesize one.
- 20:17 KST (11:17 UTC) schedule slot is still future at this checkpoint (19:08 KST). Do not label #623 as the slot. Next schedule run must log scheduleExpression='17 11 * * *'; compare run-log startedAt with Actions created_at/run_started_at.
- Android Chrome real-device QA remains unverified. Keep all source-policy restrictions unchanged.

 
## 2026-11-27 21:22 KST — Post-20:17 schedule verification
- Live GitHub main at checkpoint: `ceed2b68e7f3e76a70b1e1740fafa0e41e677230`; open PR search returned none before this documentation update. PR #77 is merged; CI run #107 (`45980001843`) passed 226/226 with committed archive validation.
- The configured 2026-11-27 20:17 KST / 11:17 UTC schedule slot has passed. The live Actions run list (latest page, 40 recent entries) contains no Production #624 or later Production run; Production #623 (`45949528329`) remains the newest Production. Do not call this a successful scheduled run. No run-log with `trigger=github_schedule` and `scheduleExpression=17 11 * * *` exists for this slot in the inspected current data.
- Production #623 is `event=push`, Actions `created_at/run_started_at=2026-11-27T06:04:22Z`, run-log `startedAt=2026-11-27T06:04:29.000Z`, `finishedAt=06:04:49.518Z`. It is unrelated to the 20:17 slot.
- #623 job run `140341900635` succeeded: tests 226/226, archive validation passed, collection and Pages deployment steps succeeded. Google News 99 items; Bing News 31 items; no queryFailures. Data commit: `c5382d9816e114c565357f0f22eb47e1b7771b0b`.
- Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`; Pages deploy action reported success. Direct open of `https://uforpel.github.io/haewon-archive/` was inaccessible to the verifier, so public URL/live UI remains unverified.
- Current data metrics generated at 2026-11-27T06:04:43Z: 936 candidates (749 articles, 187 videos); 111 explicit publisherArticleUrl records; 84 verified Haewon articles; 62 verified Haewon articles with provenance thumbnails; 359 assigned thumbnails; 577 missing; 273 dominant legacy shared assignments (one repeated URL group). Independent photo records remain 0. Keep article-image and independent-photo metrics separate.
- Thumbnail review: 493 eligible, 0 reviewed, 0% coverage; precision and selected precision remain null. Article RSS/meta comparison: 86 compared, 0 RSS candidates, 86 meta-only, 0 both; 86 persisted metadata candidate records. Do not describe this as measured visual relevance.
- `data/query-failure-history.json` still contains exactly one real event from #617: Google News query `오해원 근황`, HTTP 429, `retryAttempted=false`, no Retry-After. Later successful #620/#622/#623 runs did not erase it. No second distinct real failure occurred; do not synthesize one. Unit tests cover multi-event append/dedup behavior, but live second-failure behavior remains unobserved.
- YouTube Atom collector remains disabled; `data/videos.json` contains 20 records; source registry marks the Atom source disabled. Production workflow has no `YOUTUBE_API_KEY` injection. Preserve all source-policy prohibitions, the 273 legacy thumbnail group, and PR #54/#56 transactional review save/move/restore behavior.
- Cron remains `17 11 * * *` and `17 23 * * *` UTC. #614/#622 schedule timing anomalies remain unresolved because their logs lack `scheduleExpression`; do not infer their originating cron or change schedule based on speculation. GitHub high-load delay/drop guidance is a possible operational caveat, not a proven explanation for earlier starts or the absent 20:17 run.
- Android Chrome real-device QA remains unverified pending the user's direct check. No code, source policy, collector, or workflow schedule changed in this checkpoint; this is a documentation/evidence update only.

 
## 2026-11-27 22:03 KST — Late check of 20:17 schedule and thumbnail evidence
- Live main rechecked: `933118349f54a07c2bab9a50b6bd6d1ec9794611`; no open PRs before this documentation cycle. All seven canonical continuity documents were re-read.
- Actions recent-run list (40 most recent) still contains no Production #624 or any Production after #623. Latest Production remains #623, run `45949528329`, event `push`. The 20:17 KST / 11:17 UTC schedule remains not observed at 22:03 KST; do not call this a confirmed dropped/failed schedule. No late Production was present in the fresh list.
- Current UTC schedule remains `17 11 * * *` and `17 23 * * *`; next upcoming slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC and must log `trigger=github_schedule` plus `scheduleExpression=17 23 * * *`. Do not change cron.
- #623 run log confirms `trigger=github_push`, `startedAt=2026-11-27T06:04:29.000Z`, `finishedAt=06:04:49.518Z`; sources: YouTube skipped, Google News 99, Bing News 31; validation passed; queryFailures empty. Actions created/run-started at 06:04:22Z. Production job 140341900635 passed 226/226 tests and all archive validation; Pages configure/upload/deploy steps all succeeded.
- #623 data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public URL `https://uforpel.github.io/haewon-archive/` could not be opened by web verifier; public live site/UI remains unverified.
- Current quality metrics still reflect the #623 dataset: 936 candidates (749 articles, 187 videos); 111 publisherArticleUrl records; 84 verified Haewon articles; 62 verified Haewon article-image previews; 359 thumbnail assignments; 577 missing; 273 unverified legacy shared assignments; independent photos 0. RSS/meta comparison: 86 compared, 0 RSS candidates, 86 meta-only. Thumbnail review 493 eligible / 0 reviewed; precision null.
- #623 news status shows 99 Google News + 31 Bing News items; all 6 Google and 6 Bing queries successful; 0 RSS image signals from either feed; 0 RSS image candidates; thumbnail enrichment attempted 0 in that run. This is a measured absence of feed image signals, not evidence of an extractor parser defect.
- Code review of `scripts/collect-news.mjs`: existing parser already checks RSS Media RSS thumbnail/content, image enclosure, description HTML and content:encoded; publisher page extraction supports OG/Twitter, image_src, itemprop:image and JSON-LD. Enrichment is restricted to explicit HTTPS publisherArticleUrl, missing thumbnail, standard public GET with redirects, bounded limit/concurrency, and retry backoff (1/7/30 days depending on result class). Google News wrapper results are deliberately not assigned. No evidence justifies broadening to source homepage links or wrapper decoding.
- Research grounding: Google Search Central Article structured-data guidance recommends representative, relevant, crawlable/indexable article images, not logos; general structured-data policy stresses page relevance and crawlability. Open Graph protocol documents image URL plus optional type/width/height/alt. These sources support retaining relevance/provenance checks, not blindly assigning every metadata URL. Links: https://developers.google.com/search/docs/appearance/structured-data/article ; https://developers.google.com/search/docs/appearance/structured-data/sd-policies ; https://ogp.me/
- No code/data/workflow/source-policy change in this cycle. Further code changes are deferred until a concrete parser gap or a verified eligible retry population is isolated. Preserve all 273 legacy records and PR #54/#56 transactional review flow.
- Failure history still contains exactly the #617 real Google News HTTP 429; no second distinct real failure and no synthetic event. YouTube Atom source registry remains disabled; videos.json has 20 records; no YOUTUBE_API_KEY workflow env. Android Chrome real-device QA remains unverified.


## 2026-11-27 22:10 KST — Live verification and item-level thumbnail retry audit
- Re-read all seven canonical documents from current main `dd4ff74e5b4be907f34bdd0c1dffb62a7dd37030`; PR #79 is merged at this SHA and no open PRs were returned.
- Latest Actions listing still has no Production #624 or later run. Production #623 (`45949528329`) remains the latest Production and is `event=push`; the 20:17 KST / 11:17 UTC slot remains not observed, not proven dropped or failed. Next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, still future at this checkpoint. Require Actions `event=schedule`, run-log `trigger=github_schedule`, exact `scheduleExpression=17 23 * * *`, and compare created_at/run_started_at with startedAt. Do not change cron or infer #614/#622 expressions.
- #623 Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, trigger `github_push`. Job `140341900635`: 226/226 tests, 0 failures, archive validation passed. Google News 99, Bing News 31; both six-query batches succeeded; queryFailures empty; YouTube skipped. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Pages configure/upload/deploy steps succeeded. Public URL direct access remains unavailable to verifier; live site/UI unverified.
- Full Git blob `data/discovery.json` (936 records; 1,482,894 bytes) was parsed. Of 111 explicit HTTPS publisherArticleUrl records, 27 have no thumbnail. Fetch states: 17 `missing`; 10 `failed` (8 HTTP 403/forbidden, 1 HTTP 405/method-not-allowed, 1 HTTP 405/network-error). At 2026-11-27 22:10 KST, 0/27 are retry-eligible: all remain within the applicable 7-day wait. Earliest eligible timestamp: `2026-12-01T06:57:55Z`. At #623 collection timestamp, six-hour offset was 83137; maximum selected targets remains 12, but current target count is 0. No requests were made in this audit.
- `scripts/collect-news.mjs` confirms 1/7/30-day retry classes, six-hour offset rotation and max-12 selection. No code change or HTML fixture test is justified because no retry-eligible records or concrete parser-miss page were found. No blind retry.
- Baseline: 936 candidates (749 articles, 187 videos), 111 explicit publisher URLs, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments. RSS image signals/candidates 0; comparison 86 meta-only; review 493 eligible/0 reviewed, precision null. Preserve 273 legacy records and PR #54/#56 transaction flow.
- Failure history still contains only real #617 HTTP 429; no synthetic event. YouTube Atom disabled; videos.json 20; Data API disabled; workflow has no YOUTUBE_API_KEY injection. collection-status.json has no networkRequests field, so only disabled policy and itemsFetched=0 are directly confirmed there; do not claim measured networkRequests=0.
- Android Chrome real-device QA remains unverified. Public URL access and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.

## 2026-11-27 22:31 KST — Live verification checkpoint
- Live main at start of this cycle: `d0b256db3fa4208112900387a2021683f6abbf71`; latest re-fetch confirmed it remained current. No open PRs.
- Current time is 2026-11-27 22:31 KST. The 20:17 KST / 11:17 UTC Production slot remains unobserved / cause unknown. The next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron expression `17 23 * * *`; it is still in the future. Do not label it success/failure before it runs. Afterward require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression, and compare created_at/run_started_at with startedAt. Do not infer #614/#622 expressions or change cron.
- Latest Production remains #623, run `45949528329`, event=push. Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`. Job `140341900635` succeeded; 226/226 tests, 0 failures; run-log validation passed. Google News 99, Bing News 31, YouTube skipped, queryFailures empty. Pages configure/upload/deploy steps succeeded.
- Data commit remains `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Pages artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Independent public Pages URL access remains unverified; successful deploy steps are not live-site proof.
- Current main's full Git blob for `data/discovery.json` was parsed: 936 records, 577 missing thumbnails, 111 explicit HTTPS publisherArticleUrl, 27 records with both missing thumbnail and explicit publisher URL. Nested `thumbnailMetaFetch` classes: missing 17 (10 status 200, 7 no status); failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Exact 1/7/30-day retry policy yields 0 eligible at 22:31 KST; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No requests or blind retries were made. The six-hour offset/max-12 policy is unchanged; selected count is 0.
- Quality metrics still show 936 candidates (749 articles, 187 videos), 84 verified Haewon articles, 62 verified Haewon article-image previews, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image candidates 0, 86 meta-only comparisons, review 493 eligible / 0 reviewed / precision null. Independent photos remain 0.
- `data/query-failure-history.json` still contains only the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, `videos.json` 20, Data API disabled, no workflow YOUTUBE_API_KEY injection. `collection-status.json` has no `networkRequests` field; do not claim measured networkRequests=0. Preserve all source restrictions, 273 legacy assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA remains unverified until the user checks directly. No code or collection-data change was justified in this cycle.

## Current handoff
- Revalidate the schedule only after the next slot. Keep Production, data commit, artifact, Pages public reachability and Android QA as separate evidence categories.
