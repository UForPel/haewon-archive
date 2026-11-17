import { readFile } from 'node:fs/promises';
for (const path of ['data/videos.json', 'data/photos.json', 'data/sources.json', 'data/collection-status.json']) {
  const value = JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
  if (path.endsWith('videos.json') && !Array.isArray(value)) throw new Error('videos.json must be an array');
  if (path.endsWith('photos.json') && !Array.isArray(value)) throw new Error('photos.json must be an array');
  console.log(`OK ${path}`);
}
