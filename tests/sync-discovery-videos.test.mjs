import test from 'node:test';
import assert from 'node:assert/strict';
import { youtubeId, discoveryVideos, resolveYoutubeCandidates } from '../scripts/sync-discovery-videos.mjs';

test('extracts YouTube IDs only from explicit HTTPS YouTube watch, short, shorts and embed URLs',()=>{
 assert.equal(youtubeId('https://www.youtube.com/watch?v=abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtu.be/abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtube.com/shorts/abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('https://youtube.com/embed/abcdefghijk'),'abcdefghijk');
 assert.equal(youtubeId('http://youtu.be/abcdefghijk'),'');
 assert.equal(youtubeId('https://example.com/watch?v=abcdefghijk'),'');
 assert.equal(youtubeId('https://news.google.com/rss/articles/abcdefghijk'),'');
});

test('news discovered YouTube candidates become schema-shaped video records',()=>{
 const [video]=discoveryVideos([{title:'Haewon clip',url:'https://youtu.be/abcdefghijk',description:'clip',sourceName:'News RSS',discoveredAt:'2026-11-20T12:00:00Z'}],'2026-11-21T00:00:00Z');
 assert.equal(video.id,'abcdefghijk');
 assert.equal(video.sourceId,'news-discovery-youtube');
 assert.equal(video.origin,'unverified');
 assert.equal(video.thumbnailUrl,'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg');
 assert.equal(video.publishedAt,'2026-11-20T12:00:00.000Z');
 assert.equal(video.relevance,true);
});

test('non-YouTube candidates are not copied to video archive',()=>{
 assert.deepEqual(discoveryVideos([{title:'News',url:'https://example.com/news'}]),[]);
});

test('only explicit HTTPS YouTube URLs from public item metadata are accepted',()=>{
 const items=[
  {id:'wrapper',title:'Haewon fancam - YouTube',url:'https://news.google.com/rss/articles/opaque-token'},
  {id:'direct',title:'Direct YouTube link',url:'https://www.youtube.com/watch?v=abcdefghijk'},
  {id:'publisher',title:'Publisher metadata URL',url:'https://news.google.com/rss/articles/another-token',publisherArticleUrl:'https://youtu.be/lmnopqrstuv'},
  {id:'insecure',title:'Insecure direct URL',url:'http://youtu.be/abcdefghijk'}
 ];
 const accepted=resolveYoutubeCandidates(items);
 assert.deepEqual(accepted.map(item=>[item.id,item.url]),[
  ['direct','https://www.youtube.com/watch?v=abcdefghijk'],
  ['publisher','https://youtu.be/lmnopqrstuv']
 ]);
});

test('candidate resolver contains no HTTP fetch or redirect-following behavior',async()=>{
 const source=await (await import('node:fs/promises')).readFile(new URL('../scripts/sync-discovery-videos.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/fetchImpl|redirect:\\s*['"]follow['"]/);
});
