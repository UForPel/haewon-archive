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
