import test from 'node:test';
import assert from 'node:assert/strict';
import {createThumbnailReviewKey,summarizeThumbnailReviews} from '../js/thumbnail-review.mjs';
test('thumbnail review key is article-specific even for a repeated image URL',()=>{assert.notEqual(createThumbnailReviewKey('a','https://img.test/x.jpg'),createThumbnailReviewKey('b','https://img.test/x.jpg'));});
test('candidate precision and selected-thumbnail precision are calculated separately',()=>{
 const items=[{id:'a',thumbnailUrl:'https://img.test/a.jpg',thumbnailMetaCandidates:[{url:'https://img.test/alt.jpg'}]},{id:'b',thumbnailUrl:'https://img.test/b.jpg'},{id:'c',thumbnailUrl:'https://img.test/c.jpg'},{id:'d',thumbnailUrl:''}];
 const labels={'a|https://img.test/a.jpg':{label:'relevant'},'a|https://img.test/alt.jpg':{label:'unrelated'},'b|https://img.test/b.jpg':{label:'generic'},'c|https://img.test/c.jpg':{label:'uncertain'}};
 const result=summarizeThumbnailReviews(items,labels);
 assert.equal(result.eligible,4);assert.equal(result.reviewed,4);assert.equal(result.reviewCoverage,100);
 assert.equal(result.precision,33);assert.equal(result.selectedPrecision,50);assert.equal(result.excluded,1);
});
test('no reviewed determinate images reports precision as unmeasured',()=>{assert.equal(summarizeThumbnailReviews([{id:'a',thumbnailUrl:'https://img.test/a.jpg'}],{}).precision,null);});
