import { classifyDiscoveryItem, classifyDiscoveryCategories, groupDiscoveryDuplicates, assessDiscoveryQuality } from './discovery-kind.mjs';

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
 const categoryOf=classifyDiscoveryCategories;
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
  const filtered=groupDiscoveryDuplicates(filterDiscoveryItems(allItems,q)).filter(item=>selectedCategory==='all'||categoryOf(item).includes(selectedCategory));
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
   const kind=document.createElement('span');kind.className='tag';kind.textContent=categoryOf(item).map(category=>categoryLabels[category]||category).join(' · ');
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'출처 미상')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):'')+' · 발견 후보'+(item.duplicateCount>1?' · 중복 '+item.duplicateCount+'건 / 출처 '+item.sourceCount+'곳':'');
   const note=document.createElement('p');note.className='photo-description';note.textContent=item.description||'검색 결과로 발견된 링크';
   const score=document.createElement('p');score.className='photo-meta';const quality=assessDiscoveryQuality(item);score.textContent='관련성 점수 '+(Number.isFinite(item.relevanceScore)?item.relevanceScore:'미평가')+' · 자료 완성도 '+quality.score+'/100 ('+(quality.tier==='high'?'높음':quality.tier==='medium'?'보통':'낮음')+') · 검토 전 후보';
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

async function renderQualitySummary(){
 if(typeof document==='undefined')return; const host=document.querySelector('#discovery-quality-summary');if(!host)return;
 try{const response=await fetch('./data/quality-metrics.json');if(!response.ok)throw new Error('metrics unavailable');const metrics=await response.json();host.replaceChildren();
 const heading=document.createElement('h3');heading.textContent='자료 품질 현황';host.append(heading);
 const summary=document.createElement('p');summary.textContent='뉴스 수집 성공률 '+(metrics.collection.newsQuerySuccessRate===null?'미측정':metrics.collection.newsQuerySuccessRate+'%')+' · 후보 '+metrics.collection.newsCandidatesTotal+'개 · 링크 검사 '+(metrics.linkAudit?.checked||0)+'개 · 깨진 링크 '+(metrics.linkAudit?.broken?.length||0)+'개 · 접근제한/오류 '+((metrics.linkAudit?.rateLimited||0)+(metrics.linkAudit?.unreachable||0))+'개 · 썸네일 누락 '+(metrics.linkAudit?.thumbnailMissing||0)+'개';summary.textContent+=' · 링크 검사는 최근 최대 40개 후보 표본';host.append(summary);
 const classification=document.createElement('p');classification.textContent='분류 검토 정확도 '+(metrics.classification.accuracy===null?'미측정 (검토 라벨 없음)':metrics.classification.accuracy+'% · 검토 '+metrics.classification.reviewedSamples+'건');host.append(classification);
 for(const sourceStatus of metrics.sourceCollectionStatus||[]){const statusRow=document.createElement('p');statusRow.textContent=sourceStatus.source+' 수집 성공률 '+(sourceStatus.successRate===null?'미측정':sourceStatus.successRate+'%')+' ('+sourceStatus.successful+'/'+sourceStatus.requested+')';host.append(statusRow);}
 const dedupe=document.createElement('p');dedupe.textContent='중복 제거: '+(metrics.collection.newsAddedLastRun||0)+'개 신규 · 현재 그룹 '+(metrics.collection.duplicateGroupsCurrent||0)+'개 · 병합된 항목 '+(metrics.collection.duplicateItemsCollapsedCurrent||0)+'개';host.append(dedupe);
 for(const source of metrics.sources||[]){const row=document.createElement('p');row.className='photo-meta';row.textContent=source.source+' · '+source.items+'건 · URL '+source.urlCoverage+'% · 썸네일 '+source.thumbnailCoverage+'% · 날짜 '+source.dateCoverage+'%';host.append(row);}
 }catch{host.textContent='자료 품질 통계를 아직 사용할 수 없습니다.';}
}
renderQualitySummary();
