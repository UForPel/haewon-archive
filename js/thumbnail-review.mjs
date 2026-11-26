export function createThumbnailReviewKey(articleId,imageUrl){return String(articleId||'')+'|'+String(imageUrl||'');}
const REVIEW_LABELS=['relevant','unrelated','generic','broken','rights-unclear','uncertain'];
export function getThumbnailReviewCandidates(item={}){
 const rows=[...(item.thumbnailCandidates||[]),...(item.thumbnailMetaCandidates||[]),...(item.thumbnailUrl?[{url:item.thumbnailUrl,source:item.thumbnailSource||'assigned-thumbnail',priority:0}]:[])];
 const seen=new Set(),out=[];
 for(const candidate of rows){const url=String(candidate?.url||'');if(!/^https:\/\//i.test(url)||seen.has(url))continue;seen.add(url);out.push(candidate);}
 return out;
}
export function findNextUnreviewedThumbnail(items=[],labels={}){
 for(let itemIndex=0;itemIndex<items.length;itemIndex++){
  const item=items[itemIndex];
  for(const candidate of getThumbnailReviewCandidates(item)){
   const reviewKey=createThumbnailReviewKey(item.id,candidate.url);
   if(!REVIEW_LABELS.includes(labels[reviewKey]?.label))return {itemIndex,itemId:String(item.id||''),imageUrl:candidate.url,source:candidate.source||'unknown',reviewKey};
  }
 }
 return null;
}
export function groupRepeatedThumbnailAssignments(items=[],minimumCount=2){
 const groups=new Map();
 for(const item of items){
  let url='';try{const parsed=new URL(String(item.thumbnailUrl||''));if(parsed.protocol!=='https:')continue;parsed.hash='';url=parsed.href;}catch{continue;}
  const group=groups.get(url)||{url,count:0,records:[]};group.count++;group.records.push(item);groups.set(url,group);
 }
 return [...groups.values()].filter(group=>group.count>=minimumCount).sort((a,b)=>b.count-a.count||a.url.localeCompare(b.url));
}
export function summarizeRepeatedThumbnailGroup(group={},labels={}){
 const records=Array.isArray(group.records)?group.records:[],counts={relevant:0,unrelated:0,generic:0,broken:0,'rights-unclear':0,uncertain:0};
 for(const item of records){const key=createThumbnailReviewKey(item.id,group.url),label=labels[key]?.label;if(Object.hasOwn(counts,label))counts[label]++;}
 const reviewed=Object.values(counts).reduce((sum,count)=>sum+count,0);
 return {count:records.length,reviewed,pending:Math.max(0,records.length-reviewed),reviewCoverage:records.length?Math.round(reviewed/records.length*100):0,counts};
}
export function findNextUnreviewedInRepeatedGroup(group={},labels={}){
 for(const item of group.records||[]){const reviewKey=createThumbnailReviewKey(item.id,group.url);if(!REVIEW_LABELS.includes(labels[reviewKey]?.label))return {itemId:String(item.id||''),imageUrl:group.url,reviewKey,item};}
 return null;
}
export function validateThumbnailReviewExport(payload){
 const parsed=typeof payload==='string'?JSON.parse(payload):payload;
 if(!parsed||typeof parsed!=='object'||!parsed.labels||typeof parsed.labels!=='object'||Array.isArray(parsed.labels))throw new Error('invalid thumbnail review export');
 const labels={};for(const [key,value] of Object.entries(parsed.labels)){if(!key.includes('|')||!value||typeof value!=='object'||!REVIEW_LABELS.includes(value.label)||!value.articleId||!value.imageUrl)continue;labels[key]={articleId:String(value.articleId),imageUrl:String(value.imageUrl),source:String(value.source||'unknown'),label:value.label,reviewedAt:String(value.reviewedAt||'')};}
 return {schemaVersion:1,labels};
}
export function mergeThumbnailReviewLabels(current={},incoming={}){return {...current,...validateThumbnailReviewExport({schemaVersion:1,labels:incoming}).labels};}
export function summarizeThumbnailReviews(items=[],labels={}){
 const candidateKeys=new Set(),selectedKeys=new Set();
 for(const item of items){
  for(const candidate of getThumbnailReviewCandidates(item))candidateKeys.add(createThumbnailReviewKey(item.id,candidate.url));
  if(/^https:\/\//i.test(String(item.thumbnailUrl||'')))selectedKeys.add(createThumbnailReviewKey(item.id,item.thumbnailUrl));
 }
 const valid=key=>labels[key]&&['relevant','unrelated','generic','broken','rights-unclear','uncertain'].includes(labels[key].label);
 const reviewed=[...candidateKeys].filter(valid);
 const selectedReviewed=[...selectedKeys].filter(valid);
 const counts={relevant:0,unrelated:0,generic:0,broken:0,'rights-unclear':0,uncertain:0};
 const selectedCounts={relevant:0,unrelated:0,generic:0,broken:0,'rights-unclear':0,uncertain:0};
 for(const key of reviewed)counts[labels[key].label]++;
 for(const key of selectedReviewed)selectedCounts[labels[key].label]++;
 const unsuitable=counts.unrelated+counts.generic+counts.broken;
 const decided=counts.relevant+unsuitable;
 const selectedUnsuitable=selectedCounts.unrelated+selectedCounts.generic+selectedCounts.broken;
 const selectedDecided=selectedCounts.relevant+selectedUnsuitable;
 return {eligible:candidateKeys.size,reviewed:reviewed.length,reviewCoverage:candidateKeys.size?Math.round(reviewed.length/candidateKeys.size*100):0,relevant:counts.relevant,unsuitable,excluded:counts['rights-unclear']+counts.uncertain,precision:decided?Math.round(counts.relevant/decided*100):null,selectedEligible:selectedKeys.size,selectedReviewed:selectedReviewed.length,selectedPrecision:selectedDecided?Math.round(selectedCounts.relevant/selectedDecided*100):null,counts,selectedCounts};
}

export function persistThumbnailReviewLabels(storage, storageKey, currentLabels, nextLabels) {
 try {
  storage.setItem(storageKey, JSON.stringify(nextLabels));
  return { saved: true, labels: nextLabels };
 } catch (error) {
  return { saved: false, labels: currentLabels, error: String(error?.name || 'storage-error') };
 }
}

export function revealThumbnailReviewRow(row) {
 if (!row || typeof row.closest !== 'function') return false;
 const disclosure = row.closest('details.thumbnail-review-disclosure');
 if (!disclosure) return false;
 disclosure.open = true;
 return true;
}
