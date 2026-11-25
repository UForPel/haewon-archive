import test from 'node:test';
import assert from 'node:assert/strict';
import { OFFICIAL_CHANNEL_ID, YOUTUBE_SEARCH_QUERIES, getDailyVideoSearches, parseYoutubeSearchResponse, collectYoutubeSearch } from '../scripts/collect-youtube-search.mjs';

const item=(id,channelId=OFFICIAL_CHANNEL_ID)=>({
 id:{videoId:id},
 snippet:{title:'Haewon fancam 4K',description:'NMIXX Haewon stage',channelId,channelTitle:'Public Channel',publishedAt:'2026-11-24T10:00:00Z'}
});

test('video search rotates four bounded queries by Korea-time run slot',()=>{
 const morning=getDailyVideoSearches('2026-11-25',0),evening=getDailyVideoSearches('2026-11-25',1);
 assert.equal(YOUTUBE_SEARCH_QUERIES.length,12);
 assert.equal(morning.length,4);
 assert.equal(evening.length,4);
 assert.notDeepEqual(morning,evening);
 assert.equal(new Set([...morning,...evening]).size,8);
});

test('YouTube search results preserve channel identity and distinguish official from unverified',()=>{
 const rows=parseYoutubeSearchResponse({items:[item('abcdefghijk'),item('lmnopqrstuv','UCotherChannel')]},'2026-11-25T00:00:00Z');
 assert.equal(rows.length,2);
 assert.equal(rows[0].url,'https://www.youtube.com/watch?v=abcdefghijk');
 assert.equal(rows[0].channelId,OFFICIAL_CHANNEL_ID);
 assert.equal(rows[0].origin,'official');
 assert.equal(rows[1].origin,'unverified');
 assert.equal(rows[1].sourceId,'youtube-data-api-search');
 assert.equal(rows[1].relevance,true);
});

test('invalid IDs, missing channel identity and invalid dates are rejected',()=>{
 const rows=parseYoutubeSearchResponse({items:[
  item('short'),
  {id:{videoId:'abcdefghijk'},snippet:{title:'Missing channel',publishedAt:'2026-11-24T10:00:00Z'}},
  {id:{videoId:'lmnopqrstuv'},snippet:{title:'Bad date',channelId:'UCx',channelTitle:'X',publishedAt:'not-a-date'}}
 ]});
 assert.deepEqual(rows,[]);
});

test('collector safely skips when no API key is configured',async()=>{
 let called=false;
 const result=await collectYoutubeSearch({apiKey:'',queries:['오해원 직캠'],fetchImpl:async()=>{called=true;throw new Error('must not call')}});
 assert.equal(result.status,'skipped-no-api-key');
 assert.equal(called,false);
});

test('collector uses bounded public search parameters and parses returned videos',async()=>{
 let calls=0;
 const result=await collectYoutubeSearch({
  apiKey:'test-key',queries:['오해원 직캠'],now:'2026-11-25T00:00:00Z',
  fetchImpl:async url=>{
   calls++;
   const parsed=new URL(url);
   assert.equal(parsed.origin,'https://www.googleapis.com');
   assert.equal(parsed.pathname,'/youtube/v3/search');
   assert.equal(parsed.searchParams.get('key'),'test-key');
   assert.equal(parsed.searchParams.get('maxResults'),'50');
   assert.equal(parsed.searchParams.get('order'),'date');
   assert.equal(parsed.searchParams.get('safeSearch'),'strict');
   return new Response(JSON.stringify({items:[item('abcdefghijk')]}),{status:200,headers:{'content-type':'application/json'}});
  }
 });
 assert.equal(calls,1);
 assert.equal(result.status,'success');
 assert.equal(result.successfulQueries,1);
 assert.equal(result.incoming.length,1);
 assert.equal(result.incoming[0].collectedAt,'2026-11-25T00:00:00Z');
});

test('collector records per-query HTTP failures without exposing the API key',async()=>{
 const result=await collectYoutubeSearch({apiKey:'do-not-log',queries:['query'],fetchImpl:async()=>new Response('',{status:403})});
 assert.equal(result.status,'error');
 assert.deepEqual(result.failedQueries,[{query:'query',status:403}]);
 assert.ok(!JSON.stringify(result).includes('do-not-log'));
});
