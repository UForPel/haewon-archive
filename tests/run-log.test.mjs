import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRunLog } from '../scripts/run-log.mjs';

const base = {
  runId: '123456',
  startedAt: '2026-11-20T08:00:00.000Z',
  finishedAt: '2026-11-20T08:05:00.000Z',
  trigger: 'schedule',
  status: { status: 'success', source: 'nmixx-youtube', itemsFetched: 15, itemsAdded: 2 },
  videoCount: 17,
  photoCount: 0,
  changedPaths: ['data/videos.json']
};

test('run log builds a schema-valid success record with counts and paths', () => {
  const log = buildRunLog(base);
  assert.equal(log.status, 'success');
  assert.deepEqual(log.counts, { discovered: 15, accepted: 2, rejected: 0, duplicates: 13, uncertain: 0 });
  assert.ok(log.changedPaths.includes('data/run-logs'));
  assert.equal(log.durationMs, 300000);
});

test('collector errors become failed records and sanitized error codes', () => {
  const log = buildRunLog({ ...base, status: { status: 'error', source: 'nmixx-youtube', itemsFetched: 0, itemsAdded: 0 } });
  assert.equal(log.status, 'failed');
  assert.equal(log.sources[0].outcome, 'failed');
  assert.equal(log.sources[0].errorCode, 'COLLECTOR_FAILED');
});

test('unknown trigger is normalized and duration cannot be negative', () => {
  const log = buildRunLog({ ...base, trigger: 'custom', finishedAt: '2026-11-20T07:59:00.000Z' });
  assert.equal(log.trigger, 'unknown');
  assert.equal(log.durationMs, 0);
});
