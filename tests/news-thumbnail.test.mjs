import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRssThumbnail, extractRssThumbnailCandidates, parseRss, canonicalCandidateUrl, mergeCandidates, extractOpenGraphImage, extractOpenGraphImageCandidates, enrichThumbnails } from '../scripts/collect-news.mjs';

test('extracts image from media thumbnail metadata',()=>{
 assert.equal(extractRssThumbnail('<media:thumbnail url="https://cdn.example/news.jpg"/>'),'https://cdn.example/news.jpg');
});
test('extracts image from decoded RSS description markup',()=>{
 assert.equal(extractRssThumbnail('', '&lt;img src=&quot;https://cdn.example/story.jpg&quot;&gt;'),'https://cdn.example/story.jpg');
});
test('rejects insecure and logo-like thumbnail candidates',()=>{
 assert.equal(extractRssThumbnail('<media:thumbnail url="http://cdn.example/a.jpg"/>'),'');
 assert.equal(extractRssThumbnail('<media:thumbnail url="https://cdn.example/logo.png"/>'),'');
});
test('parseRss includes extracted thumbnail from item description',()=>{
 const xml='<rss><channel><item><title>Haewon news</title><link>https://news.example/article</link><description><![CDATA[<img src="https://cdn.example/photo.jpg">]]></description></item></channel></rss>';
 const [item]=parseRss(xml,'test query','2026-11-24T00:00:00Z');
 assert.equal(item.thumbnailUrl,'https://cdn.example/photo.jpg');
});

test('canonical URL removes tracking parameters and fragments for deduplication',()=>{
 assert.equal(canonicalCandidateUrl('https://www.example.com/a?utm_source=x&b=2#section'),'https://example.com/a?b=2');
 const merged=mergeCandidates([{url:'https://www.example.com/story?utm_campaign=one',title:'Story'}],[{url:'https://example.com/story?utm_source=two',title:'Story updated'}]);
 assert.equal(merged.length,1);
 assert.equal(merged[0].title,'Story');
});

test('extracts safe OpenGraph image metadata',()=>{
 assert.equal(extractOpenGraphImage('<meta property="og:image" content="https://cdn.example/preview.jpg">'),'https://cdn.example/preview.jpg');
 assert.equal(extractOpenGraphImage('<meta name="twitter:image" content="http://cdn.example/preview.jpg">'),'');
 assert.equal(extractOpenGraphImage('<meta property="og:image" content="https://cdn.example/logo.png">'),'');
});
test('enriches bounded missing thumbnails from publisher metadata',async()=>{
 let calls=0;
 const items=[{id:'1',url:'https://news.google.com/rss/articles/a',publisherArticleUrl:'https://publisher.example/article/a',thumbnailUrl:''},{id:'2',url:'https://news.google.com/rss/articles/b',thumbnailUrl:'https://existing.test/x.jpg'},{id:'3',url:'https://other.test/article',thumbnailUrl:''}];
 const report=await enrichThumbnails(items,{limit:1,fetchImpl:async()=>{calls++;return {ok:true,status:200,url:'https://publisher.example/article',text:async()=>'<meta property="og:image" content="https://cdn.example/new.jpg">'}}});
 assert.equal(calls,1);assert.equal(report.attempted,1);assert.equal(report.found,1);assert.equal(report.items[0].thumbnailUrl,'https://cdn.example/new.jpg');assert.equal(report.items[1].thumbnailUrl,'https://existing.test/x.jpg');assert.equal(report.items[2].thumbnailUrl,'');
});
test('thumbnail enrichment keeps candidate on fetch error',async()=>{
 const report=await enrichThumbnails([{id:'x',url:'https://news.google.com/rss/articles/x',publisherArticleUrl:'https://publisher.example/article/x',thumbnailUrl:''}],{fetchImpl:async()=>{throw new Error('blocked')}});
 assert.equal(report.items.length,1);assert.equal(report.items[0].thumbnailUrl,'');assert.equal(report.failed,1);
});

test('thumbnail backfill rotates selection by offset and stays bounded',async()=>{const items=Array.from({length:5},(_,i)=>({id:String(i),url:'https://news.google.com/rss/articles/'+i,publisherArticleUrl:'https://publisher.example/article/'+i,thumbnailUrl:''}));const visited=[];const report=await enrichThumbnails(items,{limit:2,offset:3,fetchImpl:async url=>{visited.push(url);return {ok:true,status:200,text:async()=>'<meta property="og:image" content="https://cdn.example/'+visited.length+'.jpg">'}}});assert.equal(report.attempted,2);assert.equal(visited.length,2);assert.ok(visited[0].endsWith('/3'));assert.ok(visited[1].endsWith('/4'));});
test('collector merges long normalized headlines across distinct RSS redirect URLs',()=>{const first={url:'https://news.google.com/rss/articles/token1',title:'Same headline — a sufficiently long news article about Haewon'};const second={url:'https://news.google.com/rss/articles/token2',title:'Same headline a sufficiently long news article about Haewon'};const merged=mergeCandidates([first],[second]);assert.equal(merged.length,1);assert.equal(merged[0].url,first.url);});
test('duplicate merge retains thumbnail and metadata from incoming candidate',()=>{const merged=mergeCandidates([{url:'https://news.google.com/rss/articles/old',title:'Long headline with enough characters to identify one article exactly',thumbnailUrl:'',description:'short'}],[{url:'https://news.google.com/rss/articles/new',title:'Long headline with enough characters to identify one article exactly',thumbnailUrl:'https://cdn.example/photo.jpg',description:'longer description text'}]);assert.equal(merged.length,1);assert.equal(merged[0].thumbnailUrl,'https://cdn.example/photo.jpg');assert.equal(merged[0].description,'longer description text');});
test('collector dedupe aliases canonical URL even when headline keys differ',()=>{const merged=mergeCandidates([{url:'https://news.google.com/rss/articles/shared',title:'Long first headline about Haewon that is distinct and valid'},{url:'https://news.google.com/rss/articles/shared',title:'Long second headline about Haewon that is distinct and valid'}],[]);assert.equal(merged.length,1);});
test('merge preserves RSS publisher source and explicit article URL provenance',()=>{const merged=mergeCandidates([{url:'https://news.google.com/rss/articles/shared',title:'A long enough headline to merge publisher metadata across refreshes'}],[{url:'https://news.google.com/rss/articles/shared',title:'A long enough headline to merge publisher metadata across refreshes',sourceUrl:'https://publisher.example/',publisherArticleUrl:'https://publisher.example/article/1'}]);assert.equal(merged[0].sourceUrl,'https://publisher.example/');assert.equal(merged[0].publisherArticleUrl,'https://publisher.example/article/1');});

test('thumbnail enrichment does not assign one image URL to multiple newly enriched candidates',async()=>{
 const items=[{id:'a',url:'https://news.google.com/rss/articles/a',thumbnailUrl:''},{id:'b',url:'https://news.google.com/rss/articles/b',thumbnailUrl:''}];
 const report=await enrichThumbnails(items.map(item=>({...item,publisherArticleUrl:'https://publisher.example/article/'+item.id})),{limit:2,fetchImpl:async()=>({ok:true,status:200,url:'https://publisher.example/article',text:async()=>'<meta property="og:image" content="https://cdn.example/shared.jpg">'})});
 assert.equal(report.found,2);assert.equal(report.assigned,1);assert.equal(report.duplicateRejected,1);assert.equal(report.items.filter(item=>item.thumbnailUrl).length,1);
});


test('RSS image candidates retain source provenance',()=>{
 const raw='<media:thumbnail url="https://cdn.example/a.jpg"/><media:content url="https://cdn.example/b.jpg" type="image/jpeg"/><enclosure url="https://cdn.example/c.jpg" type="image/jpeg"/>';
 const candidates=extractRssThumbnailCandidates(raw,'&lt;img src=&quot;https://cdn.example/d.jpg&quot;&gt;');
 assert.deepEqual(candidates.map(c=>c.source),['media:thumbnail','media:content','enclosure','rss-description-html']);
 assert.equal(extractRssThumbnail(raw),'https://cdn.example/a.jpg');
});
test('OG and Twitter candidates preserve metadata provenance',()=>{
 const candidates=extractOpenGraphImageCandidates('<meta property="og:image" content="https://cdn.example/a.jpg"><meta name="twitter:image" content="https://cdn.example/b.jpg">');
 assert.deepEqual(candidates.map(c=>c.source),['og:image','twitter:image']);
});
test('unique enriched thumbnails record source candidate and assignment status',async()=>{
 const report=await enrichThumbnails([{id:'a',url:'https://publisher.example/article/a',publisherArticleUrl:'https://publisher.example/article/a',thumbnailUrl:''}],{fetchImpl:async()=>({ok:true,status:200,url:'https://publisher.example/article/a',text:async()=>'<meta property="og:image" content="https://cdn.example/a.jpg"><meta name="twitter:image" content="https://cdn.example/b.jpg">'})});
 assert.equal(report.assigned,1);assert.equal(report.items[0].thumbnailSource,'og:image');assert.equal(report.results[0].status,'assigned');assert.equal(report.results[0].candidate.source,'og:image');
});


test('RSS candidates and selected thumbnail carry source provenance',()=>{
 const xml='<rss><channel><item><title>Haewon story</title><link>https://news.example/article</link><media:thumbnail url="https://cdn.example/rss.jpg"/><description><![CDATA[<img src="https://cdn.example/description.jpg">]]></description></item></channel></rss>';
 const [item]=parseRss(xml,'query','2026-11-24T00:00:00Z');assert.equal(item.thumbnailSource,'media:thumbnail');assert.deepEqual(item.thumbnailCandidates.map(c=>c.source),['media:thumbnail','rss-description-html']);
});

test('Google News wrapper URLs are never fetched without explicit publisher article URL',async()=>{
 let calls=0;const report=await enrichThumbnails([{id:'wrapper',url:'https://news.google.com/rss/articles/wrapper',thumbnailUrl:''}],{fetchImpl:async()=>{calls++;throw new Error('wrapper must not be fetched');}});
 assert.equal(calls,0);assert.equal(report.attempted,0);assert.equal(report.wrapperOnly,0);assert.equal(report.items[0].thumbnailUrl,'');
});
test('RSS source homepage is preserved but never treated as an article URL',()=>{
 const xml='<rss><channel><item><title>Haewon story</title><link>https://news.google.com/rss/articles/wrapper</link><source url="https://publisher.example/">Publisher</source><guid>https://news.google.com/rss/articles/wrapper</guid></item></channel></rss>';
 const [item]=parseRss(xml,'query');assert.equal(item.sourceUrl,'https://publisher.example/');assert.equal(item.publisherArticleUrl,'');
});
test('direct HTTPS publisher article link is eligible for metadata fetch',()=>{
 const xml='<rss><channel><item><title>Haewon story</title><link>https://publisher.example/article/123</link><source url="https://publisher.example/">Publisher</source></item></channel></rss>';
 const [item]=parseRss(xml,'query');assert.equal(item.publisherArticleUrl,'https://publisher.example/article/123');assert.equal(item.sourceUrl,'https://publisher.example/');
});

