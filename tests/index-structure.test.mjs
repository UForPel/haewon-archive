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


test('thumbnail provenance quality dashboard reports found, assigned, rejected and source details',()=>{for(const signal of ['실제 신규 배정','중복 거부','기존 이미지 출처 기록','최근 보강 출처 결과'])assert.ok(discoveryView.includes(signal),'missing dashboard signal '+signal);});
