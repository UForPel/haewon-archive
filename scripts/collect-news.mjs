import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const SEARCH_PACKS = [
  ['오해원 NMIXX','해원 엔믹스','NMIXX Haewon','Haewon NMIXX news'],
  ['Haewon NMIXX interview','오해원 인터뷰','NMIXX Haewon magazine','Haewon NMIXX brand'],
  ['오해원 방송','해원 엔믹스 기사','NMIXX Haewon appearance','Haewon NMIXX event']
];
export const SEARCHES = SEARCH_PACKS.flat();
export function getDailySearches(day = new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'})) {
  const dayNumber = Math.floor(Date.parse(day+'T00:00:00Z') / 86400000);
  return SEARCH_PACKS[((dayNumber % SEARCH_PACKS.length)+SEARCH_PACKS.length)%SEARCH_PACKS.length];
}
function decode(value=''){
 return value.replace(/<!\[CDATA\[(.*?)\]\]>/gs,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();
}
function tag(raw,tagName){
 const m=raw.match(new RegExp('<'+tagName+'>([\\s\\S]*?)</'+tagName+'>','i'));
 return m?decode(m[1]):'';
}
export function extractRssThumbnail(raw='',description=''){
 const candidates=[];
 for(const tag of raw.matchAll(/<(?:media:thumbnail|media:content|enclosure)\b[^>]*>/gi)){
  const attrs=tag[0];
  const url=attrs.match(/\burl=["']([^"']+)["']/i)?.[1]||attrs.match(/\bhref=["']([^"']+)["']/i)?.[1]||'';
  const type=attrs.match(/\btype=["']([^"']+)["']/i)?.[1]||'';
  if(!type||/^image\//i.test(type))candidates.push(decode(url));
 }
 const text=decode(description||raw);
 for(const match of text.matchAll(/<(?:img|source)\b[^>]*>/gi)){
  const attrs=match[0];
  const src=attrs.match(/\b(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["']/i)?.[1]||attrs.match(/\bsrcset=["']([^"']+)["']/i)?.[1]?.split(',')[0]?.trim().split(/\s+/)[0]||'';
  candidates.push(decode(src));
 }
 for(const candidate of candidates){
  try{const url=new URL(candidate);if(url.protocol==='https:'&&!/(?:logo|avatar|icon|favicon)/i.test(url.pathname))return url.href;}catch{}
 }
 return '';
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
  return {id,title,url,publishedAt,description:description.slice(0,1200),thumbnailUrl:extractRssThumbnail(raw,description),sourceName:source,discoverySource:'google-news-rss',query,discoveredAt:now,status:'candidate',relevanceScore:relevanceScore(title,description)};
 }).filter(Boolean);
 return items;
}
export function extractOpenGraphImage(html=''){
 const metas=[...String(html).matchAll(/<meta\b[^>]*>/gi)].map(m=>m[0]);
 for(const meta of metas){
  const property=meta.match(/\b(?:property|name)=["'](?:og:image|twitter:image|twitter:image:src)["']/i);
  if(!property)continue;
  const content=meta.match(/\bcontent=["']([^"']+)["']/i)?.[1]||'';
  try{const url=new URL(decode(content));if(url.protocol==='https:'&&!/(?:logo|avatar|icon|favicon)/i.test(url.pathname))return url.href;}catch{}
 }
 return '';
}
export async function enrichThumbnails(items,{fetchImpl=fetch,limit=12,timeoutMs=5000,concurrency=3,offset=0}={}){
 const missing=items.filter(item=>!item.thumbnailUrl&&/^https:\/\/news\.google\.com\//i.test(item.url||''));
 const start=missing.length?Math.abs(Number(offset)||0)%missing.length:0;
 const targets=Array.from({length:Math.min(limit,missing.length)},(_,index)=>missing[(start+index)%missing.length]);
 const results=new Array(targets.length);let cursor=0;
 async function worker(){while(true){const index=cursor++;if(index>=targets.length)return;const item=targets[index];try{
  const response=await fetchImpl(item.url,{method:'GET',redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; HaewonArchiveBot/0.2; thumbnail metadata)'},signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const image=extractOpenGraphImage(await response.text());
  results[index]={id:item.id,thumbnailUrl:image,status:image?'found':'missing'};
 }catch(error){results[index]={id:item.id,thumbnailUrl:'',status:'failed',error:String(error?.message||error)};}}
 }
 await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},worker));
 const byId=new Map(results.filter(r=>r?.thumbnailUrl).map(r=>[r.id,r.thumbnailUrl]));
 const enriched=items.map(item=>item.thumbnailUrl||!byId.has(item.id)?item:{...item,thumbnailUrl:byId.get(item.id)});
 return {items:enriched,attempted:targets.length,found:byId.size,missing:results.filter(r=>r?.status==='missing').length,failed:results.filter(r=>r?.status==='failed').length,results};
}
export function canonicalCandidateUrl(value){
 try{
  const url=new URL(String(value||''));
  if(!/^https?:$/.test(url.protocol))return '';
  url.hostname=url.hostname.toLowerCase().replace(/^www\./,'');
  url.hash='';
  for(const key of [...url.searchParams.keys()])if(/^(utm_|fbclid|gclid|ref|source)/i.test(key))url.searchParams.delete(key);
  url.searchParams.sort();
  return url.toString().replace(/\/$/,'');
 }catch{return ''}
}
export function canonicalCandidateTitle(value=''){
 return String(value||'').replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').normalize('NFKC').toLocaleLowerCase().replace(/\b(?:youtube|youtu\.be)\b/g,'').replace(/[\p{P}\p{S}\s]+/gu,'').trim();
}
export function mergeCandidates(existing,incoming){
 const map=new Map();
 for(const item of [...existing,...incoming]){
  const titleKey=canonicalCandidateTitle(item?.title);
  const urlKey=canonicalCandidateUrl(item?.url);
  const key=titleKey.length>=32?'title:'+titleKey:(urlKey?'url:'+urlKey:'');
  if(item?.url&&key&&!map.has(key))map.set(key,item);
 }
 return [...map.values()].sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
}
export function newsFeedUrl(query){return 'https://news.google.com/rss/search?q='+encodeURIComponent(query)+'&hl=ko&gl=KR&ceid=KR:ko';}
export async function collectFeeds({queries=getDailySearches(),fetchImpl=fetch,now=new Date().toISOString()}={}){
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
 const queriesList=getDailySearches();
 const {incoming,failures,queries,successfulQueries}=await collectFeeds({queries:queriesList,now});

 if(successfulQueries===0){
  await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:queriesList.map(query=>({query,candidates:0,uniqueCandidates:0})),requestedQueries:queries,successfulQueries,failedQueries:failures.map(x=>({query:x.query,error:x.error})),fetched:0,uniqueIncoming:0,added:0,totalCandidates:existing.length},null,2)+'\n');
  console.warn(JSON.stringify({status:'skipped',reason:'all-news-feeds-unavailable',queries,successfulQueries,failedQueries:failures,existingCandidatesPreserved:existing.length}));
  return;
 }
 const incomingEnriched=thumbnailEnrichment.items;
 const merged=mergeCandidates(existing,incomingEnriched);
 const existingUrls=new Set(existing.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const uniqueIncoming=new Set(incoming.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const added=[...uniqueIncoming].filter(url=>!existingUrls.has(url)).length;
 const perQuery=queriesList.map(query=>({query,candidates:incoming.filter(item=>item.query===query).length,uniqueCandidates:new Set(incoming.filter(item=>item.query===query).map(item=>item.url.toLowerCase())).size}));
 await writeFile(path,JSON.stringify(mergedWithThumbnails,null,2)+'\n');
 await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:perQuery,requestedQueries:queries,successfulQueries,failedQueries:failures.map(x=>({query:x.query,error:x.error})),fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,thumbnailEnrichment:{attempted:thumbnailEnrichment.attempted,found:thumbnailEnrichment.found,missing:thumbnailEnrichment.missing,failed:thumbnailEnrichment.failed},totalCandidates:merged.length},null,2)+'\n');
 console.log(JSON.stringify({queries,successfulQueries,failedQueries:failures,fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,duplicates:incoming.length-uniqueIncoming.size,thumbnailEnrichment,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});