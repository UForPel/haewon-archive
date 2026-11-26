import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isExplicitPublisherArticleUrl as isPublisherArticleUrl } from '../js/discovery-kind.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const SEARCH_PACKS = [
  ['오해원 NMIXX','해원 엔믹스','NMIXX Haewon news','Haewon NMIXX news','오해원 근황','Haewon latest news'],
  ['Haewon NMIXX interview','오해원 인터뷰','NMIXX Haewon magazine','Haewon NMIXX editorial','해원 화보 인터뷰','Haewon profile interview'],
  ['오해원 방송','해원 엔믹스 기사','NMIXX Haewon appearance','Haewon NMIXX event','오해원 예능 출연','Haewon broadcast appearance'],
  ['오해원 광고','NMIXX Haewon brand','Haewon campaign','해원 브랜드 화보','NMIXX Haewon endorsement','Haewon magazine pictorial'],
  ['오해원 팬미팅 기사','NMIXX Haewon festival','Haewon stage appearance news','해원 공연 행사','NMIXX Haewon showcase','Haewon public schedule'],
  ['NMIXX Haewon Japan news','오해원 해외 활동','Haewon international interview','엔믹스 해원 활동 소식','Haewon radio appearance','NMIXX Haewon television']
];
export const SEARCHES = SEARCH_PACKS.flat();
export function getDailySearches(day = new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'}), runSlot = Number(new Date().toLocaleString('en-US',{timeZone:'Asia/Seoul',hour:'2-digit',hourCycle:'h23'})) >= 12 ? 1 : 0) {
  const dayNumber = Math.floor(Date.parse(day+'T00:00:00Z') / 86400000);
  const slot = Number(runSlot) === 1 ? 1 : 0;
  const index = ((dayNumber * 2 + slot) % SEARCH_PACKS.length + SEARCH_PACKS.length) % SEARCH_PACKS.length;
  return SEARCH_PACKS[index];
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
export function bingNewsFeedUrl(query){
 return 'https://www.bing.com/news/search?q='+encodeURIComponent(query)+'&format=rss&setmkt=ko-KR';
}
export function extractBingNewsArticleUrl(value=''){
 try{
  const wrapper=new URL(String(value||''));
  const host=wrapper.hostname.toLowerCase();
  if(!['bing.com','www.bing.com'].includes(host)||wrapper.pathname.toLowerCase()!=='/news/apiclick.aspx')return '';
  const destination=wrapper.searchParams.get('url')||'';
  const article=new URL(destination);
  if(article.protocol!=='https:'||article.username||article.password||!article.hostname||article.pathname==='/')return '';
  const articleHost=article.hostname.toLowerCase();
  if(articleHost==='bing.com'||articleHost.endsWith('.bing.com')||articleHost==='google.com'||articleHost.endsWith('.google.com')||articleHost==='googleusercontent.com'||articleHost.endsWith('.googleusercontent.com'))return '';
  article.hash='';
  return article.href;
 }catch{return '';}
}
export function parseBingNewsRss(xml,query,now=new Date().toISOString()){
 if(typeof xml!=='string'||!/<rss\b/i.test(xml))throw new Error('Bing RSS 응답이 아닙니다');
 return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(([,raw])=>{
  const title=tag(raw,'title'),discoveryUrl=tag(raw,'link'),articleUrl=extractBingNewsArticleUrl(discoveryUrl);
  if(!title||!articleUrl)return null;
  const sourceTag=raw.match(/<(?:news:)?source\b[^>]*>/i)?.[0]||'';
  const sourceName=tag(raw,'news:source')||tag(raw,'source')||'Bing News';
  const sourceUrlCandidate=attr(sourceTag,'url');
  const sourceUrl=sourceUrlCandidate.startsWith('https://')?sourceUrlCandidate:'';
  const dateText=tag(raw,'pubDate'),date=dateText?new Date(dateText):null;
  const publishedAt=date&&!Number.isNaN(date.getTime())?date.toISOString():'';
  const host=new URL(articleUrl).hostname.toLowerCase();
  const id=createHash('sha256').update(articleUrl).digest('hex').slice(0,20);
  const description=tag(raw,'description'),contentEncoded=tag(raw,'content:encoded');
  const thumbnailCandidates=extractRssThumbnailCandidates(raw,description+' '+contentEncoded,articleUrl);
  const thumbnail=thumbnailCandidates[0];
  return {id,title,url:articleUrl,publisherArticleUrl:isPublisherArticleUrl(articleUrl)?articleUrl:'',sourceUrl,discoveryUrl,publisherHost:isPublisherArticleUrl(articleUrl)?host:'',candidateSource:'bing-news-rss-explicit-url-param',candidateSources:[{source:'bing-news-rss-explicit-url-param',feedUrl:bingNewsFeedUrl(query),discoveryUrl,articleUrl,host}],publishedAt,description:description.slice(0,1200),thumbnailUrl:thumbnail?.url||'',thumbnailSource:thumbnail?.source||'',thumbnailCandidates,sourceName,discoverySource:'bing-news-rss',query,discoveredAt:now,status:'candidate',relevanceScore:relevanceScore(title,description)};
 }).filter(Boolean);
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
export function shouldRetryThumbnailFetch(meta,now=Date.now()){
 if(!meta||!meta.status||!meta.fetchedAt)return true;
 const fetchedAt=Date.parse(meta.fetchedAt),current=typeof now==='string'?Date.parse(now):Number(now);
 if(!Number.isFinite(fetchedAt)||!Number.isFinite(current))return true;
 const age=Math.max(0,current-fetchedAt),day=86400000;
 if(['assigned','found','duplicate-rejected','wrapper-only'].includes(meta.status))return age>=30*day;
 if(meta.status==='missing')return age>=7*day;
 if(meta.status==='failed'){
  if(Number(meta.statusCode)===405||['not-found','forbidden','rate-limited','method-not-allowed'].includes(meta.errorCode))return age>=7*day;
  return age>=day;
 }
 return true;
}
export async function enrichThumbnails(items,{fetchImpl=fetch,limit=12,timeoutMs=5000,concurrency=3,offset=0,now=new Date().toISOString()}={}){
 const missing=items.filter(item=>!item.thumbnailUrl&&isPublisherArticleUrl(item.publisherArticleUrl)&&shouldRetryThumbnailFetch(item.thumbnailMetaFetch,now));
 const start=missing.length?Math.abs(Number(offset)||0)%missing.length:0;
 const targets=Array.from({length:Math.min(limit,missing.length)},(_,index)=>missing[(start+index)%missing.length]);
 const results=new Array(targets.length);let cursor=0;
 async function worker(){while(true){const index=cursor++;if(index>=targets.length)return;const item=targets[index],articleUrl=item.publisherArticleUrl;let response=null,finalUrl=articleUrl;try{
  response=await fetchImpl(articleUrl,{method:'GET',redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; HaewonArchiveBot/0.2; thumbnail metadata)'},signal:AbortSignal.timeout(timeoutMs)});
  finalUrl=String(response.url||articleUrl);
  if(!response.ok){const error=new Error('HTTP '+response.status);error.statusCode=response.status;throw error;}
  if(new URL(finalUrl).protocol!=='https:'){const error=new Error('redirected article URL is not HTTPS');error.errorCode='redirect-non-https';throw error;}
  const parsedUrl=new URL(finalUrl),isGoogleWrapper=isGoogleNewsWrapperUrl(finalUrl);
  const extracted=extractOpenGraphImageCandidates(await response.text(),finalUrl);
  const candidates=isGoogleWrapper?extracted.map(row=>({...row,source:'google-news-wrapper:'+row.source,priority:90})):extracted;
  const candidate=isGoogleWrapper?null:(candidates[0]||null);
  results[index]={id:item.id,thumbnailUrl:candidate?.url||'',candidate,candidates,status:isGoogleWrapper&&extracted.length?'wrapper-only':candidate?'found':'missing',statusCode:response.status||200,errorCode:'',publisherArticleUrl:articleUrl,sourceUrl:item.sourceUrl||'',resolvedArticleUrl:finalUrl,resolvedArticleHost:parsedUrl.hostname,fetchedAt:now};
 }catch(error){
  const statusCode=Number(error?.statusCode||response?.status)||null;
  const errorCode=error?.errorCode||(statusCode===405?'method-not-allowed':statusCode===429?'rate-limited':statusCode===403?'forbidden':statusCode===404||statusCode===410?'not-found':statusCode>=500?'server-error':/timeout|abort/i.test(String(error?.name||'')+' '+String(error?.message||''))?'timeout':'network-error');
  let resolvedArticleHost='';try{resolvedArticleHost=new URL(finalUrl).hostname;}catch{}
  results[index]={id:item.id,thumbnailUrl:'',status:'failed',statusCode,errorCode,publisherArticleUrl:articleUrl,sourceUrl:item.sourceUrl||'',resolvedArticleUrl:finalUrl,resolvedArticleHost,fetchedAt:now};
 }}
 }
 await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},worker));
 const usedUrls=new Set(items.map(item=>{try{const url=new URL(item.thumbnailUrl||'');if(url.protocol==='https:'){url.hash='';return url.href;}}catch{}return ''}).filter(Boolean));
 let assigned=0,duplicateRejected=0;
 for(const result of results){if(!result?.thumbnailUrl)continue;try{const url=new URL(result.thumbnailUrl);if(url.protocol!=='https:')continue;url.hash='';if(usedUrls.has(url.href)){duplicateRejected++;result.status='duplicate-rejected';result.assigned=false;}else{usedUrls.add(url.href);assigned++;result.status='assigned';result.assigned=true;}}catch{}}
 const resultById=new Map(results.filter(Boolean).map(row=>[String(row.id),row]));
 const enriched=items.map(item=>{
  const result=resultById.get(String(item.id||''));if(!result)return item;
  const metaCandidates=(result.candidates||[]).slice(0,12);
  const withMeta={...item,thumbnailMetaCandidates:metaCandidates.length?metaCandidates:item.thumbnailMetaCandidates||[],thumbnailMetaFetch:{status:result.status,publisherArticleUrl:result.publisherArticleUrl||'',sourceUrl:result.sourceUrl||'',resolvedArticleUrl:result.resolvedArticleUrl||'',resolvedArticleHost:result.resolvedArticleHost||'',fetchedAt:result.fetchedAt||now,statusCode:result.statusCode??null,errorCode:result.errorCode||''}};
  if(!result.assigned)return withMeta;
  return {...withMeta,thumbnailUrl:result.thumbnailUrl,thumbnailSource:result.candidate?.source||'article-meta',thumbnailProvenance:{source:result.candidate?.source||'article-meta',url:result.thumbnailUrl,articleUrl:result.resolvedArticleUrl||item.publisherArticleUrl,observedAt:result.fetchedAt||now}};
 });
 return {items:enriched,attempted:targets.length,found:results.filter(r=>r?.candidate).length,assigned,duplicateRejected,wrapperOnly:results.filter(r=>r?.status==='wrapper-only').length,missing:results.filter(r=>r?.status==='missing').length,failed:results.filter(r=>r?.status==='failed').length,results};
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
  if(!prior)map.set(key,{...item,publisherArticleUrl:isPublisherArticleUrl(item.publisherArticleUrl)?item.publisherArticleUrl:''});
  else map.set(key,{...prior,thumbnailUrl:prior.thumbnailUrl||item.thumbnailUrl||'',publishedAt:prior.publishedAt||item.publishedAt||'',description:(prior.description||'').length>=(item.description||'').length?prior.description:item.description,sourceName:prior.sourceName||item.sourceName,sourceUrl:item.sourceUrl||prior.sourceUrl||'',publisherArticleUrl:isPublisherArticleUrl(item.publisherArticleUrl)?item.publisherArticleUrl:isPublisherArticleUrl(prior.publisherArticleUrl)?prior.publisherArticleUrl:'',thumbnailSource:prior.thumbnailSource||item.thumbnailSource||'',thumbnailCandidates:mergeImageCandidateLists(prior.thumbnailCandidates,item.thumbnailCandidates),thumbnailMetaCandidates:mergeImageCandidateLists(prior.thumbnailMetaCandidates,item.thumbnailMetaCandidates),thumbnailMetaFetch:item.thumbnailMetaFetch||prior.thumbnailMetaFetch||null,candidateSources:[...(prior.candidateSources||[]),...(item.candidateSources||[])].filter((row,index,array)=>array.findIndex(other=>other.source===row.source&&other.articleUrl===row.articleUrl)===index),publisherHost:prior.publisherHost||item.publisherHost||'',discoveryUrl:prior.discoveryUrl||item.discoveryUrl||'',candidateSource:prior.candidateSource||item.candidateSource||'',relevanceScore:Math.max(Number(prior.relevanceScore||0),Number(item.relevanceScore||0))});
  aliases.set(urlAlias,key);if(titleAlias)aliases.set(titleAlias,key);
 }
 return [...map.values()].sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
}
export function newsFeedUrl(query){return 'https://news.google.com/rss/search?q='+encodeURIComponent(query)+'&hl=ko&gl=KR&ceid=KR:ko';}
function summarizeRssImageSignalItems(items,articleUrlResolver){
 const count=(pattern,value)=>[...String(value||'').matchAll(pattern)].length;
 let sourceUrlItems=0,publisherArticleUrlItems=0,mediaThumbnailTags=0,mediaContentTags=0,enclosureTags=0;
 let imageMediaContentTags=0,imageEnclosureTags=0,contentEncodedItems=0,descriptionImageTags=0,contentEncodedImageTags=0,itemsWithImageSignals=0;
 for(const item of items){
  const description=tag(item,'description'),encoded=tag(item,'content:encoded');
  const descriptionImages=count(/<(?:img|source)\b/gi,description);
  const encodedImages=count(/<(?:img|source)\b/gi,encoded);
  const mediaTags=[...item.matchAll(/<(media:thumbnail|media:content|enclosure)\b[^>]*>/gi)].map(match=>({name:match[1].toLowerCase(),raw:match[0]}));
  const imageMediaTags=mediaTags.filter(({name,raw})=>{
   if(name==='media:thumbnail')return true;
   return /^image\//i.test(attr(raw,'type'))||attr(raw,'medium').toLowerCase()==='image';
  });
  sourceUrlItems+=/^https:\/\//i.test(attr(item.match(/<source\b[^>]*>/i)?.[0]||'','url'))?1:0;
  publisherArticleUrlItems+=articleUrlResolver(item)?1:0;
  mediaThumbnailTags+=mediaTags.filter(row=>row.name==='media:thumbnail').length;
  mediaContentTags+=mediaTags.filter(row=>row.name==='media:content').length;
  enclosureTags+=mediaTags.filter(row=>row.name==='enclosure').length;
  imageMediaContentTags+=imageMediaTags.filter(row=>row.name==='media:content').length;
  imageEnclosureTags+=imageMediaTags.filter(row=>row.name==='enclosure').length;
  contentEncodedItems+=/<content:encoded\b/i.test(item)?1:0;
  descriptionImageTags+=descriptionImages;
  contentEncodedImageTags+=encodedImages;
  if(imageMediaTags.length||descriptionImages||encodedImages)itemsWithImageSignals++;
 }
 return {items:items.length,sourceUrlItems,publisherArticleUrlItems,mediaThumbnailTags,mediaContentTags,enclosureTags,imageMediaContentTags,imageEnclosureTags,contentEncodedItems,descriptionImageTags,contentEncodedImageTags,itemsWithImageSignals};
}
export function summarizeRssImageSignals(xml=''){
 const items=[...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(([,item])=>item);
 return summarizeRssImageSignalItems(items,item=>isPublisherArticleUrl(tag(item,'link'))||isPublisherArticleUrl(tag(item,'guid')));
}
export function summarizeBingRssImageSignals(xml=''){
 const items=[...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(([,item])=>item);
 return summarizeRssImageSignalItems(items,item=>isPublisherArticleUrl(extractBingNewsArticleUrl(tag(item,'link'))));
}
function normalizeQueryMetricUrl(value=''){
 try{
  const url=new URL(String(value||''));
  if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return '';
  url.hash='';
  for(const key of [...url.searchParams.keys()])if(/^(utm_|fbclid|gclid|ref|source)/i.test(key))url.searchParams.delete(key);
  url.searchParams.sort();
  return url.href.replace(/\/$/,'');
 }catch{return '';}
}
function normalizeQueryMetricTitle(value=''){
 return String(value||'').replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').normalize('NFKC').toLocaleLowerCase().replace(/\b(?:youtube|youtu\.be)\b/g,'').replace(/[\p{P}\p{S}\s]+/gu,'').trim();
}
function percentile(values,p){
 if(!values.length)return null;
 const sorted=[...values].sort((a,b)=>a-b);
 const position=(sorted.length-1)*p,lower=Math.floor(position),upper=Math.ceil(position);
 const value=sorted[lower]+(sorted[upper]-sorted[lower])*(position-lower);
 return Math.round(value*10)/10;
}
export function summarizeQueryPerformance(items=[],queries=[],now=new Date().toISOString()){
 const rows=new Map(queries.map(query=>[query,{query,candidates:0,urls:new Set(),titles:new Map(),titleKeywordMatches:0,explicitPublisherUrls:0,publicationLagHours:[],unknownDates:0,futureDated:0}]));
 const urlOwners=new Map();
 for(const item of items){
  const query=String(item.query||'');
  if(!rows.has(query))rows.set(query,{query,candidates:0,urls:new Set(),titles:new Map(),titleKeywordMatches:0,explicitPublisherUrls:0,publicationLagHours:[],unknownDates:0,futureDated:0});
  const row=rows.get(query);row.candidates++;
  const url=normalizeQueryMetricUrl(item.url);
  if(url){row.urls.add(url);if(!urlOwners.has(url))urlOwners.set(url,new Set());urlOwners.get(url).add(query);}
  const title=normalizeQueryMetricTitle(item.title);
  if(title.length>=32)row.titles.set(title,(row.titles.get(title)||0)+1);
  if(/오해원|해원|haewon/i.test(String(item.title||'')))row.titleKeywordMatches++;
  if(normalizeQueryMetricUrl(item.publisherArticleUrl))row.explicitPublisherUrls++;
  const published=Date.parse(item.publishedAt||''),discovered=Date.parse(now);
  if(!Number.isFinite(published)||!Number.isFinite(discovered))row.unknownDates++;
  else if(published>discovered)row.futureDated++;
  else row.publicationLagHours.push((discovered-published)/3600000);
 }
 return [...rows.values()].map(row=>{
  const duplicateTitleGroups=[...row.titles.values()].filter(count=>count>1);
  const duplicateTitleOccurrences=duplicateTitleGroups.reduce((sum,count)=>sum+count-1,0);
  const crossQueryDuplicateUrls=[...row.urls].filter(url=>(urlOwners.get(url)?.size||0)>1).length;
  return {
   query:row.query,
   candidates:row.candidates,
   uniqueCandidates:row.urls.size,
   duplicateUrlOccurrences:Math.max(0,row.candidates-row.urls.size),
   duplicateTitleGroups:duplicateTitleGroups.length,
   duplicateTitleOccurrences,
   titleKeywordMatches:row.titleKeywordMatches,
   titleKeywordMatchRate:row.candidates?Math.round(row.titleKeywordMatches/row.candidates*100):null,
   explicitPublisherUrls:row.explicitPublisherUrls,
   explicitPublisherUrlRate:row.candidates?Math.round(row.explicitPublisherUrls/row.candidates*100):null,
   crossQueryDuplicateUrls,
   datedCandidates:row.publicationLagHours.length,
   unknownDates:row.unknownDates,
   futureDated:row.futureDated,
   medianPublicationLagHours:percentile(row.publicationLagHours,0.5),
   p90PublicationLagHours:percentile(row.publicationLagHours,0.9)
  };
 });
}
export async function collectFeeds({queries=getDailySearches(),fetchImpl=fetch,now=new Date().toISOString()}={}){
 const incoming=[],failures=[],bingFailures=[];
 const rssImageSignals={items:0,sourceUrlItems:0,publisherArticleUrlItems:0,mediaThumbnailTags:0,mediaContentTags:0,enclosureTags:0,imageMediaContentTags:0,imageEnclosureTags:0,contentEncodedItems:0,descriptionImageTags:0,contentEncodedImageTags:0,itemsWithImageSignals:0};
 const bingRssImageSignals={items:0,sourceUrlItems:0,publisherArticleUrlItems:0,mediaThumbnailTags:0,mediaContentTags:0,enclosureTags:0,imageMediaContentTags:0,imageEnclosureTags:0,contentEncodedItems:0,descriptionImageTags:0,contentEncodedImageTags:0,itemsWithImageSignals:0};
 for(const query of queries){
  try{
   const response=await fetchImpl(newsFeedUrl(query),{headers:{'user-agent':'HaewonArchiveBot/0.2 (public RSS index)'},signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error('HTTP '+response.status);
   const xml=await response.text(),signals=summarizeRssImageSignals(xml);
   for(const [key,value] of Object.entries(signals))rssImageSignals[key]=(rssImageSignals[key]||0)+value;
   incoming.push(...parseRss(xml,query,now));
  }catch(error){failures.push({query,error:String(error?.message||error)});}
 }
 let bingSuccessfulQueries=0;
 for(const query of queries){
  try{
   const response=await fetchImpl(bingNewsFeedUrl(query),{headers:{'user-agent':'HaewonArchiveBot/0.2 (public Bing News RSS)'},signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error('HTTP '+response.status);
   const xml=await response.text(),signals=summarizeBingRssImageSignals(xml);
   for(const [key,value] of Object.entries(signals))bingRssImageSignals[key]=(bingRssImageSignals[key]||0)+value;
   const rows=parseBingNewsRss(xml,query,now);
   incoming.push(...rows);
   bingSuccessfulQueries++;
  }catch(error){bingFailures.push({query,error:String(error?.message||error)});}
 }
 return {incoming,failures,queries:queries.length,successfulQueries:queries.length-failures.length,bingSuccessfulQueries,bingFailures,bingCandidates:incoming.filter(item=>item.discoverySource==='bing-news-rss').length,rssImageSignals,bingRssImageSignals};
}
async function main(){
 const path=resolve(ROOT,'data/discovery.json'),existing=JSON.parse(await readFile(path,'utf8')),now=new Date().toISOString();
 const queriesList=getDailySearches();
 const {incoming,failures,queries,successfulQueries,bingSuccessfulQueries,bingFailures,bingCandidates,rssImageSignals,bingRssImageSignals}=await collectFeeds({queries:queriesList,now});

 if(successfulQueries===0&&bingSuccessfulQueries===0){
  await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:summarizeQueryPerformance([],queriesList,now),requestedQueries:queries,successfulQueries,bingSuccessfulQueries,bingCandidates,bingFailedQueries:bingFailures.map(x=>({query:x.query,error:x.error})),failedQueries:failures.map(x=>({query:x.query,error:x.error})),rssImageSignals,bingRssImageSignals,fetched:0,uniqueIncoming:0,added:0,totalCandidates:existing.length},null,2)+'\n');
  console.warn(JSON.stringify({status:'skipped',reason:'all-news-feeds-unavailable',queries,successfulQueries,failedQueries:failures,existingCandidatesPreserved:existing.length}));
  return;
 }
 const merged=mergeCandidates(existing,incoming);
 const thumbnailEnrichment=await enrichThumbnails(merged,{offset:Math.floor(Date.now()/21600000)});
 const mergedWithThumbnails=thumbnailEnrichment.items;
 const existingUrls=new Set(existing.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const uniqueIncoming=new Set(incoming.map(item=>item?.url?.toLowerCase()).filter(Boolean));
 const added=[...uniqueIncoming].filter(url=>!existingUrls.has(url)).length;
 const perQuery=summarizeQueryPerformance(incoming,queriesList,now);
 const rssImageCandidateRows=incoming.flatMap(item=>item.thumbnailCandidates||[]);
 const rssImageCandidateSources=Object.fromEntries(rssImageCandidateRows.reduce((map,candidate)=>map.set(candidate.source,(map.get(candidate.source)||0)+1),new Map()));
 const incomingMerged=mergeCandidates([],incoming);
 const deduplicationComparison={before:incoming.length,after:incomingMerged.length,collapsed:Math.max(0,incoming.length-incomingMerged.length),method:'normalized exact headline first; canonical URL fallback'};
 await writeFile(path,JSON.stringify(mergedWithThumbnails,null,2)+'\n');
 await writeFile(resolve(ROOT,'data/news-collection-status.json'),JSON.stringify({schemaVersion:'1.0.0',collectedAt:now,searchPack:SEARCH_PACKS.findIndex(pack=>JSON.stringify(pack)===JSON.stringify(queriesList)),queries:perQuery,requestedQueries:queries,successfulQueries,bingSuccessfulQueries,bingCandidates,bingFailedQueries:bingFailures.map(x=>({query:x.query,error:x.error})),failedQueries:failures.map(x=>({query:x.query,error:x.error})),fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,rssImageSignals,bingRssImageSignals,rssImageCandidateArticles:incoming.filter(item=>(item.thumbnailCandidates||[]).length>0).length,rssImageCandidatesTotal:rssImageCandidateRows.length,rssImageCandidateSources,thumbnailEnrichment:{attempted:thumbnailEnrichment.attempted,found:thumbnailEnrichment.found,assigned:thumbnailEnrichment.assigned,duplicateRejected:thumbnailEnrichment.duplicateRejected,wrapperOnly:thumbnailEnrichment.wrapperOnly,missing:thumbnailEnrichment.missing,failed:thumbnailEnrichment.failed,results:thumbnailEnrichment.results.map(({id,status,candidate,candidates,assigned,publisherArticleUrl,sourceUrl,resolvedArticleUrl,resolvedArticleHost})=>({id,status,candidate,candidates,assigned,publisherArticleUrl,sourceUrl,resolvedArticleUrl,resolvedArticleHost}))},deduplicationComparison,totalCandidates:merged.length},null,2)+'\n');
 console.log(JSON.stringify({queries,successfulQueries,bingSuccessfulQueries,bingCandidates,bingFailures,failedQueries:failures,rssImageSignals,bingRssImageSignals,fetched:incoming.length,uniqueIncoming:uniqueIncoming.size,added,duplicates:incoming.length-uniqueIncoming.size,thumbnailEnrichment,total:merged.length}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e);process.exitCode=1});