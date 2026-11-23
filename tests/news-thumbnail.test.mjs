import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRssThumbnail, parseRss } from '../scripts/collect-news.mjs';

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
