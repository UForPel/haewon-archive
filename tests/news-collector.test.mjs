import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRss,mergeCandidates,newsFeedUrl,relevanceScore,collectFeeds} from '../scripts/collect-news.mjs';
const fixture='<rss><channel><item><title>오해원 인터뷰</title><link>https://news.example/a</link><pubDate>Thu, 20 Nov 2026 02:00:00 GMT</pubDate><description>Haewon interview</description><source>News</source></item></channel></rss>';
test('RSS에서 제목, 링크, 날짜, 검색 출처 메타데이터를 추출한다',()=>{const [item]=parseRss(fixture,'오해원', '2026-11-20T00:00:00Z');assert.equal(item.title,'오해원 인터뷰');assert.equal(item.url,'https://news.example/a');assert.equal(item.sourceName,'News');assert.equal(item.status,'candidate');});
test('중복 URL 후보는 하나로 합친다',()=>{const a=parseRss(fixture,'오해원')[0];assert.equal(mergeCandidates([a],[a]).length,1);});
test('검색어는 RSS URL에서 인코딩된다',()=>{assert.match(newsFeedUrl('오해원 NMIXX'),/q=%/);});
test('비 RSS를 거부한다',()=>{assert.throws(()=>parseRss('<html/>','query'),/RSS/);});
});

test('관련성 점수는 해원 및 NMIXX 키워드에 반응한다',()=>{assert.ok(relevanceScore('오해원 NMIXX 직캠','')>relevanceScore('일반 뉴스',''));});

test('partial feed failure does not discard successful query results',async()=>{
 const fetchImpl=async url=>String(url).includes('오해원')?new Response(fixture,{status:200}):new Response('',{status:503});
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
