import { readFile } from 'node:fs/promises';
import { validatePhotoEntries } from './photo-links.mjs';
import { assertMatchesSchema } from './json-schema.mjs';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(await readFile(new URL('schemas/archive-record.schema.json', root), 'utf8'));

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
