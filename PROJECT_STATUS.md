# Project status

Last updated: 2026-11-18

## Completed

- Public repository initialized: https://github.com/UForPel/haewon-archive
- Mobile-first static archive page and video card rendering
- YouTube public Atom feed collector for NMIXX Official
- Video-ID deduplication and newest-first ordering
- Keyword flag for 해원 / 오해원 / HAEWON
- JSON data validation and three unit tests
- Twice-daily GitHub Actions schedule (08:17 and 20:17 Asia/Seoul, represented in UTC cron)
- First live collection succeeded: 15 feed entries fetched and 15 inserted
- Collected metadata committed by GitHub Actions
- Project documentation and source policy

## First run evidence

- Workflow run: https://github.com/UForPel/haewon-archive/actions/runs/44203537362
- Code commit: 03a0c7ccf69c0050e78df94e33b70cb306a6fd9c
- Data commit: da18e31a08d248662d7d4c4149a8a57b00e3c6e0
- Unit tests: 3 passed, 0 failed
- Live feed: 15 fetched, 15 new, 15 total
- Data validation: passed

## Pages deployment blocker

- Workflow run 1 failed only at Pages setup after collection, tests, validation, and data commit had succeeded.
- Workflow run 2 retried with Pages enablement, but GitHub returned "Resource not accessible by integration" when the connected automation attempted to create the Pages site.
- Required one-time owner action: repository Settings → Pages → Build and deployment → Source = GitHub Actions. Then rerun the workflow.
- Do not report the public site as deployed until a successful Pages deployment run is visible.

## Not implemented yet

- Photos automation (source links only, subject to permission and supported feeds)
- Search across YouTube beyond the official channel feed
- Reliable detection of every video in which Haewon appears
- Manual photo/link management UI
- Confirmed successful Pages deployment

## Known limitations

- Feed contains only the newest 15 uploads at the time of each run.
- A keyword match is only a rough relevance hint.
- RSS descriptions are often empty for Shorts.
- GitHub Actions schedules can start later than the exact scheduled minute.
