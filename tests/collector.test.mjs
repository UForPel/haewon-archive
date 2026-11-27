import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildDisabledCollectionStatus, mergeVideos } from '../scripts/collect-youtube.mjs';

test('중복 영상 ID는 하나로 합치고 최신순으로 정렬한다', () => {
  const old = { id: 'a', title: 'old', publishedAt: '2026-01-01T00:00:00.000Z', collectedAt: 'first' };
  const newer = { id: 'a', title: 'updated', publishedAt: '2026-01-01T00:00:00.000Z', collectedAt: 'second' };
  const other = { id: 'b', title: 'other', publishedAt: '2026-02-01T00:00:00.000Z' };
  const result = mergeVideos([old], [newer, other]);
  assert.equal(result.length, 2);
  assert.equal(result[1].title, 'updated');
  assert.equal(result[1].collectedAt, 'first');
  assert.equal(result[0].id, 'b');
});

test('비활성화 상태를 기록하되 기존 영상 수와 마지막 성공 시각을 보존한다', () => {
  const previous = { status: 'success', totalItems: 20, lastSuccessAt: '2026-11-27T02:09:09.571Z' };
  const result = buildDisabledCollectionStatus(previous, '2026-11-27T05:00:00.000Z');
  assert.equal(result.status, 'disabled');
  assert.equal(result.policy, 'disabled');
  assert.equal(result.itemsFetched, 0);
  assert.equal(result.itemsAdded, 0);
  assert.equal(result.totalItems, 20);
  assert.equal(result.lastSuccessAt, previous.lastSuccessAt);
  assert.equal(result.lastPolicyCheckAt, '2026-11-27T05:00:00.000Z');
});

test('YouTube Atom collector contains no network fetch or feed endpoint', async () => {
  const source = await readFile(new URL('../scripts/collect-youtube.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /feeds\/videos\.xml/i);
  assert.match(source, /networkRequests: 0/);
});
