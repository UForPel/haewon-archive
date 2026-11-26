import { classifyDiscoveryCategories } from './discovery-kind.mjs';
import { ARTICLE_REVIEW_DIMENSIONS, getVerifiedHaewonArticles, summarizeArticleReviews, formatArticleReviewProgress, validateArticleReviewExport, createArticleReviewExport, mergeArticleReviewLabels, getArticleUrlContext, filterArticleReviews, isArticleReviewComplete, getNextPendingArticle } from './article-review.mjs';

const host = document.querySelector('#article-quality-review');
if (host) {
  const STORAGE_KEY = 'haewon-article-quality-reviews-v1';
  let labels = {};
  try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); labels = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}; } catch { labels = {}; }
  const names = {
    relevance: { relevant: '직접 관련', indirect: '간접 언급·타인 중심', unrelated: '무관함', uncertain: '판단 보류' },
    originalAccess: { accessible: '접근 가능', blocked: '접근 제한', paywall: '유료·회원 제한', 'not-found': '삭제·404', uncertain: '판단 보류' },
    dateAccuracy: { accurate: '정확', inaccurate: '잘못됨', missing: '누락', uncertain: '판단 보류' },
    sourceAccuracy: { accurate: '정확', inaccurate: '잘못됨', uncertain: '판단 보류' },
    categoryAccuracy: { correct: '정확', incorrect: '잘못됨', uncertain: '판단 보류' },
    thumbnailAccuracy: { suitable: '기사와 적합', unsuitable: '기사와 무관', 'not-present': '이미지 없음', uncertain: '판단 보류' },
    contentType: { article: '기사', 'social-post': '소셜 게시물', profile: '프로필', other: '기타', uncertain: '판단 보류' }
  };
  const details = document.createElement('details'); details.className = 'article-quality-review';
  const summary = document.createElement('summary'); summary.textContent = '검증 원문 URL 품질 검수 · 자료 유형 / 원문 접근성 / 직접·간접 관련성 / 날짜 / 출처 / 분류 / 썸네일 적합성';
  const body = document.createElement('div'); body.className = 'article-quality-review-body';
  const intro = document.createElement('p'); intro.textContent = '개별 HTTPS 원문 주소가 명시된 해원 관련 항목을 대상으로 합니다. 기사·소셜 게시물·프로필을 먼저 구분하고 일곱 항목을 따로 평가하세요. 썸네일은 기사 내용과 실제로 일치하는지 확인하고, 이미지가 없으면 이미지 없음으로 표시하세요. 검수 라벨은 이 브라우저에만 저장되며 서버나 저장소로 자동 전송되지 않습니다. 개인정보는 메모에 입력하지 마세요. JSON 내보내기/가져오기로 수동 이동할 수 있습니다.';
  const progress = document.createElement('p'); progress.className = 'photo-meta'; progress.setAttribute('role', 'status'); progress.setAttribute('aria-live', 'polite');
  const actions = document.createElement('div'); actions.className = 'photo-actions';
  let showPendingOnly = false;
  const filterButton = document.createElement('button'); filterButton.type = 'button'; filterButton.textContent = '미검수만 보기';
  filterButton.addEventListener('click', () => { showPendingOnly = !showPendingOnly; filterButton.textContent = showPendingOnly ? '전체 기사 보기' : '미검수만 보기'; render(); });
  const nextButton = document.createElement('button'); nextButton.type = 'button'; nextButton.textContent = '다음 미검수 기사';
  nextButton.addEventListener('click', () => {
    showPendingOnly = true; filterButton.textContent = '전체 기사 보기'; render();
    focusNextPendingArticle();
  });
  const exportButton = document.createElement('button'); exportButton.type = 'button'; exportButton.textContent = '기사 검수 JSON 내보내기';
  exportButton.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(createArticleReviewExport(labels), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'haewon-article-quality-reviews.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      progress.textContent = '검수 기록 JSON 내보내기를 시작했습니다. 다운로드 파일을 안전한 곳에 보관하세요.';
    } catch {
      progress.textContent = 'JSON 파일을 만들지 못했습니다. 브라우저 다운로드 설정을 확인해 주세요.';
    }
  });
  const importInput = document.createElement('input'); importInput.type = 'file'; importInput.accept = 'application/json,.json'; importInput.hidden = true;
  const importButton = document.createElement('button'); importButton.type = 'button'; importButton.textContent = '기사 검수 JSON 가져오기'; importButton.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    try {
      const file = importInput.files?.[0]; if (!file) return;
      const parsed = validateArticleReviewExport(await file.text(), articles.map(item => item.id));
      const importedCount = Object.keys(parsed.labels).length;
      const nextLabels = mergeArticleReviewLabels(labels, parsed, articles.map(item => item.id));
      if (persistLabels(nextLabels, '')) {
        render();
        progress.textContent = importedCount+'개 기사의 검수 기록을 가져왔습니다. 기존 기록과 병합했으며 서버로 전송하지 않았습니다.';
      }
    } catch { progress.textContent = '검수 JSON을 가져오지 못했습니다. 파일 형식과 버전, 기사 ID를 확인해 주세요. 기존 기록은 유지됩니다.'; }
    finally { importInput.value = ''; }
  });
  actions.append(nextButton, filterButton, exportButton, importButton, importInput);
  const list = document.createElement('div'); list.className = 'article-quality-review-list';
  body.append(intro, progress, actions, list); details.append(summary, body); host.append(details);
  let articles = [];
  function persistLabels(nextLabels, successMessage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLabels));
      labels = nextLabels;
      progress.textContent = successMessage;
      return true;
    } catch {
      progress.textContent = '브라우저 저장 공간에 기록하지 못했습니다. 기존 검수 기록은 유지됩니다. JSON 내보내기로 백업한 뒤 다시 시도해 주세요.';
      return false;
    }
  }
  function focusNextPendingArticle(afterArticleId = null) {
    const next = getNextPendingArticle(articles, labels, afterArticleId);
    if (!next) { progress.textContent = '모든 검수 대상의 일곱 항목이 완료되었습니다.'; return; }
    const row = Array.from(list.children).find(element => element.dataset.articleId === String(next.id));
    if (!row) { progress.textContent = '다음 미검수 기사를 찾지 못했습니다. 목록을 다시 확인해 주세요.'; return; }
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.querySelector('select')?.focus({ preventScroll: true });
    progress.textContent = '다음 미검수 기사로 이동했습니다. 일곱 항목을 확인해 주세요.';
  }
  function render() {
    const report = summarizeArticleReviews(articles, labels);
    summary.textContent = '검증 원문 URL '+report.eligible+'건 품질 검수 · 자료 유형 / 원문 접근성 / 관련성 / 날짜 / 출처 / 분류 / 썸네일 적합성';
    progress.textContent = '검수 진행 · 기사 '+report.reviewedArticles+'/'+report.eligible+' · 일곱 항목 완료 '+report.fullyReviewed+'/'+report.eligible+
      ' · 접근성 '+report.dimensions.originalAccess.reviewed+'/'+report.eligible+' · 관련성 '+report.dimensions.relevance.reviewed+'/'+report.eligible+
      ' · 날짜 '+report.dimensions.dateAccuracy.reviewed+'/'+report.eligible+
      ' · 출처 '+report.dimensions.sourceAccuracy.reviewed+'/'+report.eligible+
      ' · 분류 '+report.dimensions.categoryAccuracy.reviewed+'/'+report.eligible;
    list.replaceChildren();
    for (const item of filterArticleReviews(articles, labels, showPendingOnly ? 'pending' : 'all')) {
      const row = document.createElement('article'); row.className = 'article-quality-review-row'; row.dataset.articleId = String(item.id);
      const title = document.createElement('a'); title.href = item.publisherArticleUrl; title.target = '_blank'; title.rel = 'noopener noreferrer'; title.textContent = item.title; title.className = 'article-quality-review-title';
      const meta = document.createElement('p'); meta.className = 'photo-meta';
      const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ko-KR') : '날짜 없음';
      const urlContext = getArticleUrlContext(item);
      meta.textContent = (item.sourceName || '출처 미상')+' · '+date+' · 원문 URL '+(urlContext.publisherArticleHost || '확인 불가')+' · 검색 URL '+(urlContext.discoveryUrlHost || '확인 불가')+' · 등록 출처 호스트 '+(urlContext.recordedPublisherHost || '미기록')+' · 자동 분류 '+classifyDiscoveryCategories(item).join(', ')+' · 이미지 출처 '+(item.thumbnailSource || item.thumbnailProvenance?.source || '미확인');
      const image = document.createElement('img'); image.className = 'article-quality-review-image'; image.alt = '기사 썸네일 후보'; image.loading = 'lazy';
      if (/^https:\/\//i.test(item.thumbnailUrl || '')) image.src = item.thumbnailUrl; else image.hidden = true;
      const fields = document.createElement('div'); fields.className = 'article-quality-review-fields';
      const current = labels[String(item.id)] || { articleId: String(item.id) };
      for (const [dimension, options] of Object.entries(ARTICLE_REVIEW_DIMENSIONS)) {
        const label = document.createElement('label'); label.textContent = ({ relevance: '기사 관련성', originalAccess: '원문 접근성', dateAccuracy: '게시 날짜', sourceAccuracy: '출처', categoryAccuracy: '분류', thumbnailAccuracy: '썸네일 적합성', contentType: '자료 유형' })[dimension];
        const select = document.createElement('select'); select.setAttribute('aria-label', label.textContent);
        const blank = document.createElement('option'); blank.value = ''; blank.textContent = '미검수'; select.append(blank);
        for (const option of options) { const choice = document.createElement('option'); choice.value = option; choice.textContent = names[dimension][option]; select.append(choice); }
        select.value = current[dimension] || '';
        select.addEventListener('change', () => {
          const next = { ...(labels[String(item.id)] || { articleId: String(item.id) }), [dimension]: select.value, reviewedAt: new Date().toISOString() };
          if (!select.value) delete next[dimension];
          const nextLabels = { ...labels, [String(item.id)]: next };
          if (!persistLabels(nextLabels, '저장됨 · '+item.title)) { select.value = current[dimension] || ''; return; }
          if (showPendingOnly && isArticleReviewComplete(item, labels)) { render(); focusNextPendingArticle(item.id); } else updateProgress();
        });
        label.append(select); fields.append(label);
      }
      const correction = document.createElement('label'); correction.textContent = '정정 분류 (분류가 잘못된 경우)';
      const correctionSelect = document.createElement('select'); correctionSelect.setAttribute('aria-label', correction.textContent);
      const correctionBlank = document.createElement('option'); correctionBlank.value = ''; correctionBlank.textContent = '정정 분류 선택'; correctionSelect.append(correctionBlank);
      for (const category of ['news', 'event', 'brand', 'official', 'interview', 'performance']) { const option = document.createElement('option'); option.value = category; option.textContent = category; correctionSelect.append(option); }
      correctionSelect.value = current.expectedCategory || '';
      correctionSelect.addEventListener('change', () => {
        const next = { ...(labels[String(item.id)] || { articleId: String(item.id) }), reviewedAt: new Date().toISOString() };
        if (correctionSelect.value) next.expectedCategory = correctionSelect.value; else delete next.expectedCategory;
        const nextLabels = { ...labels, [String(item.id)]: next };
        if (!persistLabels(nextLabels, '저장됨 · 정정 분류 · '+item.title)) correctionSelect.value = current.expectedCategory || '';
      });
      correction.append(correctionSelect);
      row.append(title, meta, image, fields, correction); list.append(row);
    }
    updateProgress();
  }
  function updateProgress() {
    progress.textContent = formatArticleReviewProgress(summarizeArticleReviews(articles, labels));
  }
  fetch('./data/discovery.json').then(response => { if (!response.ok) throw new Error('discovery unavailable'); return response.json(); })
    .then(items => { articles = getVerifiedHaewonArticles(Array.isArray(items) ? items : []); render(); })
    .catch(() => { progress.textContent = '검수 대상 기사를 불러오지 못했습니다.'; });
}
