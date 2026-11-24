import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscoveryItems } from '../js/discovery-view.mjs';
import { classifyDiscoveryItem, classifyDiscoveryCategory, classifyDiscoveryCategories, filterArticleCandidates, filterDiscoveryRelevance, cleanDiscoveryText, classifyDiscoveryRelevance, groupDiscoveryDuplicates, assessDiscoveryQuality } from '../js/discovery-kind.mjs';
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
  {title:'오해원 인터뷰'},
  {title:'NMIXX 새 앨범 소식'},
  {title:'Haewon pictorial'},
  {title:'일반 연예 뉴스'},
  {title:'Haewon fancam'}
 ];
 const articles=filterArticleCandidates(candidates);
 assert.equal(articles.length,4);
 assert.equal(filterDiscoveryRelevance(articles,'haewon').length,2);
 assert.equal(filterDiscoveryRelevance(articles,'nmixx').length,1);
 assert.equal(filterDiscoveryRelevance(articles,'all').length,4);
 assert.equal(classifyDiscoveryRelevance(candidates[0]),'haewon');
 assert.equal(classifyDiscoveryRelevance(candidates[1]),'nmixx');
 assert.equal(classifyDiscoveryRelevance(candidates[3]),'other');
});
