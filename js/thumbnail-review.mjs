export function createThumbnailReviewKey(articleId,imageUrl){return String(articleId||'')+'|'+String(imageUrl||'');}
export function summarizeThumbnailReviews(items=[],labels={}){
 const eligible=items.filter(item=>/^https:\/\//i.test(String(item.thumbnailUrl||'')));
 const rows=eligible.map(item=>labels[createThumbnailReviewKey(item.id,item.thumbnailUrl)]).filter(Boolean);
 const counts={relevant:0,unrelated:0,generic:0,broken:0,'rights-unclear':0,uncertain:0};
 for(const row of rows)if(Object.hasOwn(counts,row.label))counts[row.label]++;
 const unsuitable=counts.unrelated+counts.generic+counts.broken;
 const decided=counts.relevant+unsuitable;
 return {eligible:eligible.length,reviewed:rows.length,relevant:counts.relevant,unsuitable,excluded:counts['rights-unclear']+counts.uncertain,precision:decided?Math.round(counts.relevant/decided*100):null,counts};
}
