# Haewon Archive

해원 관련 공개 콘텐츠를 출처와 함께 모아보는 모바일 우선 팬 아카이브입니다.

- 사이트: https://uforpel.github.io/haewon-archive/
- 저장소: https://github.com/UForPel/haewon-archive
- 현재 자동 수집: Google News/Bing News RSS 기반 후보 발견만 활성화; YouTube 자동 수집은 정책 검토로 비활성화
- 기존 자동 실행: 매일 한국 시간 08:17 / 20:17 (GitHub Actions)

## 자동 발견 및 개선 루프

- 공개 뉴스 RSS 검색어 4개를 자동 탐색해 `data/discovery.json` 후보를 축적
- 후보별 키워드 관련성 점수 표시 및 점수 우선 정렬 (확정 분류가 아닌 검토 보조 지표)
- 뉴스 후보는 확정 아카이브와 분리하고 사이트에서 출처 링크로 확인
- `SELF_IMPROVEMENT_LOOP.md`에 관찰 → 진단 → 가설 → 수정 → 검증 → 측정 → 기록 반복 원칙
- AI API 없이 RSS/키워드 기반 수집부터 실행 (AI 판단과 자동 수집은 구분)

## 현재 MVP 기능

1. 기존에 수집한 영상 기록을 보존하고 원문 YouTube 링크로 제공 (신규 Atom 수집은 비활성화)
2. 영상 ID 기준 중복 검사 및 최신순 표시
3. 제목·설명에서 해원 관련 키워드 표시
4. 모바일 웹에서 검색, 필터, 영상 링크 열기
5. 수집 결과와 마지막 실행 시각을 JSON으로 기록
6. 영상·사진 링크 통합 검색, 자료 유형 및 출처 필터
7. 영상·사진 항목의 상세 정보 펼쳐보기
8. 공개 사진 게시물의 HTTPS 원문 링크를 브라우저에서 임시 등록·가져오기·내보내기
9. 사진 링크 메타데이터 JSON 관리 및 검증

## 프로젝트 연속성

새 ChatGPT 대화는 먼저 [PROJECT_MEMORY.md](PROJECT_MEMORY.md)를 읽고, [CHATGPT_OPERATING_RULES.md](CHATGPT_OPERATING_RULES.md)의 순서에 따라 최신 상태를 확인합니다.

## 자동화 거버넌스

- [GEMINI.md](GEMINI.md): Gemini 행동강령과 출력 규칙
- [SECURITY_POLICY.md](SECURITY_POLICY.md): 변경 보호되는 보안·개인정보·접근 경계
- [COLLECTION_RULES.md](COLLECTION_RULES.md): 수집 가능 출처, 검증, 중복 제거 및 쓰기 게이트
- [SOURCE_POLICY.md](SOURCE_POLICY.md): 실제 출처별 허용 상태
- [SEARCH_STRATEGY.md](SEARCH_STRATEGY.md): 검색어·검색 조합·우선순위
- [CLASSIFICATION_RULES.md](CLASSIFICATION_RULES.md): 게시자 유형과 해원 관련성의 분리 분류
- [POLICY_CHANGELOG.md](POLICY_CHANGELOG.md): 정책 변경 이력
- [schemas/archive-record.schema.json](schemas/archive-record.schema.json): 영상·사진 링크 데이터에 실제 적용되는 스키마
- [schemas/run-log.schema.json](schemas/run-log.schema.json): 자동화 실행 로그 목표 스키마
- [AUTOMATION_PLAN.md](AUTOMATION_PLAN.md): 외부 스케줄러 + Gemini 설계
- [DECISIONS.md](DECISIONS.md): 확정 결정과 미확정 사항
- [PROJECT_STATUS.md](PROJECT_STATUS.md): 실제 구현·테스트 상태
- [SESSION_LOG.md](SESSION_LOG.md): 작업 세션 기록
- [ROADMAP.md](ROADMAP.md): 개발 계획

## 현재 자동화 상태 — 주의

외부 스케줄러, Cloudflare Worker, Gemini API 연동, 5분 주기 워크플로, 팬 영상 자동 검색, 사진 자동 크롤러 및 정책 자동 업데이트는 아직 구현되지 않았습니다. 현재 스케줄은 기존 GitHub Actions의 하루 2회입니다.

아카이브 레코드 스키마는 `npm run validate`에서 영상·사진 링크 항목에 실제 적용됩니다. 실행 로그 스키마는 향후 자동화 로그 기능을 만들 때 적용할 예정입니다.

## GitHub Pages 최초 설정

Pages가 아직 구성되지 않은 경우 저장소 Settings → Pages → Build and deployment에서 Source를 GitHub Actions로 선택한 뒤 Actions 탭에서 워크플로를 실행합니다.

## 로컬 테스트

Node.js 20 이상에서 다음 명령을 실행합니다.

```bash
npm test
npm run collect
npm run validate
```

기존 영상 기록은 보존됩니다. YouTube의 현재 robots.txt는 /feeds/videos.xml을 일반 사용자 에이전트에 대해 차단하므로 Atom 폴링은 비활성화했습니다. YouTube Data API도 30일 갱신/삭제 lifecycle이 구현되고 검토되기 전까지 비활성 상태입니다.

## 사진 링크 등록

- 사진 원본 파일은 저장하지 않고 원문 URL과 출처 메타데이터만 관리합니다.
- 등록한 항목은 현재 브라우저의 로컬 저장소에 임시 보관됩니다.
- JSON 내보내기 후 `data/photos.json`에 반영하고 커밋해야 모든 방문자에게 공개됩니다.
- 로그인/접근 제한이나 플랫폼의 자동화 제한을 우회하지 않습니다.

## 권리 안내

이 저장소는 비공식 팬 프로젝트입니다. 각 영상·이미지의 권리는 원저작자 및 권리자에게 있습니다. 썸네일은 제공자가 공개한 미리보기 주소를 허용 범위에서 사용하며, 영상은 원문으로 연결합니다. 권리자의 요청이나 플랫폼 정책 변경이 있으면 해당 항목을 검토하고 조정합니다.


## UI action inventory

Every user-facing button/control must be present, functional, accessible, tested where feasible, and documented. See [BUTTONS_AND_ACTIONS.md](BUTTONS_AND_ACTIONS.md); future UI work must update this inventory and session/status records.
