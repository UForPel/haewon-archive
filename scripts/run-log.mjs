import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { assertMatchesSchema } from './json-schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOG_DIR = resolve(ROOT, 'data/run-logs');
const RUN_SCHEMA = JSON.parse(await readFile(resolve(ROOT, 'schemas/run-log.schema.json'), 'utf8'));

function readJson(path) {
  return readFile(resolve(ROOT, path), 'utf8').then(JSON.parse);
}

export function buildRunLog({ runId, startedAt, finishedAt, trigger, status, videoCount, photoCount, changedPaths = [] }) {
  const itemsFetched = Number(status.itemsFetched) || 0;
  const itemsAdded = Number(status.itemsAdded) || 0;
  const itemsDuplicate = Number(status.itemsDuplicate) || 0;
  const sourceOutcome = status.status === 'success' ? 'success' : status.status === 'error' ? 'failed' : 'skipped';
  const record = {
    schemaVersion: '1.0.0',
    runId: String(runId),
    startedAt,
    finishedAt,
    trigger: trigger === 'schedule' ? 'github_schedule' : trigger === 'workflow_dispatch' ? 'workflow_dispatch' : trigger === 'push' ? 'unknown' : trigger === 'manual' ? 'manual' : trigger === 'external_scheduler' ? 'external_scheduler' : 'unknown',
    mode: 'production',
    status: sourceOutcome === 'success' ? 'success' : sourceOutcome === 'skipped' ? 'skipped' : 'failed',
    sources: [{
      sourceId: status.source || 'nmixx-youtube',
      outcome: sourceOutcome,
      itemsSeen: itemsFetched,
      ...(status.status === 'error' ? { errorCode: 'COLLECTOR_FAILED' } : {})
    }],
    counts: {
      discovered: itemsFetched,
      accepted: itemsAdded,
      rejected: 0,
      duplicates: itemsDuplicate,
      uncertain: 0
    },
    validation: { passed: true, errors: [] },
    changedPaths: [...new Set([...changedPaths, 'data/run-logs'])].slice(0, 30),
    durationMs: Math.max(0, Date.parse(finishedAt) - Date.parse(startedAt))
  };
  assertMatchesSchema(record, RUN_SCHEMA, 'runLog');
  return record;
}

async function main() {
  const runId = process.env.GITHUB_RUN_ID;
  if (!runId || !/^\d+$/.test(runId)) throw new Error('GITHUB_RUN_ID is required and must be numeric');
  const startedAt = process.env.RUN_STARTED_AT;
  if (!startedAt || Number.isNaN(Date.parse(startedAt))) throw new Error('RUN_STARTED_AT must be a valid timestamp');
  const finishedAt = new Date().toISOString();
  const status = await readJson('data/collection-status.json');
  const videos = await readJson('data/videos.json');
  const photos = await readJson('data/photos.json');
  const changedPaths = execFileSync('git', ['status', '--porcelain', '--', 'data'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean).map(line => line.slice(3));
  const record = buildRunLog({
    runId, startedAt, finishedAt,
    trigger: process.env.GITHUB_EVENT_NAME || 'unknown',
    status, videoCount: videos.length, photoCount: photos.length, changedPaths
  });
  await mkdir(LOG_DIR, { recursive: true });
  const path = resolve(LOG_DIR, `${runId}.json`);
  await writeFile(path, JSON.stringify(record, null, 2) + '\n');
  console.log(JSON.stringify({ runLog: path, status: record.status, counts: record.counts }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
