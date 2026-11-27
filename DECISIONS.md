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
