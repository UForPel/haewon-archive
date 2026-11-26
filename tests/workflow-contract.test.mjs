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
