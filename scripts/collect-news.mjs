import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const SEARCHES=['오해원 NMIXX','해원 엔믹스','NMIXX Haewon','Haewon fancam'];
function decode(value=''){
 return value.replace(/<!\[CDATA\[(.*?)\]\]>/gs,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
}
function tag(raw,tagName){
 const m=raw.match(new RegExp('<'+tagName+'>([\\s\\S]*?)</'+tagName+'>','i'));
 return m?decode(m[1]):'';
}
export function relevanceScore(title='',description=''){
 const text=(title+' '+description).toLowerCase();
 let score=0;
 if(/오해원|haewon/i.test(text))score+=4;
 if(/해원/i.test(text))score+=2;
 if(/nmixx|엔믹스/i.test(text))score+=2;
 if(/fancam|직캠|인터뷰|interview|stage|무대|shorts|쇼츠/i.test(text))score+=1;
 return score;
}
export function parseRss(xml,query,now=new Date().toISOString()){
 if(typeof xml!=='string'||!/<rss\b/i.test(xml))throw new Error('RSS 응답이 아닙니다');
 const items=[...xml.matchAll(/<item\b[^>]*>(.*?)<\/item>/gis)].map(([,raw])=>{
  const title=tag(raw,'title'),url=tag(raw,'link'),pub=tag(raw,'pubDate'),description=tag(raw,'description'),source=tag(raw,'source')||'Google News';
  if(!title||!url||!/^https:\/\/\S+/i.test(url))return null;
  const date=pub?new Date(pub):null,publishedAt=date&&!Number.isNaN(date.getTime())?date.toISOString():'';
  const id=createHash('sha256').update(url).digest('hex').slice(0,20);
  return {id,title,url,publishedAt,description:description.slice(0,1200),sourceName:source,discoverySource:'google-news-rss',query,discoveredAt:now,status:'candidate',relevanceScore:relevanceScore(title,description)};
 }).filter(Boolean);
 return items;
}
export function mergeCandidates(existing,incoming){
 const map=new Map();
 for(const item of [...existing,...incoming])if(item?.url&&!map.has(item.url.toLowerCase()))map.set(item.url.toLowerCase(),item);
 return [...map.values()].sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
}
export function newsFeedUrl(query){return 'https://news.google.com/rss/search?q='+encodeURIComponent(query)+'&hl=ko&gl=KR&ceid=KR:ko';}
export async function collectFeeds({queries=SEARCHES,fetchImpl=fetch,now=new Date().toISOString()}={}){
 const incoming=[],failures=[];
 for(const query of queries){
  try{
   const response=await fetchImpl(newsFeedUrl(query),{headers:{'user-agent':'HaewonArchiveBot/0.2 (public RSS index)'},signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error('HTTP '+response.status);
   incoming.push(...parseRss(await response.text(),query,now));
  }catch(error){failures.push({query,error:String(error?.message||error)});}
 }
 return {incoming,failures,queries:queries.length,successfulQueries:queries.length-failures.length};
}
async function main(){
 const path=resolve(ROOT,'data/discovery.json'),existing=JSON.parse(await readFile(path,'utf8')),now=new Date().toISOString();
 const {incoming,failures,queries,successfulQueries}=await collectFeeds({now});
 if(successfulQueries===0){
  console.warn(JSON.stringify({status:'skipped',reason:'all-news-feeds-unavailable',queries,successfulQueries,failedQueries:failures,existingCandidatesPreserved:existing.length}));
  return;
 }
 const merged=mergeCandidates(existing,incoming);
 const existingUrls=new Set(existing.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const uniqueIncoming=new Set(incoming.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const added=[...uniqueIncoming].filter(url=>!existingUrls.has(url)).length;
 await writeFile(path,JSON.stringify(merged,null,2)+'\n');
 console.log(JSON.stringify({queries,successfulQueries,failedQueries:failures, fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,duplicates:incoming.length-uniqueIncoming.size,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});
