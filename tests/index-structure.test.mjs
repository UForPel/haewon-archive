import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
