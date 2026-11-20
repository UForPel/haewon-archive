import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchUrl } from '../js/quick-search.mjs';

test('builds YouTube search URL with encoded query',()=>{assert.equal(buildSearchUrl('youtube','해원 NMIXX'),'https://www.youtube.com/results?search_query=%ED%95%B4%EC%9B%90%20NMIXX');});
test('builds Google web search URL',()=>{assert.equal(buildSearchUrl('google','Haewon fancam'),'https://www.google.com/search?q=Haewon%20fancam');});
test('builds Google image search URL',()=>{assert.equal(buildSearchUrl('images','오해원'),'https://www.google.com/search?tbm=isch&q=%EC%98%A4%ED%95%B4%EC%9B%90');});
test('empty query does not create a URL',()=>{assert.equal(buildSearchUrl('youtube','   '),'');});
test('unknown platform falls back to YouTube',()=>{assert.equal(buildSearchUrl('unknown','abc'),'https://www.youtube.com/results?search_query=abc');});
