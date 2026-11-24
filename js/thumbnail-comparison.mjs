export function compareThumbnailCandidates(items=[], enrichmentResults=[]) {
 const resultsById=new Map(enrichmentResults.map(row=>[String(row.id||''),row]));
 const sourceCounts={},hostCounts={},urlCounts={};
 let compared=0,rssOnly=0,metaOnly=0,both=0,matchedUrl=0,assigned=0,foundMeta=0;
 const rows=[];
 for(const item of items){
  const rss=(item.thumbnailCandidates||[]).filter(c=>/^rss|^media:|^enclosure|^rss-description/i.test(String(c.source||'')));
  const metaResult=resultsById.get(String(item.id||''));
  const persistedMeta=(item.thumbnailMetaCandidates||[]).filter(c=>/^og:image|^twitter:image/i.test(String(c.source||'')));\n  const meta=(persistedMeta.length?persistedMeta:(metaResult?.candidates||[])).filter(c=>/^og:image|^twitter:image/i.test(String(c.source||'')));
  const unique=(list)=>{const seen=new Set();return list.filter(c=>{try{const u=new URL(c.url);if(u.protocol!=='https:')return false;u.hash='';if(seen.has(u.href))return false;seen.add(u.href);return true;}catch{return false;}});};
  const r=unique(rss),m=unique(meta);
  if(!r.length&&!m.length)continue;
  compared++;if(r.length&&m.length)both++;else if(r.length)rssOnly++;else metaOnly++;
  const rssUrls=new Set(r.map(c=>normalized(c.url))),metaUrls=new Set(m.map(c=>normalized(c.url)));
  const overlap=[...rssUrls].filter(u=>metaUrls.has(u)).length;if(overlap)matchedUrl++;
  for(const c of [...r,...m]){sourceCounts[c.source]=(sourceCounts[c.source]||0)+1;try{const host=new URL(c.url).hostname.toLowerCase();hostCounts[host]=(hostCounts[host]||0)+1;}catch{}}
  rows.push({id:item.id,title:item.title||'',articleUrl:item.url||'',rssCandidates:r,metaCandidates:m,sharedUrls:[...rssUrls].filter(u=>metaUrls.has(u)),assigned:Boolean(metaResult?.assigned),metaStatus:metaResult?.status||'not-attempted'});
  if(metaResult?.found||m.length)foundMeta++;if(metaResult?.assigned)assigned++;
 }
 return {articlesCompared:compared,rssOnly,metaOnly,bothSources:both,articlesWithSharedUrl:matchedUrl,metaFound:foundMeta,metaAssigned:assigned,assignmentRate:foundMeta?Math.round(assigned/foundMeta*100):null,sourceCounts:sourceCounts,hostCounts:Object.entries(hostCounts).map(([host,count])=>({host,count})).sort((a,b)=>b.count-a.count),rows:rows.slice(0,100)};
}
function normalized(value){try{const u=new URL(value);u.hash='';return u.href;}catch{return String(value||'');}}
export function buildThumbnailReview(items=[],audit={}){
 const groups=(audit.repeatedUrls||[]).map(group=>({url:group.url,count:group.count,reviewStatus:'review-required',reason:'reused-url; visual relevance and rights not automatically assessed',records:items.filter(item=>normalized(item.thumbnailUrl)===normalized(group.url)).slice(0,300).map(item=>({id:item.id,title:item.title,articleUrl:item.url,thumbnailUrl:item.thumbnailUrl,thumbnailSource:item.thumbnailSource||'unknown'}))}));
 return {generatedAt:new Date().toISOString(),automaticReplacement:false,automaticDeletion:false,groups};
}
