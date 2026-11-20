import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCandidate,validateCandidates,mergeCandidates} from '../js/candidates.mjs';
const sample={id:'c1',type:'fan-content',title:'해원 직캠',sourceName:'팬 채널',url:'https://youtube.com/watch?v=abc',publishedAt:'2026-11-19',notes:'검토'};
test('다양한 유형의 HTTPS 링크를 후보로 정규화하고 검토 상태를 부여',()=>{const result=normalizeCandidate(sample);assert.equal(result.type,'fan-content');assert.equal(result.status,'review');});
test('안전하지 않은 URL, 잘못된 유형, 날짜, 중복을 거부',()=>{assert.throws(()=>normalizeCandidate({...sample,url:'javascript:alert(1)'}));assert.throws(()=>normalizeCandidate({...sample,type:'unknown'}));assert.throws(()=>normalizeCandidate({...sample,publishedAt:'2026-02-31'}));assert.throws(()=>validateCandidates([sample,sample]),/중복/);});
test('후보를 URL 기준으로 병합',()=>{const second={...sample,url:'https://example.com/item',publishedAt:'2026-11-20'};assert.equal(mergeCandidates([sample],[second]).length,2);});
