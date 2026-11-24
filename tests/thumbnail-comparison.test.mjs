import test from 'node:test';import assert from 'node:assert/strict';
import {compareThumbnailCandidates,buildThumbnailReview} from '../js/thumbnail-comparison.mjs';
test('compares RSS and metadata candidates per article with overlap and source/host counts',()=>{
 const rows=[{id:'a',title:'A',thumbnailCandidates:[{url:'https://rss.test/a.jpg',source:'media:thumbnail'}]},{id:'b',thumbnailCandidates:[{url:'https://same.test/x.jpg',source:'enclosure'}]}];
 const meta=[{id:'a',candidates:[{url:'https://meta.test/a.jpg',source:'og:image'}],found:true,assigned:true,status:'assigned'},{id:'b',candidates:[{url:'https://same.test/x.jpg',source:'og:image'}],found:true,assigned:false,status:'duplicate-rejected'}];
 const report=compareThumbnailCandidates(rows,meta);assert.equal(report.articlesCompared,2);assert.equal(report.bothSources,2);assert.equal(report.articlesWithSharedUrl,1);assert.equal(report.metaFound,2);assert.equal(report.metaAssigned,1);assert.equal(report.assignmentRate,50);assert.equal(report.sourceCounts['media:thumbnail'],1);assert.equal(report.hostCounts.length,3);
});
test('review list is non-destructive and keeps source/article evidence',()=>{
 const items=[{id:'1',title:'Story',url:'https://article.test',thumbnailUrl:'https://img.test/x.jpg',thumbnailSource:'unknown'}];
 const review=buildThumbnailReview(items,{repeatedUrls:[{url:'https://img.test/x.jpg',count:273}]});
 assert.equal(review.automaticDeletion,false);assert.equal(review.automaticReplacement,false);assert.equal(review.groups[0].records[0].articleUrl,'https://article.test');assert.equal(review.groups[0].records[0].thumbnailSource,'unknown');
});
test('ignores non-HTTPS and malformed candidates',()=>{
 const report=compareThumbnailCandidates([{id:'x',thumbnailCandidates:[{url:'http://bad.test/a',source:'media:thumbnail'}]}],[{id:'x',candidates:[{url:'bad',source:'og:image'}]}]);assert.equal(report.articlesCompared,0);
});
