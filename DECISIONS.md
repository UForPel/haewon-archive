# Decision Register

Updated: 2026-11-19

## Confirmed
1. Repository remains public: https://github.com/UForPel/haewon-archive
2. Product remains a free/near-free, mobile-first Haewon archive on GitHub Pages.
3. User wants fan videos as well as official videos; official RSS alone is insufficient.
4. User prefers permitted public-web crawling/discovery over making official APIs the primary discovery method, due to API limits/friction.
5. Gemini API is selected for collection analysis and organization; user will add the key directly to GitHub Actions Secrets.
6. External scheduler is preferred over relying only on GitHub Actions cron because scheduled Actions have been delayed in the user's experience.
7. Target external trigger cadence is every five minutes; completion exactly every five minutes is not guaranteed.
8. Gemini reads GitHub-hosted behavior rules and improves those rules/collection strategies from evidence and logs.
9. Gemini is not responsible for improving or rewriting application code.
10. ChatGPT is architecture, prompt, review and continuity coordinator.
11. Hybrid policy permissions are preferred: ordinary search/classification guidance may be updated within constraints; security/privacy/access/legal rules remain protected and require human review.
12. Project conversations should be documented in GitHub so new chats can resume without relying on chat history.

## Not yet decided / verify
- Exact external scheduler account/configuration (cron-job.org is a candidate, not connected).
- Whether Cloudflare Worker or another gateway safely authenticates and dispatches Actions.
- Exact Gemini model, API features, grounding/search availability, current quotas, costs and data terms.
- Exact permitted crawling sources and per-source access rules.
- Data schema extensions for fan videos and photo metadata.
- Whether policy changes are committed to a dedicated branch or submitted as PRs.
- Retention and rotation for machine run logs.

## Decision rules
Never silently convert a proposal into a confirmed decision. Add dated entries when the user explicitly confirms or changes a decision. If a newer decision conflicts with an older one, mark the older one superseded rather than deleting history.


## 2026-11-27 — YouTube automated access boundary
13. YouTube Atom polling at /feeds/videos.xml is disabled for all channels because the current robots.txt disallows the path for general user agents and Terms restrict automated access. Preserve historical records; do not infer permission from official channel ownership.
14. YouTube Data API remains disabled until a compliant 30-day refresh/deletion lifecycle is implemented and reviewed. Production must not pass the API secret while disabled.

 
## 2026-11-27 — Schedule observability checkpoint
15. PR #75's scheduleExpression field is now implemented and merged. The configured cron remains unchanged: 17 11 * * * and 17 23 * * * UTC.
16. Production #623 is a push-triggered run and is not evidence that the 20:17 KST schedule executed.
17. Keep the #614/#622 schedule timestamp anomalies unresolved until new event.schedule telemetry and timestamps provide evidence. GitHub's documented high-load delay behavior is not a proven cause for earlier-than-configured starts.

 
## 2026-11-27 — Operational observation after the 20:17 KST slot
18. At 21:22 KST, no Production run after #623 was present in the inspected live Actions list. This is an observation only, not a confirmed scheduler failure or root-cause diagnosis.
19. Keep cron at `17 11 * * *` and `17 23 * * *` UTC until evidence supports a change. #614/#622 cannot be mapped retrospectively because their run logs lack scheduleExpression.
20. Public Pages deploy success and independent public URL access are separate verification states; do not mark the latter successful when the verifier cannot open the URL.

 
## 2026-11-27 — 22:03 KST schedule and thumbnail review
21. Fresh Actions listing at 22:03 KST still shows no Production after #623; the 20:17 KST slot remains unobserved, not a proven GitHub scheduler drop.
22. Next expected slot is 2026-11-28 08:17 KST with expression `17 23 * * *` UTC. Verify actual event and run-log telemetry before attributing it.
23. Do not broaden thumbnail extraction merely because RSS image candidates are zero: the current collector already parses Media RSS, image enclosure, description/content:encoded markup, and publisher OG/Twitter/image_src/itemprop/JSON-LD. The latest feed sample had zero image-bearing RSS signals.
24. Preserve the requirement that selected images are article-relevant and publicly accessible; a metadata URL is a candidate, not proof of relevance. No automated replacement of legacy shared thumbnails.


## 2026-11-27 22:10 KST — Operational observation (not a policy change)
- 20:17 KST slot remains unobserved in the latest Actions list; root cause unknown. Next slot remains 2026-11-28 08:17 KST with UTC expression `17 23 * * *`; no cron modification.
- Full-data retry audit: 27 missing-thumbnail records have explicit publisher URLs; 0 currently retry-eligible (17 missing, 10 failed; all within 7-day delay). Earliest next eligibility is 2026-12-01T06:57:55Z.
- Preserve source restrictions, human relevance review, 273 legacy image assignments and PR #54/#56 transaction semantics.


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Operational checkpoint
- Latest main `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. Latest Production #623 is push-triggered. 20:17 KST slot remains unobserved with unknown cause; next 08:17 KST slot remains future. No cron changes.
- Fresh full-blob audit: 27 missing-thumbnail records with explicit HTTPS publisher URLs; 0 retry-eligible at 22:19 KST. Earliest eligibility 2026-12-01T06:57:55.671Z. Do not issue blind retries.
- #623 artifact digest and Pages deploy steps reconfirmed; public URL verifier remains unable to access the page, so public accessibility is unverified. Android QA remains unverified.

## 2026-11-27 22:31 KST — Live verification checkpoint
- Live main at start of this cycle: `d0b256db3fa4208112900387a2021683f6abbf71`; latest re-fetch confirmed it remained current. No open PRs.
- Current time is 2026-11-27 22:31 KST. The 20:17 KST / 11:17 UTC Production slot remains unobserved / cause unknown. The next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron expression `17 23 * * *`; it is still in the future. Do not label it success/failure before it runs. Afterward require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression, and compare created_at/run_started_at with startedAt. Do not infer #614/#622 expressions or change cron.
- Latest Production remains #623, run `45949528329`, event=push. Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`. Job `140341900635` succeeded; 226/226 tests, 0 failures; run-log validation passed. Google News 99, Bing News 31, YouTube skipped, queryFailures empty. Pages configure/upload/deploy steps succeeded.
- Data commit remains `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Pages artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Independent public Pages URL access remains unverified; successful deploy steps are not live-site proof.
- Current main's full Git blob for `data/discovery.json` was parsed: 936 records, 577 missing thumbnails, 111 explicit HTTPS publisherArticleUrl, 27 records with both missing thumbnail and explicit publisher URL. Nested `thumbnailMetaFetch` classes: missing 17 (10 status 200, 7 no status); failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Exact 1/7/30-day retry policy yields 0 eligible at 22:31 KST; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No requests or blind retries were made. The six-hour offset/max-12 policy is unchanged; selected count is 0.
- Quality metrics still show 936 candidates (749 articles, 187 videos), 84 verified Haewon articles, 62 verified Haewon article-image previews, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image candidates 0, 86 meta-only comparisons, review 493 eligible / 0 reviewed / precision null. Independent photos remain 0.
- `data/query-failure-history.json` still contains only the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, `videos.json` 20, Data API disabled, no workflow YOUTUBE_API_KEY injection. `collection-status.json` has no `networkRequests` field; do not claim measured networkRequests=0. Preserve all source restrictions, 273 legacy assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA remains unverified until the user checks directly. No code or collection-data change was justified in this cycle.

## 2026-11-27 decision
- No collector/parser change: zero retry-eligible publisher pages and no proven extractor miss. Do not run speculative HTML requests. Continue to preserve current retry policy and source constraints.

## 2026-11-28 decision — delayed schedule and thumbnail gate
- #624 is an observed successful schedule event matching the prior 20:17 KST slot expression 17 11 * * *; Actions started 2026-11-27T19:59:27Z and run-log startedAt 19:59:31Z, about 8h42m late. Record lateness and unknown cause; do not attribute a root cause or classify it as a dropped run.
- The next 08:17 KST slot is distinct (17 23 * * *) and was still future at 2026-11-28 06:47 KST. No cron change.
- The 962-record full-blob audit finds zero retry-eligible publisher pages at 06:47 KST; earliest next eligibility 2026-12-01T06:57:55.671Z. Keep 1/7/30-day backoff, six-hour offset rotation and max 12. No blind retry, no new extractor fixture/code without an eligible real page proving a miss.
- #624 produced one new OG image assignment from an explicitly identified fnnews article; tvdaily page returned no image candidate. This does not establish general extractor failure or justify changing parser behavior.
- Continue preserving 273 unverified legacy shared assignments, query-failure #617 as the only actual 429, all source restrictions, and PR #54/#56 transactional flow.

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
