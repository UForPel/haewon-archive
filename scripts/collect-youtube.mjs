import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ID = 'nmixx-youtube';

export function mergeVideos(existing, incoming) {
  const byId = new Map();
  for (const item of [...existing, ...incoming]) {
    if (item && typeof item.id === 'string' && item.id) {
      const prior = byId.get(item.id);
      byId.set(item.id, prior ? { ...prior, ...item, collectedAt: prior.collectedAt || item.collectedAt } : item);
    }
  }
  return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function buildDisabledCollectionStatus(previous = {}, now = new Date().toISOString()) {
  return {
    ...previous,
    status: 'disabled',
    source: SOURCE_ID,
    policy: 'disabled',
    lastPolicyCheckAt: now,
    itemsFetched: 0,
    itemsAdded: 0,
    itemsDuplicate: 0,
    message: 'YouTube Atom 자동 수집은 robots.txt 및 약관 검토에 따라 비활성화되었습니다. 기존 영상 기록은 보존됩니다.'
  };
}

async function main() {
  const statusPath = resolve(ROOT, 'data/collection-status.json');
  let previous = {};
  try { previous = JSON.parse(await readFile(statusPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const status = buildDisabledCollectionStatus(previous);
  await writeFile(statusPath, JSON.stringify(status, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'disabled', source: SOURCE_ID, networkRequests: 0, retainedVideos: status.totalItems ?? null }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
