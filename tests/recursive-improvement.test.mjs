import test from 'node:test';
import assert from 'node:assert/strict';
import { buildImprovementCycle, kstDay, ALGORITHM_VERSION } from '../scripts/recursive-improvement.mjs';
import { getDailySearches, SEARCH_PACKS } from '../scripts/collect-news.mjs';

test('daily query rotation is deterministic and bounded to editorial packs',()=>{
 const day='2026-11-21';
 const morning=getDailySearches(day,0),evening=getDailySearches(day,1);
 assert.deepEqual(morning,getDailySearches(day,0));
 assert.ok(morning.length>0);
 assert.ok([...morning,...evening].every(q=>!/(fancam|직캠)/i.test(q)));
 assert.notDeepEqual(morning,evening);
 assert.equal(SEARCH_PACKS.length,6);
 assert.ok(SEARCH_PACKS.every(pack=>pack.length===6));
});
test('improvement cycle reports evidence and refuses unmeasured precision claims',()=>{
 const report=buildImprovementCycle({day:'2026-11-21',discovery:[{query:getDailySearches('2026-11-21')[0]},{query:getDailySearches('2026-11-21')[0]}],videos:[{id:'x'}],newsStatus:{fetched:7,queries:[{query:getDailySearches('2026-11-21')[0],uniqueCandidates:7}]},reviews:[{query:'q',relevant:true},{query:'q',relevant:false}]});
 assert.equal(report.algorithmVersion,ALGORITHM_VERSION);
 assert.equal(report.evidence.cumulativeDiscoveryCandidates,2);
 assert.equal(report.evidence.currentRunCandidates,7);
 assert.equal(report.evidence.queryYield[0].candidates,7);
 assert.equal(report.evaluation.reviewedCount,2);
 assert.equal(report.evaluation.precision,0.5);
 assert.equal(report.evidence.uniqueVideoRecords,1);
 assert.equal(report.evaluation.status,'exploratory');
 assert.equal(report.adaptation.automaticPromotion,false);
 assert.equal(report.adaptation.destructiveFiltering,false);
});
test('KST day formatter returns ISO calendar date',()=>{
 assert.match(kstDay(new Date('2026-11-20T16:00:00.000Z')),/^2026-11-21$/);
});
