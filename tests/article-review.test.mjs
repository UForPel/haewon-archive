import test from 'node:test';
import assert from 'node:assert/strict';
import { getVerifiedHaewonArticles, summarizeArticleReviews, validateArticleReviewExport, buildLegacyThumbnailAudit } from '../js/article-review.mjs';

const base = { id: 'a', title: '오해원 인터뷰', url: 'https://news.test/a', publisherArticleUrl: 'https://news.test/a', publishedAt: '2026-11-20T00:00:00Z', sourceName: '뉴스', thumbnailUrl: 'https://img.test/a.jpg' };
test('review scope contains only explicit publisher HTTPS Haewon articles and excludes videos', () => {
  const rows = getVerifiedHaewonArticles([base, {...base,id:'b',title:'NMIXX 새 소식'}, {...base,id:'c',title:'해원 직캠'}, {...base,id:'d',publisherArticleUrl:'https://news.google.com/rss/articles/x'}]);
  assert.deepEqual(rows.map(row=>row.id), ['a']);
});
test('review summary separates per-dimension coverage and full completion', () => {
  const labels = { a: {articleId:'a',relevance:'relevant',dateAccuracy:'accurate',sourceAccuracy:'accurate'} };
  const report = summarizeArticleReviews([base], labels);
  assert.equal(report.eligible,1); assert.equal(report.reviewedArticles,1); assert.equal(report.fullyReviewed,0);
  assert.equal(report.dimensions.relevance.coverage,100); assert.equal(report.dimensions.categoryAccuracy.coverage,0);
});
test('review export accepts only known labels and optionally limits IDs', () => {
  const payload = {schemaVersion:1,labels:{a:{articleId:'a',relevance:'relevant',sourceAccuracy:'accurate'},b:{articleId:'b',relevance:'invalid'}}};
  assert.deepEqual(Object.keys(validateArticleReviewExport(payload,['a']).labels),['a']);
  assert.throws(()=>validateArticleReviewExport({schemaVersion:2,labels:{}}));
});
test('legacy thumbnail audit measures alternatives without deleting or pooling labels', () => {
  const legacy='https://img.test/shared.jpg';
  const rows=[{...base,thumbnailUrl:legacy,thumbnailCandidates:[]},{...base,id:'b',thumbnailUrl:legacy,thumbnailCandidates:[{url:'https://img.test/b.jpg'}]}];
  const report=buildLegacyThumbnailAudit(rows,legacy);
  assert.equal(report.assignments,2); assert.equal(report.recordsWithAlternativeCandidates,1); assert.equal(report.recordsWithPublisherArticleUrl,2); assert.equal(report.recordsWithSourceSiteUrl,0);
  assert.equal(report.distinctAlternativeUrls,1); assert.equal(report.records.length,2);
});
