# Project status

Last updated: 2026-11-20

## Governance documentation update (2026-11-19)
- Added protected `SECURITY_POLICY.md` and `COLLECTION_RULES.md`.
- Added initial `SEARCH_STRATEGY.md` and `CLASSIFICATION_RULES.md`, with tightly limited future mutable sections.
- Added `POLICY_CHANGELOG.md`.
- Added `schemas/archive-record.schema.json` and `schemas/run-log.schema.json` as contracts.
- Updated `GEMINI.md`, `PROJECT_MEMORY.md` and `AUTOMATION_PLAN.md` to enforce proposal-only Gemini behavior and trusted-workflow validation.
- `scripts/validate-data.mjs` now enforces `archive-record.schema.json` for every video and photo-link record. `run-log.schema.json` is now enforced for generated logs. The collector workflow emits a log on successful runs; failure-path logging remains incomplete.

## Schema validation implementation (2026-11-19)\n- Added `scripts/json-schema.mjs`, a dependency-free validator for the JSON Schema subset used by this repository (local `$ref`, `oneOf`, types, required/properties, additionalProperties, lengths, patterns, formats, enums/constants and array limits).\n- Added `tests/json-schema.test.mjs` for valid video/photo records and invalid types, URLs, dates, extra fields and incomplete objects.\n- Existing `validatePhotoEntries` checks remain in place, with schema validation layered on top.\n- Existing video IDs are also checked for duplicates.\n- Runtime test and Actions result must be confirmed from the latest run before marking this as tested.\n\n## Automation status — NOT IMPLEMENTED
- No external scheduler, trigger gateway, Gemini API integration, five-minute workflow, automated fan-video collector, automated photo crawler or policy updater exists.
- Existing scheduled workflow remains twice daily (UTC 23:17 and 11:17).
- Gemini must not modify app code, workflows, tests, schemas, validators, protected security/source policies or secrets.
- The current official YouTube Atom-feed collector is still the only automated collection source.

## Current inspected data and source state
- `data/videos.json`: 17 accumulated video records at inspection time.
- `data/photos.json`: empty array at inspection time.
- `data/sources.json`: NMIXX official YouTube public feed is enabled for automated collection; JYP official website and NMIXX Instagram are manual-link-only.
- Official YouTube feed returns up to 15 newest entries per fetch; it is not general fan-video search.

## Existing application implementation
- Mobile-first static archive UI
- Official NMIXX YouTube public Atom feed collector
- Video-ID deduplication and newest-first ordering
- Keyword-based Haewon relevance hint
- Unified search across video and photo-link metadata
- Type/source/date filters and expandable detail panels
- Photo source-link registration form with browser-local drafts
- JSON import/export for photo metadata
- HTTPS URL validation, duplicate URL checks, strict date checks and field-length validation
- GitHub Actions tests, collection, validation, data commit and Pages deployment

## Existing limitations
- Photo entries contain metadata and original post URLs only; original image binaries are not copied.
- Browser-local photo drafts are not shared across devices/visitors.
- No automated photo crawling exists.
- Automated video source is the official NMIXX YouTube public Atom feed only.
- Relevance is a keyword hint, not visual or human verification.
- The feed's 15-entry window cannot reconstruct content that disappears before collection.

## Verification notes
- A prior documentation push workflow run was observed successful: https://github.com/UForPel/haewon-archive/actions/runs/44413072002
- A later bot commit refreshed collection status only; this does not establish that the new governance documents or schemas are enforced at runtime.
- Re-check the latest Actions run after this documentation update. Do not assume the public UI is visually verified by a documentation-only commit.

## Next
1. Add validation for the future run-log schema when machine run logging is implemented.
2. Add a dry-run-only collection/run-log contract before integrating Gemini.
3. Verify Gemini API capabilities, current quotas and data terms from Google documentation.
4. Verify external scheduler and secure dispatch design before selecting or enabling it.


## Verified operational improvements (2026-11-20)
- Run #95 succeeded: tests, collection, archive validation, run-log generation/validation, commit and Pages deployment.
- Run #96 succeeded after changing workflow concurrency to `cancel-in-progress: false`; active runs are no longer cancelled by newer runs in the same concurrency group. Queue behavior still needs observation under repeated triggers.
- Latest collector observed 15 valid feed items, 0 additions, 17 total records. This is a successful no-new-item run, not a content-growth milestone.
- Operational run-log counts still need refinement; duplicate/rejected semantics and failure-path logging remain open.


## Discovery deduplication and category refinement — 2026-11-23
- Confirmed CI #292 and #293 success; #291/#288 failures were classifier regressions and their follow-up correction passed.
- Inspected the live discovery dataset (381 records): found 4 exact normalized-title duplicate groups (8 records) among the sampled full dataset scan. This is a conservative exact-title grouping signal, not fuzzy semantic deduplication.
- Added `groupDiscoveryDuplicates()`: normalize punctuation/case, merge only sufficiently long exact normalized titles, keep short/generic headlines separate, select a representative by relevance then recency, and expose duplicate/source counts.
- Category quality: prefer title matches before cleaned RSS description fallback to reduce publisher boilerplate overriding the article title.
- UI integration and regression tests are being committed separately. CI is required before declaring this fully verified.
- CI #294 failed during Pages deployment because the deploy step reported zero artifacts after upload had succeeded; logs show an artifact API/deployment lookup issue, not unit-test failure. #295 succeeded after syntax correction.
- Commits: `f3b5b791` (initial classifier/dedupe implementation, subsequently syntax-corrected in `c47041a6`); test/UI commits pending CI.


### Verification update — 2026-11-23
- Dedupe test commit: `3c5ad0ca`; UI grouping commit: `76b48d2c`.
- CI #297 on UI commit succeeded: unit tests, data collection/validation, artifact upload and Pages deployment all completed successfully.
- CI #296 on test-only commit had unit tests pass but Pages deployment failed after upload with the same transient artifact lookup error; #297 subsequently completed full success.
- Dedupe groups are now wired into article candidate rendering; count reflects grouped entries and cards indicate duplicate record/source counts. Exact normalized title grouping only; no fuzzy matching.
