# Session Log

Append substantial ChatGPT work sessions here. Preserve history; do not rewrite old entries.

## 2026-11-19 — Persistent continuity and Gemini policy automation design

### User request
User asked that every conversation's plans and decisions be organized and saved to the public Haewon Archive GitHub repository so a new chat can continue without interruption. User also asked ChatGPT to structure its own operating rules, logs and read-at-start/important-milestone documents.

### Confirmed direction
- External scheduler preferred; target every five minutes because user experienced GitHub Actions cron delays.
- Gemini API is the AI tool; user will add the API key directly to GitHub Actions Secrets.
- Gemini reads repository-hosted behavior rules, discovers/collects permitted public content, analyzes/classifies/organizes it, and improves behavior/search/collection rules from evidence and logs.
- Gemini does not modify application code.
- Routine search/classification rules may be automatically improved under strict constraints.
- Security, privacy, credentials, access-control and legal/source-policy rules are protected from autonomous changes.
- ChatGPT is responsible for architecture, prompts, review and continuity.
- Logs and state live in GitHub; new conversations should read project memory first.

### Repository baseline inspected
- Existing workflow: .github/workflows/collect-and-deploy.yml
- Existing schedule: twice daily (17 23 * * * and 17 11 * * * UTC).
- Existing workflow uses official NMIXX YouTube Atom feed; no Gemini integration or external scheduler.
- Existing project status reports no automated photo crawling.
- Recent reviewed data commit: f5807f5c1d0c5b29ec3fba37886f5a6735786b4f, with 17 accumulated video records at that run.
- These are baseline facts, not claims that new automation is implemented.

### Files created in this documentation pass
- PROJECT_MEMORY.md
- CHATGPT_OPERATING_RULES.md
- GEMINI.md
- AUTOMATION_PLAN.md
- DECISIONS.md
- SESSION_LOG.md

### Implementation status
Documentation baseline only. No scheduler, Worker, Gemini API integration, policy updater, new crawler or five-minute workflow was implemented in this session.

### Tests
No application code changed; no application test run was required for this documentation-only change.

### Next steps
1. Verify these files and commit are present on main.
2. Add SECURITY_POLICY.md, COLLECTION_RULES.md, SEARCH_STRATEGY.md, CLASSIFICATION_RULES.md, POLICY_CHANGELOG.md and schemas for sanitized run logs and archive records.
3. Inspect current Google/Gemini documentation and candidate scheduler terms/limits before selection.
4. Design secure external dispatch without exposing a broad GitHub token to cron-job.org.
5. Implement a dry-run-only Gemini workflow and validate output before enabling automated writes.


## 2026-11-19 — Collection governance and schema baseline

### User direction
User agreed to continue with the next planned documentation step: establish protected operating rules, collection policy, search/classification guidance, policy audit history and data/log contracts before implementing Gemini automation.

### Repository inspection
- Re-read PROJECT_MEMORY.md, CHATGPT_OPERATING_RULES.md, DECISIONS.md, SESSION_LOG.md, PROJECT_STATUS.md, ROADMAP.md and README.md.
- Confirmed repository is public and main is the default branch.
- Inspected the current workflow: it still runs on pushes, manual dispatch and twice-daily schedule (UTC 23:17 and 11:17).
- Inspected current source registry: NMIXX Official YouTube Atom feed is the only enabled automated source; JYP official site and NMIXX Instagram are manual-link-only.
- Inspected current data: 17 video records and an empty photos.json at inspection time.
- Inspected photo normalization and current data validator. Existing validator does not enforce the newly documented JSON Schemas.
- Latest observed workflow run before this documentation batch was successful: https://github.com/UForPel/haewon-archive/actions/runs/44413072002. New documentation commits trigger workflow runs; latest result must be checked separately.

### Files added
- SECURITY_POLICY.md — protected security, privacy, access, secrets, copyright and write boundaries.
- COLLECTION_RULES.md — source permission classes, metadata verification, rate handling, deduplication and deterministic write gate.
- SEARCH_STRATEGY.md — initial search vocabulary and quality evaluation; source permissions remain outside mutable scope.
- CLASSIFICATION_RULES.md — separates publisher origin from Haewon relevance and defines evidence/confidence rules.
- POLICY_CHANGELOG.md — append-only audit template and initial baseline entry.
- schemas/archive-record.schema.json — target schema for current video and photo-link record shapes.
- schemas/run-log.schema.json — proposed sanitized machine-run log contract.

### Existing files updated
- GEMINI.md — proposal-only behavior; no direct repository writes; protected files and limited mutable scope clarified.
- PROJECT_MEMORY.md — new governance map, current data/source baseline and mandatory next steps.
- AUTOMATION_PLAN.md — updated governance, policy validation and phase status.
- PROJECT_STATUS.md — records what exists and explicitly states schemas are not yet enforced.
- ROADMAP.md — adds governance and schema-enforcement milestones.
- README.md — links all governance files and states automation/schema limitations.

### Implementation status
- Documentation and target schema files only.
- No app code, workflow, scheduler, gateway, Gemini API integration, crawler or policy updater was implemented.
- No production automation cadence changed.
- JSON Schemas are contracts only until deterministic validators and tests are implemented.

### Validation
- Repository files were created through GitHub and each update returned a commit SHA.
- A separate syntax/read-back check of the JSON schemas and final GitHub state is still required.
- No application test suite was run because application code and runtime validators were not changed.

### Next steps
1. Verify the new files and latest Actions run after the documentation commits.
2. Validate both schema JSON files and compare their contracts against actual existing records.
3. Implement schema enforcement in scripts/validate-data.mjs with tests before Gemini integration.
4. Then verify current Gemini API capabilities/quotas/terms and the external scheduler + secure dispatch design.
