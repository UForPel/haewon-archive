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
export function extractRssThumbnailCandidates(raw='',description=''){
 const candidates=[];
 for(const tag of raw.matchAll(/<(?:media:thumbnail|media:content|enclosure)\b[^>]*>/gi)){
  const attrs=tag[0],url=attrs.match(/\burl=["']([^"']+)["']/i)?.[1]||attrs.match(/\bhref=["']([^"']+)["']/i)?.[1]||'',type=attrs.match(/\btype=["']([^"']+)["']/i)?.[1]||'';
  const source=tag[0].match(/^<\s*([^\s>]+)/)?.[1]?.toLowerCase()||'rss-media';
  if((!type||/^image\//i.test(type))&&url)candidates.push({url:decode(url),source});
 }
 const text=decode(description||raw);
 for(const match of text.matchAll(/<(?:img|source)\b[^>]*>/gi)){
  const attrs=match[0],src=attrs.match(/\b(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["']/i)?.[1]||attrs.match(/\bsrcset=["']([^"']+)["']/i)?.[1]?.split(',')[0]?.trim().split(/\s+/)[0]||'';
  if(src)candidates.push({url:decode(src),source:'rss-description-html'});
 }
 const seen=new Set();
 return candidates.filter(candidate=>{try{const url=new URL(candidate.url);if(url.protocol!=='https:'||/(?:logo|avatar|icon|favicon)/i.test(url.pathname))return false;url.hash='';if(seen.has(url.href))return false;seen.add(url.href);candidate.url=url.href;return true;}catch{return false;}}).slice(0,8);
}
export function extractRssThumbnail(raw='',description=''){return extractRssThumbnailCandidates(raw,description)[0]?.url||'';}
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
  const rssImageCandidates=extractRssThumbnailCandidates(raw,description),thumbnail=rssImageCandidates[0];
  return {id,title,url,publishedAt,description:description.slice(0,1200),thumbnailUrl:thumbnail?.url||'',thumbnailSource:thumbnail?.source||'',thumbnailCandidates:rssImageCandidates,sourceName:source,discoverySource:'google-news-rss',query,discoveredAt:now,status:'candidate',relevanceScore:relevanceScore(title,description)};
 }).filter(Boolean);
 return items;
}
export function extractOpenGraphImageCandidates(html=''){
 const metas=[...String(html).matchAll(/<meta\b[^>]*>/gi)].map(m=>m[0]),candidates=[],seen=new Set();
 for(const meta of metas){
  const key=meta.match(/\b(?:property|name)=["'](og:image|twitter:image|twitter:image:src)["']/i)?.[1]?.toLowerCase();
  if(!key)continue;
  const content=meta.match(/\bcontent=["']([^"']+)["']/i)?.[1]||'';
  try{const url=new URL(decode(content));if(url.protocol!=='https:'||/(?:logo|avatar|icon|favicon)/i.test(url.pathname))continue;url.hash='';if(seen.has(url.href))continue;seen.add(url.href);candidates.push({url:url.href,source:key});}catch{}
 }
 return candidates.slice(0,8);
}
export function extractOpenGraphImage(html=''){return extractOpenGraphImageCandidates(html)[0]?.url||'';}
export async function enrichThumbnails(items,{fetchImpl=fetch,limit=12,timeoutMs=5000,concurrency=3,offset=0}={}){
 const missing=items.filter(item=>!item.thumbnailUrl&&/^https:\/\/news\.google\.com\//i.test(item.url||''));
 const start=missing.length?Math.abs(Number(offset)||0)%missing.length:0;
 const targets=Array.from({length:Math.min(limit,missing.length)},(_,index)=>missing[(start+index)%missing.length]);
 const results=new Array(targets.length);let cursor=0;
 async function worker(){while(true){const index=cursor++;if(index>=targets.length)return;const item=targets[index];try{
  const response=await fetchImpl(item.url,{method:'GET',redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; HaewonArchiveBot/0.2; thumbnail metadata)'},signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const candidates=extractOpenGraphImageCandidates(await response.text()),candidate=candidates[0]||null;
  results[index]={id:item.id,thumbnailUrl:candidate?.url||'',candidate,candidates,status:candidate?'found':'missing'};
 }catch(error){results[index]={id:item.id,thumbnailUrl:'',status:'failed',error:String(error?.message||error)};}}
 }
 await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},worker));
 const byId=new Map(results.filter(r=>r?.thumbnailUrl).map(r=>[r.id,r.thumbnailUrl]));
 // Preserve existing thumbnails; only assign new unique HTTPS URLs.
 const usedUrls=new Set(items.map(item=>{try{const url=new URL(item.thumbnailUrl||'');if(url.protocol==='https:'){url.hash='';return url.href;}}catch{}return ''}).filter(Boolean));
 let assigned=0,duplicateRejected=0;
 const enriched=items.map(item=>{
  if(item.thumbnailUrl||!byId.has(item.id))return item;
  const result=results.find(row=>row?.id===item.id),image=byId.get(item.id),candidate=result?.candidate;
  try{const url=new URL(image);if(url.protocol!=='https:')return item;url.hash='';const normalized=url.href;
   if(usedUrls.has(normalized)){duplicateRejected++;if(result)result.status='duplicate-rejected';return item;}
   usedUrls.add(normalized);assigned++;if(result)result.status='assigned';
   return {...item,thumbnailUrl:image,thumbnailSource:candidate?.source||'article-meta',thumbnailCandidates:candidate?[candidate]:[]};
  }catch{return item;}
 });
 for(const result of results){if(result?.thumbnailUrl)result.assigned=result.status==='assigned';}
 return {items:enriched,attempted:targets.length,found:byId.size,assigned,duplicateRejected,missing:results.filter(r=>r?.status==='missing').length,failed:results.filter(r=>r?.status==='failed').length,results};
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
 const map=new Map(),aliases=new Map();
 for(const item of [...existing,...incoming]){
  const titleKey=canonicalCandidateTitle(item?.title),urlKey=canonicalCandidateUrl(item?.url);
  const titleAlias=titleKey.length>=32?'title:'+titleKey:'';
  const urlAlias=urlKey?'url:'+urlKey:'';
  const key=aliases.get(urlAlias)||aliases.get(titleAlias)||titleAlias||urlAlias;
  if(!item?.url||!key)continue;
  const prior=map.get(key);
  if(!prior)map.set(key,item);
  else map.set(key,{...prior,thumbnailUrl:prior.thumbnailUrl||item.thumbnailUrl||'',publishedAt:prior.publishedAt||item.publishedAt||'',description:(prior.description||'').length>=(item.description||'').length?prior.description:item.description,sourceName:prior.sourceName||item.sourceName,relevanceScore:Math.max(Number(prior.relevanceScore||0),Number(item.relevanceScore||0))});
  aliases.set(urlAlias,key);if(titleAlias)aliases.set(titleAlias,key);
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
 const merged=mergeCandidates(existing,incoming);
 const thumbnailEnrichment=await enrichThumbnails(merged,{offset:Math.floor(Date.now()/21600000)});
 const mergedWithThumbnails=thumbnailEnrichment.items;
 const existingUrls=new Set(existing.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const uniqueIncoming=new Set(incoming.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const added=[...uniqueIncoming].filter(url=>!existingUrls.has(url)).length;
 const perQuery=queriesList.map(query=>({query,candidates:incoming.filter(item=>item.query===query).length,uniqueCandidates:new Set(incoming.filter(item=>item.query===query).map(item=>item.url.toLowerCase())).size}));
 const incomingMerged=mergeCandidates([],incoming);
 const deduplicationComparison={before:incoming.length,after:incomingMerged.length,collapsed:Math.max(0,incoming.length-incomingMerged.length),method:'normalized exact headline first; canonical URL fallback'};
 await writeFile(path,JSON.stringify(mergedWithThumbnails,null,2)+'\n');
 await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:perQuery,requestedQueries:queries,successfulQueries,failedQueries:failures.map(x=>({query:x.query,error:x.error})),fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,thumbnailEnrichment:{attempted:thumbnailEnrichment.attempted,found:thumbnailEnrichment.found,assigned:thumbnailEnrichment.assigned,duplicateRejected:thumbnailEnrichment.duplicateRejected,missing:thumbnailEnrichment.missing,failed:thumbnailEnrichment.failed},deduplicationComparison,totalCandidates:merged.length},null,2)+'\n');
 console.log(JSON.stringify({queries,successfulQueries,failedQueries:failures,fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,duplicates:incoming.length-uniqueIncoming.size,thumbnailEnrichment,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});