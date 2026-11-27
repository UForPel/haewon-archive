# Source and rights policy

## Allowed automatic source

- NMIXX Official YouTube channel: https://www.youtube.com/@NMIXXOfficial
- Channel ID: UCnUAyD4t2LkvW68YrDh7fDg
- Feed: https://www.youtube.com/feeds/videos.xml?channel_id=UCnUAyD4t2LkvW68YrDh7fDg
- Collection method: fetch the public channel Atom feed; no API key, login, scraping proxy, or hidden endpoint.
- Stored fields: video ID, title, source URL, public thumbnail URL, published date, feed description (when supplied), collection time, keyword flag.

## Manual-link-only sources

Official Instagram and JYP pages are currently listed as navigation/source links only. No automated scraping is performed. TikTok, Instagram, fan communities, and other platforms are not treated as automatically collectable merely because a page is publicly viewable.

## Photos

- Do not mirror, download, or rehost original photographs.
- Store a source URL and attribution only when the original post is public and linking is appropriate.
- A preview URL may be stored only when the provider explicitly makes it available for embedding or preview use.
- Do not bypass login walls, rate limits, robots controls, access controls, or platform restrictions.
- If permission or reuse rights are unclear, keep only a plain source link or do not include the item.

## Scope and reliability

YouTube's channel feed is limited to a small recent window (currently observed as 15 entries). This archive persists items seen during scheduled runs, but it cannot reconstruct videos that disappear from the feed before collection. Search across all YouTube channels, fan-uploaded content, or every Haewon appearance is not part of this MVP.

The relevance flag is a simple text-keyword match, not human verification. Group videos without member names in their title/description may be missed by the Haewon filter.

## Corrections and removal

For a broken link, incorrect attribution, or rights concern, update or remove the affected JSON entry and record the reason in a commit message.

## Research leads only — not approved automatic sources (2026-11-27)

The following broadcaster/production channels are leads for future human review of official NMIXX performance videos. They are **not** enabled in `data/sources.json`, and no automated feed collection is authorized by this list:

- M2 / Mnet digital studio: https://www.youtube.com/@MnetM2
- MBCkpop: https://www.youtube.com/user/MBCkpop
- KBS Kpop: https://www.youtube.com/@kbskpop
- SBSKPOP ZOOM: https://www.youtube.com/@SBSKPOP_ZOOM
- ALL THE K-POP: https://www.youtube.com/@ALLTHEKPOP

Before enabling any source, verify channel ownership from the broadcaster's own site, public Atom/RSS availability, robots/terms, whether the individual video explicitly identifies Haewon, and a sustainable refresh/deletion policy. A search result or fan-archive listing is a discovery lead, not a permission grant. Until that review is complete, these sources remain research-only/manual navigation candidates.

## Official NMIXX photo site

- Gallery: https://nmixx.jype.com/gallery — publicly visible listing, but this review did not establish permission for automated extraction; robots.txt was not retrievable. Keep manual-link-only.
- Notice: https://nmixx.jype.com/notice — public post titles/dates and links are visible, but automated extraction is not approved by this review.
- Do not infer image URLs from hidden page scripts, scrape unverified endpoints, download/rehost originals, or treat public visibility as reuse permission.

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
