import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyDiscoveryCategories, groupDiscoveryDuplicates } from '../js/discovery-kind.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const readJson=async path=>JSON.parse(await readFile(resolve(ROOT,path),'utf8'));
export function summarizeThumbnailUrls(items=[]){
 const urls=new Map(),hosts=new Map();let missingCount=0;
 for(const item of items){let normalized='';try{const url=new URL(item.thumbnailUrl||'');if(url.protocol==='https:'){url.hash='';normalized=url.toString();}}catch{}if(!normalized){missingCount++;continue;}urls.set(normalized,(urls.get(normalized)||0)+1);const host=new URL(normalized).hostname.toLowerCase().replace(/^www\./,'');hosts.set(host,(hosts.get(host)||0)+1);}
 const repeated=[...urls.entries()].filter(([,count])=>count>1).map(([url,count])=>({url,count})).sort((a,b)=>b.count-a.count);
 const heuristicFlags=[...urls.entries()].map(([url,count])=>{const parsed=new URL(url);const suspiciousName=/(?:logo|avatar|icon|favicon|sprite|placeholder|default)/i.test(parsed.pathname);const tinyHint=/(?:w|width|size|sz)=?(?:1|2|3|4|5|6|7|8|9|10|1[0-9]|2[0-4])(?:\b|&|$)|(?:s0-w(?:1[0-9]|2[0-4]))/i.test(parsed.search+parsed.pathname);return {url,count,flags:[...(count>1?['reused-url']:[]),...(suspiciousName?['name-suggests-logo-icon']:[]),...(tinyHint?['small-size-hint']:[])]};}).filter(row=>row.flags.length);
 return {items:items.length,withThumbnail:items.length-missingCount,missing:missingCount,uniqueThumbnailUrls:urls.size,repeatedUrlGroups:repeated.length,repeatedItems:repeated.reduce((sum,row)=>sum+row.count-1,0),repeatedUrls:repeated.slice(0,20),heuristicFlaggedUrls:heuristicFlags.length,heuristicFlags:heuristicFlags.slice(0,20),hosts:[...hosts.entries()].map(([host,count])=>({host,count})).sort((a,b)=>b.count-a.count)});
}
export function summarizeCollection({videos=[],discovery=[],newsStatus={},videoStatus={},reviews=[]}={}){
 const sourceMap=new Map();
 for(const item of discovery){
  const source=String(item.sourceName||item.discoverySource||'출처 미상');
  const row=sourceMap.get(source)||{source,items:0,withUrl:0,withThumbnail:0,withDate:0};
  row.items++;
  if(/^https?:\/\//i.test(item.url||''))row.withUrl++;
  if(/^https?:\/\//i.test(item.thumbnailUrl||''))row.withThumbnail++;
  if(Number.isFinite(Date.parse(item.publishedAt||item.discoveredAt||'')))row.withDate++;
  sourceMap.set(source,row);
 }
 const categoryCounts={};
 const reviewed=reviews.filter(r=>typeof r.expectedCategory==='string'&&r.expectedCategory.trim());
 let correct=0;
 for(const item of discovery){
  for(const category of classifyDiscoveryCategories(item))categoryCounts[category]=(categoryCounts[category]||0)+1;
 }
 for(const review of reviewed)if(classifyDiscoveryCategories({title:review.title||'',description:review.description||'',url:review.url||''}).includes(review.expectedCategory))correct++;
 const sourceRows=[...sourceMap.values()].map(s=>({...s,urlCoverage:s.items?Math.round(s.withUrl/s.items*100):0,thumbnailCoverage:s.items?Math.round(s.withThumbnail/s.items*100):0,dateCoverage:s.items?Math.round(s.withDate/s.items*100):0})).sort((a,b)=>b.items-a.items);
 const fetched=Number(newsStatus.fetched||0), unique=Number(newsStatus.uniqueIncoming||0), deduped=groupDiscoveryDuplicates(discovery);
 const titleKey=item=>String(item.title||'').replace(/<[^>]*>/g,' ').replace(/&amp;/gi,'&').normalize('NFKC').toLocaleLowerCase().replace(/\b(?:youtube|youtu\.be)\b/g,'').replace(/[\p{P}\p{S}\s]+/gu,'').trim();
 const titleGroups=new Map();for(const item of discovery){const key=titleKey(item);if(key.length>=32)titleGroups.set(key,(titleGroups.get(key)||[]).concat(item));}
 const duplicateTitleGroups=[...titleGroups.values()].filter(group=>group.length>1);
 const perCategoryReview={};let exactCorrect=0;
 for(const review of reviewed){const predicted=classifyDiscoveryCategories({title:review.title||'',description:review.description||'',url:review.url||''});const expected=review.expectedCategory;const exact=predicted.length===1&&predicted[0]===expected;if(exact)exactCorrect++;const row=perCategoryReview[expected]||{samples:0,correct:0};row.samples++;if(predicted.includes(expected))row.correct++;perCategoryReview[expected]=row;}
 for(const row of Object.values(perCategoryReview))row.accuracy=row.samples?Math.round(row.correct/row.samples*100):null;
 return {generatedAt:new Date().toISOString(),thumbnailAudit:summarizeThumbnailUrls(discovery),collection:{newsQueriesRequested:Number(newsStatus.requestedQueries||0),newsQueriesSuccessful:Number(newsStatus.successfulQueries||0),newsQuerySuccessRate:newsStatus.requestedQueries?Math.round(newsStatus.successfulQueries/newsStatus.requestedQueries*100):null,youtubeStatus:videoStatus.status||'unknown',videosTotal:videos.length,newsCandidatesTotal:discovery.length,newsUniqueFetched:unique,newsAddedLastRun:Number(newsStatus.added||0),duplicateBeforeMergeLastRun:fetched?Math.max(0,fetched-unique):null,duplicateGroupsCurrent:deduped.length,duplicateItemsCollapsedCurrent:Math.max(0,discovery.length-deduped.length),duplicateTitleGroupsCurrent:duplicateTitleGroups.length,duplicateTitleItemsCollapsedCurrent:duplicateTitleGroups.reduce((sum,group)=>sum+group.length-1,0),deduplicationComparison:newsStatus.deduplicationComparison||{before:discovery.length,after:deduped.length,collapsed:Math.max(0,discovery.length-deduped.length),method:'normalized exact headline first; canonical URL fallback'},thumbnailEnrichment:{attempted:Number(newsStatus.thumbnailEnrichment?.attempted||0),found:Number(newsStatus.thumbnailEnrichment?.found||0),missing:Number(newsStatus.thumbnailEnrichment?.missing||0),failed:Number(newsStatus.thumbnailEnrichment?.failed||0)}},sources:sourceRows,sourceCollectionStatus:[{source:'Google News RSS',requested:Number(newsStatus.requestedQueries||0),successful:Number(newsStatus.successfulQueries||0),successRate:newsStatus.requestedQueries?Math.round(newsStatus.successfulQueries/newsStatus.requestedQueries*100):null},{source:'NMIXX YouTube Atom',requested:1,successful:videoStatus.status==='success'?1:0,successRate:videoStatus.status==='success'?100:0}],classification:{items:discovery.length,categoryCounts,reviewedSamples:reviewed.length,accuracy:reviewed.length?Math.round(correct/reviewed.length*100):null,exactSingleLabelAccuracy:reviewed.length?Math.round(exactCorrect/reviewed.length*100):null,perCategoryReview,accuracyLabel:reviewed.length?'manual-review agreement (expected label included)':'not measured (no category review labels)'},linkAudit:{status:'pending',checked:0,broken:[],thumbnailMissing:discovery.filter(item=>!/^https?:\/\//i.test(item.thumbnailUrl||'')).length}};
}
export async function auditThumbnailResponses(items,{fetchImpl=fetch,limit=12,timeoutMs=3500,concurrency=3}={}){
 const urls=[...new Set(items.map(item=>item.thumbnailUrl).filter(url=>/^https?:\\/\\//i.test(String(url||''))))].slice(0,limit);
 const results=new Array(urls.length);let cursor=0;
 async function worker(){while(true){const index=cursor++;if(index>=urls.length)return;const url=urls[index];try{
  const response=await fetchImpl(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});
  const type=response.headers?.get?.('content-type')||'';
  results[index]={url,status:response.status,contentType:type,ok:response.status>=200&&response.status<400,isImage:/^image\\//i.test(type)};
 }catch(error){results[index]={url,status:null,contentType:'',ok:false,isImage:false,error:String(error?.message||error)};}}}
 await Promise.all(Array.from({length:Math.min(concurrency,urls.length)},worker));
 return {sampledUniqueUrls:urls.length,checked:results.length,nonImage:results.filter(row=>row.status!==null&&!row.isImage&&row.status>=200&&row.status<400),broken:results.filter(row=>[404,410].includes(row.status)),unreachable:results.filter(row=>row.status===null),rateLimited:results.filter(row=>row.status===429),results};
}
export async function auditLinks(items,{fetchImpl=fetch,limit=40,timeoutMs=3500,concurrency=5}={}){
 const unique=new Map();
 for(const item of items.slice(0,limit)){
  for(const [kind,url] of [['article',item.url],['thumbnail',item.thumbnailUrl]])if(/^https?:\/\//i.test(String(url||''))&&!unique.has(url))unique.set(url,{kind,url});
 }
 const targets=[...unique.values()],results=new Array(targets.length);
 let cursor=0;
 async function worker(){
  while(true){
   const index=cursor++;if(index>=targets.length)return;
   const target=targets[index];
   try{
    const response=await fetchImpl(target.url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});
    let status=response.status;
    if(status===405||status===403){const fallback=await fetchImpl(target.url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});status=fallback.status;}
    results[index]={...target,status,ok:status>=200&&status<400};
   }catch(error){results[index]={...target,status:null,ok:false,error:String(error?.message||error)};}
  }
 }
 await Promise.all(Array.from({length:Math.min(concurrency,targets.length)},worker));
 return {status:'completed',sampledItems:Math.min(items.length,limit),checked:results.length,broken:results.filter(r=>[404,410].includes(r.status)),rateLimited:results.filter(r=>r.status===429).length,unreachable:results.filter(r=>!r.ok&&r.status!==429&&![404,410].includes(r.status)).length,thumbnailMissing:items.filter(item=>!/^https?:/i.test(String(item.thumbnailUrl||''))).length,results};
}
async function main(){
 const [videos,discovery,newsStatus,videoStatus,reviews]=await Promise.all(['data/videos.json','data/discovery.json','data/news-collection-status.json','data/collection-status.json','data/category-reviews.json'].map(async path=>{try{return await readJson(path)}catch{return path.endsWith('category-reviews.json')?[]:{}}}));
 const report=summarizeCollection({videos,discovery,newsStatus,videoStatus,reviews});
 report.linkAudit=await auditLinks(discovery);report.thumbnailResponseAudit=await auditThumbnailResponses(discovery);
 await writeFile(resolve(ROOT,'data/quality-metrics.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({sourceCount:report.sources.length,items:report.collection.newsCandidatesTotal,linkAuditChecked:report.linkAudit.checked,brokenLinks:report.linkAudit.broken.length,classificationAccuracy:report.classification.accuracy,accuracySamples:report.classification.reviewedSamples}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
