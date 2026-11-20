import test from 'node:test';
import assert from 'node:assert/strict';
import { youtubeId, discoveryVideos, resolveYoutubeCandidates } from '../scripts/sync-discovery-videos.mjs';

test('extracts YouTube IDs from watch, short, shorts and embed links',()=>{
 assert.equal(youtubeId('https://www.youtube.com/watch?v=abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtu.be/abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtube.com/shorts/abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtube.com/embed/abcdefghijk'),'abcdefghijk');
});
test('news discovered YouTube candidates become schema-shaped video records',()=>{
 const [video]=discoveryVideos([{title:'Haewon clip',url:'https://youtu.be/abcdefghijk',description:'clip',sourceName:'News RSS',discoveredAt:'2026-11-20T12:00:00Z'}],'2026-11-21T00:00:00Z');
 assert.equal(video.id,'abcdefghijk');
 assert.equal(video.sourceId,'news-discovery-youtube');
 assert.equal(video.thumbnailUrl,'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg');
 assert.equal(video.publishedAt,'2026-11-20T12:00:00.000Z');
 assert.equal(video.relevance,true);
});
test('non-YouTube candidates are not copied to video archive',()=>{
 assert.deepEqual(discoveryVideos([{title:'News',url:'https://example.com/news'}]),[]);
});

test('Google News wrapper redirects are resolved to YouTube originals',async()=>{
 const items=[{title:'MBC Haewon fancam - YouTube',url:'https://news.google.com/rss/articles/example'}];
 const resolved=await resolveYoutubeCandidates(items,async()=>({url:'https://www.youtube.com/watch?v=abcdefghijk'}));
 assert.equal(resolved.length,1);
 assert.equal(resolved[0].url,'https://www.youtube.com/watch?v=abcdefghijk');
});
