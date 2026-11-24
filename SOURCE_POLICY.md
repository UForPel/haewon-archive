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


## 2026-11-24 — explicit article URL sources
- Google News RSS `source@url` is a publisher/site-level URL, not an article permalink. Its `item/link` is commonly a Google News wrapper; opaque wrapper IDs are not decoded or resolved by this project.
- Publisher-owned RSS/Atom is the preferred source when its item `link` or an explicitly permalink-marked GUID contains a public HTTPS article URL. Preserve the feed URL and publisher/site URL separately.
- Bing News public RSS is a best-effort discovery surface, not a documented/versioned API. The collector accepts an article URL only when the Bing `news/apiclick.aspx` result explicitly exposes an HTTPS destination in its ordinary `url` query parameter. It does not follow the tracking URL or infer a URL from title/source text.
- Bing candidate records retain the original discovery URL, publisherArticleUrl, publisherHost, feed provenance and candidate source. Treat this as a direct URL explicitly present in public RSS metadata, not as a verified final HTTP redirect host.
- Official public search result pages can be used manually as evidence only when the result itself exposes a complete HTTPS article href. Search snippets, publisher homepages and redirect-only links do not qualify.
- Free-route comparison: publisher RSS/Atom (best provenance and direct item links where available); Bing News RSS explicit destination parameter (broader coverage but undocumented and smaller result set); Google News RSS (broad discovery but wrapper-only under the current observed feed shape); manual official search result inspection (direct href when visible, but not a reliable unattended feed).
