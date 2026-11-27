import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const discoveryView=await readFile(new URL('../js/discovery-view.mjs',import.meta.url),'utf8');

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
test('index markup has balanced tag nesting',()=>{
 const stack=[];
 for(const match of html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi)){
  const token=match[0];
  if(token.startsWith('<!--'))continue;
  const closing=token.startsWith('</');
  const name=token.match(/^<\/?([a-z][\w:-]*)/i)?.[1]?.toLowerCase();
  if(!name)continue;
  if(closing){assert.equal(stack.pop(),name,'Unexpected closing tag '+token);}
  else if(!voidTags.has(name)&&!token.endsWith('/>'))stack.push(name);
 }
 assert.deepEqual(stack,[]);
});
test('index IDs are unique',()=>{
 const ids=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(([,id])=>id);
 assert.equal(new Set(ids).size,ids.length,'duplicate element IDs found');
});

test('visible primary controls include named button actions and forms',()=>{
 for(const markup of ['>전체</button>','>해원 키워드</button>','>최근 7일</button>','>검색 열기</button>','>임시 링크 등록</button>','>JSON 내보내기</button>'])assert.ok(html.includes(markup),'missing button markup: '+markup);
 assert.ok(html.includes('id="import-photos"'),'JSON import input must remain available');
 assert.ok(html.includes('id="discovery-pagination"')&&html.includes('id="video-pagination"'),'both result lists must expose pagination controls');
});


test('thumbnail provenance quality dashboard reports found, assigned, rejected and source details',()=>{for(const signal of ['실제 신규 배정','중복 거부','썸네일 출처 검증','출처 미확인 레거시','썸네일 없음','최근 보강 출처 결과'])assert.ok(discoveryView.includes(signal),'missing dashboard signal '+signal);});


test('discovery reading view keeps technical diagnostics and image-review tools collapsed',()=>{
 assert.ok(discoveryView.includes("className='quality-details'"),'quality diagnostics must be behind a disclosure');
 assert.ok(discoveryView.includes("className='discovery-review-tools'"),'review tools must be behind a disclosure');
 assert.ok(discoveryView.includes("className='thumbnail-review-disclosure'"),'per-article candidate review must be collapsed');
 assert.ok(discoveryView.includes("textContent='수집·품질 진단 보기'"),'diagnostics disclosure must have a clear label');
 assert.ok(!discoveryView.includes("sourceLink.href=item.sourceUrl"),'raw RSS source URL must not be rendered as a per-card link');
 assert.ok(!discoveryView.includes("score.textContent='관련성 점수"),'internal relevance score must not clutter the public card');
});


test('article discovery has explicit relevance scopes and a sanitized reading surface',()=>{
 assert.ok(html.includes('id="discovery-relevance"'),'article relevance scope controls must be visible');
 assert.ok(html.includes('해원 기사 후보를 기본 표시합니다'),'default relevance behavior must be explained');
 assert.ok(discoveryView.includes("let selectedRelevance='haewon'"),'Haewon-related articles must be the default scope');
 assert.ok(discoveryView.includes('filterArticleCandidates(allItems)'),'video candidates must not be mixed into article cards');
 assert.ok(discoveryView.includes('cleanDiscoveryText(item.description)'),'RSS HTML descriptions must be rendered as clean text');
 assert.ok(discoveryView.includes('unverifiedRepeatedThumbnailUrls.has(item.thumbnailUrl)'),'unverified shared legacy thumbnails must not be shown as article-specific images');
 assert.ok(discoveryView.includes('renderCategories();'),'category controls must be mounted');
});


test('video cards visibly distinguish official channels from unverified channels',async()=>{
 const appSource=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
 assert.ok(appSource.includes("video.origin === 'official'"));
 assert.ok(appSource.includes("officialChannel ? '공식 채널' : '채널 미검수'"));
 assert.ok(appSource.includes("channelName = video.channelName"));
});
