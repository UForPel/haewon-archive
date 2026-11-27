# Policy Changelog

Append-only record of proposed and approved changes to mutable search/classification guidance. Preserve previous entries.

## Entry template

### YYYY-MM-DD — [file] — [short title]
- Status: proposed | approved | rejected | reverted
- Changed by: human | automated proposal (Gemini)
- Evidence: sanitized run IDs and aggregate measurements; no secrets or personal data.
- Change: concise description.
- Expected effect: measurable quality improvement.
- Evaluation: fixed-sample before/after result, or pending.
- Rollback: exact commit or prior version to restore.
- Reviewer: human reviewer when approval is required.

## Initial baseline — 2026-11-19
- Status: baseline established
- Files: `SECURITY_POLICY.md`, `COLLECTION_RULES.md`, `SEARCH_STRATEGY.md`, `CLASSIFICATION_RULES.md`
- Evidence: current repository source registry and collector were inspected. The only approved automated collector is the official NMIXX YouTube Atom feed; current feed fetches 15 newest entries. JYP and Instagram are manual-link-only.
- Change: separated protected source/security boundaries from mutable search vocabulary and classification heuristics; separated publisher origin from Haewon relevance.
- Evaluation: not yet available; Gemini integration and policy updater are not implemented.
- Rollback: revert the baseline documentation commit(s).
- Reviewer: pending human review.


### 2026-11-27 — SOURCE_POLICY.md / COLLECTION_RULES.md — disable YouTube Atom polling
- Status: approved operational safety correction; implementation submitted for PR review.
- Changed by: ChatGPT audit implementation under the user's explicit source-policy instruction.
- Evidence: YouTube robots.txt disallows /feeds/videos.xml for User-agent: *; Terms restrict automated access. Production #620 log confirms the existing NMIXX Atom collector fetched 15 entries despite the broadcaster-only research restriction.
- Change: disable the legacy Atom source and collector; preserve archived videos; remove API secret injection and hard-disable API search pending the 30-day lifecycle.
- Expected effect: zero automated requests to YouTube Atom/API endpoints while retaining historical archive data.
- Evaluation: pending PR CI and next actual Production run.
- Rollback: do not restore the collector without documented written permission or another clearly authorized access basis and human review.
- Reviewer: human review required before any future reactivation.
