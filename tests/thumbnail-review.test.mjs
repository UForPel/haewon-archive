import test from 'node:test';
import assert from 'node:assert/strict';
import {createThumbnailReviewKey,summarizeThumbnailReviews} from '../js/thumbnail-review.mjs';
test('thumbnail review key is article-specific even for a repeated image URL',()=>{assert.notEqual(createThumbnailReviewKey('a','https://img.test/x.jpg'),createThumbnailReviewKey('b','https://img.test/x.jpg'));});
test('review precision excludes undecided and rights-unclear labels',()=>{const items=[{id:'a',thumbnailUrl:'https://img.test/a.jpg'},{id:'b',thumbnailUrl:'https://img.test/b.jpg'},{id:'c',thumbnailUrl:'https://img.test/c.jpg'},{id:'d',thumbnailUrl:''}];const labels={'a|https://img.test/a.jpg':{label:'relevant'},'b|https://img.test/b.jpg':{label:'generic'},'c|https://img.test/c.jpg':{label:'uncertain'}};const result=summarizeThumbnailReviews(items,labels);assert.equal(result.eligible,3);assert.equal(result.reviewed,3);assert.equal(result.precision,50);assert.equal(result.excluded,1);});
test('no reviewed determinate images reports precision as unmeasured',()=>{assert.equal(summarizeThumbnailReviews([{id:'a',thumbnailUrl:'https://img.test/a.jpg'}],{}).precision,null);});
