export function filterDiscoveryItems(items,query='') {
 const q=String(query||'').trim().toLowerCase();
 if(!q)return items;
 return items.filter(item=>[item.title,item.description,item.sourceName,item.query].some(value=>String(value||'').toLowerCase().includes(q)));
}
const list=typeof document!=='undefined'?document.querySelector('#discovery-list'):null;
const count=typeof document!=='undefined'?document.querySelector('#discovery-count'):null;
const search=typeof document!=='undefined'?document.querySelector('#discovery-search'):null;
if(list&&count){
 let allItems=[];
 const render=()=>{
  const q=search?.value||'';
  const items=filterDiscoveryItems(allItems,q).slice().sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
  count.textContent=items.length+'개'+(q.trim()?' / 검색 결과':'');
  list.replaceChildren();
  items.slice(0,80).forEach(item=>{
   const card=document.createElement('article');card.className='photo-card';
   const details=document.createElement('div');details.className='photo-card-details';
   const title=document.createElement('h3');title.textContent=item.title;
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'뉴스')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):'')+' · 발견 후보';
   const note=document.createElement('p');note.className='photo-description';note.textContent=item.description||'검색 결과로 발견된 링크';
   const score=document.createElement('p');score.className='photo-meta';score.textContent='관련성 점수 '+(Number.isFinite(item.relevanceScore)?item.relevanceScore:'미평가')+' · 검토 전 후보';
   details.append(title,meta,score,note);
   const actions=document.createElement('div');actions.className='photo-card-actions';
   const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='원문 열기 ↗';
   actions.append(link);card.append(details,actions);list.append(card);
  });
  if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent=allItems.length?'검색 결과가 없습니다. 다른 검색어를 입력해 보세요.':'자동 발견 후보가 아직 없습니다.';list.append(empty);}
 };
 if(search)search.addEventListener('input',render);
 fetch('./data/discovery.json').then(response=>{if(!response.ok)throw new Error('discovery fetch failed');return response.json();}).then(items=>{
  allItems=Array.isArray(items)?items:[];
  render();
 }).catch(()=>{count.textContent='불러오기 실패';const empty=document.createElement('p');empty.className='empty';empty.textContent='자동 발견 자료를 불러오지 못했습니다.';list.replaceChildren(empty);});
}
