import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhotoEntry, validatePhotoEntries, mergePhotoEntries } from '../js/photo-links.mjs';
import { filterArchiveItems } from '../js/archive-filters.mjs';

test('브라우저 앱에서 사용하는 사진 모듈을 정상적으로 불러온다', () => {
  const item = normalizePhotoEntry({
    id: 'smoke-1',
    title: '공식 게시물',
    sourceName: 'NMIXX',
    url: 'https://example.com/post',
    publishedAt: '2026-11-18',
    notes: ''
  });
  assert.equal(validatePhotoEntries([item]).length, 1);
  assert.equal(mergePhotoEntries([], [item]).length, 1);
});

test('브라우저 앱에서 사용하는 통합 필터 모듈을 정상적으로 불러온다', () => {
  const items = [{ id: 'video-1', type: 'video', sourceKey: 'youtube', publishedAt: '2026-11-18', searchText: 'Haewon', relevance: true }];
  assert.equal(filterArchiveItems(items, { query: 'haewon' }).length, 1);
});
