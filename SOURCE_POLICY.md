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

## 2026-11-25 — Fan-video and photo discovery clarification

- Official channel Atom feed is not a complete video archive and must not be treated as the only target source.
- Fan/creator/broadcaster videos are in-scope discovery categories. Record creator/channel identity only when the source page/feed explicitly provides it; preserve the original public URL and publication date.
- Google News wrapper-only video candidates may be shown as unresolved links, but they are not verified YouTube videos. Do not decode opaque wrapper tokens, infer IDs, follow redirects for access workarounds, or auto-promote them to `videos.json`.
- A separate optional YouTube Data API collector may be evaluated for broad channel/video search. It must use documented API endpoints, explicit quota budgets, and a user-managed secret. API quota and rate limits must be measured; no API key is created or requested by the assistant.
- Photo discovery means indexing public source posts and attribution, not copying or rehosting original photographs. Keep Instagram/X/TikTok/fansite content as links unless the platform explicitly provides permitted preview metadata or an authorized API. Public visibility alone is not blanket permission to scrape.

## 2026-11-25 — Public API boundaries for video and photo discovery

- PR #23 proposes YouTube Data API `search.list` for cross-channel public video discovery. The API result's channel ID/name are preserved. Only the known official channel is labeled official; other channels remain unverified until reviewed. The collector uses a user-managed optional secret and a small daily quota budget.
- Do not infer fan status from a non-official channel, and do not add videos from wrapper URLs without an explicit canonical YouTube video ID.
- X API reads are paid per returned post; do not use it as a required source under the free-first policy.
- Meta Content Library is a research-oriented secure environment, not a general public consumer API; its current public-data geographic scope excludes South Korea.
- Photo collection remains source-link/attribution only unless a provider explicitly permits preview/embedding or an authorized API is available. No rehosting, login-wall scraping or hidden endpoint use.
