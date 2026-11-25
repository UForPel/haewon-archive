import { filterArticleCandidates, hasExplicitPublisherArticleUrl, classifyDiscoveryRelevance, classifyDiscoveryCategories } from './discovery-kind.mjs';

export const ARTICLE_REVIEW_DIMENSIONS = {
  relevance: ['relevant', 'indirect', 'unrelated', 'uncertain'],
  originalAccess: ['accessible', 'blocked', 'paywall', 'not-found', 'uncertain'],
  dateAccuracy: ['accurate', 'inaccurate', 'missing', 'uncertain'],
  sourceAccuracy: ['accurate', 'inaccurate', 'uncertain'],
  categoryAccuracy: ['correct', 'incorrect', 'uncertain'],
  thumbnailAccuracy: ['suitable', 'unsuitable', 'not-present', 'uncertain'],
  contentType: ['article', 'social-post', 'profile', 'other', 'uncertain']
};
const valid = (dimension, value) => ARTICLE_REVIEW_DIMENSIONS[dimension]?.includes(value);
export function getVerifiedHaewonArticles(items = []) {
  return filterArticleCandidates(items).filter(item =>
    hasExplicitPublisherArticleUrl(item) && classifyDiscoveryRelevance(item) === 'haewon'
  );
}
export async function auditVerifiedPublisherArticles(items = [], { fetchImpl = fetch, timeoutMs = 3500, concurrency = 3 } = {}) {
  const articles = getVerifiedHaewonArticles(items);
  const results = new Array(articles.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= articles.length) return;
      const item = articles[index];
      const url = item.publisherArticleUrl;
      try {
        const response = await fetchImpl(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
        let finalHost = '';
        try { const finalUrl = new URL(response.url || url); if (finalUrl.protocol === 'https:') finalHost = finalUrl.hostname; } catch {}
        const status = Number(response.status) || null;
        const state = status >= 200 && status < 400 ? 'http-responded'
          : status === 402 || status === 451 ? 'paywall'
          : status === 401 || status === 403 ? 'blocked'
          : status === 404 || status === 410 ? 'not-found'
          : 'uncertain';
        results[index] = { articleId: String(item.id || ''), url, status, state, finalHost, method: 'HEAD' };
      } catch (error) {
        results[index] = { articleId: String(item.id || ''), url, status: null, state: 'uncertain', finalHost: '', method: 'HEAD', error: String(error?.name || 'network-error') };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, articles.length) }, worker));
  const counts = Object.fromEntries(['http-responded', 'blocked', 'paywall', 'not-found', 'uncertain'].map(state => [state, results.filter(row => row.state === state).length]));
  return { scope: 'explicit-publisher-https-haewon-articles', method: 'HEAD', redirectPolicy: 'standard-http-follow-only', bypassAttempted: false, checked: results.length, total: articles.length, counts, results };
}

export function validateArticleReviewExport(payload, eligibleIds = null) {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!parsed || parsed.schemaVersion !== 1 || !parsed.labels || typeof parsed.labels !== 'object' || Array.isArray(parsed.labels)) {
    throw new Error('invalid article review export');
  }
  const allowed = eligibleIds ? new Set(eligibleIds.map(String)) : null;
  const labels = {};
  for (const [id, value] of Object.entries(parsed.labels)) {
    if (!value || typeof value !== 'object' || (allowed && !allowed.has(id))) continue;
    const row = { articleId: String(value.articleId || id), reviewedAt: String(value.reviewedAt || '') };
    if (row.articleId !== id) continue;
    for (const [dimension, options] of Object.entries(ARTICLE_REVIEW_DIMENSIONS)) {
      if (options.includes(value[dimension])) row[dimension] = value[dimension];
    }
    if (value.expectedCategory && typeof value.expectedCategory === 'string') row.expectedCategory = value.expectedCategory.slice(0, 60);
    if (value.note && typeof value.note === 'string') row.note = value.note.slice(0, 500);
    if (Object.keys(ARTICLE_REVIEW_DIMENSIONS).some(key => row[key])) labels[id] = row;
  }
  return { schemaVersion: 1, labels };
}
export function summarizeArticleReviews(items = [], labels = {}) {
  const eligible = getVerifiedHaewonArticles(items);
  const dimensions = {};
  const positive = { relevance: 'relevant', originalAccess: 'accessible', dateAccuracy: 'accurate', sourceAccuracy: 'accurate', categoryAccuracy: 'correct', thumbnailAccuracy: 'suitable' };
  for (const [dimension, options] of Object.entries(ARTICLE_REVIEW_DIMENSIONS)) {
    const counts = Object.fromEntries(options.map(option => [option, 0]));
    for (const item of eligible) {
      const value = labels[String(item.id)]?.[dimension];
      if (options.includes(value)) counts[value]++;
    }
    const reviewed = options.reduce((sum, option) => sum + counts[option], 0);
    const decided = dimension === 'thumbnailAccuracy'
      ? (counts.suitable || 0) + (counts.unsuitable || 0)
      : reviewed - (counts.uncertain || 0);
    const correct = counts[positive[dimension]] || 0;
    dimensions[dimension] = {
      eligible: eligible.length, reviewed, pending: eligible.length - reviewed,
      coverage: eligible.length ? Math.round(reviewed / eligible.length * 100) : 0,
      counts, accuracy: dimension === 'contentType' ? null : decided ? Math.round(correct / decided * 100) : null
    };
  }
  return {
    eligible: eligible.length,
    reviewedArticles: eligible.filter(item => Object.keys(ARTICLE_REVIEW_DIMENSIONS).some(dimension => valid(dimension, labels[String(item.id)]?.[dimension]))).length,
    fullyReviewed: eligible.filter(item => Object.keys(ARTICLE_REVIEW_DIMENSIONS).every(key => valid(key, labels[String(item.id)]?.[key]))).length,
    dimensions
  };
}

export function formatArticleReviewProgress(report) {
  const total = report.eligible;
  const dims = report.dimensions;
  return '검수 진행 · 원문 '+report.reviewedArticles+'/'+total+' · 일곱 항목 완료 '+report.fullyReviewed+'/'+total+
    ' · 자료 유형 '+dims.contentType.reviewed+'/'+total+
    ' · 원문 접근성 '+dims.originalAccess.reviewed+'/'+total+
    ' · 관련성 '+dims.relevance.reviewed+'/'+total+
    ' · 날짜 '+dims.dateAccuracy.reviewed+'/'+total+
    ' · 출처 '+dims.sourceAccuracy.reviewed+'/'+total+
    ' · 분류 '+dims.categoryAccuracy.reviewed+'/'+total+
    ' · 썸네일 '+dims.thumbnailAccuracy.reviewed+'/'+total;
}

export function buildLegacyThumbnailAudit(items = [], legacyUrl = '') {
  const rows = items.filter(item => {
    try { const a = new URL(item.thumbnailUrl || ''), b = new URL(legacyUrl); a.hash = ''; b.hash = ''; return a.href === b.href; }
    catch { return false; }
  });
  const alternatives = rows.map(item => ({
    articleId: String(item.id || ''), title: String(item.title || ''),
    publisherArticleUrl: hasExplicitPublisherArticleUrl(item) ? item.publisherArticleUrl : '',
    sourceSiteUrl: /^https:\/\//i.test(String(item.sourceUrl || '')) ? item.sourceUrl : '',
    discoverySource: String(item.discoverySource || ''),
    candidateUrls: [...new Set([...(item.thumbnailCandidates || []), ...(item.thumbnailMetaCandidates || [])]
      .map(candidate => String(candidate?.url || '')).filter(url => /^https:\/\//i.test(url)))],
    metadataStatus: item.thumbnailMetaFetch?.status || 'not-attempted',
    metadataErrorCode: item.thumbnailMetaFetch?.errorCode || ''
  }));
  return {
    url: legacyUrl, assignments: rows.length,
    recordsWithPublisherArticleUrl: alternatives.filter(row => row.publisherArticleUrl).length,
    recordsWithSourceSiteUrl: alternatives.filter(row => row.sourceSiteUrl).length,
    sourceSiteHosts: Object.fromEntries([...alternatives.reduce((map, row) => { if (row.sourceSiteUrl) { try { const host = new URL(row.sourceSiteUrl).hostname; map.set(host, (map.get(host) || 0) + 1); } catch {} } return map; }, new Map())]),
    recordsWithAlternativeCandidates: alternatives.filter(row => row.candidateUrls.length).length,
    distinctAlternativeUrls: new Set(alternatives.flatMap(row => row.candidateUrls)).size,
    metadataOutcomes: Object.fromEntries([...alternatives.reduce((map, row) => map.set(row.metadataStatus, (map.get(row.metadataStatus) || 0) + 1), new Map())]),
    records: alternatives
  };
}

export function getArticleUrlContext(item = {}) {
  const host = value => {
    try {
      const url = new URL(String(value || ''));
      return url.protocol === 'https:' ? url.hostname.toLowerCase() : '';
    } catch { return ''; }
  };
  return {
    publisherArticleHost: host(item.publisherArticleUrl),
    discoveryUrlHost: host(item.url),
    recordedPublisherHost: String(item.publisherHost || '')
  };
}
