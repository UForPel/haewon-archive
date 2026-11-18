import test from 'node:test';
import assert from 'node:assert/strict';
import { filterArchiveItems } from '../js/archive-filters.mjs';
const items = [
  { id: 'v1', type: 'video', sourceKey: 'nmixx-youtube', publishedAt: '2026-11-17T12:00:00Z', searchText: 'Haewon official clip', relevance: true },
  { id: 'v2', type: 'video', sourceKey: 'nmixx-youtube', publishedAt: '2026-10-01T12:00:00Z', searchText: 'Lily behind', relevance: false },
  { id: 'p1', type: 'photo', sourceKey: 'photo:Official Instagram', publishedAt: '2026-11-16', searchText: 'Haewon official Instagram' }
];
test('자료 유형과 출처 필터를 함께 적용한다', () => assert.deepEqual(filterArchiveItems(items, { type: 'photo', source: 'photo:Official Instagram' }).map(x => x.id), ['p1']));
test('검색어와 해원 관련 필터를 적용한다', () => assert.deepEqual(filterArchiveItems(items, { query: 'haewon', haewonOnly: true }).map(x => x.id), ['v1']));
test('날짜 범위와 최근 7일 필터를 적용한다', () => {
  const now = Date.parse('2026-11-18T12:00:00Z');
  assert.deepEqual(filterArchiveItems(items, { from: Date.parse('2026-11-15T00:00:00Z'), recentOnly: true, now }).map(x => x.id), ['v1', 'p1']);
});
test('사진 자료는 해원 키워드 필터에서 제외한다', () => assert.deepEqual(filterArchiveItems(items, { haewonOnly: true }).map(x => x.id), ['v1']));
