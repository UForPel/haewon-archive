import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const readJson=async path=>JSON.parse(await readFile(resolve(ROOT,path),'utf8'));
export function summarizeCollection({videos=[],discovery=[],newsStatus={},videoStatus={},reviews=[]}={}){
 const sources=new Map();
 for(const item of discovery){
  const source=String(item.sourceName||item.discoverySource||'출처 미상');
  const row=sources.get(source)||{source,items:0,withUrl:0,withThumbnail:0,withDate:0};
  row.items++; if(/^https?:\/\//i.test(item.url||''))row.withUrl++; if(/^https?:\/\//i.test(item.thumbnailUrl||''))row.withThumbnail++; if(Date.parse(item.publishedAt||item.discoveredAt||''))row.withDate++;
  sources.set(source,row);
 }
 const categories=discovery.reduce((acc,item)=>{const c=String(item.category||item.categories||'unclassified');acc[c]=(acc[c]||0)+1;return acc;},{});
 const reviewed=reviews.filter(r=>typeof r.expectedCategory==='string'&&r.expectedCategory.trim());
 const correct=reviewed.filter(r=>String(r.actualCategory||'')===r.expectedCategory).length;
 return {generatedAt:new Date().toISOString(),collection:{newsQueriesRequested:newsStatus.requestedQueries||0,newsQueriesSuccessful:newsStatus.successfulQueries||0,newsQuerySuccessRate:newsStatus.requestedQueries?Math.round((newsStatus.successfulQueries/newsStatus.requestedQueries)*100):null,youtubeStatus:videoStatus.status||'unknown',videosTotal:videos.length,newsCandidatesTotal:discovery.length,newsUniqueFetched:newsStatus.uniqueIncoming||0,newsAddedLastRun:newsStatus.added||0,duplicateBeforeMergeLastRun:newsStatus.fetched?Math.max(0,newsStatus.fetched-newsStatus.uniqueIncoming):null,duplicateAfterMergeEstimate:newsStatus.totalCandidates?Math.max(0,newsStatus.uniqueIncoming+newsStatus.totalCandidates-discovery.length):null},sources:[...sources.values()].map(s=>({...s,urlCoverage:s.items?Math.round(s.withUrl/s.items*100):0,thumbnailCoverage:s.items?Math.round(s.withThumbnail/s.items*100):0,dateCoverage:s.items?Math.round(s.withDate/s.items*100):0})).sort((a,b)=>b.items-a.items),classification:{items:discovery.length,categoryCoverage:discovery.length?Math.round(discovery.filter(item=>item.category||item.categories).length/discovery.length*100):0,categoryCounts:categories,reviewedSamples:reviewed.length,accuracy:reviewed.length?Math.round(correct/reviewed.length*100):null,accuracyLabel:reviewed.length?'human-reviewed accuracy':'not measured (no category review labels)'},linkAudit:{status:'not run by this metrics script',checked:0,broken:[],note:'Network link audit is separate and should be bounded/explicit.'}};
}
async function main(){
 const [videos,discovery,newsStatus,videoStatus,reviews]=await Promise.all(['data/videos.json','data/discovery.json','data/news-collection-status.json','data/collection-status.json','data/category-reviews.json'].map(async path=>{try{return await readJson(path)}catch{return path.endsWith('category-reviews.json')?[]:{}}}));
 const report=summarizeCollection({videos,discovery,newsStatus,videoStatus,reviews});
 await writeFile(resolve(ROOT,'data/quality-metrics.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({sourceCount:report.sources.length,items:report.collection.newsCandidatesTotal,classificationAccuracy:report.classification.accuracy,accuracySamples:report.classification.reviewedSamples}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
