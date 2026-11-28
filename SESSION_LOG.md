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


## 2026-11-19 — Archive record schema enforcement

### User direction
User approved the next implementation step: make the documented archive JSON Schema enforceable by the existing validator and add tests.

### Inspected baseline
- Re-read project memory, operating rules, decision register, session log, status, roadmap, relevant schemas, current validator, collector, photo-link validation, data fixtures, package manifest and workflow.
- Confirmed current videos.json has 17 records and photos.json is an empty array.
- Confirmed existing video records contain the required schema fields and use standard YouTube watch URLs and thumbnail hosts.
- Confirmed the current validator previously checked only broad JSON shape and photo-specific validation.

### Implemented
- Added `scripts/json-schema.mjs`: a dependency-free validator for the JSON Schema subset used by the repository, including local refs, oneOf, types, required/properties, additionalProperties, string lengths/patterns/formats, enum/const and array maxItems.
- Updated `scripts/validate-data.mjs` to load `schemas/archive-record.schema.json`, validate every video and photo-link record, preserve photo-specific normalization checks and reject duplicate video IDs.
- Added `tests/json-schema.test.mjs` covering valid video/photo records, invalid types, missing required fields, unsafe URLs, invalid dates, extra properties and incomplete records.
- Updated the thumbnail pattern to accept both `i.ytimg.com` and numbered `iN.ytimg.com` hosts.
- Updated PROJECT_MEMORY.md, PROJECT_STATUS.md, ROADMAP.md, AUTOMATION_PLAN.md and README.md to distinguish enforced archive schema from the future run-log schema.

### Not implemented
- The run-log schema is not yet wired to a log producer or validator.
- No Gemini API, external scheduler, Worker, fan-video discovery, photo crawler or policy updater was added.
- Existing Actions schedule remains twice daily.

### Verification state
- All changed files were committed to main through GitHub.
- Runtime tests and `npm run validate` have not yet been confirmed. The final push should trigger the existing workflow; inspect its final run before claiming tests pass.
- No deployment/UI visual verification is claimed.

### Next step
Check the latest GitHub Actions run for the final documentation/code commit. If it fails, inspect job logs and fix the concrete failure before proceeding to the dry-run collection/run-log pipeline.


## 2026-11-20 — Intent continuity, error/omission tracking and mandatory first-read reaffirmed

### User intent / operating preference
- User wants GitHub continuity records to capture the intent behind conversations, not merely a surface summary.
- Prioritize low-token, quickly readable, accurate handoffs with enough detail to prevent lost requirements.
- ChatGPT must read GitHub project records first at the start of every Haewon Archive conversation, before substantive answers or work; never rely on chat memory alone for current project state.
- Record mistakes, missed requirements, overlooked details, uncertainties, failed approaches, and corrections/prevention steps explicitly when material.

### Change implemented
- Updated `CHATGPT_OPERATING_RULES.md` with a dedicated error/omission/intent-tracking section.
- Required `SESSION_LOG.md` to surface errors/omissions/risks with issue, impact, correction and prevention/verification where useful.
- Added guidance not to hide errors in success summaries and to distinguish confirmed facts from assumptions/open questions.

### Evidence
- Operating-rules commit: 1efb402fe3f3e3b49e1f89f5bd7ad6bfe0108362
- Commit URL: https://github.com/UForPel/haewon-archive/commit/1efb402fe3f3e3b49e1f89f5bd7ad6bfe0108362
- This log entry is being appended after that rules commit; verify its own commit separately.

### Errors / omissions / risks
- Risk identified: compact summaries can accidentally omit nuance or make an unverified state sound confirmed. Prevention: preserve material constraints and intent, label statuses (planned/implemented/tested/verified), and explicitly log uncertainties and mistakes.
- Operational limitation: GitHub-first reading is required for Haewon Archive tasks, but tool access may fail; if so, disclose the failure and avoid guessing current repository state.

### Next action
- Verify latest Actions run triggered by operating-rule change; then continue the planned check of the outstanding schema-validator workflow run before new implementation.


## 2026-11-20 — Initial workflow test and thumbnail schema correction

### Goal
Begin tangible implementation/testing before Gemini automation. First inspect latest Actions and repair failures.

### Verified failure
- Actions run #84: https://github.com/UForPel/haewon-archive/actions/runs/44706156313
- 19 tests: 18 passed, 1 failed. Video schema fixture failed because thumbnail host pattern did not match `i.ytimg.com`; collection/deploy steps skipped after tests.
- Root cause: thumbnail host regex incorrectly expected a digit-dot segment after `i`, but actual supported hosts include `i.ytimg.com` as well as `i2.ytimg.com` variants.

### Correction made
- Updated `schemas/archive-record.schema.json` thumbnail URL pattern to explicitly accept `i.ytimg.com` or numbered `iN.ytimg.com` hosts.
- Commit: 372234688efb2f67490c5d084bfd034c33017ea1
- Commit URL: https://github.com/UForPel/haewon-archive/commit/372234688efb2f67490c5d084bfd034c33017ea1

### Verification
- New workflow run #85 ID 44706310654 triggered by the fix.
- At log-writing time it was in progress; success is not yet confirmed.

### Error / omission prevention
- Earlier regex change was not tested against both unnumbered and numbered real thumbnail host patterns. Add representative fixtures for both variants and verify CI output before reporting pass.

### Next
- Verify run #85 and inspect logs if failure.
- Once tests pass, proceed to machine-readable sanitized run logs, tests and validation before Gemini dry-run integration.

## 2026-11-20 — Project-wide review protocol and run-log audit

### User feedback / intent
User asked for deeper, multi-angle improvement work instead of brief sequential status reports. Intent: ChatGPT should proactively inspect the whole project, identify cross-cutting improvements, weigh risks/dependencies, and deliver real implementations and verification—not merely move to the next checklist item.


### Operating-rule change
- Added a project-wide improvement protocol to CHATGPT_OPERATING_RULES.md: review UX, data quality/coverage, reliability, tests, security/privacy, free-tier sustainability, accessibility/mobile, maintainability, automation failure modes and observability; prioritize by impact/risk/dependency/effort; batch related changes; verify behavior separately from CI.
- Commit: 1810f60ed87033ceed895f9eb7a9ae964e1c4248
- URL: https://github.com/UForPel/haewon-archive/commit/1810f60ed87033ceed895f9eb7a9ae964e1c4248

### Current run-log feature audit (read-only inspection)
- scripts/run-log.mjs, tests/run-log.test.mjs, scripts/validate-data.mjs, schemas/run-log.schema.json, package.json and workflow inspected.
- Run #93 (44706648807) is still pending with no jobs at inspection time; implementation is NOT CI-verified.
- Run-log counts currently derive duplicates = max(itemsFetched - itemsAdded, 0), which may mislabel rejected/filtered records as duplicates. videoCount/photoCount arguments are unused. validation.passed is hard-coded true. These are correctness issues to fix before trusting logs.
- Workflow uses concurrency cancel-in-progress: true; rapid pushes can cancel active runs and prevent reliable verification. Batch coherent commits and consider changing concurrency policy to queue/avoid canceling active data runs after assessing race behavior.
- Workflow can stop on collector/test/validation errors before the log-generation step, so failed runs may leave no operational log. Failure logging needs a safe always-run strategy with explicit step outcomes and sanitized errors, without accidentally committing/deploying invalid data.
- Workflow commits logs under data/; current changed-path capture is pre-log and adds the directory manually. Verify accurately and avoid sensitive content.

### Error/omission
Previous progress reports were too short and sequential, lacked whole-project risk assessment, and did not clearly flag stale project docs or workflow cancellation as a cross-cutting concern. Correction: use the project-wide review protocol and separate planned/implemented/tested/verified claims. Preventive check: review docs for stale contradictory status after code changes.

### Next prioritized work
1. Wait/check #93; inspect failure logs if available.
2. Fix run-log data accuracy and ensure logs exist for failed collection/test/validation runs without deploying invalid data.
3. Review workflow concurrency and commit batching to avoid cancellations.
4. Add focused tests for failure/outcome/accurate counts, run the full suite and validate actual generated logs.
5. Update PROJECT_STATUS, ROADMAP, PROJECT_MEMORY and append SESSION_LOG before moving to Haewon Daily.


## 2026-11-20 — Workflow cancellation risk and project direction

### Implemented and verified
- Changed `.github/workflows/collect-and-deploy.yml` concurrency to `cancel-in-progress: false`, so new runs queue rather than cancel active runs in the same group.
- Commit: `6cf2b535dd539f00163ec6a9fbb800c63221f77b`.
- Actions #96 completed successfully: https://github.com/UForPel/haewon-archive/actions/runs/44708067028
- Prior run #95 also succeeded: https://github.com/UForPel/haewon-archive/actions/runs/44707182754

### Actual collection result (run #96)
- 15 valid feed items observed; 0 new items; 17 total videos.
- This is operational success but no archive growth. Do not count it as user-facing feature progress.

### Assessment / priority correction
- Governance and logging work has expanded ahead of the product's core coverage. Stop adding process/documentation-only improvements unless a concrete risk requires them.
- Next high-value product work: Haewon Daily, then permitted public discovery for fan videos, then integrated search/classification improvements.
- Project status/roadmap are updated to reflect that run-log failure-path handling remains incomplete and feature work should take priority.


## 2026-11-20 — Engineering quality protocol added

### User question / direction
Asked whether expert software-development algorithms and practices (robustness, accuracy, efficiency, fallbacks) are being documented for future iterations.

### Repository audit
- README references `SELF_IMPROVEMENT_LOOP.md`.
- Existing loop already covers observe → diagnose → hypothesis → change → verify → measure → record, quality guardrails, metrics and iteration records.
- The newly discussed engineering practices were not yet fully formalized in that document.

### Documentation change
- Added an Engineering quality protocol to `SELF_IMPROVEMENT_LOOP.md`: acceptance criteria, decomposition, root-cause analysis, failure taxonomy, bounded retry/backoff, permitted fallbacks, idempotency, boundary validation, layered tests, adversarial review, complexity/resource review, observability, truthful verification labels, and rollback safety.
- Commit: 30a0c035dbbf3fb7c4ab448137ad083e19b671a
- URL: https://github.com/UForPel/haewon-archive/commit/30a0c035dbbf3fb7c4ab448137ad083e19b671a

### Verification
- GitHub Contents API confirmed the file was updated and commit created.
- This is a documentation change; no code tests are claimed.
- Follow-up: update ChatGPT operating rules to require this protocol in code tasks, then use it on a substantive feature change rather than adding process docs repeatedly.



## 2026-11-20 — Run-log outcome correctness fix

### Observation / root cause
- Direct code review found `buildRunLog` mapped every non-success collector status to overall `failed`, even when the source outcome was correctly `skipped`. This misreported an intentional/no-op skip as a failure.
- Trigger normalization also collapsed `manual` and `external_scheduler` into `unknown`, despite schema support for both.

### Change
- Map source outcome `skipped` to run status `skipped`; preserve `failed` only for collector errors.
- Preserve `manual` and `external_scheduler` trigger types.
- Added focused regression tests for skipped status and trigger normalization.
- Commits: `de4b20ddfae3fbbad4169518b4311f21af8146c5` (code), `289de90caac325b3d5a69e480ed6c62981d85ce7` (tests).

### Verification
- GitHub commits confirmed. Tests and workflow result are pending; do not claim verified until Actions completes.

### Next
- Check Actions run for these commits. Then prioritize product discovery coverage over more documentation/process-only work.


## 2026-11-20 — Mobile layout stabilization and list pagination

### User report
- On mobile, long news/discovery scrolling caused layout shifts and other sections to appear displaced; videos/news lists are too long.

### Changes
- Added pagination controls to video archive and discovery candidate lists (12 items per page).
- Video list now renders only the current page and displays total count/page number.
- Discovery candidate list now renders 12 items per page; search resets to page 1.
- Constrained card content widths and added wrapping for long titles, metadata, and URLs to reduce horizontal overflow/flex displacement.
- Added responsive pagination styles.

### Commits
- index controls: a8fbce0b3b842c59fb9e70a73ac4c619d878892c
- video pagination: bceb54b22acc8dd3b5f845568325c121bd6952c3
- discovery pagination: c55c956a94630859442643abb10708a856cbdfce
- responsive card CSS: 473cc5abd5d192c9325239c9055410644b0372ea

### Verification
- GitHub Actions deployment triggered by latest UI commit; pending at log update.- No direct mobile-browser visual test is claimed yet. After deployment, manually inspect on phone and report any remaining overflow/layout issues.



## 2026-11-20 — Discovery candidate type labeling

### Observation
- The automated discovery section was titled “newly discovered news,” but current RSS candidates include YouTube/fancam video links. This made the list's label misleading.

### Change
- Added a small classifier that labels obvious YouTube/fancam/video candidates as “영상 후보” and other links as “기사 후보.”
- Renamed the section to “새로 발견된 콘텐츠 후보” and clarified that all entries are unreviewed candidates.
- Added regression tests for video/article labeling.
- Commits: 235cb86a0697e00eb6ea32d09d36dc8aa557203d (classifier), 50ac2cf48b6cfc889847a55a056b18b69f43838f (view), e5a50a2956739b05e0f279b3520f385d5a4b4859 (tests), c1962f9e76d0ad9ed7229934e060f0f712e05bb2 (section wording).

### Verification
- GitHub commits created. CI run is pending at the time of this entry; confirm test and deployment result before claiming verification.
- Classification is heuristic, not authoritative content moderation or news verification.


## 2026-11-20 — Collector push race diagnosis and retry/rebase mitigation

### Observed failure
- New feature commits landed while collection workflows were running. The collector completed tests and validation, created its data/run-log commit, then its push was rejected because remote main had advanced (non-fast-forward).
- Runs #185 and #187 failed at the data commit push step, not at unit tests or data validation. Run #183 had completed successfully before the overlapping commits.

### Change
- Collector commit step now fetches main, rebases its generated data commit onto the current remote tip, then pushes. It retries the fetch/rebase/push sequence up to three times for a bounded response to a concurrent push race.
- Workflow commit: d2f6232fd9cde873bcad768b2ae0ead2f7eac0ee


### Verification
- Workflow change committed. A fresh Actions run must confirm the race mitigation; conflict handling is still fail-fast rather than attempting to auto-resolve data conflicts.


## 2026-11-20 — Separate YouTube/video discovery from article candidates and mobile layout hardening

### User-reported issues
- Sections and cards visibly break on mobile; long lists create scroll/layout instability.
- The “news” discovery area was largely YouTube/fancam candidates, not news articles.
- User requested separate YouTube collection/search and article/news areas, including thumbnail display.

### Changes
- Discovery classifier now exposes article filtering; article UI renders only non-video candidates.
- RSS collector skips video/fancam/YouTube candidates before storing news discovery results.
- Section headings now explicitly distinguish “플랫폼별 검색” from “기사 후보”; text explains RSS candidate status.
- Mobile CSS hardens overflow, wraps section headings and filters, stacks article cards/actions, and makes quick-search controls single-column on narrow screens.
- Video archive already uses YouTube thumbnailUrl on video cards; this remains the dedicated collected-video section.
- Tests added for filtering video candidates from article lists.

### Commits
- classifier: 083f7cc467997ff61c2b1ff117f368d108e76930
- collector: a1df8cc89968859ae955b0936266997d31a01c80
- view: 0b50be114d6bf7bfa868c1cb4911c99757c6d614
- tests: db74e81b14531eee0e1bb2040f7382e4eba24510
- HTML: 798a880fec4e47626106dbae945a896f76341cda
- CSS: 3c0d0568b2d48d6b2aa55839c893ba2b69123962

### Verification
- Awaiting CI run after these commits. Mobile browser visual verification remains outstanding.

## 2026-11-21 — 구조 검증 및 기사/영상 분리 개선

### 구조 검증에서 발견한 실제 결함
- HTML 구조 테스트를 새로 추가했고, 플랫폼별 검색 섹션의 헤딩 wrapper가 닫히지 않아 다음 섹션까지 DOM이 중첩되는 문제를 발견·수정했다.
- RSS 뉴스 수집기에서 이미지 helper가 중복 선언되어 테스트 실패를 유발한 것을 제거했다.
- 영상 분류가 설명(description) 텍스트까지 읽으면 일반 기사 설명에 등장한 YouTube를 영상으로 오판할 수 있어, 제목의 영상 표식과 YouTube URL만으로 판정하도록 좁혔다.

### 변경
- 기사 RSS 검색에서 fancam query 제거. 영상 수집과 뉴스 검색의 역할 분리.
- RSS `media:thumbnail` / `media:content` 이미지 URL 추출을 지원하고, 기사 후보 카드에서 제공되는 썸네일 표시.
- 영상 카드의 썸네일 로딩 실패 시 안내 placeholder 표시.
- 좁은 화면에서 기사 썸네일/본문을 세로 배치하고, 검색·필터·날짜 컨트롤을 wrap/stack하여 overflow 완화.
- HTML tag nesting 및 ID 중복 테스트 추가.

### 관련 커밋
- `00d2455` classifier 초기 개선
- `98f3d99`, `c2040ed`, `d605456` RSS thumbnail parsing 정리 (중간 오류를 CI에서 발견하고 수정)
- `56a551a` article classifier test
- `7f83fbf` article thumbnail UI
- `89236f3`, `a5c9b14` responsive CSS / fallback
- `f207a79` HTML structure test
- `369785e` classifier false-positive fix
- `4adb21e` malformed HTML heading fix
- `d605456` duplicate helper removal

### Verification
- GitHub Actions run #213: **success** — unit tests, collectors, data validation, operational log validation, commit/deploy steps all passed.
- Browser-based manual visual review on a real mobile viewport is still not performed. The automated structure test confirms balanced tag nesting and unique IDs, not visual quality.

### Follow-up — thumbnail fallback hardening
- Avoid creating an image element with an empty `src`; use a text fallback when no valid HTTPS thumbnail exists.
- If a thumbnail fails to load, replace the image with a readable fallback.
- Commit: `0a9e05fc`
- CI run #216: **success**, including deploy.


## 2026-11-21 — 뉴스 카드 링크·검색 조합·뉴스 유래 YouTube 통합

### 사용자 피드백
1. 뉴스 카드에서 긴 URL을 직접 보여주지 말고 제목 클릭으로 원문 이동.
2. 기사/영상 썸네일을 제공하고 없으면 읽기 쉬운 fallback.
3. 뉴스 RSS에서 발견한 YouTube 링크도 영상 목록에 분류해서 함께 보여주기. 공식 채널 최신 피드만으로 영상 목록을 제한하지 않기.
4. 검색어는 이름/언어/콘텐츠 유형을 다양하게 조합.

### 코드 변경
- RSS 후보 카드 제목에 원문 링크 적용, 별도 원문 URL 액션 제거.
- RSS thumbnail 표시/placeholder 기능 유지.
- 뉴스에서 발견된 watch, youtu.be, shorts, embed 링크를 표준 YouTube 영상 레코드로 변환하는 `scripts/sync-discovery-videos.mjs` 추가. 기존 영상과 video ID 기준 merge.
- Workflow에 뉴스 수집 후 영상 sync 단계 추가, npm script 및 source registry 추가.
- YouTube 검색 프리셋 10개(해원/오해원/Haewon, 직캠, focus cam, 4K, stage, shorts, 인터뷰, variety, behind) 추가.
- RSS 뉴스 검색은 영상 검색어와 분리하고 뉴스/인터뷰/매거진/브랜드 중심 조합으로 유지.

### 검증 상태
- 이전 run #223은 discovery test suite 실패. 당시 discovery view의 syntax error를 수정하고 테스트 블록을 정리함.
- 이후 여러 커밋으로 workflow runs가 취소되어 최신 run #235는 pending 상태. 이 기록 시점에 최신 CI 성공을 주장하지 않음.
- 모바일 브라우저 실화면 검증은 아직 수행하지 않음.

### 주요 커밋
- `1a18ca4` discovery card syntax fix
- `3fb5e3f` discovery test closure fix
- `0735b54` news title clickable
- `cdf71c4` YouTube search presets
- `0d5c6e2` discovery YouTube sync script
- `8ea5588` workflow sync step
- `6dccb99` sync regression tests
- `bb6e3e9` source registry label


## 2026-11-21 — 날짜 기반 재귀개선 모방 알고리즘 v1.1.0

### CI 실패 원인과 수정
- Actions #237 실패 원인은 `package.json`에 잘못 삽입된 문자형 `\\n` 때문에 npm이 JSON을 읽지 못한 것. package.json을 정상 JSON으로 재작성.
- 이후 Actions #243은 기존 `tests/discovery-search.test.mjs` 끝의 불필요한 `});`로 테스트 파일이 실패. 해당 문자를 제거.
- 실패 로그를 확인하고 수정했으며, 최신 커밋의 CI 결과는 아직 대기 중.

### 알고리즘 구조
- KST 날짜를 기준으로 3개 편집/뉴스 검색어 팩을 순환하는 결정적 탐색 루틴 추가.
- 각 실행은 발견 후보를 검색어별로 집계하고, 관찰 가능한 수집량/커버리지 proxy를 기록.
- `data/improvement-cycle.json`에 알고리즘 버전, 날짜, 선택 팩, 다음 팩, 후보 수, 제한사항을 기록.
- Google News RSS wrapper가 YouTube/fancam 영상 제목을 가진 경우 공개 HTTP redirect를 따라가 최종 URL이 YouTube 영상 ID로 확인되면 영상 목록에 편입. 원래 뉴스 후보는 유지.
- workflow에서 뉴스 수집 → YouTube redirect resolve/중복 통합 → 일별 개선 사이클 → 데이터 검증 순서로 실행.
- 테스트에서 날짜별 팩 결정성, KST 날짜 경계, 미검증 정밀도 과장 방지, Google News redirect 변환을 확인.

### 검증 원칙
- 이 구조는 재귀개선 *모방* 알고리즘이며 모델 자체의 자기학습이나 코드 자체수정이 아님.
- 검토된 정답 라벨이 없으므로 precision은 `not_measured`; 후보 수만으로 검색어 자동 승격하지 않음.
- 자동으로 변경하는 범위는 날짜 기반 검색어 팩 순환 및 성과 기록에 한정. 권한/개인정보/출처 정책/중복제거/후보 보존은 불변.
- 실효성 검증은 최신 GitHub Actions 전체 통과 후에만 인정.

### 주요 커밋
- `a266bc9` package.json repair and improve command
- `6f40355`, `011ea79` daily query pack rotation
- `ddc0024` improvement cycle v1.1.0
- `492e721` workflow integration
- `6ab87fc` algorithm tests
- `7c0d72e` discovery test syntax repair
- `90a4050`, `3013f75` Google News redirect resolver
- `a40a00a` redirect regression test


## 2026-11-21 — 재귀개선 모방 v1.2.0 및 데이터 동시성 보강

### 발견한 문제
- 이전 280개 후보는 누적 discovery 크기였으며, 이를 당일 검색어별 성과로 표현하면 오해를 일으킴.
- GitHub Actions가 생성한 JSON을 rebase하는 동안 다른 수집 실행의 data 변경과 충돌해 commit 단계 실패.

### 변경
- 뉴스 수집기가 `data/news-collection-status.json`에 당일 검색어별 후보/고유 후보/실패 수를 기록.
- 개선 사이클에서 누적 후보와 당일 후보를 분리.
- `data/relevance-reviews.json`에 사람이 확인한 관련성 라벨을 저장할 기반 마련.
- 개선 알고리즘 v1.2.0은 실제 검토 라벨로만 precision을 계산. 20건 미만은 탐색 단계로 표시하고 자동 승격은 금지.
- 데이터 검증기에 일별 뉴스 성과와 검토 라벨 구조/중복 검사를 추가.
- GitHub Actions 데이터 커밋은 stale JSON rebase 대신 최신 main에서 수집 단계를 재실행하고 검증한 뒤 push하는 방식으로 변경.

### 주의
- 20개 검토 샘플은 최소 운영 기준일 뿐 통계적 유의성 보증이 아님.
- 사람의 검토 라벨은 아직 비어 있으므로 precision은 null/not measured 상태가 정상.
- 최신 workflow 전체 성공은 아직 확인 전.


## 2026-11-23 — Discovery deduplication / classifier improvement
- Verified #292 and #293 passed. Investigated previous category failures and confirmed the ambiguous keyword issue had been corrected.
- Dataset scan: 381 RSS candidates; 4 exact normalized-title duplicate groups (8 records) observed.
- Implemented conservative title normalization/grouping (long titles only), representative selection by relevance/recency, and source/duplicate counts. Classifier now checks title first, then cleaned RSS description.
- #294 deploy step failed: artifact upload succeeded but deploy-pages reported 0 artifacts, suggesting transient artifact API lookup failure. Unit tests passed in that run.
- #295 succeeded on syntax correction commit `c47041a6`. Additional dedupe tests and UI grouping commits are now being added; verification is pending.


## 2026-11-23 — Dedupe accuracy and multi-label categories (follow-up)
- Verified #300 success and #303 success. Latest #305 failed at unit tests due to an extra closing brace in `js/discovery-kind.mjs`; logs identified SyntaxError at module line 61. Corrected in `f9922745`.
- Added multi-label category export and UI tag/filter integration; labels are title-derived when title has category matches, and description fallback is used only when title has no match to reduce boilerplate contamination.
- Duplicate key strategy: normalized exact long title (cross-source), canonical URL for short/generic title; strip tracking params, hash, lowercase host. Representative selection remains relevance then recency; preserve duplicate and source counts.
- Added regression coverage for multi-label tags, title precedence, canonical URL tracking cleanup, short title safety, and cross-source long-title grouping. Assertion was corrected from expected news to expected interview for an interview title.
- CI #305 failed before fix (SyntaxError extra brace). CI #306 on the brace fix was pending at the point of log update; verification not yet claimed.


## 2026-11-23 — Metadata completeness scoring / canonical URL priority
- CI #307 and #308 were verified successful before this cycle. #305 was a known syntax error; #306 succeeded after correcting the extra brace.
- Changed duplicate grouping key order: canonical URL first (tracking parameters and fragment removed), normalized exact long title fallback only when no usable URL. This avoids splitting records that point to the same article but use different headlines.
- Added `assessDiscoveryQuality()`: 5 metadata signals (descriptive title, source, valid URL, parseable date, thumbnail) contribute 20 points each. Labels are low/medium/high completeness only; not source trustworthiness or truth.
- Added tests for URL identity priority and metadata completeness tiers. UI displays the completeness metric alongside relevance score.
- Commits: `c1b4691d` code, `35d43ddb` tests, `8797a57d` UI, `70877b89` project status. Latest CI #309/#311 pending/in progress at this log entry; not yet verified.


## 2026-11-23 — Quality metrics cycle and CI repair notes
- Implemented per-source collection success rates (Google News query success; YouTube feed pass/fail), source field coverage, candidate totals, current duplicate grouping, and before/after collector duplicate counts.
- Bounded link audit checks up to 12 discovery candidates (article URL and thumbnail URLs if present), with 4-second per-request timeout and HEAD/GET fallback for unsupported/blocked HEAD. Report includes broken sampled links and thumbnail URL missing count.
- Category counts use the live classifier. Category accuracy remains null until manual expected-category review records exist; sample size is currently 0. This is intentionally not presented as measured accuracy.
- Added summary/UI region, package quality script, generated metrics validation, and mocked tests for coverage/metrics/link audit.
- Latest verified CI #333 completed success. #329 and #330 also successful. Earlier failures #321–#328 were caused by malformed dashboard/test syntax and a document reference during Node test import; logs pinpointed them and fixes were applied before #329/#333 success.
- CI #333 snapshot: Google News RSS 4/4 query success (100%); YouTube Atom success; 19 videos; 473 candidate records; URL/date coverage 100%, thumbnail coverage 0%; 12 audited URLs, 0 broken; category counts video 139/news 280/interview 24/brand 12/performance 16/event 3/official 2; reviewed classification labels 0, so accuracy unmeasured. Candidate duplicate reduction in current grouping: 0.
- Commits and CI are detailed in PROJECT_STATUS.md; #333 verified the latest source-success UI change and full workflow.


## 2026-11-23 — Link audit false-positive correction and rerun outcome
- Adjusted audit result classes: only HTTP 404/410 are counted as broken; HTTP 429 is rate-limited; other non-success statuses/network failures are unreachable. The dashboard reports access issues separately.
- CI #338 full run success; its quality report shows 12 sampled URLs checked, 0 broken, 0 rate-limited, 0 other unreachable, and 473 discovery candidates missing thumbnails. This is only a 12-item bounded link sample.
- #343 attempt 1 passed tests and data generation/validation but failed Pages deployment with a temporary artifact metadata lookup (0 artifacts). Attempt 2 passed tests and the collection/validation steps, but Pages deploy found two same-name artifacts after rerun. A clean workflow run triggered by the documentation commit is used for final verification.


## 2026-11-24 — RSS thumbnail recovery, canonical dedupe and bounded link audit
### Request
Continue Haewon Archive with verified latest GitHub/CI state, implement thumbnail recovery, improve deduplication, support review-based classifier accuracy, expand link sampling, commit code/tests/UI/docs separately and verify full CI.
### Baseline
- Latest observed successful run before changes: #345; latest data refresh commit was generated by Actions.
- Existing RSS parser only read media thumbnail/content tags; discovery thumbnail coverage was 0% across 473 historical candidates.
- Existing link audit was limited to 12 candidates; category accuracy was correctly marked unmeasured with zero human review labels.
### Implemented commits
- `07c50353`: RSS image metadata extraction expanded to `media:thumbnail`, `media:content`, image enclosures and description markup/lazy attributes; HTTPS only and skips logo/icon-like candidates.
- `60dcabd1`: thumbnail extraction tests.
- `5879b49f`: canonical tracking-free URL keys for RSS candidate merge; preserves original URL, strips common tracking/hash, sorts query; no fuzzy title merging.
- `354f1288`: canonical URL dedupe tests.
- `b169a2d2`: link audit sample expanded to 40 records, bounded concurrency 5 and timeout 3.5 seconds; reports sample size.
- `43d31541`: quality-metric test asserts sample size.
- `ba32f015`: UI clarifies link-audit sample scope.
- `6fd04e24`: status documentation.
### Limitations / not done
- Thumbnail extraction can only use image URLs supplied in RSS metadata or descriptions; it does not invent image URLs or fetch images from publisher pages. Existing historical candidates are not backfilled by this parser.
- Dedupe canonicalization only removes common tracking and fragment; semantic/fuzzy title dedupe remains deliberately conservative.
- Review accuracy remains null until category review labels are recorded; no labels were invented.
- Link audit is sample-based (max 40 candidate rows, up to 80 URL targets), not a complete archive crawl.
### Verification
- CI run #346 passed on initial parser commit; subsequent commits triggered runs #351/#352 at the time of this entry. The final latest run must be checked after the status/log commits.
- Local execution was not available through this session; verification relies on GitHub Actions.


## 2026-11-24 — Publisher thumbnail backfill, duplicate merge and review metrics
### Latest baseline inspected
- Discovery snapshot: 585 candidates; 0 thumbnails (0%). Google News source had 100% URL/date coverage. The quality metrics snapshot was generated before this cycle's new code ran.
- News collection snapshot: 4/4 RSS queries succeeded; 258 fetched, 239 unique, 97 additions. Existing data showed 3 normalized long-title duplicate groups (6 rows → 3 groups), across opaque Google News redirect URLs.
- Research: Google News RSS omits thumbnails/snippets in observed payloads; free publisher-page Open Graph/twitter image extraction is best-effort. RSS itself is an undocumented, unstable surface. Research links: https://cloro.dev/blog/google-news-rss/ and https://hushread.com/blog/rss-feed-images-not-showing.
### Code changes
- RSS candidates: added bounded publisher-page metadata image extraction, rotating backfill selection (12/run; 3 workers; 5s timeout; six-hour slot rotation), only missing Google News redirect URLs; preserve records on failure and preserve existing thumbnails.
- Collector merge: normalized exact long headlines before opaque RSS URLs, canonical URL fallback for short titles; duplicate rows merge metadata so thumbnails/date/description are not lost.
- Quality metrics: expose thumbnail enrichment attempt/found/missing/failed; duplicate before/after counts and normalized title-group totals; exact single-label classifier accuracy and per-category review metrics.
- UI: expose duplicate before/after and thumbnail backfill result rows.
- Tests: OpenGraph metadata extraction, safe URL rejection, bounded/rotating enrichment, fetch failure preservation, long-headline dedupe across different Google redirect tokens, metadata retention, duplicate comparison and manual-review accuracy.
### CI history / correction
- A CI run failed with `ReferenceError: thumbnailEnrichment is not defined` in collector main after a bad variable-order insertion. This was fixed by merging candidates first, then initializing enrichment and writing the returned list.
- Latest observed run #372 had 77 unit tests passing; collection, quality generation and archive validation steps also completed successfully. Commit #373 was queued after test changes; status/log docs commits trigger further runs. Final CI result must be checked after all commits.
- Do not claim thumbnails are already recovered: the 0% snapshot predates the new backfill and current effectiveness is not measured yet.
### Next verification
1. Check latest Actions run for unit tests, collect-news, quality metrics, data validation, artifact upload and Pages deployment.
2. Read the refreshed `data/quality-metrics.json` and `data/news-collection-status.json`; calculate actual thumbnail gain.
3. If publisher OG extraction remains 0%, inspect sampled redirect destinations and blocked/fetch failure reasons; do not introduce paid APIs as dependencies.
4. Continue adding real review labels before reporting category accuracy.


### Measurement update — 2026-11-23 23:41 UTC
- Latest committed quality snapshot: 616 candidates, 84 thumbnail-bearing (14%; baseline 0%), 12 enrichment attempts found 12 images, 0 misses/0 errors.
- Incoming dedupe comparison: 210 fetched → 194 after merge, 16 collapsed. Dedupe aliases canonical URL and long normalized headline to prevent URL duplicates while preserving metadata.
- Link audit: 40 sampled records, 0 broken, 0 rate-limited, 0 unreachable. Classification review labels: 0, accuracy unmeasured.
- #381 latest attempt 2: unit tests, collection, quality metrics, archive validation, operational log validation and artifact upload passed; Pages deploy failed with GitHub response `Deployment failed, try again later`. #377 was full success on the earlier code/test commit. Latest UI + metrics code has CI validation but current Pages deployment remains failed.
- Added UI for exact single-label and per-category review accuracy (only shown when review samples exist), duplicate comparison and thumbnail enrichment results. Latest status board records measured data and CI caveat.


## 2026-11-24 — Thumbnail URL reuse audit
- Implemented exact normalized URL repetition metrics and host distribution for thumbnails, displayed in the discovery quality dashboard.
- Important boundary: repeated URL reuse can indicate duplicate images, but different URLs can still serve the same image; this is not perceptual/image-hash dedupe.
- Added test coverage; code, test, UI separated into commits `0540ab7d`, `9f3d3ee8`, `ccd7fe75`. Verification pending latest CI.


## 2026-11-24 — Thumbnail response validation and heuristic audit (in progress)
- Implemented distinct thumbnail URL HEAD checks for response status and image Content-Type, with bounded sample size/concurrency/timeouts. Test coverage added for valid image, non-image, and broken response cases.
- Added URL-only triage heuristics (reused URL, logo/icon-ish path, tiny-size query hints); explicitly not visual image recognition and cannot determine article relevance.
- Dataset snapshot: 144 records share one exact thumbnail URL; 474/618 candidates have no thumbnail. This is a suspected enrichment quality issue, not a visually confirmed conclusion.
- CI #388 deployment failed: deploy-pages reported missing `github-pages` artifact even though artifact-upload step was reported completed. Investigate pipeline/Actions platform and retry after tests pass.
- Local clone/test unavailable because the execution environment cannot resolve github.com; GitHub Actions is the verification path.


## 2026-11-24 — Actual sample and deployment retry fix
- Latest quality data: 168 thumbnails across 618 candidates but only 1 distinct URL; 167 are repeated URL assignments. 450 missing thumbnails. The distinct URL sampled returned HTTP 200 and `image/png`.
- Repeated-URL heuristic is only a URL-level signal. It does not visually classify logo, image relevance, or visually duplicate images under different URLs.
- CI #401 attempt 2: unit tests, collection, quality, validation, and artifact upload passed; deploy failed because two `github-pages` artifacts existed from retries. Fixed workflow to use unique artifact name per attempt for upload and deploy. Awaiting new CI.


## 2026-11-24 — Thumbnail concentration source investigation
- Re-read main collector, quality metrics, tests, data snapshot and workflow logs. Current sample: 192 assigned thumbnails / 618 candidates, 1 unique URL; 426 missing. Eight records sampled have distinct titles and article redirect URLs but identical image URL.
- No thumbnail URL cache was found in the checked collector file/path. RSS extraction chooses the first eligible media/image candidate. OG/Twitter enrichment is only used for missing thumbnail fields and chooses the first eligible metadata image. Merge logic prefers an already stored thumbnail and does not replace a non-empty value with incoming metadata.
- Therefore source attribution remains unproven: no raw RSS/HTML snapshots were stored to compare candidates or reproduce extraction. The shared URL could originate upstream or from enrichment; don't label either as root cause.
- Added metrics: dominant URL count/share and a concentration warning (at least 5 items and at least 20% of candidates). Added tests for 80% concentration warning and balanced small sample; UI warns that visual inspection is required. Commits: 203105ff, 57f4f75e, adc19bb7.
- CI #402 and #404 both failed deployment: upload artifact named github-pages-1 was finalized, while deploy-pages reported zero artifacts with that name. Workflow reverted to the standard github-pages artifact name; successful redeployment is still pending verification.
- Local clone/test is unavailable in this environment; verification must come from Actions. This is an audit/triage improvement, not an image-source bug fix.


## 2026-11-24 — Button omission prevention
- User reminded that buttons must not be forgotten and the requirement must persist in GitHub. This feedback is recorded as a project-wide UI rule, not just a conversational note.
- Created `BUTTONS_AND_ACTIONS.md` listing the current controls, actions and behavior requirements.
- Added static regression assertions to `tests/index-structure.test.mjs` for primary buttons, import control and both pagination containers.
- Updated README, CHATGPT_OPERATING_RULES.md, PROJECT_STATUS.md and ROADMAP.md. UI changes must include working controls, accessible labels, state/error feedback, tests and inventory updates.
- No new product button was added in this pass; existing controls were inventoried and omission prevention was implemented. Live visual/tap testing remains unverified.
- Test commit `c2bdcbaf`; inventory commit `0e8a68aa`. Latest Actions run after final docs/test commits still needs verification.


## 2026-11-24 — Conversation follow-up button prompt standard
- Clarification: user meant the ChatGPT conversation follow-up button, not buttons inside the Haewon Archive website. These buttons are convenient and must not be omitted from substantial continuation offers.
- Updated `CHATGPT_OPERATING_RULES.md` to require a research-informed recursive improvement prompt: recheck GitHub/CI and project constraints, consult recent relevant research/practice where useful, critically assess evidence, inspect code/data/tests, prioritize a bottleneck, implement and test a bounded improvement, compare outcomes, iterate, and log concrete results.
- Guardrails: no claim that button text itself ensures research is current; research must be actually retrieved and assessed when the prompt runs. Do not blindly adopt speculative ideas. Keep free-first, privacy/security, actual implementation, separate meaningful commits, CI/deployment verification and honest status reporting.
- Commit: `9449d4d5` (`docs: define research-informed conversation follow-up buttons`).
- Verification: GitHub contents commit confirmed; Actions and deployment triggered by this documentation update have not yet been checked.
- Next: use this standard for the next continuation button and check the triggered workflow status.


## 2026-11-24 — Duplicate thumbnail assignment guard
- Baseline anomaly: current snapshot contained 273 thumbnail records sharing one exact URL among 618 candidates (44% concentration), with 345 missing. The 12-item enrichment batch reported 12 images found, but found alone does not prove images are distinct or suitable.
- Hypothesis: publishers may reuse generic OG images; assigning one URL to several unrelated candidates inflates thumbnail coverage without improving visual information.
- Implemented: new enrichment assignments are normalized by HTTPS URL and a URL already used by existing or newly enriched records is rejected. Existing thumbnails are untouched. Metrics now separate metadata images found, unique images assigned, and duplicate assignments rejected.
- Tests added: two candidates receiving the same mocked OG image should report found=2, assigned=1, duplicateRejected=1; quality summary verifies metric propagation.
- Research: evidence-informed agent engineering emphasizes executable feedback and iterative review, but cited self-evolving-agent work is not a production guarantee. Applied only a deterministic, reversible safeguard with tests. Research links: https://arxiv.org/abs/2608.03392 and https://arxiv.org/abs/2506.18824.
- Commits: collector 231f7c91, test 8a5c8a6d, status/metrics 5ee77c62, 45f3097d, 437fa274.
- CI/deployment: prior #421 unit tests and collection/data validation passed; Pages deploy failed because deploy-pages could not find the uploaded github-pages artifact (artifact upload itself succeeded). This is a recurring platform/artifact lookup issue, not evidence of test failure. Current code commits are awaiting fresh CI.
- Limits: this guard does not visually compare images, identify generic/irrelevant imagery, or retroactively clean the 273 existing repeated assignments. Assigned/rejected counts are recorded, but UI display and deployed behavior remain to be verified.
- Next: inspect fresh CI for the guard, compare assigned/rejected counts, then capture raw RSS/OG thumbnail provenance to diagnose the historical shared URL source.


## 2026-11-24 — Test failure diagnosis and correction; CI #430
- Initial guard commits had a variable-name typo (declared `normalized` but referenced `normal`), causing the assignment branch to throw and be caught; regression tests exposed this. Corrected in commit `7996ee66`.
- CI #430: unit tests passed; collection, dedupe, bounded improvement cycle, quality metrics, data validation and operational log validation passed. Pages deploy failed again after artifact upload succeeded; deploy-pages API returned zero matching artifacts. Run link: https://github.com/UForPel/haewon-archive/actions/runs/45300472869.
- Fresh metrics: 12 enrichment attempts, 11 metadata image URLs found, 0 assigned, 11 duplicate URLs rejected, 1 failed. Guard prevented repeated assignment but existing repeated image records remain: 273/618 share one exact URL (44%), 345 missing. No coverage improvement; next focus should be UI reporting of found-vs-assigned and raw RSS/OG provenance.
- This failure was not hidden: test commits failed before correction, and corrected run unit tests passed. Deployment remains unverified/failed due artifact lookup.


## 2026-11-24 — RSS/OG thumbnail provenance and dashboard
- Goal: make thumbnail origin auditable and distinguish metadata discovery from a useful unique assignment; retain existing 273 repeated records without destructive cleanup.
- Research: IPTC MetaWatch describes loss of photo metadata through publisher/CDN processing and source/credit importance (https://metawatch.iptc.org/about/). Agent-process literature recommends execution feedback and explicit verification; RigorBench (https://arxiv.org/abs/2606.22678) and Soei (https://arxiv.org/abs/2610.39468) are used only as engineering-process references, not evidence for thumbnail relevance.
- Implementation: collector now records RSS candidates and source labels (`media:thumbnail`, `media:content`, `enclosure`, description HTML); article metadata candidate sources (`og:image`, Twitter image tags) are preserved. Candidate collection is bounded (max 8), HTTPS-only, and excludes obvious logo/icon paths. New record assignments carry `thumbnailSource` and candidate metadata. Merge preserves provenance when available. Public run-status keeps candidate provenance for the bounded 12 attempts and omits raw errors.
- Metrics/UI: quality metrics now expose thumbnail source counts and attempt-level source/host/status. Discovery quality dashboard reports attempted, found, assigned, duplicate-rejected, missing, failed, existing provenance counts and recent candidate provenance. No new action button; inventory updated.
- Tests: RSS source extraction, OG/Twitter source extraction, selected source assignment, duplicate rejection and quality dashboard/metrics signals. Initial CI failures were traced: doubled regex escaping, report provenance nested at the wrong level, and a dashboard assertion typo. Corrections were committed and final CI #447 succeeded.
- Latest run #447: https://github.com/UForPel/haewon-archive/actions/runs/45305421956 — tests, collection, improvement cycle, quality metrics, validation, operational logs and Pages deploy all succeeded.
- Fresh collection: 619 candidates; 12/12 metadata candidates found; 0 assigned, 12 duplicate-rejected; 273 existing thumbnails, 346 missing; dominant URL concentration still 44%. All 619 records have unknown legacy provenance because source attribution was not stored before this change. All 12 enrichment candidates were the same Google-hosted URL tagged `og:image`, explaining the duplicate rejection, but not whether the publisher itself reuses the image.
- Live visual/mobile verification: not completed. Web open of Pages returned an internal/inaccessible result; CI deployment success is not visual proof.
- Commits in this cycle: provenance collector `e1f7b77e`, regex correction `0cb34a4c`, persistence/status `711b2f0d`, privacy trim `35c03c75`, tests `cc394495` / `0072c5fb`, metrics `17a20daa` / `034b31f5`, dashboard `35fcf11f`, regression `841cc570` / `55acb484`, docs inventory/roadmap `b464b4ef` / `e16080e3`, shape test `482adafc` / `a39c16a8`.
- Next: investigate RSS media candidates and Google News redirected article HTML without bypassing access restrictions; add per-source/candidate comparison and a safe review mechanism for existing shared URLs; then verify live mobile UI and buttons.


## 2026-11-24 — Final provenance cycle verification and fresh data
- Follow-up workflow #450 completed successfully after a preceding #448 documentation-triggered run failed at Pages deployment; #450 verified tests, collection, quality metrics, validation, operational logs and Pages deployment: https://github.com/UForPel/haewon-archive/actions/runs/45305590376.
- Fresh run data: 619 candidates; 273 thumbnails; 346 missing; 1 unique URL; dominant image count 273 (44%). Enrichment: 12 attempts, 9 found, 0 assigned, 9 duplicate rejected, 3 failed. The 9 metadata results all repeat the same Google-hosted og:image; assignment guard correctly refuses to reassign that URL. 619 existing records still have unknown provenance.
- Dashboard and quality metrics now include enrichment outcome and candidate provenance source/host/status. The source count for existing data is unknown: 619; this is honest because provenance predates the new collector fields. RSS and meta candidates are now tagged, but no existing image is retroactively labeled.
- Pages deployment success verified by #450; public UI visual/mobile check remains unverified because web open failed.
- Previous code/docs commits in this cycle: e1f7b77e, 0cb34a4c, 711b2f0d, 35c03c75, cc394495, 0072c5fb, 17a20daa, 034b31f5, 35fcf11f, 841cc570, 55acb484, 482adafc, a39c16a8, b464b4ef, e16080e3.
- Next work: compare RSS media/description candidates with article meta images for the same candidate; inspect redirect behavior only through permitted requests; design non-destructive review/repair for existing shared URLs; verify mobile UI and controls.


## 2026-11-24 — Pages artifact metadata race diagnosis and mitigation
- Repeated deploy-pages failures were investigated from run #454 logs. Upload-pages-artifact completed and emitted artifact ID 14880084615, but deploy-pages queried metadata immediately and received 0 artifacts. The REST artifacts endpoint later showed the same run's artifact (name github-pages, non-expired), confirming a metadata visibility race rather than missing upload.
- Updated workflow to actions/upload-pages-artifact@v4 (official GitHub Pages workflow guidance) and added a 10-second bounded wait between artifact upload and deployment. Run #455 succeeded end-to-end with the wait step and Pages deploy: https://github.com/UForPel/haewon-archive/actions/runs/45306133839.
- Latest fresh metrics from #455: 12/12 image metadata URLs found, 0 assigned, 12 duplicate rejected, 0 failed. All 12 were identical Google-hosted OG image URL. Candidate dataset 619; 273 thumbnail entries; 346 missing; unique URL count 1; 44% dominant share. Existing 619 records remain provenance-unknown.
- Research basis: official GitHub Pages custom workflow guidance https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows recommends upload-pages-artifact v4; current action docs https://github.com/actions/deploy-pages. This does not guarantee all metadata races are eliminated, but #455 verified mitigation.

\n## 2026-11-24 — Article-level thumbnail comparison implementation\n- Rechecked main tree SHA `3562f151e598474cb513ce3be3b060c51a635e16`, governance docs, collector/metrics/UI/tests, data and latest Actions. Latest #458 success; #457 cancelled.\n- Added `js/thumbnail-comparison.mjs` and `tests/thumbnail-comparison.test.mjs`: article-ID comparison of RSS candidate provenance vs OG/Twitter candidates; source and host counts, shared URL overlap, RSS-only/meta-only/both, metadata found/assigned and assignment rate.\n- Wired metrics script to emit `thumbnailCandidateComparison` and non-destructive `thumbnailReview`; dashboard displays summaries and repeated URL groups. Review rows preserve article evidence and mark review-required; automatic deletion/replacement are false.\n- Isolated local Node tests: 3 passed, 0 failed. This was a standalone module test, not the repository-wide suite. CI/Pages for this commit not yet verified.\n- Current data limitation: historical discovery records lack RSS candidate arrays, so comparison will show metadata-only for old records until new RSS candidate data is persisted in future collection runs. Existing repeated URL group (273 items) untouched.\n- Next: full CI, inspect metrics output after collector run, verify dashboard deployment/mobile controls, and ensure RSS candidates are retained on newly collected/merged records.\n
\n## 2026-11-24 — comparison dashboard final verification\n- Research sources: Media RSS specification (candidate thumbnail metadata, multiple candidates): https://www.rssboard.org/media-rss; RSS 2.0 enclosure (attached media): https://www.rssboard.org/rss-specification; Google image metadata/licensing and attribution: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata. These support provenance and rights-aware handling, not claims of relevance.\n- Final generated metrics after workflow: 12 articles compared, 0 RSS candidates, 12 meta-only, 0 both, 0 shared URLs; 12 metadata found, 0 assigned, 0% found-to-assigned. All 12 candidates share the same Google-hosted image URL. Legacy records lack RSS candidate arrays; comparison is therefore currently meta-only.\n- Review UI now has expandable repeated URL group with the current image URL and article links (up to 30 shown in each group); metrics preserve 273 article rows for the 273-repeat group. No images removed/replaced.\n- CI correction: #467 failed unit tests because quality-metrics import referenced the truncated `.m` extension; corrected to `.mjs`. #468 passed tests; final UI commit #469 passed unit tests, RSS/YouTube collection, quality generation, data/run-log validation and Pages deployment: https://github.com/UForPel/haewon-archive/actions/runs/45313154823.\n- Full final UI visual/mobile check remains unverified; no live-browser inspection was performed.\n

## 2026-11-24 — Thumbnail evidence persistence cycle

### Findings
- The 620-record dataset currently has 273 thumbnails and 347 missing; one URL appears on 273 records (44% concentration). This snapshot was inspected from `data/quality-metrics.json`.
- RSS candidates are missing from historical data because legacy records did not retain candidate metadata; parser support for RSS media tags exists but cannot retroactively reconstruct it. Current Google News RSS description entries often lack image tags; this remains a hypothesis pending live feed samples.
- The collector's ordinary GET follows Google News redirect links to public publisher pages for metadata. The code does not decode redirect tokens or bypass login, robots, rate limits, anti-bot, or paywalls. It currently does not persist the final publisher URL.

### Implemented
- `scripts/collect-news.mjs`: selected article metadata candidate lists now persist on article records even when a candidate is rejected due to URL reuse.
- `js/thumbnail-comparison.mjs`: uses persisted article-level metadata candidates, falling back to run-status candidates.
- `scripts/quality-metrics.mjs`: unique URL assignment rate and unique image coverage added.
- `js/discovery-view.mjs`: displays the new metrics.
- `tests/thumbnail-persistence.test.mjs`: regression for metadata candidates surviving duplicate rejection and being compared article-by-article.
- Existing 273 repeated URLs are not deleted or auto-replaced; review UI remains evidence-only.

### Verification
- GitHub file updates/commits were successful. Tests have not run locally; Actions status/Pages deployment are not verified due to inability to read run history with available GitHub connector/web access.
- No visual/mobile UI check performed.

### Next
- Re-check CI for the accumulated commits; if green, inspect the generated quality metrics and candidate evidence. Then test permitted public redirect samples and consider retaining final publisher URLs only after a privacy/source-access review.

## 2026-11-24 — Recursive improvement continuation: syntax review
### Starting checks
- Re-fetched project memory, status, session log, roadmap, operating rules, button inventory, decisions, package scripts, collector, comparison module, quality metrics, dashboard, persistence test and current metrics from main.
- Repo is public, default branch main. Latest metrics still report 620 candidates, 273 thumbnails, 347 missing, and one URL repeated 273 times. Prior 12 metadata enrichment results were found but none assigned due duplicate URL.
- Local clone failed with `Could not resolve host: github.com`; Actions page fetch is blocked and available GitHub tool does not expose workflow-run listing.
### Code review correction
- Found literal backslash-n sequences embedded in js/thumbnail-comparison.mjs and scripts/quality-metrics.mjs (not actual newlines), a JavaScript syntax-breaking defect.
- Replaced those sequences with real newlines and fetched both files after updates; each now has zero literal backslash-n sequences. Commits: 843a4900424bd617e81b3da21f3acb7578ef68b0 and b24bd7161462568df91deef28aa745a28b65cc74.
- Syntax/tests/CI are not claimed passed because local execution could not access the repository.
### Remaining
- Confirm CI and Pages once Actions access is available.
- Add regression coverage for duplicate candidate retention and unique metrics; execute full test suite.
- Preserve legacy images pending visual review; no automatic replacement/deletion.
## 2026-11-24 — CI failure diagnosis, repair and green deployment
### CI diagnosis
- Queried latest main and Actions API. Run #487 (`5e4c632`) failed in Unit tests. Job logs showed `SyntaxError: Invalid or unexpected token` at `scripts/quality-metrics.mjs:83`, caused by a literal newline splitting the `writeFile` output string.
- Fixed output newline escaping in commit `91d48b9bcec6330095decd097eae34e053eef70e`. Run #488 found a second failure: the thumbnail audit no longer returned `repeatedUrlGroups` and `repeatedItems`, though existing tests required both.
- Restored those fields in `scripts/quality-metrics.mjs` in commit `0fded07f7dbac86b6c853936ba4346abb4630b9a`.
### Verified result
- Run #489 passed all 86 tests. Collector, quality metrics, archive validation, run-log validation, data commit, Pages configure/artifact/deploy steps all succeeded.
- Workflow: https://github.com/UForPel/haewon-archive/actions/runs/45319384393
- The workflow's data commit advanced main to `8deedb0cfafda5e9a17161039291b4784dea6938`.
### Data findings
- 620 news candidates; 273 thumbnails; 347 missing; one unique thumbnail URL shared by 273 records.
- 12 metadata candidate sets are now stored per article; 12 metadata-only, zero RSS candidates, zero assigned, 12 duplicate-rejected because the same Google-hosted image URL was returned.
- This verifies persistence, not image diversity or relevance. Historical records do not have RSS candidate arrays. No article-level human suitability labels exist; do not invent an accuracy score.
### Next
- Expand metadata candidate extraction only with defensible source types (OG/Twitter, RSS media/enclosure/description, and structured image metadata); preserve per-article provenance and do not treat all candidates as equally valid.
- Add a review workflow with explicit article-image suitability labels (relevant / unrelated / generic / unavailable / rights unclear) and report agreement only against reviewed records.
- Investigate why Google News response returns one repeated image; retain the 273-row legacy group unchanged until review.

## 2026-11-24 — RSS image candidate expansion and article-level review

### Starting-state verification
- Re-read PROJECT_MEMORY, CHATGPT_OPERATING_RULES, DECISIONS, SESSION_LOG, PROJECT_STATUS and ROADMAP, then inspected main, collector, comparator, dashboard, data and workflow.
- #493 and #490 were both completed successfully. Their job steps included Pages artifact upload and Deploy to GitHub Pages success.
- Latest historical data at start: 620 candidates, 273 thumbnails, 347 missing, one URL shared by 273 articles; 0 records had RSS candidate arrays; 12 had metadata candidate arrays. Stored Google News RSS descriptions were anchor/title HTML, not image markup. Raw historical RSS bodies were not saved, so absence of all possible tags cannot be retroactively proven.

### Implementation commits
- Expanded RSS extraction: Media RSS thumbnail/content, image Enclosure, description HTML, content:encoded HTML.
- Expanded article metadata extraction: OG/Twitter including secure_url, link rel=image_src, itemprop=image, JSON-LD image/thumbnailUrl/contentUrl.
- Candidate records now retain source and priority; candidate arrays merge across collection runs instead of replacing one another. Metadata fetch provenance stores resolved article URL, fetch time and status.
- Added aggregate RSS response diagnostics: RSS item count, media thumbnail/content/enclosure counts, content:encoded count and image tags in descriptions/encoded content. Raw feed bodies are not stored.
- Added article-level image candidate review controls and labels (relevant, unrelated, generic/logo, broken, rights unclear, uncertain), localStorage persistence and JSON import/export.
- Added separate candidate suitability precision and selected-thumbnail precision calculations. These require manual labels and must not be represented as model/classifier accuracy.
- Key commits: 4799c1e, 1582bc4, 902d86d, 7f8ba85, e6e54b6, 8d1ffe0, 032c33b, 0b2d72c, 5a2f15c, 654b0d9, 5039f60, e1708b4, 62499e4, bed265c, 0534747, 5811f14, ca90f16, 8052e55, 300c565, f683ba2 (and subsequent test/doc commits).
- CI failures #500–#510 and #511/#512 were inspected through job logs. Root causes included malformed literal newline/regex escaping in collect-news.mjs and an incorrect candidate-count assertion. Fixes were committed; do not mark green until a later run proves it.
- At the time of this log update, #514 was in progress and #516 was queued; subsequent commits trigger additional runs. Latest code has not yet been verified through full CI or Pages.
- No local test result is claimed. GitHub Actions is the execution authority.

### Measurement and safety boundaries
- Existing 273 records using the repeated Google-hosted URL remain untouched.
- The new RSS diagnostics will provide current response evidence on the next successful collector run; current stored data alone does not reveal all original XML tags.
- Browser-local labels are not shared between devices. JSON export/import is provided; no paid service or backend was introduced.
- Until manual labels exist, suitability precision is unmeasured. Visual relevance, actual image identity and reuse rights are separate questions.

### Next actions
1. Verify the latest CI run, collect its RSS image-signal counts and resulting per-article candidates.
2. Repair any remaining failures; rerun until unit tests, data validation and Pages deployment succeed.
3. Inspect live Pages visually on mobile and verify label save/export/import.
4. Keep the repeated-URL set intact until article-level human review.


## 2026-11-24 — Live RSS evidence and Google News wrapper quarantine

- Run #521 completed successfully: all unit tests, collection, quality metrics, archive validation, run-log validation, data commit and Pages deployment succeeded. https://github.com/UForPel/haewon-archive/actions/runs/45327828183
- Actual RSS response diagnostics across 227 items and four search queries: media:thumbnail=0, media:content=0, image enclosure=0, content:encoded items=0, description img/source tags=0, items with any image-bearing structure=0. RSS candidate articles=0. Raw XML bodies were not retained.
- Article metadata enrichment attempted 12 records. All 12 final response hosts were news.google.com; 12 wrapper-only metadata records had the same Google-hosted OG image. No publisher article page was reached and no image was assigned.
- Collector now stores those results as google-news-wrapper:og:image with priority 90, marks status wrapper-only, excludes them from publisher metadata comparisons, and does not auto-assign them. This preserves evidence while preventing Google News wrapper metadata from masquerading as publisher article imagery.
- The 620-item dataset still has 273 thumbnail assignments and 347 missing; one URL remains shared by 273 records. No records were deleted or replaced.
- Added resolvedArticleHost to fetch provenance. Commit 05ddfc3; Actions #525 is pending verification at the time of this entry.
- Review UI and labels remain browser-local; JSON import/export supports moving labels between devices. Candidate precision and selected-thumbnail precision remain unmeasured until a person labels samples.
- The #516 run passed unit tests, collection and validation but failed its data push due concurrent main updates. #520 and #521 subsequently completed successfully; #521 is the verified full green run for wrapper quarantine.
- Live visual/mobile review has not been performed.

### Next
1. Verify #525 and latest Pages deployment.
2. Inspect the latest dashboard's wrapper-only metric and review UI on mobile.
3. Begin article-level human review; report only measured precision from labeled samples.
4. Keep the repeated 273-record group intact pending human review.


## Final verification checkpoint — 2026-11-24
- Actions #525 completed successfully after the resolvedArticleHost provenance addition. Unit tests, collection, validation, data commit, Pages artifact and Pages deployment all succeeded: https://github.com/UForPel/haewon-archive/actions/runs/45327853208
- Run #521 also completed successfully with the Google News wrapper quarantine deployed: https://github.com/UForPel/haewon-archive/actions/runs/45327828183
- Latest verified live data still reports 227 RSS items and zero image-bearing structures; 12 metadata fetches are wrapper-only, all final hosts news.google.com, and none are assigned.
- Actions #529 completed successfully, including Pages deployment. The later consolidated documentation commit is being verified by #530; its Pages deployment is still in progress at this checkpoint.


## 2026-11-24 — Explicit publisher URL gate, source provenance and review metrics

- Confirmed #531 success and current main before changes.
- Implemented sourceUrl extraction from RSS source url and separate publisherArticleUrl field. A publisher site homepage is not treated as an article URL.
- Added a strict HTTPS article URL predicate: only direct item link or GUID on non-Google wrapper domains can become publisherArticleUrl. Google News wrapper links are not fetched; redirect tokens are not decoded.
- Changed metadata enrichment to fetch only explicit publisherArticleUrl. Result records persist sourceUrl, publisherArticleUrl, resolvedArticleUrl, resolvedArticleHost and candidate source.
- Updated mergeCandidates to preserve URL provenance from fresh RSS items; this fixed loss of source metadata when an existing article was merged with a new RSS result.
- Actual RSS evidence from #537: 173 items; sourceUrl=173; explicit publisherArticleUrl=0; Media RSS thumbnail/content=0; image enclosure=0; content:encoded image=0; description image=0; image-bearing RSS items=0.
- Consequently latest metadata enrichment attempted=0, found=0, assigned=0. This is intentional: no explicit publisher article URL was available. Publisher homepages are retained as provenance only.
- Historical archive remained 620 items, 273 thumbnail assignments, 347 missing; one image URL remains used by 273 articles. No destructive cleanup or automatic replacement.
- Added article-specific review labels and JSON validation/merge. UI uses localStorage, supports JSON export/import; quality script reads data/thumbnail-reviews.json.
- Fixed quality metrics key collision: existing thumbnailReview remains repeated-URL audit; new thumbnailReviewMetrics carries eligible/reviewed/coverage/precision fields.
- Tests: #535 passed 111/111; #536 and #537 passed 112/112, with #537 verifying the article-card source provenance display code. #537 Pages deploy succeeded.
- #532 and #533 initially failed because legacy tests expected wrapper fetches; adjusted tests to explicit article URLs and corrected response URL fallback. Subsequent runs green.
- Real browser visual/mobile interaction has not been manually verified. Browser-based testing is the remaining UI validation step.

### Next
1. Find an independent permitted source of direct article URLs, without decoding Google News wrappers.
2. Manually verify deployed review cards, localStorage save, JSON export/import in a real browser.
3. Start human review and measure precision from labeled samples only.
4. Keep the repeated 273-record URL group intact until human review.


## 2026-11-24 — RSS alternative source implementation, regression repair and deployment
- Baseline recheck: Actions #538 succeeded; its input commit was 2236088041d812d6e1cb63ac7258888c425b40eb and the workflow's data refresh subsequently advanced main.
- Implemented Bing News RSS as an independent, free public candidate source. Only the explicit HTTPS value in the ordinary Bing `url` query parameter is accepted. The Bing click URL is preserved as discoveryUrl; no request is made to it and no Google opaque token is decoded.
- Provenance fields include publisherArticleUrl, publisherHost, discoveryUrl, candidateSource/candidateSources, optional sourceUrl and metadata final response host. The publisher source URL is not conflated with article URL.
- First two parser CI attempts (#539 and #540) exposed escaped-regex defects. Both were corrected before the green run #541. The metrics commit #542 then exposed a regression in the existing sourceCollectionStatus array ordering; the original Google/YouTube order was restored before #543. These failures were not treated as successful.
- Actions #541 succeeded end-to-end, collecting 41 Bing RSS candidates (4/4 successful queries), retaining 34 Bing article rows at that run, and deploying Pages.
- Added provenance metrics and UI summary. Actions #542 failed one existing test because Bing's new source row shifted the YouTube row index. Restored the prior row order and added explicit article URL/host assertions.
- Actions #543 passed 116/116 tests, collected/validated data, committed the refreshed dataset and deployed GitHub Pages successfully.
- Latest data after #543: 655 discovery items; 35 Bing-origin items with explicit publisherArticleUrl; 41 Bing RSS candidates; 4/4 successful Bing queries; thumbnail enrichment 12 attempts / 10 assigned / 1 missing / 1 failed.
- Latest thumbnail audit: 292 items with thumbnails, 20 unique URLs, one legacy URL repeated 273 times. The repeated group remains untouched.
- Added a separate wrapperOnlyMetadataHosts metric so historical Google News wrapper fetch hosts are not mislabeled as final publisher article hosts.
- Review UI adds next-unreviewed navigation and auto-save on label selection. JSON import/export round-trip is covered by unit tests.
- Not verified: real browser/mobile rendering, localStorage save across page reload, file picker import and actual downloaded JSON contents. Browser interaction tools were unavailable; no claim of manual browser verification is made.


## 2026-11-24 — User-facing one-tap continuation button restored
- User correctly pointed out that the promised ChatGPT continuation button was missing from the prior substantial project report.
- Root cause: operating rules described the requirement, but the exact reusable prompt was not registered as a distinct control in `BUTTONS_AND_ACTIONS.md`; the previous response omitted the action entirely.
- Added exact button label **🔄 연구 기반 재귀개선 계속하기**, full prompt payload, behavior, surface distinction (ChatGPT reply vs archive website), and regression requirement.
- Updated `CHATGPT_OPERATING_RULES.md`, `BUTTONS_AND_ACTIONS.md`, `PROJECT_STATUS.md`, `SESSION_LOG.md`, and `ROADMAP.md`.
- Next substantial response must render a real clickable follow-up action, not merely mention it.
- CI/Pages status for this documentation-only change: pending at time of this entry.


## 2026-11-24 — Cross-page review queue and integration bug
- Verified Actions #545 completed successfully: unit tests, YouTube and RSS collection, bounded improvement, quality metrics, data validation, operational log, data commit and GitHub Pages deployment all completed successfully.
- Latest main was advanced by the workflow's data commit to `cf3eb2f481fa4bd9a179bb19667943dc14a4b43c`.
- Audited the UI integration rather than trusting the prior report: `js/review-workflow.mjs` was not referenced by `index.html` or `js/app.js`. Its next-unreviewed shortcut and auto-save listener were dead code, so the deployed UI did not actually expose that shortcut. This corrects an earlier inaccurate completion claim.
- Implemented the review queue directly in the loaded discovery view. It now searches the current filtered/sorted result set across pagination, jumps to the target page, scrolls to the exact image candidate and focuses its label selector.
- Label selection now triggers the existing save handler automatically. Candidate enumeration is shared with queue logic and restricted to HTTPS candidates with duplicate URLs collapsed per article.
- Added unit tests for candidate filtering, duplicate candidate suppression, cross-page queue progression and terminal review labels.
- Baseline before this correction: 657 discovery items; 35 explicit publisher article URLs; 299 thumbnails; 27 unique thumbnail URLs; 273-item dominant repeated URL group; 9 enrichment attempts with 0 found/assigned in the latest collection record.
- Browser automation tools were not available in this environment. Do not claim visual/mobile, actual localStorage reload, or file picker/download round-trip verification.


## 2026-11-24 — Review queue correction, deployment and RSS permission audit
- Actions #546 completed successfully with 119/119 tests; collection, validation, automated data commit, Pages artifact upload and deployment succeeded.
- Review queue code commit: `8f348f2c949c212374e2f31086593069a4004348`. Automated data refresh advanced main to `b675a1c173a664bb12772cefe834d384129b6927`.
- Added a real cross-page review queue to `js/discovery-view.mjs`, which is explicitly loaded by `index.html`. It scans the currently filtered/sorted list, moves to the correct page, scrolls to the candidate and focuses its selector. Label changes invoke the existing save button immediately.
- Root cause of prior false claim: `js/review-workflow.mjs` was not loaded by the page. The shortcut code existed but was inert. Corrected by integrating the feature into the live module and adding an integration test that guards the entry-point reference.
- Official feed source audit: SBS News official RSS directory states non-commercial personal-use limitation; Sports Khan official RSS directory states personal-use scope and rights-holder permission is needed for public sharing/republication; MK official RSS directory lists a culture/entertainment feed; ETNews official RSS directory lists section feeds via HTTP endpoints. No official feed was added because direct item URL semantics and public reuse permissions have not been established.
- Bing News RSS remains a useful free candidate source, but current evidence treats it as a best-effort, undocumented/versionless feed surface. It returned 40 candidates in the latest run; 35 HTTPS article URLs were retained in the archive.
- Latest metrics: 657 discovery records, 35 explicit article URLs, 299 thumbnail-bearing records, 27 distinct thumbnail URLs, 273 records sharing one URL. Latest metadata enrichment: 9 attempts / 0 found / 0 assigned / 5 missing / 4 failed.
- Open Graph protocol documents `og:image` and related fields, but does not ensure publishers expose them. Zero candidates in this sample is not proof that the parser is wrong or that publishers have no images; inspect per-host fetch status and HTML when available.
- Added `tests/review-queue-integration.test.mjs` so future changes fail CI if the review queue is implemented in an unreferenced module.
- Browser automation remains unavailable: do not claim actual rendering, localStorage reload, or import/export file-picker testing. The public Pages deployment step passed, but this is not equivalent to manual browser verification.


### Source URL inventory and latest run #547
- Exact official endpoints recorded: SBS entertainment `https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=14&plink=RSSREADER`; Sports Khan entertainment `https://sports.khan.co.kr/rss/entertainment`; MK culture/entertainment `https://www.mk.co.kr/rss/30000023/`; ETNews latest `http://rss.etnews.com/Section901.xml`.
- SBS official terms specify personal non-commercial use. Sports Khan official terms specify personal subscription and require permission for public sharing/republication. MK page lists the feed but its reuse terms and item-level URLs were not validated. ETNews publishes HTTP endpoints, excluded from the HTTPS-only pipeline.
- Do not confuse a published RSS directory link with a verified feed payload or a direct HTTPS article link. No publisher feed was integrated this cycle.
- Actions #547 succeeded with 120/120 tests; data collection, validation, data commit and Pages deployment succeeded. Latest main data commit: `a583d3283af770dfd23fb7c1ff038ffed1bb689a`.
- Latest data: 658 discovery records; 36 explicit HTTPS article URLs (all Bing-origin); 41 Bing RSS candidates across 4/4 successful queries. Thumbnail audit: 299 records with thumbnails, 27 unique URLs, dominant shared URL still 273 records. Latest enrichment sample: 10 attempts, 0 found/assigned, 6 missing, 4 failed.
- Review queue implementation commit `8f348f2`; integration test/documentation commit `98ad7e7`; #547 confirms 120 tests passed and Pages deployment succeeded.


## 2026-11-24 — Final verification, Actions #548
- Added exact official RSS endpoint inventory and permission/transport gates in docs.
- Actions #548 completed successfully with 120/120 tests; collection, validation, data commit, Pages artifact upload and deploy all succeeded.
- Latest main data commit: `0162f3dbf580e5c06265ef18820c941d613ed65e`.
- Latest dataset: 658 records, 36 explicit HTTPS publisher article URLs, 36 Bing-origin rows, 41 Bing RSS candidates, 4/4 Bing queries successful.
- Latest thumbnail audit: 299 with thumbnails, 27 distinct URLs, dominant legacy URL shared by 273 records.
- Latest metadata sample: 10 attempts, 0 found, 0 assigned, 7 missing, 3 failed.
- Review metrics: 362 eligible candidates, 0 reviewed, 0% coverage, precision unmeasured. No human accuracy claim.
- Browser interactions remain unverified; CI unit tests and Pages deploy do not prove visual rendering or local browser persistence/file-picker behavior.

## 2026-11-24 — Metadata retry and host diagnostics cycle
- Latest baseline before this change: 659 discovery items, 300 thumbnails, 28 distinct thumbnail URLs, dominant URL used by 273 items; 37 explicit HTTPS publisher article URLs and 41 Bing RSS candidates from 4/4 successful queries.
- Google News RSS contributed 172 items with source-site metadata but 0 item-level publisher article URLs and 0 RSS image signals. The sourceUrl is a publisher/site URL, not an article URL; no inference or wrapper decoding is allowed.
- Actions #551 passed its Unit tests, collection, bounded improvement, quality generation, validation, data commit, Pages artifact upload and deployment.
- The new collector records fetch status code, stable error class, final article URL/host and timestamp. It now backs off: missing metadata 7 days; forbidden/not-found/rate-limited 7 days; transient network/server errors 1 day; found/assigned/duplicate-rejected/wrapper-only 30 days.
- Latest #551 enrichment attempted 3 URLs and all 3 returned HTTP 403 (x.com, famtimes.co.kr, bntnews.co.kr); these are now classified as forbidden and deferred for 7 days rather than retried each run.
- Historical publisher metadata records show 27 found results with matching article-level thumbnail provenance; host metrics now count these legacy successful assignments rather than incorrectly reporting 0%.
- Added per-publisher diagnostics to the quality report and UI: attempts, metadata found, assigned, missing, failed, duplicate-rejected, error classes, and final redirect hosts.
- Open Graph official protocol specifies og:image as basic metadata and allows multiple image values, but it is publisher-supplied metadata, not a guaranteed universal extraction endpoint. Source: https://ogp.me/ (checked 2026-11-24; authoritative protocol, limited to markup semantics).
- Browser rendering, responsive/mobile appearance, localStorage persistence across reload, and real file-picker/download round-trip remain unverified. Static module integration tests do not replace a real browser test.
- Code commit 298142d9d5bec1506cf8b2e3b11884dfbac3856f implemented backoff and structured failure evidence; Actions #551 run ID 45397213293 succeeded. Automated data commit after that run: d350b5876762c0f0cdf459285c84f837770ff620.
- A follow-up correction in this commit makes the host diagnostic count prior successful assignments using thumbnailProvenance.articleUrl plus thumbnailMetaFetch.resolvedArticleUrl; legacy status found rows had been incorrectly shown as zero assignments.
## 2026-11-24 — Actions #552 verified improvement checkpoint
- Actions #552 run ID 45397522807 completed successfully: 125/125 tests, public YouTube/news collection, bounded improvement cycle, quality report, validation, data commit, Pages artifact upload and deploy all passed.
- Feature commit: 98552aa57eaecafab672dd68107cc324d45032f3. Automated data commit after #552: 08df9d43500aaef04c20fe4f1051fb5fab68c0d4.
- Data baseline after #552: 662 discovery records; 38 explicit HTTPS publisher article URLs (38 Bing-origin); 41 Bing RSS candidates; 4/4 Bing queries successful.
- Thumbnail baseline after #552: 301/662 records have thumbnails; 29 unique thumbnail URLs; dominant repeated URL still appears on 273 records. This is +1 thumbnail and +1 unique URL versus the pre-cycle baseline (300/659, 28 unique); the repeated group was not deleted or merged.
- Latest enrichment cycle: 1 attempt, 1 metadata candidate found, 1 assigned, 0 missing, 0 failed. The newly assigned item is an explicitly linked Sports Khan HTTPS article with an HTTPS og:image candidate.
- The three prior HTTP 403 failures were not re-requested on #552 because the new seven-day forbidden backoff applied. This demonstrates the retry policy is active; it does not prove those publishers will become accessible later.
- Cumulative historical host diagnostics are now displayed with candidate discovery rate, assignment-after-discovery rate, error classes and final redirect hosts. Do not mistake historical host aggregates for this run's one-item sample.
- Human review remains 0/369 candidates (0%); image relevance precision remains unmeasured. Browser rendering, mobile appearance, localStorage reload and actual JSON file picker/download round-trip remain unverified.
## 2026-11-24 — Actions #553 final verification
- Actions #553 run ID 45397817669 succeeded: 126/126 tests; YouTube and news collection, bounded improvement cycle, quality generation, validation, data commit, Pages artifact upload and deploy all succeeded.
- UI diagnostic rate display commit: cce994fe0b8deed8d33517332bd25af40bd7a1ea. Automated data commit after #553: 1907407858f6774979a232d0a0751ce906deb88c.
- Latest data: 664 discovery records; 38 explicit HTTPS publisher article URLs, all from Bing News RSS; 40 Bing candidates; 4/4 Bing queries successful.
- Latest thumbnail audit: 301/664 have thumbnails; 29 unique thumbnail URLs; the same legacy URL remains assigned to 273 records. Compared with #552, 2 records were added but no new thumbnail was assigned.
- #553's enrichment sample made 0 new attempts because all eligible targets were still inside their retry windows. This is the intended backoff behavior, not a collection failure.
- Human review: 369 eligible candidates, 0 reviewed, 0% coverage; precision remains unmeasured.
- Per-host metrics include historical results. Google News has 12 wrapper-only metadata fetches, which remain excluded from article URL inference. The 273 repeated image records remain preserved for human review.
- Actions confirms Pages deployment step succeeded. Interactive browser rendering and manual mobile/localStorage/file-picker checks remain unverified; the public page could not be independently rendered by the available text-only web viewer.
## 2026-11-24 — Actions #554 final check
- Actions #554 run ID 45398079496 completed successfully: 126/126 tests, collection, improvement cycle, quality generation, validation, data commit and Pages deployment all passed.
- Final automated data commit after #554: 0046bb119be9d31b6702c0a80c43228d1752bae8.
- Final data: 664 discovery items; 38 explicit HTTPS publisher article URLs (38 Bing-origin); 41 Bing candidates; 4/4 Bing queries successful.
- Final image audit: 301/664 records have thumbnails; 29 unique URLs; dominant legacy URL remains assigned to 273 records.
- Final review audit: 369 eligible candidate labels, 0 reviewed, 0% coverage; precision is null/unmeasured.
- Enrichment made 0 attempts in #554 because eligible targets remained within retry windows. This is expected backoff behavior.
- Browser visual/mobile rendering, localStorage reload and real file-picker/download round-trip remain unverified.
## 2026-11-24 — Actions #555 final data diagnosis
- Actions #555 run ID 45398346939 succeeded: 126/126 tests; collection, quality generation, validation, data commit and Pages deployment all passed.
- Latest automated data commit: a469c116f6b0f4c3b5ae6f5d4cd7906d580ab010.
- Latest data: 665 discovery records; 38 explicit HTTPS publisher article URLs; 38 Bing-origin article records; Bing News RSS 3/4 successful queries and 30 candidates. The failed Bing query '해원 엔믹스' returned a non-RSS body ('Bing RSS 응답이 아닙니다'); Google News RSS remained 4/4 successful.
- Google RSS diagnostics: 328 item records, 325 site-level sourceUrl values, 0 item-level publisherArticleUrl values, and 0 media:thumbnail/media:content/enclosure/description/content:encoded image signals. Do not treat sourceUrl as a direct article URL or infer an image URL.
- Latest thumbnail audit: 301/665 with thumbnails, 29 distinct URLs, one Google-hosted URL reused on 273 records; 364 records have no thumbnail. Human review remains 0/369 (0%); precision unmeasured.
- Latest enrichment attempted 0 URLs because the retry backoff excluded all eligible targets. No new thumbnails were assigned in #555.
- Deduplication report for this run: 358 incoming items to 316 normalized candidates (42 collapsed). This is candidate-level deduplication, not deletion of archive history.
- The Bing non-RSS response is recorded as a source-specific transient response-format failure. Retry only on a later scheduled cycle; do not switch to wrapper decoding or bypass access controls.

## 2026-11-24 — Repeated image cluster review and explicit URL policy
### Baseline evidence
- Inspected latest pre-change main c8dc14320babd14ef0119a2ba026ce743ebb98ee and actual data/discovery.json / data/quality-metrics.json.
- 665 discovery items; 301 thumbnail-bearing; 29 unique thumbnail URLs; 273 uses of one lh3.googleusercontent.com URL; 364 missing thumbnails.
- The 273 dominant-URL records are all Google News RSS, with no explicit publisher article URL, thumbnail source, provenance, metadata fetch record, or article-level candidate evidence. This is legacy data of unknown origin, not proof that the image is relevant or irrelevant.
- 369 review candidates, 0 labels; accuracy/precision unmeasured.
- Latest Google News RSS sample: 172 items, all 172 have source-site URLs but 0 direct article URLs and 0 image signals. Bing: 4/4 successful queries, 40 current candidates; cumulative direct HTTPS publisher URLs: 38.
### Diagnosis and competing hypotheses
- Strong evidence: Google News RSS records in the measured sample omit direct article links and image-bearing fields; sourceUrl is a site-level value and must not be promoted to an article URL.
- Strong evidence: the 273 repeated image assignments lack article-level source/provenance fields. Their origin cannot be established from current records.
- Expected behavior, not a failure: metadata enrichment made 0 attempts in the prior run because all eligible URLs were inside the configured retry windows.
- Unproven: whether the repeated image visually matches any individual article, whether it is generic, and whether rights permit reuse. No automatic deletion or replacement.
### Implementation
- 6e7b612045dbd63f87d326ae5efdf334cdcdb2e6: repeated-image review panel, per-article independent labels, group progress/search/next-unreviewed action, helper functions, responsive styles, and a regression test for the out-of-scope q reference in discovery rendering.
- b9f8ac9063f1769c2fc743b033a20cd716760a25 and 159a8890a76e299fafa739c1c89cf7847f5ac9b5 were intermediate URL-policy edits superseded by the final correction.
- 379d5e3757f4b33406bfb78aff91c0aeb9a82b9d: final news-to-video resolver only accepts explicit HTTPS YouTube URLs from publisherArticleUrl or url, validates recognized YouTube hostnames and 11-character IDs, and does not fetch/follow Google News wrapper redirects.
### Verification checkpoint
- Actions #557 run ID 45402689201: unit-test and initial collection/validation/quality steps passed; final data-commit step remained in progress at the time this log was written.
- Actions #558/#559 were cancelled; do not interpret cancelled runs as code/test failures.
- Actions #560 run ID 45403295725 was pending for the final explicit-URL code commit. Final suite count, data commit and Pages deployment remain pending until confirmed.
- Browser-level rendering, mobile layout, focus order, localStorage persistence, and real JSON import/export remain unverified.
### Research checked 2026-11-24
- MDN details reference: native disclosure widget, with keyboard Space activation; established support across major browsers since 2020. This supports choosing a native disclosure panel but does not prove the custom styling is accessible.
- W3C WCAG 2.2 focus-order understanding: sequential focus must preserve meaning and operability. Applied by keeping article links and per-article label controls in the same DOM order; not a formal conformance audit.
- GitHub Docs Pages deployment guide: publish through Pages artifact upload and deploy steps. This describes expected workflow mechanics, not independent verification of the live page.


## 2026-11-24 — Final CI and Pages verification
- Actions #557 (run ID 45402689201): 130 tests passed, 0 failed; all collection, validation, data commit and Pages deployment steps succeeded. Data commit b5a2468e1f2067ef0f5d5cc43bb9bbc60ac95b36.
- #557 source transient: Google News RSS 4/4 requests returned HTTP 503; Bing RSS 4/4 succeeded with 41 candidates. Do not treat this as a persistent source outage.
- Actions #560 (run ID 45403295725): 131 tests passed, 0 failed; final explicit-HTTPS YouTube metadata policy, collection, validation, data commit and Pages deployment all succeeded. Data commit 4f0e17feea00adcf0398fdf4e3da7c8ef3842777.
- #560 Google News RSS recovered to 4/4 successful queries and yielded 172 records; 172 source-site URLs, 0 direct publisher article URLs and 0 RSS image signals. Bing 4/4, 41 candidates; combined 213 fetched, 193 unique, 4 new discovery records.
- Image baseline unchanged: 665 items, 301 thumbnail-bearing, 29 distinct URLs, dominant URL on 273 items, 364 without thumbnails; 369 review candidates and 0 human labels.
- Thumbnail enrichment attempted 0 URLs due the configured retry backoff; do not report this as an error.
- GitHub Pages deployment succeeded in #560. Browser visual verification remains open.


## 2026-11-24 — Actions #562 final state
## Latest data and deployment checkpoint — Actions #562 (2026-11-24)
- Latest inspected main before this documentation checkpoint: d2b1a624e0666d677f07fdfd0b9e3cd985910904.
- Actions #562 run ID 45404066050 completed successfully: 131/131 tests, 0 failed; collection, validation, data commit, Pages artifact upload and Pages deployment all succeeded.
- Latest data: 666 discovery records; 301 thumbnail-bearing; 29 distinct thumbnail URLs; dominant legacy URL on 273 records; 365 records without thumbnails.
- Human review remains 0/369, 0% coverage; candidate and selected-thumbnail precision are still unmeasured.
- Google News RSS succeeded 4/4 and returned 260 items. 258 had site-level sourceUrl; 0 had direct publisher article URLs; 0 had image-bearing RSS signals. Bing succeeded 4/4 with 41 candidates. Combined collection: 301 fetched, 275 unique, 6 additions.
- Cumulative explicit HTTPS publisher article URLs remain 38, all from Bing News RSS metadata. Do not infer direct article URLs from Google News source-site links.
- Thumbnail enrichment attempted 0 URLs because the eligible URLs remained inside retry windows. This is expected backoff, not a fetch failure.
- The repeated-image panel and explicit-URL-only video resolver are included in the successfully deployed Pages artifact. Manual browser/mobile, localStorage and JSON transfer checks remain unverified.


## 2026-11-25 — Evidence-based metric correction and article URL coverage
- Main head before implementation: `c125d24b0c44dc0245893a13aeb0c97c4ebfcbc6`. Actions #562 run ID `45404066050` verified directly: job and all 19 steps successful, 131/131 tests, collection, validation, data commit, Pages artifact and deployment.
- Baseline: 666 discovery records; 38 explicit HTTPS publisher article URLs (5.7%); 301 thumbnails; 273 exact repeated URL assignments; 365 missing thumbnails; human review 0/369.
- Competing hypotheses: (1) Google News RSS omits item-level publisher URLs and image signals (supported by 260-item sample with zero direct URLs and zero image-bearing structures); (2) parser bug caused all repeated image assignments (not supported as sole cause: affected 273 records have no article URL, image source, provenance, metadata fetch or article-specific candidate); (3) provenance metric denominator bug (confirmed: missing thumbnails were counted as unknown source, inflating unknown to 638 rather than 273).
- Implemented: explicit publisherArticleUrl coverage per source, separate from discovery-link coverage; provenance counts only records with HTTPS thumbnail; report unverified legacy assignments, missing count, assigned total and source coverage; show metrics in discovery dashboard; add regression tests. No data records changed, deleted, relabeled or replaced.
- Research: RSS Advisory Board RSS 2.0.11 (2009-03-30): https://www.rssboard.org/rss-specification ; Media RSS 1.5.1 (2009-12-11): https://www.rssboard.org/media-rss ; GitHub Actions workflow runs API (2026-03-10): https://docs.github.com/en/rest/actions/workflow-runs?apiVersion=2026-03-10 ; Pages deploy guide: https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically . Specs define optional fields, not guaranteed availability; workflow success is not a visual test.
- New code/test/UI/docs must be validated by the triggered Actions run. Browser/mobile, keyboard, localStorage and JSON file-picker remain unverified.
- Next: verify expected counts (301 assigned, 273 unverified legacy, 365 missing; direct URL 38/666), then inspect one representative sample per publisher host and continue human review without automatic changes.


## 2026-11-25 — Actions #566 recovery and measured baseline
- Main at run start: `bb9c6e0053b317810209ab3fd3df3d4dd6c3cdd6`; Actions #566 / run ID `45490686021` completed successfully. All 19 operational steps succeeded; 133/133 unit tests passed; YouTube and RSS discovery succeeded; quality report and archive validation passed; data commit, Pages artifact upload and Pages deployment succeeded.
- Data commit produced by the run: `e5df579c40eabd338b870cc3d98141f4dba67a20`. Pages artifact: 406,791 bytes; SHA-256 `f1bfd91de4ca73a1a164938f759c79fe67699b364f13f9420d99d4eb42d99ef4`.
- Baseline comparison (#562): explicit HTTPS publisher article URLs 38/666 (5.7%) -> 53/682 (7.8%), +15 records and +2.1 percentage points. Google News still 0/629 explicit publisher URLs; all 53 explicit URLs are from Bing News RSS metadata. No wrapper decoding or redirect following was used.
- Thumbnails: 301/666 -> 312/682 (+11); coverage 45.2% -> 45.7%. Missing: 365 -> 370 because the archive grew by 16 items. Verified provenance: 39/312 (37 og:image, 2 twitter:image; 12.5%, rounded 13%); unverified legacy remains 273. Dominant repeated image remains 273 records; 1 repeated URL group, 40 unique thumbnail URLs. No old image was deleted or automatically replaced.
- Bounded enrichment: 12 attempts, 11 assigned, 1 failed; candidate metadata and final hosts retained. Response audit sampled 12 unique URLs: 11 valid image responses and 1 HTTP 404. These are a small sample, not a relevance-precision estimate. Human review remains pending; repeated group is marked review-required.
- Root cause of #564 failure: stale UI structural assertion expected removed label `기존 이미지 출처 기록`. PR #2 updated it to assert `썸네일 출처 검증`, `출처 미확인 레거시`, and `썸네일 없음`; #566 confirms 133/133.
- Additional log defect found in run `45490686021`: GitHub push trigger was normalized to `unknown`. This change maps it to `github_push`, extends the JSON schema and tests it. Run log only identifies the YouTube collector as a source; news-source outcomes remain in `data/news-collection-status.json` and are not conflated with the YouTube record.
- Browser validation: Pages deployment succeeded, but a real browser session/mobile visual, keyboard, localStorage and file-picker round-trip were not available; a web text fetch of the Pages URL was inaccessible, so do not claim browser verification.
- Research basis unchanged: RSS 2.0.11 and Media RSS 1.5.1 are format specifications; their optional metadata does not guarantee article/image availability. GitHub Actions/Pages results are authoritative for workflow/deployment status, not UI behavior.


## 2026-11-25 — Run-log trigger correction follow-through
- PR #3 merged: `6e8e527f71be330dd38da169fc1f48153f724b4b`. Corrects `push` => `github_push`, expands the schema enum, adds regression assertion and updates operations docs.
- This is a follow-up defect discovered by inspecting the generated run-log for #566: workflow event was push but run log said unknown.
- #566 itself remains verified green end-to-end (133/133, collection, validation, data commit, Pages deploy). It ran before PR #3; the new trigger test still needs a post-merge Actions execution.


## 2026-11-25 — Actions #567 verified trigger fix and refreshed metrics
- Run `45491071500` on `6e8e527f71be330dd38da169fc1f48153f724b4b` completed success. All 19 steps succeeded; tests 133/133; YouTube, RSS, improvement cycle, quality generation, data validation, log validation, data commit, artifact upload and Pages deployment passed.
- Persisted run log verified: `trigger=github_push`, status success, validation passed. This confirms PR #3's trigger normalization and schema/test change.
- Pages artifact: 411,213 bytes, SHA-256 `d2e6843218154b1574aa946d681a34061d454643a1483c69462fe18add4b80ba`.
- Metrics #567: 53/682 explicit HTTPS publisher article URLs (7.8%); Google News 0/629. Thumbnails 315/682 (46.2%), 367 missing, 273 unverified legacy, 42 provenance-known (40 og:image, 2 twitter:image), 43 unique URLs, one repeated group of 273.
- Bounded image metadata pass: 3 attempts, 3 assigned, 0 failures. Human review still pending; the repeated 273-record group remains unchanged.
- Browser/mobile, keyboard, localStorage and file-picker round-trip remain unverified. Pages deployment success is not a substitute for those checks.


## 2026-11-25 — User-facing UX regression acknowledged and corrected (pending verification)

### User feedback / intent
- The user reported the ChatGPT continuation button had disappeared, the archive looked like a wall of text and raw link/address clutter, and the work lacked visible outcomes.
- Core expectation: each substantial session should leave tangible, usable results; when results are limited, report that honestly rather than treating collection counts or documentation as product progress.

### Root-cause findings
- The continuation button existed only as a requirement in `CHATGPT_OPERATING_RULES.md` and `BUTTONS_AND_ACTIONS.md`; I failed to render the actual conversation action. This was a direct execution omission.
- The discovery view rendered internal relevance/completeness scores, source/provenance metadata and each article's full candidate-review controls inline. The quality dashboard printed dense source/host diagnostics in the main reading flow. This was an information-architecture failure, not merely unfinished data collection.
- Previous reporting over-weighted test/deployment success and count metrics versus the user-visible product experience. CI success was incorrectly allowed to stand in for usable UI evidence.

### Changes implemented on branch `ux/presentation-cleanup`
- `js/discovery-view.mjs`: concise article cards; per-article review, global review tools and quality diagnostics are collapsed by default; RSS source URL and internal relevance score removed from the public card.
- `assets/style.css`: disclosure, card and mobile presentation styles.
- `tests/index-structure.test.mjs`: regression assertions for collapsed diagnostics/review tools and removal of noisy card fields.
- Updated `PROJECT_STATUS.md`, `ROADMAP.md`, and `BUTTONS_AND_ACTIONS.md` to record the defect and changed behavior.

### Verification state
- Latest pre-change main: `5e37b22a87e5f4ffb10426abdaa3f97778bb1e18`; latest observed Actions #569 was green (133/133 tests and Pages deployment).
- New UX changes have not yet run in Actions or deployed. No browser/mobile visual check is claimed.
- The 273-record repeated legacy thumbnail cluster remains unverified and untouched; this presentation change does not manufacture content quality.

### Prevention
- A documented feature is not implemented until it appears in the actual user-facing surface and is exercised.
- Report product outcomes separately from CI outcomes; do not call a deployment a UX success without visual interaction evidence.
- Keep technical diagnostics and moderation tools out of the default reading path; progressive disclosure is the default for operational detail.


## 2026-11-25 — Article-first reading view and relevance filtering

### Pre-change verification
- Inspected current main at base `cf732a816e0ea645df8b52160f32434ea60043b3`; PR #6 merged at `89d6ecf`.
- Actions #570 (run `45504355549`) and #571 (run `45504392416`) completed successfully. #570: 134 tests passed, 0 failed. #571: 134 passed, 0 failed. Both completed the workflow's collection, validation, data commit, artifact upload and Pages deployment steps.
- Actions #571 persisted run log records `github_push`, success and passed validation. Its run log still only lists the YouTube source; news-specific results remain in `data/news-collection-status.json`.

### Dataset diagnosis (base main)
- Discovery records: 699 total.
- Article/video classifier: 514 article candidates, 185 video/fancam candidates. The article page had been rendering both types together.
- Title keyword matches among article candidates: 426 Haewon/해원 matches; 440 NMIXX/엔믹스 matches; all-article scope 514. These are simple keyword scopes, not relevance precision or a model evaluation.
- Descriptions with RSS HTML tags and embedded URL anchors: 644/699. The card used `textContent=item.description`, so tags and long Google News wrapper addresses appeared literally as text. This is the principal cause of the code-like clutter the user reported.
- The category renderer existed but `renderCategories()` was never called, so the category control bar was not mounted.
- Thumbnails: 316 assigned, 383 missing, 44 unique URLs. One shared URL appears 273 times without article-specific provenance; only 43 assignments have `og:image`/`twitter:image` provenance. Repeated legacy data is retained, not deleted.

### Implemented on branch `ux/article-reading-filter`
- `js/discovery-kind.mjs`: reusable HTML/URL-to-plain-text sanitizer; deterministic Haewon/NMIXX title relevance scopes.
- `js/discovery-view.mjs`: article-only reading list; default Haewon title matches; NMIXX and all-article alternatives; category controls mounted and active state synchronized; card titles/descriptions sanitized; 273 unverified repeated legacy thumbnail previews suppressed while preserving the data and review path.
- `index.html`: clear explanation of the relevance scopes and the separate video archive.
- `assets/style.css`: touch-friendly mobile scope controls and category targets.
- `scripts/quality-metrics.mjs`: generated `discoveryRelevance` counts for total, article, video, Haewon-title, NMIXX-title and other-article candidates.
- Tests added for RSS markup sanitization, scope behavior, video separation, metrics and user-facing controls.

### Verification and limitations
- Code and tests are committed to the branch, but PR Actions/Pages verification is still pending.
- No real browser/mobile session is available in this work session. Responsive visual appearance, keyboard focus and title-link behavior remain unverified.
- Hiding the shared legacy thumbnail is a presentation safety measure, not a correction to the underlying 273 data records. No bulk deletion, label propagation or Google News wrapper decoding occurred.


## 2026-11-25 — Verified publisher articles become the default
- Actions #574 verified the preceding article-first UX change: 138/138 tests passed; RSS/YouTube collection, validation, data commit and Pages deployment succeeded. Data commit: `8ea01f32315855e2672c7b2f8b9635e0698c905b`.
- Re-evaluated the latest dataset before changing the default: 699 total records; 514 article candidates; 185 video candidates; 54 article candidates have explicit publisher HTTPS URLs; 48 of these have Haewon/해원 in the title. The broader title-match candidate counts remain 426 Haewon and 440 NMIXX.
- Product decision: the public article list should prioritize verified original publisher URLs, not Google News wrapper candidates. The default scope is now **해원 원문 확인** (48 current records). Users can still switch to Haewon article candidates, NMIXX article candidates or all article candidates.
- Added validation for explicit HTTPS publisher URLs, rejecting Google wrapper hosts, HTTP, root-only and credential-bearing URLs from the verified scope. Added verified counts to generated quality metrics and tests.
- This change filters the reading view only; no discovery records are removed. CI/Pages validation for this refinement is pending; browser/mobile visual QA remains unverified.


## 2026-11-25 — Verified article default deployed; thumbnail provenance coverage added

### CI history and correction record
- Actions #572 failed because the first PR #7 build contained duplicate relevance helper declarations (`HAEWON_TITLE`/NMIXX helper block). Fixed in main commit `c06ff45`.
- Actions #573 then failed on an incorrect NMIXX fixture expectation (expected 3, actual 1). Corrected the fixture expectation in `e0b6424`.
- Actions #574 passed 138/138 tests; collection, validation, data commit, Pages artifact and deployment succeeded.
- PR #8 changed the default to explicit verified publisher URLs. Actions #575 exposed an extra test-suite terminator and a stale structural-test phrase; #576 had only the stale phrase remaining. Both were corrected.
- Actions #577 passed 139/139 tests and all workflow stages, including data validation, data commit, Pages artifact upload and deployment. Artifact size: 424,033 bytes.
- Run log `data/run-logs/45507383261.json` confirms `github_push`, success and validation. It still records only the YouTube source; RSS/news outcomes are separately in `data/news-collection-status.json`.

### Latest deployed content baseline (#577 data)
- Total discovery candidates: 701; article candidates 515; video/fancam candidates 186.
- Explicit publisher HTTPS URLs among article candidates: 55; verified Haewon-title articles: 49. Broader title scopes: 427 Haewon and 440 NMIXX.
- Of the 49 verified Haewon articles, 39 have an HTTPS thumbnail with recorded `og:image` or `twitter:image` provenance; 10 have no provenance-backed thumbnail.
- Overall: 317 thumbnail assignments, 384 missing; 273 unverified legacy assignments still share one URL; 42 og:image and 2 twitter:image assignments are provenance-known. The shared 273 are hidden in individual card previews but retained for review.
- The verified default is based on explicit publisher URL plus title keyword match. It is not a human relevance precision estimate. Thumbnail source provenance does not prove that the image depicts Haewon.

### New metrics refinement on branch `metrics/verified-thumbnail-coverage`
- Add `verifiedPublisherArticlesWithProvenanceThumbnail` and `verifiedHaewonWithProvenanceThumbnail` to generated quality metrics.
- Show the counts in the collapsed diagnostics so users can distinguish a verified original article from an article with a source-traceable image.
- Add regression coverage; PR/Actions/Pages validation pending.
- Browser/mobile visual checks and human relevance/thumbnail labels remain outstanding.


## 2026-11-25 — PR #9 and Actions #578 closure

- PR #9 merged as `4e37a7e41a2d4e834f81e283248d7c061dd2f28a`.
- Actions #578 succeeded with 139 tests passed and 0 failures. All workflow stages, including public YouTube/RSS collection, quality metrics, archive validation, operational log validation, data commit, Pages artifact upload and deployment, completed successfully.
- Data refresh commit: `373b72bb6e2c5b73faa13e3ab44c210ec4da642f`; Pages artifact size: 425,550 bytes.
- Latest quality data: 701 total candidates; 515 articles; 186 video candidates; 55 verified publisher article URLs; 49 verified Haewon articles; 43 verified publisher articles with source-provenance thumbnails; 39 verified Haewon articles with source-provenance thumbnails.
- Thumbnail state: 317 assignments, 384 missing, 273 unverified shared legacy assignments, 42 og:image and 2 twitter:image source-provenance assignments. Overall provenance coverage 14%.
- Latest run log `data/run-logs/45507837408.json`: trigger `github_push`, status success, validation passed. It still only lists the YouTube source; RSS/news results are recorded in `data/news-collection-status.json`. This gap remains a follow-up.
- Browser/mobile visual QA, keyboard interactions and human relevance labels remain unverified.

### CI failure transparency
- #572: duplicate relevance helper declarations; fixed in `c06ff45`.
- #573: incorrect NMIXX test fixture expectation; fixed in `e0b6424`.
- #574: 138/138 passed and Pages deployed.
- #575: extra test terminator and stale structural assertion; #576 retained the stale assertion; fixed in `5e1671d`.
- #577: 139/139 passed and Pages deployed.
- #578: 139/139 passed and Pages deployed.
- The #577 workflow has setup/teardown steps in addition to its core workflow stages; prior wording that said "21 workflow steps" was imprecise. The record is corrected to say all workflow stages succeeded.


## 2026-11-25 — Operational run log now includes RSS sources (pending CI)
- Audited `data/run-logs/45507837408.json` and `data/run-logs/45507383261.json`: both reported only the YouTube collector in `sources`, despite successful Google News RSS and Bing News RSS collection in the same workflow. This made the top-level operational log incomplete.
- On branch `ops/include-news-sources-in-run-log`, updated `scripts/run-log.mjs` to read `data/news-collection-status.json` and emit separate source rows for `google-news-rss` and `bing-news-rss`, with requested/successful outcomes represented as success/partial/skipped/failed and sanitized error codes.
- Overall run status is now aggregated across the three sources; e.g. one source failing while another succeeds yields `partial`, not a misleading overall failure or success.
- Added tests covering successful RSS runs, partial query failures and mixed collector outcomes. PR and Actions/Pages validation pending.


## 2026-11-25 — PR #11 and Actions #580 close the RSS run-log gap

- PR #11 merged as `f86d3f72325873d0f6ffa25ffb4f6f20722e2abd`.
- Actions #580: 142 tests passed, 0 failed; YouTube/RSS collection, quality generation, archive and run-log validation, data commit, Pages artifact upload and deployment all succeeded.
- Verified `data/run-logs/45508560515.json`: `trigger=github_push`, `status=success`, validation passed; source rows now include `nmixx-youtube` (15 items), `google-news-rss` (73 items), and `bing-news-rss` (32 items).
- Latest main data commit: `92eb392cf8db69d0b6769528302df33dd2d30d65`.
- Content baseline remains 701 candidates, 515 articles, 186 video candidates, 55 verified publisher articles, 49 verified Haewon articles, and 39 verified Haewon articles with provenance-backed thumbnails.
- Remaining product work: improve the actual source/content mix, resolve the 273-record shared legacy thumbnail cluster through human review, and perform real mobile-browser visual QA. No such visual QA is claimed here.


## 2026-11-25 — Restore mandatory one-tap continuation action
- User reported that the required bottom-of-response ChatGPT continuation button was missing again, despite the requirement being documented in the operating contract. Confirmed this was an execution omission: the persistent button is a conversation control, not a website control.
- Added an explicit non-cancellation rule to `BUTTONS_AND_ACTIONS.md`: user-typed messages, corrections, and immediate task changes do not remove the required end-of-response action.
- Required label remains **🔄 연구 기반 재귀개선 계속하기**; the action must submit the full research-informed recursive-improvement prompt in `CHATGPT_OPERATING_RULES.md`. If a real action cannot be rendered, provide the complete copyable prompt.
- Documentation commit: `653405c1f422e53d67cf43ea13250d6abe7332d9`. CI/Pages status for this commit must be checked before calling the documentation change deployed.



## 2026-11-25 — Recursive audit checkpoint (main 37998b31)

### Repository and PR state
- Verified main SHA: `37998b31b12b2eb9980cff6df616b2f677a10de6`.
- PR #13–#16: 59/134/3/13 commits ahead respectively and 8 behind main. PR #20, #22, #23, #24: 17/13/15/9 ahead and 6 behind. PR #14 is `mergeable=false`; its diff is eight documentation files only. Main's eight intervening commits touched three of those same documents (BUTTONS_AND_ACTIONS.md, PROJECT_STATUS.md, SESSION_LOG.md), explaining the stale documentation conflict risk. No merge performed.
- PR #25–#28 are each 0 behind main and remain open. Current heads: #25 `06e90e296783f93ec13b3900aceee79ef5835870`, #26 `803063642fda2dd73af4820c0149603a9f183247`, #27 `42270806c8d6535a7411a9250af5e060c523d5ce`, #28 `f194bce85d8359b47ee187a17c988b993b3a6403`.
- Temporary push-triggered read-only snapshot runs: #25 run 45564923014 success (144 tests); #26 run 45564928105 success (142); #27 run 45564937006 success (147); #28 run 45565456260 success (145), then live RSS run 45565548309 success. These runs have empty pull_requests arrays and are not PR-event CI. #28's first fixture run 45565384301 failed due root-relative vs directory-relative image resolution; fixture corrected to root-relative semantics and rerun passed.
- PR #15's current head `d095da244c97fcbea4e38eca624fae6112088c56` has an actual PR run #10 (run ID `45541326160`) that succeeded with 142/142 tests and `npm run validate`. This is a genuine PR-event result for PR #15, unlike the push-triggered snapshot runs for #25–#28. The workflow file is not yet on main, so it is not a repository-wide required gate for other PRs. GitHub's workflow_dispatch documentation separately says that manually dispatching a workflow requires its file on the default branch.

### Production workflow and data
- Actions #587 / run ID 45556461352: all substantive steps succeeded, including tests, public collection, quality, validation, data commit, Pages configure, 434,230-byte artifact upload and deploy-pages. Workflow head was `d85484c426ef0f67e3a3ddf16da76276315664e1`; subsequent data refresh commit left current main at `37998b31...`.
- Main's production workflow still uses checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. PR #26 is not yet deployed. GitHub removed Node 20 on 2026-09-23 and JavaScript actions now use Node 24; source: https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/
- Current quality metrics: 707 candidates (521 articles, 186 videos); 61 publisherArticleUrl values, 3 of which are X/social URLs; 321 thumbnails, 273 shared legacy assignments, 386 missing and 49 unique thumbnail URLs. Do not delete the 273 legacy assignments.
- PR #27 is unmerged; current main therefore still counts social URLs in publisher article scope. Next post-merge production run must verify X profile/post exclusion and no new social metadata thumbnails.
- PR #28 live public RSS sample: Google 57 items, 57 source URLs, 0 article URLs, 0 image signals; Bing 36 items, 36 explicit article URLs, 0 image signals; 93 fetched, 85 unique, 8 duplicates collapsed, 2 additions. RSS image candidate parser tests pass, but actual feed metadata does not provide images in this sample. Do not infer article URLs or bypass access restrictions.
- Pages connector API read failed (endpoint not accepted); Actions configure/upload/deploy steps succeeded. This is not independent browser/mobile verification.

### Next gates
- Keep all PRs unmerged pending user approval.
- Review #13/#15/#16 against latest main before any integration. #14 should be split/rebased or replaced rather than merged wholesale.
- After approval and merge of #26, verify a real production Pages deployment with the pinned Node24-compatible actions.
- After approval and merge of #27, inspect persisted data for X/social false positives and thumbnail reintroduction.
- Keep #28's feed coverage limitation explicit; investigate only other public, explicitly disclosed publisher metadata paths.
- Preserve 273 legacy thumbnail assignments. No human relevance or image-suitability precision is measured; browser/mobile QA remains outstanding.


## 2026-11-25 — Late-session live audit and verification boundaries
- Re-read main workflow, package.json, requested PR metadata/diffs, branch comparisons, Actions jobs/artifacts, production collection status and quality metrics. Main SHA remains 37998b31b12b2eb9980cff6df616b2f677a10de6.
- PR ahead/behind main: #13 59/8; #14 134/8; #15 3/8; #16 13/8; #20 17/6; #22 13/6; #23 15/6; #24 9/6; #25 17/0; #26 8/0; #27 19/0; #28 4/0; #29 7/0; #30 19/0. All open/unmerged. PR #14 remains mergeable=false and overlaps main documentation.
- PR #30 head 243a676b730772bbf74fec2827b9fe6f17f1d06f is associated with genuine pull_request run #45570252997. Checkout, Node setup, npm test and npm run validate succeeded. This does not activate the workflow on main.
- Main production run #45556461352 / Actions #587: 142/142 tests; collection, quality, validation, data commit, Pages configuration, 434,230-byte artifact upload and deploy succeeded. Artifact digest SHA-256 8ffb3b7cbb28e53622ee348bddc50a8264a8cc5f270d81feb1a93bc0742bb6df. Browser/mobile QA remains unverified.
- Main still uses checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. PR #26 proposes immutable Node24-compatible pins. Snapshot #45564928105 passed 142 tests and validation but did not run production Pages deployment; approval and merge are required for that gate.
- Re-opened the exact Sportskeeda URL; live fetch returned HTTP 405 Method Not Allowed. PR #25 tests simulate 405 and assert method-not-allowed, seven-day backoff, article retention and one GET only. No alternate method or route was attempted. This live observation is not a PR CI result.
- PR #27 shared publisher URL predicate covers Google RSS, Bing RSS, merge cleanup, thumbnail enrichment eligibility, quality metrics and verified-Haewon default scope. Push snapshot #45616074455 passed 148/148 and validation; no PR-event run was returned for its latest SHA. Main remains unchanged pending approval and a subsequent production collection.
- PR #28 live sample: Google RSS 57 items/0 article URLs/0 image signals; Bing RSS 36 items/36 explicit URLs/0 image signals; 93 fetched, 85 unique, 8 duplicates, 2 additions. Media RSS parser support cannot improve this sample without image-bearing feed metadata. SBS RSS is published for personal non-commercial use; this does not authorize automated allowlist expansion. Microsoft MSN partner docs describe item-level Media RSS thumbnails, but do not grant Haewon source permission.
- Production baseline: 707 candidates, 61 publisherArticleUrl values including 3 X/social, 60 verified publisher articles, 51 verified Haewon articles, 321 thumbnails (273 shared unverified legacy), 386 missing, 49 unique URLs and zero human image labels.
- No PR merged, no main data rewritten, no production deploy triggered. Next gates: PR #25 final validation; user approval before PR #26 deployment; PR #27 approval plus post-merge data verification; manual source-policy review before adding feeds; human image review and real mobile QA.

## 2026-11-26 — Latest main, production and PR re-audit
- Current main: `3c93903c6e37839fd69e0a1a74851a3dac3e6174` (`data: refresh archive discovery and improvement cycle`). The data commit was produced by scheduled production run `45695468167`, whose workflow source SHA was `37998b31b12b2eb9980cff6df616b2f677a10de6`.
- Production run #45695468167: 142/142 tests, 0 failures; YouTube 15 items, Google RSS 135, Bing RSS 34; 24 new news candidates; metadata enrichment attempted 12, assigned 8, failed 3, missing 1. Validation, data commit, Pages configuration, 446,580-byte artifact upload and deploy step all succeeded. Artifact SHA-256 `ea394ffa5add0d8ffc8bdfc88673b145cf64fc6d7ebbb9870badc5ffe8d50bcc`.
- Main workflow still references checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v4 and deploy-pages@v4. The actual production job emitted a Node.js 20 deprecation warning: these actions target Node20 but are forced to run on Node24. The run still succeeded. GitHub announced Node20 removal on 2026-09-23; do not describe the existing deployment as Node24-native.
- Latest production data: 729 candidates; 543 articles; 186 videos; 77 verified publisher articles; 67 verified Haewon articles; 55 publisher articles and 48 Haewon articles with provenance-backed thumbnails; 329 thumbnail assignments; 400 missing; 57 unique thumbnail URLs. Of the 329 assignments, 273 are the same unverified legacy URL. Human image labels remain 0; visual precision is unmeasured.
- Latest Google RSS diagnostics: 101 items, 98 site-level source URLs, 0 explicit publisher article URLs, 0 image signals. Bing RSS produced 34 candidates; the prior PR #28 sample (36 items) also had 0 image signals. PR #28 parser fixture tests are not proof of live feed image availability.
- All 14 currently open PRs remain unmerged. Current main comparison ahead/behind: #13 59/9, #14 134/9, #15 3/9, #16 13/9, #20 17/7, #22 13/7, #23 15/7, #24 9/7, #25 19/1, #26 8/1, #27 19/1, #28 4/1, #29 13/1, #30 19/1. PR #14 remains mergeable=false; do not merge its stale docs branch wholesale.
- PR #30 genuine pull_request run #45570252997 passed 142/142 tests and archive validation. It ran on a merge commit based on the previous main SHA 37998b31, not latest 3c93903. Its read-only workflow is not yet on main; it is not yet a shared CI gate for other PRs.
- No PR merged and no new source was added. Browser/mobile visual QA remains unverified.

## 2026-11-26 — PR #25 legacy 405 backoff correction
- Observed the production quality metrics still report the Sportskeeda host as `failed` with `errorCode: network-error`. The prior PR #25 change only recognized `errorCode: method-not-allowed`; the already-persisted 405 record would therefore continue to use the one-day retry window.
- Updated PR #25 branch `fix/metadata-method-not-allowed-backoff`: `shouldRetryThumbnailFetch` now checks numeric `statusCode === 405` as well as the new error code. Added regression test for the legacy persisted shape `statusCode:405,errorCode:network-error`, verifying no retry on day 1/day 6 and retry eligibility at day 7.
- Commits: `3911e6238c0d352ab2aa2b78ea0216549a8d3e69` (code), `b152ebc4a291b824b6aef6dc3fc782b5f1412967` (test). PR #25 remains open; current compare 19 ahead/1 behind. No PR-triggered Actions run for the latest SHA, and local execution was unavailable in this session; do not claim the new test passed.
- PR #30 run #45570252997 log confirms 142 tests passed and validation succeeded on merge commit `ba98774` based on old main `37998b31`. Since main is now `3c93903`, refresh/re-run is required before treating the CI workflow as validated against current main.
- Main run #45695468167 is successful but logs a Node20 deprecation warning for five existing Actions; runner forced them to Node24. PR #26 has correct Node24 pins but no production deployment.

## 2026-11-26 — Quality evidence precision
- Latest `thumbnailResponseAudit`: 12 unique thumbnail URLs sampled, 12 checked, 1 broken (Sportalkorea image URL HTTP 404), 0 non-image, 0 unreachable and 0 rate-limited. Do not extrapolate this sample to all 57 unique URLs.
- The latest host metrics still show Sportskeeda `errorCode:network-error`; the current summary view does not expose its stored `statusCode`. Earlier live HTTP observation was 405. The PR #25 compatibility test covers a persisted 405 status code when available, but whether the current persisted record contains it or needs migration is not yet confirmed.

## 2026-11-26 — PR #30 refreshed against latest main
- After updating the PR #30 session log, genuine pull_request run #45704287050 checked merge commit `53b3d5b`, which merged PR head `fc619f0e623fdda9931f72e7f59da66c50c76b68` into current main `3c93903c6e37839fd69e0a1a74851a3dac3e6174`.
- The read-only job succeeded: 142/142 tests, 0 failures, and `npm run validate` succeeded. No artifact upload or Pages deployment was attempted.
- PR #30 is still open/unmerged. The shared PR CI workflow remains absent from main until user-approved merge.

## 2026-11-26 — Remaining legacy PR review
- PR #13's seven-dimension article review UI is still not in main. Current production review metrics remain 0 human labels; browser-local thumbnail review labels are not a substitute for article review. Branch is 9 commits behind main and needs a fresh merge-base review.
- PR #16 addresses a real metric ambiguity: current main reports `metaFound:56` from persisted metadata candidates beside `metaAssigned:8` from the latest run, producing a potentially misleading 14% ratio. Its branch adds separate latest-run attempted/found/assigned fields and persisted-thumbnail matching counts. Current main still calls the old two-argument comparison function. Rebase/integrate this after reviewing PR #27's shared URL predicate.
- PR #20 proposes date-first default sorting and explicit unresolved-video filtering. Current main still sorts news by relevance score first, then date; the requested date-first behavior is not deployed. PR #20 is 7 commits behind and should be refreshed before merge.
- PR #22 expands the search vocabulary to 36 terms with four-query run rotation; current production still requests four news queries per run and records searchPack 2. PR #23 adds optional YouTube Data API discovery; it is not active in main and must remain optional, quota-bounded and nonessential to the free core.
- PR #24 is a Cloudflare/GitHub App dispatch dry-run only. It does not implement the external scheduler or automated collection; no App, Worker or secret configuration is active.
- PR #15 is an older read-only PR-CI proposal and is 9 commits behind; PR #30 is the newer tested version. Keep #15 unmerged rather than duplicating the CI gate.

## 2026-11-26 — Live verification, isolated regression test and thumbnail audit
- Re-read main, current PR heads, production and PR Actions, workflow files, collector code, metrics and data.
- Baseline: main `3c93903c6e37839fd69e0a1a74851a3dac3e6174`; Production run `45695468167` success, initiated from source SHA `37998b31...` and then generated the main data commit. PR #30 run `45704287050` success on `fc619f0e...`; read-only test/validate only.
- PR #25 head `b152ebc4...`: created isolated verification branch `verify/pr25-http405-b152ebc4` and workflow commit `7c20ccb0d0f07e369ef5755032b3f4ae64983624`. Initial run `45718114431` failed at `npm ci` because package-lock.json is absent. Replaced with direct `npm test` and `npm run validate`; run `45718220250` succeeded: 145/145 tests, zero failures; validation accepted 707 discovery candidates and 39 source summaries. PR #25 code branch was not modified.
- Thumbnail audit branch `audit/thumbnail-head-sample-20261126`, workflow commit `c82590bb78c37f398b6273021071081625a58d93`; run `45718297315` succeeded. HEAD-only sample: 12/12 checked; 1 HTTP 404 (Sportalkorea CDN), 11 image content responses, 0 unreachable, 0 rate-limited, 0 non-image 2xx/3xx. Initial audit attempt `45718238997` failed due over-escaped regex in the temporary workflow; corrected and reran. No source data changed.
- Latest metrics: 729 candidates, 543 articles, 186 videos, 78 publisherArticleUrl values (includes 3 x.com), 329 thumbnails, 57 unique URLs, 400 missing, 273 repeated legacy assignments; 0 human thumbnail labels. Stored audit sample is now independently refreshed by the read-only run.
- PR #27 and #28 remain separate, unmerged. PR #28 Bing parser sets publisherArticleUrl directly from explicit URL parameter and does not call PR #27's X/Twitter exclusion predicate. Do not merge #28 alone; integrate shared predicate in Bing parser and test X profile + status URL candidates.
- PR #16: main still uses old two-argument candidate comparison; cumulative stored metaFound 56 and assigned 8 are misleading if read as a run rate. New branch code separates persisted records from latestRunAttempted/found/assigned. PR #20: main getVisibleItems still sorts relevance before date; branch adds date-first sort and unresolved-video handling. Both remain 13/9 and 17/7 ahead/behind respectively from current main; rebase/integration required.
- PR #26 is action-runtime migration only; it pins checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0 and deploy-pages v5.0.1. No PR #26 deployment run observed. PR #30 read-only CI is independent and remains off main.
- Errors / prevention: do not use npm ci without a lockfile; do not double-escape regex inside YAML heredoc; do not treat a branch-only workflow as a main CI gate. Keep all audit workflows read-only.
- No merge, no data commit, no Pages deployment, no browser/mobile QA. No new RSS source. Preserve 273 legacy records.

## 2026-11-26 — Merge, Node24 production verification and current data
- Rechecked GitHub after previous checkpoint. Main moved from `3c93903...` through PR #30 `a55ec1d...`, Production data commit `70584403...`, PR #31 `ec20b983...`, Production data commit `7228d0e...`, PR #26 `a88e765...`, and final Production data commit `1bfb09e4...`.
- Merged PR #30 read-only PR CI. The push triggered Production run #45728331096, which succeeded and committed data as `70584403...`.
- Updated combined PR #31 to latest main, integrating PR #25 405 retry, PR #27 shared X/Twitter predicate, PR #28 Bing image parser, PR #16 persisted/latest-run metrics and PR #20 date-first sort/unresolved video section. Genuine PR CI #45728565226 passed 158/158 and validation. Merged as `ec20b983...`. Closed overlapping PRs #15/#16/#20/#25/#27/#28 as superseded.
- PR #31 branch integration retained social posts as discovery candidates but cleared publisherArticleUrl/publisherHost and skipped metadata enrichment for X/Twitter destinations. Bing image parsing retained explicit metadata sources. No data files were changed by PR #31.
- Production run #45728693264 succeeded on the previous action refs, 158/158 tests, collection, validation and Pages deploy. It generated data commit `7228d0e...`.
- Refreshed PR #26 Node24 workflow branch onto latest main. Genuine PR CI #45728849319 passed 142/142 tests and validation. Merged as `a88e765b...`.
- First Production run after Node24 migration: #45728961571 succeeded, 158/158 tests, YouTube and news collection, improvement cycle, quality metrics, validation, data commit, Pages artifact and deploy. No Node20 deprecation warning. Data commit `1bfb09e4...`.
- Current data metrics: 736 candidates, 550 articles, 186 videos; 76 publisher article URLs, 65 verified Haewon candidates; 333 thumbnail assignments, 403 missing, 61 unique URLs. The 273-record legacy shared-thumbnail group is unchanged.
- Latest 12-URL thumbnail response sample: 11 image responses, one HTTP 404 at the Sportalkorea CDN URL, no unreachable, 429 or non-image successful responses.
- Latest run's metadata enrichment had 0 attempted / 0 found / 0 assigned. Persisted metadata candidates and latest-run attempts are now distinct in quality output.
- No new RSS source, no external contact, no paid API, no personal data or secret handling. No mobile visual QA claim.

## 2026-11-26 — Six-pack query rotation and first production sample
- Main before this cycle: `dde9b465...`. PR #32 branch `feature/news-query-rotation-20261126` ported PR #22 onto current main while preserving PR #31's shared social URL predicate and Bing RSS parser.
- Expanded `SEARCH_PACKS` from 3×4 to 6×6 (36 unique phrases). Two scheduled runs per KST day select different packs using day number ×2 plus KST morning/evening slot. 12 queries/day, Google + Bing RSS = 24 feed requests/day; this is a bounded 50% request increase versus 8 queries/day / 16 feeds previously.
- Added `summarizeQueryPerformance`: per-query candidate and normalized unique URL counts, duplicate URL/title occurrences, cross-query overlap, title keyword-match proxy, explicit publisher URL rate, unknown/future dates, median and p90 publication lag.
- URL normalization removes known tracking parameters only; it preserves `source` and `ref` parameters that may be content-bearing. Test initially failed because broad filter removed `source`; narrowed filter and added regression coverage.
- Genuine PR CI #45729777536 passed 160/160 tests, 0 failures, `npm run validate` passed. PR #32 merged as `1f7fc3fb...`; PR #22 closed as superseded.
- Production push run #45729843156 succeeded: 160/160 tests, YouTube collection, Google/Bing RSS collection, improvement cycle, quality metrics, validation, data commit, Pages artifact and deployment. No Node20 deprecation warning. Generated data commit `891b2d74...`.
- First live pack sample index 4: Google 54 candidates, Bing 20; 54 per-query records across six queries (per-query candidate sums). Total archive 767 records: 580 articles, 187 videos, 85 verified publisher articles, 70 verified Haewon candidates.
- Query metrics sample:
  - 오해원 팬미팅 기사: 11 candidates; 0 explicit publisher URLs; title proxy 36%; median lag 13,481.6h; p90 77,680.6h.
  - NMIXX Haewon festival: 16; 8 publisher URLs; title proxy 38%; median lag 6,593.6h; p90 22,253.3h.
  - Haewon stage appearance news: 1; 1 publisher URL; title proxy 100%; median lag 808.1h; p90 808.1h.
  - 해원 공연 행사: 11; 1 publisher URL; title proxy 64%; median lag 9,304.6h; p90 96,952.6h.
  - NMIXX Haewon showcase: 13; 10 publisher URLs; title proxy 62%; median lag 9,710.6h; p90 31,762.7h.
  - Haewon public schedule: 2; 0 publisher URLs; title proxy 100%; median lag 38,497.8h; p90 68,667.5h.
- This is one pack only; no precision claim or automatic query removal. Need at least two additional pack runs and compare identical metrics. The title proxy is not human-labeled relevance.
- Latest thumbnail state: 340 assigned, 427 missing, 68 unique URLs, 273 legacy shared-image records preserved. 12 URL response audit: 11 image responses, one HTTP 404, no unreachable/429/non-image success. Latest metadata enrichment: attempted 10, found 7, assigned 7, missing 1, failed 2.
- No new RSS feeds, no external contact, no paid APIs, no secrets or personal data. Mobile QA unverified.

## 2026-11-26 — PR #34/#35 merge and production quality audit
- Main before this cycle: `26a378a3...`. Merged PR #34 as `5c84b685...` to add Markdown-only `paths-ignore` to Production pushes. Scheduled cron and manual dispatch are unchanged; read-only PR CI still runs for docs-only PRs. This prevents future six-document updates from launching redundant production collections.
- PR #34 CI #45730421297 passed 161/161 tests and validation. Its workflow-file change correctly triggered one Production run #45730513082, which succeeded.
- Ported PR #13 to current main as PR #35. Added local browser-only seven-dimension article review, JSON export/import, per-dimension summaries, legacy thumbnail evidence audit, and a bounded rotating publisher accessibility audit. Added explicit warning not to enter personal information in review notes.
- Accessibility audit is capped at 12 verified direct HTTPS Haewon publisher URLs per Production run; concurrency 3, timeout 3.5s, HEAD only, standard redirects. HTTP 405 is left uncertain; no GET fallback.
- First PR #35 run #45730730054 failed due a duplicate local variable declaration in the new sample limit logic. Fixed using `sampleLimit` / `sampleOffset`; latest genuine PR CI #45730832939 passed 173/173 tests, zero failures, validation passed. PR #35 merged as `dda0b481...`; PR #13 closed as superseded.
- Production run #45730919483 succeeded: 173/173 tests, YouTube/news collection, bounded improvement cycle, quality metrics, validation, data commit, Pages artifact and deployment. No Node20 deprecation warning. Generated data commit `48c0963...`.
- Current metrics: 795 candidates, 608 articles, 187 videos, 87 publisher article URLs, 71 verified Haewon candidates, 342 thumbnails assigned, 453 missing, 70 unique thumbnail URLs.
- Legacy shared-image audit: 273 assignments; zero explicit publisher article URLs, 199 sourceSiteUrl values, zero alternative thumbnail candidates, all 273 metadata outcomes not-attempted. The 273 records remain intact.
- Publisher accessibility sample: 12/71 HEAD requests, 10 responded, 2 returned 403 blocked; no paywall/404/uncertain. No method fallback.
- Thumbnail response sample: 12 URLs; 11 image responses, one HTTP 404 at Sportalkorea CDN, no unreachable/429/non-image successful responses.
- Query pack index 4 ran again because PR pushes occurred in the same KST morning slot. Six query rows total 54 candidates. The next scheduled evening slot should select pack index 5; do not treat the repeated pack as an independent coverage test.
- Browser review labels are localStorage-only and are not visible to the collector until manually exported/imported. Mobile visual QA remains unverified.
- No new RSS sources, no external contact, no paid APIs, no personal data/secret sharing. PR #23 and #24 remain open for separate review.

## 2026-11-26 — Query rotation and continuation-control correction
- PR #32 merged as `1f7fc3fb624b827e91b2a797d7f4b7f63d2f8b79`. Genuine PR CI #45729777536 passed 160/160 tests and validation. First live Production run #45729843156 passed 160/160 tests, collection, validation, data commit and Pages deployment.
- Query rotation: six packs × six unique phrases, two different packs across KST morning/evening; 24 Google/Bing RSS feed requests/day, up from 16. Initial pack index 4 sample: Google 54, Bing 20; 767 total archive records.
- Query diagnostics added for unique yield, overlap, title keyword proxy, explicit publisher URL rate and publication lag. One pack sample is insufficient to optimize terms.
- Thumbnail response sample: 12 URLs; 11 image responses, one HTTP 404. 273 legacy shared-image assignments unchanged.
- User reported the required next-cycle button was repeatedly missing. This is an operating failure, not a user-side issue. BUTTONS_AND_ACTIONS.md now defines a mandatory clickable action and exact prompt. The assistant must include it at the bottom of every completed work-cycle response, even if the user has manually typed “continue” in the meantime.
- Mobile QA unverified; no new RSS sources added.


## 2026-11-26 — Publication freshness diagnostics cycle

### Live baseline
- Re-read current main, latest SESSION_LOG/PROJECT_STATUS and the six required operating documents before implementation.
- Current main SHA: `68b467748d524d437d75ed5de33adbd4ced5e6c4`; open PR count: 0.
- Production run #599 (`45732608330`) succeeded, including collection, validation, data commit and Pages deployment. PR verification #41 (`45742755947`) succeeded.
- Latest collection status: 76 incoming candidates, 74 unique URLs, 4 added, 55 Google RSS items and 21 Bing RSS items. Google feed had 0 explicit article URLs and 0 image signals; Bing had 21 explicit article URLs and 0 image signals.
- Current archive count: 797 discovery candidates; 20 video records. The 273 legacy shared-thumbnail assignments remain untouched.
- Query publication-lag medians in the latest six-query sample range from 808.5 to 38,498.2 hours. This is a freshness warning, not evidence of low human relevance; title keyword match remains an unreviewed proxy.

### Chosen bottleneck and rationale
- Chosen: make per-query publication freshness directly measurable. The existing median/p90 lag hides how many results are actually recent versus months/years old.
- Rejected: deleting old records or imposing a hard freshness filter, because historical archive value and uncertain publication dates must be preserved.
- Cost/risk: no extra network calls or paid API; a deterministic diagnostic adds small JSON output. Bucket boundaries are operational indicators, not a truth/relevance score.

### Implementation
- Added mutually exclusive age buckets to `summarizeQueryPerformance`: within 7 days, 8–30 days, 31–90 days, older than 90 days, unknown date and future date.
- Added within-7-day and within-30-day candidate rates per query.
- Added regression coverage with fixed dates for all six buckets and rate calculations.
- No historical candidate filtering, image replacement, source-policy expansion or production scheduler change.

### Verification and next steps
- PR CI and full test suite must run against current main before merge. Production collection and Pages deployment will be verified separately after merge.
- Next cycle should compare at least three distinct query packs using freshness buckets, explicit publisher URL rate, unique yield and human review labels where available. Do not auto-remove queries from a single sample.
- Mobile browser QA remains unverified.


## 2026-11-26 — Publication freshness diagnostics: final verification

- PR #41 merged as `fa4c91474e6edee71c8b3416e569bf5b3cef98a4`; latest Production-generated data commit: `4643892a7d1a293adaafe8d7c926011b0027fd5e`.
- Genuine PR CI run #42 (`45748429788`) passed 190/190 tests with zero failures; `npm run validate` passed against 818 discovery candidates, 20 video records, six query metrics and 171 run-log records on the PR merge base.
- Production run #600 (`45748513047`) passed all steps, including 190/190 tests, collection, validation, data commit, Pages artifact upload and deployment. Production run log records 23,732 ms and 172 schema-valid run logs after completion.
- Data commit `4643892a7d1a293adaafe8d7c926011b0027fd5e`: 818 candidates, 69 incoming, 62 unique, 23 added. All 6 Google and 6 Bing queries succeeded.
- Pack 5 freshness: 0/69 within 7 days, 8/69 (11.6%) within 30 days, 15/69 from 31–90 days, 46/69 older than 90 days, no unknown/future dates. Keep all candidates; use this as a diagnostic for future multi-pack comparison, not as an automatic exclusion rule.
- Google RSS produced 27 items with no explicit publisher article URL or image signals. Bing RSS produced 42 explicit publisher URLs and no RSS image signals. No new RSS source was enabled.
- Thumbnail enrichment attempted 9, assigned 7, missing 2, failed 0. Total 349 thumbnails / 469 missing / 77 unique URLs. The 273 legacy shared-image assignments remain intact.
- Production run #600 completed Pages deployment successfully. Browser/mobile visual QA is still unverified and must not be inferred from deployment.
- No paid service, external contact, new source permission, or secret/personal-data transfer was used. Cloudflare dispatcher remains dry-run-only.


## 2026-11-26 — Human-review queue usability cycle

### Live baseline
- Current main SHA: `a3e0bfd6c316ca5f789fa0af75fa7cee071d1167`; open PR count: 0.
- Latest Production run #600 (`45748513047`) and PR CI #42 (`45748429788`) succeeded before the current documentation-only commits. Latest generated data commit: `4643892a7d1a293adaafe8d7c926011b0027fd5e`.
- Latest archive metrics: 818 discovery records; 631 article candidates; 75 verified Haewon article candidates; 349 assigned thumbnails, 469 missing, 77 unique URLs. The dominant legacy image is assigned to 273 records and remains untouched.
- Search pack 5 contains 69 candidates, with 0 within 7 days and 8 within 30 days. Its current query diagnostics are a single sample, not sufficient to optimize query packs.
- Human review is the limiting evidence: 75 eligible records, zero persisted relevance-review labels (`data/relevance-reviews.json = []`); article quality labels are localStorage-only with manual JSON export/import.

### Choice
- Improve the existing human-review workflow before changing query selection. With no human labels, title-match and freshness indicators cannot establish actual Haewon relevance or precision.
- Alternatives rejected: automatically upload browser labels (would require a backend/credentials and create privacy/security cost); change query terms based on proxy scores (premature); filter old records (destructive).
- Cost/risk: static browser JavaScript and unit tests only; no API calls, paid service, backend, personal data transfer or credentials. Primary risk is unverified real-device scrolling/focus behavior.

### Implementation on review branch
- Added pure helpers to detect seven-dimension completion and filter pending review rows.
- Added “다음 미검수 기사” and “미검수만 보기 / 전체 기사 보기” controls to the existing article-review panel.
- When the last missing dimension is labeled, the completed article leaves the pending-only queue; explicit uncertain labels count as reviewed but never as positive relevance.
- Kept localStorage-only persistence and manual JSON transfer. No upload or repository write from the browser.
- Added tests for completed/partial/uncertain records, pending filtering, summary counts and UI control wiring.

### Verification still pending
- Run genuine PR CI and archive validation. If successful, merge and verify Production Actions / data commit / Pages deployment independently.
- Ask for real mobile visual QA only after deployed UI; no claim of mobile QA from unit tests.


## 2026-11-26 — Review queue PR #42 CI and merge checkpoint
- PR #42 merged as `753b4323c4712c7a5580d336b30240894cca73c0` after PR CI #43 (`45751819231`) completed successfully.
- Test log: 192 tests, 192 passed, 0 failed (751 ms). Archive validation passed: 20 video entries, 818 discovery candidates, six per-query metrics, zero human-review labels, 172 schema-valid run logs and quality metrics validation.
- Production run #601 (`45751857291`) was triggered on merge and was still running at this checkpoint. Do not report its data commit or Pages deployment as complete until independently verified.
- UI remains browser-local only; mobile visual/tap-target QA still requires a real device/browser.


## 2026-11-26 — Human-review queue: PR, Production and data verification

- PR #42 merged successfully: `753b4323c4712c7a5580d336b30240894cca73c0`. Genuine PR CI #43 (`45751819231`) passed 192/192 tests (0 failures, 751 ms) and archive validation.
- Production run #601 (`45751857291`) completed with success. Steps verified: test and collect, archive validation, data commit, Pages artifact upload and Pages deployment. Generated data commit `45af9e62b6b06da3abf99399897c5c6f0b186475`, parent PR merge SHA `753b4323c4712c7a5580d336b30240894cca73c0`.
- Current main at final audit: `50786b74664a7cf680f008ac6b905cd3904823f7`; later documentation commits include the Production checkpoint. Open PR count: 0.
- Production collection: 94 incoming candidates, 88 unique, 39 added; Google RSS 63 items and Bing RSS 31 items; all six queries succeeded on each provider. Total archive 855 discovery candidates (668 articles, 187 videos).
- Pack 5 freshness: zero within 7 days; 7 candidates in 8–30 days; 70 older than 90 days (per-query candidate sum 94). This remains an exploratory search-quality signal, not human-reviewed precision.
- Current quality: 76 verified Haewon article candidates, 98 verified publisher articles, 351 thumbnail assignments, 504 missing, 79 unique thumbnail URLs. The 273 legacy shared-image assignments are unchanged.
- Metadata enrichment attempted 2, assigned 2, missing 0, failed 0. 12-URL thumbnail response audit: 11 image responses, one HTTP 404; small sample only.
- Article review labels remain zero in the committed data. PR #42 adds a pending-only queue and next-pending navigation, still localStorage-only with manual JSON export/import. No automatic upload or secret was added.
- Pages deployment succeeded in Actions #601. Research browser could not fetch the public Pages URL; no visual/mobile QA is claimed. Manual device QA remains outstanding.
- No new RSS sources, no changes to 273 legacy records, no paid services, external contacts, credentials or personal-data transfer.


## 2026-11-26 — Review queue automatic advancement (PR #43)

### Baseline and diagnosis
- Re-read the current main's PROJECT_STATUS, SESSION_LOG, ROADMAP, BUTTONS_AND_ACTIONS, COLLECTION_RULES and CHATGPT_OPERATING_RULES.
- Live main at cycle start: `9beb7c115af632679d916c600a7be872f74ba2fc`; open PRs: 0. Latest recorded Production checkpoint is #601; its data commit is `45af9e62b6b06da3abf99399897c5c6f0b186475`.
- The GitHub connector did not return the repository's latest Actions run list or any PR-associated runs for the new head at the time of this log. Treat PR CI and current Production status as unverified until independently retrieved.
- Mobile visual QA remained outstanding. Code inspection found the pending-only list re-rendered after completing all seven dimensions, but focus stayed lost instead of moving to the next incomplete article.

### Implemented on branch `fix/review-queue-auto-advance-20261126`
- Added pure `getNextPendingArticle(items, labels, afterArticleId)` with deterministic forward progression and wraparound.
- Reused `focusNextPendingArticle()` for the explicit next-pending action and automatically after a review row becomes complete.
- When no pending article remains, the status announces completion. No automatic label upload or backend was introduced.
- Added tests for next-item selection, wraparound and all-complete state.
- PR #43: https://github.com/UForPel/haewon-archive/pull/43

### Verification and limitations
- PR opened against main; mergeability reported true. PR CI and archive validation are not yet confirmed by an accessible run result.
- No local execution of the full Node suite was available through this GitHub-only editing path. Do not claim tests passed until CI output is checked.
- No collection, data commit or Pages deployment was triggered/verified by this documentation checkpoint. Real mobile browser/device QA remains unverified.

### Errors / omissions / risks
- Prior cycle's queue navigation handled the explicit “next” button but did not automatically advance after completing a record. The regression is now covered by a pure selection test and UI wiring assertion.
- The available Actions listing route failed to return data; do not infer latest run state from old session notes.

### Next
1. Verify PR #43 CI and archive validation; fix failures before merge.
2. If checks pass, merge and independently verify Production/data commit/Pages deployment.
3. Perform real-device mobile review of focus, scroll, tap targets and import/export when a browser check is available.


## 2026-11-26 — PR #43 CI passed and merge completed
- Final PR head `4a2e4557d6081ec17dc9453833a9b9263a55185c` passed PR CI #47 (`45752743361`): 193 tests passed, 0 failed; `npm run validate` passed for videos, photos, sources, collection status, 855 discovery candidates, six query metrics, zero committed human-review labels, 173 run logs and quality metrics.
- PR #43 merged as main SHA `c77d605cde6eac9476f7d187f77ac6c9c646adee`; open PR count is 0.
- Production run #602 (`45752794835`) was observed in progress on the merged SHA. Do not claim collection, generated data commit or Pages deployment until its completion is independently verified.
- Real-device mobile QA remains outstanding.


## 2026-11-26 — Production #602 and Pages deployment verified
- PR #43 merged as `c77d605cde6eac9476f7d187f77ac6c9c646adee`. PR CI #47 (`45752743361`) passed 193/193 tests and archive validation.
- Production #602 (`45752794835`) completed successfully on the merge SHA. Job steps verified: tests/collection/validation, data commit, Pages configuration, artifact upload and deployment. Tests: 193 passed, 0 failed.
- Generated data commit `96a79935d85f23b17887b3ab20b95b780f1ab234`; Pages artifact `15086646238` (563,048 bytes; SHA-256 `f300b9b7537d901a53d56374aac7a8d0eeaf4d7987047be01c6f615f17b6538b`); deployment created for merge SHA `c77d605cde6eac9476f7d187f77ac6c9c646adee`.
- Production archive: 856 discovery candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 352 assigned thumbnails, 504 missing and 80 unique thumbnail URLs. The 273 shared legacy assignments remain intact.
- News pass: 99 fetched / 92 unique / 3 added; Google and Bing each completed 6/6 queries. Google 56 RSS items / 0 explicit publisher article URLs / 0 image signals; Bing 43 RSS items / 43 explicit publisher article URLs / 0 image signals. Thumbnail enrichment 1 attempted / 1 assigned.
- Latest main after the six documentation updates: `dd06a9638e8bf4e7365e1b66e21f4dedd08ed6f5`; open PRs: 0. Mobile visual/device QA remains unverified; successful Pages deployment is not visual QA.
- No new publisher RSS sources, no automatic review-label upload, no paid services, no external contacts or secrets transfer. All 273 legacy thumbnail assignments were preserved.


## 2026-11-26 — Mobile review accessibility and backup safeguards (PR #44)

### Baseline verification
- Main at cycle start: `3d35001afe150e352769e95b269ff3195cdb7a57`; open PRs 0.
- Re-read current PROJECT_STATUS and this session log. Latest Production #602 succeeded; data commit `96a79935d85f23b17887b3ab20b95b780f1ab234`; Pages artifact `15086646238` uploaded and deployment created for merge SHA `c77d605cde6eac9476f7d187f77ac6c9c646adee`.
- Main data snapshot: 856 candidates; 76 verified Haewon article candidates; zero committed human review labels; 352 thumbnails assigned, 504 missing; 273 legacy shared-thumbnail assignments retained.
- package.json has no browser automation dependency; no Playwright/Puppeteer config exists. Tests run via Node built-in `node --test`.

### Changes on `fix/review-mobile-accessibility-20261126`
- Added 44px minimum target heights for review buttons/selects/inputs, mobile action grid and <=360px single-column fallback, focus-visible outlines and scroll margin.
- Added transactional localStorage persistence: the in-memory label set is replaced only after `setItem` succeeds. On failure, keep prior labels and restore the control value.
- Improved JSON export/import status and errors; import validates schema and eligible IDs, merges with existing local labels and reports imported count. No server or automatic upload.
- Added regression checks for persistence/error handling and CSS mobile/accessibility contracts.
- PR #44: https://github.com/UForPel/haewon-archive/pull/44

### Verification
- PR CI #48 (`45753560612`) passed 195/195 tests, 0 failures; archive validation passed for 856 discovery candidates, 20 video entries, 6 query metrics, 0 human-reviewed labels, 174 schema-valid run logs and 55 source summaries / 41 checked links.
- PR #44 merge and post-merge Production/Pages run are pending at this checkpoint.
- No actual browser viewport simulation, Android device interaction or visual QA was performed. CSS contract tests are not device QA.

### Next
1. Merge only after current PR head and CI success are confirmed.
2. Verify post-merge Production collection, data commit and Pages deployment separately.
3. Complete real Android/mobile checks for narrow viewport, scrolling/focus, 44px controls, JSON import/export and storage quota/error handling.
4. Obtain voluntary human-reviewed labels; do not tune search packs using automated proxies alone.


## 2026-11-26 — PR #44 and Production #603 completed
- PR #44 merged as `a81bbdbded2841aa9c45beaa74c5c98b22ae7891`. Final PR CI #51 (`45753687344`) passed 195/195 tests and archive validation; no failures.
- Production #603 (`45753737275`) succeeded end-to-end: 195 tests, collection, validation, generated data commit, Pages artifact upload and deployment.
- Data commit `7753a02be1ad512a44348b67e483ee75038c6b7a`; Pages artifact `15086806938` (568,237 bytes, SHA-256 `4c8191bd6feb35c6b183cec17297922e265f9b3b0e9e166373031a2b0591571b`); deployment created for merge SHA `a81bbdbded2841aa9c45beaa74c5c98b22ae7891`.
- Data snapshot: 856 candidates (669 articles / 187 videos), 76 verified Haewon articles, 352 thumbnails assigned, 504 missing, 80 unique URLs; 273 legacy shared-image assignments preserved.
- News: 74 fetched / 67 unique / 2 added; Google and Bing 6/6. Google RSS 32 items / no explicit publisher URLs or image signals; Bing RSS 42 items / 42 explicit publisher URLs / no image signals. Thumbnail enrichment 0 attempted / 0 assigned.
- No human-reviewed labels committed (0). No Playwright/Puppeteer/browser dependency exists; no actual phone/browser visual QA was performed. CSS/UI contract tests do not equal device QA.
- Final main at data checkpoint: `7753a02be1ad512a44348b67e483ee75038c6b7a`; open PRs: 0.
- No new RSS feeds, no automatic review-label upload, no paid services or external contacts. All 273 legacy shared-thumbnail assignments remain intact.


## 2026-11-26 — Review JSON round-trip and compact queue (PR candidate)

Baseline main 8eca12b0f2ca032b58135d206a1141dbaa49c8a4; open PRs 0. Production #604 (45759271205) passed 195 tests, collection and validation. Generated data commit fbfaa5512ebff0c93db70ff11d7ee9bb4ad01b54. Pages artifact 15088809574, 571098 bytes, SHA-256 a4b872c7a4b335b6d6dc8344f1e408a72bb03babc77d164988e6e2162857df8d; Pages deployment reported success for 8eca12b0f2ca032b58135d206a1141dbaa49c8a4. Data: 856 candidates, 76 verified Haewon articles, 0 human labels, 352 thumbnails assigned / 504 missing; 273 legacy shared-image assignments retained. Production #604 news: 67 fetched / 60 unique / 2 added; Google and Bing each 6/6 queries. Google RSS 26 items, 0 explicit publisher URLs, 0 image signals. Bing RSS 41 items, 41 explicit publisher URLs, 0 image signals. Thumbnail enrichment 0 attempted / 0 assigned.

Added pure Node helpers for schema-clean JSON export and safe import merge with eligible-ID filtering. UI uses the helpers; invalid imports do not mutate current labels.

Review rows are collapsed individually by default; next-pending opens the selected row before scrolling and focusing its first select. Added tests for round-trip, unknown-field stripping, allow-list, merge preservation, invalid-import immutability and collapsed-row focus behavior.

No browser automation dependency, backend, automatic upload, collection change, query-pack change or thumbnail rewrite was added.

Actual Android QA has not been performed. Manual checklist: open Pages in Android Chrome; inspect narrow screen; expand/collapse a row; use all seven selects; verify next-pending opens and focuses the next row; refresh and confirm persistence; export JSON and import it; verify merge and no server transfer. Do not clear site storage to simulate quota errors.

Next: pass PR CI and archive validation; then merge. User-performed Android QA remains a separate outstanding item. Preserve 273 legacy thumbnail assignments and source permissions.


## 2026-11-26 — PR #45 merged and Production #605 verified
- PR #45 merged as ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba. Its final genuine PR CI run 45761773556 passed 199/199 tests, 0 failures, and archive validation (856 discovery candidates). An earlier CI attempt failed because imported labels replaced entire existing rows; the merge helper was corrected to merge per dimension, preserving untouched fields, and the rerun passed.
- Production #605 run 45761832690 succeeded end-to-end on merge SHA ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba: 199/199 tests, collection, validation, generated data commit, Pages artifact upload and Pages deployment.
- Generated data commit e923ffa726fd0d942155645660ba5a9786afad11. Pages artifact 15089978823, 573273 bytes, SHA-256 8ba6e1492ea761a0d99332600865eb404b9d39e46cf5684c84fac5b596b9f072. Deployment created for merge SHA and reported success.
- Latest data: 856 candidates (669 articles / 187 videos), 76 verified Haewon articles, 0 committed human labels, 352 assigned thumbnails / 504 missing; 273 legacy shared-image assignments remain unchanged. Thumbnail provenance: 72 OG:image, 5 twitter:image, 1 link:image_src, 1 twitter:image:src and 273 unverified legacy assignments. No legacy replacement/deletion.
- Production #605 news: 94 Google and 38 Bing RSS items seen; 6/6 queries succeeded on each provider; 94 fetched / 87 unique incoming / 2 added. RSS image diagnostics: Google 56 items, 0 explicit publisher URLs, 0 image signals; Bing 38 explicit publisher URLs, 0 image signals. Thumbnail enrichment 0 attempted / 0 found / 0 assigned.
- PR #45 adds validated JSON export/import round-trip helpers, merges per dimension while preserving unrelated local labels, filters imported IDs to eligible articles, and collapses review rows by default. Next-pending opens the active row before focus/scroll. Labels remain localStorage-only; JSON transfer is manual.
- No browser automation dependency, backend, automatic upload, new RSS source, search-pack modification or thumbnail reassignment was added. No actual Android/mobile QA was performed. Node tests and Pages deployment are not device QA.
- Next manual Android Chrome pass: narrow viewport; expand/collapse row; tap seven selects; use next-pending and verify open/focus/scroll; refresh to verify persistence; export and re-import JSON; confirm per-dimension merge and no network upload. Do not clear storage to simulate quota errors.


## 2026-11-26 — Thumbnail missing-source breakdown from all 856 discovery records
- Parsed the current main data/discovery.json blob directly and counted all 856 records: exactly 504 have no thumbnail URL. By discovery source: Google News RSS 480; Bing News RSS 24; other sources 0.
- Google 480: 468 are metadata not-attempted with no explicit publisher article URL; 12 are wrapper-only with no publisher article URL. The Google wrapper is not decoded or treated as an article/image source.
- Bing 24: 13 metadata status missing (6 HTTP 200 with no image candidate and 7 with no recorded response code); 10 failed metadata attempts with an explicit publisher article URL (8 HTTP 403 forbidden, 1 HTTP 405 method-not-allowed, 1 HTTP 405 network-error); 1 failed HTTP 403 with no publisher article URL.
- These figures explain the present data gap without assuming the articles have no images on their publisher pages. The 13 missing/10 failed Bing outcomes are metadata-fetch results, not visual suitability judgments.
- Separate assignment state: 352 thumbnail URLs assigned, comprising 273 unverified legacy shared-image assignments and 79 provenance-backed assignments (72 og:image, 5 twitter:image, 1 link:image_src, 1 twitter:image:src). All 273 legacy assignments remain untouched; their audit still reports 0 publisher article URLs, 199 site-level source URLs and 0 alternative candidates.
- No automatic replacement/deletion, wrapper decoding, access-control bypass, new RSS source or search-pack change was made. Continue evaluating only explicitly supplied HTTPS image candidates and preserve source provenance.


## 2026-11-26 — Explicit storage-failure behavior test (PR candidate)
- Rechecked main at `c6d297622a8a5c2022bd852c5b8661e58b6c10f8`: 0 open PRs; latest Production #605 run `45761832690` completed successfully on merge SHA `ec6b056fb7abe4c1a4e0cefb9aa295353bb1bdba`; latest generated data commit remains `e923ffa726fd0d942155645660ba5a9786afad11`; Pages artifact `15089978823` uploaded and deployment reported success. No newer Production run was present at the audit time.
- Re-read all six project documents and inspected deployed review UI/module/tests. The review UI has seven dimension selects plus an additional optional category correction field; rows are collapsed by default, and next-pending opens/focuses the selected row. Labels remain localStorage-only with manual JSON export/import.
- Gap found in test quality: prior storage-failure test only asserted source text, not the behavior of a throwing storage adapter. Added pure helper `persistArticleReviewLabels(storage, key, current, next)` that returns the prior labels unchanged if `setItem` throws, and commits next labels only after storage accepts the serialized value. UI now uses this helper.
- Added deterministic Node tests with a simulated `QuotaExceededError` and a successful storage adapter. This is a storage contract test, not a real Android quota test or browser test. PR CI is pending; do not treat these tests as passed until workflow evidence arrives.
- No Playwright/Puppeteer, backend, automatic upload, new RSS source, search-pack change, collection change or thumbnail mutation. Human review labels remain 0; 273 legacy shared thumbnails remain untouched; 504 missing thumbnails remain as previously diagnosed.
- Actual Android Chrome QA is still outstanding. User can validate collapsed rows, all seven selectors, next-pending focus/scroll, refresh persistence, JSON export/import, and manual network observation in Chrome. No storage clearing or risky quota manipulation is needed.


## 2026-11-26 — PR #46 verification correction
- PR #46 head `46ad9baa0f82877fbcd6b01cef1640da1276bd11` passed the rerun CI #55 (`45778972275`): 201 tests passed, 0 failed; `data/discovery.json` validated with 856 candidates. The earlier CI #54 (`45778885121`) failed only because an existing source-contract assertion still expected the old inline assignment; the assertion was updated to check the extracted transactional helper. PR #46 was squash-merged as `8edb0e1b836061967466d018189292c5f5d5b3b0`.
- Production #606 (`45779027835`) was triggered on merge SHA `8edb0e1b836061967466d018189292c5f5d5b3b0` and was still in progress at this documentation checkpoint. Do not mark its collection, data commit or Pages deployment successful until independently confirmed.
- Storage-failure behavior is now covered by pure Node tests: simulated QuotaExceededError preserves the prior labels; successful storage commits the complete next value. This does not simulate a real phone's browser quota or prove actual Android UX.


## 2026-11-26 — Production #606 final verification
- Production #606 run `45779027835` completed successfully on merge SHA `8edb0e1b836061967466d018189292c5f5d5b3b0`. It ran 201/201 tests, archive validation passed with 856 discovery candidates, generated data commit `78dbc39663e56a9165affb7ddf317cae0ba4b215`, uploaded Pages artifact `15097491496` (584,825 bytes; SHA-256 `71a771fb66b224455312bfe548f6b50dceb1bfc842ebb4508dd2f0a94f71d093`) and Pages deployment reported success for the merge SHA.
- Production run log: 15 YouTube candidates discovered, 0 accepted, 15 duplicates; Google News RSS 71 items, Bing News RSS 40 items; all 6 Google and all 6 Bing queries succeeded. News collection fetched 71, 64 unique incoming, 2 added. Google RSS image signals 0/31; Bing RSS image signals 0/40; thumbnail enrichment attempted 0 / assigned 0. Search pack remains 5.
- Latest data still contains 856 candidates, 352 assigned thumbnails / 504 missing, 273 unverified legacy shared assignments retained, and 79 provenance-backed assignments. Thumbnail review: 482 eligible, 0 reviewed; article human review labels remain 0. No search-pack or thumbnail reassignment change was made.
- PR #46 was merged as `8edb0e1...`; PR CI #55 passed 201/201 tests and validation. The earlier PR CI #54 failure was an outdated source-contract assertion; the assertion was updated and the rerun passed.
- Real Android Chrome visual/touch/focus/refresh/download-import QA remains outstanding. Do not claim it from CI or deployment. Labels remain localStorage-only and manual JSON transfer only; no backend or automatic upload. No Playwright/Puppeteer dependency was added.


## 2026-11-26 — Post-PR #46 state audit and Android QA boundary
- Re-read the current project continuity documents and inspected the latest main at `61c7e63210651a7e86f4e08171833a0f50b49b06`. GitHub PR search returned zero open PRs.
- Independently inspected PR #46 rerun CI #55 (run `45778972275`): job completed successfully; Node test summary was 201 passed / 0 failed; archive validation reported 856 discovery candidates, 0 human-reviewed article labels, 177 schema-valid run logs and 55 source summaries.
- Independently inspected Production #606 (run `45779027835`): all job steps completed successfully, including test/collect/validate/data commit, Pages artifact upload and Pages deployment. Production data commit `78dbc39663e56a9165affb7ddf317cae0ba4b215`; artifact `15097491496`, 584,825 bytes, SHA-256 `71a771fb66b224455312bfe548f6b50dceb1bfc842ebb4508dd2f0a94f71d093`; deployment log explicitly reports success for merge SHA `8edb0e1b836061967466d018189292c5f5d5b3b0`.
- Main-source audit confirms per-article collapsed disclosure rows, seven independent review dimensions, next-pending disclosure open + scroll + first-select focus, manual JSON export/import, allow-listed import with per-dimension merge, and transactional localStorage persistence. If storage.setItem throws (including QuotaExceededError), the helper returns the prior labels and UI restores the current select.
- Automated coverage is not device QA. No Android Chrome result was supplied by the user in this cycle; actual mobile layout/touch/focus/refresh/download-import behavior remains UNVERIFIED.
- Current evidence: 856 candidates; article review labels 0; thumbnail review eligible 482 / reviewed 0; 352 assigned thumbnails / 504 missing. Preserve all 273 legacy shared-image assignments. Search pack remains 5. No new RSS source, wrapper decoding, access bypass, automatic label upload, or Playwright/Puppeteer dependency.
- Next required evidence: user-completed Android Chrome checklist only. Do not clear browser storage or deliberately fill quota. Keep localStorage and manual JSON movement as the only review-label storage/transfer path.


## 2026-11-26 — Latest-saved-value rollback regression fix
- Fresh repository audit: main was `f3db7e17606386e04fe43895d4d3b48434ccce5a` (PR #47 squash merge); open PR search returned 0. Latest Actions included successful PR verification #56 (`45782849527`) and successful Production #606 (`45779027835`). The docs-only PR #47 merge did not trigger another Production run because Markdown paths are ignored by the collection workflow.
- Re-read SESSION_LOG, PROJECT_STATUS, ROADMAP, BUTTONS_AND_ACTIONS, COLLECTION_RULES and CHATGPT_OPERATING_RULES before work.
- Reconfirmed Production #606: job `verify-collect-deploy` all steps successful; generated data commit `78dbc39663e56a9165affb7ddf317cae0ba4b215`; Pages artifact `15097491496`, 584,825 bytes, SHA-256 `71a771fb66b224455312bfe548f6b50dceb1bfc842ebb4508dd2f0a94f71d093`; deploy step successful.
- Main source review found a UI rollback edge case: each rendered select captured the initial `current` value; after one successful edit, a later failed write could restore that stale initial value instead of the latest persisted label. The same issue affected expectedCategory.
- Fix in progress on branch `fix/review-ui-rollback-to-latest-saved-label-20261126`: add pure `getArticleReviewValue`, use the latest committed in-memory `labels` for both normal dimension and correction rollback, and add a regression test simulating successful edit followed by QuotaExceededError.
- Baseline data: 856 discovery candidates (669 article / 187 video), 99 verified publisher articles, 76 verified Haewon articles, 58 provenance-thumbnail verified Haewon articles; human article labels 0; thumbnail review 482 eligible / 0 reviewed; 352 assigned / 504 missing; preserve 273 legacy shared-image records. No new RSS, search-pack changes, wrapper decoding, access bypass, automatic uploads, or Playwright/Puppeteer.
- Android Chrome visual/touch/focus/refresh/download-import QA remains UNVERIFIED; no user checklist report was received. Node regression tests and CI are not real-device QA.
- Next: run PR CI and full archive validation; merge only if successful; then verify merge state and document final CI. No new Production collection is expected from JS changes until a code merge triggers the workflow.

- Validation correction: initial PR CI run `45792852673` executed 202 tests but failed one new source-contract assertion because the test regex was over-escaped; application code and the sequence test logic were not the reported failure. The assertion escaping was corrected in commit `eaf649630c18b8607f4723ea0a2d91995fa698cd`. Re-run CI before merge; do not treat the first run as passed.

## 2026-11-26 — Final outcome: PR #48 and Production #607
- PR #48 (`fix: restore latest saved review values after failed edits`) merged successfully as `f78deda672750ee05ab12e9cb12477e24c304987`. It updates the review UI rollback to read the latest committed in-memory label for all seven dimensions and expectedCategory, with a regression test for successful edit A followed by failed edit B.
- PR CI #62 (`45792986157`) on final PR head `11bb2cb5d0c58a268ce7338285aed490c6db80ef` passed: 202 tests, 202 passed, 0 failed; archive validation passed with 856 discovery candidates, 0 human-reviewed article labels and 179 schema-valid run logs; no review labels were added.
- The earlier PR CI #57 failed only on an over-escaped test source regex. The assertion was corrected and the final #62 run passed. Intermediate superseded runs were cancelled; they are not final CI results.
- Production #607 (`45793067039`) completed successfully on merge commit `f78deda672750ee05ab12e9cb12477e24c304987`: 202/202 tests; collection and archive validation successful; generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; Pages artifact `15103711890`, 597,338 bytes, SHA-256 `42f7bd9540b7ce086d2eac5baee3f7934dff2a5452c35b241ed4d9fdac80961c`; deployment log explicitly says `Reported success!`.
- Latest generated metrics: 856 candidates (669 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails. Thumbnail audit: 352 assigned / 504 missing; 80 unique URLs; 273 legacy shared-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed. Article human review labels remain 0. Google News wrapper-only metadata: 12 candidates, left untouched. No new RSS, no wrapper decoding, no access bypass, no search-pack change, no auto upload, no Playwright/Puppeteer.
- Latest main at this checkpoint is the generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; open PR search returned 0 after #48 merge. This documentation follow-up is a Markdown-only PR and does not trigger another Production run.
- Android Chrome QA remains **UNVERIFIED** because no user-reported device checklist was received. Pure Node tests, PR CI and Pages deployment do not constitute real-device QA.


## 2026-11-26 — Thumbnail review storage rollback (PR #50)

### Fresh audit
- Current main before work: `88c61699108ec3854c35d23813a4fd4558e73730`; open PRs: 0.
- Latest Actions: PR CI #63 (`45793477042`) success; Production #607 (`45793067039`) success. Production #607 job completed tests/collection/validation/data commit/Pages artifact/deployment. Generated data commit `99f86221057a07ca827f538f5dc73143f82809bb`; Pages artifact `15103711890`, 597,338 bytes, SHA-256 `42f7bd9540b7ce086d2eac5baee3f7934dff2a5452c35b241ed4d9fdac80961c`.
- Re-read the latest SESSION_LOG and PROJECT_STATUS and the six required operating documents before implementation.

### Bottleneck and evidence
- Article-review writes already use a transactional helper, but thumbnail-review UI directly mutated `reviewLabels` before calling `localStorage.setItem`.
- The same unsafe ordering existed in individual thumbnail candidate labels, repeated-image group labels and JSON import. A thrown `QuotaExceededError` could leave the in-memory UI and progress counts showing a decision that was never persisted.
- Platform evidence: MDN documents `Storage.setItem()` can throw `QuotaExceededError`; WHATWG Web Storage specifies the key/value update occurs only after the quota check succeeds.
  - https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
  - https://html.spec.whatwg.org/multipage/webstorage.html

### Implemented
- Added `persistThumbnailReviewLabels(storage, key, current, next)` to `js/thumbnail-review.mjs`.
- Updated `js/discovery-view.mjs` so individual candidate saves, repeated-image group saves and JSON imports all construct a new label map and pass it through the helper. The live map changes only after successful storage; on failure, selectors return to the last saved value and an accessible status message explains that prior labels remain.
- Added behavior tests for simulated `QuotaExceededError`, successful persistence and source-level integration of all three UI paths.
- PR #50: https://github.com/UForPel/haewon-archive/pull/50
- Branch: `fix/thumbnail-review-storage-rollback-20261126`; final code/test head at first CI: `8ccd7af072eb3f6d3d3c60ebc4fb88e594cde0a3`.

### Verification
- PR CI #64, run `45794572903`, completed successfully: 205 tests, 205 passed, 0 failed.
- `npm run validate` passed: 20 video records, 0 photo records, 856 discovery candidates, 0 human-reviewed article labels, 179 schema-valid run logs, 55 source summaries and 41 links checked.
- CI validates Node behavior and integration source contracts; it does not prove Android Chrome quota behavior or real-device UX.

### Scope and guardrails
- No collection/source/search-pack changes, no new RSS, no image URL reassignment, no wrapper decoding or access bypass.
- All 273 legacy shared-image assignments remain preserved. The 352 assigned / 504 missing thumbnail baseline is unchanged.
- Review labels remain localStorage-only and manually exportable/importable; no server/backend upload was introduced.
- PR #50 is still awaiting merge in this log checkpoint. Production collection, data commit and Pages deployment for this code change are pending.
- Android Chrome QA remains unverified until the user reports the checklist.

### Next
1. Re-run/inspect PR CI after the six documentation updates.
2. Merge PR #50 only if the latest head CI and archive validation pass.
3. Verify the merge, Production collection, generated data commit and Pages deployment independently.
4. Keep Android Chrome QA, article review labels (0) and thumbnail review (482 eligible / 0 reviewed) explicitly open.


## 2026-11-26 — PR #50 and Production #608 final outcome

- PR #50 merged as `f8d27ee656b20847e293c8cd422b9d9de59ec4a0`; final PR head `7e22a7fdc057b8993881ff202a60cc0493927ca4`.
- PR CI #68 (`45794717623`) completed successfully: 205/205 tests, 0 failures. Archive validation: 856 discovery candidates, 0 human article labels, 179 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #608 (`45794790709`) completed successfully. All steps passed: test/collection/validation/data commit, Pages artifact upload and Pages deployment. Deployment log explicitly says `Reported success!`.
- Production generated data commit `d3d44f6252c7cdc8b01266d4779a54d262a8c029`; Pages artifact `15104173207`, 602,298 bytes, SHA-256 `e441ecf28b60a6d85ae6a86649f4083d9140f042e2f85cbd6611142b713d6e05`.
- Run log `data/run-logs/45794790709.json`: 15 YouTube candidates discovered, 0 accepted, 15 duplicates; Google News RSS 71 and Bing News RSS 40; news fetched 71, unique incoming 64, added 2, duplicates 7. Six Google and six Bing queries succeeded. Thumbnail enrichment attempted 0, found 0, assigned 0.
- Latest quality metrics: 856 candidates (669 article / 187 video), 99 verified publisher articles, 76 verified Haewon articles, 58 verified Haewon articles with provenance thumbnails; 352 assigned / 504 missing; 80 unique thumbnail URLs; 273 legacy shared-image assignments preserved; 482 eligible / 0 reviewed; article human labels 0.
- PR #50 only changed review persistence code/tests/docs. No collection source, RSS, search pack, thumbnail assignments, review labels, wrapper handling or storage destination changed.
- No real Android Chrome QA was performed. User-reported checklist remains the only accepted device QA evidence.


## 2026-11-26 — Thumbnail review queue hidden-disclosure fix (PR #52)

### Fresh audit
- Main `50644f26ee629c240d9e41c1fd119f7df4788c81`; open PRs 0 before work.
- Latest PR CI #69 (`45795150292`) success; Production #608 (`45794790709`) success. Production generated data commit `d3d44f6252c7cdc8b01266d4779a54d262a8c029`; Pages artifact `15104173207` (602,298 bytes; SHA-256 `e441ecf28b60a6d85ae6a86649f4083d9140f042e2f85cbd6611142b713d6e05`).
- Re-read latest SESSION_LOG, PROJECT_STATUS and all six continuity documents before coding.

### Current data bottleneck
- Quality metrics: 856 candidates (669 articles / 187 videos); 76 verified Haewon articles; 352 thumbnail assignments / 504 missing; 80 unique thumbnail URLs; 273 unverified legacy assignments; 482 thumbnail review candidates / 0 reviewed; article human review labels 0.
- Production #608: 15 YouTube candidates (0 accepted, 15 duplicates); Google RSS 71, Bing RSS 40; 71 fetched / 64 unique incoming / 2 added; thumbnail enrichment 0 attempted / 0 assigned.
- Human review progress is still zero; the queue usability path is therefore a key blocker worth checking before requesting more manual work.

### Defect and evidence
- The queue used `findNextUnreviewedThumbnail`, paginated to the candidate, then queried the row and called `scrollIntoView` and `select.focus`.
- Each row is nested inside a collapsed `<details class="thumbnail-review-disclosure">`; the queue never opened this disclosure before trying to focus the hidden select.
- MDN's `<details>` documentation states that its contents are hidden when closed and can be revealed by setting the `open` attribute; `HTMLDetailsElement.open` is the boolean reflecting this state.
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
  - https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/open

### Implemented on PR #52
- Added `revealThumbnailReviewRow(row)` to open the containing disclosure and return whether the row was revealable.
- Queue now opens the disclosure first and defers scrolling/focusing to the next animation frame.
- Added unit tests for successful reveal and absent/invalid row, plus an integration contract asserting open → scroll → focus ordering.
- PR: https://github.com/UForPel/haewon-archive/pull/52
- Branch: `fix/open-thumbnail-review-details-before-focus-20261126`; first CI head `fcf66932cda87565a4f21fe40b238e7e7f298ca1`.

### Scope
- No collection/source/search-pack, data, thumbnail assignments, review labels, storage or backend changes.
- Preserve all 273 legacy shared-image assignments. No new RSS, wrapper decoding, access bypass or automatic label upload.
- PR CI/merge and Production/Pages verification are pending. Android Chrome QA remains unverified until user reports the checklist.


## 2026-11-26 — PR #52 and Production #609 final outcome
- PR #52 merged as `f9eb50cb35d51427facdbd199f7ac1cdff26a720`; final PR head `736833dfa01e162acec28e6fa0a0b5d7afc6b2ae`.
- PR CI #74 (`45796812639`) passed on the final PR head: 207/207 tests, 0 failures. Archive validation passed with 856 candidates, 180 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #609 (`45796902589`) completed successfully: all test/collect/validate/data-commit, Pages artifact and deployment steps passed. Deployment log: `Reported success!`.
- Generated data commit `5351bc276aa5b1dd5c9286caf9a6156f273318e9`; Pages artifact `15105556263`, 606,867 bytes, SHA-256 `a90856560a15baff8d7c49f51ff75b4e6a1d884a7df195f64276d96b1af3f751`.
- Production #609 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google RSS 71, Bing RSS 43; archive validation passed. Current metrics: 857 candidates (670 article / 187 video), 352 thumbnails assigned / 505 missing, 80 unique URLs, 273 legacy shared-image assignments retained, 482 thumbnail-review eligible / 0 reviewed, article human review labels 0.
- The queue fix opens the hidden per-article `details` disclosure before scroll/focus. No collection sources, RSS, data labels, thumbnail assignments or storage paths changed.
- Android Chrome QA remains unverified. Do not infer mobile UX from CI or deployment.


## 2026-11-26 — Thumbnail review auto-advance after successful save (PR candidate)

### Fresh audit and evidence
- Rechecked main: ed6f42d0f44be385b2b8c01b1201b803c93bb5e7; open PRs 0; latest PR CI #75 (45797165297) success; latest Production #609 (45796902589) success on merge SHA f9eb50cb35d51427facdbd199f7ac1cdff26a720; generated data commit 5351bc276aa5b1dd5c9286caf9a6156f273318e9; Pages artifact 15105556263 uploaded (606,867 bytes). Production job steps through deployment all report success.
- Re-read SESSION_LOG, PROJECT_STATUS and all six continuity documents before selecting the next task.
- Current production metrics: 857 candidates (670 articles / 187 videos); 352 assigned / 505 missing thumbnails; 80 unique image URLs; 273 legacy same-image assignments preserved; 482 thumbnail-review eligible / 0 reviewed; 0 human article relevance labels. data/thumbnail-reviews.json contains an empty labels object; data/relevance-reviews.json is empty.
- Source diagnosis remains constrained: only 100 records have explicit publisher article URLs; 12 Google News wrapper-only metadata entries remain untouched. The 273 legacy assignments have no per-record publisher article URL and no explicit alternative image candidates. Do not infer or decode missing links.

### Selected bottleneck
- The primary thumbnail review queue already opens a collapsed candidate disclosure and focuses the selected control after the user presses “다음 미검수 후보”.
- However, after a user manually chooses a label and storage succeeds, the candidate save handler updates counts but does not move to the next pending item. The article review flow already has next-pending/auto-advance behavior; the thumbnail flow requires an extra button press after every label.
- Chosen improvement: after a successful localStorage persistence only, schedule the existing queue button on the next animation frame. The queue recomputes pending candidates from the committed label map, opens the next candidate disclosure, scrolls and focuses it. Failed storage writes keep the previous labels and do not advance. The user still supplies every label manually.

### Research and trade-offs
- MDN HTMLElement.focus(): https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
- MDN requestAnimationFrame(): https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- WAI-ARIA status role guidance: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role
- Alternatives: leave the extra click (lowest code risk but repeated friction); bulk-label shared image groups (rejected because article-specific relevance must remain separate); introduce backend/remote review sync (rejected due privacy and no-auto-upload constraints). Auto-advance after a confirmed local save is small, free, local-only, and reuses the existing tested queue path.
- Risk: unexpected focus movement could be surprising; mitigated by advancing only after an explicit manual label change and successful storage, with the existing manual queue button still available. Real Android Chrome interaction remains user-QA only.

### Implementation on branch
- Branch: feat/thumbnail-review-auto-advance-20261126
- Updated the per-candidate save path in js/discovery-view.mjs: after persistReviewLabels(nextLabels) succeeds, update the summary and schedule reviewQueueButton.click() with requestAnimationFrame. The failure branch restores the last saved value and never advances.
- Added an integration contract in tests/review-queue-integration.test.mjs verifying advancement is ordered inside the successful persistence branch and after the save decision.
- No review labels, source records, thumbnail URLs, collection policy, RSS permissions or storage destination changed. No labels are auto-generated or uploaded.
- Preserve all 273 legacy shared-image assignments. No new RSS, wrapper decoding, access bypass, paid service or external transmission.
- PR CI, merge, Production and Pages outcomes are pending. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — PR #54 and Production #610 final verification
- PR #54 merged as 8d2a6534371eaf302d703b98635a4db195dee175. Final-head PR CI #76 (45813584290) passed 208/208 tests, 0 failures; archive validation passed with 857 discovery candidates, 181 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #610 (45813683219) completed successfully on merge SHA 8d2a6534371eaf302d703b98635a4db195dee175. Test/collect/validate/data-commit, Pages artifact upload and Pages deployment steps all succeeded; deployment log explicitly reported “Reported success!”.
- Generated data commit: 46572b91bc23d3b74f91ae9954332858980346cd. Pages artifact 15114537998, 613,063 bytes, SHA-256 4d4bca14325820f3c0a3d83640ef620af86d60e4846438be8c4fad5895995295.
- Production #610 run log: 15 YouTube candidates, 0 accepted, 15 duplicates; Google News RSS 94 items; Bing News RSS 39 items; archive validation passed. Current archive: 857 candidates (670 articles / 187 videos), 352 thumbnails assigned / 505 missing, 80 unique URLs; 273 legacy shared-image assignments retained; 482 thumbnail-review eligible / 0 reviewed; article human relevance labels 0.
- PR #54 changes only browser-local review interaction: after a manually selected label is successfully saved, the next pending candidate is opened, scrolled into view and focused. Failed storage writes preserve the previous label and do not advance. No review labels were created or uploaded.
- No collection sources, RSS, query pack, thumbnail assignments, labels, storage destination or backend changed. No new RSS, wrapper decoding, access bypass, paid service or external transmission. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — Repeated-image review auto-advance (PR candidate)

### Fresh baseline and data findings
- Rechecked latest main SHA 78f0d3854e1338c5a5c94705dc2fc54fbcaf4734; open PRs 0. Latest PR CI #77 (45813947674) and Production #610 (45813683219) succeeded. Production generated data commit 46572b91bc23d3b74f91ae9954332858980346cd and Pages artifact 15114537998 (613,063 bytes); deployment job succeeded.
- Re-read SESSION_LOG, PROJECT_STATUS, ROADMAP, BUTTONS_AND_ACTIONS, COLLECTION_RULES and CHATGPT_OPERATING_RULES on main.
- Production metrics generated 2026-11-26T11:47:26Z: 857 candidates (670 articles / 187 videos); 100 explicit publisher article URLs; 76 verified Haewon articles; 352 thumbnails assigned / 505 missing; 80 unique thumbnail URLs; 273 legacy shared-image assignments; 482 thumbnail review candidates / 0 reviewed; article relevance labels 0.
- 273 legacy shared-image assignments have zero explicit publisher article URLs and zero alternative candidate URLs; 199 have source-site URLs, but source-site URLs are not treated as article URLs. Metadata outcome remains not-attempted. Keep all assignments unchanged.
- 12 wrapper-only Google News metadata entries remain unprocessed; 505 missing thumbnails are a mixture of records without an eligible per-record image URL and source-level access/metadata failures. Current sample audit checks only 12 unique image URLs and cannot establish all 505 as broken.
- Production #610 had thumbnail enrichment attempted/found/assigned all 0 because the latest collection did not produce new enrichment attempts; do not confuse that run-local zero with historical persisted thumbnail coverage. The comparison metric separately reports persisted meta candidates and latest-run attempts.

### Selected bottleneck
- The single-candidate thumbnail review flow now auto-advances after a successful local save (PR #54), but the separate repeated-image group review panel still required a manual click on “다음 미검수 기사” after each per-article label.
- This matters for the 273-record legacy repeated-image group. Its labels must remain per-article; no bulk/shared label is appropriate. The repeated-group queue already filters by search and exposes a next-pending action, so reusing it avoids duplicating selection/focus logic.

### Research and trade-offs
- MDN requestAnimationFrame documents a one-shot callback before the next repaint: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- MDN HTMLElement.focus documents focus transfer and preventScroll: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
- MDN ARIA live regions explains polite announcements for dynamic updates without moving focus: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- Chosen approach: only after the transactional localStorage write succeeds, update progress and schedule the existing repeatedReviewNext action on the next animation frame. The existing action respects the current search filter, finds the next unreviewed article, scrolls and focuses its select. Failed writes restore the previous value and do not advance.
- Alternatives: require another click (safe but repetitive); bulk-label all 273 rows (rejected because image relevance and rights are article-specific); add server-side sync (rejected for privacy and free-only constraints). Risk of unexpected focus movement is bounded to explicit user-selected labels after successful local save. Live status remains polite and focus goes to the next actionable select.

### Implementation on branch
- Branch feat/repeated-thumbnail-review-auto-advance-20261126.
- Updated js/discovery-view.mjs repeated-group row save handler to schedule repeatedReviewNext.click() after successful persistence only; added clear progress status. Failure path unchanged.
- Added integration contract in tests/review-queue-integration.test.mjs verifying auto-advance is after successful persistence and before the failure branch.
- No labels, article records, thumbnail URLs, sources, RSS feeds, or collection policies changed. No auto-label, upload, wrapper decoding, access bypass, paid service or external transmission. Preserve 273 legacy assignments.
- PR CI, merge, Production and Pages verification pending. Android Chrome QA remains UNVERIFIED.


## 2026-11-26 — PR #56 and Production #611 final verification
- PR #56 merged as 747bb2c4be7cc9bb4fdafacfc10a823570d66db1. Final-head PR CI run 45815041255 succeeded: 209/209 tests passed, 0 failed; archive validation passed with 857 discovery candidates, 182 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #611 run 45815117814 completed with workflow conclusion success, but the collection run log status is partial: YouTube 15 seen / 0 accepted / 15 duplicates; Google News RSS 68; Bing News RSS 37 with 5 of 6 Bing queries successful (one query failure). Archive validation passed. Do not describe source collection as fully complete.
- Generated data commit b3091b027e3ea73211b6766c09833ac98916a790. Pages artifact 15115206223, 615,604 bytes, SHA-256 e96baee3a414ea23e335e27710fad205fe5a463845d947d8959804973c985de4. Deployment step succeeded and log reported “Reported success!”.
- Latest metrics generated 2026-11-26T11:57:06Z: 857 candidates (670 articles / 187 videos), 99 verified publisher articles, 76 verified Haewon articles, 100 explicit publisher article URLs, 352 assigned thumbnails / 505 missing, 80 unique URLs, 273 legacy shared-image assignments preserved, 482 thumbnail review candidates / 0 reviewed, 0 article human review labels.
- The 273 legacy assignments have 0 explicit publisher article URLs, 0 alternative thumbnail candidate URLs, and 199 source-site URLs. Source-site URLs are not substituted for article URLs. All 273 remain untouched. The 12 wrapper-only Google News metadata entries remain untouched.
- PR #56 adds success-only auto-advance to the repeated-image review panel, reusing the current filtered next-pending article action. Labels remain per article, local-only; failed writes restore the saved value and do not advance.
- No new RSS/source, no Google News wrapper decoding, no access bypass, no automatic review labels/upload, no paid dependency, no external transmission. Android Chrome QA remains UNVERIFIED; it requires user-reported device results.
- Latest main after data commit: b3091b027e3ea73211b6766c09833ac98916a790. Documentation-only finalization PR follows; it does not trigger another Production collection.


## 2026-11-26 — Bing RSS non-RSS failure diagnostics (PR candidate)
- Production #611's workflow and Pages deployment succeeded, but its run log was partial: one Bing query (Haewon international interview) returned the parser error “Bing RSS 응답이 아닙니다”; five of six Bing queries succeeded. The saved status had no HTTP status or Content-Type, so the exact cause cannot be proven from that run.
- Do not assume this was transient, a block, or a valid Atom feed. Do not retry blindly, decode wrappers, change query parameters to evade controls, or store response bodies. MDN documents that HTTP Content-Type identifies the media type returned in the response: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type
- PR candidate adds a small diagnostic classifier (rss/atom/html/empty/unknown) and records only HTTP status, Content-Type and format classification in each Bing failure entry. The response body is never persisted. This makes the next occurrence diagnosable without access-control bypass or extra requests.
- Added tests for all response classes and for retaining metadata without response body text. PR CI and next Production run pending.


## 2026-11-26 — Persist feed failure diagnostics end-to-end (PR candidate)
- Follow-up audit of Production #612 exposed a serialization gap: `collectFeeds()` returned Bing response metadata, but `main()` reduced failures to `{query,error}` before writing `news-collection-status.json`. Google RSS failures also retained only query/error. Thus the first telemetry patch was not visible in production data.
- This branch fixes both feed paths: capture HTTP status and Content-Type before parsing; classify response format when a body was read; serialize only query, error, status, contentType and responseFormat to the status JSON. No response body is retained. HTTP 429 responses are not read or retried.
- Tests assert both the collector result and the safe serializer output for Google HTTP 429 and Bing HTTP 200 HTML. PR CI and a new Production run are pending.

## 2026-11-26 — PR #59 and Production #613 final verification
- PR #59 merged as 76bcd07a289dac9ef15b77404a72967d586378f8. Final-head PR CI #82 (45816347231) passed 213/213 tests, 0 failures; archive validation passed with 857 candidates, 184 schema-valid run logs, 55 source summaries and 41 links checked.
- Production #613 (45816436196) completed successfully; collection run log status success, validation passed. Google News RSS 6/6 queries succeeded with 98 items; Bing News RSS 6/6 succeeded with 43 candidates; YouTube search 15 candidates / 0 accepted / 15 duplicates. No source query failures occurred in this run.
- Production #613 data commit: 9b47fd4ab2a46163fff794b2dc4e70f892ab0c7f. Pages artifact 15116535964, 622,569 bytes, SHA-256 b4fb09ff5037880f2b44fde3b935a30606ab0fb3004816d1805165dc2c512e8b. Deployment log explicitly reported “Reported success!”.
- The previous Production #612 had Google 3/6 queries fail with HTTP 429 and Bing 1/6 return non-RSS; this subsequent run had 6/6 success for both providers. This shows the earlier failures did not recur in this run, but does not prove their underlying cause or guarantee they will not recur.
- PR #59 also fixed the telemetry serialization gap: the collector's failure metadata is now passed through the status writer. Tests verify HTTP status, Content-Type and coarse response format are retained without storing response bodies. Because Production #613 had no failures, there were no failure rows to inspect in production; end-to-end failure persistence is supported by tests, and should be rechecked on any future failed query.
- Latest metrics generated 2026-11-26T12:05:53Z: 857 candidates (670 articles / 187 videos), 100 explicit publisher article URLs, 76 verified Haewon articles, 352 thumbnails assigned / 505 missing, 80 unique URLs, 273 legacy shared-image assignments, 482 thumbnail-review candidates / 0 reviewed, 0 article human review labels.
- All 273 legacy assignments remain unchanged; 0 have publisher article URLs, 0 have alternative thumbnail candidates, 199 have source-site URLs. 12 wrapper-only Google News metadata entries remain untouched.
- Android Chrome QA remains UNVERIFIED pending actual user checklist results. No labels were generated/uploaded, no new RSS sources added, no wrapper decoding, no access bypass, no paid service or external data transmission.
- Latest code/data main before this documentation-only finalization: 9b47fd4ab2a46163fff794b2dc4e70f892ab0c7f. Documentation-only PR will not trigger another Production run.

 
## 2026-11-27 — Source-level thumbnail gap diagnosis and implementation (PR pending)

### Fresh state verification
- User-provided prior main: `190e106ff83ebd26f61fa09f3e51fe0d79128cde`.
- Re-read the six required documents from that main before substantive changes.
- Actual main then advanced through Production #614 data commit to `f2d63d5f6bf9dd4c19c3082f4b83effc3427d8a0`; open PR count 0 at the fresh check.
- Production #614 run 45889430699: all ten job steps completed successfully. Data commit `f2d63d5f6bf9dd4c19c3082f4b83effc3427d8a0`. Pages artifact 15149979794, 635,720 bytes, SHA-256 `a50dfe36a62cfa85f4b644a20f15ce1b65e535bf4dac56dbd53eb13205f52080`; upload and deployment steps succeeded.
- PR CI #83 (run 45816770907) completed successfully. Previous Production #613 is historical, not the latest data snapshot.

### Current Production #614 evidence
- Metrics timestamp: 2026-11-26T20:13:34.144Z.
- 883 candidates (696 articles / 187 videos); 106 explicit publisher article URLs; 83 verified Haewon articles; 355 thumbnails assigned / 528 missing; 83 unique image URLs; dominant URL 273 assignments / 31% of all candidates; 488 thumbnail review candidates / 0 reviewed; article relevance labels 0.
- Source breakdown: Google News 773 records, 273 with existing thumbnail and 500 missing; explicit publisher article URLs 0. Other source rows total 110 records, 82 assigned and 28 missing. This is a sourceName-level aggregate, not a per-record verification of every external publisher.
- The 273 legacy assignments have 0 explicit publisher article URLs, 0 alternative candidate URLs, 202 source-site URLs and metadata outcome not-attempted for all 273. Preserve every assignment.
- Google News RSS image signals: 179 RSS items, 178 sourceUrl values, 0 publisherArticleUrl values and 0 explicit image tags/signals. Bing RSS: 51 items and 51 explicit publisherArticleUrl values, but 0 image metadata signals in the RSS fields. This shows RSS metadata itself is not yielding images; page metadata is a separate stage.
- Metadata host diagnostics include 12 wrapper-only Google News records; MSN 14 attempts (13 missing, 1 assigned); several explicit publisher hosts return stored forbidden/network/method errors. These attempted subsets do not explain all 528 missing records. The 528 total is a mix of no verified article URL, no metadata/candidate evidence, and some publisher metadata fetch outcomes; do not over-attribute the whole gap to access blocks.

### Root-cause analysis and selected improvement
- Main concentration is not a single broken image host: 773 records are grouped under Google News; only 273 retain the legacy shared image, leaving 500 without a thumbnail and without an explicit publisher article URL. Those cannot be safely enriched under current rules.
- Among other source groups, 28 of 110 are missing thumbnails. Existing metadata host diagnostics show a mix of no-image metadata and explicit failures (e.g. forbidden/network/method errors); source-level aggregate counts remain separate from per-attempt errors.
- Open Graph defines `og:image` as a publisher-declared image property (https://ogp.me/); Schema.org `thumbnailUrl` is a URL property for a relevant thumbnail (https://schema.org/thumbnailUrl). Neither guarantees every publisher page exposes a usable image.
- MDN describes 403 as refusal and 429 as rate limiting; unchanged 403 requests should not be repeated and 429 should not trigger blind retries: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403 and https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429.
- Alternatives rejected: decode Google News wrappers (prohibited); substitute sourceUrl for article URL (incorrect provenance); add SBS/Yonhap or other RSS without permission; retry 403/429/non-RSS responses; upload automatic labels; mutate 273 legacy assignments.
- Chosen small, free, local observability improvement: add an evidence-based reason classifier and per-source missing counts to quality metrics, and render them in the existing read-only quality dashboard. It records aggregate reasons only; no raw URLs or response bodies.

### Code and tests implemented on feature branch
- Branch: `feat/thumbnail-missing-source-diagnostics-20261127`.
- `scripts/quality-metrics.mjs`: exported `classifyMissingThumbnailReason` and `summarizeMissingThumbnailDiagnostics`; aggregate per-source denominators use all records (not only missing records), and separately count missing items with explicit publisher article URLs vs source-site URLs.
- `js/discovery-view.mjs`: render missing/total, classified/unclassified, top source groups and reason counts in the existing dashboard.
- `tests/quality-metrics.test.mjs`: cover wrapper/source-site distinction, explicit publisher fetch failure, no image candidate, candidate not assigned, unattempted metadata and already-assigned thumbnail exclusion.
- `tests/review-queue-integration.test.mjs`: assert the dashboard displays source-level diagnostic fields.
- CI has not yet run for this PR. Do not call this tested/merged/Production-verified until the final-head CI result and data validation are available.

### Review UX verification
- Re-read `js/discovery-view.mjs`, `js/thumbnail-review.mjs` and the integration tests. Both PR #54 general thumbnail and PR #56 repeated-image flows call the shared persistence gate; auto-advance is inside the successful save branch. On failure the select is restored from the saved label and no advance is scheduled.
- Labels remain local-only and article-specific. No review label was created or uploaded.
- Android Chrome QA remains UNVERIFIED pending the user's real-device checklist.

### Safety and unresolved items
- No new RSS/source, no wrapper decoding, no access bypass, no blind retry, no paid service, no external contact/data transmission, no automatic labels, and no modification to the 273 legacy assignments.
- Next: open PR from the feature branch, wait for final-head PR CI, inspect test/validation results, and merge only after success. After merge separately verify Production, data commit, Pages artifact and deployment. If CI fails, fix the concrete regression and rerun.

 
## 2026-11-27 — PR #61 merged; Production #615 and live diagnostics verified
- PR #61 merged successfully as `60af6e3dea0e0732b4d6545882b315fe2cfd40e7`. Final-head PR CI #86 passed 216/216 tests (0 failures); committed archive validation passed with 883 candidates, 186 schema-valid run logs, 57 source summaries and 41 links checked.
- Production #615 (run 45913527537) completed successfully. Production workflow itself ran 216/216 tests and validated 902 discovery candidates, 187 schema-valid run logs, 57 source summaries and 41 checked links. The run log status is success.
- Latest data commit: `57bce05ac0511521c65c5ea27aa38c6a39141cd9`, parent is PR merge commit `60af6e3dea0e0732b4d6545882b315fe2cfd40e7`.
- Pages artifact 15160453872, 645,559 bytes, SHA-256 `a17a0b4d13d9ac6ce1e9366933cb509e06fbf427ae9fa85e29d270a8fc956be3`; artifact upload, Pages deploy and final “Reported success!” all verified.
- Latest metrics generated 2026-11-26T23:53:22.393Z: 902 candidates (715 articles / 187 videos), 106 explicit publisher article URLs, 83 verified Haewon articles, 355 thumbnails assigned / 547 missing, 83 unique image URLs, 273 dominant legacy assignments (30% of all candidates), 488 thumbnail review candidates / 0 reviewed, 0 article human-review labels.
- Current source breakdown: Google News 792 records, 273 assigned and 519 missing; explicit publisher article URLs 0. Among missing Google News records, 507 are explicitly classified as wrapper without publisher article URL and 12 as wrapper-only metadata; 449 have a source-site URL, which is not a publisher article URL. The other source rows total 110 records, with 28 missing.
- Latest missing-reason totals: 507 Google News wrapper without publisher article URL; 12 wrapper-only not followed; 9 publisher fetch failures tagged forbidden; 17 publisher pages with no supported image candidate; 1 method-not-allowed; 1 network error. All 547 missing records received an evidence-based category (0 unclassified). The 9 forbidden rows are a metadata-access outcome, not permission to retry or bypass.
- Current RSS metadata: Google News 224 items / 221 sourceUrl / 0 publisherArticleUrl / 0 image signals; Bing 52 items / 51 explicit publisherArticleUrl / 0 image signals. Both providers had 6/6 successful queries; failedQueries and bingFailedQueries are empty. Production #615 saw 15 YouTube candidates, all 15 duplicates; news collection added 23 candidates. No actual RSS failure occurred, so the persisted failure row path from PR #59 remains covered by tests but has not been exercised by a new production failure.
- The 273 legacy image assignments remain unchanged: 0 publisher article URLs, 0 alternative candidate URLs, 202 source-site URLs; metadata outcome not-attempted for all 273. Do not bulk-label, delete or replace them.
- PR #61 adds only evidence-based aggregate diagnostics and dashboard display; it does not fetch additional URLs or modify collection policies. Android Chrome QA remains UNVERIFIED pending the user's real-device checklist.
- No new RSS sources, wrapper decoding, sourceUrl substitution, blind retries, access bypass, paid services, external data transfer, or automated review labels.

 
## 2026-11-27 — Fan-facing discovery and image gallery (PR pending)

### Fresh baseline re-check
- Main at cycle start: `a9b597d5538ee066a1ee69a7902e8e418c2b48df`; open PRs 0; latest successful Production #615; latest data commit `57bce05ac0511521c65c5ea27aa38c6a39141cd9`.
- Re-read SESSION_LOG, PROJECT_STATUS, ROADMAP, BUTTONS_AND_ACTIONS, COLLECTION_RULES and CHATGPT_OPERATING_RULES from main before editing.
- Latest Production data: 902 discovery candidates, 715 articles / 187 video candidates, 83 verified Haewon articles, 61 verified Haewon article thumbnails with source provenance, 355 assigned thumbnails total (including 273 legacy shared-image assignments), 547 missing. `data/photos.json` has 0 standalone photo-post records.
- `data/videos.json` contains 20 accumulated NMIXX Official channel videos. Production #615 fetched 15 Atom feed entries, added 0 and retained total 20. The optional YouTube Data API search job logged `skipped-no-api-key`; news-to-video sync found 0 explicit YouTube URLs. The 187 discovery video candidates are not 187 verified videos: they include discovery records with YouTube-like titles but unresolved Google News wrapper URLs.
- Therefore “20 videos” is the current repository's accumulated official-channel feed archive, not the total number of uploads on the NMIXX channel. The current official Atom feed only returned 15 items in the last run; no historical backfill is active.

### Policy research / decision
- YouTube official channel and JYP channel content were reviewed as possible additional video sources. A broad channel-wide search API is not a safe drop-in for a permanent public archive.
- Official YouTube Data API docs say `playlistItems.list` costs 1 quota unit per call and can page up to 50 items, while the default quota allocation is 10,000 units/day for most endpoints; API credentials are required. Sources: https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list and https://developers.google.com/youtube/data/determine_quota_cost.
- YouTube Developer Policies require Non-Authorized API Data to be refreshed or deleted within 30 calendar days; video titles, creator names and descriptions are included in data that cannot simply be stored indefinitely without refresh. Source: https://developers.google.com/youtube/terms/developer-policies/.
- Decision: do not silently activate a permanent API backfill or require an API key. Keep the public Atom feed as the no-key baseline, clearly label archive coverage, and keep the full channel Videos page directly accessible. A future API-based backfill requires a compliant 30-day refresh/deletion lifecycle and explicit user decision; it is not included in this PR.

### Implemented on `feat/fan-facing-discovery-gallery-20261127`
- `index.html`: top-level archive navigation to videos, article images, discovery articles and photo-post links; direct link to the full NMIXX official Videos page; dedicated image gallery placed immediately after video archive; clearer distinction between article thumbnails and standalone photo posts; explicit coverage note; pagination control for unresolved video candidates.
- `js/discovery-view.mjs`: new `buildVerifiedHaewonImageGallery()` exposes only source-provenance-backed thumbnails from articles with explicit publisher article URLs and Haewon-title matches; deduplicates by image URL. Default article view widened from verified-only (83) to Haewon candidates (535); full article candidates remain available via the existing filter. Added explicit “publisher original” vs “discovery link” action; video discovery candidates now paginate rather than stopping at 12.
- `js/app.js`: shows actual archived video count, last feed item count and newly added count; explicitly explains this is not the channel's total upload count.
- `assets/style.css`: mobile-first archive nav, responsive image gallery, source action and pagination styling.
- `tests/discovery-search.test.mjs`: gallery regression test ensures only unique, provenance-backed images from explicit publisher URLs are displayed; legacy unprovenanced shared thumbnails and unresolved wrapper items are excluded.
- The current main dataset has 61 eligible unique article images (calculated from the 902-record discovery file); these are article preview images, not 61 standalone official photo posts. PR CI pending; not yet deployed.

### Photo collection status and honest scope
- `data/photos.json` is empty and `sources.json` marks JYP official site and NMIXX Instagram as manual-link-only. There is no automated standalone photo-post collector.
- This PR makes the 61 already-collected article images browsable now, but does not claim to have started collecting official SNS photo posts or to have rehosted original photos.
- Next photo-source work must establish documented public metadata/feed permission and original post URLs before any automated collection. No login scraping, anti-bot bypass, private content, or image file copying.

### Validation / remaining
- PR CI and full validation pending. Do not merge until final-head checks pass.
- Android Chrome real-device QA remains unverified until user runs the checklist.
- No YouTube API key was requested or added, no new source feeds were enabled, no photo originals were copied, and no legacy thumbnail assignments or human review labels were changed.

 
## 2026-11-27 — Production #616 and official photo source discovery
- PR #62 merged as `c789b9a7c38241c0d6e893cca11b3e2870276b70`; final-head PR CI #88 passed 218/218 tests and archive validation passed for 902 candidates. Production #616 (run 45915909274) completed successfully; data refresh commit/main `b5ca63188b34fe8b3f3cc5a96912d6d89b96a4ee`.
- Production #616 Pages artifact 15162296412, 657,992 bytes, SHA-256 `9f10b21bc69a27502821925cb476cb9206555cd2d2b552be734065b0c1dfb177`; artifact upload and Pages deployment steps succeeded.
- Latest metrics: 903 discovery candidates (716 articles / 187 unresolved video candidates), 106 explicit publisher article URLs, 83 verified Haewon articles, 61 verified Haewon article images with source provenance, 355 assigned thumbnails / 548 missing, 83 unique thumbnail URLs, 273 legacy shared-image assignments. `data/videos.json` remains 20 NMIXX channel videos; latest official feed fetched 15, added 0. `data/photos.json` remains 0 standalone photo-post records.
- Production #616 collected 5 new news candidates; NMIXX YouTube Atom feed and Google/Bing RSS collection succeeded. The 187 discovery video candidates are not 187 verified YouTube URLs.
- New public official photo source discovered: NMIXX official website Gallery at https://nmixx.jype.com/gallery. Current public page displays 34 gallery pages; official Notice also lists Haewon concept-photo posts. Search/open evidence: https://nmixx.jype.com/gallery and https://nmixx.jype.com/notice. The next PR adds a direct link to this official gallery in the archive.
- PR #63 also aligns `quality-metrics.json` `defaultScope` metadata with the broadened Haewon-candidate default in the public article view. PR/CI pending.
- The official Gallery link is a user-facing route to existing official photos; it does not mean this repository has begun automated photo-post collection. `data/photos.json` stays empty until a permitted public listing/image metadata path is implemented and validated. No image files are copied or rehosted.
- Android Chrome real-device QA remains unverified pending the user's checklist. Preserve 273 legacy thumbnail assignments; no automatic labels, API keys, new RSS feeds or access bypass.

 
## 2026-11-27 — PR #63 merged; official gallery link live; Production #617 diagnostics exercised
- PR #63 merged as `a7d4ae26b154a1219ec4ba34f7d24002d31b20ce`; final-head PR CI #89 passed 218/218 tests, and archive validation passed for 903 discovery candidates, 20 schema-valid videos, 0 photo-post records, 188 run logs, 57 source summaries and 41 checked links.
- Production #617 (run 45916213360) completed its workflow and Pages deployment successfully. Data commit/main: `87e1e859c2762680c13ff4d3c487e158164d86ed`, parent PR merge `a7d4ae26b154a1219ec4ba34f7d24002d31b20ce`.
- Pages artifact 15161774593, 662,120 bytes, SHA-256 `a37263f12ec5d64e78db3439ec16f168ddd5327a251e13f4c862a14cfd58c244`; upload and deployment steps succeeded.
- Latest metrics generated 2026-11-27T00:21:21.098Z: 903 discovery candidates (716 article / 187 unresolved video candidates), 106 explicit publisher article URLs, 83 verified Haewon articles, 61 source-provenance-backed Haewon article images, 355 assigned thumbnails / 548 missing, 83 unique image URLs, 273 legacy shared-image assignments. Videos remain 20; last feed fetched 15 and added 0. Standalone `data/photos.json` remains 0.
- Production #617 Google News RSS returned 5/6 successful queries; Bing RSS 6/6. The one actual Google News failure is persisted in `data/news-collection-status.json`: query `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`. This directly exercises PR #59's failure-diagnostic persistence path. Do not retry blindly; leave the failed query recorded and respect rate limiting. Production run log correctly marks Google News partial and overall run partial while validation and Pages deployment succeed.
- The official photo gallery shortcut is now live in the photo/image section: https://nmixx.jype.com/gallery. It opens JYP's public Gallery; the archive still does not automatically copy or collect photo originals. The 61 local cards remain article-image previews, distinct from official photo posts.
- `discoveryRelevance.defaultScope` now reports `haewon-title-match`, aligned with the actual default article UI.
- No API key, new RSS source, external data transfer, wrapper decoding, access bypass, blind retry, auto-review label, or mutation of the 273 legacy image assignments.
- Android Chrome QA remains unverified until the user completes the real-device checklist.

## 2026-11-27 — Official photo permission boundary and video-origin provenance
- Official NMIXX Gallery is publicly viewable (34 pages), but the readable page exposes only generic image items and JYP copyright notice; robots.txt could not be retrieved, and no terms or explicit permission for automated image metadata extraction were verified. Keep JYP Gallery/Notice manual-link-only; do not add a collector, infer image URLs, download/rehost photos, or populate data/photos.json. Article-image previews (61) remain distinct from standalone photo posts (0).
- NMIXX Notice exposes public post number/title/date entries (58 pages), including Haewon concept-photo notices. This is evidence for a useful human-browsable source, not permission to crawl it.
- The persisted 20 video records all originate from the NMIXX artist channel. The public Atom feed currently returns 15 recent entries per observed run; the archive's 20 are accumulated records, not channel-wide coverage. Existing text-keyword relevance is 2/20 and is not human appearance verification. Keep the optional YouTube Data API disabled unless a compliant 30-day refresh/deletion lifecycle is implemented.
- Video provenance is explicit: artist-official, broadcaster-official, or unverified. The NMIXX Atom feed and known channel ID populate artist-official; direct YouTube links discovered in news and non-NMIXX search results remain unverified unless channel identity is independently verified. No broadcaster sources are enabled yet.
- Research leads for later human review: M2, MBCkpop, KBS Kpop, SBSKPOP ZOOM, and ALL THE K-POP. Do not fetch their feeds or add them to the automatic source registry in this cycle. Verify channel ownership, public feed availability, source terms/robots, and Haewon-specific video identity before proposing a collector.
- PR #54/#56 queue contract remains: advance only after successful local persistence; on storage failure restore the prior saved value and do not advance. Integration tests assert success-only scheduling; persistence behavior is separately tested. No review labels are generated, uploaded, or altered.
- Preserve 273 legacy shared-thumbnail assignments, the HTTP 429 diagnostic for query '오해원 근황', and Android Chrome QA as unverified.

## Final verification — Production #618 (2026-11-27)
- PR #64 merged after PR CI #90 passed; merge commit `b5b1a434fb3520617007d67058deddca084dd440`. Production #618 completed successfully: https://github.com/UForPel/haewon-archive/actions/runs/45918702731
- Production run log `data/run-logs/45918702731.json` records status `success`, validation passed with no errors, NMIXX feed 15 entries seen (0 added, 15 duplicates), Google News 329 candidates and Bing 50 candidates. News queries: Google 6/6 and Bing 6/6 successful; 14 discovery candidates added; total candidates 913 (726 article, 187 unresolved video).
- Current metrics: 20 stored NMIXX artist-channel videos, all carrying `artist-official` and the verified NMIXX channel ID; 61 provenance-backed Haewon article-image previews; 0 standalone photo-post records. Thumbnail metrics: 913 records, 558 missing (355 assigned by subtraction); the 273-record shared legacy image group remains `review-required` and unchanged.
- Pages artifact 15163044172, 674154 bytes, SHA-256 `8d2b7058e8fa601c654d2ac6d69edb91b7be3e288a80797376ebdd1729ab6213`; artifact upload and Pages deploy steps both succeeded. The live site URL could not be independently opened/verified in this check. Android Chrome real-device QA remains unverified.
- The earlier Production #617 partial run (run ID `45916213360`) had a Google News query failure: `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`; no blind retry was performed. Production #618 later succeeded 6/6. The latest status snapshot is now the successful run and has overwritten the earlier per-query failure detail; the partial run log remains, but append-only per-query failure history is still a follow-up gap to close.
- Latest data commit at the end of Production #618: `553151c75580506ee9518c461aa552d8716807eb`; it is the parent of the documentation-only finalization commit that records this verification.

## 2026-11-27 — Append-only query failure history and source-policy review
- Root cause: `data/news-collection-status.json` is a latest-run snapshot and is overwritten on each collection. Before this change, `data/run-logs/*.json` only stored source-level error codes, so individual failed query/status/content-type details were not durable.
- Add `data/query-failure-history.json` as an append-only event list keyed by runId + sourceId + query. A later successful run adds no deletion/update for an earlier failure; replaying the same run key is deduplicated. The initial backfill records only the confirmed Production #617 Google News failure: query `오해원 근황`, HTTP 429, content type `text/html; charset=UTF-8`, response format `html`, run ID `45916213360`, occurred at the recorded run start time. No Retry-After value was present in the available historical evidence, so it is omitted.
- New Google/Bing failure rows capture Retry-After only when the HTTP response actually supplies that header. Every query is attempted once; `retryAttempted:false` is recorded. No automatic retry/backoff has been introduced. Run logs now include query-level failures and preserve status/content type/format/retry metadata. Production #617 run log is backfilled with its confirmed query failure.
- `validate-data.mjs` validates the append-only history shape and duplicate event keys. Tests cover 429 metadata, one-request/no-blind-retry behavior, history retention after a later success, replay deduplication, and run-log query-level details.
- JYP/NMIXX Gallery and Notice remain manual-link-only. Publicly visible listings are not permission to crawl or reuse images. robots.txt and a content-collection permission/terms basis could not be verified; JYP's public privacy policy is not an image-crawling license. No image collector or hidden endpoint was added. Keep article-image previews (61) separate from standalone photo posts (0).
- Broadcaster research: KBS's own site lists KBS Kpop and KBS published a channel feature; iMBC identifies MBCkpop as its YouTube K-pop channel; MBC PLUS owns the ALL THE K-POP brand and publishes clips with MBC PLUS copyright. MnetPlus content pages refer to M2 YouTube distribution. However, channel IDs, public Atom feeds, each channel's robots/terms, and Haewon-specific individual videos were not all verified. SBSKPOP ZOOM ownership was not established from a first-party source in this pass. Therefore no broadcaster channel is added to `data/sources.json`, and no video is newly marked `broadcaster-official`.
- Preserve 273 legacy shared-thumbnail assignments and PR #54/#56 transactional review queue behavior. Android Chrome real-device QA remains unverified.

## 2026-11-27 — Failure-history serializer correction follow-up
- PR #65 was merged after final-head PR CI #93 passed (219 tests and committed-data validation). Merge commit: `4082f1d51ae037ea9d1a823c91f750f86ecdc984`.
- Production #619 (`45926252892`) ran the collectors, but failed during `validate-data.mjs` at the query-failure-history JSON parse step. Root cause: the serializer wrote the two literal characters backslash+n after the JSON object instead of a real newline. The failed workflow did not commit refreshed data and did not upload/deploy a Pages artifact. Do not report Production #619 as successful.
- Follow-up fix extracts `serializeQueryFailureHistory`, writes a real newline, and adds a test that parses the serialized JSON and distinguishes a real newline from a literal backslash+n. Re-run full PR CI and Production after merge before declaring the history persistence live.
- Main's committed `data/query-failure-history.json` remains valid and still contains the single confirmed #617 429 event; no new failure or Retry-After value is inferred from #619.
- All source-policy decisions remain unchanged: JYP Gallery/Notice manual-link-only; no broadcaster feeds enabled; preserve 273 legacy shared thumbnails and transactional PR #54/#56 review flow. Android Chrome QA remains unverified.

## 2026-11-27 — Production #620 final verification
- PR #66 fixes the failure-history JSON serializer and was merged after final-head PR CI #95 succeeded (220/220 tests plus committed archive validation). Merge commit: `d61bc9aba38d4c8636828df2767bb3a67440be53`.
- Production #619 (`45926252892`) failed during validation because the first serializer emitted a literal backslash+n suffix. It did not commit refreshed data or deploy Pages. This was corrected in PR #66; do not count #619 as a successful deployment.
- Production #620 succeeded end-to-end: https://github.com/UForPel/haewon-archive/actions/runs/45926600456. Collection and archive validation passed; Google News 6/6 queries and Bing 6/6 queries succeeded; NMIXX Atom feed returned 15 entries (0 added, 15 duplicates); Google RSS returned 160 items and Bing RSS 49 items; 5 new discovery candidates were added; cumulative candidates 914 (727 article, 187 unresolved video).
- Run log `data/run-logs/45926600456.json` records status `success`, `queryFailures: []`, validation passed with no errors. The append-only `data/query-failure-history.json` still contains the one backfilled #617 failure (`오해원 근황`, HTTP 429, `text/html; charset=UTF-8`, no Retry-After recorded, no retry attempted). A later success did not erase it.
- Current quality metrics: 107 explicit publisher article URLs, 83 verified Haewon articles, 61 provenance-backed Haewon article-image previews; 20 stored NMIXX artist-channel videos; 0 standalone photo-post records. Thumbnails: 356 assigned, 558 missing, 84 unique image URLs; all 273 legacy shared-thumbnail assignments remain unchanged.
- Production #620 data commit: `ba3f3da5fc6f82580f25dd26177216cfd65108fb`. Pages artifact `15166123904`, 689,587 bytes, SHA-256 `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`. Artifact upload and Pages deployment steps both succeeded. The known Pages URL could not be independently opened through the current verifier; report deployment-step success, not independent live-site verification.
- First-party source review: KBS World explicitly references KBS KPOP YouTube distribution; iMBC references the MBCkpop YouTube channel; MBC PLUS's own site identifies ALL THE K-POP and its official clip pages include MBC PLUS copyright; MnetPlus describes selected program simulcasts on M2 YouTube. These sources establish channel/program relationships but do not yet verify stable channel IDs, public Atom feed availability, robots/terms for automated feed collection, or individual Haewon appearances for all five proposed channels. SBSKPOP ZOOM ownership remains unverified. No broadcaster feed is enabled and no item is newly marked `broadcaster-official`.
- JYP Gallery/Notice remain manual-link-only: robots.txt and automated collection permission were not verified. No photo collector, hidden endpoint, image download or rehosting was added. Android Chrome real-device QA remains unverified.

## 2026-11-27 — Multi-event failure-history audit follow-up
- Re-read the current main, open PR list, recent commits, PR #65/#66 metadata, Production #619/#620 run records, Production #620 job steps and artifact metadata, and the six operating documents plus SOURCE_POLICY.md.
- Confirmed #620's run log has `queryFailures: []`, while `data/query-failure-history.json` still contains only the backfilled #617 Google News 429 event. #620 success did not erase it.
- Code review found that the documented multi-run behavior lacked direct unit coverage for the exported `mergeQueryFailureHistory` helper. Add tests for: successful later run preserving prior events; distinct query failure in a later run appending a second event; replay of the same run/source/query key being deduplicated; the same query failing under a different run ID remaining a distinct event.
- Add a fetch-call-count test that proves each query is requested once, `retryAttempted:false` is retained, and `Retry-After` is copied only from the actual response header. Existing serializer regression test remains in place.
- This PR's synthetic unit fixtures are not a substitute for a second live Production run. Production #621 / next scheduled run must be inspected separately; only real observed failures may be appended to production history. Never fabricate a 429/503 event or infer Retry-After.
- Production #620 verified: run 45926600456, job 140269246009 success; upload and deploy steps success; artifact 15166123904, 689587 bytes, SHA-256 `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`. The workflow is scheduled at 11:17 and 23:17 UTC and supports workflow_dispatch; this connection currently exposes read-only workflow inspection, not a dispatch action.
- Source policy unchanged: JYP Gallery/Notice manual-link-only; no broadcaster feeds or broadcaster-official labels; 61 article-image previews remain separate from 0 standalone photo records. Preserve 273 shared thumbnails and PR #54/#56 transactional review behavior. Android Chrome QA remains user-unverified.


## 2026-11-27 — Source identity evidence refinement
- Rechecked first-party source ownership and exact channel identities after PR #67. MBCkpop's verified YouTube page identifies channel ID `UCe52oeb7Xv_KaJsEzcKXJJg` and includes MBC&iMBC copyright; ALL THE K-POP's verified YouTube page identifies `UCPde4guD9yFBRzkxk2PatoA`, lists an @mbcplus.com business address and MBC PLUS copyright.
- KBS first-party materials identify KBS Kpop as an official channel, but the candidate channel ID came only from a non-first-party index and is not registered. MnetPlus confirms selected program simulcasts on M2, but the stable M2 channel ID remains unverified. SBSKPOP ZOOM ownership remains unverified.
- Direct Atom feed inspection was blocked by the verifier; this is not evidence of feed unavailability or permission. No broadcaster source was added. JYP Gallery/Notice remain manual-link-only because robots/terms/automated metadata permission remain unverified.
- PR #67 merged as `e5be2394a46094e10aa334bf02e5d405b30dedd1` after PR CI #97 completed successfully: 222/222 tests, 0 failures, committed archive validation passed. Synthetic tests do not replace a second live Production run.
- Production #620 artifact hash independently recomputed from the downloaded `github-pages` artifact ZIP: `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`, matching the recorded SHA-256. Production #621 has not yet run; the next scheduled slot is 11:17 UTC / 20:17 KST. This GitHub connection exposes read-only workflow inspection, so no manual dispatch was performed.

## 2026-11-27 — Production #621 pending checkpoint (13:30 KST)
- Re-read the seven operating/source-policy documents from current main `d4aa61fc43819e1f2b272cc1aade188af3779240`; current open PR count is 0 and latest main is unchanged at this checkpoint.
- Queried the latest 30 Actions runs and verified no Production #621 or later Production run exists yet. Latest production run remains #620 (run 45926600456); #619 (45926252892) is a separate failed run. At 13:30 KST, the next configured schedule `17 11 * * *` UTC is still in the future (20:17 KST). Do not infer or fabricate a #621 result.
- Production #620's committed run log reports success, Google/Bing queries 6/6 each, 5 added candidates, total 914 candidates, and no queryFailures. Its history file still contains only the confirmed #617 Google News 429 event; it has no Retry-After field because no header was observed. This confirms retention through one later successful run, not a second live failure event.
- Re-fetched Production #620 job steps: test/collect/validate/commit, Pages configuration, artifact upload, and deploy-pages all succeeded. The workflow job log reports 220/220 tests and 0 failures (run #620 predates PR #67/#68). Artifact 15166123904 is 689,587 bytes; downloaded ZIP SHA-256 independently recomputed as `e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31`. Public Pages URL could not be opened through the independent web verifier; report deployment-step success, not live-site verification.
- Latest PR CI #97 and #98 both independently logged 222/222 tests, 0 failures, and successful committed-data validation. The serializer real-newline regression, append-only multi-run unit test, Retry-After actual-header-only test, and no-blind-retry fetch-count test all passed in both PR runs.
- Current committed history still has exactly one real event: run 45916213360 / google-news-rss / `오해원 근황` / HTTP 429 / retryAttempted false. No synthetic event was inserted.
- Quality metrics re-read from main: 914 candidates (727 article, 187 video), 107 publisher article URLs, 83 verified Haewon articles, 61 article-image previews, 0 standalone photo records, 356 assigned thumbnails, 558 missing, 84 unique image URLs, and 273 legacy shared assignments.
- Source policy remains unchanged: JYP Gallery/Notice manual-link-only; broadcaster feeds remain disabled; MBCkpop and ALL THE K-POP IDs are provenance leads only, not permission to collect. KBS/M2 exact ID and feed-policy evidence remains incomplete; SBSKPOP ZOOM ownership remains unverified. No item-level broadcaster-official auto-classification.
- No Production dispatch was performed: only read-only workflow inspection is available. Android Chrome real-device QA remains unverified.

### Next required live check
At or after 20:17 KST, re-query Actions for the next actual Production run. Inspect its job log, committed `data/run-logs/<run-id>.json`, `data/query-failure-history.json`, data commit, artifact ID/hash and Pages deploy step independently. If a distinct query fails, verify a second event was appended. Then inspect the next successful Production run to prove both events remain. If no second failure occurs, retain one event and mark the multi-failure live scenario pending.

## 2026-11-27 — YouTube channel identity and Atom-feed policy recheck
- Verified the M2 YouTube channel page as a verified channel with handle `@MnetM2`, exact channel ID `UCTQVIXvcHrR9jYoJ6qaBAow`, and CJ ENM copyright/identity description. Source: https://www.youtube.com/channel/UCTQVIXvcHrR9jYoJ6qaBAow
- Verified the KBS Kpop handle-to-channel mapping: `@kbskpop` resolves to channel ID `UCeLPm9yH_a_QH8n6445G-Ow`; the channel page title is KBS Kpop. KBS first-party pages already establish KBS Kpop as its official music/YouTube channel. Keep this as identity/provenance only, not a collector permission. Sources: https://www.youtube.com/channel/UCeLPm9yH_a_QH8n6445G-Ow and https://world.kbs.co.kr/service/news_view.htm?Seq_Code=189750&lang=e
- Re-read YouTube's official Terms of Service: section "Permissions and Restrictions" says automated access (robots, scrapers) is not allowed except public search engines acting in accordance with robots.txt or prior written permission; use of Content is limited as described and embeds are the allowed presentation path. Source: https://www.youtube.com/t/terms
- Read YouTube's current robots.txt: it explicitly disallows `/feeds/videos.xml` for `User-agent: *`. Source: https://www.youtube.com/robots.txt
- Direct fetches of candidate Atom URLs were blocked by the current verifier; this is not evidence of feed unavailability. However, the published robots exclusion for `/feeds/videos.xml` is affirmative evidence that the Atom path is not permitted for an ordinary automated collector under the public-search-engine exception. Therefore do not poll YouTube Atom feeds for KBS, M2, MBCkpop, or ALL THE K-POP unless written permission or a clearly applicable authorized API basis is established.
- Exact ID status: KBS Kpop `UCeLPm9yH_a_QH8n6445G-Ow`; M2 `UCTQVIXvcHrR9jYoJ6qaBAow`; MBCkpop `UCe52oeb7Xv_KaJsEzcKXJJg`; ALL THE K-POP `UCPde4guD9yFBRzkxk2PatoA`. These are identity facts only; no broadcaster feed is enabled and no video is auto-labeled broadcaster-official.
- SBSKPOP ZOOM first-party ownership and stable channel ID remain unverified. JYP Gallery/Notice remain manual-link-only due unresolved robots/terms/metadata permission.
- No YouTube API activation: the 30-day refresh/deletion lifecycle requirement remains unmet. No code/source registry change, no automated collection, and no video reclassification was made.

### Implication
The previous "Atom feed not verified" status is refined: endpoint availability remains unverified, but the robots policy disallows the Atom path. Do not treat a successful HTTP response, if later observed, as permission to poll it.


## 2026-11-27 — Active YouTube Atom collector policy conflict and remediation
- Rechecked main ca55d79c0c30e3bc4d401ee1411289629317e31c, open PRs (0), recent Actions and all seven required operating/source documents.
- Latest Production was #620 (run 45926600456); no #621 existed at the inspection time. The scheduled 20:17 KST execution was still pending.
- Found a policy/code mismatch missed by the previous channel research: although broadcaster Atom feeds were not enabled, the legacy NMIXX official YouTube Atom source was still enabled. Production #620 log proves it fetched 15 feed entries. data/sources.json marked it public-feed / enabled, and scripts/collect-youtube.mjs directly fetched /feeds/videos.xml.
- Official YouTube robots.txt disallows /feeds/videos.xml for User-agent: *; Terms restrict automated access to robots-compliant public search engines or prior written permission. Channel ownership/official status does not create permission.
- Remediation submitted for review: disable Atom fetch entirely, mark source disabled, preserve archived videos, remove API secret injection, hard-disable API search pending the 30-day lifecycle, and add regression tests against network calls and secret exposure.
- Production #620 log also shows YOUTUBE_API_KEY was empty and API search was skipped. No YouTube Data API call is evidenced for #620.
- Preserve #617's one real 429 event; #620 success did not remove it. No synthetic failure events; no new live second failure exists yet.
- Production #620 metrics: 914 candidates (727 article, 187 video), 108 publisherArticleUrl items in quality-metrics snapshot (news status recorded 107 explicit URLs in earlier count; keep metric definitions distinct), 83 verified Haewon articles, 61 article-image previews, 0 standalone photos, 356 assigned thumbnails, 558 missing, 273 legacy shared assignments.
- #620 artifact 15166123904 reports SHA-256 e37e5f81b8bf3349e1dc55ac90af9bcd9a95ec971f13f79874cdc6319e819a31; deploy-pages and artifact upload steps succeeded. Live site was not independently opened.
- #619 failed separately at JSON validation and did not produce a successful deploy. #620 succeeded.
- Android Chrome real-device QA remains unverified.


## 2026-11-27 — PR #71 and Production #621 final verification
- PR #71 (fix: disable unauthorized YouTube automated collection) merged after PR CI #45943174220 completed successfully: 223/223 tests, 0 failures, committed archive validation passed. Merge commit: 535a3e812a87b6ab145d65eeb8d7fd7c84fdf518.
- Post-merge Production #621 (run 45943216118, push event from PR merge) succeeded. Its production test run was 223/223, distinct from the PR CI run which also had 223/223.
- #621 log: nmixx-youtube outcome skipped, itemsSeen 0; Google News and Bing News both succeeded; 6/6 queries per engine; 10 new discovery candidates; total discovery candidates 922. Query failures empty.
- Collector output explicitly reported status disabled, networkRequests 0, retainedVideos 20. Data API entrypoint reported disabled-policy. Workflow no longer injects YOUTUBE_API_KEY.
- #621 validation: 20 video records, 0 photo records, 192 schema-valid run logs, 1 append-only query failure event. The sole event remains the real #617 Google News 429 for query 오해원 근황; no second real failure occurred and no synthetic event was created.
- #621 data commit: bf5e6b925b2c5cae351fc7759b2ae088fce110b6. Artifact 15173364036, 719,896 bytes, GitHub artifact SHA-256 digest 76815c94c3f2cac80dcbe99adc914c395ced735150c97641a181d8a9dc1e860c. Upload and deploy-pages steps succeeded. Independent opening of the public Pages URL was not possible in the verifier; live-site verification remains unconfirmed.
- Latest #621 metrics: 922 candidates (735 article, 187 video), 111 items with publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 standalone photo records, 359 assigned thumbnails, 563 missing, 273 legacy shared assignments. The article-image count increased from 61 to 62 on this run; it remains distinct from standalone photos.
- #619 remains failed due the literal backslash-n JSON serialization defect; #620 succeeded after PR #66; #621 succeeded with Atom polling disabled. Do not conflate these runs.
- The 20:17 KST scheduled Production run was still pending at this checkpoint. #621 was a push-triggered run, not the scheduled cron run.
- Android Chrome real-device QA remains unverified.


## 2026-11-27 — Scheduled Production #622 verification and cron-time discrepancy
- Production #622 (run 45943513107) completed successfully with event=schedule, 223/223 tests, full committed-data validation and successful Pages artifact upload/deploy steps.
- Run #622 started at 2026-11-27T05:03:36Z (14:03:36 KST), which does not match the configured 20:17 KST cron slot (11:17Z). It is a genuine schedule event, but do not label it as the 20:17 KST execution. The intended 20:17 slot remains separately pending at this checkpoint; investigate the schedule timestamp/queue behavior on the next cycle.
- #622 collector output: YouTube Atom disabled, networkRequests 0, retainedVideos 20; Data API disabled-policy. Run log marks nmixx-youtube skipped, 0 items; Google News/Bing News both successful; queryFailures empty.
- #622 test count 223/223. Data commit 9de65fa731e459bf6238b7983169be1788644525. Pages artifact 15172754616, 724,180 bytes, SHA-256 digest a3510de9411c6449c2848c0eb231fcdbc408358f872fa28f5c8b2e5a903c1dbb. Upload and deploy-pages steps succeeded; public URL still not independently accessible to verifier.
- Query-failure history remains exactly one real event from #617 (Google News HTTP 429, query 오해원 근황, retryAttempted false, no Retry-After). #622 had no query failures; no synthetic event added.
- #622 data metrics: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl items, 84 verified Haewon articles, 62 article-image previews, 0 standalone photo records, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments.
- #621 was a separate push-triggered successful Production run; #622 was a schedule event. Both ran 223/223 and both kept YouTube automation disabled. #619 failed, #620 succeeded but still polled the Atom feed; PR #71 fixed the policy conflict.
- PR #73 corrected the persisted next prompt to resolve latest main dynamically and merged as f62ebcaeb55e4b873f3572d72c81a78137d01117 after CI #45943533328 passed 223/223.
- Android Chrome real-device QA remains unverified.

## 2026-11-27 — Schedule trigger observability investigation
- Audit baseline main: 65d53b239eff93ffbea46b87940af7b4c3c0308e; open PRs 0.
- Production #622 (45943513107) is event=schedule, created/started 2026-11-27T05:03:36Z (14:03:36 KST). #614 (45889430699) is event=schedule, created/started 2026-11-26T20:13:18Z (2026-11-27 05:13:18 KST). At both run head commits, workflow config was identical: `17 11 * * *` and `17 23 * * *`. Neither observed start matches either configured cron instant.
- GitHub run API exposes event=schedule but previous run logs only stored generic `github_schedule`; exact `github.event.schedule` was not persisted, so the fired cron cannot be recovered retrospectively.
- GitHub docs confirm schedule runs may be delayed under high Actions load, especially at the start of an hour, but that does not by itself explain these earlier-than-configured timestamps. Root cause remains unverified.
- #622 job log confirms 223/223 tests; Atom collector disabled, networkRequests 0, 20 videos retained; Data API disabled-policy; queryFailures empty; 936 candidates; failure history 1 actual #617 event. Data commit 9de65fa731e459bf6238b7983169be1788644525.
- #622 artifact 15172754616, 724180 bytes, digest sha256:a3510de9411c6449c2848c0eb231fcdbc408358f872fa28f5c8b2e5a903c1dbb. Upload and deploy-pages steps succeeded; public Pages URL could not be independently opened.
- Implementation prepared in PR branch: pass `github.event.schedule` to run logger and record optional `scheduleExpression`; schema and regression tests cover scheduled and non-scheduled records. This cannot retroactively explain #614/#622.
- 20:17 KST execution is future at this checkpoint (15:00 KST); no result is inferred.
- Android Chrome real-device QA remains unverified.

## 2026-11-27 — PR #75 schedule-expression instrumentation and Production #623
- PR #75 added optional `scheduleExpression` to the run-log schema/logger and passed `github.event.schedule` through `GITHUB_EVENT_SCHEDULE`. It was merged as `a2eeba7763323ec7ec953c033fc01815cdcace42` after PR CI #105 (run 45949495617) passed 226/226 tests and committed archive validation.
- Post-merge Production #623 (run 45949528329) was a push event, not a scheduled run. It completed successfully with 226/226 tests, archive validation, artifact upload and deploy-pages success.
- #623 data commit: `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Artifact 15176047291, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL could not be independently opened.
- #623 run log: trigger github_push, no scheduleExpression (expected for push); nmixx-youtube skipped, Google News/Bing News successful, queryFailures empty. YouTube collector status disabled, 0 network requests, 20 videos retained; Data API disabled-policy.
- Failure history remains exactly one actual #617 Google News HTTP 429 event, with retryAttempted false and no Retry-After. No synthetic failures. #623 did not add a new failure.
- Metrics remain 936 candidates (749 article, 187 video), 111 publisherArticleUrl items, 84 verified Haewon articles, 62 article-image previews, 0 standalone photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments.
- #614 (45889430699) started 2026-11-26T20:13:18Z and #622 (45943513107) started 2026-11-27T05:03:36Z. Both are event=schedule but neither timestamp matches the configured cron instants (17 11 / 17 23 UTC). Previous run logs did not preserve github.event.schedule, so exact cron source cannot be recovered.
- The next 20:17 KST slot is still pending at this checkpoint. Verify a future schedule run's new scheduleExpression field; do not treat #623 push as the requested scheduled run.
- Android Chrome real-device QA remains unverified.

 
## 2026-11-27 19:08 KST — Independent verification checkpoint after PR #76
- Re-read the seven canonical continuity documents and inspected the current workflow, current main, open PR/issue search, PR #75/#76, Production #623, run log, data files, artifact metadata and job logs.
- Latest main: 63f3c9c2daf0732252ac2c1e330cedaead0daeb5. Open PR/issue search returned none. PR #75 merged at a2eeba7763323ec7ec953c033fc01815cdcace42. PR #76 merged at 63f3c9c2daf0732252ac2c1e330cedaead0daeb5; PR #76 CI run 45949751531 passed 226/226 and committed archive validation.
- Production #623 run 45949528329: event=push; created_at/run_started_at 2026-11-27T06:04:22Z; run-log startedAt 06:04:29Z; finishedAt 06:04:49.518Z. This is not a schedule run and correctly has trigger=github_push with no scheduleExpression.
- #623 job succeeded. Tests 226/226; archive validation passed; Google News 99 items and Bing News 31 items; queryFailures empty. Data commit c5382d9816e114c565357f0f22eb47e1b7771b0b.
- Artifact 15176047291, 731041 bytes, digest sha256:f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7. Upload and Deploy to GitHub Pages job steps succeeded. Direct public URL open was not accessible to verifier; no claim of live public-site confirmation.
- YouTube Atom collector state disabled, networkRequests 0, retainedVideos 20; data/videos.json has 20 records. Workflow has no YOUTUBE_API_KEY environment injection; YouTube Data API remains disabled.
- data/query-failure-history.json still has exactly one actual #617 Google News HTTP 429 for query '오해원 근황', retryAttempted=false, no Retry-After. #623 had no query failures. No second distinct real failure occurred, so live multi-failure retention remains unverified; unit regression test covers preserving an earlier failure, appending a distinct later failure, and deduplicating replays. No synthetic event created.
- Workflow cron remains 17 11 * * * and 17 23 * * * UTC. Requested 20:17 KST slot (11:17 UTC) is future at this 19:08 KST checkpoint. Verify only a later event=schedule run whose data/run-logs/<run-id>.json contains trigger=github_schedule and scheduleExpression='17 11 * * *'; compare log startedAt, Actions created_at and run_started_at. Do not mistake push #623 for the scheduled run.
- #614 (45889430699) and #622 (45943513107) remain schedule events with starts earlier than either configured cron instant. Old logs did not persist event.schedule, so the exact expression cannot be recovered retrospectively. GitHub's official docs say schedule events may be delayed or dropped during high load, especially at the start of an hour; that is not evidence explaining earlier-than-cron starts. Keep root cause unresolved and do not alter cron.
- Official reference: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows and https://docs.github.com/en/actions/how-tos/troubleshoot-workflows
- Article-image previews and standalone photo records remain separate metrics; preserve 273 legacy shared-thumbnail assignments and PR #54/#56 transactional save/move/restore behavior. Android Chrome real-device QA remains unverified.
- No code or source-policy change in this checkpoint; next action is to verify the 20:17 KST scheduled run after its scheduled time.

 
## 2026-11-27 21:22 KST — Post-slot verification and continuity update

### Scope and live repository state
- Re-read all seven canonical continuity documents and inspected live main, open PR search, recent Actions, workflow, run logs, data files, Production job logs, artifacts, PR #77 and its CI.
- Main at start: `ceed2b68e7f3e76a70b1e1740fafa0e41e677230`. PR #77 merged. PR #77 CI #107 (`45980001843`) passed 226/226, 0 failures, and `npm run validate` on committed archive data passed.
- No open PRs were found at the start of this cycle.

### 20:17 KST scheduled-run result
- Requested slot: 2026-11-27 20:17 KST = 11:17 UTC. It had passed by the 21:22 KST checkpoint.
- The live Actions listing showed no Production #624 or later Production run. Latest Production remained #623 (`45949528329`, event=push). No matching run-log for this slot with `trigger=github_schedule` and `scheduleExpression=17 11 * * *` was present.
- #623 timing: Actions `created_at=2026-11-27T06:04:22Z`, `run_started_at=2026-11-27T06:04:22Z`; run-log `startedAt=2026-11-27T06:04:29.000Z`, `finishedAt=06:04:49.518Z`; `trigger=github_push`. It is not the requested schedule run.
- Do not infer the 20:17 run was dropped, delayed, or failed without an observed event. Keep the cause unknown. Do not change cron.
- Existing anomalies #614 (`45889430699`) and #622 (`45943513107`) remain unresolved; historical run logs do not contain scheduleExpression and cannot be retroactively mapped to one of the two cron expressions.

### Production #623 evidence (latest verified)
- Job `140341900635` completed successfully. Test output: 226 tests, 226 pass. Archive validation passed.
- Google News: 99 items; Bing News: 31 items; queryFailures empty. Collection status reports six of six Google News queries and six of six Bing queries successful. News deduplication: 99 pre-merge candidates, 90 unique fetched, 9 exact/canonical duplicates collapsed, 2 newly added.
- Data commit: `c5382d9816e114c565357f0f22eb47e1b7771b0b`.
- Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Upload and deploy-pages steps succeeded; deployment action reported success.
- Direct open of `https://uforpel.github.io/haewon-archive/` was inaccessible in the verifier. Public URL and actual live UI remain unverified.
- Current metrics: 936 candidates (749 articles, 187 videos); 111 publisherArticleUrl items; 84 verified Haewon articles; 62 verified Haewon article image previews; 359 thumbnail assignments; 577 missing; 273 repeated legacy shared-thumbnail assignments; independent photos 0. Keep image/photo counts separate.
- Thumbnail review: 493 eligible, 0 reviewed, 0% review coverage, precision null. RSS/meta comparison: 86 articles compared, RSS-only 0, meta-only 86, both 0; persisted metadata candidates 86. No visual relevance accuracy claim.

### Failure history and source-policy invariants
- `data/query-failure-history.json` still contains one real #617 Google News HTTP 429 for `오해원 근황`, `retryAttempted=false`, no Retry-After. Later successful #620/#622/#623 runs preserved the record.
- No second distinct real live failure occurred; no synthetic event added. Multi-event append/dedup is covered by unit regression tests, but a second live event and its survival through a later live success remain unverified.
- YouTube Atom collector remains disabled; videos.json remains 20 records; source registry says disabled; workflow does not inject `YOUTUBE_API_KEY`. YouTube Data API remains disabled.
- Keep JYP/NMIXX Gallery/Notice collector prohibition, SBSKPOP ZOOM ownership unresolved, no broadcaster collectors or broadcaster-official auto-classification, no Google News wrapper decoding/access bypass, preserve 273 legacy thumbnail assignments and PR #54/#56 transactional save/move/restore.

### Changes and next action
- No code, test, data, collector, source-policy, or cron changes in this cycle. Seven continuity documents are being updated with this checkpoint only.
- Android Chrome real-device QA remains unverified until user directly checks.
- Next cycle: check whether a late run appears for the 20:17 slot and inspect the next configured 08:17 KST slot (2026-11-28 23:17 UTC) only after it passes. Require `event=schedule`, `trigger=github_schedule`, and the exact logged expression `17 23 * * *`; compare all timestamps, tests, collection, data commit, artifact digest, deploy step and direct public URL access. Investigate official scheduler behavior without speculating or changing cron.

 
## 2026-11-27 22:03 KST — Late schedule check and evidence-based thumbnail review

### Live state
- Current main re-read from GitHub: `933118349f54a07c2bab9a50b6bd6d1ec9794611`; no open PRs before this cycle. Seven canonical docs re-read.
- Latest Actions list (40 most recent) contains PR CI #108 and #107, Production #623 push, Production #622 schedule, and no Production #624 or later. The 20:17 KST / 11:17 UTC slot remains not observed at 22:03 KST; no cause assigned.
- Next scheduled slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, requiring `event=schedule`, `trigger=github_schedule`, and `scheduleExpression=17 23 * * *`.

### Production and deploy evidence
- #623 run `45949528329` remains the latest Production and is a push event. Actions created_at/run_started_at: `2026-11-27T06:04:22Z`; run log startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`; trigger `github_push`.
- Job `140341900635`: 226 tests, 226 pass, 0 fail; archive validation passed. Google News 99 items, Bing News 31 items; both feeds' six queries succeeded; YouTube source skipped; run-log validation passed.
- Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`.
- Artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Pages configure, upload, and deploy steps all succeeded.
- Public Pages URL direct access failed in the web verifier; mark public URL/live UI unverified, not deployed-site success.
 
### Thumbnail bottleneck and research
- #623 `news-collection-status.json`: 68 Google RSS items and 31 Bing RSS items, 0 image-bearing RSS signals in either feed, 0 RSS image candidate articles, 0 RSS image candidates, 0 thumbnail enrichment attempts in that run. Both feed query groups succeeded; this is not a feed failure.
- Current metrics: 936 total candidates (749 articles, 187 videos); 111 publisherArticleUrl records; 84 verified Haewon articles; 62 verified Haewon article-image previews; 359 assigned thumbnails; 577 missing; 273 legacy shared assignments; independent photos 0. RSS/meta comparison 86 compared, 0 RSS-only, 86 meta-only, 0 both. Review 493 eligible/0 reviewed; precision null.
- Reviewed `scripts/collect-news.mjs`: RSS parser supports Media RSS thumbnail/content, image enclosure, description HTML and content:encoded. Publisher metadata extraction supports OG/Twitter, image_src, itemprop:image and JSON-LD. Enrichment only uses explicit HTTPS publisherArticleUrl, requires missing thumbnail, normal public GET/redirect following, and bounded retry backoff; it rejects Google News wrapper metadata as a publisher image.
- Research: Google Search Central Article and general structured-data guidelines emphasize representative/relevant, crawlable/indexable images and reject irrelevant markup; Open Graph protocol defines og:image plus optional type, width, height and alt. These sources do not justify logo substitution or wrapper decoding. URLs: https://developers.google.com/search/docs/appearance/structured-data/article ; https://developers.google.com/search/docs/appearance/structured-data/sd-policies ; https://ogp.me/
- No specific parser defect was demonstrated, so no code change was made. Further improvement should isolate whether any missing explicit publisher URLs are retry-eligible and whether an actual public publisher page contains image metadata that current extractor misses. Do not infer from a truncated large discovery JSON response.
 
### Safety/policy and next work
- Failure history remains exactly one real #617 HTTP 429; no second real event and no synthetic event. Videos.json remains 20; YouTube Atom source registry disabled; workflow does not inject YOUTUBE_API_KEY. Existing 273 legacy group and PR #54/#56 transaction semantics unchanged.
- No code/data/workflow/source-policy changes in this cycle; documentation-only evidence update. Android Chrome real-device QA unverified.
- Next: inspect any late Production, then next schedule slot after 08:17 KST. Verify schedule expression and timestamps, tests, collection, data commit, artifact digest, deploy and direct URL separately. Continue thumbnail analysis only with measured eligible records/human labels; no auto-delete/replace.


## 2026-11-27 22:10 KST — Live GitHub and thumbnail retry audit

### Live state and schedule
- Main at cycle start: `dd4ff74e5b4be907f34bdd0c1dffb62a7dd37030`; PR #79 merged; no open PRs.
- Latest Actions list contains no Production #624 or later. Latest Production remains #623 push. 20:17 KST slot not observed; cause unknown. Next slot 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC; require event=schedule, trigger=github_schedule, scheduleExpression=17 23 * * * and compare timestamps.

### Production / artifact / Pages
- #623 run 45949528329: Actions created/run_started 06:04:22Z; run-log startedAt 06:04:29.000Z, finishedAt 06:04:49.518Z; trigger github_push.
- Job 140341900635 passed 226/226 tests, 0 failures, archive validation. Google News 99, Bing News 31; six queries each succeeded; no queryFailures; YouTube skipped.
- Data commit c5382d9816e114c565357f0f22eb47e1b7771b0b. Artifact 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7. Pages configure/upload/deploy steps succeeded. Public URL remains unavailable to verifier; independent live UI/Android QA unverified.

### Exact retry eligibility
- Parsed full Git blob data/discovery.json (936 records, 1,482,894 bytes), not a truncated response. Explicit HTTPS publisherArticleUrl = 111; missing thumbnail = 577; missing + explicit publisher URL = 27.
- Of those 27: 17 status=missing, 10 status=failed (8 x 403/forbidden, 1 x 405/method-not-allowed, 1 x 405/network-error). At 2026-11-27 22:10 KST, exact current retry policy yields 0 eligible. All 27 are within applicable 7-day delay; earliest next eligibility is 2026-12-01T06:57:55Z.
- At #623 collection timestamp offset = 83137; six-hour rotation and max 12 target limit remain unchanged. With zero eligible records, selected target count is zero. No requests made in this audit.
- No HTML fixture or parser expansion warranted: no retry target and no concrete public page proving an extraction miss. No code change.

### Data / policy / unresolved
- Baseline: 936 candidates (749 articles, 187 videos), 111 publisher URLs, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 assigned thumbnails, 577 missing, 273 legacy shared assignments. RSS signals/candidates 0; comparison 86 meta-only; review 493 eligible/0 reviewed, precision null.
- Failure history contains only real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, no workflow YOUTUBE_API_KEY. collection-status has no networkRequests field; itemsFetched=0 is visible. Source restrictions unchanged.
- Android Chrome real-device QA unverified; preserve 273 legacy assignments and PR #54/#56 transactional flow.


## 2026-11-27 22:19 KST — Fresh live verification
- Live GitHub main rechecked: `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. All seven canonical documents were re-read from this main before this checkpoint. Latest Actions list still contains no Production #624 or later run. The 20:17 KST / 11:17 UTC slot remains unobserved, cause unknown; do not call it a dropped or failed run.
- Current time 2026-11-27 22:19 KST. Next configured slot remains 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron `17 23 * * *`; it is still future. Require Actions `event=schedule`, run-log `trigger=github_schedule`, and exact `scheduleExpression=17 23 * * *`; compare Actions `created_at`/`run_started_at` with run-log `startedAt`. No cron change; do not infer historical #614/#622 expression.
- Latest Production remains #623 run `45949528329`, `event=push`, created/run_started `2026-11-27T06:04:22Z`. Run log `data/run-logs/45949528329.json`: trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`, success; Google News 99, Bing News 31, YouTube skipped; queryFailures empty; validation passed. Job `140341900635` success, tests 226/226, fail 0, archive validation success, Pages configure/upload/deploy all success. Data commit `c5382d9816e114c565357f0f22eb47e1b7771b0b`; artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Public Pages URL was retried through the web verifier and remains inaccessible to that verifier; this is not evidence that the site is down. Direct public access remains unverified.
- Fresh full-blob audit of `data/discovery.json` (936 records; Git blob 1,482,894 bytes): 111 explicit HTTPS publisherArticleUrl records; 577 missing thumbnails; 27 records have both missing thumbnail and explicit publisher URL. States: 17 `missing` (10 statusCode 200, 7 no statusCode), 8 `failed/403/forbidden`, 1 `failed/405/method-not-allowed`, 1 `failed/405/network-error`. Applying exact `shouldRetryThumbnailFetch` logic at 2026-11-27 22:19:12 KST yields 0 eligible. Earliest next eligibility is `2026-12-01T06:57:55.671Z` (one record); current six-hour offset is 83138; selected targets 0 of max 12. No network requests were made for this audit.
- Code lines 211–227 in `scripts/collect-news.mjs` confirm 30-day assigned/found/duplicate-rejected/wrapper-only; 7-day missing and 405/forbidden/rate-limited/not-found classes; 1-day general failed; six-hour offset rotation; max 12. No eligible page or concrete extractor miss exists, so no HTML fetch, fixture, extractor code change, blind retry, or speculative change was made.
- Baseline unchanged: 936 candidates (749 articles, 187 videos), 111 publisherArticleUrl, 84 verified Haewon articles, 62 article-image previews, 0 independent photos, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image signals/candidates 0, 86 meta-only comparisons, thumbnail review 493 eligible / 0 reviewed, precision null. Preserve all 273 legacy records and PR #54/#56 transactional save/move/restore.
- `data/query-failure-history.json` still has exactly the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, videos.json 20, Data API disabled, workflow has no `YOUTUBE_API_KEY` injection. `collection-status.json` lacks `networkRequests`; `itemsFetched=0` is visible but do not claim measured networkRequests=0. All source restrictions unchanged.
- Android Chrome real-device QA remains unverified pending user check. Public Pages URL verification and Android rendering remain separate from successful deploy steps.


## 2026-11-27 22:19 KST — Live checkpoint
- Main `7ac89feae4ac0b18bb3d99319fadd7e52ddab7de`; no open PRs. Latest Production #623 remains a push run; no Production #624 or later in the latest Actions list. 20:17 slot not observed, cause unknown. Next schedule is 2026-11-28 08:17 KST with `17 23 * * *`; require matching Actions event=schedule, run-log trigger=github_schedule and scheduleExpression, plus timestamp comparison.
- #623 run 45949528329: Actions created/run_started 06:04:22Z; run log started 06:04:29.000Z, finished 06:04:49.518Z, trigger github_push. 226/226 tests, full archive validation passed; Google News 99, Bing News 31, no query failures, YouTube skipped. Data commit c5382d9816e114c565357f0f22eb47e1b7771b0b. Artifact 15176047291, 731041 bytes, SHA-256 f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7. Pages configure/upload/deploy steps success. Public URL verifier still cannot access it; direct access unverified.
- Full discovery blob parsed: 936 records; 111 explicit HTTPS publisherArticleUrl; 577 missing thumbnail; 27 missing + explicit publisher URL. Status breakdown: missing 17 (10 status 200, 7 absent), failed 10 (403 forbidden 8, 405 method-not-allowed 1, 405 network-error 1). Exact current retry logic at 22:19:12 KST: eligible 0; earliest next eligibility 2026-12-01T06:57:55.671Z; offset 83138; selected 0/12. No requests made.
- Existing retry code: 30-day assigned/found/duplicate-rejected/wrapper-only, 7-day missing and 405/forbidden/rate-limited/not-found, 1-day general failed; six-hour offset rotation; max 12. No eligible page/concrete parser miss, so no fixture or code change.
- Baseline unchanged: 936 (749 articles, 187 videos), 111 publisher URLs, 84 verified Haewon articles, 62 article previews, 0 independent photos, 359 assigned, 577 missing, 273 legacy shared. RSS signals/candidates 0, 86 meta-only, review 493 eligible/0 reviewed, precision null. #617 remains the only real query failure; no synthetic event. YouTube Atom and Data API disabled, videos 20, no workflow YOUTUBE_API_KEY; collection-status has no networkRequests field.
- Preserve 273 legacy shared assignments, PR #54/#56 transactional workflow and all source restrictions. Android QA and direct public Pages access remain unverified.

## 2026-11-27 22:31 KST — Live verification checkpoint
- Live main at start of this cycle: `d0b256db3fa4208112900387a2021683f6abbf71`; latest re-fetch confirmed it remained current. No open PRs.
- Current time is 2026-11-27 22:31 KST. The 20:17 KST / 11:17 UTC Production slot remains unobserved / cause unknown. The next slot is 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC, cron expression `17 23 * * *`; it is still in the future. Do not label it success/failure before it runs. Afterward require Actions event=schedule, run-log trigger=github_schedule, exact scheduleExpression, and compare created_at/run_started_at with startedAt. Do not infer #614/#622 expressions or change cron.
- Latest Production remains #623, run `45949528329`, event=push. Actions created_at/run_started_at `2026-11-27T06:04:22Z`; run-log trigger `github_push`, startedAt `06:04:29.000Z`, finishedAt `06:04:49.518Z`. Job `140341900635` succeeded; 226/226 tests, 0 failures; run-log validation passed. Google News 99, Bing News 31, YouTube skipped, queryFailures empty. Pages configure/upload/deploy steps succeeded.
- Data commit remains `c5382d9816e114c565357f0f22eb47e1b7771b0b`. Pages artifact `15176047291`, 731041 bytes, SHA-256 `f2e72fe333ec583d944a21c19332f54c416c65c2807bf13e596576e2e89869e7`. Independent public Pages URL access remains unverified; successful deploy steps are not live-site proof.
- Current main's full Git blob for `data/discovery.json` was parsed: 936 records, 577 missing thumbnails, 111 explicit HTTPS publisherArticleUrl, 27 records with both missing thumbnail and explicit publisher URL. Nested `thumbnailMetaFetch` classes: missing 17 (10 status 200, 7 no status); failed 10 (403/forbidden 8, 405/method-not-allowed 1, 405/network-error 1). Exact 1/7/30-day retry policy yields 0 eligible at 22:31 KST; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No requests or blind retries were made. The six-hour offset/max-12 policy is unchanged; selected count is 0.
- Quality metrics still show 936 candidates (749 articles, 187 videos), 84 verified Haewon articles, 62 verified Haewon article-image previews, 359 thumbnail assignments, 577 missing, 273 legacy shared assignments; RSS image candidates 0, 86 meta-only comparisons, review 493 eligible / 0 reviewed / precision null. Independent photos remain 0.
- `data/query-failure-history.json` still contains only the real #617 HTTP 429; no synthetic events. YouTube Atom disabled, `videos.json` 20, Data API disabled, no workflow YOUTUBE_API_KEY injection. `collection-status.json` has no `networkRequests` field; do not claim measured networkRequests=0. Preserve all source restrictions, 273 legacy assignments, and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA remains unverified until the user checks directly. No code or collection-data change was justified in this cycle.

## Work performed
- Re-read seven canonical documents from current main; rechecked main, open PRs, recent Actions, Production #623 job, run log, artifact, data commit and full discovery blob.
- Corrected the current item-level retry audit using the nested `thumbnailMetaFetch` object. Eligibility remains zero; no code/data changes or network requests.

## 2026-11-28 06:47 KST — Live recursive-improvement cycle
### Repository and schedule
- Re-fetched live main from GitHub: dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2; prior checkpoint SHA was not assumed current. Read all seven canonical documents from this main before this update. Open PR search returned none before creating this documentation PR.
- Production #624 / Actions run 46060489526 is a successful schedule run. Actions event=schedule; created_at and run_started_at both 2026-11-27T19:59:27Z. Run-log trigger=github_schedule, scheduleExpression=17 11 * * *, startedAt=19:59:31.000Z, finishedAt=19:59:52.735Z. This is the prior 20:17 KST / 11:17 UTC slot, observed 8h42m27s after the scheduled clock. The run was not visible at the 22:31 checkpoint; now confirmed. Root cause of delay is unknown.
- The distinct next 08:17 KST / 23:17 UTC slot (17 23 * * *) remained future at the current 06:47 KST checkpoint. No cron change and no premature verdict.
### Production / tests / data / deployment
- Job 140713285787 completed successfully. Node test output: 226 tests, 226 pass, 0 fail. Run log says validation passed; Google News 193, Bing News 36; 6/6 queries succeeded; queryFailures empty; YouTube skipped.
- Data refresh commit and new main: dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2.
- Pages artifact 15228811375, 770763 bytes, digest sha256:a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Pages configure/upload/deploy steps succeeded. Direct public URL access not verified.
- Full discovery blob 9059841c0577269da3be828dfa15660b86fd926d (1,425,314 decoded characters): 962 records; quality metrics report 774 article candidates and 188 video candidates; 113 explicit HTTPS publisherArticleUrl; 602 missing thumbnails; 28 missing+explicit publisher URL; 360 thumbnail assignments including 273 unverified legacy. 84 verified Haewon articles; 62 article-image previews; 0 RSS image candidates; thumbnail review 493 eligible / 0 reviewed / precision null.
- #624 thumbnail enrichment attempted 2 explicit publisher pages: fnnews OG image assigned; tvdaily no candidate. Full audit using exact shouldRetryThumbnailFetch code at 2026-11-27T21:47:00Z (2026-11-28 06:47 KST) returned 0 eligible. Earliest next eligibility 2026-12-01T06:57:55.671Z. Retry policy and offset unchanged; no blind retries/network fetches.
- Query-failure history still only real #617 HTTP 429; no synthetic failures. YouTube Atom disabled, videos.json 20, Data API disabled, no YOUTUBE_API_KEY workflow injection. collection-status.json has no networkRequests field.
### Decisions and remaining checks
- No collector/parser/test changes: zero retry eligibility and no demonstrated extractor bug. One successful image assignment is an incremental observed outcome, not proof of broad improvement.
- Keep 273 legacy assignments and PR #54/#56 transactional save/move/restore. Keep JYP/NMIXX Gallery/Notice collectors disabled, SBSKPOP ZOOM ownership unconfirmed, no broadcaster collector/auto-label, no Google News wrapper decoding or access bypass.
- Android Chrome real-device QA and direct Pages URL access remain unverified.
- This PR changes seven operational documents only; merge only after PR CI and full committed-data validation pass.

## 2026-11-28 06:47 KST — Documentation PR completion
- The seven-document update was submitted as PR #84 and CI run #114 (46072826084) completed successfully. Its Unit tests and Validate committed archive data steps both passed.
- PR #84 was merged after those checks, using squash merge. Merge commit / verified main immediately after merge: f2ca4cc33ecde38501a35c7332e6f0584f25a6ce. Post-merge open-PR search returned none.
- This finalization note corrects the interim status in this cycle's checkpoint: PR #84 is merged, not awaiting CI. It was documentation-only; no collector or dataset code was changed.
- Production #624 remains a separate successful schedule run for the prior 20:17 KST slot, delayed by 8h42m27s; cause unknown. The distinct 08:17 KST slot (17 23 * * *) was still in the future at 06:47 KST.

## 2026-11-28 06:47 KST — Final audit correction
- Arithmetic correction: cron minute 11:17:00Z to Actions created_at/run_started_at 19:59:27Z is 8 hours 42 minutes 27 seconds (not 8h42m10s). Run-log startedAt 19:59:31Z is 8h42m31s after the scheduled clock. The slot classification remains unchanged: delayed observed schedule event; delay cause unknown.
- PR #85 CI run #115 (46072938784) passed Unit tests and Validate committed archive data; PR #85 was merged. Main at the start of this correction PR: bfcb34d73e5c05ee8692c12a6500dff2c4375f10. No open PRs were found after the merge.

## 2026-11-28 07:00 KST — Pre-slot live verification
- Re-fetched GitHub main at checkpoint: `39ff7cf62e971e4e61d18ef9bbb1bda7d355fa0c`; it matches the previous handoff SHA. Open PR search returned 0.
- Re-read all seven operating documents from this exact main SHA before recording this checkpoint.
- Current local time was independently checked as 2026-11-28T07:00:51+09:00. The next scheduled slot 2026-11-28 08:17 KST / 2026-11-27 23:17 UTC (`17 23 * * *`) is still future. No success/failure verdict. Workflow currently contains both `17 23 * * *` and `17 11 * * *`; no cron changes.
- Production #624 / Actions run 46060489526 is confirmed separately: Actions event=schedule, created_at/run_started_at=2026-11-27T19:59:27Z; job 140713285787 started 19:59:29Z and succeeded. The exact committed run log `data/run-logs/46060489526.json` records trigger=github_schedule, scheduleExpression=`17 11 * * *`, startedAt=19:59:31.000Z, finishedAt=19:59:52.735Z, status=success, validation.passed=true, Google News 193, Bing News 36, YouTube skipped, queryFailures empty. This is the prior 20:17 KST slot, delayed by 8h42m27s from the cron minute to Actions created_at; cause remains unknown.
- #624 artifact metadata: github-pages artifact 15228811375, 770763 bytes, not expired. Earlier verified SHA-256 remains a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Job steps configure-pages, upload-pages-artifact, and deploy-pages succeeded. Direct public URL access remains unverified.
- Current main still carries #624 data commit `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2` (parent 330b5fb7dbdeef689a5117b087cc1ee42a34a747); the documentation commits after it did not create a new Production/data run.
- Re-read the full discovery Git blob `9059841c0577269da3be828dfa15660b86fd926d` via Git blob API and parsed all 962 records. Current audit: 602 missing thumbnails; 113 explicit HTTPS publisherArticleUrl; 28 missing+explicit HTTPS publisher URLs. The 28 break down into 18 `thumbnailMetaFetch.status=missing` (11 HTTP 200, 7 without status code) and 10 failed (8 HTTP 403/forbidden, 1 HTTP 405/method-not-allowed, 1 HTTP 405/network-error). Exact current `shouldRetryThumbnailFetch` implementation was read from `scripts/collect-news.mjs`: missing=7 days; failed normally=1 day but 405/not-found/forbidden/rate-limited/method-not-allowed=7 days; assigned/found/duplicate-rejected/wrapper-only=30 days. Recomputed at 2026-11-28 07:00 KST: 0 retry-eligible; earliest next eligibility remains `2026-12-01T06:57:55.671Z`. No blind requests.
- Quality metrics generated 2026-11-27T19:59:41.083Z: 962 candidates (774 article, 188 video); 113 explicit publisher URLs; 360 assigned thumbnails (273 unverified legacy, 77 OG, 8 twitter:image, 1 link:image_src, 1 twitter:image:src); 602 missing; 84 verified Haewon articles; 62 verified Haewon article previews; RSS image candidates 0; 87 meta-only comparisons; review 493 eligible/0 reviewed/precision null.
- #624 collection-status is YouTube-only and has no networkRequests field; do not infer 0 requests. videos.json still 20; YouTube Atom and Data API remain disabled; no YOUTUBE_API_KEY workflow injection. Query-failure history contains only the actual #617 HTTP 429 (runId 45916213360); no synthetic failures.
- Recursive-improvement state is exploratory: 6-query rotation pack 1/6, cumulative candidates 962, current-run candidates 193, 20 video records; 0 human-reviewed relevance labels, precision null, no automatic strategy promotion. Keep query-pack rotation only; preserve candidates.
- No code/data changes are justified before the next slot: retry eligibility is zero and no concrete eligible-page extractor miss exists. Preserve 273 legacy shared thumbnails, PR #54/#56 transactional save/move/restore, all source restrictions, and no Google News wrapper decoding/access bypass.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. This checkpoint PR updates documentation only; merge only after PR CI and committed-data validation both pass.

## 2026-11-28 07:14:52 KST — Live pre-slot checkpoint
- Re-queried local time: 2026-11-28T07:14:52+09:00. The 08:17 KST / 2026-11-27 23:17 UTC slot (17 23 * * *) is still future; keep pending. No cron edits.
- Re-fetched live main from GitHub: 96b6b9a46ab2fca0ad8b41d80c2874d6146949d0; repository default branch is main. Open PR search returned 0. PR #87 is merged at this SHA; CI #117 / run 46074127871 passed both Unit tests and Validate committed archive data.
- Re-read all seven operating documents at this exact main SHA before this update.
- Latest Production in the current Actions run list remains #624 / 46060489526; no newer Production run is present. #624 is the distinct prior 20:17 KST delayed schedule run: event=schedule, created_at/run_started_at=2026-11-27T19:59:27Z; exact run log records trigger=github_schedule, expression=17 11 * * *, startedAt=19:59:31.000Z, finishedAt=19:59:52.735Z. Delay from 11:17:00Z cron minute to Actions start is 8h42m27s; cause unknown. Do not conflate with the future 08:17 slot or infer #614/#622.
- #624 job 140713285787 succeeded. Unit tests/data validation and collection/deployment workflow step succeeded; Pages configuration, artifact upload and deploy steps all succeeded. Artifact 15228811375 (github-pages) is 770,763 bytes and not expired. Previously verified SHA-256: a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Direct public URL access remains unverified.
- #624 run log/data state remains: Google News 193, Bing News 36, YouTube skipped, queryFailures empty; 226/226 tests and committed archive validation passed; data commit dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2. No new Production means no new full discovery-blob audit was required this checkpoint.
- Last full discovery audit remains 962 records (774 articles, 188 videos), 113 explicit HTTPS publisherArticleUrl, 602 missing thumbnails, 28 missing+explicit URL; assigned 360 (273 legacy shared), 84 verified Haewon articles, 62 article-image previews, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Last exact retry audit: 0 eligible, earliest next eligibility 2026-12-01T06:57:55.671Z. No blind retry or speculative extractor change.
- Quality/improvement state remains exploratory: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion. Current workflow schedule entries verified as 17 23 * * * and 17 11 * * *.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; no networkRequests inference from collection-status; only actual #617 HTTP 429 in failure history; no JYP/NMIXX Gallery/Notice collectors, no broadcaster collector/auto-classification, no Google News wrapper decoding/access bypass; preserve 273 legacy assignments and PR #54/#56 transactional save/move/restore.
- No code/data change is justified: the next slot is pending, no newer Production exists, retry eligibility is zero, and no concrete eligible-page extractor miss is evidenced. Android Chrome real-device QA and public Pages direct access remain unverified.
- This checkpoint is documentation-only across the seven operating documents. Merge only after PR CI and committed-data validation both pass.

## 2026-11-28 08:20 KST — Post-slot live verification
- Re-fetched live main from GitHub: 45f400154ecb073d31dd28ad626df6c254d27313. Re-read all seven operating documents at this exact SHA before this checkpoint. Open PR search returned 0.
- Current time is 2026-11-28 08:20 KST. The 08:17 KST / 2026-11-27 23:17 UTC schedule slot (cron 17 23 * * *) has elapsed.
- Queried GitHub Actions filtered to event=schedule: 19 runs returned; newest remains Production #624 / 46060489526, created_at/run_started_at=2026-11-27T19:59:27Z. No schedule run after the target 23:17:00Z slot was observed at this checkpoint. This is recorded as "slot elapsed; matching run not observed", NOT as a failed run, dropped schedule, or confirmed GitHub omission. Recheck later for delayed arrival. No run-log for the target slot is available because no matching Actions run is currently visible.
- Workflow file at current main still contains cron expressions 17 23 * * * and 17 11 * * *; no changes made.
- Distinct prior Production #624 remains: Actions event=schedule; run-log trigger=github_schedule, scheduleExpression=17 11 * * *, startedAt=2026-11-27T19:59:31.000Z, finishedAt=19:59:52.735Z. This belongs to the prior 20:17 KST slot and started 8h42m27s after its cron minute; delay cause unknown. Do not conflate with 08:17 slot or infer #614/#622 retroactively.
- #624 remains successful: 226/226 tests, committed data validation passed, Google News 193, Bing News 36, YouTube skipped, queryFailures empty. Data commit dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2. Pages artifact 15228811375, 770763 bytes, not expired; known SHA-256 a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd. Configure/upload/deploy succeeded; direct public URL access remains unverified.
- No newer Production means the prior full discovery audit remains the latest: 962 records (774 articles, 188 videos), 113 explicit HTTPS publisherArticleUrl, 602 missing thumbnails, 28 missing+explicit URL; 360 assigned (273 legacy shared), 84 verified Haewon articles, 62 article-image previews, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Do not claim a new audit was performed.
- Last exact retry audit remains 0 eligible, earliest next eligibility 2026-12-01T06:57:55.671Z. Preserve 1/7/30-day policy, six-hour offset rotation and max 12; no blind retry or speculative extractor change.
- Recursive improvement remains exploratory: query pack 1/6, cumulative candidates 962, current run 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; no networkRequests inference; only actual #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors, broadcaster collectors or broadcaster-official auto-classification, Google News wrapper decoding/access bypass; preserve 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and public Pages direct access remain unverified. No code/data change justified because no new Production, no retry-eligible targets, and no evidenced eligible-page extractor miss.
- This checkpoint is documentation-only across all seven operating documents. Merge only after PR CI and committed archive data validation both pass.


## 2026-11-28 08:42 KST — Delayed-schedule recheck and operating checkpoint
- Re-queried local time: 2026-11-28T08:42:29+09:00. Re-fetched the live `main` branch ref from GitHub: `37daaefd22bc574b80553a529ca2ae13e7cb76b4`; repository default branch remains `main`. Open PR search returned 0 before this documentation branch was opened.
- Re-read all seven operating documents at this exact main SHA before editing.
- Queried GitHub Actions `event=schedule` through the Actions runs API: `total_count=19`. The newest schedule run remains Production #624 / run `46060489526`, created_at/run_started_at `2026-11-27T19:59:27Z`. No schedule run after the 2026-11-27 23:17:00Z / 2026-11-28 08:17 KST slot is present in the returned schedule-run list at 08:42 KST. Record only as "slot elapsed; matching run not observed"; do not label it failed, dropped, omitted, or a confirmed scheduler incident. No cron changes.
- Current `.github/workflows/collect-and-deploy.yml` was fetched from main. Its schedule expressions remain exactly `17 23 * * *` and `17 11 * * *`.
- Keep #624 separate from the 08:17 slot. #624 is Actions `event=schedule`, created_at/run_started_at `2026-11-27T19:59:27Z`; its persisted run log `data/run-logs/46060489526.json` records `trigger=github_schedule`, `scheduleExpression=17 11 * * *`, `startedAt=2026-11-27T19:59:31.000Z`, `finishedAt=2026-11-27T19:59:52.735Z`. This is the prior 20:17 KST / 11:17 UTC schedule execution, with Actions creation 8h42m27s after the cron minute; cause unknown. Do not infer anything retroactively about #614 or #622.
- Rechecked #624 job logs and steps: job `140713285787` succeeded; 226 tests passed, 0 failed; committed archive validation passed; source outcomes were Google News RSS success / 193 items, Bing News RSS success / 36 items, NMIXX YouTube skipped / 0 items; queryFailures is empty. The run committed data as `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2`.
- #624 Pages artifact remains `15228811375`, `770763` bytes, SHA-256 `a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd`. Configure Pages, artifact upload, and deploy steps succeeded. Direct public Pages URL access remains unverified.
- PR #89 is confirmed merged at `2026-11-27T23:22:19Z`, merge/main SHA `37daaefd22bc574b80553a529ca2ae13e7cb76b4`. Its CI #119 / run `46082095163` passed Unit tests and Validate committed archive data. No new Production has appeared since #624; therefore no fresh discovery-data audit or new dataset metrics are claimed.
- The last full discovery audit remains historical only: 962 records (774 articles, 188 videos), explicit HTTPS publisherArticleUrl 113, missing thumbnails 602, missing+explicit URL 28, assigned thumbnails 360 (273 legacy shared), verified Haewon articles 84, article-image previews 62, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. Do not describe these as a new 08:42 audit.
- Last exact retry audit remains 0 eligible, earliest next eligibility `2026-12-01T06:57:55.671Z`. Preserve missing 7-day, failed general 1-day, specified 405/not-found/forbidden/rate-limited/method-not-allowed 7-day, and assigned/found/duplicate-rejected/wrapper-only 30-day backoff; preserve six-hour offset rotation and max 12. No blind retry. Only an evidenced extractor miss on an actually retry-eligible publisher article justifies a fixture, test, or code change.
- Recursive improvement remains exploratory: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null, no automatic strategy promotion.
- Preserve YouTube Atom/Data API disablement and no YOUTUBE_API_KEY injection; do not infer zero network requests from collection-status; preserve only the real #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors, no broadcaster collector or broadcaster-official auto-classification, no Google News wrapper decoding/access bypass; preserve all 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. No code/data change is justified at this checkpoint: no new Production, no retry-eligible target, and no evidenced eligible-page extractor miss.
- This cycle is documentation-only across all seven operating documents. The checkpoint is on a branch/PR; merge only after the PR verification workflow reports both Unit tests and Validate committed archive data successful. Report docs, code, tests, Production, data, artifact, Pages, and Android QA separately.


## 2026-11-28 08:57 KST — Post-slot schedule recheck
- Current local time was checked as `2026-11-28T08:57:53+09:00`. Live GitHub `main` ref was re-fetched and resolved to `470d81003e130f841a81b8edab0a8689a78624ff`; this was not assumed from the prior conversation. Open PR count before this checkpoint branch was created: 0.
- Re-read all seven operating documents at this exact main SHA before edits.
- GitHub Actions `event=schedule` API returned `total_count=19`; newest remains Production #624 / run `46060489526`, created_at/run_started_at `2026-11-27T19:59:27Z`. No schedule run after the 2026-11-27 23:17:00Z / 2026-11-28 08:17 KST slot is present as of 08:57:53 KST. Record only "slot elapsed; matching run not observed"; do not claim failure, dropped event, omission, or scheduler incident. No cron changes.
- Workflow `.github/workflows/collect-and-deploy.yml` was re-read at main: schedule expressions remain exactly `17 23 * * *` and `17 11 * * *`.
- The latest Production run in the recent Actions list remains #624; no newer Production `push`, `schedule`, or `workflow_dispatch` run was observed. Therefore do not perform or claim a new full discovery audit.
- #624 was independently rechecked: Actions event=schedule; created_at/run_started_at `2026-11-27T19:59:27Z`; persisted run log `data/run-logs/46060489526.json` blob `71a8d6ded07b368d22ad0fc7168cea97705d51d0`; run-log trigger `github_schedule`; scheduleExpression `17 11 * * *`; startedAt `2026-11-27T19:59:31.000Z`; finishedAt `2026-11-27T19:59:52.735Z`. It is the distinct previous 20:17 KST / 11:17 UTC slot execution, with Actions creation 8h42m27s after that cron minute; cause remains unknown. Do not infer #614/#622 retroactively or conflate them with the 08:17 slot.
- #624 job `140713285787` completed successfully; committed archive validation passed with no errors; Google News RSS success / 193 items; Bing News RSS success / 36 items; NMIXX YouTube skipped / 0 items; queryFailures empty. Data commit remains `dd9c7e09cf0297c08befc4a693cd4b27d5b5b9c2`.
- Pages artifact remains `15228811375`, name `github-pages`, size `770763` bytes, not expired. Previously verified SHA-256 `a4a9101740cc69d85adf4b23e519548f6d483ed8398372fe9673437bbea8d1dd`; configure/upload/deploy steps had succeeded. Direct public Pages URL access remains unverified.
- PR #90 remains merged; CI #120 / run `46084057990` passed Unit tests and Validate committed archive data. Current main remains `470d81003e130f841a81b8edab0a8689a78624ff`.
- Last full discovery audit is historical only: 962 records (774 article, 188 video), explicit HTTPS publisherArticleUrl 113, missing thumbnails 602, missing+explicit URL 28, assigned thumbnails 360 (273 legacy shared), verified Haewon articles 84, article-image previews 62, RSS image candidates 0, meta-only 87, review 493 eligible / 0 reviewed / precision null. These are not new 08:57 metrics.
- Last retry audit remains 0 eligible; earliest next eligibility `2026-12-01T06:57:55.671Z`. Preserve existing backoff: missing 7 days; failed general 1 day; 405/not-found/forbidden/rate-limited/method-not-allowed 7 days; assigned/found/duplicate-rejected/wrapper-only 30 days; six-hour offset rotation; max 12. No blind retry. Only a demonstrated extractor miss on a genuinely retry-eligible publisher page justifies a fixture/test/code change.
- Exploratory recursive improvement remains: query pack 1/6, cumulative candidates 962, current run candidates 193, videos 20, human-reviewed relevance 0, precision null; no automatic strategy promotion.
- Preserve all project constraints: YouTube Atom and Data API disabled; `videos.json` 20; never inject `YOUTUBE_API_KEY`; do not infer zero network requests because `collection-status` lacks `networkRequests`; preserve only real #617 HTTP 429 in query-failure history; no JYP/NMIXX Gallery/Notice collectors; SBSKPOP ZOOM ownership unverified; no broadcaster collector or broadcaster-official auto-classification; no Google News wrapper decoding/access bypass; preserve all 273 legacy shared thumbnails and PR #54/#56 transactional save/move/restore.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. No code/data change is justified: no new Production, no retry-eligible target, no evidenced eligible-page extractor miss. This cycle is documentation-only across all seven operating docs; merge only after PR CI passes both Unit tests and Validate committed archive data. Report docs, code, tests, Production, data, artifact, Pages, and Android QA separately.


## 2026-11-28 09:01 KST — Actions observability checkpoint
- Live repository metadata confirms default branch `main`; latest main SHA at this checkpoint is `c45b0f62889fb686dd36dceb3cfb67516cda8961`. PR #91 is merged. Its verification run #121 / `46085424796` was independently checked: Unit tests and Validate committed archive data both succeeded.
- Re-read all seven operating documents at the exact main SHA before this documentation update.
- Current local time supplied by the runtime is 2026-11-28 09:01 KST. The 08:17 KST slot for `17 23 * * *` has elapsed; however, the available GitHub connector exposes PR-triggered runs for a commit and per-run jobs/artifacts, but does not expose the repository-wide workflow-runs listing filtered by `event=schedule`. The direct Actions API and Actions web page were inaccessible through the available read interface. Therefore the current schedule-run count, newest schedule run, and whether a delayed matching run has appeared cannot be independently established in this checkpoint.
- Do not convert the unavailable Actions listing into a claim that no run exists, and do not label the slot failed, omitted, dropped, or a scheduler incident. No cron change. Do not infer #614 or #622 retroactively.
- #624 remains independently inspectable as a distinct prior Production: its persisted run log records `trigger=github_schedule`, `scheduleExpression=17 11 * * *`, `startedAt=2026-11-27T19:59:31.000Z`, and `finishedAt=2026-11-27T19:59:52.735Z`; it must not be conflated with the 08:17 KST slot. Its job and Pages artifact metadata were re-fetched; do not treat this as proof that no later Production exists.
- Because no authoritative current Actions schedule list was available, no new Production classification, discovery Git-blob audit, retry-eligibility recalculation, or dataset metrics are claimed. The last complete discovery and retry audits remain historical only. No blind retry and no speculative extractor change.
- Workflow configuration at this main SHA still contains exactly `17 23 * * *` and `17 11 * * *`; this checkpoint makes no workflow or cron changes.
- Android Chrome real-device QA and direct public Pages URL access remain unverified. The direct URL check could not be completed through the available web interface. Report documentation, code, tests, Production, data, artifact, Pages, and Android QA separately.
- This is a documentation-only checkpoint. Merge only after the PR verification workflow passes both Unit tests and Validate committed archive data.
