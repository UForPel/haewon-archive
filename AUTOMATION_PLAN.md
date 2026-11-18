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
