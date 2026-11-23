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
