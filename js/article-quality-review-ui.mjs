import { classifyDiscoveryCategories } from './discovery-kind.mjs';
import { ARTICLE_REVIEW_DIMENSIONS, getVerifiedHaewonArticles, summarizeArticleReviews, formatArticleReviewProgress, validateArticleReviewExport } from './article-review.mjs';

const host = document.querySelector('#article-quality-review');
if (host) {
  const STORAGE_KEY = 'haewon-article-quality-reviews-v1';
  let labels = {};
  try { labels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { labels = {}; }
  const names = {
    relevance: { relevant: '관련 있음', unrelated: '무관함', uncertain: '판단 보류' },
    originalAccess: { accessible: '접근 가능', blocked: '접근 제한', paywall: '유료·회원 제한', 'not-found': '삭제·404', uncertain: '판단 보류' },
    dateAccuracy: { accurate: '정확', inaccurate: '잘못됨', missing: '누락', uncertain: '판단 보류' },
    sourceAccuracy: { accurate: '정확', inaccurate: '잘못됨', uncertain: '판단 보류' },
    categoryAccuracy: { correct: '정확', incorrect: '잘못됨', uncertain: '판단 보류' },
    thumbnailAccuracy: { suitable: '기사와 적합', unsuitable: '기사와 무관', 'not-present': '이미지 없음', uncertain: '판단 보류' },
    contentType: { article: '기사', 'social-post': '소셜 게시물', profile: '프로필', other: '기타', uncertain: '판단 보류' }
  };
  const details = document.createElement('details'); details.className = 'article-quality-review';
  const summary = document.createElement('summary'); summary.textContent = '검증 원문 URL 품질 검수 · 자료 유형 / 원문 접근성 / 관련성 / 날짜 / 출처 / 분류 / 썸네일 적합성';
  const body = document.createElement('div'); body.className = 'article-quality-review-body';
  const intro = document.createElement('p'); intro.textContent = '개별 HTTPS 원문 주소가 명시된 해원 관련 항목을 대상으로 합니다. 기사·소셜 게시물·프로필을 먼저 구분하고 일곱 항목을 따로 평가하세요. 썸네일은 기사 내용과 실제로 일치하는지 확인하고, 이미지가 없으면 이미지 없음으로 표시하세요. 라벨은 이 브라우저에 저장되며 JSON으로 내보내 다른 기기 또는 저장소 검수 자료에 옮길 수 있습니다.';
  const progress = document.createElement('p'); progress.className = 'photo-meta'; progress.setAttribute('role', 'status'); progress.setAttribute('aria-live', 'polite');
  const actions = document.createElement('div'); actions.className = 'photo-actions';
  const exportButton = document.createElement('button'); exportButton.type = 'button'; exportButton.textContent = '기사 검수 JSON 내보내기';
  exportButton.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), labels }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'haewon-article-quality-reviews.json'; a.click(); URL.revokeObjectURL(url);
  });
  const importInput = document.createElement('input'); importInput.type = 'file'; importInput.accept = 'application/json,.json'; importInput.hidden = true;
  const importButton = document.createElement('button'); importButton.type = 'button'; importButton.textContent = '기사 검수 JSON 가져오기'; importButton.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    try { const file = importInput.files?.[0]; if (!file) return; const parsed = validateArticleReviewExport(await file.text(), articles.map(item => item.id)); labels = { ...labels, ...parsed.labels }; localStorage.setItem(STORAGE_KEY, JSON.stringify(labels)); render(); }
    catch { alert('검수 JSON 파일을 읽지 못했습니다.'); } finally { importInput.value = ''; }
  });
  actions.append(exportButton, importButton, importInput);
  const list = document.createElement('div'); list.className = 'article-quality-review-list';
  body.append(intro, progress, actions, list); details.append(summary, body); host.append(details);
  let articles = [];
  function render() {
    const report = summarizeArticleReviews(articles, labels);
    summary.textContent = '검증 원문 URL '+report.eligible+'건 품질 검수 · 자료 유형 / 원문 접근성 / 관련성 / 날짜 / 출처 / 분류 / 썸네일 적합성';
    progress.textContent = '검수 진행 · 기사 '+report.reviewedArticles+'/'+report.eligible+' · 여섯 항목 완료 '+report.fullyReviewed+'/'+report.eligible+
      ' · 접근성 '+report.dimensions.originalAccess.reviewed+'/'+report.eligible+' · 관련성 '+report.dimensions.relevance.reviewed+'/'+report.eligible+
      ' · 날짜 '+report.dimensions.dateAccuracy.reviewed+'/'+report.eligible+
      ' · 출처 '+report.dimensions.sourceAccuracy.reviewed+'/'+report.eligible+
      ' · 분류 '+report.dimensions.categoryAccuracy.reviewed+'/'+report.eligible;
    list.replaceChildren();
    for (const item of articles) {
      const row = document.createElement('article'); row.className = 'article-quality-review-row';
      const title = document.createElement('a'); title.href = item.publisherArticleUrl; title.target = '_blank'; title.rel = 'noopener noreferrer'; title.textContent = item.title; title.className = 'article-quality-review-title';
      const meta = document.createElement('p'); meta.className = 'photo-meta';
      const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ko-KR') : '날짜 없음';
      meta.textContent = (item.sourceName || '출처 미상')+' · '+date+' · '+(item.publisherHost || new URL(item.publisherArticleUrl).hostname)+' · 자동 분류 '+classifyDiscoveryCategories(item).join(', ')+' · 이미지 출처 '+(item.thumbnailSource || item.thumbnailProvenance?.source || '미확인');
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
          labels[String(item.id)] = next;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(labels)); progress.textContent = '저장됨 · '+item.title; } catch { progress.textContent = '브라우저 저장 공간에 기록하지 못했습니다.'; }
          updateProgress();
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
        labels[String(item.id)] = next;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(labels)); progress.textContent = '저장됨 · 정정 분류 · '+item.title; } catch { progress.textContent = '브라우저 저장 공간에 기록하지 못했습니다.'; }
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
