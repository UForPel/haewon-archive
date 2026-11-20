import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeVideos } from './collect-youtube.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function youtubeId(url=''){
 const value=String(url||'');
 return value.match(/[?&]v=([\w-]{11})/)?.[1]||value.match(/youtu\.be\/([\w-]{11})/)?.[1]||value.match(/youtube\.com\/(?:shorts|embed)\/([\w-]{11})/)?.[1]||'';
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
 const now=new Date().toISOString(),incoming=discoveryVideos(discovery,now),merged=mergeVideos(existing,incoming);
 const existingIds=new Set(existing.map(item=>item.id)),added=merged.filter(item=>!existingIds.has(item.id)).length;
 await writeFile(videosPath,JSON.stringify(merged,null,2)+'\n');
 console.log(JSON.stringify({source:'news-discovery-youtube',discovered:incoming.length,added,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
