import test from 'node:test';
import assert from 'node:assert/strict';
import {createThumbnailReviewKey,summarizeThumbnailReviews,validateThumbnailReviewExport,mergeThumbnailReviewLabels,getThumbnailReviewCandidates,findNextUnreviewedThumbnail} from '../js/thumbnail-review.mjs';
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
