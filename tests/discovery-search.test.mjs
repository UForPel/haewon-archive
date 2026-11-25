import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscoveryItems, sortDiscoveryItems } from '../js/discovery-view.mjs';
import { filterUnresolvedVideoCandidates, isExplicitYoutubeVideoUrl, classifyDiscoveryItem, classifyDiscoveryCategory, classifyDiscoveryCategories, filterArticleCandidates, filterDiscoveryRelevance, cleanDiscoveryText, classifyDiscoveryRelevance, hasExplicitPublisherArticleUrl, groupDiscoveryDuplicates, assessDiscoveryQuality } from '../js/discovery-kind.mjs';
const items=[{title:'Haewon interview',sourceName:'News A',description:'NMIXX interview'},{title:'Stage clip',sourceName:'News B',description:'NMIXX stage'}];
test('query filters title, source and description case-insensitively',()=>{assert.equal(filterDiscoveryItems(items,'haewon').length,1);assert.equal(filterDiscoveryItems(items,'news b')[0].title,'Stage clip');assert.equal(filterDiscoveryItems(items,'stage').length,1);});
test('empty and unmatched queries',()=>{assert.equal(filterDiscoveryItems(items,'').length,2);assert.deepEqual(filterDiscoveryItems(items,'missing'),[]);});
test('YouTube and fancam candidates are videos',()=>{assert.equal(classifyDiscoveryItem({title:'Haewon fancam'}),'video');assert.equal(classifyDiscoveryItem({url:'https://www.youtube.com/watch?v=abc'}),'video');});
test('ordinary article descriptions mentioning YouTube do not change type',()=>{assert.equal(classifyDiscoveryItem({title:'Haewon interview',url:'https://example.com/news',description:'Video on YouTube'}),'article');});
test('article filter excludes videos',()=>{assert.deepEqual(filterArticleCandidates([{title:'Haewon interview'},{title:'Haewon fancam'},{title:'YouTube clip'}]).map(x=>x.title),['Haewon interview']);});
test('event and brand classification',()=>{assert.equal(classifyDiscoveryCategory({title:'NMIXX 팬미팅 일정'}),'event');assert.equal(classifyDiscoveryCategory({title:'Haewon pictorial campaign'}),'brand');});
test('multiple title tags and no RSS boilerplate override',()=>{assert.deepEqual(classifyDiscoveryCategories({title:'공식 팬미팅 인터뷰'}),['event','official','interview']);assert.deepEqual(classifyDiscoveryCategories({title:'공식 공지',description:'brand campaign'}),['official']);});
test('news and description fallback',()=>{assert.equal(classifyDiscoveryCategory({title:'NMIXX new album coverage'}),'news');assert.equal(classifyDiscoveryCategory({title:'JYP artist news update'}),'news');assert.equal(classifyDiscoveryCategory({title:'Local coverage',description:'<b>Official notice</b>'}),'official');});
test('exact normalized long titles group and retain source count',()=>{const grouped=groupDiscoveryDuplicates([{title:'Haewon — News Article Title That Is Long Enough',sourceName:'A',relevanceScore:3},{title:'Haewon News Article Title That Is Long Enough',sourceName:'B',relevanceScore:8}]);assert.equal(grouped.length,1);assert.equal(grouped[0].duplicateCount,2);assert.equal(grouped[0].sourceCount,2);assert.equal(grouped[0].sourceName,'B');});
test('short generic titles group only by canonical URL',()=>{const grouped=groupDiscoveryDuplicates([{title:'News',sourceName:'A',url:'https://example.com/story?utm_source=x'},{title:'News',sourceName:'B',url:'https://example.com/story'}]);assert.equal(grouped.length,1);assert.equal(grouped[0].duplicateCount,2);const separate=groupDiscoveryDuplicates([{title:'News',sourceName:'A'},{title:'News',sourceName:'B'}]);assert.equal(separate.length,2);});

test('canonical URL grouping remains fallback for short title differences',()=>{const grouped=groupDiscoveryDuplicates([{title:'Different headline one',sourceName:'A',url:'https://example.com/story?utm_source=one'},{title:'Different headline two',sourceName:'B',url:'https://www.example.com/story#section'}]);assert.equal(grouped.length,1);assert.equal(grouped[0].duplicateCount,2);assert.equal(grouped[0].sourceCount,2);});
test('metadata quality measures completeness, not truth',()=>{const complete=assessDiscoveryQuality({title:'A sufficiently descriptive article title',sourceName:'Publisher',url:'https://example.com/story',publishedAt:'2026-11-23',thumbnailUrl:'https://example.com/thumb.jpg'});assert.equal(complete.score,100);assert.equal(complete.tier,'high');const sparse=assessDiscoveryQuality({title:'Short'});assert.equal(sparse.score,0);assert.equal(sparse.tier,'low');assert.ok(sparse.warnings.includes('source_missing'));});

test('normalized long headline grouping takes priority over different opaque Google URLs',()=>{
 const grouped=groupDiscoveryDuplicates([{title:'Same headline — a sufficiently long news article about Haewon',sourceName:'A',url:'https://news.google.com/rss/articles/token-one'},{title:'Same headline a sufficiently long news article about Haewon',sourceName:'B',url:'https://news.google.com/rss/articles/token-two'}]);
 assert.equal(grouped.length,1);
 assert.equal(grouped[0].duplicateCount,2);
});


test('RSS description HTML and wrapper URLs are converted to readable plain text',()=>{
 const text=cleanDiscoveryText('<a href="https://news.google.com/rss/articles/opaque?oc=5" target="_blank">해원 인터뷰</a> &amp; NMIXX');
 assert.equal(text,'해원 인터뷰 & NMIXX');
 assert.ok(!text.includes('https://'));
 assert.ok(!text.includes('<a'));
});

test('article relevance scopes separate Haewon, NMIXX and all article candidates',()=>{
 const candidates=[
  {title:'오해원 인터뷰',publisherArticleUrl:'https://publisher.test/haewon'},
  {title:'NMIXX 새 앨범 소식',publisherArticleUrl:'https://publisher.test/nmixx'},
  {title:'Haewon pictorial'},
  {title:'일반 연예 뉴스'},
  {title:'Haewon wrapper only',publisherArticleUrl:'https://news.google.com/rss/articles/opaque'},
  {title:'Haewon fancam'}
 ];
 const articles=filterArticleCandidates(candidates);
 assert.equal(articles.length,5);
 assert.equal(filterDiscoveryRelevance(articles,'verified-haewon').length,1);
 assert.equal(filterDiscoveryRelevance(articles,'haewon').length,3);
 assert.equal(filterDiscoveryRelevance(articles,'nmixx').length,1);
 assert.equal(filterDiscoveryRelevance(articles,'all').length,5);
 assert.equal(classifyDiscoveryRelevance(candidates[0]),'haewon');
 assert.equal(classifyDiscoveryRelevance(candidates[1]),'nmixx');
 assert.equal(classifyDiscoveryRelevance(candidates[3]),'other');
 assert.equal(hasExplicitPublisherArticleUrl(candidates[0]),true);
 assert.equal(hasExplicitPublisherArticleUrl(candidates[4]),false);
});
test('verified publisher URL scope rejects HTTP, wrapper, root-only and credential URLs',()=>{
 for(const publisherArticleUrl of ['http://publisher.test/story','https://news.google.com/rss/articles/opaque','https://publisher.test/','https://user:pass@publisher.test/story']){
  assert.equal(hasExplicitPublisherArticleUrl({publisherArticleUrl}),false);
 }
});

test('news default sort is chronological with missing dates last and relevance as opt-in',()=>{
 const rows=[{title:'high relevance old',publishedAt:'2026-11-01',relevanceScore:9},{title:'new low relevance',publishedAt:'2026-11-24',relevanceScore:1},{title:'unknown date',relevanceScore:99}];
 assert.deepEqual(sortDiscoveryItems(rows,'date').map(x=>x.title),['new low relevance','high relevance old','unknown date']);
 assert.deepEqual(sortDiscoveryItems(rows,'relevance').map(x=>x.title),['unknown date','high relevance old','new low relevance']);
});
test('unresolved wrapper fancam candidates remain visible separately without being promoted to verified videos',()=>{
 const rows=[{title:'Haewon fancam 4K',url:'https://news.google.com/rss/articles/wrapper-token',publishedAt:'2026-11-24'},{title:'Haewon interview',url:'https://publisher.example/news'},{title:'Haewon direct fancam',url:'https://www.youtube.com/watch?v=abcdefghijk'}];
 assert.equal(filterUnresolvedVideoCandidates(rows).length,1);
 assert.equal(filterUnresolvedVideoCandidates(rows)[0].url,rows[0].url);
 assert.equal(isExplicitYoutubeVideoUrl(rows[2].url),true);
 assert.equal(isExplicitYoutubeVideoUrl(rows[0].url),false);
});

test('date mode keeps the newest publication as the representative of a duplicate group',()=>{
 const grouped=groupDiscoveryDuplicates([
  {title:'Haewon news headline with enough normalized characters to group',sourceName:'Older source',publishedAt:'2026-11-01',relevanceScore:10},
  {title:'Haewon news headline with enough normalized characters to group',sourceName:'Newer source',publishedAt:'2026-11-24',relevanceScore:1}
 ],'date');
 assert.equal(grouped.length,1);
 assert.equal(grouped[0].sourceName,'Newer source');
 assert.equal(grouped[0].publishedAt,'2026-11-24');
});
