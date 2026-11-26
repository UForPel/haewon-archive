# Collection Rules — Haewon Archive

Version: 1.0.0
Status: HUMAN-MAINTAINED PROTECTED RULES
Related: [SECURITY_POLICY.md](SECURITY_POLICY.md), [SOURCE_POLICY.md](SOURCE_POLICY.md), [GEMINI.md](GEMINI.md)

## 1. Purpose

Collect useful, attributable, publicly accessible records about Haewon (Oh Haewon) and NMIXX-related content. Prefer precision, source quality and durable canonical links over raw volume.

## 2. Source permission classes

A source is not automatically approved merely because a page can be opened in a browser.

| Class | Meaning | Automated behavior |
|---|---|---|
| `public-feed` | Explicit public feed/interface currently approved in the source registry | May fetch within its documented limits and this policy |
| `manual-link-only` | A public page useful to visitors, but not approved for automated extraction | Do not crawl; a human may register a plain source link |
| `review-required` | Permission, terms, robots policy, or technical access is uncertain | Do not collect until human review |
| `disabled` | Source paused or disallowed | No requests |

The current approved automated source is the NMIXX Official YouTube public Atom feed listed in `data/sources.json`. Instagram and JYP pages are currently manual-link-only. Do not expand this allowlist autonomously.

## 3. Allowed record content

Collect only metadata that is publicly visible and needed for discovery:
- Stable platform/content identifier when provided.
- Canonical public URL.
- Exact public title.
- Public source/channel/creator name.
- Publication date/time only when verifiable.
- Short public description or excerpt only when necessary and permitted.
- Permitted preview/thumbnail URL supplied by the platform.
- Collection timestamp.
- Classification and a short evidence-based rationale.

Do not collect private data, login-only content, comments at scale, contact details or unrelated profile information.

## 4. Verification requirements

- Preserve the original canonical URL; do not invent or guess IDs.
- Prefer the source page or official feed over snippets copied by third-party search engines.
- Distinguish publication time from discovery/collection time.
- If a date cannot be verified, leave it unknown rather than estimating.
- If title, uploader or source identity conflicts across evidence, classify as uncertain.
- A search snippet alone is not sufficient to assert visual appearance or member participation.
- Do not infer that Haewon appears in a video from the uploader being official or from NMIXX being mentioned.

## 5. Copyright and preview handling

- Never download or rehost full video or photo files.
- Keep source links and attribution.
- A thumbnail URL may be stored only when it is supplied by an approved platform/feed and used as a permitted preview.
- For fan photos, default to a plain source link and attribution; do not mirror image binaries.
- If reuse permission is unclear, do not display a copied preview.

## 6. Rate and failure handling

- Follow source-specific published rate limits and robots directives.
- Use conservative request frequency, bounded retries and exponential backoff for transient failures.
- Stop requests after authorization, access-denied, CAPTCHA, anti-bot or explicit disallow responses.
- Do not rotate identities, proxies or user agents to evade limits.
- Record source health as success, partial, skipped, blocked or failed with a sanitized reason.
- Do not interpret a temporary failure as permission to try a hidden endpoint or alternate bypass.

## 7. Deduplication and updates

- Use the platform's stable content ID as the primary key when available.
- Also normalize canonical URLs and use them as a secondary duplicate check.
- Preserve existing IDs and stable records.
- Update only fields supported by newer source evidence.
- Do not overwrite verified metadata with lower-confidence snippets.
- Keep source attribution and correction history where practical.

## 8. Data write gate

Before any automated write:
1. Parse the entire candidate payload.
2. Validate against the versioned schema.
3. Confirm every source is enabled and approved.
4. Validate URL scheme and source domain.
5. Check IDs, timestamps, required fields and field lengths.
6. Deduplicate against existing repository data and within the batch.
7. Enforce per-run item and byte limits.
8. Write only to the workflow's explicit data-path allowlist.
9. Run repository validators and tests.
10. If any gate fails, write no candidate records; emit a sanitized failure summary.

Gemini does not have permission to alter these rules or the validators enforcing them.



## 9. RSS discovery and publisher URL boundary (2026-11-25 audit)

- Google News and Bing RSS may be used as public discovery feeds only within the configured collection workflow. Their item-level fields are evidence, not permission to crawl a publisher or bypass access controls.
- A Google News item `source` / `sourceUrl` that identifies a publisher site is not an individual article URL. Never promote it to `publisherArticleUrl`, decode opaque wrapper tokens, or follow wrapper redirects to infer a destination.
- A Bing RSS item may contribute an article URL only when its public item metadata explicitly discloses an HTTPS URL (for example, the documented URL query parameter). Preserve provenance and final host. Relative image URLs may be resolved only against that explicitly disclosed article URL.
- Accept image candidates only from explicit item-level RSS media fields or public publisher-page metadata already allowed by the source policy. Audio/video enclosures are not thumbnails. A missing RSS image signal is a feed-coverage limitation, not permission to guess a CDN path or search for hidden endpoints.
- X/Twitter profile and post URLs are social records, not publisher articles. Do not count them in verified publisher-article coverage or run publisher article thumbnail enrichment against them. Keep discovery context and public source links where appropriate.
- HTTP 403, 405, authentication, CAPTCHA, anti-bot and explicit disallow responses are terminal for that attempt. Do not retry with another method, identity, proxy, user agent or alternate endpoint to bypass the response. Preserve the candidate and record a sanitized failure class.
- Preserve all 273 shared legacy thumbnail assignments until each record has independent evidence and a reviewed migration plan. Do not bulk-delete, bulk-replace or propagate one image label across the group.


## 2026-11-25 — Fresh 405 evidence and feed-source boundary
- The Sportskeeda article URL in the collection diagnostics was re-opened on 2026-11-25 and returned HTTP 405 Method Not Allowed. Treat this as terminal for that attempt; do not switch methods, use alternate endpoints, proxies or other bypasses.
- Preserve the candidate, explicit article URL, response status, final host and sanitized failure class. Apply the seven-day retry interval proposed in PR #25 for method-not-allowed.
- RSS image parser support does not authorize new feeds. Review each candidate publisher feed's terms, permitted use, direct article URL disclosure and image licensing before adding it to data/sources.json or automated collection.
- The observed Google/Bing sample contained zero image signals. Do not infer hidden image URLs, decode opaque wrappers or treat site-level sourceUrl as an article URL.
- Preserve all 273 shared legacy thumbnail assignments until each has independent evidence and an approved migration plan.

## 2026-11-26 — Latest main, production and PR re-audit
- Current main: `3c93903c6e37839fd69e0a1a74851a3dac3e6174` (`data: refresh archive discovery and improvement cycle`). The data commit was produced by scheduled production run `45695468167`, whose workflow source SHA was `37998b31b12b2eb9980cff6df616b2f677a10de6`.
- Production run #45695468167: 142/142 tests, 0 failures; YouTube 15 items, Google RSS 135, Bing RSS 34; 24 new news candidates; metadata enrichment attempted 12, assigned 8, failed 3, missing 1. Validation, data commit, Pages configuration, 446,580-byte artifact upload and deploy step all succeeded. Artifact SHA-256 `ea394ffa5add0d8ffc8bdfc88673b145cf64fc6d7ebbb9870badc5ffe8d50bcc`.
- Main workflow still references checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. The actual production job emitted a Node.js 20 deprecation warning: these actions target Node20 but are forced to run on Node24. The run still succeeded. GitHub announced Node20 removal on 2026-09-23; do not describe the existing deployment as Node24-native.
- Latest production data: 729 candidates; 543 articles; 186 videos; 77 verified publisher articles; 67 verified Haewon articles; 55 publisher articles and 48 Haewon articles with provenance-backed thumbnails; 329 thumbnail assignments; 400 missing; 57 unique thumbnail URLs. Of the 329 assignments, 273 are the same unverified legacy URL. Human image labels remain 0; visual precision is unmeasured.
- Latest Google RSS diagnostics: 101 items, 98 site-level source URLs, 0 explicit publisher article URLs, 0 image signals. Bing RSS produced 34 candidates; the prior PR #28 sample (36 items) also had 0 image signals. PR #28 parser fixture tests are not proof of live feed image availability.
- All 14 currently open PRs remain unmerged. Current main comparison ahead/behind: #13 59/9, #14 134/9, #15 3/9, #16 13/9, #20 17/7, #22 13/7, #23 15/7, #24 9/7, #25 19/1, #26 8/1, #27 19/1, #28 4/1, #29 13/1, #30 19/1. PR #14 remains mergeable=false; do not merge its stale docs branch wholesale.
- PR #30 genuine pull_request run #45570252997 passed 142/142 tests and archive validation. It ran on a merge commit based on the previous main SHA 37998b31, not latest 3c93903. Its read-only workflow is not yet on main; it is not yet a shared CI gate for other PRs.
- No PR merged and no new source was added. Browser/mobile visual QA remains unverified.

## 2026-11-26 — Source and retry boundaries
- Preserve the existing 273 repeated legacy thumbnail assignments. Do not bulk delete, relabel or replace them.
- A persisted HTTP 405 may appear as `statusCode:405,errorCode:network-error` from earlier runs. PR #25 now proposes a seven-day retry gate based on statusCode as well as errorCode; until merged, production main still uses the old one-day classification.
- Google RSS current sample contains site-level `sourceUrl` values but no direct article URLs or image signals. Do not treat `sourceUrl` as article URL or infer hidden image URLs.
- Do not add SBS or Yonhap RSS to the public automated allowlist based only on endpoint availability. SBS terms specify personal noncommercial use; Yonhap terms restrict content to personal/noncommercial use; the Korean Digital News Content Use Rules restrict RSS to personal PC use and prohibit redistribution/re-RSS without permission. Obtain explicit written permission for public-site collection/use before any addition.
- PR #28's Media RSS parser must use the PR #27 shared publisher URL predicate. Do not merge the parser patch independently while it can classify X posts as publisher articles.

## 2026-11-26 — Source-rights evidence links
- SBS official RSS index and terms: https://news.sbs.co.kr/news/rss.do (personal, noncommercial use only; commercial use requires prior contact).
- Yonhap copyright terms: https://en.yna.co.kr/view/AEN20260905001800315 (content is owned by Yonhap; other use beyond personal/noncommercial requires written consent).
- Korean Digital News Content Use Rules: https://www.newstore.or.kr/store/copyRight/useRule.do (RSS is for personal subscription on a personal PC; redistribution and re-RSS without permission are prohibited).
- These sources establish that an RSS endpoint being public does not authorize redistribution through this public Pages archive. Written permission or a clear applicable license is required before adding a publisher feed.

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

## 2026-11-26 — Audit and source-boundary checkpoint
- The current 12-URL thumbnail audit is HEAD-only and read-only. It must not switch methods after a 403/405, follow hidden wrappers, or write audit outcomes into archive data unless a separate reviewed data migration is approved.
- Latest measured sample: 12 unique URLs checked; one HTTP 404 from a Sportalkorea CDN image URL; 11 returned image content; no unreachable or rate-limited responses. A 12-URL sample is diagnostic only, not a global availability estimate.
- Preserve all 273 legacy shared-thumbnail records; do not bulk delete, replace or auto-label them.
- Bing RSS image candidates may be parsed from explicit public item metadata, but an explicit Bing destination hosted on X/Twitter is still a social post, not a publisher article. Apply the shared social-host predicate before setting publisherArticleUrl or including it in publisher metrics. Preserve original candidate URL and provenance.
- No SBS or Yonhap RSS source is approved for collection. Do not add any new publisher feed until explicit applicable usage permission is documented.

## 2026-11-26 — Current collection and source policy
- Production remains free and static-first. Main's latest verified run #45728961571 used the Node24-pinned GitHub Actions workflow and succeeded through Pages deployment.
- Search currently uses one of three four-query packs per run. PR #22's six packs × six queries and twice-daily slot rotation are not yet on main; evaluate/port separately and measure before claiming improvement.
- Bing RSS may contribute explicit public image metadata (Media RSS, image enclosure, description and content:encoded). A Bing URL resolving to X/Twitter remains a social candidate, not a publisher article. Shared predicate must be applied before publisherArticleUrl, publisher metrics or metadata enrichment.
- Google News wrapper-only metadata is not a publisher article URL. Preserve candidate URL and provenance; do not decode wrappers or bypass access restrictions.
- Latest stored data: 736 candidates, 550 articles, 186 videos, 76 publisher URLs, 333 thumbnail assignments, 403 missing. The 273 legacy shared-image assignments remain preserved.
- Latest thumbnail audit sample: 12 unique URLs, 11 image responses, 1 HTTP 404 (Sportalkorea CDN), 0 unreachable, 0 rate-limited, 0 non-image successful responses. Do not extrapolate this sample to all thumbnails.
- Do not add SBS, Yonhap or other publisher RSS feeds until explicit applicable usage permission is documented. Do not redistribute article text or images outside allowed public metadata/link and attribution rules.
- No automated deletion, replacement or human-label assignment for the 273 legacy group.

## 2026-11-26 — Query rotation and source boundaries
- Editorial search uses 36 unique query phrases in six packs of six. Each KST day has a morning and evening slot, selecting two different packs. Current expected volume is 12 queries/day × Google and Bing RSS = 24 feed requests/day.
- Keep video/fancam terms out of editorial RSS query packs. Unresolved wrapper video candidates remain separate until a direct YouTube URL is verified.
- Query diagnostics record normalized unique URL yield, duplicate URL/title counts, cross-query overlap, title keyword proxy, explicit publisher URL rate and publication lag. Title proxy is not human-reviewed precision. Require multiple pack samples before adapting the query vocabulary.
- Query URL normalization strips only known tracking parameters; do not strip content-bearing `source` or `ref` parameters.
- Apply shared publisher URL predicate before publisherArticleUrl, publisher metrics or metadata enrichment. X/Twitter destinations remain discovery candidates but are never publisher articles.
- Latest first-pack sample index 4: six queries, 54 Google candidates, 20 Bing candidates; median publication lag varies widely and some queries are stale. Compare more packs before conclusions.
- Latest stored data: 767 candidates, 580 articles, 187 videos, 85 verified publisher articles, 70 verified Haewon candidates; 340 thumbnails, 427 missing. Preserve 273 legacy shared-image records.
- Latest thumbnail response sample: 12 URLs, 11 image responses, one HTTP 404 (Sportalkorea CDN), 0 unreachable, 0 rate-limited, 0 non-image successful responses.
- No new RSS sources are approved. SBS, Yonhap and other publishers remain excluded as direct feeds pending explicit applicable permission.

## 2026-11-26 — Article review and publisher access sampling
- PR #35 adds a browser-local review tool for explicit HTTPS verified Haewon publisher article candidates only. Dimensions: content type, direct/indirect relevance, original access, date accuracy, source accuracy, category accuracy and thumbnail suitability.
- Labels remain in localStorage; manual JSON export/import only. No automatic server upload. Review notes must not contain personal information.
- Production quality metrics perform at most 12 rotating HEAD-only checks per run against direct verified publisher URLs, concurrency 3 and timeout 3.5s. Follow ordinary redirects only. HTTP 405 is uncertain; never retry with GET.
- Latest sample: 12/71 checked, 10 HTTP responses and 2 blocked (403); 0 paywall, 0 404, 0 uncertain.
- Legacy thumbnail audit: 273 repeated assignments, 0 explicit publisher article URLs, 199 sourceSiteUrl records, 0 alternative thumbnail candidates, 273 not-attempted metadata states. Preserve all records; do not auto-delete or replace.
- Current data: 795 candidates, 608 articles, 187 videos, 87 publisher article URLs, 71 verified Haewon articles, 342 thumbnail assignments, 453 missing, 70 unique thumbnail URLs.
- Thumbnail response sample: 12 unique URLs, 11 image responses, one HTTP 404 (Sportalkorea CDN), 0 unreachable, 0 rate-limited, 0 non-image successful responses.
- Query pack index 4 has now been observed twice in the same KST slot; use the next distinct pack for comparison. Title keyword match remains a proxy, not human relevance.
- Production push ignores Markdown-only commits. Twice-daily schedule and manual dispatch remain active.
- No new publisher RSS feeds are approved. SBS and Yonhap remain excluded as direct feed sources pending explicit applicable permission.

## 2026-11-26 — Current query rotation checkpoint
- Six editorial query packs × six unique phrases; deterministic KST morning/evening rotation. Two distinct packs are selected daily.
- First production sample pack index 4: 54 Google and 20 Bing candidates. Query metrics are provisional and require additional pack samples.
- Latest thumbnail audit: 12 URLs; 11 image responses and one HTTP 404. Preserve all 273 legacy shared-image assignments.
- No new publisher RSS source without explicit applicable permission.


## 2026-11-26 — Publication freshness diagnostics
- Record each query's candidate age in mutually exclusive buckets: within 7 days, 8–30 days, 31–90 days, older than 90 days, unknown date and future date.
- Freshness rates use all candidates as denominator so missing/future dates are not silently excluded. Median/p90 publication lag remain complementary metrics.
- Freshness is a search-quality diagnostic, not a factual-reliability or Haewon-relevance score. Title keyword matches remain proxies until human review.
- Do not delete, reject or hide historical candidates solely because they are older than 90 days. Any display filtering must remain separate from collection and preserve records.
- Do not expand publisher RSS sources without explicit applicable permission; SBS and Yonhap remain excluded.


## 2026-11-26 — Live freshness measurement outcome
- First post-implementation pack 5 sample: 69 candidates; 0 within 7 days; 8 within 30 days; 15 in days 31–90; 46 older than 90 days; 0 unknown/future.
- This sample is too small and represents only one query pack. Do not automatically remove or promote query terms based on it.
- Google RSS sample: 27 items, no explicit publisher article URLs or image signals. Bing RSS sample: 42 items, 42 explicit article URLs, no RSS image signals.
- Preserve historical candidates and the 273 legacy thumbnail group. No SBS/Yonhap feed addition without explicit applicable permission.
