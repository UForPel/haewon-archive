const list=document.querySelector('#discovery-list');
const count=document.querySelector('#discovery-count');
if(list&&count){
 fetch('./data/discovery.json').then(response=>{if(!response.ok)throw new Error('discovery fetch failed');return response.json();}).then(items=>{
  count.textContent=items.length+'개';
  list.replaceChildren();
  items.slice(0,80).forEach(item=>{
   const card=document.createElement('article');card.className='photo-card';
   const details=document.createElement('div');details.className='photo-card-details';
   const title=document.createElement('h3');title.textContent=item.title;
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'뉴스')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):'')+' · 발견 후보';
   const note=document.createElement('p');note.className='photo-description';note.textContent=item.description||'검색 결과로 발견된 링크';
   details.append(title,meta,note);
   const actions=document.createElement('div');actions.className='photo-card-actions';
   const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='원문 열기 ↗';
   actions.append(link);card.append(details,actions);list.append(card);
  });
  if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='자동 발견 후보가 아직 없습니다.';list.append(empty);}
 }).catch(()=>{count.textContent='불러오기 실패';const empty=document.createElement('p');empty.className='empty';empty.textContent='자동 발견 자료를 불러오지 못했습니다.';list.replaceChildren(empty);});
}
