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

There are currently **no approved automated YouTube sources**. The legacy NMIXX Official YouTube Atom source is retained in `data/sources.json` for provenance but is `enabled: false` / `policy: disabled`; the collector performs zero network requests. Existing video records remain preserved. Google News and Bing News RSS are used only for their separately scoped public discovery workflow. Instagram and JYP pages are manual-link-only. Do not expand the YouTube allowlist without documented permission or an explicitly authorized access method.

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


## 2026-11-26 — Human review evidence boundary
- Automated title matches, publication freshness, publisher URL provenance and thumbnail metadata are diagnostic proxies; do not label them human-confirmed relevance.
- Article review requires seven independent dimensions. Explicit uncertain labels count as reviewed for workflow progress but must not be counted as positive relevance/accuracy.
- Human labels remain localStorage-only until the user manually exports/imports JSON. Do not upload browser labels automatically or collect personal notes.
- Do not change query-pack selection from proxy scores alone; require a meaningful human-reviewed sample and repeated pack observations.


## 2026-11-26 — Review queue merge checkpoint
- The pending-only and next-pending controls are merged, but deployment must be verified before treating them as production-visible.
- No automatic review-label upload was introduced. Existing localStorage/manual JSON transfer boundary remains unchanged.


## 2026-11-26 — Review queue deployment and current data
- PR #42 review queue controls are deployed after successful Production #601.
- Current data: 855 discovery candidates; 76 verified Haewon article candidates; zero committed human review labels.
- Pack 5: 94 fetched / 88 unique / 39 added; 0 within 7 days, 7 in days 8–30, 70 older than 90 days. This is one sample only; do not auto-filter or change search strategy based on it.
- Metadata enrichment attempted 2 and assigned 2; 273 legacy shared-image assignments remain untouched.
- Manual review labels remain local-only unless the user explicitly exports/imports them. No automatic transfer.


## 2026-11-26 — Review queue auto-advance boundary
- The new behavior changes only browser-local review navigation. It does not alter collection, source eligibility, article records, labels uploaded to the repository, or thumbnail assignments.
- A review row leaves the pending-only list only after all seven independent dimensions have explicit valid values. `uncertain` remains a completed judgment, not a positive relevance result.
- PR #43 CI and deployment must be verified independently. No change to publisher-source permissions; SBS and Yonhap remain excluded absent explicit applicable permission.
- Preserve the 273 legacy shared-thumbnail assignments unchanged.


## 2026-11-26 — Review queue auto-advance merged
- PR #43's navigation change is merged. CI passed 193/193 tests and archive validation.
- Production #602 is in progress; collection and Pages deployment are not yet verified. The change does not alter publisher source eligibility, collection policy or the 273 legacy thumbnail group.


## 2026-11-26 — Production #602 collection and deployment outcome
- Production #602 succeeded; the cycle added 3 unique records (99 fetched, 92 unique incoming, 7 duplicates). Google and Bing each completed all 6 queries.
- Google RSS provided 56 items but zero explicit publisher article URLs and zero image signals. Bing provided 43 explicit publisher URLs but zero image signals. Do not infer article image URLs from wrapper or site-level metadata.
- One thumbnail enrichment attempt succeeded and assigned one provenance-backed image. Total thumbnail state: 352 assigned, 504 missing, 80 unique URLs; the 273 legacy shared-image assignments remain untouched.
- No new RSS source was added. SBS and Yonhap remain excluded pending explicit applicable permission.
- Production #602 Pages deployment succeeded. This does not establish real mobile visual/tap-target QA.


## 2026-11-26 — Mobile review UI safeguards
- This cycle changes only browser-local review controls and CSS; it does not change collection, publisher source eligibility, archive records, or thumbnail assignment policy.
- JSON import remains schema-validated and limited to currently eligible article IDs. Imported labels merge with existing browser-local labels; no automatic upload or backend is added.
- Storage failures preserve the previous in-memory labels and surface a recovery message. Users should export a manual JSON backup before clearing browser data or changing devices.
- PR #44 automated CI passed 195 tests and archive validation. Actual Android/mobile QA is still outstanding.
- Preserve the 273 legacy shared-thumbnail assignments. Do not add SBS/Yonhap RSS without explicit applicable permission.


## 2026-11-26 — Production #603 data and source boundary
- Production #603 collected 74 incoming candidates, 67 unique and 2 added. Google and Bing each completed 6/6 queries.
- Google RSS supplied 32 items but zero explicit publisher article URLs and zero image signals. Bing supplied 42 explicit publisher article URLs but zero image signals. No wrapper decoding or inferred image extraction was used.
- Thumbnail enrichment attempted 0 and assigned 0. Total current thumbnail state: 352 assigned, 504 missing, 80 unique URLs; 273 legacy shared-image assignments remain untouched.
- No new RSS source was added; SBS/Yonhap feed addition still requires explicit applicable permission.
- PR #44 changed only local review UI/CSS; labels remain browser-local and manually exportable/importable. Production #603 deployment succeeded; real mobile QA is still outstanding.


## 2026-11-26 — Production #604 image-signal diagnosis

Google RSS: 26 items, 26 site-level source URLs, 0 explicit publisher article URLs, 0 media thumbnail/content/enclosure/description image signals. Bing RSS: 41 items, 41 explicit publisher article URLs, 0 image signals.

Both providers completed 6/6 requested queries. 67 incoming records, 60 unique, 2 new records. Thumbnail enrichment attempted 0 / found 0 / assigned 0.

This sample indicates the RSS metadata contains no image fields for collected items; do not fabricate image URLs from source-site URLs, wrappers, titles or guessed page paths.

Google News wrapper decoding remains disallowed. Bing explicit publisher URLs may be retained under the existing predicate, but their presence is not image metadata.

No new RSS source is approved by this diagnostic. SBS/Yonhap remain excluded absent explicit applicable permission.

Preserve the 273 legacy shared-thumbnail assignments unchanged. Current total remains 352 assigned / 504 missing. Review UI changes do not affect collection or source eligibility.


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


## 2026-11-26 — Review-label storage boundary reaffirmed
- Article and thumbnail review labels are browser-local (localStorage) only. Transfer is user-initiated JSON export/import; never add automatic upload or remote synchronization without a separately approved policy change.
- Import must validate schema and eligible IDs, merge per dimension, and preserve unrelated existing labels. A failed localStorage write must retain the prior in-memory and persisted labels.
- Never infer human review labels from tests, automated relevance classification, or device-independent checks. Real Android Chrome QA requires user-reported observations.
- Keep source/rights restrictions unchanged: no new RSS source without explicit permission; use only explicitly supplied public HTTPS article/image metadata; do not decode Google News wrappers or bypass access controls. Preserve the 273 legacy shared-image assignments.


## 2026-11-26 — Local review rollback consistency
- A successful localStorage write is the commit point for review labels. On a later failed write, both persisted data and UI controls must remain at the latest committed value, including after multiple edits in the same rendered row.
- Never roll a control back to a stale value captured at initial render. Resolve fallback values from the current committed labels object.
- This change does not alter the local-only storage boundary or JSON manual transfer behavior.

- Validation correction: initial PR CI run `45792852673` executed 202 tests but failed one new source-contract assertion because the test regex was over-escaped; application code and the sequence test logic were not the reported failure. The assertion escaping was corrected in commit `eaf649630c18b8607f4723ea0a2d91995fa698cd`. Re-run CI before merge; do not treat the first run as passed.

## 2026-11-26 — Final outcome: PR #48 and Production #607
- PR #48 (`fix: restore latest saved review values after failed edits`) merged successfully as `f78deda672750ee05ab12e9cb12477e24c304987`. It updates the review UI rollback to read the latest committed in-memory label for all seven dimensions and expectedCategory, with a regression test for successful edit A followed by failed edit B.
- PR CI #62 (`45792986157`) on final PR head `11bb2cb5d0c58a268ce7338285aed490c6db80ef` passed: 202 tests, 202 passed, 0 failed; archive validation passed with 856 discovery candidates, 0 human-reviewed article labels and 179 schema-valid run logs; no review labels were added.
- The earlier PR CI #57 failed only on an over-escaped test source regex. The assertion was corrected and the final #62 run passed. Intermediate superseded runs were cancelled; they are not final CI results.
- Production #607 (`45793067039`) completed successfully on merge commit `f78deda672750ee05ab12e9cb12477e24c304987`: 202/202 tests; collection and archive validation successful; generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; Pages artifact `15103711890`, 597,338 bytes, SHA-256 `42f7bd9540b7ce086d2eac5baee3f7934dff2a5452c35b241ed4d9fdac80961c`; deployment log explicitly says `Reported success!`.
- Latest generated metrics: 856 candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails. Thumbnail audit: 352 assigned / 504 missing; 80 unique URLs; 273 legacy shared-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed. Article human review labels remain 0. Google News wrapper-only metadata: 12 candidates, left untouched. No new RSS, no wrapper decoding, no access bypass, no search-pack change, no auto upload, no Playwright/Puppeteer.
- Latest main at this checkpoint is the generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; open PR search returned 0 after #48 merge. This documentation follow-up is a Markdown-only PR and does not trigger another Production run.
- Android Chrome QA remains **UNVERIFIED** because no user-reported device checklist was received. Pure Node tests, PR CI and Pages deployment do not constitute real-device QA.


## 2026-11-26 — Review-storage change does not alter collection policy
- PR #50 is a browser-local review reliability fix only. It does not change enabled sources, RSS permissions, search terms, collection cadence, metadata fetch policy, URL provenance rules or retry/backoff.
- Keep all 273 legacy shared-image assignments intact. Do not replace/delete them automatically.
- Continue to reject wrapper-token decoding, inferred article URLs from site-level RSS sourceUrl, access-control bypass and unapproved new RSS feeds (including SBS/Yonhap).
- Thumbnail review labels remain localStorage-only with explicit user-initiated JSON export/import; do not upload them automatically or transmit them to a service.


## 2026-11-26 — Production #608 confirms collection policy unchanged
- Production #608 completed successfully; Google RSS 71 items, Bing RSS 40; 6/6 queries succeeded for each provider; 71 fetched / 64 unique incoming / 2 additions; thumbnail enrichment attempted 0.
- PR #50 changed only browser-local review persistence. It did not change source permissions, RSS list, query pack, collection cadence, metadata-fetch policy, retry/backoff, or article URL rules.
- Preserve all 273 legacy shared-image assignments. No bulk replacement/deletion, Google News wrapper decoding, access-control bypass, or new RSS source (including SBS/Yonhap) was introduced.
- Human review labels remain browser-local with manual JSON transfer only. No automatic upload or external service transmission.


## 2026-11-26 — PR #52 is UI-only
- Thumbnail review queue visibility change does not alter sources, RSS permissions, collection schedule, query pack, metadata fetch, retries or URL provenance.
- Production #608 baseline: Google RSS 71, Bing RSS 40; 2 news additions; no thumbnail enrichment attempt.
- Preserve all 273 legacy shared-image assignments. No new RSS (including SBS/Yonhap), wrapper decoding, access bypass, auto-labeling or automatic review upload.


## 2026-11-26 — Production #609 collection outcome
- Production #609 completed successfully; 15 YouTube candidates were duplicates (0 accepted); Google News RSS returned 71 items and Bing News RSS 43; archive validation passed.
- PR #52 is UI-only and does not change collection sources, RSS permissions, query pack, schedule, metadata policy, retries or URL provenance.
- Preserve all 273 legacy shared-image assignments. Do not add SBS/Yonhap or other new RSS sources without explicit permission. No wrapper decoding, access bypass, auto-labeling or automatic review upload.


## 2026-11-26 — Thumbnail review auto-advance does not change collection policy
- The review queue now schedules the next candidate only after a successful user-initiated localStorage save; it does not create labels or alter candidate data.
- No collection sources, RSS feeds, query packs, schedule, metadata fetch, URL provenance, retries or thumbnail assignment rules changed.
- Preserve all 273 legacy same-image assignments. Do not add SBS/Yonhap or other new RSS sources without explicit permission.
- No Google News wrapper decoding, access-control bypass, automatic review upload, paid service or external data transmission.


## 2026-11-26 — PR #54 and Production #610 final verification
- PR #54 merged as 8d2a6534371eaf302d703b98635a4db195dee175. Final-head PR CI #76 (45813584290) passed 208/208 tests, 0 failures; archive validation passed with 857 discovery candidates, 181 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #610 (45813683219) completed successfully on merge SHA 8d2a6534371eaf302d703b98635a4db195dee175. Test/collect/validate/data-commit, Pages artifact upload and Pages deployment steps all succeeded; deployment log explicitly reported “Reported success!”.
- Generated data commit: 46572b91bc23d3b74f91ae9954332858980346cd. Pages artifact 15114537998, 613,063 bytes, SHA-256 4d4bca14325820f3c0a3d83640ef620af86d60e4846438be8c4fad5895995295.
- Production #610 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google News RSS 94 items; Bing News RSS 39 items; archive validation passed. Current archive: 857 candidates (670 articles / 187 videos), 352 thumbnails assigned / 505 missing, 80 unique URLs; 273 legacy shared-image assignments retained; 482 thumbnail-review eligible / 0 reviewed; article human relevance labels 0.
- PR #54 changes only browser-local review interaction: after a manually selected label is successfully saved, the next pending candidate is opened, scrolled into view and focused. Failed storage writes preserve the previous label and do not advance. No review labels were created or uploaded.
- No collection sources, RSS, query pack, thumbnail assignments, labels, storage destination or backend changed. No new RSS, wrapper decoding, access bypass, paid service or external transmission. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — Repeated-image review UI only
- Repeated-image auto-advance is a browser-local review interaction and does not alter collection, RSS, URL provenance, thumbnail assignment, or retry policies.
- Preserve all 273 legacy shared-image assignments; never bulk-copy a label across records or auto-delete/replace the shared URL.
- 199 of the 273 records have source-site URLs but 0 have explicit publisher article URLs; source-site metadata is not an article URL. Do not infer a publisher URL or decode Google News wrappers.
- Keep the 12 wrapper-only metadata entries untouched. Do not add SBS/Yonhap or other RSS sources without explicit permission.


## 2026-11-26 — PR #56 and Production #611 final verification
- PR #56 merged as 747bb2c4be7cc9bb4fdafacfc10a823570d66db1. Final-head PR CI run 45815041255 succeeded: 209/209 tests passed, 0 failed; archive validation passed with 857 discovery candidates, 182 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #611 run 45815117814 completed with workflow conclusion success, but the collection run log status is partial: YouTube 15 seen / 0 accepted / 15 duplicates; Google News RSS 68; Bing News RSS 37 with 5 of 6 Bing queries successful (one query failure). Archive validation passed. Do not describe source collection as fully complete.
- Generated data commit b3091b027e3ea73211b6766c09833ac98916a790. Pages artifact 15115206223, 615,604 bytes, SHA-256 e96baee3a414ea23e335e27710fad205fe5a463845d947d8959804973c985de4. Deployment step succeeded and log reported “Reported success!”.
- Latest metrics generated 2026-11-26T11:57:06Z: 857 candidates (670 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 100 explicit publisher article URLs, 352 assigned thumbnails / 505 missing, 80 unique URLs, 273 legacy shared-image assignments preserved, 482 thumbnail review candidates / 0 reviewed, 0 article human review labels.
- The 273 legacy assignments have 0 explicit publisher article URLs, 0 alternative thumbnail candidate URLs, and 199 source-site URLs. Source-site URLs are not substituted for article URLs. All 273 remain untouched. The 12 wrapper-only Google News metadata entries remain untouched.
- PR #56 adds success-only auto-advance to the repeated-image review panel, reusing the current filtered next-pending article action. Labels remain per article, local-only; failed writes restore the saved value and do not advance.
- No new RSS/source, no Google News wrapper decoding, no access bypass, no automatic review labels/upload, no paid dependency, no external transmission. Android Chrome QA remains UNVERIFIED; it requires user-reported device results.
- Latest main after data commit: b3091b027e3ea73211b6766c09833ac98916a790. Documentation-only finalization PR follows; it does not trigger another Production collection.


## 2026-11-26 — Bing non-RSS response diagnostics
- When Bing returns a non-RSS response, record only status, Content-Type and a coarse response format classification. Do not persist the response body.
- Do not infer that non-RSS means a transient failure or permission to retry/bypass. Keep the query failure visible and preserve successful query results.
- No new sources, query packs, redirects, wrapper decoding or access-control bypass are introduced.


## 2026-11-26 — Persist RSS failure diagnostics
- Google and Bing query failures record status and Content-Type; if a successful HTTP response body was read, record only a coarse format classification (rss/atom/html/empty/unknown).
- Persist only allowlisted diagnostic fields; never save response bodies. Do not retry HTTP 429 or non-RSS responses, decode wrappers, or bypass access restrictions.

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

 
## 2026-11-27 — Missing-thumbnail diagnosis boundaries
- Keep discovery URL, explicit publisher article URL, source-site URL, final response host and image URL as distinct evidence. A source-site URL must never be substituted for a publisher article URL.
- Missing-thumbnail diagnostics may classify only explicit persisted evidence: Google News wrapper host with no verified publisher URL; absent publisher article URL; stored metadata status/error code; explicit image candidate; or metadata not attempted/unrecorded. Unknown cases remain unclassified.
- Summaries must not decode wrappers, fetch new URLs, retry failures, store response bodies, or infer that an absent metadata field proves a publisher has no image.
- HTTP 403 means the server refused the request; do not repeat an unchanged request. HTTP 429 indicates rate limiting; do not blindly retry. Respect server policy and any explicit Retry-After rather than bypassing it. References: MDN 403 https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403 and MDN 429 https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429.
- Open Graph `og:image` and Schema.org `thumbnailUrl` are optional publisher-supplied metadata signals, not guarantees that every page provides a usable image: https://ogp.me/ and https://schema.org/thumbnailUrl.
- Preserve all 273 legacy shared-image assignments. Never auto-label, bulk-copy review decisions, or delete/replace legacy assignments.

 
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

 
## 2026-11-27 — Video and photo collection coverage
- Official NMIXX Atom feed is the current no-key automated video source. A feed response is a recent window, not a complete channel history. Display the number stored, fetched on the latest run and newly added separately; never label archive count as total channel uploads.
- Keep unresolved Google News YouTube-title candidates separate from verified YouTube videos unless an explicit YouTube watch/shorts/embed URL is present in allowed metadata. Do not decode Google News wrappers.
- Optional YouTube Data API playlist pagination is not automatically enabled. Official docs: `playlistItems.list` returns pages up to 50 items and costs 1 quota unit per call (https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list; https://developers.google.com/youtube/data/determine_quota_cost). API credentials are required.
- Before storing YouTube API data long-term, comply with Developer Policy III.E.4: non-authorized API Data is temporary and must be refreshed or deleted within 30 calendar days; titles, creator names and descriptions are not exempt (https://developers.google.com/youtube/terms/developer-policies/). Do not add API backfill without a tested refresh/deletion lifecycle and explicit decision.
- `data/photos.json` stores original photo-post links/metadata and currently has 0 records. `data/quality-metrics.json` thumbnails are article/video preview images, not a substitute for standalone photo posts.
- The fan-facing article image gallery may display only images tied to explicit publisher article URLs and source provenance; do not display unverified legacy shared images as verified Haewon photos.
- No image binaries are copied/rehosted. Keep official Instagram/JYP site manual-link-only until documented public feed/metadata access is permitted. No login scraping or access-control bypass.

 
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

## 2026-11-27 — Failure-history multi-run invariants
- History identity is the tuple `runId + sourceId + query`; repeated identity is idempotent, but the same query in another run is a distinct event.
- Successful runs append no failure and never delete or rewrite prior failures.
- Record HTTP status, content type and response format only when observed. Record `retryAfter` only when the response actually contains the Retry-After header.
- Keep `retryAttempted:false`; each query is requested once. No blind retry, inferred delay, or synthetic production event.
- Unit tests may use simulated run IDs and responses, but must label them as fixtures and never insert them into production data.

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

- A successful Production run with `queryFailures: []` preserves previous history entries and adds no event.
- The operational multi-failure acceptance test remains incomplete until a distinct real failure appears in a later Production run and both entries survive a subsequent real success.

## 2026-11-27 — YouTube channel identity and Atom-feed policy recheck
- Verified the M2 YouTube channel page as a verified channel with handle `@MnetM2`, exact channel ID `UCTQVIXvcHrR9jYoJ6qaBAow`, and CJ ENM copyright/identity description. Source: https://www.youtube.com/channel/UCTQVIXvcHrR9jYoJ6qaBAow
- Verified the KBS Kpop handle-to-channel mapping: `@kbskpop` resolves to channel ID `UCeLPm9yH_a_QH8n6445G-Ow`; the channel page title is KBS Kpop. KBS first-party pages already establish KBS Kpop as its official music/YouTube channel. Keep this as identity/provenance only, not a collector permission. Sources: https://www.youtube.com/channel/UCeLPm9yH_a_QH8n6445G-Ow and https://world.kbs.co.kr/service/news_view.htm?Seq_Code=189750&lang=e
- Re-read YouTube's official Terms of Service: section "Permissions and Restrictions" says automated access (robots, scrapers) is not allowed except public search engines acting in accordance with robots.txt or prior written permission; use of Content is limited as described and embeds are the allowed presentation path. Source: https://www.youtube.com/t/terms
- Read YouTube's current robots.txt: it explicitly disallows `/feeds/videos.xml` for `User-agent: *`. Source: https://www.youtube.com/robots.txt
- Direct fetches of candidate Atom URLs were blocked by the current verifier; this is not evidence of feed unavailability. However, the published robots exclusion for `/feeds/videos.xml` is affirmative evidence that the Atom path is not permitted for an ordinary automated collector under the public-search-engine exception. Therefore do not poll YouTube Atom feeds for KBS, M2, MBCkpop, or ALL THE K-POP unless written permission or a clearly applicable authorized API basis is established.
- Exact ID status: KBS Kpop `UCeLPm9yH_a_QH8n6445G-Ow`; M2 `UCTQVIXvcHrR9jYoJ6qaBAow`; MBCkpop `UCe52oeb7Xv_KaJsEzcKXJJg`; ALL THE K-POP `UCPde4guD9yFBRzkxk2PatoA`. These are identity facts only; no broadcaster feed is enabled and no video is auto-labeled broadcaster-official.
- SBSKPOP ZOOM first-party ownership and stable channel ID remain unverified. JYP Gallery/Notice remain manual-link-only due unresolved robots/terms/metadata permission.
- No YouTube API activation: the 30-day refresh/deletion lifecycle requirement remains unmet. No code/source registry change, no automated collection, and no video reclassification was made.

- Channel ID verification establishes identity only. It does not authorize automated access.
- YouTube `/feeds/videos.xml` is disallowed by robots.txt for general user agents; do not add Atom polling based on public endpoint existence.


## 10. YouTube automated-access policy — 2026-11-27
- YouTube robots.txt disallows /feeds/videos.xml for User-agent: *; the Terms restrict automated access except public search engines complying with robots.txt or prior written permission.
- Therefore all YouTube Atom polling is disabled, including the previously active NMIXX official channel feed. A channel being official does not override robots or terms.
- Preserve already collected video records and their source attribution; do not delete historical items as part of disabling collection.
- YouTube Data API remains disabled until a compliant 30-day refresh/deletion lifecycle is implemented and reviewed. The Production workflow must not pass the API secret to the collector while disabled.
- Re-enable only after explicit documented authorization, policy review, tests and a human-approved PR.


## Production confirmation — 2026-11-27 #621
- Production #621 is the first post-merge live confirmation of the YouTube Atom disablement: source outcome skipped, 0 items seen, collector output networkRequests: 0, and 20 existing video records retained.
- The append-only query failure history still contains the single confirmed #617 429 event after the #620 and #621 successful runs. No additional real failure occurred in #621; do not create synthetic entries.
- Continue to record actual failures once per run/source/query, Retry-After only when present in the real response headers, and no blind retries.


## Scheduled run #622 confirmation — 2026-11-27
- Production #622 (schedule event) succeeded with nmixx-youtube skipped, zero items, zero Atom network requests, and 20 historical videos retained.
- The run log timestamp is 14:03:36 KST, not the configured 20:17 KST slot. Do not treat it as confirmation of that specific scheduled slot; investigate timing separately.
- Query failure history still has one real #617 429 event. #622 had no query failures. No synthetic events and no blind retries.

## 2026-11-27 — Production schedule diagnostics
- Existing cron entries are `17 11 * * *` and `17 23 * * *` UTC. #614 and #622 are reported as schedule events but their recorded starts do not match either cron instant.
- Do not reinterpret generic event=schedule as proof of a particular local-time slot. Persist `github.event.schedule` in future run logs and compare it with startedAt.
- #622 collection policy remained compliant: NMIXX Atom skipped, zero network requests, 20 historic videos preserved, YouTube Data API disabled-policy.
