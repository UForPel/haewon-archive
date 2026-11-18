# Project status

Last updated: 2026-11-18

## Current state
- Public repository: https://github.com/UForPel/haewon-archive
- Public GitHub Pages site: https://uforpel.github.io/haewon-archive/
- User confirmed the deployed site opens and works.
- The GitHub Actions deployment run completed successfully:
  https://github.com/UForPel/haewon-archive/actions/runs/44209032164

## Implemented
- Mobile-first static archive page
- Official NMIXX YouTube public Atom feed collector
- Video-ID deduplication and newest-first ordering
- Keyword-based Haewon relevance hint
- Search across video title, description, and channel name
- Quick filters: all, Haewon keyword, recent 7 days
- Start/end publication date filters
- Visible-result count and clearer no-results messaging
- Responsive mobile layout for date controls
- JSON validation, three collector unit tests, and scheduled GitHub Actions collection
- GitHub Pages deployment through Actions

## Current source and coverage limitations
- Automated video source: official NMIXX YouTube public Atom feed only.
- The feed returns up to 15 newest uploads, so it is not a complete historical archive.
- Relevance is a keyword hint based on title/description, not visual or human verification.
- A false relevance result does not mean Haewon is absent from the video.
- Photo automation is not implemented. The site currently provides an official website link and a source-policy note.
- Original photo files are not mirrored or rehosted.

## Latest UI improvement
- Fixed the previous "latest" quick filter, which had no filtering effect.
- Added a rolling seven-day filter and date range controls.
- Search now also checks channel name.
- Updated labels to say "Haewon keyword included" rather than implying verified appearance.

## Next
1. Improve relevance review without scraping or unsupported APIs.
2. Add a simple manual, auditable link-entry workflow for photo posts.
3. Add source/type filters and item detail view.
4. Add source health and per-run collection history.

## Source policy
- Use official public feeds and documented, permitted interfaces.
- Do not bypass login walls, access controls, rate limits, or anti-bot protections.
- Do not copy or rehost copyrighted photos without permission.
