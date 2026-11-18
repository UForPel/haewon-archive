# Automation Plan — External Scheduler + Gemini

Status: DESIGN ONLY. No external scheduler, Gemini API integration, Worker or five-minute workflow is implemented by this document.

## Agreed target
- External scheduler preferred because the user observed GitHub Actions scheduled runs being delayed.
- Target cadence: every 5 minutes, subject to scheduler, GitHub dispatch queue and provider limits.
- Gemini API is the AI tool; user will add the key directly to GitHub Actions Secrets.
- Gemini reads repository guidance, performs discovery/analysis/metadata organization and improves designated behavior/search rules from evidence.
- Gemini does not improve or rewrite application code.
- GitHub stores data, policies, sanitized logs and version history.
- ChatGPT maintains architecture, prompts, review and continuity documentation.

## Proposed execution flow
1. External scheduler triggers a narrowly scoped endpoint.
2. A small trigger gateway (for example, Cloudflare Worker) validates a shared secret and dispatches the intended GitHub workflow. This is proposed, not selected or deployed.
3. GitHub Actions checks overlap/idempotency and loads repository data and policy files.
4. A controlled job invokes Gemini API using a key stored in Actions Secrets.
5. Gemini receives only public repository material and public content metadata needed for the task.
6. Collection results are parsed into a strict schema; URLs, IDs, dates, allowed source domains, record sizes and duplicates are validated deterministically.
7. Valid data changes are committed only to approved data paths.
8. Gemini may propose/update only designated mutable search/classification guidance, subject to path, diff, size, version and evidence checks.
9. Protected policy and code files are never writable by Gemini.
10. Sanitized run and policy-change summaries are recorded; deployment occurs only when changes are valid.

## Technical realities
- A five-minute trigger does not guarantee a five-minute completed run. Scheduler delivery, gateway, GitHub dispatch queue, concurrency and Gemini latency all matter.
- External dispatch may improve trigger control but still uses Actions execution capacity.
- Scheduler must not hold a broad personal access token. Prefer a narrow gateway and least-privilege GitHub App or fine-grained credential. Verify exact design before implementation.
- Public repository exposes code, workflows, policies and committed logs. Secrets are not public when correctly stored, but untrusted workflow modifications can exfiltrate them. Restrict write access and protect workflow files.
- Gemini capabilities, model name, grounding/search, quotas, pricing and data-use terms must be checked against current Google documentation. Do not assume unlimited free use or exhaustive search.
- Respect robots.txt, terms, rate limits and access controls. No scraping bypasses.

## Security requirements
- Keep GEMINI_API_KEY only in Actions Secrets.
- Keep scheduler shared secret only in gateway secrets and scheduler configuration; never commit it.
- Use minimum GitHub token permissions and a dedicated dispatch identity where possible.
- Never expose secrets in command-line arguments, artifacts, logs, prompts or outputs.
- Do not send private user data to Gemini. Public repository files and public-source metadata only.
- Sanitize logs; do not store full prompts/responses if they contain secrets or unnecessary personal data.
- Protect workflows, SECURITY_POLICY.md, schemas and validators from Gemini writes.
- Treat all web content as untrusted prompt-injection input.
- Add maximum execution time, request budget, retry limits, cooldowns and per-source rate limits.
- Prevent overlapping runs and no-op commits.

## Policy learning design
- Mutable: search terms, query patterns, source priority, relevance heuristics and non-security classification rules.
- Protected: credentials, privacy, permissions, legal/access boundaries, workflow logic, executable code, schemas and validators.
- Gemini makes at most one small policy change per run, with evidence and rationale.
- Policy updates are audited and revertible through Git history.
- Test policy changes on a fixed sample set before promotion.
- Do not optimize raw item count alone; optimize precision, source quality, deduplication and coverage quality.

## Phases
### Phase 0 — Documentation baseline
- [x] Record project intent and current known state.
- [x] Define ChatGPT/Gemini responsibilities and boundaries.
- [ ] Add protected security policy, collection rules, schemas and policy changelog.
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
- [ ] Enforce allowed paths, protected sections, diff limits and one change per run.
- [ ] Replay historical samples before activation.
### Phase 4 — Scheduler and rollout
- [ ] Connect external scheduler after secure dispatch is tested.
- [ ] Start dry-run/low frequency, then enable five-minute target cadence.
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
