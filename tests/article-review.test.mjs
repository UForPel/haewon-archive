import test from 'node:test';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getVerifiedHaewonArticles, summarizeArticleReviews, validateArticleReviewExport, filterArticleReviews, isArticleReviewComplete, buildLegacyThumbnailAudit, auditVerifiedPublisherArticles, formatArticleReviewProgress } from '../js/article-review.mjs';

const base = { id: 'a', title: '오해원 인터뷰', url: 'https://news.test/a', publisherArticleUrl: 'https://news.test/a', publishedAt: '2026-11-20T00:00:00Z', sourceName: '뉴스', thumbnailUrl: 'https://img.test/a.jpg' };
test('review scope contains only explicit publisher HTTPS Haewon articles and excludes videos', () => {
  const rows = getVerifiedHaewonArticles([base, {...base,id:'b',title:'NMIXX 새 소식'}, {...base,id:'c',title:'해원 직캠'}, {...base,id:'d',publisherArticleUrl:'https://news.google.com/rss/articles/x'}]);
  assert.deepEqual(rows.map(row=>row.id), ['a']);
});
test('review summary separates per-dimension coverage and full completion', () => {
  const labels = { a: {articleId:'a',relevance:'relevant',originalAccess:'accessible',dateAccuracy:'accurate',sourceAccuracy:'accurate',thumbnailAccuracy:'suitable'} };
  const report = summarizeArticleReviews([base], labels);
  assert.equal(report.eligible,1); assert.equal(report.reviewedArticles,1); assert.equal(report.fullyReviewed,0);
  assert.equal(report.dimensions.relevance.coverage,100); assert.equal(report.dimensions.originalAccess.coverage,100); assert.equal(report.dimensions.categoryAccuracy.coverage,0); assert.equal(report.dimensions.thumbnailAccuracy.coverage,100); assert.equal(report.dimensions.thumbnailAccuracy.accuracy,100);
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

test('publisher accessibility audit checks only verified direct HTTPS article URLs once with HEAD', async () => {
  const calls=[];
  const rows=await auditVerifiedPublisherArticles([
    base,
    {...base,id:'wrapper',url:'https://news.google.com/rss/articles/opaque',publisherArticleUrl:''},
    {...base,id:'bad-protocol',publisherArticleUrl:'http://news.test/a'}
  ],{fetchImpl:async (url,options)=>{calls.push({url,method:options.method,redirect:options.redirect});return {status:403,url};}});
  assert.equal(rows.checked,1); assert.equal(rows.counts.blocked,1); assert.equal(rows.bypassAttempted,false);
  assert.deepEqual(calls,[{url:base.publisherArticleUrl,method:'HEAD',redirect:'follow'}]);
});

test('thumbnail suitability accuracy excludes absent images and uncertain judgments', () => {
  const rows = [base, {...base,id:'b',thumbnailUrl:''}, {...base,id:'c'}];
  const labels = {
    a: {articleId:'a',thumbnailAccuracy:'suitable'},
    b: {articleId:'b',thumbnailAccuracy:'not-present'},
    c: {articleId:'c',thumbnailAccuracy:'uncertain'}
  };
  const report = summarizeArticleReviews(rows, labels);
  assert.equal(report.dimensions.thumbnailAccuracy.reviewed,3);
  assert.equal(report.dimensions.thumbnailAccuracy.accuracy,100);
});

test('review progress includes all seven dimensions including indirect relevance and thumbnail', () => {
  const report = summarizeArticleReviews([base], {});
  const progress = formatArticleReviewProgress(report);
  assert.match(progress, /일곱 항목 완료 0\/1/);
  assert.match(progress, /자료 유형 0\/1/);
  assert.match(progress, /썸네일 0\/1/);
});
test('content type is recorded without pretending its labels are an accuracy score', () => {
  const report = summarizeArticleReviews([base], {
    a: {articleId:'a',contentType:'social-post',categoryAccuracy:'incorrect',expectedCategory:'news'}
  });
  assert.equal(report.dimensions.contentType.counts['social-post'],1);
  assert.equal(report.dimensions.contentType.accuracy,null);
  const imported = validateArticleReviewExport({schemaVersion:1,labels:{
    a:{articleId:'a',contentType:'profile',categoryAccuracy:'incorrect',expectedCategory:'performance'}
  }},['a']);
  assert.equal(imported.labels.a.contentType,'profile');
  assert.equal(imported.labels.a.expectedCategory,'performance');
});

test('indirect relevance is distinct from direct relevance and reduces direct-match accuracy', () => {
  const report = summarizeArticleReviews([base], {
    a: {articleId:'a',relevance:'indirect'}
  });
  assert.equal(report.dimensions.relevance.counts.indirect,1);
  assert.equal(report.dimensions.relevance.accuracy,0);
});

import { getArticleUrlContext } from '../js/article-review.mjs';
test('article review exposes publisher URL, discovery URL and recorded source hosts separately', () => {
  assert.deepEqual(getArticleUrlContext({
    sourceName: 'OSEN',
    url: 'https://www.osen.co.kr/article/G1112588404',
    publisherArticleUrl: 'https://biz.chosun.com/entertainment/enter_general/2025/06/10/story/',
    publisherHost: 'www.osen.co.kr'
  }), {
    publisherArticleHost: 'biz.chosun.com',
    discoveryUrlHost: 'www.osen.co.kr',
    recordedPublisherHost: 'www.osen.co.kr'
  });
  assert.deepEqual(getArticleUrlContext({
    sourceName: 'MSN',
    url: 'https://www.msn.com/story',
    publisherArticleUrl: 'https://sports.khan.co.kr/en/article/202609201357007',
    publisherHost: 'www.msn.com'
  }), {
    publisherArticleHost: 'sports.khan.co.kr',
    discoveryUrlHost: 'www.msn.com',
    recordedPublisherHost: 'www.msn.com'
  });
  assert.deepEqual(getArticleUrlContext({ publisherArticleUrl: 'http://bad.test/a', url: 'not-a-url' }), {
    publisherArticleHost: '', discoveryUrlHost: '', recordedPublisherHost: ''
  });
});


test('publisher accessibility sample is bounded, rotates, and never retries 405 with GET', async()=>{
 const rows=Array.from({length:25},(_,i)=>({...base,id:'a'+i,publisherArticleUrl:'https://news.test/'+i}));
 const calls=[];
 const report=await auditVerifiedPublisherArticles(rows,{limit:12,offset:12,fetchImpl:async(url,options)=>{calls.push({url,method:options.method});return {status:405,url};}});
 assert.equal(report.total,25);assert.equal(report.checked,12);assert.equal(report.sampled,12);
 assert.equal(calls.length,12);assert.ok(calls.every(call=>call.method==='HEAD'));
 assert.equal(calls[0].url,'https://news.test/12');
 assert.ok(report.results.every(row=>row.state==='uncertain'));
});

test('article review UI is local-only, import/export enabled and mounted in the discovery page',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 const ui=await readFile(new URL('../js/article-quality-review-ui.mjs',import.meta.url),'utf8');
 assert.match(html,/id="article-quality-review"/);
 assert.match(html,/js\/article-quality-review-ui\.mjs/);
 assert.match(ui,/localStorage/);
 assert.match(ui,/JSON 내보내기/);
 assert.match(ui,/JSON 가져오기/);
 assert.match(ui,/서버나 저장소로 자동 전송되지 않습니다/);
});


test('pending review queue keeps partial and uncertain reviews until all seven dimensions are labeled',()=>{
 const complete={articleId:'a',relevance:'uncertain',originalAccess:'accessible',dateAccuracy:'accurate',sourceAccuracy:'accurate',categoryAccuracy:'correct',thumbnailAccuracy:'not-present',contentType:'article'};
 const partial={articleId:'b',relevance:'indirect'};
 const items=[{...base,id:'a'},{...base,id:'b'},{...base,id:'c'}];
 const labels={a:complete,b:partial};
 assert.equal(isArticleReviewComplete(items[0],labels),true);
 assert.equal(isArticleReviewComplete(items[1],labels),false);
 assert.deepEqual(filterArticleReviews(items,labels,'pending').map(item=>item.id),['b','c']);
 assert.deepEqual(filterArticleReviews(items,labels,'all').map(item=>item.id),['a','b','c']);
 const report=summarizeArticleReviews(items,labels);
 assert.equal(report.fullyReviewed,1); assert.equal(report.pendingArticles,2);
});

test('article review UI exposes pending-only and next-pending controls without server upload',async()=>{
 const ui=await readFile(new URL('../js/article-quality-review-ui.mjs',import.meta.url),'utf8');
 assert.match(ui,/미검수만 보기/); assert.match(ui,/다음 미검수 기사/);
 assert.match(ui,/filterArticleReviews/); assert.match(ui,/isArticleReviewComplete/);
 assert.match(ui,/scrollIntoView/); assert.match(ui,/localStorage/);
 assert.doesNotMatch(ui,/fetch\(['\"]https?:/);
});
