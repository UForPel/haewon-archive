import test from 'node:test';
import assert from 'node:assert/strict';
import {createThumbnailReviewKey,summarizeThumbnailReviews,validateThumbnailReviewExport,mergeThumbnailReviewLabels,getThumbnailReviewCandidates,findNextUnreviewedThumbnail,groupRepeatedThumbnailAssignments,summarizeRepeatedThumbnailGroup,findNextUnreviewedInRepeatedGroup,persistThumbnailReviewLabels,revealThumbnailReviewRow} from '../js/thumbnail-review.mjs';
import {summarizeCollection} from '../scripts/quality-metrics.mjs';
const article={id:'article-1',thumbnailUrl:'https://cdn.example/a.jpg',thumbnailCandidates:[{url:'https://cdn.example/a.jpg',source:'media:thumbnail'},{url:'https://cdn.example/b.jpg',source:'og:image'}]};
test('review keys are article-specific even for a shared image URL',()=>{assert.notEqual(createThumbnailReviewKey('article-1','https://cdn.example/a.jpg'),createThumbnailReviewKey('article-2','https://cdn.example/a.jpg'));});
test('candidate and selected-thumbnail precision are measured separately',()=>{const labels={[createThumbnailReviewKey('article-1','https://cdn.example/a.jpg')]:{articleId:'article-1',imageUrl:'https://cdn.example/a.jpg',label:'relevant'},[createThumbnailReviewKey('article-1','https://cdn.example/b.jpg')]:{articleId:'article-1',imageUrl:'https://cdn.example/b.jpg',label:'unrelated'}};const result=summarizeThumbnailReviews([article],labels);assert.equal(result.eligible,2);assert.equal(result.reviewed,2);assert.equal(result.precision,50);assert.equal(result.selectedPrecision,100);});
test('review JSON import/export validates and round-trips',()=>{const key=createThumbnailReviewKey('article-1','https://cdn.example/a.jpg');const exported={schemaVersion:1,labels:{[key]:{articleId:'article-1',imageUrl:'https://cdn.example/a.jpg',source:'og:image',label:'relevant',reviewedAt:'2026-11-24T00:00:00.000Z'}}};const parsed=validateThumbnailReviewExport(JSON.stringify(exported));assert.deepEqual(parsed.labels,exported.labels);assert.deepEqual(mergeThumbnailReviewLabels({},parsed.labels),exported.labels);assert.throws(()=>validateThumbnailReviewExport('{bad json'));});

test('quality report exposes persisted image labels under a non-colliding metrics key',()=>{const key=createThumbnailReviewKey('article-1','https://cdn.example/a.jpg');const report=summarizeCollection({discovery:[article],thumbnailReviews:{[key]:{articleId:'article-1',imageUrl:'https://cdn.example/a.jpg',label:'relevant'}}});assert.equal(report.thumbnailReviewMetrics.reviewed,1);assert.equal(report.thumbnailReviewMetrics.eligible,2);});

test('review candidate list is HTTPS-only and deduplicated by article image URL',()=>{
 const rows=getThumbnailReviewCandidates({id:'a',thumbnailCandidates:[{url:'https://img.test/a.jpg',source:'rss'},{url:'https://img.test/a.jpg',source:'og:image'},{url:'http://img.test/b.jpg',source:'http'}],thumbnailMetaCandidates:[{url:'https://img.test/c.jpg',source:'og:image'}],thumbnailUrl:'https://img.test/c.jpg'});
 assert.deepEqual(rows.map(row=>row.url),['https://img.test/a.jpg','https://img.test/c.jpg']);
});
test('next-unreviewed queue scans beyond the current page and skips every saved label',()=>{
 const items=Array.from({length:15},(_,index)=>({id:'article-'+index,thumbnailCandidates:[{url:'https://img.test/'+index+'.jpg',source:'og:image'}]}));
 const labels={};
 for(let index=0;index<13;index++){const key=createThumbnailReviewKey('article-'+index,'https://img.test/'+index+'.jpg');labels[key]={label:'relevant'};}
 const next=findNextUnreviewedThumbnail(items,labels);
 assert.equal(next.itemIndex,13);assert.equal(next.itemId,'article-13');assert.equal(next.imageUrl,'https://img.test/13.jpg');
});
test('next-unreviewed queue treats uncertain and rights-unclear as reviewed decisions',()=>{
 const items=[{id:'a',thumbnailUrl:'https://img.test/a.jpg'}];
 const labels={[createThumbnailReviewKey('a','https://img.test/a.jpg')]:{label:'uncertain'}};
 assert.equal(findNextUnreviewedThumbnail(items,labels),null);
});

test('repeated thumbnail groups preserve article records and never pool article labels',()=>{
 const url='https://img.test/shared.jpg';
 const items=[{id:'a',thumbnailUrl:url,title:'A'},{id:'b',thumbnailUrl:url,title:'B'},{id:'c',thumbnailUrl:'https://img.test/unique.jpg'}];
 const groups=groupRepeatedThumbnailAssignments(items);
 assert.equal(groups.length,1);assert.equal(groups[0].count,2);assert.deepEqual(groups[0].records.map(row=>row.id),['a','b']);
 const labels={[createThumbnailReviewKey('a',url)]:{label:'relevant'}};
 const summary=summarizeRepeatedThumbnailGroup(groups[0],labels);
 assert.equal(summary.reviewed,1);assert.equal(summary.pending,1);assert.equal(summary.reviewCoverage,50);
 assert.equal(findNextUnreviewedInRepeatedGroup(groups[0],labels).itemId,'b');
});
test('repeated thumbnail grouping accepts only HTTPS and normalizes URL fragments',()=>{
 const groups=groupRepeatedThumbnailAssignments([{id:'a',thumbnailUrl:'https://img.test/a.jpg#one'},{id:'b',thumbnailUrl:'https://img.test/a.jpg#two'},{id:'c',thumbnailUrl:'http://img.test/a.jpg'}]);
 assert.equal(groups.length,1);assert.equal(groups[0].count,2);assert.equal(groups[0].url,'https://img.test/a.jpg');
});


test('failed thumbnail label persistence preserves the last committed labels',()=>{
 const previous={'article-1|https://img.test/a.jpg':{articleId:'article-1',imageUrl:'https://img.test/a.jpg',label:'relevant'}};
 const next={...previous,'article-2|https://img.test/b.jpg':{articleId:'article-2',imageUrl:'https://img.test/b.jpg',label:'unrelated'}};
 const storage={setItem(){const error=new Error('quota');error.name='QuotaExceededError';throw error;}};
 const result=persistThumbnailReviewLabels(storage,'reviews',previous,next);
 assert.equal(result.saved,false);
 assert.equal(result.error,'QuotaExceededError');
 assert.deepEqual(result.labels,previous);
 assert.deepEqual(previous,{'article-1|https://img.test/a.jpg':{articleId:'article-1',imageUrl:'https://img.test/a.jpg',label:'relevant'}});
});

test('successful thumbnail label persistence commits the complete next label map',()=>{
 let written='';
 const storage={setItem(key,value){assert.equal(key,'reviews');written=value;}};
 const previous={};
 const next={'article-1|https://img.test/a.jpg':{articleId:'article-1',imageUrl:'https://img.test/a.jpg',label:'relevant'}};
 const result=persistThumbnailReviewLabels(storage,'reviews',previous,next);
 assert.equal(result.saved,true);
 assert.deepEqual(result.labels,next);
 assert.deepEqual(JSON.parse(written),next);
});


test('review queue opens the collapsed image-candidate disclosure before focusing a row',()=>{
 const disclosure={open:false};
 const row={closest(selector){assert.equal(selector,'details.thumbnail-review-disclosure');return disclosure;}};
 assert.equal(revealThumbnailReviewRow(row),true);
 assert.equal(disclosure.open,true);
 assert.equal(revealThumbnailReviewRow({closest(){return null;}}),false);
 assert.equal(revealThumbnailReviewRow(null),false);
});
