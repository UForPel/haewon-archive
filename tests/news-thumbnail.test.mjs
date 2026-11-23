import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRssThumbnail, parseRss, canonicalCandidateUrl, mergeCandidates } from '../scripts/collect-news.mjs';

test('extracts image from media thumbnail metadata',()=>{
 assert.equal(extractRssThumbnail('<media:thumbnail url="https://cdn.example/news.jpg"/>'),'https://cdn.example/news.jpg');
});
test('extracts image from decoded RSS description markup',()=>{
 assert.equal(extractRssThumbnail('', '&lt;img src=&quot;https://cdn.example/story.jpg&quot;&gt;'),'https://cdn.example/story.jpg');
});
test('rejects insecure and logo-like thumbnail candidates',()=>{
 assert.equal(extractRssThumbnail('<media:thumbnail url="http://cdn.example/a.jpg"/>'),'');
 assert.equal(extractRssThumbnail('<media:thumbnail url="https://cdn.example/logo.png"/>'),'');
});
test('parseRss includes extracted thumbnail from item description',()=>{
 const xml='<rss><channel><item><title>Haewon news</title><link>https://news.example/article</link><description><![CDATA[<img src="https://cdn.example/photo.jpg">]]></description></item></channel></rss>';
 const [item]=parseRss(xml,'test query','2026-11-24T00:00:00Z');
 assert.equal(item.thumbnailUrl,'https://cdn.example/photo.jpg');
});

test('canonical URL removes tracking parameters and fragments for deduplication',()=>{
 assert.equal(canonicalCandidateUrl('https://www.example.com/a?utm_source=x&b=2#section'),'https://example.com/a?b=2');
 const merged=mergeCandidates([{url:'https://www.example.com/story?utm_campaign=one',title:'Story'}],[{url:'https://example.com/story?utm_source=two',title:'Story updated'}]);
 assert.equal(merged.length,1);
 assert.equal(merged[0].title,'Story');
});
