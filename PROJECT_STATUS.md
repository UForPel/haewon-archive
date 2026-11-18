# Project status

Last updated: 2026-11-18

## Current state
- Public repository: https://github.com/UForPel/haewon-archive
- Public GitHub Pages site: https://uforpel.github.io/haewon-archive/
- User confirmed the deployed site opens and works.
- Latest confirmed full deployment before this photo-link feature: https://github.com/UForPel/haewon-archive/actions/runs/44209391536
- Photo-link feature commits are now on main; its post-change workflow must complete successfully before claiming a new deployment.

## Implemented
- Mobile-first static archive page
- Official NMIXX YouTube public Atom feed collector
- Video-ID deduplication and newest-first ordering
- Keyword-based Haewon relevance hint
- Search across video title, description, and channel name
- Quick filters: all, Haewon keyword, recent 7 days
- Start/end publication date filters
- Visible-result count and responsive mobile layout
- Scheduled GitHub Actions collection and Pages deployment
- Photo source-link registration form
- Browser-local draft storage for photo links
- JSON import/export for photo metadata
- Photo link list with source, publication date, notes, original link, and storage origin
- HTTPS-only URL validation, duplicate URL checks, strict calendar-date checks, and field-length validation
- JSON validation integrated into the project validation script
- Unit tests for photo link validation and merging

## Photo link workflow and limitations
- Photo entries contain metadata and original post URLs only; original image binaries are not copied.
- New form entries are stored only in the current browser's local storage.
- To publish entries for all visitors, export JSON and replace data/photos.json in the GitHub repository, then commit.
- Importing a JSON file adds entries as local drafts unless they already exist in the repository data.
- This static GitHub Pages architecture does not provide shared writes or cross-device synchronization by itself.
- Instagram/TikTok login walls, anti-bot measures, and access restrictions are not bypassed.
- No automated photo crawling is implemented.

## Video source and coverage limitations
- Automated video source: official NMIXX YouTube public Atom feed only.
- The feed returns up to 15 newest uploads, so it is not a complete historical archive.
- Relevance is a keyword hint based on title/description, not visual or human verification.
- A false relevance result does not mean Haewon is absent from the video.

## Next
1. Improve member relevance review without scraping or unsupported APIs.
2. Add source/type filters and an item detail view.
3. Add source health and per-run collection history.
4. Add a simpler guided process for publishing photo-link JSON.

## Source policy
- Use official public feeds and documented, permitted interfaces.
- Do not bypass login walls, access controls, rate limits, or anti-bot protections.
- Do not copy or rehost copyrighted photos without permission.
