import { normalizeCandidate, validateCandidates, mergeCandidates } from './candidates.mjs';
const form=document.querySelector('#candidate-form');
if(form){
const list=document.querySelector('#candidate-list'), status=document.querySelector('#candidate-status'), key='haewon-archive-candidates-v1';
let items=[]; try{items=validateCandidates(JSON.parse(localStorage.getItem(key)||'[]'));}catch{status.textContent='저장된 후보 데이터 오류. JSON 백업을 확인하세요.';}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(items));return true;}catch{status.textContent='저장 공간 부족: JSON으로 내보내 백업하세요.';return false;}};
function render(){list.replaceChildren();items.slice().sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).forEach(item=>{
const card=document.createElement('article');card.className='photo-card';
const details=document.createElement('div');details.className='photo-card-details';
const title=document.createElement('h3');title.textContent=item.title;
const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=item.type+' · '+item.sourceName+(item.publishedAt?' · '+item.publishedAt:'')+' · 검토 대기';
const notes=document.createElement('p');notes.className='photo-description';notes.textContent=item.notes;
details.append(title,meta,notes);
const actions=document.createElement('div');actions.className='photo-card-actions';
const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='원문 열기 ↗';
const remove=document.createElement('button');remove.type='button';remove.className='remove-photo';remove.textContent='후보 삭제';
remove.addEventListener('click',()=>{items=items.filter(x=>x.url.toLowerCase()!==item.url.toLowerCase());save();render();status.textContent='후보를 삭제했습니다.';});
actions.append(link,remove);card.append(details,actions);list.append(card);
});if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='저장된 검토 후보가 없습니다.';list.append(empty);}}
form.addEventListener('submit',e=>{e.preventDefault();try{const item=normalizeCandidate({id:crypto.randomUUID?.()||'candidate-'+Date.now(),type:document.querySelector('#candidate-type').value,title:document.querySelector('#candidate-title').value,sourceName:document.querySelector('#candidate-source').value,publishedAt:document.querySelector('#candidate-date').value,url:document.querySelector('#candidate-url').value,notes:document.querySelector('#candidate-notes').value});if(items.some(x=>x.url.toLowerCase()===item.url.toLowerCase()))throw new Error('이미 등록된 링크입니다.');items=validateCandidates([...items,item]);save();form.reset();render();status.textContent='검토 후보로 저장했습니다. 현재 브라우저에만 보관됩니다.';}catch(err){status.textContent=err.message;}});
document.querySelector('#export-candidates').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(items,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='haewon-candidates.json';a.click();URL.revokeObjectURL(url);status.textContent='후보 JSON을 내보냈습니다.';});
document.querySelector('#import-candidates').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{items=mergeCandidates(items,validateCandidates(JSON.parse(await file.text())));save();render();status.textContent='후보 JSON을 병합했습니다.';}catch(err){status.textContent='가져오기 실패: '+err.message;}finally{e.target.value='';}});
render();
}