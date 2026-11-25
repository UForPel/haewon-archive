# Collection Rules — Haewon Archive

Version: 1.0.0
Status: HUMAN-MAINTAINED PROTECTED RULES
Related: [SECURITY_POLICY.md](SECURITY_POLICY.md), [SOURCE_POLICY.md](SOURCE_POLICY.md), [GEMINI.md](GEMINI.md)

## 1. Purpose

Collect useful, attributable, publicly accessible records about Haewon (Oh Haewon) and NMIXX-related content. Prefer precision, source quality and durable canonical links over raw volume.

## 2. Source permission classes

A source is not automatically approved merely because a page can be opened in a browser.

| Class | Meaning | Automated behavior |
|---|---|---|
| `public-feed` | Explicit public feed/interface currently approved in the source registry | May fetch within its documented limits and this policy |
| `manual-link-only` | A public page useful to visitors, but not approved for automated extraction | Do not crawl; a human may register a plain source link |
| `review-required` | Permission, terms, robots policy, or technical access is uncertain | Do not collect until human review |
| `disabled` | Source paused or disallowed | No requests |

The current approved automated source is the NMIXX Official YouTube public Atom feed listed in `data/sources.json`. Instagram and JYP pages are currently manual-link-only. Do not expand this allowlist autonomously.

## 3. Allowed record content

Collect only metadata that is publicly visible and needed for discovery:
- Stable platform/content identifier when provided.
- Canonical public URL.
- Exact public title.
- Public source/channel/creator name.
- Publication date/time only when verifiable.
- Short public description or excerpt only when necessary and permitted.
- Permitted preview/thumbnail URL supplied by the platform.
- Collection timestamp.
- Classification and a short evidence-based rationale.

Do not collect private data, login-only content, comments at scale, contact details or unrelated profile information.

## 4. Verification requirements

- Preserve the original canonical URL; do not invent or guess IDs.
- Prefer the source page or official feed over snippets copied by third-party search engines.
- Distinguish publication time from discovery/collection time.
- If a date cannot be verified, leave it unknown rather than estimating.
- If title, uploader or source identity conflicts across evidence, classify as uncertain.
- A search snippet alone is not sufficient to assert visual appearance or member participation.
- Do not infer that Haewon appears in a video from the uploader being official or from NMIXX being mentioned.

## 5. Copyright and preview handling

- Never download or rehost full video or photo files.
- Keep source links and attribution.
- A thumbnail URL may be stored only when it is supplied by an approved platform/feed and used as a permitted preview.
- For fan photos, default to a plain source link and attribution; do not mirror image binaries.
- If reuse permission is unclear, do not display a copied preview.

## 6. Rate and failure handling

- Follow source-specific published rate limits and robots directives.
- Use conservative request frequency, bounded retries and exponential backoff for transient failures.
- Stop requests after authorization, access-denied, CAPTCHA, anti-bot or explicit disallow responses.
- Do not rotate identities, proxies or user agents to evade limits.
- Record source health as success, partial, skipped, blocked or failed with a sanitized reason.
- Do not interpret a temporary failure as permission to try a hidden endpoint or alternate bypass.

## 7. Deduplication and updates

- Use the platform's stable content ID as the primary key when available.
- Also normalize canonical URLs and use them as a secondary duplicate check.
- Preserve existing IDs and stable records.
- Update only fields supported by newer source evidence.
- Do not overwrite verified metadata with lower-confidence snippets.
- Keep source attribution and correction history where practical.

## 8. Data write gate

Before any automated write:
1. Parse the entire candidate payload.
2. Validate against the versioned schema.
3. Confirm every source is enabled and approved.
4. Validate URL scheme and source domain.
5. Check IDs, timestamps, required fields and field lengths.
6. Deduplicate against existing repository data and within the batch.
7. Enforce per-run item and byte limits.
8. Write only to the workflow's explicit data-path allowlist.
9. Run repository validators and tests.
10. If any gate fails, write no candidate records; emit a sanitized failure summary.

Gemini does not have permission to alter these rules or the validators enforcing them.



## 2026-11-25 — CI boundary

- Pull-request verification is read-only: it may run unit tests and validate committed archive data. It must not collect external feeds, mutate archive JSON, commit data, access Pages deployment permissions, or use secrets.
- The proposed workflow grants only `contents: read`, disables persisted checkout credentials, and has no collection or deployment steps.
