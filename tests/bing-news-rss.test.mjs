import test from 'node:test';
import assert from 'node:assert/strict';
import {bingNewsFeedUrl,extractBingNewsArticleUrl,parseBingNewsRss,mergeCandidates,summarizeBingRssImageSignals} from '../scripts/collect-news.mjs';
const destination='https://publisher.example/news/haewon-story?utm_source=bing';
const wrapper='https://www.bing.com/news/apiclick.aspx?ref=FexRss&url='+encodeURIComponent(destination)+'&c=123';
test('Bing News RSS destination is accepted only from an explicit HTTPS url parameter',()=>{
 assert.equal(extractBingNewsArticleUrl(wrapper),destination);
 assert.equal(extractBingNewsArticleUrl('https://www.bing.com/news/apiclick.aspx?url='+encodeURIComponent('http://publisher.example/a')),'');
 assert.equal(extractBingNewsArticleUrl('https://www.bing.com/news/apiclick.aspx?url='+encodeURIComponent('https://www.bing.com/news/a')),'');
 assert.equal(extractBingNewsArticleUrl('https://www.bing.com/news/apiclick.aspx?ref=FexRss'),'');
 assert.match(bingNewsFeedUrl('오해원 NMIXX'),/^https:\/\/www\.bing\.com\/news\/search/);
});
test('Bing News RSS parser stores explicit article URL and full candidate provenance',()=>{
 const xml='<rss><channel><item><title>Haewon NMIXX story</title><link>'+wrapper+'</link><description>Public search result</description><pubDate>Tue, 24 Nov 2026 04:00:00 GMT</pubDate><source url="https://publisher.example/">Publisher</source></item></channel></rss>';
 const [item]=parseBingNewsRss(xml,'Haewon NMIXX','2026-11-24T04:01:00.000Z');
 assert.equal(item.publisherArticleUrl,destination);assert.equal(item.url,destination);assert.equal(item.sourceUrl,'https://publisher.example/');
 assert.equal(item.publisherHost,'publisher.example');assert.equal(item.discoveryUrl,wrapper);assert.equal(item.candidateSources[0].source,'bing-news-rss-explicit-url-param');
});
test('Bing News candidate provenance survives title-based merge with a Google wrapper candidate',()=>{
 const google={id:'g1',title:'Haewon NMIXX story with a sufficiently long matching headline',url:'https://news.google.com/rss/articles/opaque',publisherArticleUrl:'',sourceUrl:'https://publisher.example/'};
 const bing={id:'b1',title:'Haewon NMIXX story with a sufficiently long matching headline',url:destination,publisherArticleUrl:destination,candidateSources:[{source:'bing-news-rss-explicit-url-param',articleUrl:destination}],publisherHost:'publisher.example'};
 const [merged]=mergeCandidates([google],[bing]);assert.equal(merged.publisherArticleUrl,destination);assert.equal(merged.candidateSources.length,1);assert.equal(merged.publisherHost,'publisher.example');
});

test('Bing News RSS extracts only explicitly declared image candidates and preserves provenance',()=>{
 const xml='<rss><channel><item><title>Haewon NMIXX story</title><link>'+wrapper+'</link><description><![CDATA[<img src="/description.jpg"/>]]></description><content:encoded><![CDATA[<img src="content.jpg"/>]]></content:encoded><media:thumbnail url="thumb.jpg" type="image/jpeg"/><enclosure url="https://img.example/enclosure.png" type="image/png"/><enclosure url="https://audio.example/clip.mp3" type="audio/mpeg"/></item></channel></rss>';
 const [item]=parseBingNewsRss(xml,'Haewon NMIXX','2026-11-24T04:01:00.000Z');
 assert.equal(item.thumbnailUrl,'https://publisher.example/news/thumb.jpg');
 assert.equal(item.thumbnailSource,'media:thumbnail');
 assert.deepEqual(item.thumbnailCandidates.map(candidate=>candidate.source),['media:thumbnail','enclosure','rss-description-html','rss-description-html']);
 assert.equal(item.thumbnailCandidates[1].url,'https://img.example/enclosure.png');
 assert.equal(item.thumbnailCandidates[3].url,'https://publisher.example/news/content.jpg');
 assert.ok(item.thumbnailCandidates.every(candidate=>candidate.url.startsWith('https://')));
});
test('Bing RSS image diagnostics distinguish explicit article URLs from image-bearing items',()=>{
 const xml='<rss><channel><item><title>Haewon one</title><link>'+wrapper+'</link><media:thumbnail url="https://img.example/one.jpg"/></item><item><title>Haewon two</title><link>'+wrapper+'</link><description><![CDATA[<img src="https://img.example/two.jpg"/>]]></description><enclosure url="https://audio.example/a.mp3" type="audio/mpeg"/></item></channel></rss>';
 const result=summarizeBingRssImageSignals(xml);
 assert.equal(result.items,2);
 assert.equal(result.publisherArticleUrlItems,2);
 assert.equal(result.mediaThumbnailTags,1);
 assert.equal(result.enclosureTags,1);
 assert.equal(result.imageEnclosureTags,0);
 assert.equal(result.descriptionImageTags,1);
 assert.equal(result.itemsWithImageSignals,2);
});

test('Bing RSS image diagnostics do not count audio-only enclosures as image signals',()=>{
 const xml='<rss><channel><item><title>Haewon image</title><link>'+wrapper+'</link><enclosure url="https://img.example/a.jpg" type="image/jpeg"/></item><item><title>Audio only</title><link>'+wrapper+'</link><enclosure url="https://audio.example/a.mp3" type="audio/mpeg"/></item></channel></rss>';
 const result=summarizeBingRssImageSignals(xml);
 assert.equal(result.enclosureTags,2);
 assert.equal(result.imageEnclosureTags,1);
 assert.equal(result.itemsWithImageSignals,1);
});


test('Bing image diagnostics exclude X profile and post destinations from publisher article counts',()=>{
 const post='https://x.com/nmixxiee/status/2112842130163114298';
 const socialWrapper='https://www.bing.com/news/apiclick.aspx?url='+encodeURIComponent(post);
 const publisherWrapper='https://www.bing.com/news/apiclick.aspx?url='+encodeURIComponent(destination);
 const xml='<rss><channel><item><title>Social</title><link>'+socialWrapper+'</link><media:thumbnail url="https://img.example/social.jpg"/></item><item><title>Publisher</title><link>'+publisherWrapper+'</link></item></channel></rss>';
 const report=summarizeBingRssImageSignals(xml);
 assert.equal(report.items,2);
 assert.equal(report.publisherArticleUrlItems,1);
});
