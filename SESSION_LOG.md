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


## 2026-11-25 — Article-level quality review and legacy image audit

### Fresh main / operations check
- Re-read repository main at 32832e57e9e1023c62eefa4a1e8b4a76550e451b.
- Actions #581 succeeded. Inspected its job steps: Pages configured, artifact uploaded and deployment completed successfully.
- Run log 45508856109 has three separate source rows: nmixx-youtube 15, google-news-rss 74, bing-news-rss 33; validation passed.
- Open PR list was empty before this cycle.

### Data-level audit (701 records)
- 49 records meet the explicit publisher HTTPS + article + Haewon title scope. 39/49 have provenance-backed HTTPS thumbnails; this is not visual relevance accuracy.
- All 49 have publishedAt and sourceName values, but none has an explicit stored category array. Date/source correctness has not been human checked; category remains rule-inferred.
- The repeated legacy image group contains 273 records. It has no overlap with the 49 verified Haewon articles; all 273 lack publisherArticleUrl and both thumbnailCandidates and thumbnailMetaCandidates in the stored record. No automatic deletion, replacement, wrapper decoding, or access-control bypass.
- Overall discovery: 701 records, 515 article candidates and 186 video candidates. Overall image assignment 317, including 273 unverified shared legacy assignments; provenance-backed assignments 44. (The 39 count is the verified-Haewon subset.)

### Implementation on review/verified-article-quality-audit
- Added js/article-review.mjs: strict verified-Haewon eligibility, independent four-dimension review schema, validated JSON import and per-record legacy image evidence audit.
- Added js/article-quality-review-ui.mjs: 49-article review queue, original publisher links, date/source/automated category context, optional thumbnail preview, localStorage persistence, JSON import/export and progress.
- Mounted the review panel in index.html, added responsive review styles, and added tests for scope, dimension coverage, import validation and legacy candidate evidence.
- Extended generated quality metrics with a non-destructive summary of the repeated legacy image cluster.
- Opened PR #13: https://github.com/UForPel/haewon-archive/pull/13. The branch has 7 changed files, 233 additions and 1 deletion at the time of PR creation.
- Verification remains pending: Actions workflow has no pull_request trigger; local clone failed because network DNS was unavailable. Do not claim tests pass.
- Real browser/mobile visual QA is unverified. The UI is implemented but not inspected in an actual browser.

### Next
- Run a testable CI path for PR #13 before merge (e.g. an authorized workflow dispatch or temporary PR CI workflow, with no secrets required).
- Review the 49 records against their actual publisher pages; do not infer correctness from field presence.
- Collect individual human thumbnail labels for the 39 source-traceable images and review missing-image cases for the remaining 10.
- For the 273 legacy records, improve source data only when a direct publisher article URL or article-specific image candidate is explicitly present in permitted public RSS/meta fields. Otherwise preserve and mark unresolved.

- Additional legacy cause detail: all 273 are Google News RSS records. 148 have a publisher source-site root hint, but zero have an article-specific publisher URL, zero have an article-specific discovery URL, zero have candidate image arrays, and zero have metadata-fetch records. The common image is therefore an untraceable inherited assignment in current stored data; the 148 source-site roots are not sufficient to identify a specific article or image. No wrapper decoding was attempted.

- Refinement: added a fifth independent review dimension for original publisher-page accessibility (accessible, blocked, paywall, not-found, uncertain), rather than assuming that a recorded HTTPS URL is accessible.

- Added a direct accessibility audit for all verified Haewon publisher URLs: one HEAD request per explicit HTTPS publisherArticleUrl, ordinary redirects only, no retry or fallback request. Results distinguish accessible, blocked, paywall, not-found, and uncertain. Implemented in PR #13; no live result is claimed before CI and the next quality run.

- CI follow-up: PR #15 Actions run #1 completed successfully with 142/142 tests and data validation passed. This run exercised the new workflow on PR #15's base-main branch; it did not yet execute PR #13's newly added tests. PR #13 verification remains pending.


## 2026-11-25 — Session-end continuation button omission and correction
- User correctly pointed out that the required ChatGPT conversation follow-up button was missing, despite a BUTTONS_AND_ACTIONS.md update.
- Root cause: the button was described/documented but not actually rendered in the final response. The previous session report therefore failed its handoff requirement.
- Updated BUTTONS_AND_ACTIONS.md and CHATGPT_OPERATING_RULES.md with the exact label, click action contract, full next-cycle directive, and explicit no-omission rule. This documentation change is on PR #14 branch.
- Required final control: 🔄 연구 기반 재귀개선 계속하기. It must submit the next-cycle execution instruction; plain text or a link is not an acceptable substitute.


## 2026-11-25 — CI failure diagnosis, thumbnail label addition, and conservative HTTP semantics

### Fresh repository and workflow state
- Main: 32832e57e9e1023c62eefa4a1e8b4a76550e451b.
- Actions #581 / run 45508856109: success. Job steps confirmed tests, YouTube/RSS collection, recursive improvement, quality metrics, validation, operational log, Pages configured, artifact uploaded, and deployment all succeeded.
- Latest Actions list also shows PR #13 run #2 / 45529878362 failed, PR #15 run #1 / 45529462914 succeeded. No run exists for the latest PR #13 head after the fixes below.
- PR #13, #14, #15 remain open; none was merged.

### PR #13 test failure and correction
- Inspected PR #13 run #2 logs. js/article-review.mjs declared auditVerifiedPublisherArticles twice, causing a SyntaxError. Node reported 113/116 passing; the three failed test files could not import the module.
- Removed the duplicate export. Added a distinct thumbnail suitability review dimension, because the original UI showed thumbnail images but did not actually collect a per-image suitability judgment.
- Added test coverage for thumbnail accuracy and its denominator (missing and uncertain image cases do not inflate the suitability score).
- Added a test ensuring a 403 response does not trigger a GET retry in the generic link audit.
- Changed automated article HEAD status accessible to http-responded: RFC 9110 defines HEAD as GET without response content, so it cannot establish that a person can read the article. The five original human dimensions still include a separate manually assigned accessibility label.
- Latest code branch commit bbe05328a450b3ad068a28f99ac88f6ac66fdb87 (UI scope count made data-driven). These fixes are committed but unverified by a fresh CI run.

### Quality baseline / content
- Last metrics snapshot: 701 discovery records; 49 verified Haewon publisher articles; 39/49 provenance-backed thumbnails; 273 records share one legacy image assignment.
- Legacy group remains preserved; no auto-delete or replacement. Previously established: all 273 originate from Google News RSS; 148 retain only publisher site-root hints; no article-specific URL or per-record image alternative.
- Latest run log records YouTube 15, Google News RSS 74, Bing News RSS 33; overall success and validation passed.
- No newer generated quality snapshot after the previous baseline; no claim of content increase.

### Research / engineering decision
- GitHub Actions docs recommend least-privilege permissions and read-only pull_request for untrusted PR code; PR #15 uses contents: read, no secrets, no collection/deploy. Source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- Playwright documents device emulation of viewport, touch, and user-agent. This is a practical future CI route for responsive interaction checks, but an emulated viewport is not the same as a real physical-device test. Source: https://playwright.dev/docs/emulation
- RFC 9110 §9.3.2 says HEAD returns no response content. HTTP 2xx is only an HTTP response signal, not proof of human-readable article content. Source: https://www.rfc-editor.org/rfc/rfc9110.html
- Real mobile browser QA remains unverified; Pages deploy success is not visual QA.

### Next
1. Obtain a fresh CI run for PR #13 after PR #15 workflow is available on main.
2. Review 49 article records manually, including actual original-page accessibility and metadata accuracy.
3. Apply thumbnail suitability labels to 39 images individually; record the 10 no-image cases as not-present, not as successful thumbnail reviews.
4. Generate a fresh quality snapshot and compare counts and quality to the baseline; preserve all 273 legacy records absent verified replacements.

- Follow-up CI: temporary validation run #4 / 45531573683 completed successfully against the corrected PR #13 code: 150/150 tests passed and npm run validate passed (19 videos, 0 photos, 154 run logs). A temporary copy of the PR #15 workflow was used to trigger this run, then removed from PR #13 to preserve PR separation. Only the workflow file was removed after testing; code and test sources were unchanged. Latest PR #13 branch head after cleanup: 86c9e95b4b8f807bc2f5ec223443a354e0d97e2c.


## 2026-11-25 — Second recursive cycle: 49 URL audit, 273 legacy investigation, UI and metric fixes

### Live GitHub / Pages
- Main SHA: 32832e57e9e1023c62eefa4a1e8b4a76550e451b.
- Production Actions #581 / run 45508856109: all steps succeeded through GitHub Pages deployment.
- Operational run log source totals: NMIXX YouTube Atom 15, Google News RSS 74, Bing News RSS 33. Counts: discovered 15, accepted 0, rejected 0, duplicates 15, uncertain 0.
- PRs #13, #14, #15, #16 remain open; no code or docs from these PRs is on main or Pages.
- PR #13 temporary read-only Actions run #5 passed 152/152 tests and archive validation. Temporary workflow was removed after the run.
- PR #16 temporary read-only Actions run #1 passed 143/143 tests and archive validation. Temporary workflow was removed after the run. PR #15 remains the separate permanent CI proposal.

### Article metadata audit
- Main data has 49 explicit HTTPS Haewon-related publisher/source URLs. All 49 have a publication timestamp and sourceName, but none stores a category array or category scalar.
- URL structure: 47 publisher article pages, one X profile, one X social post. This is why PR #13 now records content type as a separate review dimension instead of assuming every source URL is an article.
- 39/49 have provenance-backed HTTPS thumbnail URLs, and all 39 match a persisted metadata candidate URL. This does not mean the thumbnails visually match their articles.
- The remaining 10 have no HTTPS thumbnail: 4 recorded as failed with HTTP 403, 6 recorded as missing. None currently has a stored alternative thumbnail candidate.
- No human labels have been entered. Date/source/category correctness, original-page readability and per-image visual suitability remain unmeasured.

### Legacy cluster audit
- 273 records share the exact same Googleusercontent thumbnail, all from Google News RSS, and all retain opaque Google News RSS wrapper URLs.
- 148 contain only a root-domain sourceUrl clue; 125 contain no sourceUrl. None contains an article-specific publisher URL, thumbnail candidates, or thumbnail metadata-fetch result.
- 270 distinct titles; 3 duplicate-title rows; 91 titles contain YouTube; 7 titles contain neither Haewon nor NMIXX terms. These counts are triage signals only, not grounds for automatic deletion.
- All legacy entries remain unchanged. No replacement was assigned.

### Code changes
- PR #13 adds contentType as the seventh review dimension, includes all seven fields in the progress summary, and exposes an optional corrected-category selector.
- PR #16 fixes the interpretation of thumbnailCandidateComparison: persisted candidate matches are now counted separately from assignments performed in the latest collection run. The old metaAssigned=0 and 0% reflected zero enrichment attempts in the last run, not a lack of persisted thumbnails.
- Latest code branch heads after temporary workflow cleanup: PR #13 0fe3047978424390c9ba19d6a13264304d9c02be; PR #16 fbac15bcd4142ce943cc23df236176a4a1ba4725.

### Research and limits
- RFC 9110 §9.3.2 defines HEAD as GET without response content. It is appropriate for metadata/link checks but cannot establish human-readable page access: https://www.rfc-editor.org/rfc/rfc9110.html
- Playwright documents mobile device emulation of viewport, screen size, user agent and touch. Use it for automated responsive checks, but do not claim physical-device validation: https://playwright.dev/docs/emulation
- GitHub Actions documents workflow permissions and pull_request event controls: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- This session did not visually inspect the 39 thumbnails or execute the review UI in a real browser. Mobile/browser QA remains unverified.


### Direct publisher page and exact-thumbnail spot-check (2026-11-25)
- Attempted standard opens of all 49 explicit publisher/source URLs. Several pages returned readable article text and date/byline context; others returned 403, timeout, disabled access, redirect-only or empty text. This is a limitation of the inspection fetch, not a definitive reader-accessibility verdict. No workaround was used.
- Opened 7 exact assigned thumbnail URLs (not just arbitrary page images) and checked them against article context: Khan/Sports Kyunghyang 2026-10-24, Khan 2025-10-23 (two stories), Sportal Korea 2026-10-27, Khan 2026-09-20, KapanLagi 2025-11-05, and Xports 2026-11-18. The seven were context-consistent. Remaining exact thumbnails: 32/39 not yet visually checked.
- Wikitree record 66c296a7f618669fd99b is not a direct story about Haewon; its article is about another person doing a cover as a Haewon lookalike. Record this as indirect relevance, not direct relevance. Do not automatically remove it; use the new indirect label.
- A sourceName of MSN paired with a Sports Kyunghyang publisher URL is a source-attribution review candidate. Keep source publisher, syndication platform and URL host distinct; do not assume every host/name difference is an error.
- The review UI still has zero saved human labels. Seven spot-checks do not establish a complete 39-image suitability score.
- PR #13 relevance options now distinguish direct, indirect, unrelated and uncertain. Its final temporary read-only Actions run #8 passed 153/153 tests and archive validation; the temporary workflow was removed afterward. Latest branch head: 9cd73121750458d723b1e433ed0661f595560323.

- Pages verification limit: the public GitHub Pages URL could not be independently opened by the available web inspection tool (internal access error). The production Actions deployment step succeeded, but no live rendering or mobile visual QA is claimed.


## 2026-11-25 — Fresh recursive verification (main 32832e57)

- Fresh GitHub state: main `32832e57e9e1023c62eefa4a1e8b4a76550e451b`. PR #13/#14/#15/#16 are all open and unmerged. No PR merge was performed. PR #13 review UI and PR #16 metric correction are not on main.
- Production Actions #581 (run 45508856109) completed successfully. Its job steps include both validation passes, operational log generation, Pages configuration, artifact upload and deployment. Run log records YouTube 15, Google News RSS 74, Bing News RSS 33; accepted new records 0, duplicates 15, validation passed. Deployment success is not independent browser or mobile visual verification.
- Current main discovery data: 701 total candidates, 515 articles and 186 video candidates. The verified Haewon HTTPS publisher scope remains 49 records; 47 URL shapes are publisher article pages, one X profile and one X post. All 49 have publishedAt/sourceName fields; none stores an explicit categories array. Field presence does not establish date/source accuracy; category is rule-inferred. Human metadata labels remain zero.
- 39/49 have HTTPS thumbnails with provenance, and the 39/39 exact thumbnail URLs match a persisted metadata candidate. This is provenance linkage, not visual suitability. Main `thumbnailCandidateComparison` still reports 44 metadata-found records, 0 latest-run assignments and 0% assignment because it lacks the PR #16 persisted-vs-current-run split. The latest collection attempted 0 enrichment URLs, so 0 latest-run assignments is not evidence of missing persisted assignments.
- Additional exact-thumbnail check: attempted all 32 previously unchecked URLs. Eight exact URLs rendered as images in the inspection tool; 24 returned inaccessible/internal errors. This does not complete 32/32 visual checks, and no new formal suitability labels were persisted. Previous 7 exact-URL spot checks remain context-consistent. Total 15 exact URLs have rendered in visual checks across the prior and current checks; do not claim the other 24 are visually reviewed.
- The Wikitree record `66c296a7f618669fd99b` remains indirect relevance: the story centers on another person described as a Haewon lookalike doing a cover. Do not count as direct Haewon coverage.
- The 10 missing-thumbnail cases were re-read from main data: 4 explicit 403 failures (FAM Times, BNT, X profile, allkpop) and 6 missing outcomes (one Khan/MSN syndication case, three MSN items, TVDaily, OSEN). All have zero alternative metadata candidates. No retry, access-control bypass, or inferred replacement.
- The 273 shared legacy-image records remain unchanged: 270 distinct titles, 148 with a sourceUrl clue, 125 without; 0 publisherArticleUrl, 0 discoveryUrl, 0 metadata candidates, 0 metadata-fetch records. Root-domain clues do not identify article URLs. No wrapper decoding, deletion or replacement.
- PR #13 latest review code remains unmerged; recorded Actions #8 passed 153/153 tests and archive validation. PR #16 latest metric code remains unmerged; recorded Actions #6 passed 143/143 tests and archive validation. PR #15 permanent read-only CI remains unmerged; its own Actions #1 passed 142/142 tests. These are branch-specific results, not main deployment.
- PR #14 is the documentation-only branch and has been updated with this verification. PR separation remains: #13 review UI/tests, #16 metric code/tests, #15 read-only CI, #14 docs. No merge was authorized or attempted.
- Live Pages page render and actual Android/mobile browser QA remain unverified. Actions deploy success and image URL fetch attempts are not substitutes for a real browser session.


## 2026-11-25 — Third recursive cycle: source-host provenance and public image metadata review

- Main remains `32832e57e9e1023c62eefa4a1e8b4a76550e451b`; PR #13/#14/#15/#16 remain open and unmerged. Production Actions #581 is still the latest main run observed; all 19 job steps succeeded through Pages deploy. Run log counts: YouTube 15, Google News RSS 74, Bing News RSS 33; 15 discoveries, 0 accepted, 15 duplicates; archive validation passed. Public Pages URL remains inaccessible to the inspection browser; no live render or Android QA claim.
- PR #13 branch follow-up: the review UI now exposes three distinct host fields: explicit publisherArticleUrl host, discovery URL host, and recorded publisherHost. This addresses syndication patterns and avoids collapsing platform attribution into final URL host. Added regression tests for OSEN/Chosun and MSN/Sports Kyunghyang examples plus malformed/non-HTTPS URLs. Latest head `b926e8fab1d9338bf08d7c2568f49b40f99a1767`; prior run #8 (153/153) predates this follow-up, so latest code is not CI-verified yet.
- Source audit examples:
  - OSEN record `de974fb311b152bc6141`: discovery URL host is OSEN, publisherArticleUrl host is biz.chosun.com, and the opened Chosun syndicated page carries an OSEN byline. The OSEN direct page independently shows the same headline/byline. This is a syndication/source-host distinction, not a proven wrong sourceName. Stored `publishedAt=2025-06-09T14:20Z` converts to June 9 23:20 KST, while the OSEN page states June 10 06:20 KST; date accuracy is a review candidate (local calendar day differs).
  - Record `8483bee976c1fb0427a8`: discovery URL host/source label is MSN, but publisherArticleUrl points to Sports Kyunghyang. The Sports Kyunghyang page states 2026-09-20 13:57 KST. Stored timestamp converts to 2026-09-20 07:06 KST: local calendar date matches, time differs. Treat MSN as discovery/syndication platform and Sports Kyunghyang as the explicit publisher URL; do not infer the MSN label is the original publisher.
  - Record `a49267aceb6585e0f222`: Sports Kyunghyang page states 2026-10-24 01:13 KST; stored timestamp converts to 2026-10-24 03:12 KST. Calendar date matches, exact time differs.
  - Wikitree `66c296a7f618669fd99b`: article states 2023-03-23 11:37 KST; stored timestamp converts to 13:37 KST on the same date. Its subject is another person doing a Haewon-lookalike cover, so relevance is indirect.
  - OSEN record `1410c1c68a3a1cfaa0f2`: OSEN page shows 2026-11-09 20:28 KST; stored timestamp converts to 12:28 KST on the same local date. Page image links are visible but not recorded as metadata candidates.
  - TVDaily record `f60f0f16157da91b9bf1`: page states 2026-11-18 13:36 KST; stored timestamp converts to 14:36 KST on the same local date. A page image link is visible, but it is not a persisted OG/JSON-LD candidate and was not assigned.
- Human review labels are still not persisted. Two clear indirect-relevance examples are the Wikitree lookalike-cover story and the OSEN/Chosun story centered on another person described as resembling Haewon. The X profile and X post must be contentType profile/social-post, not article pages.
- Current inferred category distribution for the 49-record scope (rule output only): news 24, interview 13, official 5, performance 5, event 2. No stored explicit category fields and no human category labels exist. Rule risk: interview currently matches generic terms such as 방송/예능/출연, and official matches broad 소식; do not treat these counts as accuracy. Manual review/corrected-category labels remain necessary.
- Rechecked the 32 previously unreviewed exact thumbnail URLs: 8 rendered as image payloads; 24 remained inaccessible to the inspection tool. The 8 visible URLs were not all compared against the exact publisher article context, so no new suitability labels were stored. Combined with the previous 7 context-checked URLs, 15/39 have rendered at least once; only the prior 7 had a documented article-context spot check.
- Six missing-thumbnail cases were reviewed within public page access only: TVDaily and OSEN pages opened and exposed image links in article content; these are not confirmed OG/JSON-LD metadata and were not added as thumbnail candidates or assigned. The other four missing-outcome pages (Sports Kyunghyang and three MSN URLs) were inaccessible to this inspection tool. Four existing 403 outcomes remain untouched; no retry, bypass, or fallback.
- PR #15 security hardening: pinned checkout v4.2.2 and setup-node v4.4.0 to verified upstream full commit SHAs; added `persist-credentials: false`. Latest head `e6573a8017f5aae0b71ad15d5b3d3a8e629e03b8`. Earlier Actions #1 (142/142) predates these edits; latest workflow commit needs a fresh run.
- PR #16 metric revalidation against actual main data: 44/44 records with persisted metadata candidates also have an HTTPS persisted thumbnail matching a candidate (0 mismatches). Latest enrichment attempted 0 URLs, found 0, assigned 0; correct latest-run assignment rate is null, not 0%. Main's current old metric still reports 44 metadata found, 0 assigned, 0%, which conflates persisted data and latest run. On the 49 Haewon subset, 39/39 existing thumbnails match persisted candidates.
- Legacy cluster unchanged: 273 repeated image assignments, 270 unique titles, 148 sourceUrl hints, 125 without sourceUrl, zero article-specific publisher URLs, zero discovery URLs, zero image candidates, zero metadata fetches. No wrapper decoding, deletion or replacement.
- Main data remains 701 candidates, 515 articles and 186 video candidates. No new accepted discovery in Actions #581.
- Next: obtain fresh CI for latest PR #13 and #15 heads after safe workflow availability; consider narrowing the category rules only after a labeled sample exists; manually complete 49 source/date/category/relevance labels; preserve unverified thumbnail and legacy states; verify Pages in a real browser and Android device.


## 2026-11-25 — PR #15 Node 24 CI hardening verification

- PR #15 latest head: `d095da244c97fcbea4e38eca624fae6112088c56`; still open and unmerged.
- Updated the read-only workflow to verified upstream immutable action commits: checkout v7.0.1 `3d3c42e5aac5ba805825da76410c181273ba90b1`, setup-node v7.1.0 `949feb2413d6458794dcd2491c4babbbce0c15c1`. Both use Node 24 action runtimes. `persist-credentials: false` remains; `package-manager-cache: false` avoids unused automatic caching. Workflow retains `contents: read`, Node 22 project runtime, `npm test`, and `npm run validate` only.
- Fresh Actions #10 / run `45541326160` on exact head `d095da244c97fcbea4e38eca624fae6112088c56`: success; 142/142 tests passed, 0 failed; archive validation passed (19 videos, 701 discovery candidates, 154 run logs, 37 source summaries, 41 links checked). No Node 20 deprecation warning in this run's log.
- This is PR #15 branch validation only; PR #15 is still not merged and does not yet provide main-wide automatic CI.
- PR #13 latest code branch `b926e8fab1d9338bf08d7c2568f49b40f99a1767` still has no fresh Actions run after its URL-host-context helper/test addition. PR #16 latest branch `fbac15bcd4142ce943cc23df236176a4a1ba4725` retains prior Actions #6 (143/143) and has no newer run.


### Exact URL outcomes: 32 previously unchecked assigned thumbnails (2026-11-25)

The URL column below is copied from the matching record's current `thumbnailUrl` in main `data/discovery.json`. An image payload rendering does not by itself prove article suitability; the eight rendered items still need article-context confirmation. Inspection-tool errors are not evidence that the publisher blocks ordinary readers. One 403 was not retried.

| Record ID | Exact assigned thumbnail URL | Inspection result |
|---|---|---|
| `757ec3797d78fa2fe07b` | https://img.mydaily.co.kr/photos/2026/10/22/2026102217300091251_x.png | inspection tool internal error; not classified as source-side failure |
| `db6ba77a0559952da2df` | https://file.sportsseoul.com/news/cms/2026/10/22/news-p.v1.20261022.03dbd0cc4b894e54a8068bc0cb0a7a95_T1.jpg | inspection tool internal error; not classified as source-side failure |
| `de974fb311b152bc6141` | https://biz.chosun.com/resizer/v2/7OA2WHY7EANUWEY4N55NIG6BMM.png?auth=c51b362771b0ad9a6eaf72177cd03a8bca2d9ed7a3bf56e3df5a35f075124a9a&width=650&height=341&smart=true | inspection tool internal error; not classified as source-side failure |
| `d3cf5f84705cc6c0971b` | https://image.xportsnews.com/contents/images/upload/article/2025/0308/1741423157707985.jpg | image payload rendered; article-context review pending |
| `d103d78ba96bc58b409f` | https://mydaily.co.kr/photos/2024/09/28/2024092818171020439_l.jpg | 403 Forbidden; no retry |
| `b37a5009be7372f08cbb` | https://biz.chosun.com/resizer/v2/43WAK6KFC2DFV32XD5GOANDL5Q.jpg?auth=02dcafb5dd87372fb50c0c6643c883b16296ddbb77f24fc543cdbaf52cb755f2&width=572&height=300&smart=true | inspection tool internal error; not classified as source-side failure |
| `2f3af607ca1ec5db5440` | https://cdn.hankooki.com/news/thumbnail/202404/153478_209428_1713845524_v150.jpg | inspection tool internal error; not classified as source-side failure |
| `f7fabbf8ab78fa7dce01` | https://0.soompi.io/wp-content/uploads/2026/09/12165309/Haewon.jpg | inspection tool internal error; not classified as source-side failure |
| `9dca85b63514c793581e` | https://cdn.en.sportalkorea.com/news/photo/202611/48591_93671_1795067434.jpg | inspection tool internal error; not classified as source-side failure |
| `9ac3fa84f552e7bd2510` | https://en.koreadaily.com/wp-content/uploads/2026/11/202611092008776718_6af1ae44f255f.jpg | inspection tool internal error; not classified as source-side failure |
| `a377796d0c2321d50f9a` | https://pbs.twimg.com/media/HVzH2PTakAABESt?format=webp&name=large | inspection tool internal error; not classified as source-side failure |
| `44a8773963a6cb3a4c68` | https://image.koreaboo.com/2026/10/post4-2026-10-29T160301.313.jpg?imop=Resize%2Cwidth%3D1230%3BConvert%2Cformat%3Djpeg&Expires=1795618800&KeyName=kb&Signature=RLAqR9SxIYB0_UlyPQf7IHDhP5M= | inspection tool internal error; not classified as source-side failure |
| `4c30e8eab8286f86c364` | https://cdn.en.sportalkorea.com/news/photo/202610/42092_81565_1793077817.jpg | inspection tool internal error; not classified as source-side failure |
| `bfe53579db328d52b340` | https://image.koreaboo.com/2026/10/FD2870-1-3.jpg?imop=Resize%2Cwidth%3D1230%3BConvert%2Cformat%3Djpeg&Expires=1795618800&KeyName=kb&Signature=an_JaPu9CMJwQ3cOiRPhWAibXcc= | inspection tool internal error; not classified as source-side failure |
| `f09df33b20baa8f03b54` | https://biz.chosun.com/resizer/v2/G5RGKYRWMY4TIMJWME2DEYRWGQ.jpg?auth=ae910996af10194b83fc642a51995ea7b3a4f629e15fa8e0816dbca146ba9b20&width=650&height=341&smart=true | image payload rendered; article-context review pending |
| `eb1509691290e61b7637` | https://0.soompi.io/wp-content/uploads/2026/05/09204057/Haewon-Bae-Chaewon-Kazuha.jpg | inspection tool internal error; not classified as source-side failure |
| `2ef058c52f217413e90c` | https://biz.chosun.com/resizer/v2/GI3TOOLEHAYTSNRQHBQWMMBXMQ.jpg?auth=9a62a482a603424be064d37d94b6ee6c45f5ba11734bcd6ef76069ea40d9476e&width=572&height=300&smart=true | inspection tool internal error; not classified as source-side failure |
| `01499265d4164c3f45b9` | https://pimg.mk.co.kr/news/cms/202510/17/news-p.v1.20251017.8696bb6e80fc47769e37c1b11db59f48_R.jpg | inspection tool internal error; not classified as source-side failure |
| `9c336218ce8f6660018a` | https://pimg.mk.co.kr/news/cms/202510/10/news-p.v1.20251010.85c8fe76271847a7ad97e50026b3cd85_R.jpg | inspection tool internal error; not classified as source-side failure |
| `aa1d73461e1a8ba8156f` | https://img.sbs.co.kr/newsnet/etv/upload/2025/06/27/30000999810_16v9.jpg | image payload rendered; article-context review pending |
| `ce4468d1f0e09b93135d` | https://s.yimg.com/lo/mysterio/api/1153401bb44443b3aa8ffc6a0dc8ee31c0152c6804c48a762b8406ce9f0bb178/lightyear_networkapi/resizefill_w1200%3Bquality_80%3Bformat_jpg/https%3A%2F%2Fmedia.zenfs.com%2Fca%2Febc.net.tw%2F99a768be2b678a27ad33ffa8710a22fd | inspection tool internal error; not classified as source-side failure |
| `96579cf215e0e82b5ccf` | https://biz.chosun.com/resizer/v2/QRPEGR2B3RCBMKHQGM4YCBFJ6E.png?auth=bd8b5aee3461199876e3e35f98eb4a0d6a66c91d74cbe8ea289d4102be344010&width=650&height=341&smart=true | image payload rendered; article-context review pending |
| `fb392e4ba8879b947e36` | https://biz.chosun.com/resizer/v2/FZHLQVUBG73H4PSF4BVOGGBU44.png?auth=a91266c6ed349a809c3f7441c78247bbccd11450de9ee5e78104b01a4288b3e2&width=650&height=341&smart=true | image payload rendered; article-context review pending |
| `288ac9019343bb06260d` | https://0.soompi.io/wp-content/uploads/2025/02/20200842/Haewon.jpg | image payload rendered; article-context review pending |
| `772e453cc3cd4b9b3a7e` | https://www.nme.com/wp-content/uploads/2024/12/nmixx-haewon-sabrina-carpenter-cover-191224.jpg | image payload rendered; article-context review pending |
| `b9889446cfd423ab2196` | https://static.toiimg.com/thumb/msid-111332937,width-1070,height-580,imgsize-27288,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg | inspection tool internal error; not classified as source-side failure |
| `01d43afc81bf8da93d4a` | https://img.sbs.co.kr/newsnet/etv/upload/2023/07/11/30000860581_16v9.jpg | inspection tool internal error; not classified as source-side failure |
| `da2ca32f9a2115bbb975` | https://7lgigmttrjuyfehsudec15072.edge.naverncp.com/news/photo/202611/1020506_2043365_4529.png | inspection tool internal error; not classified as source-side failure |
| `0ffa4f472cdb2ae24b00` | https://file.sportsseoul.com/news/cms/2026/11/18/news-p.v1.20261118.3416e0f121004526bd98cc7fdaeecd97_T1.png | inspection tool internal error; not classified as source-side failure |
| `77db473416096271082d` | https://image.starnewskorea.com/cdn-cgi/image/f=auto,w=1200,h=670,fit=cover,q=high,sharpen=2/21/2026/10/2026103014300533060_1.jpg | inspection tool internal error; not classified as source-side failure |
| `66b75c4e48e22de59d0e` | https://img.sbs.co.kr/newsnet/etv/upload/2026/01/21/30001039558_16v9.jpg | image payload rendered; article-context review pending |
| `755bfff53f3d7af07524` | https://pimg.mk.co.kr/news/cms/202406/28/news-p.v1.20240628.0f4b9a2cb5cd4f2eb17ecb679a3241b9_R.jpg | inspection tool internal error; not classified as source-side failure |

Result: 8 image payloads rendered, 1 returned 403, and 23 returned inspection-tool internal errors (24 not visually available in this inspection). No new suitability labels or thumbnail assignments were persisted.


## 2026-11-25 — PR #13 read-only CI verification and source/date recheck

### Current state
- Rechecked main: `32832e57e9e1023c62eefa4a1e8b4a76550e451b`. PR #13/#14/#15/#16 remain open and unmerged.
- Production Actions #581 (`45508856109`) succeeded through tests, collection, validation, run-log validation, Pages artifact upload and deployment. Artifact: 429,321 bytes. Deployment status reported success; no live Android/browser QA is claimed.
- PR #15 HEAD `d095da244c97fcbea4e38eca624fae6112088c56`; Actions #10 (`45541326160`) succeeded with 142/142 tests and data validation. Workflow pins checkout v7.0.1 and setup-node v7.1.0 to verified SHAs; read-only permissions and no persisted checkout credentials.
- To verify PR #13 without merging PR #15, created temporary branch `verify/pr13-readonly-ci-20261125` from exact PR #13 HEAD `b926e8fab1d9338bf08d7c2568f49b40f99a1767`, copied the exact read-only workflow from PR #15, and opened temporary PR #17. Actions #11 (`45542683996`) passed 154/154 tests, 0 failures, and archive validation (19 videos, 0 photos, 154 run logs). Closed PR #17 after recording the result; it was never merged. This is a verification harness only.
 
### Source/date evidence
- PR #13's `getArticleUrlContext` reports publisher article host, discovery URL host and recorded publisher host separately. Its regression tests cover OSEN→ChosunBiz and MSN→Sports Kyunghyang host differences, plus invalid/non-HTTPS URLs.
- OSEN record `de974fb311b152bc6141` was checked against the original OSEN page, the ChosunBiz syndication page and NATE's OSEN-attributed copy. OSEN original: 2025-06-10 06:20; ChosunBiz: input 2025-06-10 06:20, update 06:21, author credit `[OSEN=김수형 기자]`; NATE: OSEN source, 2025-06-10 06:21. Stored timestamp `2025-06-09T14:20:00Z` converts to 2025-06-09 23:20 KST, one calendar day earlier and seven hours earlier. Mark as a date discrepancy for human review; do not silently rewrite source data.
- This is a syndicated-copy example, not evidence that the discovery URL host and publisher page host must always match. Preserve all three host values.
 
### Metrics and review baseline
- Recomputed PR #16 comparison against main's discovery data using the branch's source filtering and HTTPS deduplication: 44 compared; 44 persisted metadata candidates; 44 persisted HTTPS thumbnails; 44 exact URL matches; 0 mismatches. Current news status says latest enrichment attempted/found/assigned = 0/0/0; assignment rate is null because no latest-run found denominator exists.
- Review scope: 49 records = 47 publisher article pages + 2 X URLs (one profile, one post). No stored explicit category and no human labels. Inferred category distribution: news 24, interview 13, official 5, performance 5, event 2. These are heuristic counts only, not accuracy.
- Wikitree record `66c296a7f618669fd99b` is still an indirect cover/lookalike story. No human labels were written.
- Exact 32-image audit remains 8 rendered (article-context pending), 1 HTTP 403 and 23 inspection-tool internal errors. 24 were unavailable; no new suitability labels. Ten missing thumbnails remain 4 recorded 403 and 6 missing. No retry, bypass, alternate assignment or deletion.
- The 273 legacy shared-thumbnail records remain unchanged; evidence remains 270 unique titles, 148 sourceUrl clues and 125 without sourceUrl. No wrapper decoding, bulk deletion or replacement.

### Remaining verification
- PR #13 now has a successful read-only CI result through temporary PR #17, but PR #15 itself remains unmerged and the workflow is not on main.
- PR #16 still requires a fresh CI run on its exact current head; previous 143/143 result predates the latest PR #16 head.
- Pages #581 deployment success is separate from live rendering. Actual Android browser QA, keyboard/focus checks and human article/thumbnail labels remain outstanding.
- No PR was merged.


## 2026-11-25 — PR #16 exact-head read-only CI verification
- Created temporary branch `verify/pr16-readonly-ci-20261125` from exact PR #16 HEAD `fbac15bcd4142ce943cc23df236176a4a1ba4725`, adding the exact SHA-pinned read-only workflow from PR #15.
- Temporary PR #18 Actions #12 / run `45542878538` completed successfully: 143/143 tests, 0 failures; archive validation passed (19 videos, 0 photos, 701 discovery candidates, 0 human relevance labels, 154 run logs, 37 source summaries and 41 checked links).
- Closed PR #18 after recording the result; it was never merged. PR #16 remains open/unmerged. No production code or main branch changes were made by this verification harness.
- PR #13 was separately verified in temporary PR #17 (Actions #11: 154/154); PR #17 is also closed/unmerged.


## 2026-11-25 — PR #16 UI split, latest CI, and main workflow side-effect audit

### PR #16 implementation follow-up
- Found that PR #16's comparison calculation had new persisted-candidate fields but the main dashboard still rendered only the legacy mixed summary.
- Updated PR #16 branch `fix/thumbnail-candidate-metrics` at HEAD `b1fff8174e60ae3a8b852ace8a439cf9edcb54ad`: pass the full latest enrichment summary into `compareThumbnailCandidates`; add `latestRunAttempted`; keep `latestRunFound`, `latestRunAssigned` and nullable rate separate; render persisted metadata candidate count, persisted thumbnail count, URL matches/mismatches and latest-run metrics separately.
- Added regression tests for 0/0/0 with null rate and a UI structure test for the distinct labels.
- Exact updated code was tested through temporary PR #19 (workflow-only addition on a branch based on the PR #16 head). Actions #15 / run `45543128633`: 145/145 tests, 0 failures; data validation passed for 704 discovery candidates and 0 human labels. PR #19 was closed without merge. PR #16 remains open/unmerged.

### Accidental main workflow trigger — transparent record
- While preparing the PR #16 temporary CI harness, one `create_file` call omitted the branch argument and briefly created the read-only workflow on main at commit `919242d49c97fcbea4e38eca624fae6112088c56`.
- Detected immediately; restored main ref to its exact pre-operation HEAD `32832e57e9e1023c62eefa4a1e8b4a76550e451b`. Confirmed the workflow file is absent from current main.
- The push had already triggered production Actions #582; the reset triggered queued run #583. These runs could not be cancelled with the available GitHub actions interface. Both completed successfully and produced data-only commits:
  - #582 / `45543072797`: 142/142 tests, 5 new records, 3 thumbnail metadata attempts / 3 found / 3 assigned, Pages deployment success.
  - #583 / `45543108685`: collection and validation success, 2 new records, latest thumbnail enrichment 0/0/0, Pages deployment success.
- Main's final data-only HEAD is `7dba74e89d9b5b8e727f0ac5ff94a554aad9e9d6`. No workflow file remains on main. No PR was merged. Record both production runs as unintended side effects rather than planned verification.

### Current data and safeguards
- Current discovery records: 704. 49 verified-publisher-URL Haewon review records: 47 publisher pages + 2 X URLs.
- PR #16 comparison logic applied to current main data: 47 compared; 47 persisted metadata candidate records; 47 persisted HTTPS thumbnails; 47 candidate URL matches; 0 mismatches. Latest run 0 attempts / 0 found / 0 assigned; assignment rate null.
- The 44/44 snapshot was valid before the accidental #582 collection; after three new enriched records, the current comparable set is 47/47.
- The 273 repeated legacy image assignments remain unchanged.
- 10 missing thumbnails in the 49-record scope: 4 recorded 403 and 6 missing. 32-image audit remains 8 rendered, 1 403 and 23 inspection-tool internal errors; 24 unavailable. No labels, bypass, automatic assignment, deletion or replacement.
- PR #15 Actions #10 passed 142/142 with Node 24 SHA-pinned actions and read-only permissions. The separate production workflow still warns that some actions target Node 20.
- Pages deployment success is confirmed for #582/#583; live browser rendering and Android QA remain unverified.


## 2026-11-25 — Continuation button omission correction
- User correctly pointed out that the prior response again omitted the clickable end-of-session continuation button.
- The exact button and full execution prompt were already present in `BUTTONS_AND_ACTIONS.md` and `CHATGPT_OPERATING_RULES.md` on this documentation branch. The failure was that the assistant did not render the control in the final response.
- Reaffirmed the hard invariant: every Haewon Archive response ends with a real ChatGPT clickable control labelled `🔄 연구 기반 재귀개선 계속하기`. A user message typed into chat does not remove or suspend it.
- Do not close a work cycle until the actual control is present in the rendered final answer. Verify both the documentation and final response, independently.


## 2026-11-25 — Ten missing-thumbnail records rechecked
- Read the ten missing-thumbnail records directly from current main's `data/discovery.json`.
- Four have recorded HTTP 403: Famtimes, BNT News, X profile, Allkpop. Six have a `missing` metadata-fetch outcome: three MSN syndicated pages, TVDaily, OSEN, and another MSN page.
- All ten currently have no stored RSS candidates and no stored `thumbnailMetaCandidates`. Targeted exact-title/article-ID public search did not return a usable image metadata candidate.
- Left all ten unchanged. Did not retry 403s, probe alternate access routes, decode Google News wrappers, infer thumbnail URLs, or mark any image unsuitable.

## 2026-11-25 — Correct news chronology and restore visibility of unresolved video candidates

### Verified baseline
- main: `7dba74e89d9b5b8e727f0ac5ff94a554aad9e9d6`
- PR #13 `b926e8f...`, #14 `aacc7f2...`, #15 `d095da2...`, #16 `b1fff81...`: all open/unmerged.
- Latest completed main workflow run #583: all steps succeeded, including tests, collection, validation, data commit, and Pages deploy.
- Discovery: 704 records; latest observed publishedAt `2026-11-19T09:21:00Z`.
- Candidate audit: 186 title/URL-hinted unresolved video candidates (185 Google News, 1 Maeil Business); these are not verified video URLs.
- Main has 19 persisted official-channel videos; fan-video discovery was not connected to an independent video search collector. Photo data remains a separate, currently empty archive.

### Root cause
- `js/discovery-view.mjs` ranked article cards by relevance score before publication date, so newest articles were not guaranteed to appear first.
- `js/discovery-kind.mjs` classified fancam/title hints as video and removed them from article cards.
- `scripts/sync-discovery-videos.mjs` only accepts explicit HTTPS YouTube URLs from `url` or `publisherArticleUrl`; Google News wrapper tokens are intentionally not decoded or redirected.
- As a result, wrapper-only fancam candidates were absent from both the article card list and persisted video archive.

### Implemented on code PR #20 (not merged)
- Added date-descending sort helper with missing dates last and relevance sort as an explicit opt-in.
- Added visible sort control to the news section.
- Added a separate unresolved video-discovery candidate list, clearly marked as needing an explicit original YouTube URL. The list shows the 12 newest candidates and total count; it does not claim these are verified videos.
- Added explicit HTTPS YouTube URL validation and regression tests.
- Changed files: `js/discovery-kind.mjs`, `js/discovery-view.mjs`, `index.html`, `tests/discovery-search.test.mjs`, `tests/index-structure.test.mjs`.
- PR: https://github.com/UForPel/haewon-archive/pull/20

### Test and deployment evidence
- Five focused Node assertions for date sort, relevance sort, wrapper-only preservation and explicit YouTube URL validation passed.
- Full `npm test` on PR #20 is pending: no PR workflow is active on main because PR #15's read-only CI workflow remains unmerged. A Git clone attempt was unavailable in the execution environment due to DNS/network resolution failure.
- Main run #583 deployed Pages successfully. This does not test PR #20 because it is not merged. Android/mobile visual verification is not performed.
- No data files changed; 273 repeated legacy image URL occurrences remain unchanged; no PR merged.

### Research and architecture findings
- Cloudflare Workers Cron Triggers support minute-level schedules (including `*/5 * * * *`) and execute in UTC. Current Free plan documentation lists 100,000 requests/day, 10 ms CPU time/request, and 5 Cron Triggers/account. A Worker could combine the scheduler and narrow dispatch gateway; this remains a design candidate, not a deployment.
- Gemini API free access is limited to selected models/rate limits; Google states free-tier content may be used to improve products. Do not rely on free-tier grounding for a guaranteed search pipeline or send private data.
- Current YouTube Data API documentation lists 100 default `search.list` calls/day, at 1 quota unit/call. This is suitable only for a small rotating query budget, not 5-minute exhaustive search. It requires a user-managed API key if adopted.
- Sources: Cloudflare Cron Triggers https://developers.cloudflare.com/workers/configuration/cron-triggers/ ; Cloudflare limits https://developers.cloudflare.com/workers/platform/limits/ ; Gemini pricing https://ai.google.dev/gemini-api/docs/pricing ; YouTube search.list https://developers.google.com/youtube/data/reference/rest/v3/search

### Errors / omissions / prevention
- Prior UI hid unresolved video candidates while the sync pipeline correctly refused to guess wrapper URLs. Fix is to retain the candidate in a separate, clearly unverified list; never fabricate or decode a video URL.
- PR CI status must not be inferred from older successful runs. PR #20 has no checks until a PR workflow exists on main; record this explicitly.
- Continuation button requirement remains mandatory: always render the actual one-tap ChatGPT control at the end of every substantial Haewon Archive work response, even when the user sends intermediate messages.

### Follow-up verification note
- Temporary PR #21 targeting `ci/pull-request-tests` was closed unmerged. The workflow's trigger explicitly filters pull requests to base branch `main`, so this temporary target did not trigger Actions. No CI result was produced for PR #20. Do not repeat this incorrect target assumption.
- PR #20 remains open and mergeable, but has no check run. Full repository tests and live browser rendering remain pending.

## 2026-11-25 — Expand news query rotation

- Found that the previous 3 × 4 search packs selected only by Korea date, so both scheduled runs on the same date repeated the same four phrases.
- PR #22 changes this to 6 packs × 6 phrases and rotates by Korea date plus run slot (morning/evening). Two daily runs now cover 12 distinct phrases and 24 RSS requests/day across Google News and Bing, a 50% increase from 16.
- Tests added for six packs, six queries per pack, 36 total phrases, and different pack selection by run slot. Four focused Node assertions passed; full npm test and GitHub Actions are pending due missing PR CI workflow on main.
- PR: https://github.com/UForPel/haewon-archive/pull/22. No data changed, no merge.

## 2026-11-25 — Search coverage, YouTube API collector and platform constraints

### Code PRs and exact verification
- PR #20: date-descending news sort, explicit relevance sort, newest duplicate representative in date mode, separate unresolved video-candidate list. Temporary read-only run #45549871115 passed **145/145 tests** and archive validation.
- PR #22: six packs × six editorial queries, KST run-slot rotation, 12 unique editorial phrases/day, 24 RSS requests/day (+50% vs previous 16). Initial run #45549874901 failed because an existing recursive-improvement test still expected 3 packs; corrected it. Rerun #45549924691 passed **143/143 tests** and validation.
- PR #23: optional YouTube Data API public search across channels, 4 calls per run / 8 per day, 12 rotating queries, channel ID and origin provenance. Run #45549801497 passed **149/149 tests** and validation.
- Each temporary read-only push workflow was removed after its successful test. None was merged or added to main. These checks are branch evidence, not production deployment.
- All PRs remain open/unmerged. No data changed. 273 repeated legacy image URLs untouched.

### Fan-video collector design
- Uses documented YouTube Data API `search.list`, not undocumented search endpoints or scraped pages.
- Search results become canonical `www.youtube.com/watch?v=...` records only when API returns a valid 11-character video ID, title, channel identity and valid publication date.
- Channel identity is preserved. The known official channel is marked `official`; other channels remain `unverified` until reviewed, not automatically labeled fan.
- The collector skips if `YOUTUBE_API_KEY` is absent. No live API request was made and no key is configured. User may add this optional secret directly to Actions Secrets if they choose.
- Default quota: 100 `search.list` calls/day, 1 unit/call. Our bounded schedule uses 8/day. Source: https://developers.google.com/youtube/data/determine_quota_cost

### Photo-platform feasibility
- X API official pricing is pay-per-usage, with Posts: Read listed at $0.005 per returned post. It does not meet the strict free-first constraint. Source: https://docs.x.com/x-api/getting-started/pricing
- Meta Content Library/API is a research-oriented service using a Secure Research Environment; current documentation says its public-data geographic scope excludes South Korea. It is not a general free consumer API for this archive. Sources: https://developers.facebook.com/documentation/meta-content-library/ ; https://developers.facebook.com/documentation/meta-content-library/changelog
- Therefore no automatic X/Instagram/fansite photo collector was added. Preserve public source links and attribution; do not scrape login-only content, copy/rehost images, or imply that article OG thumbnails constitute fan-photo collection.

### Automation and Gemini feasibility
- Cloudflare Cron supports minute-level schedules such as `*/5 * * * *`, uses UTC, and can act as both scheduler and narrow dispatch gateway. Free plan limits documented as 100,000 requests/day, 10 ms CPU per invocation and 5 Cron Triggers/account. Sources: https://developers.cloudflare.com/workers/configuration/cron-triggers/ ; https://developers.cloudflare.com/workers/platform/limits/
- Gemini API free tier has limited model access and its free-tier content may be used to improve Google's products. Free Google Search grounding is available for selected Gemini 2.5 Flash/Flash-Lite models (shared 500 RPD), but is not available for Gemini 3 and newer free tier according to current pricing. Prefer Gemini as optional analysis of public/sanitized metadata, not as a required search engine or private-data processor. Source: https://ai.google.dev/gemini-api/docs/pricing
- No Cloudflare Worker, GitHub App, Gemini integration, Gemini key, external scheduler or five-minute automation was deployed.

## 2026-11-25 — re-audit, correctness fixes, and external dry-run dispatcher
### Actual repository state
- Confirmed main ref `7dba74e89d9b5b8e727f0ac5ff94a554aad9e9d6`.
- Rechecked PRs #13/#14/#15/#16/#20/#22/#23 and created #24. All are open/unmerged; no merge performed.
- Main data: 704 discovery candidates, 19 videos, 0 photos; newest published article timestamp `2026-11-19T09:21:00Z`.
- Main Actions #583 / run `45543108685` succeeded through data validation, artifact upload and Pages deployment. This is not proof of browser rendering. Pages URL inspection failed in the inspection client; Android/mobile QA remains unverified.

### PR #13 syntax defect
- Inspected latest branch source and found a literal backslash-n embedded between JavaScript statements in `js/article-quality-review-ui.mjs`.
- Corrected the sequence and committed `a2f15dbd7942727d55fa43b1110b79c6fd70dd2f`.
- Read-only Actions run #45550626122 passed **154/154 tests** and `npm run validate` on the code-fix-containing commit. Temporary workflow was deleted afterward. PR remains open.

### PR #20 date fallback defect
- Reviewed `sortDiscoveryItems`: invalid non-empty `publishedAt` prevented fallback to valid `discoveredAt`.
- Added `getDiscoveryTimestamp` to try both values independently and a regression test for invalid/valid/missing date combinations.
- Read-only Actions run #45551065801 passed **146/146 tests** and `npm run validate`; temporary workflow removed. PR remains open.

### PR #24 Cloudflare/GitHub App dry-run
- Added `cloudflare/dispatch-worker.mjs`, `cloudflare/wrangler.toml`, `.github/workflows/cloudflare-dispatch-dry-run.yml`, and `tests/cloudflare-dispatch-worker.test.mjs`.
- Worker has no HTTP handler and `workers_dev = false`; Cron is `17 11,23 * * *` UTC.
- App JWT uses WebCrypto RS256 and supports PKCS#8/PKCS#1 RSA PEM. Installation-token request explicitly restricts token to repository `haewon-archive` and permission `actions: write`.
- Target workflow accepts only `dry-run`, validates timestamp/cron metadata, and reports no data writes, collection, or deployment.
- Required Cloudflare secrets: `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY`. User must create/install the GitHub App only on this repository and grant Actions: write. No PAT, broad token, key, or secret was requested or configured.
- Read-only Actions run #45550865613 passed **147/147 tests** and `npm run validate` on commit `ee957ea156907821cd156b1c18f669675d482937`. Temporary workflows removed. No Cloudflare deployment or live GitHub App dispatch attempted.

### Platform policy/limits recheck
- Cloudflare Workers Free: 100,000 requests/day; 10 ms CPU per Cron invocation; 5 Cron triggers/account. The Worker uses one trigger twice daily. Network wait does not count toward CPU time, but deployed runtime crypto cost still needs a real Cloudflare test.
- GitHub workflow_dispatch endpoint requires Actions repository permission write for GitHub App installation tokens; token can be narrowed to one repository and one permission.
- Gemini free tier provides free input/output tokens only for eligible models and limited model access, but free-tier content is used to improve Google products. Limits vary by model and project (RPM/TPM/RPD); inspect AI Studio for active limits. Do not send secrets, private data, or personal data. Gemini remains optional and unconfigured.
- Photo discovery: no general free public API established; X reads are pay-per-use and Meta Content Library is research-focused/currently excludes South Korea public dataset. Continue with permitted public source links and attribution, no access-control bypass or rehosting.
- 273 legacy repeated image URL occurrences unchanged; human review labels remain zero.

### References checked
- Cloudflare Cron: https://developers.cloudflare.com/workers/configuration/cron-triggers/
- Cloudflare limits: https://developers.cloudflare.com/workers/platform/limits/
- GitHub workflow dispatch: https://docs.github.com/en/rest/actions/workflows
- GitHub App authentication: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app
- Gemini pricing/terms: https://ai.google.dev/gemini-api/docs/pricing
- Gemini rate limits: https://ai.google.dev/gemini-api/docs/rate-limits
