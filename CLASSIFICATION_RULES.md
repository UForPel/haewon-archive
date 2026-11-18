# Classification Rules — Haewon Archive

Version: 0.1.0
Status: INITIAL BASELINE — routine heuristic changes may be proposed by Gemini under strict validation.

## 1. Keep two classifications separate

Every candidate has two independent questions:

1. **Publisher/content origin**: who published or created it?
2. **Haewon relevance**: how strongly does the available evidence connect the content to Haewon?

An official NMIXX upload is not automatically a Haewon appearance. A fan upload is not automatically relevant merely because it mentions NMIXX.

## 2. Origin classification

Use one of these values:
- `official`: published by a verified official artist, agency, broadcaster, event or partner account. State the evidence for the account identity.
- `fan`: published by an identifiable non-official fan/creator account, with no evidence that it is an official channel.
- `uncertain`: publisher identity or authorization cannot be established.
- `unrelated`: clearly not an archive candidate or not about the project subject.

Do not label a creator "official" based only on a display name, logo, repost, or search snippet.

## 3. Haewon relevance

Use one of:
- `confirmed`: permitted source evidence explicitly identifies Haewon/OH HAEWON in the item metadata, or reliable human review confirms it.
- `probable`: multiple contextual signals support relevance, but direct confirmation is missing.
- `unknown`: insufficient or conflicting evidence.
- `not_relevant`: evidence clearly identifies another subject or unrelated topic.

The existing `data/videos.json` boolean `relevance` is a legacy keyword hint. Do not silently reinterpret it as visual confirmation. Until the schema and UI are deliberately migrated, preserve its existing meaning and behavior.

## 4. Evidence hierarchy

From strongest to weakest:
1. Canonical source metadata explicitly naming Haewon/OH HAEWON.
2. Verified official or creator caption/title naming her.
3. Reliable corroborating metadata from another permitted source.
4. Search-result snippets.
5. Broad group-level context or keyword coincidence.

Evidence levels 4–5 alone must not support a confirmed label.

## 5. False-positive controls

- Korean and English variants include `해원`, `오해원`, `HAEWON`, `OH HAEWON`.
- A matching token may refer to another person or a different meaning; inspect context.
- Group-only labels such as NMIXX/엔믹스 are insufficient for member-level confirmation.
- Hashtags naming multiple members establish that they are mentioned, not necessarily that all are visually present.
- Never infer appearance, participation, speaking role or screen time from a title alone.

## 6. Required rationale

Each AI-produced candidate should include:
- Origin label and evidence.
- Relevance label and evidence.
- Confidence band (`high`, `medium`, `low`) or an explicit unknown.
- Short rationale tied to source metadata.
- Uncertainty reason when applicable.

If evidence is insufficient, choose `uncertain` / `unknown`; do not force a positive label.

## 7. Evaluation and policy updates

Measure precision on a stable human-reviewed sample. Record false positives and false negatives separately. A heuristic change requires a before/after comparison and may be proposed only in this file's designated mutable heuristic section. It must not change source permissions or protected policy.
