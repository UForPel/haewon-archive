import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeVideos } from './collect-youtube.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const OFFICIAL_CHANNEL_ID='UCnUAyD4t2LkvW68YrDh7fDg';
export const YOUTUBE_SEARCH_QUERIES=[
 '오해원 직캠',
 'Haewon fancam NMIXX',
 'NMIXX Haewon focus cam',
 '해원 페이스캠',
 'NMIXX Haewon stage fancam',
 '오해원 4K 직캠',
 'Haewon fancam concert',
 'NMIXX Haewon fan cam',
 'Haewon NMIXX performance',
 '오해원 무대 영상',
 'NMIXX Haewon festival fancam',
 'Haewon live stage fancam'
];
const VIDEO_ID=/^[A-Za-z0-9_-]{11}$/;
const HAEWON=/오해원|해원|haewon/i;
function defaultRunSlot(){
 const hour=Number(new Date().toLocaleString('en-US',{timeZone:'Asia/Seoul',hour:'2-digit',hourCycle:'h23'}));
 return hour>=12?1:0;
}
export function getDailyVideoSearches(day=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'}),runSlot=defaultRunSlot()){
 const dayNumber=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);
 const slot=Number(runSlot)===1?1:0;
 const start=((dayNumber*2+slot)*4)%YOUTUBE_SEARCH_QUERIES.length;
 return Array.from({length:4},(_,index)=>YOUTUBE_SEARCH_QUERIES[(start+index)%YOUTUBE_SEARCH_QUERIES.length]);
}
export function parseYoutubeSearchResponse(payload,now=new Date().toISOString()){
 const rows=Array.isArray(payload?.items)?payload.items:[];
 return rows.map(row=>{
  const id=String(row?.id?.videoId||'');
  const snippet=row?.snippet||{};
  const title=String(snippet.title||'').trim();
  const channelId=String(snippet.channelId||'').trim();
  const channelName=String(snippet.channelTitle||'').trim();
  const date=Date.parse(String(snippet.publishedAt||''));
  if(!VIDEO_ID.test(id)||!title||!channelId||!channelName||!Number.isFinite(date))return null;
  const description=String(snippet.description||'').slice(0,10000);
  return {
   id,title:title.slice(0,500),url:'https://www.youtube.com/watch?v='+id,
   thumbnailUrl:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',
   publishedAt:new Date(date).toISOString(),description,channelName,channelId,
   origin:channelId===OFFICIAL_CHANNEL_ID?'official':'unverified',
   sourceId:'youtube-data-api-search',collectedAt:now,
   relevance:HAEWON.test(title+' '+description)
  };
 }).filter(Boolean);
}
export async function collectYoutubeSearch({apiKey='',queries=getDailyVideoSearches(),fetchImpl=fetch,now=new Date().toISOString()}={}){
 if(!String(apiKey||'').trim())return {status:'skipped-no-api-key',queries:queries.length,successfulQueries:0,failedQueries:[],incoming:[]};
 const incoming=[],failedQueries=[];
 let successfulQueries=0;
 for(const query of queries){
  try{
   const params=new URLSearchParams({part:'snippet',q:query,type:'video',maxResults:'50',order:'date',relevanceLanguage:'ko',regionCode:'KR',safeSearch:'strict',key:String(apiKey)});
   const response=await fetchImpl('https://www.googleapis.com/youtube/v3/search?'+params.toString(),{signal:AbortSignal.timeout(20000)});
   if(!response.ok){failedQueries.push({query,status:response.status});continue;}
   const payload=await response.json();
   if(payload?.error){failedQueries.push({query,status:Number(payload.error.code)||'api-error'});continue;}
   incoming.push(...parseYoutubeSearchResponse(payload,now));
   successfulQueries++;
  }catch(error){failedQueries.push({query,status:String(error?.name||'request-error').slice(0,80)});}
 }
 return {status:successfulQueries?'success':'error',queries:queries.length,successfulQueries,failedQueries,incoming};
}
async function main(){
 const apiKey=process.env.YOUTUBE_API_KEY||'';
 const queries=getDailyVideoSearches();
 const now=new Date().toISOString();
 const result=await collectYoutubeSearch({apiKey,queries,now});
 if(result.status==='skipped-no-api-key'){
  console.log(JSON.stringify({status:result.status,reason:'YOUTUBE_API_KEY is not configured; official public Atom feed remains active'}));
  return;
 }
 if(result.successfulQueries===0)throw new Error('YouTube Data API search failed for every query; no video data was changed.');
 const videosPath=resolve(ROOT,'data/videos.json');
 const existing=JSON.parse(await readFile(videosPath,'utf8'));
 const existingIds=new Set(existing.map(item=>item.id));
 const uniqueIncoming=result.incoming.filter(item=>!existingIds.has(item.id));
 const merged=mergeVideos(existing,uniqueIncoming);
 const added=merged.filter(item=>!existingIds.has(item.id)).length;
 if(added)await writeFile(videosPath,JSON.stringify(merged,null,2)+'\n');
 console.log(JSON.stringify({status:'success',queries:result.queries,successfulQueries:result.successfulQueries,failedQueries:result.failedQueries.length,received:result.incoming.length,added,total:merged.length,source:'youtube-data-api-search'}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
