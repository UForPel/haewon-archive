import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscoveryItems } from '../js/discovery-view.mjs';
import { classifyDiscoveryItem, filterArticleCandidates } from '../js/discovery-kind.mjs';
const items=[{title:'Haewon interview',sourceName:'News A',description:'NMIXX interview'},{title:'Stage clip',sourceName:'News B',description:'NMIXX stage'}];
test('discovery query filters title, source and description case-insensitively',()=>{assert.equal(filterDiscoveryItems(items,'haewon').length,1);assert.equal(filterDiscoveryItems(items,'news b')[0].title,'Stage clip');assert.equal(filterDiscoveryItems(items,'stage').length,1);});
test('empty query returns every candidate',()=>{assert.equal(filterDiscoveryItems(items,'').length,2);});
test('no-match query returns empty list',()=>{assert.deepEqual(filterDiscoveryItems(items,'missing'),[]);});
test('YouTube and fancam candidates are labeled as videos',()=>{assert.equal(classifyDiscoveryItem({title:'Haewon fancam'}),'video');assert.equal(classifyDiscoveryItem({url:'https://www.youtube.com/watch?v=abc'}),'video');});
test('ordinary articles remain article candidates even when their description mentions YouTube',()=>{assert.equal(classifyDiscoveryItem({title:'Haewon interview',url:'https://example.com/news',description:'The interview video is available on YouTube'}),'article');});
test('article candidate list excludes video links',()=>{assert.deepEqual(filterArticleCandidates([{title:'Haewon interview'},{title:'Haewon fancam'},{title:'YouTube clip'}]).map(x=>x.title),['Haewon interview']);});

test('news category classifier separates event and brand coverage',()=>{
 assert.equal(classifyDiscoveryCategory({title:'NMIXX 팬미팅 일정'}),'event');
 assert.equal(classifyDiscoveryCategory({title:'Haewon pictorial campaign'}),'brand');
});
test('news category classifier prioritizes explicit event/brand tags over broad official keywords',()=>{
 assert.equal(classifyDiscoveryCategory({title:'NMIXX 공식 팬미팅 공지'}),'event');
 assert.equal(classifyDiscoveryCategory({title:'NMIXX 공식 브랜드 화보'}),'brand');
});
test('news categories retain interview, performance, official and default news fallbacks',()=>{
 assert.equal(classifyDiscoveryCategory({title:'Haewon interview radio'}),'interview');
 assert.equal(classifyDiscoveryCategory({title:'NMIXX stage performance'}),'performance');
 assert.equal(classifyDiscoveryCategory({title:'NMIXX official notice'}),'official');
 assert.equal(classifyDiscoveryCategory({title:'Local article about Haewon'}),'news');
});
