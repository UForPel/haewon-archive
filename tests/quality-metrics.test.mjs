import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCollection, auditLinks, summarizeThumbnailUrls, auditThumbnailResponses, summarizeThumbnailEnrichmentByHost } from '../scripts/quality-metrics.mjs';
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
test('quality report uses incoming collection dedupe before-after comparison',()=>{const report=summarizeCollection({discovery:[{title:'A candidate headline long enough for title matching',url:'https://news.google.com/rss/articles/a'}],newsStatus:{deduplicationComparison:{before:10,after:7,collapsed:3,method:'title-first'}}});assert.equal(report.collection.deduplicationComparison.before,10);assert.equal(report.collection.deduplicationComparison.after,7);assert.equal(report.collection.deduplicationComparison.collapsed,3);});
test('thumbnail audit reports repeated URLs and host distribution without treating variants as duplicates',()=>{const report=summarizeThumbnailUrls([{thumbnailUrl:'https://img.example/a.jpg'},{thumbnailUrl:'https://img.example/a.jpg#fragment'},{thumbnailUrl:'https://cdn.example/b.jpg'},{thumbnailUrl:''}]);assert.equal(report.items,4);assert.equal(report.withThumbnail,3);assert.equal(report.missing,1);assert.equal(report.uniqueThumbnailUrls,2);assert.equal(report.repeatedUrlGroups,1);assert.equal(report.repeatedItems,1);assert.equal(report.hosts.length,2);});

test('thumbnail response audit identifies broken, non-image and valid image responses',async()=>{
 const report=await auditThumbnailResponses([{thumbnailUrl:'https://ok.test/a.jpg'},{thumbnailUrl:'https://text.test/page'},{thumbnailUrl:'https://bad.test/a.png'}],{fetchImpl:async url=>({status:url.includes('bad')?404:200,headers:{get:()=>url.includes('text')?'text/html':'image/jpeg'}})});
 assert.equal(report.checked,3);assert.equal(report.nonImage.length,1);assert.equal(report.broken.length,1);assert.equal(report.results.find(row=>row.url.includes('ok')).isImage,true);
});
test('thumbnail heuristic flags repeated URLs and obvious logo-like path hints without claiming visual certainty',()=>{
 const report=summarizeThumbnailUrls([{thumbnailUrl:'https://img.test/logo.png'},{thumbnailUrl:'https://img.test/logo.png'},{thumbnailUrl:'https://cdn.test/photo.jpg'},{thumbnailUrl:''}]);
 assert.equal(report.repeatedUrlGroups,1);assert.equal(report.repeatedItems,1);assert.equal(report.heuristicFlaggedUrls,1);assert.ok(report.heuristicFlags[0].flags.includes('name-suggests-logo-icon'));
});

test('thumbnail audit warns when one image URL dominates a sample',()=>{const report=summarizeThumbnailUrls(Array.from({length:10},(_,i)=>({thumbnailUrl:i<8?'https://img.test/shared.jpg':'https://img.test/unique'+i+'.jpg'})));assert.equal(report.dominantThumbnailCount,8);assert.equal(report.dominantThumbnailShare,80);assert.equal(report.concentrationWarning,true);});
test('thumbnail audit does not warn for evenly distributed small samples',()=>{const report=summarizeThumbnailUrls([{thumbnailUrl:'https://img.test/a.jpg'},{thumbnailUrl:'https://img.test/b.jpg'},{thumbnailUrl:'https://img.test/c.jpg'},{thumbnailUrl:'https://img.test/d.jpg'}]);assert.equal(report.concentrationWarning,false);});


test('collection quality metrics retain thumbnail assignment and duplicate rejection outcomes',()=>{const report=summarizeCollection({newsStatus:{thumbnailEnrichment:{attempted:12,found:12,assigned:1,duplicateRejected:11,missing:0,failed:0}}});assert.equal(report.collection.thumbnailEnrichment.assigned,1);assert.equal(report.collection.thumbnailEnrichment.duplicateRejected,11);});


test('quality metrics include thumbnail provenance counts and per-attempt source candidates',()=>{const report=summarizeCollection({discovery:[{thumbnailUrl:'https://cdn.test/rss.jpg',thumbnailSource:'media:thumbnail'},{thumbnailUrl:'https://cdn.test/og.jpg',thumbnailSource:'og:image'},{thumbnailUrl:'https://cdn.test/old.jpg'}],newsStatus:{thumbnailEnrichment:{attempted:2,found:2,assigned:1,duplicateRejected:1,missing:0,failed:0,results:[{id:'a',status:'assigned',candidate:{url:'https://cdn.test/og.jpg',source:'og:image'}},{id:'b',status:'duplicate-rejected',candidate:{url:'https://cdn.test/og.jpg',source:'og:image'}}]}}});assert.equal(report.thumbnailProvenance.assignedBySource['media:thumbnail'],1);assert.equal(report.thumbnailProvenance.assignedBySource['og:image'],1);assert.equal(report.thumbnailProvenance.assignedBySource['unverified-legacy'],1);assert.equal(report.thumbnailProvenance.assignedTotal,3);assert.equal(report.thumbnailProvenance.unverifiedLegacyAssignments,1);assert.equal(report.thumbnailProvenance.missingThumbnailCount,0);assert.equal(report.thumbnailProvenance.sourceProvenanceCoverage,67);assert.equal(report.collection.thumbnailEnrichment.results.length,2);assert.equal(report.collection.thumbnailEnrichment.results[1].status,'duplicate-rejected');});

test('article URL provenance separates publisher, final, source-site and discovery hosts',()=>{
 const report=summarizeCollection({discovery:[
  {id:'g',title:'Google wrapper story',url:'https://news.google.com/rss/articles/opaque',sourceUrl:'https://publisher.example/',discoveryUrl:'https://news.google.com/rss/articles/opaque',thumbnailMetaFetch:{resolvedArticleHost:'news.google.com',status:'wrapper-only'}},
  {id:'b',title:'Bing direct story',url:'https://publisher.example/story/1',publisherArticleUrl:'https://publisher.example/story/1',publisherHost:'publisher.example',discoverySource:'bing-news-rss',discoveryUrl:'http://www.bing.com/news/apiclick.aspx?url=x',candidateSource:'bing-news-rss-explicit-url-param',candidateSources:[{source:'bing-news-rss-explicit-url-param'}],thumbnailMetaFetch:{resolvedArticleHost:'www.publisher.example'}}
 ],newsStatus:{bingSuccessfulQueries:4,bingFailedQueries:[],bingCandidates:1}});
 assert.equal(report.articleUrlProvenance.itemsWithPublisherArticleUrl,1);
 assert.equal(report.articleUrlProvenance.bingNewsItems,1);
 assert.equal(report.articleUrlProvenance.candidateSourceCounts['bing-news-rss-explicit-url-param'],1);
 assert.equal(report.articleUrlProvenance.publisherHosts['publisher.example'],1);
 assert.equal(report.articleUrlProvenance.finalHosts['www.publisher.example'],1);
 assert.equal(report.articleUrlProvenance.finalHosts['news.google.com'],undefined);
 assert.equal(report.articleUrlProvenance.wrapperOnlyMetadataHosts['news.google.com'],1);
 assert.equal(report.articleUrlProvenance.sourceSiteHosts['publisher.example'],1);
 assert.equal(report.articleUrlProvenance.discoveryWrapperHosts['www.bing.com'],1);
 assert.equal(report.collection.bingNewsQueriesSuccessful,4);
 assert.equal(report.collection.bingNewsCandidates,1);
});

test('publisher metadata diagnostics aggregate attempts, outcomes and final hosts by publisher',()=>{
 const rows=summarizeThumbnailEnrichmentByHost([
  {publisherHost:'news.example',thumbnailMetaFetch:{status:'assigned',resolvedArticleHost:'cdn.example',fetchedAt:'2026-11-24T00:00:00Z'}},
  {publisherHost:'news.example',thumbnailMetaFetch:{status:'failed',errorCode:'forbidden',resolvedArticleHost:'news.example'}},
  {publisherHost:'other.example',thumbnailMetaFetch:{status:'missing',resolvedArticleHost:'other.example'}}
 ]);
 assert.equal(rows[0].host,'news.example');assert.equal(rows[0].attempted,2);assert.equal(rows[0].assigned,1);assert.equal(rows[0].failed,1);assert.equal(rows[0].errorCodes.forbidden,1);assert.equal(rows[0].finalHosts['cdn.example'],1);
 assert.equal(rows[1].missing,1);
});

test('publisher metadata assignment rate recognizes legacy persisted article provenance',()=>{
 const rows=summarizeThumbnailEnrichmentByHost([
  {publisherHost:'news.example',thumbnailUrl:'https://cdn.example/a.jpg',thumbnailProvenance:{articleUrl:'https://news.example/a'},thumbnailMetaFetch:{status:'found',resolvedArticleUrl:'https://news.example/a'}},
  {publisherHost:'news.example',thumbnailMetaFetch:{status:'found',resolvedArticleUrl:'https://news.example/b'}}
 ]);
 assert.equal(rows[0].attempted,2);assert.equal(rows[0].found,2);assert.equal(rows[0].assigned,1);
 assert.equal(rows[0].successRate,50);assert.equal(rows[0].candidateRate,100);assert.equal(rows[0].assignmentRate,50);
});


test('source metrics distinguish discovery links from explicit publisher article URLs',()=>{const report=summarizeCollection({discovery:[{title:'Google wrapper',sourceName:'Google News',url:'https://news.google.com/rss/articles/opaque',sourceUrl:'https://publisher.example/'},{title:'Direct publisher article',sourceName:'Bing News',url:'https://publisher.example/story',publisherArticleUrl:'https://publisher.example/story'}]});const google=report.sources.find(row=>row.source==='Google News'),bing=report.sources.find(row=>row.source==='Bing News');assert.equal(google.urlCoverage,100);assert.equal(google.publisherArticleUrlCoverage,0);assert.equal(bing.urlCoverage,100);assert.equal(bing.publisherArticleUrlCoverage,100);assert.equal(report.articleUrlProvenance.itemsWithPublisherArticleUrl,1);});
test('thumbnail provenance excludes missing images from unknown-source counts',()=>{const report=summarizeCollection({discovery:[{thumbnailUrl:'https://cdn.test/known.jpg',thumbnailSource:'og:image'},{thumbnailUrl:'https://cdn.test/legacy.jpg'},{thumbnailUrl:''}]});assert.deepEqual(report.thumbnailProvenance.assignedBySource,{'og:image':1,'unverified-legacy':1});assert.equal(report.thumbnailProvenance.assignedTotal,2);assert.equal(report.thumbnailProvenance.unverifiedLegacyAssignments,1);assert.equal(report.thumbnailProvenance.missingThumbnailCount,1);assert.equal(report.thumbnailProvenance.sourceProvenanceCoverage,50);});
