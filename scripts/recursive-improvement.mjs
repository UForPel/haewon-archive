import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEARCH_PACKS, getDailySearches } from './collect-news.mjs';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const ALGORITHM_VERSION='1.1.0';
export function kstDay(date=new Date()){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function buildImprovementCycle({discovery=[],videos=[],newsStatus=null,reviews=[],day=kstDay()}={}){
 const active=getDailySearches(day);
 const counts=new Map();
 for(const item of discovery){
  const q=String(item.query||'');
  if(!q)continue;
  counts.set(q,(counts.get(q)||0)+1);
 }
 const currentCounts=new Map((newsStatus?.queries||[]).map(row=>[row.query,Number(row.uniqueCandidates??row.candidates)||0]));\n const activeYield=active.map(query=>({query,candidates:currentCounts.get(query)||0}));\n const reviewed=reviews.filter(row=>row&&typeof row.query==='string'&&typeof row.relevant==='boolean');\n const relevantCount=reviewed.filter(row=>row.relevant).length;\n const reviewedPrecision=reviewed.length?relevantCount/reviewed.length:null;\n const reviewCounts=new Map();\n for(const row of reviewed){const entry=reviewCounts.get(row.query)||{query:row.query,reviewed:0,relevant:0};entry.reviewed++;if(row.relevant)entry.relevant++;reviewCounts.set(row.query,entry);}\n const perQueryReviews=[...reviewCounts.values()].map(row=>({...row,precision:row.relevant/row.reviewed}));
 const ranked=[...activeYield].sort((a,b)=>b.candidates-a.candidates||a.query.localeCompare(b.query));
 const packIndex=((Math.floor(Date.parse(day+'T00:00:00Z')/86400000)%SEARCH_PACKS.length)+SEARCH_PACKS.length)%SEARCH_PACKS.length;
 return {
  schemaVersion:'1.0.0',algorithm:'bounded-recursive-imitation',algorithmVersion:ALGORITHM_VERSION,day,timeZone:'Asia/Seoul',
  cycle:{packIndex,packCount:SEARCH_PACKS.length,activeQueries:activeYield.map(x=>x.query),nextDayPackIndex:(packIndex+1)%SEARCH_PACKS.length},
  evidence:{discoveryCandidates:discovery.length,uniqueVideoRecords:videos.length,queryYield:activeYield,highestYieldQueries:ranked.slice(0,3).map(x=>x.query)},
  evaluation:{status:'exploratory',precision:'not_measured',coverage:'partial_proxy',reason:'No human-reviewed relevance labels or query-level false-positive labels are available yet.'},
  adaptation:{applied:'date-based query-pack rotation only',automaticPromotion:false,destructiveFiltering:false,protectedRules:['source permissions','privacy','attribution','deduplication','candidate retention'],nextImprovement:'Collect query-level reviewed precision and false-positive labels before adaptive ranking.'}
 };
}
async function main(){
 const [discovery,videos,newsStatus,reviews]=await Promise.all([
  readFile(resolve(ROOT,'data/discovery.json'),'utf8').then(JSON.parse),
  readFile(resolve(ROOT,'data/videos.json'),'utf8').then(JSON.parse)
 ]);
 const report=buildImprovementCycle({discovery,videos});
 const path=resolve(ROOT,'data/improvement-cycle.json');
 await writeFile(path,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({algorithm:report.algorithm,version:report.algorithmVersion,day:report.day,pack:report.cycle.packIndex,queries:report.cycle.activeQueries.length,candidates:report.evidence.discoveryCandidates}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error);process.exitCode=1});
