import { readFile, readdir } from 'node:fs/promises';
import { validatePhotoEntries } from './photo-links.mjs';
import { assertMatchesSchema } from './json-schema.mjs';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(await readFile(new URL('schemas/archive-record.schema.json', root), 'utf8'));
const runLogSchema = JSON.parse(await readFile(new URL('schemas/run-log.schema.json', root), 'utf8'));

for (const path of ['data/videos.json', 'data/photos.json', 'data/sources.json', 'data/collection-status.json']) {
  const value = JSON.parse(await readFile(new URL(path, root), 'utf8'));
  if (path.endsWith('videos.json')) {
    if (!Array.isArray(value)) throw new Error('videos.json must be an array');
    value.forEach((entry, index) => assertMatchesSchema(entry, schema, `data/videos.json[${index}]`));
    const ids = value.map(entry => entry.id);
    if (new Set(ids).size !== ids.length) throw new Error('videos.json contains duplicate video IDs');
    console.log(`OK ${path} (${value.length} schema-valid entries)`);
    continue;
  }
  if (path.endsWith('photos.json')) {
    validatePhotoEntries(value);
    value.forEach((entry, index) => assertMatchesSchema(entry, schema, `data/photos.json[${index}]`));
    console.log(`OK ${path} (${value.length} schema-valid entries)`);
    continue;
  }
  if (path.endsWith('sources.json') && !Array.isArray(value)) throw new Error('sources.json must be an array');
  if (path.endsWith('collection-status.json') && (!value || typeof value !== 'object' || Array.isArray(value))) {
    throw new Error('collection-status.json must be an object');
  }
  console.log(`OK ${path}`);
}

const discovery = JSON.parse(await readFile(new URL('data/discovery.json', root), 'utf8'));
if (!Array.isArray(discovery)) throw new Error('data/discovery.json must be an array');
const discoveryUrls = new Set();
for (const [index, item] of discovery.entries()) {
  if (!item || typeof item !== 'object' || typeof item.title !== 'string' || !item.title.trim() || typeof item.url !== 'string' || !/^https:\/\//.test(item.url) || typeof item.sourceName !== 'string' || typeof item.discoveredAt !== 'string') throw new Error(`Invalid discovery candidate at index ${index}`);
  const key = item.url.toLowerCase();
  if (discoveryUrls.has(key)) throw new Error('data/discovery.json contains duplicate URLs');
  discoveryUrls.add(key);
}
console.log(`OK data/discovery.json (${discovery.length} discovery candidates)`);
const newsStatus = JSON.parse(await readFile(new URL('data/news-collection-status.json', root), 'utf8'));
if (!newsStatus || typeof newsStatus !== 'object' || !Array.isArray(newsStatus.queries) || !Number.isInteger(newsStatus.fetched) || newsStatus.fetched < 0) throw new Error('Invalid data/news-collection-status.json');
for (const row of newsStatus.queries) {
  if (typeof row.query !== 'string' || !Number.isInteger(row.candidates) || !Number.isInteger(row.uniqueCandidates) || row.candidates < 0 || row.uniqueCandidates < 0 || row.uniqueCandidates > row.candidates) throw new Error('Invalid per-query news yield row');
}
console.log(`OK data/news-collection-status.json (${newsStatus.queries.length} per-query metrics)`);

const reviews = JSON.parse(await readFile(new URL('data/relevance-reviews.json', root), 'utf8'));
if (!Array.isArray(reviews)) throw new Error('data/relevance-reviews.json must be an array');
const reviewUrls = new Set();
for (const [index, review] of reviews.entries()) {
  if (!review || typeof review.url !== 'string' || !review.url.startsWith('https://') || typeof review.query !== 'string' || typeof review.relevant !== 'boolean' || typeof review.reviewedAt !== 'string') throw new Error(`Invalid relevance review at index ${index}`);
  if (reviewUrls.has(review.url)) throw new Error('Duplicate relevance review URL');
  reviewUrls.add(review.url);
}
console.log(`OK data/relevance-reviews.json (${reviews.length} human-reviewed labels)`);


const runLogDir = new URL('data/run-logs/', root);
try {
  const names = (await readdir(runLogDir)).filter(name => name.endsWith('.json')).sort();
  for (const name of names) {
    const record = JSON.parse(await readFile(new URL(name, runLogDir), 'utf8'));
    assertMatchesSchema(record, runLogSchema, `data/run-logs/${name}`);
  }
  console.log(`OK data/run-logs (${names.length} schema-valid entries)`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('OK data/run-logs (not created yet)');
}
