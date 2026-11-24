import test from 'node:test';
import assert from 'node:assert/strict';
import {bingNewsFeedUrl,extractBingNewsArticleUrl,parseBingNewsRss,mergeCandidates} from '../scripts/collect-news.mjs';
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
