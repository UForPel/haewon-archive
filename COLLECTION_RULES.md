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
