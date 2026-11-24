import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeVideos } from './collect-youtube.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function youtubeId(value=''){
 try{
  const url=new URL(String(value||''));
  if(url.protocol!=='https:'||url.username||url.password)return '';
  const host=url.hostname.toLowerCase();
  if(host==='youtu.be'){
   const id=url.pathname.split('/').filter(Boolean)[0]||'';
   return /^[\\w-]{11}$/.test(id)?id:'';
  }
  if(!['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host))return '';
  if(url.pathname==='/watch'){
   const id=url.searchParams.get('v')||'';
   return /^[\\w-]{11}$/.test(id)?id:'';
  }
  const match=url.pathname.match(/^\\/(?:shorts|embed)\\/([\\w-]{11})(?:\\/|$)/);
  return match?.[1]||'';
 }catch{return '';}
}
export function resolveYoutubeCandidates(items=[]){
 const direct=[];
 for(const item of items){
  const explicit=[item.publisherArticleUrl,item.url].find(value=>youtubeId(value));
  if(explicit)direct.push({...item,url:explicit});
 }
 return direct;
}
export function discoveryVideos(items=[],now=new Date().toISOString()){
 return items.filter(item=>youtubeId(item.url)).map(item=>{
  const id=youtubeId(item.url);
  const publishedAt=item.publishedAt||item.discoveredAt||now;
  return {id,title:String(item.title||'YouTube 발견 링크').slice(0,500),url:'https://www.youtube.com/watch?v='+id,thumbnailUrl:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',publishedAt:new Date(publishedAt).toISOString(),description:String(item.description||'').slice(0,10000),channelName:String(item.sourceName||'뉴스 RSS 발견 링크').slice(0,200),sourceId:'news-discovery-youtube',collectedAt:now,relevance:/해원|오해원|haewon/i.test(String(item.title||item.description||''))};
 });
}
async function main(){
 const discoveryPath=resolve(ROOT,'data/discovery.json'),videosPath=resolve(ROOT,'data/videos.json');
 const discovery=JSON.parse(await readFile(discoveryPath,'utf8')),existing=JSON.parse(await readFile(videosPath,'utf8'));
 const now=new Date().toISOString(),explicitYoutubeUrls=resolveYoutubeCandidates(discovery),incoming=discoveryVideos(explicitYoutubeUrls,now),merged=mergeVideos(existing,incoming);
 const existingIds=new Set(existing.map(item=>item.id)),added=merged.filter(item=>!existingIds.has(item.id)).length;
 await writeFile(videosPath,JSON.stringify(merged,null,2)+'\n');
 console.log(JSON.stringify({source:'news-discovery-youtube',discovered:incoming.length,added,total:merged.length,explicitYoutubeUrls:explicitYoutubeUrls.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
