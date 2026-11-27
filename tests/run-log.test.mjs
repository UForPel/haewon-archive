import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRunLog } from '../scripts/run-log.mjs';

const base = {
  runId: '123456',
  startedAt: '2026-11-20T08:00:00.000Z',
  finishedAt: '2026-11-20T08:05:00.000Z',
  trigger: 'schedule',
  status: { status: 'success', source: 'nmixx-youtube', itemsFetched: 15, itemsAdded: 2, itemsDuplicate: 13 },
  videoCount: 17,
  photoCount: 0,
  changedPaths: ['data/videos.json']
};

test('run log builds a schema-valid success record with counts and paths', () => {
  const log = buildRunLog(base);
  assert.equal(log.status, 'success');
  assert.deepEqual(log.counts, { discovered: 15, accepted: 2, rejected: 0, duplicates: 13, uncertain: 0 });
  assert.equal(log.validation.passed, true);
  assert.ok(log.changedPaths.includes('data/run-logs'));
  assert.equal(log.durationMs, 300000);
});

test('collector errors become failed records and sanitized error codes', () => {
  const log = buildRunLog({ ...base, status: { status: 'error', source: 'nmixx-youtube', itemsFetched: 0, itemsAdded: 0, itemsDuplicate: 0 } });
  assert.equal(log.status, 'failed');
  assert.equal(log.sources[0].outcome, 'failed');
  assert.equal(log.sources[0].errorCode, 'COLLECTOR_FAILED');
});

test('unknown trigger is normalized and duration cannot be negative', () => {
  const log = buildRunLog({ ...base, trigger: 'custom', finishedAt: '2026-11-20T07:59:00.000Z' });
  assert.equal(log.trigger, 'unknown');
  assert.equal(log.durationMs, 0);
});

test('duplicate count is taken from explicit collector metric, not inferred', () => {
  const log = buildRunLog({ ...base, status: { ...base.status, itemsDuplicate: 4 } });
  assert.equal(log.counts.duplicates, 4);
});

test('skipped collector remains skipped rather than being mislabeled failed', () => {
  const log = buildRunLog({ ...base, status: { status: 'skipped', source: 'nmixx-youtube', itemsFetched: 0, itemsAdded: 0, itemsDuplicate: 0 } });
  assert.equal(log.status, 'skipped');
  assert.equal(log.sources[0].outcome, 'skipped');
  assert.equal(log.sources[0].errorCode, undefined);
});

test('manual, GitHub push and external scheduler triggers are preserved', () => {
  assert.equal(buildRunLog({ ...base, trigger: 'manual' }).trigger, 'manual');
  assert.equal(buildRunLog({ ...base, trigger: 'push' }).trigger, 'github_push');
  assert.equal(buildRunLog({ ...base, trigger: 'external_scheduler' }).trigger, 'external_scheduler');
});


test('run log records Google News and Bing RSS outcomes separately from YouTube',()=>{
 const log=buildRunLog({...base,newsStatus:{
  requestedQueries:4,successfulQueries:3,fetched:71,
  bingSuccessfulQueries:2,bingFailedQueries:[{query:'q1'},{query:'q2'}],bingCandidates:18
 }});
 assert.equal(log.status,'partial');
 assert.deepEqual(log.sources.map(source=>source.sourceId),['nmixx-youtube','google-news-rss','bing-news-rss']);
 assert.equal(log.sources[0].outcome,'success');
 assert.equal(log.sources[1].outcome,'partial');
 assert.equal(log.sources[1].itemsSeen,71);
 assert.equal(log.sources[1].errorCode,'RSS_QUERY_FAILURES');
 assert.equal(log.sources[2].outcome,'partial');
 assert.equal(log.sources[2].itemsSeen,18);
 assert.equal(log.sources[2].errorCode,'BING_RSS_QUERY_FAILURES');
});

test('run log marks RSS sources successful when all requested queries succeed',()=>{
 const log=buildRunLog({...base,newsStatus:{
  requestedQueries:4,successfulQueries:4,fetched:63,
  bingSuccessfulQueries:4,bingFailedQueries:[],bingCandidates:30
 }});
 assert.equal(log.status,'success');
 assert.equal(log.sources[1].outcome,'success');
 assert.equal(log.sources[2].outcome,'success');
 assert.equal(log.sources[1].itemsSeen,63);
 assert.equal(log.sources[2].itemsSeen,30);
});

test('run log is partial when one collector fails but another source succeeds',()=>{
 const log=buildRunLog({...base,status:{status:'error',source:'nmixx-youtube',itemsFetched:0,itemsAdded:0,itemsDuplicate:0},newsStatus:{
  requestedQueries:4,successfulQueries:4,fetched:40,bingSuccessfulQueries:0,bingFailedQueries:[{query:'x'}],bingCandidates:0
 }});
 assert.equal(log.status,'partial');
 assert.equal(log.sources[0].outcome,'failed');
 assert.equal(log.sources[1].outcome,'success');
 assert.equal(log.sources[2].outcome,'failed');
});


test('run log keeps query-level failure details and explicit retry metadata',()=>{
 const log=buildRunLog({...base,newsStatus:{requestedQueries:6,successfulQueries:5,fetched:219,failedQueries:[{query:'오해원 근황',error:'HTTP 429',status:429,contentType:'text/html; charset=UTF-8',responseFormat:'html',retryAttempted:false}],bingSuccessfulQueries:6,bingFailedQueries:[],bingCandidates:52}});
 assert.equal(log.status,'partial');
 assert.deepEqual(log.queryFailures,[{sourceId:'google-news-rss',query:'오해원 근황',error:'HTTP 429',retryAttempted:false,status:429,contentType:'text/html; charset=UTF-8',responseFormat:'html'}]);
});


test('scheduled run logs preserve the exact GitHub cron expression',()=>{
 const log=buildRunLog({...base,scheduleExpression:'17 11 * * *'});
 assert.equal(log.trigger,'github_schedule');
 assert.equal(log.scheduleExpression,'17 11 * * *');
});

test('schedule expression is omitted for non-scheduled runs',()=>{
 const log=buildRunLog({...base,trigger:'push',scheduleExpression:'17 11 * * *'});
 assert.equal(log.trigger,'github_push');
 assert.equal(Object.hasOwn(log,'scheduleExpression'),false);
});
