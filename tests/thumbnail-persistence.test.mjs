import test from 'node:test';
import assert from 'node:assert/strict';
import {enrichThumbnails} from '../scripts/collect-news.mjs';
import {compareThumbnailCandidates} from '../js/thumbnail-comparison.mjs';

const html='<meta property="og:image" content="https://img.example/story.jpg"><meta name="twitter:image" content="https://img.example/story-alt.jpg">';
test('metadata candidates are retained per article even when shared image assignment is rejected',async()=>{
 const items=[{id:'a',url:'https://news.google.com/a',title:'A',thumbnailUrl:''},{id:'b',url:'https://news.google.com/b',title:'B',thumbnailUrl:''}];
 const result=await enrichThumbnails(items,{fetchImpl:async()=>new Response(html,{status:200}),limit:2,concurrency:1});
 assert.equal(result.found,2);
 assert.equal(result.assigned,1);
 assert.equal(result.duplicateRejected,1);
 assert.equal(result.items[0].thumbnailMetaCandidates.length,2);
 assert.equal(result.items[1].thumbnailMetaCandidates.length,2);
 const comparison=compareThumbnailCandidates(result.items,[]);
 assert.equal(comparison.articlesCompared,2);
 assert.equal(comparison.metaOnly,2);
 assert.equal(comparison.sourceCounts['og:image'],2);
});
