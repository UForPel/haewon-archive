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
function attr(tag,name){
 for(const match of String(tag).matchAll(/([^\s=]+)\s*=\s*(["'])(.*?)\2/gs)){
  if(match[1].toLowerCase()===String(name).toLowerCase())return decode(match[3]);
 }
 return '';
}
function resolveImageUrl(value,baseUrl=''){
 try{const url=baseUrl?new URL(decode(String(value||'')),baseUrl):new URL(decode(String(value||'')));if(url.protocol!=='https:'||url.username||url.password||/(?:logo|avatar|icon|favicon)/i.test(url.pathname))return '';url.hash='';return url.href;}catch{return '';}
}
function dedupeImageCandidates(candidates,limit=12){
 const seen=new Set(),out=[];
 for(const candidate of candidates){const url=resolveImageUrl(candidate.url,candidate.baseUrl);if(!url||seen.has(url))continue;seen.add(url);out.push({url,source:candidate.source,priority:Number(candidate.priority||99)});}
 return out.sort((a,b)=>a.priority-b.priority).slice(0,limit);
}
export function extractRssThumbnailCandidates(raw='',description='',baseUrl=''){
 const candidates=[];
 for(const match of String(raw).matchAll(/<(?:media:thumbnail|media:content|enclosure)\b[^>]*>/gi)){
  const tagText=match[0],name=tagText.match(/^<\s*([^\s>]+)/)?.[1]?.toLowerCase()||'rss-media';
  const url=attr(tagText,'url')||attr(tagText,'href'),type=attr(tagText,'type'),medium=attr(tagText,'medium');
  const imageTag=name==='media:thumbnail'||(/^image\//i.test(type))||medium.toLowerCase()==='image';
  if(url&&imageTag)candidates.push({url,source:name,priority:name==='media:thumbnail'?1:name==='media:content'?2:3});
 }
 const html=decode(description||'');
 for(const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)){
  const tagText=match[0],src=attr(tagText,'src')||attr(tagText,'data-src')||attr(tagText,'data-original')||attr(tagText,'data-lazy-src');
  const srcset=attr(tagText,'srcset');
  const selected=src||srcset.split(',')[0]?.trim().split(/\s+/)[0]||'';
  if(selected)candidates.push({url:selected,source:'rss-description-html',priority:4});
 }
 return dedupeImageCandidates(candidates.map(c=>({...c,baseUrl})),8);
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
function isGoogleNewsWrapperUrl(value=''){
 try{const host=new URL(String(value)).hostname.toLowerCase();return host==='news.google.com'||host.endsWith('.news.google.com')||host==='google.com'||host.endsWith('.google.com')||host.endsWith('.googleusercontent.com')||host.endsWith('.gstatic.com');}catch{return true;}
}
function isPublisherArticleUrl(value=''){
 try{const url=new URL(String(value));return url.protocol==='https:'&&!url.username&&!url.password&&!isGoogleNewsWrapperUrl(url.href)&&url.pathname!=='/';}catch{return false;}
}
export function parseRss(xml,query,now=new Date().toISOString()){
 if(typeof xml!=='string'||!/<rss\b/i.test(xml))throw new Error('RSS 응답이 아닙니다');
 const items=[...xml.matchAll(/<item\b[^>]*>(.*?)<\/item>/gis)].map(([,raw])=>{
  const title=tag(raw,'title'),url=tag(raw,'link'),pub=tag(raw,'pubDate'),description=tag(raw,'description'),sourceTag=raw.match(/<source\b[^>]*>/i)?.[0]||'',source=tag(raw,'source')||'Google News',sourceUrlCandidate=attr(sourceTag,'url');
  const sourceUrl=/^https:\/\//i.test(sourceUrlCandidate)?sourceUrlCandidate:'';
  const guid=tag(raw,'guid'),publisherArticleUrl=isPublisherArticleUrl(url)?url:isPublisherArticleUrl(guid)?guid:'';
  if(!title||!url||!/^https:\/\/\S+/i.test(url))return null;
  const date=pub?new Date(pub):null,publishedAt=date&&!Number.isNaN(date.getTime())?date.toISOString():'';
  const id=createHash('sha256').update(url).digest('hex').slice(0,20);
  const rssImageCandidates=extractRssThumbnailCandidates(raw,description+' '+tag(raw,'content:encoded'),url),thumbnail=rssImageCandidates[0];
  return {id,title,url,publisherArticleUrl,sourceUrl,publishedAt,description:description.slice(0,1200),thumbnailUrl:thumbnail?.url||'',thumbnailSource:thumbnail?.source||'',thumbnailCandidates:rssImageCandidates,sourceName:source,discoverySource:'google-news-rss',query,discoveredAt:now,status:'candidate',relevanceScore:relevanceScore(title,description)};
 }).filter(Boolean);
 return items;
}
export function extractOpenGraphImageCandidates(html='',baseUrl=''){
 const source=String(html||''),candidates=[];
 for(const match of source.matchAll(/<meta\b[^>]*>/gi)){
  const tag=match[0],key=(attr(tag,'property')||attr(tag,'name')||'').toLowerCase(),content=attr(tag,'content');
  const map={'og:image':1,'og:image:secure_url':1,'twitter:image':2,'twitter:image:src':2};
  if(content&&map[key])candidates.push({url:content,source:key,priority:map[key],baseUrl});
 }
 for(const match of source.matchAll(/<link\b[^>]*>/gi)){
  const tag=match[0],rel=attr(tag,'rel').toLowerCase().split(/\s+/);
  if(rel.includes('image_src')){const href=attr(tag,'href');if(href)candidates.push({url:href,source:'link:image_src',priority:3,baseUrl});}
 }
 for(const match of source.matchAll(/<(?:meta|img)\b[^>]*>/gi)){
  const tag=match[0],itemprop=attr(tag,'itemprop').toLowerCase();
  if(itemprop==='image'){
   const value=attr(tag,'content')||attr(tag,'src')||attr(tag,'data-src');
   if(value)candidates.push({url:value,source:'itemprop:image',priority:4,baseUrl});
  }
 }
 for(const match of source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const parsed=JSON.parse(match[1].replace(/^\s*<!--|-->\s*$/g,''));
   const visit=node=>{
    if(!node)return;
    if(Array.isArray(node)){node.forEach(visit);return;}
    if(typeof node!=='object')return;
    for(const key of ['image','thumbnailUrl','contentUrl']){
     const value=node[key];
     if(typeof value==='string')candidates.push({url:value,source:'jsonld:'+key,priority:5,baseUrl});
     else if(Array.isArray(value))value.forEach(v=>{if(typeof v==='string')candidates.push({url:v,source:'jsonld:'+key,priority:5,baseUrl});else if(v&&typeof v==='object'&&typeof v.url==='string')candidates.push({url:v.url,source:'jsonld:'+key,priority:5,baseUrl});});
     else if(value&&typeof value==='object'&&typeof value.url==='string')candidates.push({url:value.url,source:'jsonld:'+key,priority:5,baseUrl});
    }
    Object.values(node).forEach(value=>{if(value&&typeof value==='object')visit(value);});
   };
   visit(parsed);
  }catch{}
 }
 return dedupeImageCandidates(candidates,12).map(({url,source,priority})=>({url,source,priority}));
}
export function extractOpenGraphImage(html=''){return extractOpenGraphImageCandidates(html)[0]?.url||'';}
export async function enrichThumbnails(items,{fetchImpl=fetch,limit=12,timeoutMs=5000,concurrency=3,offset=0}={}){
 const missing=items.filter(item=>!item.thumbnailUrl&&isPublisherArticleUrl(item.publisherArticleUrl));
 const start=missing.length?Math.abs(Number(offset)||0)%missing.length:0;
 const targets=Array.from({length:Math.min(limit,missing.length)},(_,index)=>missing[(start+index)%missing.length]);
 const results=new Array(targets.length);let cursor=0;
 async function worker(){while(true){const index=cursor++;if(index>=targets.length)return;const item=targets[index],articleUrl=item.publisherArticleUrl;try{
  const response=await fetchImpl(articleUrl,{method:'GET',redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; HaewonArchiveBot/0.2; thumbnail metadata)'},signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const finalUrl=String(response.url||articleUrl);
  if(new URL(finalUrl).protocol!=='https:')throw new Error('redirected article URL is not HTTPS');
  const parsedUrl=new URL(finalUrl),isGoogleWrapper=isGoogleNewsWrapperUrl(finalUrl);
  const extracted=extractOpenGraphImageCandidates(await response.text(),finalUrl);
  const candidates=isGoogleWrapper?extracted.map(row=>({...row,source:'google-news-wrapper:'+row.source,priority:90})):extracted;
  const candidate=isGoogleWrapper?null:(candidates[0]||null);
  results[index]={id:item.id,thumbnailUrl:candidate?.url||'',candidate,candidates,status:isGoogleWrapper&&extracted.length?'wrapper-only':candidate?'found':'missing',publisherArticleUrl:articleUrl,sourceUrl:item.sourceUrl||'',resolvedArticleUrl:finalUrl,resolvedArticleHost:parsedUrl.hostname,fetchedAt:new Date().toISOString()};
 }catch(error){results[index]={id:item.id,thumbnailUrl:'',status:'failed',publisherArticleUrl:articleUrl,sourceUrl:item.sourceUrl||'',error:String(error?.message||error)};}}
 }
 await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},worker));
 const byId=new Map(results.filter(r=>r?.thumbnailUrl).map(r=>[r.id,r.thumbnailUrl]));
 // Preserve existing thumbnails; only assign new unique HTTPS URLs.
 const usedUrls=new Set(items.map(item=>{try{const url=new URL(item.thumbnailUrl||'');if(url.protocol==='https:'){url.hash='';return url.href;}}catch{}return ''}).filter(Boolean));
 let assigned=0,duplicateRejected=0;
 const enriched=items.map(item=>{
  const result=results.find(row=>row?.id===item.id);
  const metaCandidates=(result?.candidates||[]).slice(0,12);
  // Persist metadata candidates even when assignment is rejected as a duplicate.
  const withMeta={...item,thumbnailMetaCandidates:metaCandidates.length?metaCandidates:item.thumbnailMetaCandidates||[],thumbnailMetaFetch:result?{status:result.status,publisherArticleUrl:result.publisherArticleUrl||'',sourceUrl:result.sourceUrl||'',resolvedArticleUrl:result.resolvedArticleUrl||'',resolvedArticleHost:result.resolvedArticleHost||'',fetchedAt:result.fetchedAt||''}:item.thumbnailMetaFetch||null};
  if(item.thumbnailUrl||!byId.has(item.id))return withMeta;
  const image=byId.get(item.id),candidate=result?.candidate;
  try{const url=new URL(image);if(url.protocol!=='https:')return withMeta;url.hash='';const normalized=url.href;
   if(usedUrls.has(normalized)){duplicateRejected++;if(result)result.status='duplicate-rejected';return withMeta;}
   usedUrls.add(normalized);assigned++;if(result)result.status='assigned';
   return {...withMeta,thumbnailUrl:image,thumbnailSource:candidate?.source||'article-meta',thumbnailProvenance:{source:candidate?.source||'article-meta',url:image,articleUrl:result?.resolvedArticleUrl||item.url,observedAt:result?.fetchedAt||new Date().toISOString()}};
  }catch{return withMeta;}
 });
 for(const result of results){if(result?.thumbnailUrl)result.assigned=result.status==='assigned';}
 return {items:enriched,attempted:targets.length,found:byId.size,assigned,duplicateRejected,wrapperOnly:results.filter(r=>r?.status==='wrapper-only').length,missing:results.filter(r=>r?.status==='missing').length,failed:results.filter(r=>r?.status==='failed').length,results};
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
export function mergeImageCandidateLists(...lists){const seen=new Set(),out=[];for(const candidate of lists.flat()){if(!candidate?.url)continue;const key=String(candidate.url)+'|'+String(candidate.source||'');if(seen.has(key))continue;seen.add(key);out.push(candidate);}return out.slice(0,16);}
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
  else map.set(key,{...prior,thumbnailUrl:prior.thumbnailUrl||item.thumbnailUrl||'',publishedAt:prior.publishedAt||item.publishedAt||'',description:(prior.description||'').length>=(item.description||'').length?prior.description:item.description,sourceName:prior.sourceName||item.sourceName,sourceUrl:item.sourceUrl||prior.sourceUrl||'',publisherArticleUrl:item.publisherArticleUrl||prior.publisherArticleUrl||'',thumbnailSource:prior.thumbnailSource||item.thumbnailSource||'',thumbnailCandidates:mergeImageCandidateLists(prior.thumbnailCandidates,item.thumbnailCandidates),thumbnailMetaCandidates:mergeImageCandidateLists(prior.thumbnailMetaCandidates,item.thumbnailMetaCandidates),thumbnailMetaFetch:item.thumbnailMetaFetch||prior.thumbnailMetaFetch||null,relevanceScore:Math.max(Number(prior.relevanceScore||0),Number(item.relevanceScore||0))});
  aliases.set(urlAlias,key);if(titleAlias)aliases.set(titleAlias,key);
 }
 return [...map.values()].sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
}
export function newsFeedUrl(query){return 'https://news.google.com/rss/search?q='+encodeURIComponent(query)+'&hl=ko&gl=KR&ceid=KR:ko';}
export function summarizeRssImageSignals(xml=''){
 const items=[...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(match=>match[1]);
 const count=(pattern,value)=>[...String(value).matchAll(pattern)].length;
 let descriptionImageTags=0,contentEncodedImageTags=0,itemsWithImageSignals=0;
 for(const item of items){
  const description=tag(item,'description'),encoded=tag(item,'content:encoded');
  const descriptionImages=count(/<(?:img|source)\b/gi,description);
  const encodedImages=count(/<(?:img|source)\b/gi,encoded);
  descriptionImageTags+=descriptionImages;contentEncodedImageTags+=encodedImages;
  if(/<(?:media:thumbnail|media:content|enclosure)\b/i.test(item)||descriptionImages||encodedImages)itemsWithImageSignals++;
 }
 return {items:items.length,sourceUrlItems:items.filter(item=>/^https:\/\//i.test(attr(item.match(/<source\b[^>]*>/i)?.[0]||'','url'))).length,publisherArticleUrlItems:items.filter(item=>isPublisherArticleUrl(tag(item,'link'))||isPublisherArticleUrl(tag(item,'guid'))).length,mediaThumbnailTags:count(/<media:thumbnail\b/gi,xml),mediaContentTags:count(/<media:content\b/gi,xml),enclosureTags:count(/<enclosure\b/gi,xml),contentEncodedItems:count(/<content:encoded\b/gi,xml),descriptionImageTags,contentEncodedImageTags,itemsWithImageSignals};
}
export async function collectFeeds({queries=getDailySearches(),fetchImpl=fetch,now=new Date().toISOString()}={}){
 const incoming=[],failures=[];
 const rssImageSignals={items:0,sourceUrlItems:0,publisherArticleUrlItems:0,mediaThumbnailTags:0,mediaContentTags:0,enclosureTags:0,contentEncodedItems:0,descriptionImageTags:0,contentEncodedImageTags:0,itemsWithImageSignals:0};
 for(const query of queries){
  try{
   const response=await fetchImpl(newsFeedUrl(query),{headers:{'user-agent':'HaewonArchiveBot/0.2 (public RSS index)'},signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error('HTTP '+response.status);
   const xml=await response.text(),signals=summarizeRssImageSignals(xml);
   for(const [key,value] of Object.entries(signals))rssImageSignals[key]=(rssImageSignals[key]||0)+value;
   incoming.push(...parseRss(xml,query,now));
  }catch(error){failures.push({query,error:String(error?.message||error)});}
 }
 return {incoming,failures,queries:queries.length,successfulQueries:queries.length-failures.length,rssImageSignals};
}
async function main(){
 const path=resolve(ROOT,'data/discovery.json'),existing=JSON.parse(await readFile(path,'utf8')),now=new Date().toISOString();
 const queriesList=getDailySearches();
 const {incoming,failures,queries,successfulQueries,rssImageSignals}=await collectFeeds({queries:queriesList,now});

 if(successfulQueries===0){
  await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:queriesList.map(query=>({query,candidates:0,uniqueCandidates:0})),requestedQueries:queries,successfulQueries,failedQueries:failures.map(x=>({query:x.query,error:x.error})),rssImageSignals,fetched:0,uniqueIncoming:0,added:0,totalCandidates:existing.length},null,2)+'\n');
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
 const rssImageCandidateRows=incoming.flatMap(item=>item.thumbnailCandidates||[]);
 const rssImageCandidateSources=Object.fromEntries(rssImageCandidateRows.reduce((map,candidate)=>map.set(candidate.source,(map.get(candidate.source)||0)+1),new Map()));
 const incomingMerged=mergeCandidates([],incoming);
 const deduplicationComparison={before:incoming.length,after:incomingMerged.length,collapsed:Math.max(0,incoming.length-incomingMerged.length),method:'normalized exact headline first; canonical URL fallback'};
 await writeFile(path,JSON.stringify(mergedWithThumbnails,null,2)+'\n');
 await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:perQuery,requestedQueries:queries,successfulQueries,failedQueries:failures.map(x=>({query:x.query,error:x.error})),fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,rssImageSignals,rssImageCandidateArticles:incoming.filter(item=>(item.thumbnailCandidates||[]).length>0).length,rssImageCandidatesTotal:rssImageCandidateRows.length,rssImageCandidateSources,thumbnailEnrichment:{attempted:thumbnailEnrichment.attempted,found:thumbnailEnrichment.found,assigned:thumbnailEnrichment.assigned,duplicateRejected:thumbnailEnrichment.duplicateRejected,wrapperOnly:thumbnailEnrichment.wrapperOnly,missing:thumbnailEnrichment.missing,failed:thumbnailEnrichment.failed,results:thumbnailEnrichment.results.map(({id,status,candidate,candidates,assigned,publisherArticleUrl,sourceUrl,resolvedArticleUrl,resolvedArticleHost})=>({id,status,candidate,candidates,assigned,publisherArticleUrl,sourceUrl,resolvedArticleUrl,resolvedArticleHost}))},deduplicationComparison,totalCandidates:merged.length},null,2)+'\n');
 console.log(JSON.stringify({queries,successfulQueries,failedQueries:failures,rssImageSignals,fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,duplicates:incoming.length-uniqueIncoming.size,thumbnailEnrichment,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});