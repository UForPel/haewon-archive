export function createThumbnailReviewKey(articleId,imageUrl){return String(articleId||'')+'|'+String(imageUrl||'');}
const REVIEW_LABELS=['relevant','unrelated','generic','broken','rights-unclear','uncertain'];
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
  const candidates=[...(item.thumbnailCandidates||[]),...(item.thumbnailMetaCandidates||[]),...(item.thumbnailUrl?[{url:item.thumbnailUrl}]:[])];
  for(const candidate of candidates)if(/^https:\/\//i.test(String(candidate?.url||'')))candidateKeys.add(createThumbnailReviewKey(item.id,candidate.url));
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
