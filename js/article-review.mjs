import { filterArticleCandidates, hasExplicitPublisherArticleUrl, classifyDiscoveryRelevance, classifyDiscoveryCategories } from './discovery-kind.mjs';

export const ARTICLE_REVIEW_DIMENSIONS = {
  relevance: ['relevant', 'unrelated', 'uncertain'],
  dateAccuracy: ['accurate', 'inaccurate', 'missing', 'uncertain'],
  sourceAccuracy: ['accurate', 'inaccurate', 'uncertain'],
  categoryAccuracy: ['correct', 'incorrect', 'uncertain']
};
const valid = (dimension, value) => ARTICLE_REVIEW_DIMENSIONS[dimension]?.includes(value);
export function getVerifiedHaewonArticles(items = []) {
  return filterArticleCandidates(items).filter(item =>
    hasExplicitPublisherArticleUrl(item) && classifyDiscoveryRelevance(item) === 'haewon'
  );
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
  for (const [dimension, options] of Object.entries(ARTICLE_REVIEW_DIMENSIONS)) {
    const counts = Object.fromEntries(options.map(option => [option, 0]));
    for (const item of eligible) {
      const value = labels[String(item.id)]?.[dimension];
      if (options.includes(value)) counts[value]++;
    }
    const reviewed = options.reduce((sum, option) => sum + counts[option], 0);
    const decided = reviewed - (counts.uncertain || 0);
    const correct = counts.accurate || counts.correct || counts.relevant || 0;
    dimensions[dimension] = {
      eligible: eligible.length, reviewed, pending: eligible.length - reviewed,
      coverage: eligible.length ? Math.round(reviewed / eligible.length * 100) : 0,
      counts, accuracy: decided ? Math.round(correct / decided * 100) : null
    };
  }
  return {
    eligible: eligible.length,
    reviewedArticles: eligible.filter(item => Object.values(ARTICLE_REVIEW_DIMENSIONS).some(options => options.includes(labels[String(item.id)]?.relevance) || options.includes(labels[String(item.id)]?.dateAccuracy) || options.includes(labels[String(item.id)]?.sourceAccuracy) || options.includes(labels[String(item.id)]?.categoryAccuracy))).length,
    fullyReviewed: eligible.filter(item => Object.keys(ARTICLE_REVIEW_DIMENSIONS).every(key => valid(key, labels[String(item.id)]?.[key]))).length,
    dimensions
  };
}
export function buildLegacyThumbnailAudit(items = [], legacyUrl = '') {
  const rows = items.filter(item => {
    try { const a = new URL(item.thumbnailUrl || ''), b = new URL(legacyUrl); a.hash = ''; b.hash = ''; return a.href === b.href; }
    catch { return false; }
  });
  const alternatives = rows.map(item => ({
    articleId: String(item.id || ''), title: String(item.title || ''),
    publisherArticleUrl: hasExplicitPublisherArticleUrl(item) ? item.publisherArticleUrl : '',
    candidateUrls: [...new Set([...(item.thumbnailCandidates || []), ...(item.thumbnailMetaCandidates || [])]
      .map(candidate => String(candidate?.url || '')).filter(url => /^https:\/\//i.test(url)))],
    metadataStatus: item.thumbnailMetaFetch?.status || 'not-attempted',
    metadataErrorCode: item.thumbnailMetaFetch?.errorCode || ''
  }));
  return {
    url: legacyUrl, assignments: rows.length,
    recordsWithPublisherArticleUrl: alternatives.filter(row => row.publisherArticleUrl).length,
    recordsWithAlternativeCandidates: alternatives.filter(row => row.candidateUrls.length).length,
    distinctAlternativeUrls: new Set(alternatives.flatMap(row => row.candidateUrls)).size,
    metadataOutcomes: Object.fromEntries([...alternatives.reduce((map, row) => map.set(row.metadataStatus, (map.get(row.metadataStatus) || 0) + 1), new Map())]),
    records: alternatives
  };
}
