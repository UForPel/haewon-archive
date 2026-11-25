import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRss,mergeCandidates,newsFeedUrl,relevanceScore,collectFeeds,getDailySearches,SEARCH_PACKS,SEARCHES,summarizeQueryPerformance} from '../scripts/collect-news.mjs';
const fixture='<rss><channel><item><title>오해원 인터뷰</title><link>https://news.example/a</link><pubDate>Thu, 20 Nov 2026 02:00:00 GMT</pubDate><description>Haewon interview</description><source>News</source><media:thumbnail url="https://img.example/thumb.jpg" /></item></channel></rss>';
test('RSS에서 제목, 링크, 날짜, 검색 출처 메타데이터를 추출한다',()=>{const [item]=parseRss(fixture,'오해원', '2026-11-20T00:00:00Z');assert.equal(item.title,'오해원 인터뷰');assert.equal(item.url,'https://news.example/a');assert.equal(item.sourceName,'News');assert.equal(item.status,'candidate');assert.equal(item.thumbnailUrl,'https://img.example/thumb.jpg');});
test('중복 URL 후보는 하나로 합친다',()=>{const a=parseRss(fixture,'오해원')[0];assert.equal(mergeCandidates([a],[a]).length,1);});
test('검색어는 RSS URL에서 인코딩된다',()=>{assert.match(newsFeedUrl('오해원 NMIXX'),/q=%/);});
test('비 RSS를 거부한다',()=>{assert.throws(()=>parseRss('<html/>','query'),/RSS/);});

test('관련성 점수는 해원 및 NMIXX 키워드에 반응한다',()=>{assert.ok(relevanceScore('오해원 NMIXX 직캠','')>relevanceScore('일반 뉴스',''));});

test('partial feed failure does not discard successful query results',async()=>{
 const fetchImpl=async url=>decodeURIComponent(String(url)).includes('오해원')?new Response(fixture,{status:200}):new Response('',{status:503});
 const result=await collectFeeds({queries:['오해원','해원'],fetchImpl,now:'2026-11-20T00:00:00Z'});
 assert.equal(result.successfulQueries,1);
 assert.equal(result.failures.length,1);
 assert.equal(result.incoming.length,1);
});
test('all query failures are reported without throwing inside collector',async()=>{
 const result=await collectFeeds({queries:['a','b'],fetchImpl:async()=>new Response('',{status:502})});
 assert.equal(result.successfulQueries,0);
 assert.equal(result.failures.length,2);
 assert.equal(result.incoming.length,0);
});

test('news collector search list does not include fancam query',async()=>{
 const {SEARCHES}=await import('../scripts/collect-news.mjs');
 assert.ok(SEARCHES.every(query=>!/(fancam|직캠)/i.test(query)));
});

test('RSS YouTube video link is retained as a candidate with its thumbnail',()=>{const xml='<rss><channel><item><title>Haewon official stage video</title><link>https://www.youtube.com/watch?v=video123</link><description>Official clip</description><media:thumbnail url="https://img.example/youtube.jpg" /></item></channel></rss>';const [item]=parseRss(xml,'Haewon');assert.equal(item.url,'https://www.youtube.com/watch?v=video123');assert.equal(item.thumbnailUrl,'https://img.example/youtube.jpg');});

import {extractRssThumbnailCandidates,extractOpenGraphImageCandidates} from '../scripts/collect-news.mjs';
test('RSS enclosure accepts image MIME types but ignores audio',()=>{
 const xml='<item><enclosure url="https://img.example/a.jpg" type="image/jpeg"/><enclosure url="https://audio.example/a.mp3" type="audio/mpeg"/></item>';
 const candidates=extractRssThumbnailCandidates(xml);
 assert.equal(candidates.length,1);assert.equal(candidates[0].source,'enclosure');
});
test('RSS media and description images resolve relative HTTPS URLs with source priority',()=>{
 const xml='<item><media:content url="/media.jpg" medium="image"/><media:thumbnail url="https://img.example/thumb.jpg"/></item>';
 const candidates=extractRssThumbnailCandidates(xml,'<img src="/desc.jpg"/>','https://publisher.example/story');
 assert.deepEqual(candidates.map(x=>x.source),['media:thumbnail','media:content','rss-description-html']);
 assert.equal(candidates[1].url,'https://publisher.example/media.jpg');
});
test('article metadata parser extracts OG, Twitter, JSON-LD and itemprop candidates in priority order',()=>{
 const html='<meta property="og:image" content="/og.jpg"><meta name="twitter:image:src" content="https://img.example/twitter.jpg"><meta itemprop="image" content="/schema.jpg"><script type="application/ld+json">{"@type":"NewsArticle","image":["/jsonld.jpg"]}</script>';
 const candidates=extractOpenGraphImageCandidates(html,'https://publisher.example/article');
 assert.deepEqual(candidates.map(x=>x.source),['og:image','twitter:image:src','itemprop:image','jsonld:image']);
 assert.equal(candidates[0].url,'https://publisher.example/og.jpg');
});
test('image candidates reject non-HTTPS and logo-like image URLs',()=>{
 const html='<meta property="og:image" content="http://img.example/a.jpg"><meta property="og:image:secure_url" content="https://img.example/logo.png">';
 assert.deepEqual(extractOpenGraphImageCandidates(html),[]);
});

import {summarizeRssImageSignals} from '../scripts/collect-news.mjs';
test('RSS response diagnostics count image-bearing structures without storing raw feed bodies',()=>{
 const xml='<rss><channel><item><description><![CDATA[<img src="https://img.test/a.jpg"/>]]></description><media:thumbnail url="https://img.test/a.jpg"/></item><item><content:encoded><![CDATA[<img src="https://img.test/b.jpg"/>]]></content:encoded><enclosure url="https://img.test/b.jpg" type="image/jpeg"/></item></channel></rss>';
 const result=summarizeRssImageSignals(xml);
 assert.equal(result.items,2);assert.equal(result.mediaThumbnailTags,1);assert.equal(result.enclosureTags,1);
 assert.equal(result.descriptionImageTags,1);assert.equal(result.contentEncodedImageTags,1);assert.equal(result.itemsWithImageSignals,2);
});

test('news search packs rotate between twice-daily runs and expand topic coverage',()=>{
 const morning=getDailySearches('2026-11-25',0),evening=getDailySearches('2026-11-25',1);
 assert.notDeepEqual(morning,evening);
 assert.equal(SEARCH_PACKS.length,6);
 assert.ok(SEARCH_PACKS.every(pack=>pack.length===6));
 assert.equal(SEARCHES.length,36);
 assert.ok(SEARCHES.some(query=>/interview/i.test(query)));
 assert.ok(SEARCHES.some(query=>/광고|brand|campaign/i.test(query)));
 assert.ok(SEARCHES.some(query=>/방송|broadcast|radio/i.test(query)));
});

test('per-query quality metrics measure unique URLs, duplicate titles, relevance proxy and publication lag',()=>{
 const now='2026-11-25T00:00:00Z';
 const rows=[
  {query:'q1',url:'https://news.test/a?utm_source=rss',title:'오해원 인터뷰 특별 기획 기사 내용과 현장 취재를 담은 상세 보도 제목입니다 추가 취재 기록',publisherArticleUrl:'https://news.test/a',publishedAt:'2026-11-24T00:00:00Z'},
  {query:'q1',url:'https://news.test/a',title:'오해원 인터뷰 특별 기획 기사 내용과 현장 취재를 담은 상세 보도 제목입니다 추가 취재 기록',publisherArticleUrl:'',publishedAt:'2026-11-20T00:00:00Z'},
  {query:'q2',url:'https://news.test/a',title:'Haewon interview special story with additional context and a longer headline',publisherArticleUrl:'https://news.test/a',publishedAt:'2026-11-23T00:00:00Z'},
  {query:'q2',url:'https://news.test/b',title:'General unrelated article headline',publisherArticleUrl:'',publishedAt:'not-a-date'}
 ];
 const report=summarizeQueryPerformance(rows,['q1','q2'],now);
 assert.equal(report[0].candidates,2);
 assert.equal(report[0].uniqueCandidates,1);
 assert.equal(report[0].duplicateUrlOccurrences,1);
 assert.equal(report[0].duplicateTitleOccurrences,1);
 assert.equal(report[0].titleKeywordMatches,2);
 assert.equal(report[0].explicitPublisherUrls,1);
 assert.equal(report[0].crossQueryDuplicateUrls,1);
 assert.equal(report[0].medianPublicationLagHours,72);
 assert.equal(report[1].crossQueryDuplicateUrls,1);
 assert.equal(report[1].unknownDates,1);
});
