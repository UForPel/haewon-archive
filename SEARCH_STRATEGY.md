# Search Strategy — Haewon Archive

Version: 0.2.0
Status: EXPANDED DISCOVERY STRATEGY — source permissions remain separately controlled.

## Objective

Build a broad, useful discovery index for Haewon-related content—not an official-only archive. Find videos, photos, news, interviews, stage/event records, social posts, fan captures, edits, memes and older content rediscovered by fans.

Search breadth and collection permission are separate:
- A source can be valuable for discovery even if automatic extraction is not permitted.
- Search candidates can be saved for manual review or as source links.
- Automatic collection is allowed only through source-specific approved methods in the registry/policy.
- Do not represent this archive as exhaustive.

## Content universe

Explore these content classes; do not prioritize official sources by default.

1. **Performance and video**
   - Music-show fancams, facecams, focus cams, stage videos, festival/concert clips, audience recordings, dance practice, behind-the-scenes, variety clips, short-form clips, edits and compilations.
2. **Photos and visual records**
   - Fan-taken event photos, airport/event photos, fansite galleries, official social photos, magazine/editorial photos, brand pictorials, behind-the-scenes stills and public photo posts.
   - Index source links and attribution. Do not copy or rehost image files without permission.
3. **News and editorial**
   - Entertainment news, interviews, magazine features, press releases, broadcast appearances, brand collaborations, event announcements and recaps.
4. **Social posts**
   - Public posts on Instagram, X, TikTok, YouTube Community, and other relevant platforms, including posts from official accounts, members, broadcasters, media, creators and fan accounts.
   - Public availability does not automatically authorize crawling or extraction.
5. **Fan/community discovery**
   - Fan accounts, community recommendations, discussions that point to original content, memes, clip compilations and rediscovered older posts.
   - Community posts are discovery signals, not authoritative evidence; prefer the original item when accessible.
6. **Schedules and event context**
   - Broadcast schedules, festival lineups, appearances, event pages, and dates that help locate related videos/photos.
7. **Archive and aggregation sites**
   - Existing indexes and databases may help discover older content or canonical links. Check attribution, freshness, duplicates and whether the site is merely copying another source.

## Discovery vocabulary

Combine names, content type, platform, event, song, date and context instead of relying on one exact-name query.

### Names
- Korean: `해원`, `오해원`, `엔믹스 해원`, `엔믹스 오해원`
- English: `Haewon`, `Oh Haewon`, `NMIXX Haewon`, `NMIXX HAEWON`
- Group context: `NMIXX`, `엔믹스`

### Content descriptors
- Video: `직캠`, `fancam`, `focus cam`, `facecam`, `4K`, `stage`, `performance`, `shorts`, `edit`, `clip`, `behind`
- Photo: `사진`, `photo`, `pics`, `preview`, `fansite`, `airport`, `event`, `pictorial`
- News: `뉴스`, `인터뷰`, `기사`, `magazine`, `interview`, `news`, `brand`, `broadcast`
- Social/community: `SNS`, `update`, `viral`, `meme`, `reaction`, `fan edit`, `community`
- Context: event/broadcast name, song title, date, venue/city where public and relevant.

Use query combinations and spelling variants as hypotheses. Avoid overly broad searches that generate high false-positive volume.

## Platform/source mix

Maintain a discovery mix across:
- YouTube: official uploads, broadcasters, event channels, fan/creator uploads.
- Instagram and X: posts, photos, short clips, event coverage and creator posts.
- TikTok: short-form videos and edits.
- Korean and international entertainment media.
- Fan sites and public community posts that link to original material.
- Broadcast/event/brand pages and content aggregators.

Platform access differs. Use official public feeds, documented interfaces, search tools, or permitted manual discovery. Do not use hidden endpoints, proxy scraping, login-only content, access-control workarounds, or automated extraction where prohibited. When automation is not approved or reliable, keep the platform in a manual-link/candidate workflow rather than silently dropping it from the discovery scope.

## Candidate verification and classification

For each candidate, preserve platform/source context and canonical URL. Search snippets can suggest candidates but cannot alone verify appearance, creator identity or publication date.

Origin and relevance are independent:
- Origin: `official`, `fan`, `uncertain`, `unrelated`
- Haewon relevance: `confirmed`, `probable`, `unknown`, `not_relevant`

A fan post can be highly relevant; an official group post can be irrelevant to Haewon. Do not make official status a relevance shortcut.

Positive signals:
- Item metadata explicitly identifies Haewon/OH HAEWON.
- Creator caption/title names her and context is consistent.
- Reliable corroborating source metadata.
- Human confirmation when visual presence is not stated in metadata.

Weak signals:
- Group-only title.
- Ambiguous name.
- Search snippet only.
- Repost with no original attribution.
- Account display name without identity evidence.

## Prioritization

Score discovery efforts by useful verified results, not raw search hits. For each platform/query family, observe:
- candidates found
- verified relevant items
- false positives and uncertain items
- unique items after deduplication
- age/freshness and date coverage
- source/link durability
- access failures or policy skips
- effort and maintenance cost

Prefer high-yield, diverse sources. Do not let a single platform dominate simply because it is easiest to collect. Periodically sample under-covered classes (fan videos, photos, news, social, older content) and compare discovery yield.

## Evaluation and controlled learning

Track precision and coverage separately. A source/query that finds many candidates but few verified items is not necessarily valuable. Keep a fixed human-reviewed sample to evaluate changes and record false positives and missed items.

Gemini may propose changes only to query vocabulary, combinations, and priority ordering. Proposals require sanitized run evidence, expected impact, rollback notes and fixed-sample evaluation. Source permissions, security boundaries and protected rules cannot be changed by search optimization.


## Expanded combination presets and cross-pipeline preservation (2026-11-21)

Search presets now combine Korean/English names with content type: fancam/직캠, focus cam, 4K, stage, shorts, interview, variety, behind. These presets open YouTube directly and do not depend on the official channel Atom feed's latest-item limit.

Editorial RSS searches remain focused on news, interviews, magazine, broadcast and brand topics. If an RSS candidate is a direct YouTube URL, the video sync pipeline also converts it to a canonical video record and deduplicates by video ID; it remains in discovery candidates as well. Thus discovery classification must not destructively filter or drop cross-category items.


## Daily bounded recursive-improvement cycle (algorithm v1.1.0)

The scheduled GitHub Actions workflow runs a deterministic, bounded improvement cycle after collection. The cycle rotates three editorial RSS query packs by Korea Standard Time date, records the active pack and observed candidate yield, and keeps candidate records non-destructive.

The imitation loop is deliberately evidence-gated:
1. Observe public collection outputs and query-level candidate counts.
2. Evaluate yield and coverage proxies; do not call them precision.
3. Select a date-rotated query pack for exploration.
4. Record the cycle report in `data/improvement-cycle.json`.
5. Run tests and schema/data validation before deployment.

Automatic query promotion is disabled until human-reviewed relevance labels, false-positive labels and a stable evaluation sample exist. The algorithm cannot alter source permissions, privacy rules, attribution, deduplication or candidate-retention safeguards. It imitates a recursive improvement workflow; it does not modify its own source code or claim model self-training.

Google News RSS wrapper links whose titles indicate YouTube/fancam are conditionally resolved through ordinary public HTTP redirects. Only final URLs that resolve to a recognized YouTube video ID enter the video archive; the original discovery candidate remains preserved.


## Evidence-based daily cycle v1.2.0 (2026-11-21)

- Collection writes `data/news-collection-status.json` with current-run per-query fetched and unique candidate counts, separate from cumulative archive size.
- `data/relevance-reviews.json` stores explicit human labels: URL, query, relevant boolean, reviewedAt. Empty by default; no synthetic labels are generated.
- The cycle reports precision only from explicit review labels. It marks the sample exploratory until at least 20 reviewed records exist; this is a minimum reporting gate, not proof of statistical significance.
- Automatic query promotion remains disabled. Query volume is not treated as relevance or precision.
- The workflow resets to latest main and regenerates collected data before each push attempt rather than rebasing stale generated JSON snapshots.

## 2026-11-25 — Video wrapper preservation and freshness baseline

- Main discovery dataset measured 704 records; newest observed publication timestamp was `2026-11-19T09:21:00Z` on 2026-11-25. Report publication-age lag as a first-class freshness metric.
- Heuristic audit identified 186 title/URL-hinted unresolved video candidates (185 Google News wrappers, 1 publisher result). This count is not a verified video count.
- Wrapper-only fancam results must remain visible as unresolved discovery candidates. Only explicit HTTPS YouTube watch/shorts/embed or youtu.be video URLs may be converted to video records. Never decode opaque Google News tokens or infer IDs.
- YouTube Data API `search.list` is a documented discovery option for fan channels, but current official quota documentation lists 100 calls/day by default and 1 unit/call. If implemented, rotate a small query pack, preserve channel ID/name and publishedAt, deduplicate by video ID, and make the API key optional/user-managed.
- Keep Google/Bing RSS editorial search and YouTube video search as distinct collectors with distinct source provenance and quotas.

## 2026-11-25 — Twice-daily query rotation

- Previous behavior: three packs of four queries, selected by date only; both scheduled runs on a given Korea date repeated the same pack.
- PR #22: six packs of six phrases, selected by Korea date and a morning/evening run slot. This gives 36 unique editorial phrases and 12 distinct phrases per day.
- Expected feed requests: 24/day (six queries × Google News and Bing × two runs), compared with 16/day previously. This is a +50% request budget; do not infer a +50% gain in unique coverage.
- Evaluate per-query unique candidates, newest publication timestamp, age lag, duplicate collapse, publisher diversity and human-reviewed relevance after collection runs. Keep video/fancam query budget separate.

## 2026-11-25 — Cross-channel public YouTube discovery

- PR #23 adds 12 Korean/English query phrases, four per run, rotating by Korea-time morning/evening slot. The two current daily Actions runs make eight documented YouTube `search.list` calls/day.
- The official default quota is 100 `search.list` calls/day at one quota unit per call. Do not add pagination or increase query count without measuring the incremental yield and budget.
- Save channel ID and channel title from the API. Only the known official channel ID is automatically marked official; other results remain unverified pending human origin review.
- This collector requires optional `YOUTUBE_API_KEY` and has not made a live API request. No secret means no change to the existing official Atom collector.
- Keep editorial RSS and YouTube video search separate; keep photos as a distinct source-link/attribution pipeline.

## 2026-11-25 query-rotation and quality measurement
- PR #22 defines six editorial packs with six queries each (36 distinct phrases). One pack runs in each KST morning/evening slot, yielding 12 distinct query phrases/day and 24 bounded RSS requests/day (Google News + Bing per phrase).
- This is a 50% request-budget increase from 16 to 24 requests/day, not a proven 50% increase in relevant coverage.
- Measure unique article IDs and normalized titles/day, duplicate rate, direct Haewon relevance yield, publisher/source diversity, and median/p90 publication-age lag. Compare before/after over equivalent weekdays and query slots.
- Keep video/fancam searches separate from editorial RSS. Google News wrapper URLs are unresolved candidates only; do not decode or promote them to verified videos.
- PR #20 chronological mode defaults to valid publication date descending, then discoveredAt fallback; relevance sort remains an explicit alternative. Invalid publication dates now fall back to a valid discovery timestamp.
