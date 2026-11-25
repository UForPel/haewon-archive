import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRss,parseBingNewsRss,mergeCandidates,newsFeedUrl,relevanceScore,collectFeeds,enrichThumbnails} from '../scripts/collect-news.mjs';
import {hasExplicitPublisherArticleUrl} from '../js/discovery-kind.mjs';
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


test('X profile URLs remain discovery candidates but are not verified publisher articles',()=>{
 const profileUrl='https://x.com/NMlXX_Haewon';
 const xml='<rss><channel><item><title>NMIXX HAEWON profile</title><link>'+profileUrl+'</link><description>Public profile</description></item></channel></rss>';
 const [item]=parseRss(xml,'Haewon');
 assert.equal(item.url,profileUrl);
 assert.equal(item.publisherArticleUrl,'');
 assert.equal(hasExplicitPublisherArticleUrl(item),false);
});

test('X status URLs remain candidates but are not verified publisher articles',()=>{
 const statusUrl='https://x.com/nmixxiee/status/2112842130163114298';
 const xml='<rss><channel><item><title>NMIXX Haewon public post</title><link>'+statusUrl+'</link><description>Public post</description></item></channel></rss>';
 const [item]=parseRss(xml,'Haewon');
 assert.equal(item.url,statusUrl);
 assert.equal(item.publisherArticleUrl,'');
 assert.equal(hasExplicitPublisherArticleUrl(item),false);
});

test('merging an existing X profile candidate clears its invalid publisher article URL',()=>{
 const profileUrl='https://x.com/NMlXX_Haewon';
 const [merged]=mergeCandidates(
  [{id:'profile',title:'NMIXX HAEWON profile',url:profileUrl,publisherArticleUrl:profileUrl}],
  [{id:'profile',title:'NMIXX HAEWON profile',url:profileUrl,publisherArticleUrl:''}]
 );
 assert.equal(merged.url,profileUrl);
 assert.equal(merged.publisherArticleUrl,'');
 const [existingOnly]=mergeCandidates([{id:'profile',title:'NMIXX HAEWON profile',url:profileUrl,publisherArticleUrl:profileUrl}],[]);
 assert.equal(existingOnly.publisherArticleUrl,'');
});

test('thumbnail enrichment never fetches an X profile URL as an article',async()=>{
 let calls=0;
 const profileUrl='https://x.com/NMlXX_Haewon';
 const item={id:'profile',title:'NMIXX HAEWON profile',url:profileUrl,publisherArticleUrl:profileUrl,thumbnailUrl:''};
 const result=await enrichThumbnails([item],{fetchImpl:async()=>{calls++;return new Response('');}});
 assert.equal(result.attempted,0);
 assert.equal(calls,0);
 assert.equal(result.items[0].url,profileUrl);
});

test('Bing RSS X status candidates are retained but excluded from publisher metadata enrichment',async()=>{
 const postUrl='https://x.com/nmixxiee/status/2112842130163114298';
 const discoveryUrl='https://www.bing.com/news/apiclick.aspx?url='+encodeURIComponent(postUrl);
 const xml='<rss><channel><item><title>NMIXX Haewon public post</title><link>'+discoveryUrl+'</link><description>Public social post</description></item></channel></rss>';
 const [item]=parseBingNewsRss(xml,'NMIXX Haewon magazine','2026-11-25T00:00:00.000Z');
 assert.equal(item.url,postUrl);
 assert.equal(item.publisherArticleUrl,'');
 assert.equal(hasExplicitPublisherArticleUrl(item),false);
 const [merged]=mergeCandidates([{...item,publisherArticleUrl:postUrl}], [item]);
 assert.equal(merged.url,postUrl);
 assert.equal(merged.publisherArticleUrl,'');
 let fetchCount=0;
 const enriched=await enrichThumbnails([item],{fetchImpl:async()=>{fetchCount++;return new Response('<meta property="og:image" content="https://pbs.twimg.com/example.jpg">');},now:'2026-11-25T00:00:00.000Z'});
 assert.equal(enriched.attempted,0);
 assert.equal(fetchCount,0);
 assert.equal(enriched.items[0].thumbnailUrl,'');
});
