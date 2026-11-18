# Search Strategy — Haewon Archive

Version: 0.1.0
Status: INITIAL BASELINE — operational learnings may be proposed by Gemini under the workflow's future allowlist.

## Objective

Discover attributable Haewon-related public content without claiming exhaustive coverage. Search quality is measured by verified relevance, source quality, freshness, deduplication and coverage—not by the number of raw hits.

## Current source baseline

1. **NMIXX Official YouTube Atom feed**
   - Source ID: `nmixx-youtube`
   - Feed: `https://www.youtube.com/feeds/videos.xml?channel_id=UCnUAyD4t2LkvW68YrDh7fDg`
   - Permission: approved public feed.
   - Current collector reads the feed's newest 15 entries per fetch and accumulates seen records.
   - This is not a general YouTube search and does not discover fan uploads across YouTube.

2. **JYP / NMIXX official website**
   - Source ID: `jyp-official`
   - Permission: manual-link-only. No automated crawling.

3. **NMIXX Official Instagram**
   - Source ID: `nmixx-instagram`
   - Permission: manual-link-only. No automated crawling.

The source registry and [COLLECTION_RULES.md](COLLECTION_RULES.md) override any search suggestion in this file.

## Baseline search terms

Use these as query vocabulary only where the relevant platform/search interface is permitted:
- Korean: `해원`, `오해원`, `엔믹스 해원`
- English/romanized: `HAEWON`, `OH HAEWON`, `NMIXX HAEWON`
- Common fan-content descriptors: `직캠`, `fancam`, `focus`, `4K`, `edit`, `shorts`

Terms are discovery hints, not proof of appearance. Avoid treating unrelated uses of "Haewon" as relevant without corroboration.

## Search expansion rules

- Expand query combinations only when the source permits automated search.
- Prioritize exact member name + group name, then common spelling variants.
- Keep source/platform context attached to every candidate.
- Search result snippets may create candidates but cannot alone verify member appearance, creator identity or publication date.
- Do not assume Gemini has Google Search grounding, YouTube search, browser access or unrestricted crawling. The implemented integration must explicitly provide and test each capability.
- Do not use undocumented endpoints, scraping proxies or access-control workarounds.

## Candidate quality signals

Positive signals:
- Exact member name in title, tags or description.
- Official account or a creator clearly identifying the subject.
- Canonical page with stable ID and publication metadata.
- Independent corroborating metadata from a permitted source.

Weak/negative signals:
- Group name only, with no member-specific evidence.
- Ambiguous romanized name.
- Reposted content without original source attribution.
- Search snippets without an accessible canonical page.
- Duplicate URLs or content IDs.

## Evaluation

Track per source/query:
- Candidates discovered.
- Records accepted after verification.
- Rejected and uncertain counts.
- Duplicate count.
- Missing/invalid metadata count.
- Source failures and access-policy skips.
- False-positive corrections and missed-content reports, when available.

Do not optimize raw candidate count. A query producing many unrelated results should be deprioritized even if its volume is high.

## Controlled learnings

Gemini may propose changes only to query vocabulary, query combinations and priority ordering. Every proposed change must cite sanitized run evidence, include expected impact and a rollback note, and be tested against a fixed evaluation sample before promotion. No change is allowed to source permissions or security boundaries.
