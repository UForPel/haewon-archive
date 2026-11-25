# Automation Plan — External Scheduler + Gemini

Status: DESIGN ONLY. No external scheduler, Gemini API integration, Worker or five-minute workflow is implemented.

## Agreed target
- External scheduler preferred because the user observed GitHub Actions scheduled runs being delayed.
- Target cadence: every 5 minutes, subject to scheduler, GitHub dispatch queue, provider limits and run duration.
- Gemini API is the AI tool; the user will add the key directly to GitHub Actions Secrets.
- Gemini reads repository guidance, assists permitted discovery/analysis/metadata organization and proposes improvements to designated search/classification guidance.
- Gemini does not improve or rewrite application code and does not directly write repository files.
- GitHub stores archive data, policy files, sanitized logs and version history.
- ChatGPT maintains architecture, prompts, review and continuity documentation.

## Proposed execution flow
1. External scheduler triggers a narrowly scoped endpoint.
2. A small trigger gateway (for example, Cloudflare Worker) validates a shared secret and dispatches the intended GitHub workflow. This is proposed, not selected or deployed.
3. GitHub Actions checks overlap, idempotency, cooldown and run budget.
4. A controlled job reads the protected collection rules, source registry, schemas and mutable search/classification guidance.
5. A controlled job invokes the selected Gemini API model using a key stored in Actions Secrets.
6. Gemini returns structured candidate records and optional policy proposals. It cannot write files or execute commands.
7. Deterministic validators enforce schemas, URL/domain allowlists, identifiers, timestamps, sizes, record counts, duplicate checks and allowed paths.
8. Valid archive records may be written only to explicitly approved data paths.
9. Policy proposals are tested against a fixed evaluation sample. The trusted workflow may promote at most one small change to `SEARCH_STRATEGY.md` or designated heuristic sections of `CLASSIFICATION_RULES.md`.
10. Protected files, code, workflows, schemas and validators remain unwritable by Gemini.
11. Sanitized run and policy-change summaries are recorded. Tests/validation must pass before data publication or deployment.

## Technical realities
- A five-minute trigger does not guarantee a five-minute completed run. Scheduler delivery, gateway, GitHub dispatch queue, concurrency, model latency and rate limits all matter.
- External dispatch may improve trigger control but still uses Actions execution capacity.
- Scheduler must not hold a broad personal access token. Prefer a narrow gateway and least-privilege GitHub App or fine-grained credential. Verify exact design before implementation.
- Public repository exposes code, workflows, policies and committed logs. Secrets are not public when correctly stored, but untrusted workflow modifications can exfiltrate them. Restrict write access and protect workflow files.
- Gemini capabilities, model name, grounding/search, quotas, pricing and data-use terms must be checked against current Google documentation. Do not assume unlimited free use or exhaustive search.
- Respect robots.txt, terms, rate limits and access controls. No scraping bypasses.

## Governance and write boundaries
- Protected: `SECURITY_POLICY.md`, `COLLECTION_RULES.md`, `SOURCE_POLICY.md`, schemas, validators, source registry permissions, workflows, source code, tests, package manifests, deployment settings, secrets and repository permissions.
- Mutable by controlled workflow only: search vocabulary, query combinations, priority ordering and non-security classification heuristics in explicitly designated sections.
- Gemini returns proposals only; it has no GitHub write token and no direct commit capability.
- Workflow enforces a path allowlist, maximum diff/size, one policy change per run, evidence requirement, fixed-sample evaluation and rollback record.
- No policy change may expand source permissions or weaken security/copyright/privacy boundaries.
- Logs must be sanitized and must not contain full prompts/responses, tokens, cookies, private data or unnecessary raw page content.

## Phases
### Phase 0 — Governance baseline
- [x] Record project intent and current known state.
- [x] Define ChatGPT/Gemini responsibilities and boundaries.
- [x] Add protected security and collection policies.
- [x] Add initial search and classification rules.
- [x] Add policy changelog and target schemas for archive records and sanitized run logs.
- [x] Enforce the archive-record schema in the existing validator and add tests.\n- [ ] Enforce the run-log schema when run logging is implemented.

### Phase 1 — Provider and trigger validation
- [ ] Verify cron-job.org free limits, reliability and request features.
- [ ] Choose and verify secure dispatch gateway/authentication.
- [ ] Verify Gemini model, grounding/search, current API limits, costs and data terms.
- [ ] Add dry-run workflow; no production commits yet.

### Phase 2 — Gemini collection pipeline
- [ ] Implement Gemini client and structured-output validation.
- [ ] Implement permitted source discovery and URL verification.
- [ ] Add idempotent merge, deduplication and sanitized run logging.
- [ ] Test fixtures and limited manual run.

### Phase 3 — Policy learning
- [ ] Add constrained policy proposal/update.
- [ ] Enforce allowed paths, diff limits, evaluation sample and one change per run.
- [ ] Replay historical samples before activation.

### Phase 4 — Scheduler and rollout
- [ ] Connect external scheduler after secure dispatch is tested.
- [ ] Start dry-run/low frequency, then consider five-minute target cadence.
- [ ] Monitor delays, failures, API usage, false positives and quality.

### Phase 5 — Operations
- [ ] Document recovery, rollback, secret rotation, pause switch and manual dispatch.
- [ ] Maintain per-run machine logs and per-session ChatGPT handoffs.

## Current blockers
- User has not yet added Gemini API key to Actions Secrets.
- External scheduler account/configuration is not connected.
- No secure trigger gateway is deployed.
- Gemini integration and constrained policy updater do not exist.
- No automated fan-video or photo collector has been implemented.
- The archive-record schema is enforced for video and photo records. The run-log schema remains a future contract until machine logging is implemented.

## 2026-11-25 — Updated free-first scheduler/Gemini feasibility

### Evidence checked
- Cloudflare Workers Cron Triggers support minute-level cron expressions such as `*/5 * * * *`; executions use UTC. Current Free plan docs list 100,000 requests/day, 10 ms CPU/request and 5 Cron Triggers/account.
- This makes a single Worker a candidate to combine external scheduling and a narrow authenticated dispatch gateway, rather than requiring cron-job.org plus a separate gateway. This has not been deployed or tested against the repository.
- Gemini API free tier is not unlimited: only selected models and rate limits are available, and Google's current pricing documentation says free-tier content may be used to improve products. Grounding availability/quotas differ by model and paid/free tier; do not assume free Search grounding for newer models.
- YouTube Data API `search.list` currently documents 100 default calls/day and 1 quota unit/call. A five-minute schedule would produce 288 trigger attempts/day, so the API must use a bounded rotating search budget, not one search call per trigger.

### Revised proposal
1. Start with a Cloudflare Worker dry-run Cron Trigger at a conservative interval (e.g. 30 minutes) and a manual authenticated test endpoint.
2. Use a GitHub App installed only on this repository with only the minimum workflow-dispatch permission; mint short-lived installation tokens inside the Worker. Avoid a broad personal access token. Store private key and shared dispatch secret as Worker secrets; never commit them.
3. Dispatch a dedicated GitHub Actions dry-run workflow that has concurrency, idempotency, cooldown, execution budget and a manual pause switch.
4. Add Gemini only after the dry-run trigger is reliable. The model returns schema-limited candidate analysis and search-policy proposals; deterministic code validates all fields. Gemini receives public/sanitized candidate metadata only and cannot write repository files or modify code/workflows/security policies.
5. For YouTube search, evaluate an optional user-managed YouTube Data API key and daily quota budget separately from Gemini. Never make it mandatory for archive browsing or official Atom feed collection.
6. Measure trigger delivery delay, workflow queue delay, completion latency, duplicate dispatches, failed invocations, API calls, quota consumption and new verified candidate yield before increasing cadence.
7. Only consider a 5-minute target after at least several days of dry-run evidence. A 5-minute trigger does not guarantee a completed 5-minute collection cycle.

### Current blockers
- No Cloudflare Worker or Cron Trigger deployed.
- No GitHub App or narrow dispatch token configured.
- No Gemini API key configured in Actions Secrets.
- No YouTube Data API key configured.
- No dry-run workflow on main. PR #15's read-only CI is also still unmerged.

## 2026-11-25 — Scheduler, Gemini and platform API constraints

### Cloudflare candidate
- Official Cron Triggers support minute-level cron expressions including `*/5 * * * *`; triggers run in UTC. Free-plan limits currently list 100,000 requests/day, 10 ms CPU per invocation, and 5 Cron Triggers/account.
- A single Worker can combine the scheduled handler and narrow GitHub dispatch gateway. It should mint short-lived repository-scoped GitHub App installation tokens, use no broad PAT, and dispatch a dry-run workflow with overlap/idempotency/cooldown/pause controls.
- 288 five-minute trigger invocations/day fit under the published request count, but do not imply 288 completed Actions runs; GitHub queueing, concurrency and runtime remain bottlenecks. Start at 30-minute dry-run and measure first.
- Sources: https://developers.cloudflare.com/workers/configuration/cron-triggers/ ; https://developers.cloudflare.com/workers/platform/limits/

### Gemini free-tier constraints
- Gemini API free tier is limited to selected models and rate limits; free-tier content may be used to improve Google products.
- Current pricing docs list Google Search grounding at 500 RPD shared across Gemini 2.5 Flash and Flash-Lite on the free tier, but not available for Gemini 3 and newer free tier. Search grounding is a separate tool with model-specific quotas; don't assume unlimited or universal free grounding.
- Preferred role: optional classification/analysis of sanitized public metadata and bounded search-policy proposals. Keep source discovery independent and preserve human review; never send private data or let Gemini write code/workflows/security policies.
- Source: https://ai.google.dev/gemini-api/docs/pricing

### Video/photo API boundaries
- YouTube Data API `search.list`: default 100 calls/day, 1 quota unit/call. PR #23 uses 8/day, requires optional user-managed `YOUTUBE_API_KEY`, and has not made a live call.
- X API reads are pay-per-use; official pricing lists Posts: Read at $0.005 per returned post. It is not a free photo-search source.
- Meta Content Library/API is research-oriented and requires its Secure Research Environment; current public-data scope excludes South Korea. Not a general free Instagram photo API.
- Sources: https://developers.google.com/youtube/data/determine_quota_cost ; https://docs.x.com/x-api/getting-started/pricing ; https://developers.facebook.com/documentation/meta-content-library/

### Status
- No Worker, GitHub App, external scheduler, Gemini integration, API key, or five-minute trigger is deployed.
- PR #23's YouTube collector is optional and skipped until the user adds its secret. No API key is requested in chat.

## Cloudflare Cron + GitHub App dry-run proposal (PR #24, 2026-11-25)
- A dedicated Cloudflare Worker runs only on Cron (UTC 11:17 and 23:17), creates a short-lived GitHub App JWT, exchanges it for an installation token scoped to repository haewon-archive and Actions: write, then dispatches .github/workflows/cloudflare-dispatch-dry-run.yml.
- The target workflow accepts only mode=dry-run and checks timestamp/cron metadata. It performs no collection, data writes, source changes, or Pages deployment.
- Worker has no HTTP handler and workers_dev=false. It is not deployed and cannot dispatch until the owner creates/installs the GitHub App and configures Worker secrets.
- Required Cloudflare secrets: GITHUB_APP_ID, GITHUB_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY. GitHub App should be installed only on UForPel/haewon-archive and granted only Actions: write. The minted installation token is narrowed again to that repository and permission.
- This avoids a broad PAT. It does not yet solve queue delays or guarantee collection completion; it only proves scheduled dispatch. Production collection should not be moved off GitHub Actions until dry-run and operational measurements support the change.
- Cloudflare Workers Free official limits: 100,000 requests/day, 10 ms CPU per Cron invocation, five Cron triggers/account. One twice-daily trigger is comfortably within count limits; test WebCrypto signing under actual Cloudflare runtime before enabling.
- Existing GitHub collector schedule remains unchanged. Do not deploy or enable the Worker without explicit user action.

## Gemini API free-tier decision (2026-11-25)
- Official pricing says limited access to certain models, free input/output tokens for eligible models, and free-tier content may be used to improve Google products.
- Active limits vary by project and model (RPM, input TPM, RPD) and must be checked in Google AI Studio. RPD resets at midnight Pacific Time. Do not assume a universal static free quota.
- Grounding availability differs by model/tier; some current Gemini 3 models do not include free-tier Google Search grounding. Treat grounding as unavailable unless the selected model's current table says otherwise.
- Gemini stays optional and off by default. If used, send only public/sanitized metadata; never credentials, personal/private information, or human review labels tied to identifiable people. No Gemini key/integration is active.
