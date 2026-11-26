import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('production collection is not triggered by documentation-only pushes', async () => {
  const workflow = await readFile(new URL('../.github/workflows/collect-and-deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /paths-ignore:/);
  assert.match(workflow, /- '\*\*\/\*\.md'/);
  assert.match(workflow, /- '\*\.md'/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /workflow_dispatch:/);
});

test('production performs one normal collection pass and retries only on a main push race', async () => {
  const workflow = await readFile(new URL('../.github/workflows/collect-and-deploy.yml', import.meta.url), 'utf8');
  const lines = workflow.split(String.fromCharCode(10));
  for (const command of ['npm test','npm run collect','npm run collect-youtube-search','npm run collect-news','npm run sync-discovery-videos','npm run improve','npm run quality','npm run log']) {
    const count = lines.filter(line => line.trim() === command).length;
    assert.equal(count, 1, command + ' should appear once in the normal pass');
  }
  assert.equal(lines.filter(line => line.trim() === 'npm run validate').length, 2);
  assert.match(workflow, /for attempt in 1 2 3; do/);
  assert.ok(workflow.includes('git fetch origin main'));
  assert.ok(workflow.includes('git reset --hard origin/main'));
  assert.ok(workflow.includes('if git push origin HEAD:main; then'));
  assert.ok(workflow.includes('YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}'));
  assert.doesNotMatch(workflow, /- name: Collect public YouTube feed/);
  assert.doesNotMatch(workflow, /- name: Discover public news RSS candidates/);
});
