import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhotoEntry, validatePhotoEntries, mergePhotoEntries } from '../scripts/photo-links.mjs';

const valid = {
  id: 'photo-1',
  title: 'NMIXX 공식 게시물',
  sourceName: 'NMIXX 공식 웹사이트',
  url: 'https://nmixx.jype.com/Board/Detail?boardID=123',
  publishedAt: '2026-11-17',
  notes: '공식 게시물 원문 링크'
};

test('허용된 HTTPS 원문 링크를 표준 형식으로 정리한다', () => {
  const result = normalizePhotoEntry(valid);
  assert.equal(result.url, valid.url);
  assert.equal(result.title, valid.title);
});

test('HTTP, javascript 및 잘못된 날짜는 거부한다', () => {
  assert.throws(() => normalizePhotoEntry({ ...valid, url: 'http://example.com' }), /https/);
  assert.throws(() => normalizePhotoEntry({ ...valid, url: 'javascript:alert(1)' }), /원문 링크/);
  assert.throws(() => normalizePhotoEntry({ ...valid, publishedAt: '2026-99-99' }), /날짜/);
});

test('같은 원문 링크를 중복 등록하지 않는다', () => {
  assert.throws(() => validatePhotoEntries([valid, valid]), /중복/);
});

test('기존 항목과 가져온 항목을 링크 기준으로 합치고 최신순 정렬한다', () => {
  const older = { ...valid, url: 'https://example.com/older', publishedAt: '2026-01-01' };
  const newer = { ...valid, id: 'photo-2', url: 'https://example.com/newer', publishedAt: '2026-11-18' };
  const merged = mergePhotoEntries([older], [newer]);
  assert.deepEqual(merged.map(item => item.url), [newer.url, older.url]);
});
