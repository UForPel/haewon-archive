import { readFile } from 'node:fs/promises';
import { validatePhotoEntries } from './photo-links.mjs';

for (const path of ['data/videos.json', 'data/photos.json', 'data/sources.json', 'data/collection-status.json']) {
  const value = JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
  if (path.endsWith('videos.json') && !Array.isArray(value)) throw new Error('videos.json must be an array');
  if (path.endsWith('photos.json')) {
    validatePhotoEntries(value);
    console.log(`OK ${path} (${value.length} entries)`);
    continue;
  }
  if (path.endsWith('sources.json') && !Array.isArray(value)) throw new Error('sources.json must be an array');
  if (path.endsWith('collection-status.json') && (!value || typeof value !== 'object' || Array.isArray(value))) {
    throw new Error('collection-status.json must be an object');
  }
  console.log(`OK ${path}`);
}
