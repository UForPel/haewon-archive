# Recursive Improvement Loop

## Purpose
This repository is the external working memory and test surface for an iterative, AI-assisted improvement process. It does not change model weights or create autonomous self-training. The loop simulates continuous improvement through inspectable artifacts, evaluation, bounded changes, and rollback.

## Each iteration
1. **Observe:** inspect recent commits, run logs, collector status, candidate volume, duplicates, failures, and coverage.
2. **Diagnose:** identify the highest-impact bottleneck (coverage, false positives, broken source, parsing, UX, tests, deployment).
3. **Hypothesize:** record the expected change and measurable outcome before editing.
4. **Change:** implement the smallest reversible improvement. Prefer free/public feeds and metadata links; never bypass access controls or scrape disallowed sources.
5. **Verify:** add/update tests; run tests and data validation in GitHub Actions. Do not call a change verified until the run is green.
6. **Measure:** compare collected/added/duplicate/invalid counts, source coverage, freshness, and errors against the prior run.
7. **Record:** commit code/data and update this log with the change, evidence, known limits, and next priority.
8. **Repeat:** select the next bottleneck based on evidence, not habit or user-visible novelty.

## Quality guardrails
- Keep candidate discovery separate from confirmed archive records.
- Preserve source URLs and publisher attribution; never copy full media.
- Deduplicate by canonical URL where feasible.
- Avoid brittle scraping, login-required content, anti-bot evasion, and access-control bypass.
- Keep core site usable without paid services, keys, or AI API calls.
- Distinguish automated collection from AI relevance review. Without an AI API integration, keyword/feed logic is deterministic and ChatGPT/Gemini review happens interactively.
- Every claim of completion must specify what was implemented, tested, and deployment-verified.

## Metrics
Track, where available: feed requests succeeded/failed, items fetched, unique items added, duplicates, candidate count, date coverage, query/source diversity, test/validation status, and workflow outcome.

## Next priority queue
1. Verify the RSS collector in Actions and inspect actual candidates for relevance/quality.
2. Expand discovery to public video-search/feed sources and additional news queries, without paid APIs.
3. Add candidate relevance scoring and query/source labels; measure false positives.
4. Improve source diversity beyond official channels.
5. Add social discovery pointers where public RSS/API access is supported; otherwise record searchable source pointers, not brittle scraping.
6. Review the archive UI and unify discovery candidates with archive search/filtering.


## Iteration record — RSS collector syntax and metrics repair (2026-11-20)
- **Observed:** The RSS collector had a stray closing brace and its test file lacked a closing test block, preventing the workflow's test-first stage from running. The previous `added` count also used total merged length minus existing length, which can misreport when duplicates exist.
- **Change:** Removed the extra brace; closed the test suite; calculated `added` from unique incoming URLs absent from existing data and added `uniqueIncoming`/`duplicates` metrics to output.
- **Verification:** A local reconstructed fixture test run passed 4/4. This is a parser/test fixture check, not a full repository test, workflow run, live RSS fetch, or deployment verification.
- **Limit:** Actual GitHub Actions status and live feed collection remain unverified from this session.
- **Next:** Obtain a successful workflow run and inspect candidate relevance; then improve discovery coverage based on observed results.

## Iteration record — relevance scoring (2026-11-20)
- **Observed:** RSS candidates were all presented as equally ranked despite mixed query specificity; users had no quick signal for likely Haewon/NMIXX relevance.
- **Hypothesis:** A transparent deterministic keyword score and relevance-first ordering will reduce review effort without discarding uncertain candidates.
- **Change:** Added score signals for 오해원/Haewon, 해원, NMIXX/엔믹스, and content terms (fancam/직캠/interview/stage/shorts); exposed score in the discovery list; sorted candidates by score then recency. Candidates remain unconfirmed and are not auto-promoted into archive records.
- **Verification:** Reconstructed local parser fixture tests passed 5/5, including score behavior. This is not a full repository test, live feed, Actions, or deployment verification.
- **Next:** Verify actual RSS results and tune score only from observed precision/false positives; then pursue public video discovery.
