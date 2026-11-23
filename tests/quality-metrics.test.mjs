import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCollection, auditLinks } from '../scripts/quality-metrics.mjs';
test('source coverage and classification metrics are based on candidate data',()=>{
 const report=summarizeCollection({videos:[{id:'v1'}],discovery:[{title:'Haewon official interview',sourceName:'A',url:'https://example.com/a',thumbnailUrl:'https://example.com/t',publishedAt:'2026-11-23'},{title:'Haewon event',sourceName:'A',url:'https://example.com/b'}],newsStatus:{requestedQueries:4,successfulQueries:3,fetched:5,uniqueIncoming:4,added:2,totalCandidates:10},videoStatus:{status:'success'},reviews:[]});
 assert.equal(report.sources[0].source,'A');assert.equal(report.sources[0].items,2);assert.equal(report.sources[0].thumbnailCoverage,50);assert.equal(report.collection.newsQuerySuccessRate,75);assert.equal(report.sourceCollectionStatus[0].successRate,75);assert.equal(report.sourceCollectionStatus[1].successRate,100);assert.equal(report.collection.videosTotal,1);assert.equal(report.collection.duplicateGroupsCurrent,2);assert.equal(report.collection.duplicateItemsCollapsedCurrent,0);assert.equal(report.classification.reviewedSamples,0);assert.equal(report.classification.accuracy,null);assert.equal(report.classification.accuracyLabel,'not measured (no category review labels)');
});
test('link audit counts response codes and reports broken links',async()=>{
 const report=await auditLinks([{url:'https://good.test',thumbnailUrl:'https://bad.test/thumb'}],{fetchImpl:async url=>({status:url.includes('bad')?404:200}),limit:5});
 assert.equal(report.checked,2);assert.equal(report.sampledItems,1);assert.equal(report.broken.length,1);assert.equal(report.rateLimited,0);assert.equal(report.unreachable,0);assert.equal(report.thumbnailMissing,0);assert.equal(report.broken[0].status,404);
});
test('429 rate limits are not counted as broken URLs',async()=>{const report=await auditLinks([{url:'https://limited.test'}],{fetchImpl:async()=>({status:429})});assert.equal(report.broken.length,0);assert.equal(report.rateLimited,1);});
test('link audit reports network errors without crashing',async()=>{
 const report=await auditLinks([{url:'https://err.test'}],{fetchImpl:async()=>{throw new Error('network');}});
 assert.equal(report.broken.length,0);assert.equal(report.unreachable,1);assert.match(report.results[0].error,/network/);
});

test('review metrics expose exact-label and per-category agreement',()=>{const report=summarizeCollection({discovery:[{title:'Haewon interview'}],reviews:[{title:'Haewon interview',expectedCategory:'interview'}]});assert.equal(report.classification.accuracy,100);assert.equal(report.classification.exactSingleLabelAccuracy,100);assert.equal(report.classification.perCategoryReview.interview.accuracy,100);});
test('duplicate comparison uses normalized headline groups',()=>{const report=summarizeCollection({discovery:[{title:'Same headline — a sufficiently long news article about Haewon',url:'https://news.google.com/rss/articles/a'},{title:'Same headline a sufficiently long news article about Haewon',url:'https://news.google.com/rss/articles/b'}]});assert.equal(report.collection.newsCandidatesTotal,2);assert.equal(report.collection.duplicateGroupsCurrent,1);assert.equal(report.collection.duplicateItemsCollapsedCurrent,1);assert.equal(report.collection.deduplicationComparison.before,2);assert.equal(report.collection.deduplicationComparison.after,1);});