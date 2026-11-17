# Haewon Archive

해원 관련 공개 콘텐츠를 출처와 함께 모아보는 모바일 우선 팬 아카이브입니다.

- 사이트(배포 설정 완료 후): https://uforpel.github.io/haewon-archive/
- 저장소: https://github.com/UForPel/haewon-archive
- 수집 대상(현재): NMIXX 공식 YouTube 채널의 공개 Atom 피드
- 자동 실행: 매일 한국 시간 08:17 / 20:17 (GitHub Actions)
- 실행 로그: https://github.com/UForPel/haewon-archive/actions

## 현재 MVP 기능

1. 공식 NMIXX YouTube 채널의 최신 피드 항목 수집
2. 영상 ID 기준 중복 제거 및 최신순 저장
3. 제목·설명에서 해원 관련 키워드(해원, 오해원, HAEWON) 표시
4. 모바일 웹에서 제목 검색, 해원 관련 영상 필터, 영상 링크 열기
5. 수집 결과와 마지막 실행 시각을 JSON으로 기록

## GitHub Pages 최초 설정

GitHub 연결 권한으로 Pages 사이트를 처음 생성하는 작업이 거부되어, 저장소 소유자가 한 번만 설정해야 합니다.

1. 저장소의 Settings → Pages로 이동합니다.
2. Build and deployment의 Source를 GitHub Actions로 선택합니다.
3. Actions 탭에서 Collect and deploy archive 워크플로를 다시 실행합니다.

이후에는 워크플로가 테스트, 수집, 데이터 커밋, Pages 배포를 이어서 수행합니다.

## 로컬 테스트

Node.js 20 이상에서 npm test, npm run collect, npm run validate 순서로 실행합니다.

수집 스크립트는 API 키 없이 공개 채널 피드를 읽습니다. YouTube 피드가 제공하는 최신 15개 항목만 매 실행 때 확인하므로, 장기간 수집이 중단되거나 짧은 시간에 15개를 초과하는 새 영상이 게시되면 누락이 생길 수 있습니다.

## 사진 자료

사진 자동 수집은 아직 구현하지 않았습니다. Instagram·TikTok 등 로그인/앱 전용 또는 접근 제한이 있는 플랫폼을 우회해 긁어오지 않습니다. 허용된 공개 피드 또는 사용 허가가 확인된 원문 링크만 추가할 수 있도록 준비 중입니다. 원본 사진 파일을 저장소에 복제하지 않습니다.

## 문서

- SOURCE_POLICY.md: 수집 출처 및 권리 정책
- PROJECT_STATUS.md: 구현·테스트 현황
- ROADMAP.md: 다음 작업 계획

## 권리 안내

이 저장소는 비공식 팬 프로젝트입니다. 각 영상·이미지의 권리는 원저작자 및 권리자에게 있습니다. 썸네일은 YouTube 공개 피드가 제공하는 미리보기 주소를 사용하며, 영상은 YouTube 원문으로 연결합니다. 권리자의 요청이나 플랫폼 정책 변경이 있으면 해당 항목을 검토하고 조정합니다.
