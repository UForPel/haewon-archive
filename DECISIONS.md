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
