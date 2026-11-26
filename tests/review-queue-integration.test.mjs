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

test('publisher metadata host diagnostics are surfaced in the live discovery view',()=>{
 assert.match(view,/thumbnailEnrichmentByHost/);
 assert.match(view,/rowData\.candidateRate/);
 assert.match(view,/rowData\.assignmentRate/);
 assert.match(view,/rowData\.finalHosts/);
});

test('repeated-image review panel is wired to per-article labels and does not pool shared URL decisions',()=>{
 assert.match(view,/groupRepeatedThumbnailAssignments\(allItems\)/);
 assert.match(view,/findNextUnreviewedInRepeatedGroup\(filtered,reviewLabels\)/);
 assert.match(view,/기사별 판단 유지/);
 assert.match(view,/repeatedReviewPanel\.addEventListener\('toggle'/);
});
test('discovery render reads the search field locally instead of an out-of-scope query variable',()=>{
 assert.match(view,/String\(search\?\.value\|\|''\)\.trim\(\)\?' \/ 검색 결과'/);
 assert.doesNotMatch(view,/count\.textContent=[^;]*\bq\.trim\(\)/);
});

test('news-to-video sync accepts explicit YouTube metadata only and never follows Google News wrappers',async()=>{
 const source=await readFile(new URL('scripts/sync-discovery-videos.mjs',root),'utf8');
 assert.match(source,/const explicit=\[item\.publisherArticleUrl,item\.url\]\.find\(value=>youtubeId\(value\)\)/);
 assert.doesNotMatch(source,/redirect:\s*['"]follow['"]/);
 assert.doesNotMatch(source,/fetchImpl/);
});


test('thumbnail review writes are transactional for candidate, repeated-group and import paths',async()=>{
 const source=await readFile(new URL('js/discovery-view.mjs',root),'utf8');
 assert.match(source,/persistThumbnailReviewLabels\(localStorage,REVIEW_KEY,reviewLabels,nextLabels\)/);
 assert.equal((source.match(/persistReviewLabels\(nextLabels\)/g)||[]).length,3,'candidate, repeated-group and JSON import all use the persistence gate');
 assert.doesNotMatch(source,/localStorage\.setItem\(REVIEW_KEY/,'UI must not mutate storage outside the transactional helper');
 assert.match(source,/select\.value=reviewLabels\[key\]\?\.label\|\|''/,'failed writes restore the latest saved label');
});


test('next-thumbnail queue reveals the collapsed candidate details before scrolling and focusing',()=>{
 const helperImport= view.match(/import \{[^}]*revealThumbnailReviewRow[^}]*\} from '\.\/thumbnail-review\.mjs';/);
 assert.ok(helperImport,'review view imports the disclosure reveal helper');
 const reveal=view.indexOf('revealThumbnailReviewRow(row)');
 const scroll=view.indexOf("row.scrollIntoView({behavior:'smooth',block:'center'})",reveal);
 const focus=view.indexOf("row.querySelector('select')?.focus({preventScroll:true})",scroll);
 assert.ok(reveal>=0&&scroll>reveal&&focus>scroll,'open details before scroll and focus');
});

test('successful manual thumbnail review save advances to the next pending candidate only after persistence',()=>{
 const start=view.indexOf("candidateList.forEach(candidate=>");
 const end=view.indexOf("reviewDisclosure.append(reviewSection)",start);
 const candidateRenderer=view.slice(start,end);
 const saved=candidateRenderer.indexOf("if(persistReviewLabels(nextLabels))");
 const advance=candidateRenderer.indexOf("requestAnimationFrame(()=>reviewQueueButton.click())",saved);
 const failure=candidateRenderer.indexOf("else{select.value=reviewLabels[key]?.label||''",saved);
 assert.ok(saved>=0&&advance>saved&&failure>advance,'auto-advance is scheduled only inside the successful persistence branch');
 assert.match(candidateRenderer,/검수 저장 완료\. 다음 미검수 후보로 이동합니다\./);
});
