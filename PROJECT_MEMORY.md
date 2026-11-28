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

## 2026-11-28 06:47 KST — Fresh live verification
- Live main was re-read from GitHub: dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2 (data-refresh commit); this supersedes prior checkpoint 330b5fb7dbdeef689a5117b087cc1ee42a34a747.
- Production #624, Actions run 46060489526, is a successful schedule event. Actions created_at/run_started_at=2026-11-27T19:59:27Z; run-log trigger=github_schedule, scheduleExpression=17 11 * * *, startedAt=2026-11-27T19:59:31.000Z, finishedAt=19:59:52.735Z. This matches the prior 2026-11-27 20:17 KST slot (11:17 UTC) but started 8h42m27s after its scheduled clock time. It was not observed at the 22:31 checkpoint; it is now observed as a delayed schedule-triggered run. The cause of delay is unknown; do not attribute it to GitHub drop/failure.
- This is NOT the next 2026-11-28 08:17 KST slot. That future slot remains 17 23 * * * (2026-11-27 23:17 UTC); at 06:47 KST it has not occurred. After it runs, require event=schedule, trigger=github_schedule, exact expression 17 23 * * *, and timestamp comparison.
- #624 job 140713285787 succeeded. Tests: 226 passed, 0 failed. Run-log validation passed; Google News 193 items, Bing News 36, six of six queries succeeded, queryFailures empty; YouTube skipped. Data commit / new main: dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2.
- Pages artifact 15228811375, 770763 bytes, SHA-256 a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd; configure/upload/deploy succeeded. Public URL direct access remains unverified.
- Full data/discovery.json Git blob (9059841c0577269da3be828dfa15660b86fd926d) parsed: 962 records (774 article candidates, 188 video candidates), 113 explicit HTTPS publisherArticleUrl, 602 missing thumbnails, 28 missing+explicit publisher URL. Quality metrics: 360 assigned thumbnails (273 unverified legacy), 84 verified Haewon articles, 62 verified Haewon article-image previews; RSS image candidates 0; review 493 eligible/0 reviewed/precision null. #624 attempted 2 eligible publisher-page enrichments: one OG image assigned (fnnews), one page had no candidate (tvdaily).
- Recomputed exact shouldRetryThumbnailFetch against all 962 records at 2026-11-27T21:47:00Z (2026-11-28 06:47 KST): 0 eligible; earliest next eligibility remains 2026-12-01T06:57:55.671Z. Keep 1/7/30-day policy, six-hour offset rotation, max 12; no blind retry or speculative fixture/code change.
- Query-failure history still contains only real #617 HTTP 429. YouTube Atom disabled; videos.json 20; Data API disabled; no YOUTUBE_API_KEY injection. collection-status has no networkRequests field. Preserve all source restrictions, 273 legacy shared assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and direct public Pages access remain unverified. Code unchanged; documentation-only PR opened for this cycle.

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
