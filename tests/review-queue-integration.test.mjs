import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [html, view] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('js/discovery-view.mjs', root), 'utf8')
]);

test('human review queue is wired into the module loaded by the actual page', () => {
  assert.match(html, /<script type="module" src="js\/discovery-view\.mjs"><\/script>/);
  assert.match(view, /reviewQueueButton\.textContent='다음 미검수 후보'/);
  assert.match(view, /findNextUnreviewedThumbnail\(items,reviewLabels\)/);
  assert.match(view, /page=Math\.floor\(next\.itemIndex\/PAGE_SIZE\)\+1/);
  assert.match(view, /row\.querySelector\('select'\)\?\.focus/);
  assert.match(view, /select\.addEventListener\('change',\(\)=>\{if\(select\.value\)save\.click\(\);\}\)/);
});
