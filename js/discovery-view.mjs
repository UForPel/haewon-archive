import { classifyDiscoveryItem, classifyDiscoveryCategory, groupDiscoveryDuplicates } from './discovery-kind.mjs';

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
 const PAGE_SIZE=12;
 let page=1;
 const pagination=document.querySelector('#discovery-pagination');
 const renderPagination=(pageCount)=>{
  if(!pagination)return;
  pagination.replaceChildren();
  if(pageCount<=1){pagination.hidden=true;return;}
  pagination.hidden=false;
  const prev=document.createElement('button');prev.type='button';prev.textContent='이전';prev.disabled=page<=1;prev.addEventListener('click',()=>{page--;render();});
  const label=document.createElement('span');label.textContent=`${page} / ${pageCount}페이지`;label.setAttribute('aria-live','polite');
  const next=document.createElement('button');next.type='button';next.textContent='다음';next.disabled=page>=pageCount;next.addEventListener('click',()=>{page++;render();});
  pagination.append(prev,label,next);
 };
 const categoryBar=document.querySelector('#discovery-categories');
 let selectedCategory='all';
 const categoryOf=classifyDiscoveryCategory;
 const categoryLabels={all:'전체',news:'뉴스',video:'영상',official:'공식',interview:'인터뷰·방송',performance:'무대·공연',event:'행사·활동',brand:'광고·화보'};
 const renderCategories=()=>{
  if(!categoryBar)return;
  categoryBar.replaceChildren();
  Object.entries(categoryLabels).forEach(([key,label])=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;button.className=selectedCategory===key?'active':'';
   button.setAttribute('aria-pressed',String(selectedCategory===key));
   button.addEventListener('click',()=>{selectedCategory=key;page=1;render();});
   categoryBar.append(button);
  });
 };
 const render=()=>{
  const q=search?.value||'';
  const filtered=groupDiscoveryDuplicates(filterDiscoveryItems(allItems,q)).filter(item=>selectedCategory==='all'||categoryOf(item)===selectedCategory);
  const items=filtered.slice().sort((a,b)=>(Number(b.relevanceScore||0)-Number(a.relevanceScore||0))||(b.publishedAt||b.discoveredAt||'').localeCompare(a.publishedAt||a.discoveredAt||''));
  const pageCount=Math.max(1,Math.ceil(items.length/PAGE_SIZE));
  page=Math.min(page,pageCount);
  count.textContent=items.length+'개 그룹'+(q.trim()?' / 검색 결과':'')+' · '+categoryLabels[selectedCategory];
  list.replaceChildren();
  items.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE).forEach(item=>{
   const card=document.createElement('article');card.className='photo-card discovery-card';
   const thumbnail=document.createElement('div');thumbnail.className='discovery-thumbnail-wrap';
   if(/^https:\/\//i.test(String(item.thumbnailUrl||''))){
    const image=document.createElement('img');image.className='discovery-thumbnail';image.src=item.thumbnailUrl;image.alt='기사 또는 영상 미리보기';image.loading='lazy';image.onerror=()=>{const fallback=document.createElement('div');fallback.className='discovery-thumbnail-fallback';fallback.textContent='미리보기 이미지 없음';image.replaceWith(fallback);};thumbnail.append(image);
   }else{const fallback=document.createElement('div');fallback.className='discovery-thumbnail-fallback';fallback.textContent='미리보기 이미지 없음';thumbnail.append(fallback);}
   card.append(thumbnail);
   const details=document.createElement('div');details.className='photo-card-details';
   const title=document.createElement('h3');const titleLink=document.createElement('a');titleLink.href=item.url;titleLink.target='_blank';titleLink.rel='noopener noreferrer';titleLink.textContent=item.title;titleLink.className='discovery-title-link';title.append(titleLink);
   const kind=document.createElement('span');kind.className='tag';kind.textContent=categoryLabels[categoryOf(item)];
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'출처 미상')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):'')+' · 발견 후보'+(item.duplicateCount>1?' · 중복 '+item.duplicateCount+'건 / 출처 '+item.sourceCount+'곳':'');
   const note=document.createElement('p');note.className='photo-description';note.textContent=item.description||'검색 결과로 발견된 링크';
   const score=document.createElement('p');score.className='photo-meta';score.textContent='관련성 점수 '+(Number.isFinite(item.relevanceScore)?item.relevanceScore:'미평가')+' · 검토 전 후보';
   details.append(title,kind,meta,score,note);
   card.append(details);list.append(card);
  });
  renderPagination(pageCount);
  if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent=allItems.length?'검색 결과가 없습니다. 다른 검색어를 입력해 보세요.':'자동 발견 후보가 아직 없습니다.';list.append(empty);}
 };
 if(search)search.addEventListener('input',()=>{page=1;render();});
 fetch('./data/discovery.json').then(response=>{if(!response.ok)throw new Error('discovery fetch failed');return response.json();}).then(items=>{
  allItems=Array.isArray(items)?items:[];
  render();
 }).catch(()=>{count.textContent='불러오기 실패';const empty=document.createElement('p');empty.className='empty';empty.textContent='자동 발견 자료를 불러오지 못했습니다.';list.replaceChildren(empty);});
}
