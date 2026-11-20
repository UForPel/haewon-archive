import test from 'node:test';
import assert from 'node:assert/strict';
import { buildImprovementCycle, kstDay, ALGORITHM_VERSION } from '../scripts/recursive-improvement.mjs';
import { getDailySearches, SEARCH_PACKS } from '../scripts/collect-news.mjs';

test('daily query rotation is deterministic and bounded to editorial packs',()=>{
 const day='2026-11-21';
 assert.deepEqual(getDailySearches(day),getDailySearches(day));
 assert.ok(getDailySearches(day).length>0);
 assert.ok(getDailySearches(day).every(q=>!/(fancam|직캠)/i.test(q)));
 assert.equal(SEARCH_PACKS.length,3);
});
test('improvement cycle reports evidence and refuses unmeasured precision claims',()=>{
 const report=buildImprovementCycle({day:'2026-11-21',discovery:[{query:getDailySearches('2026-11-21')[0]},{query:getDailySearches('2026-11-21')[0]}],videos:[{id:'x'}]});
 assert.equal(report.algorithmVersion,ALGORITHM_VERSION);
 assert.equal(report.evidence.discoveryCandidates,2);
 assert.equal(report.evidence.uniqueVideoRecords,1);
 assert.equal(report.evaluation.precision,'not_measured');
 assert.equal(report.adaptation.automaticPromotion,false);
 assert.equal(report.adaptation.destructiveFiltering,false);
});
test('KST day formatter returns ISO calendar date',()=>{
 assert.match(kstDay(new Date('2026-11-20T16:00:00.000Z')),/^2026-11-21$/);
});
