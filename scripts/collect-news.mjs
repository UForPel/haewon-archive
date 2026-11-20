import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const SEARCHES=['오해원 NMIXX','해원 엔믹스','NMIXX Haewon','Haewon fancam'];
function decode(value=''){
 return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
}
export function parseRss(xml,query,now=new Date().toISOString()){
 if(typeof xml!=='string'||!/<rss\b/i.test(xml))throw new Error('RSS 응답이 아닙니다');
 const items=[...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(([,raw])=>{
  const get=(tag)=>{const match=raw.match(new RegExp('<'+tag+'>([\\\\s\\\\S]*?)</'+tag+'>','i'));return match?decode(match[1]):''};
  const title=get('title'),url=get('link'),pub=get('pubDate'),description=get('description'),source=get('source')||'Google News';
  if(!title||!url||!/^https:\/\/\S+/i.test(url))return null;
  const date=pub?new Date(pub):null,publishedAt=date&&!Number.isNaN(date.getTime())?date.toISOString():'';
  const id=createHash('sha256').update(url).digest('hex').slice(0,20);
  return {id,title,url,publishedAt,description:description.slice(0,1200),sourceName:source,discoverySource:'google-news-rss',query,discoveredAt:now,status:'candidate'};
 }).filter(Boolean);
 return items;
}
export function mergeCandidates(existing,incoming){
 const map=new Map();
 for(const item of [...existing,...incoming])if(item?.url&&!map.has(item.url.toLowerCase()))map.set(item.url.toLowerCase(),item);
 return [...map.values()].sort((a,b)=>(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
}
export function newsFeedUrl(query){return 'https://news.google.com/rss/search?q='+encodeURIComponent(query)+'&hl=ko&gl=KR&ceid=KR:ko';}
async function main(){
 const path=resolve(ROOT,'data/discovery.json'),existing=JSON.parse(await readFile(path,'utf8')),now=new Date().toISOString(),incoming=[];
 for(const query of SEARCHES){
  const response=await fetch(newsFeedUrl(query),{headers:{'user-agent':'HaewonArchiveBot/0.2 (public RSS index)'},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error('Google News RSS HTTP '+response.status+' for '+query);
  incoming.push(...parseRss(await response.text(),query,now));
 }
 const merged=mergeCandidates(existing,incoming);
 await writeFile(path,JSON.stringify(merged,null,2)+'\n');
 console.log(JSON.stringify({queries:SEARCHES.length,fetched:incoming.length,added:merged.length-existing.length,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});
