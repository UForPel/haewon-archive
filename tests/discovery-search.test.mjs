import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscoveryItems } from '../js/discovery-view.mjs';
const items=[{title:'Haewon interview',sourceName:'News A',description:'NMIXX interview'},{title:'Stage clip',sourceName:'News B',description:'NMIXX stage'}];
test('discovery query filters title, source and description case-insensitively',()=>{assert.equal(filterDiscoveryItems(items,'haewon').length,1);assert.equal(filterDiscoveryItems(items,'news b')[0].title,'Stage clip');assert.equal(filterDiscoveryItems(items,'stage').length,1);});
test('empty query returns every candidate',()=>{assert.equal(filterDiscoveryItems(items,'').length,2);});
test('no-match query returns empty list',()=>{assert.deepEqual(filterDiscoveryItems(items,'missing'),[]);});
