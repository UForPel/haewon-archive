import { classifyDiscoveryItem, classifyDiscoveryCategories, groupDiscoveryDuplicates, assessDiscoveryQuality, filterArticleCandidates, filterDiscoveryRelevance, cleanDiscoveryText, filterUnresolvedVideoCandidates } from './discovery-kind.mjs';
import { createThumbnailReviewKey, summarizeThumbnailReviews, validateThumbnailReviewExport, mergeThumbnailReviewLabels, getThumbnailReviewCandidates, findNextUnreviewedThumbnail, groupRepeatedThumbnailAssignments, summarizeRepeatedThumbnailGroup, findNextUnreviewedInRepeatedGroup, persistThumbnailReviewLabels, revealThumbnailReviewRow } from './thumbnail-review.mjs';

function getDiscoveryTimestamp(item) {
 for (const value of [item?.publishedAt, item?.discoveredAt]) {
  const timestamp = Date.parse(value || '');
  if (Number.isFinite(timestamp)) return timestamp;
 }
 return Number.NaN;
}

export function sortDiscoveryItems(items=[],mode='date') {
 return items.map((item,index)=>({item,index})).sort((a,b)=>{
  const aDate=getDiscoveryTimestamp(a.item),bDate=getDiscoveryTimestamp(b.item);
  const aValid=Number.isFinite(aDate),bValid=Number.isFinite(bDate);
  if(mode==='relevance'){const score=Number(b.item.relevanceScore||0)-Number(a.item.relevanceScore||0);if(score)return score;}
  if(aValid!==bValid)return aValid?-1:1;
  if(aValid&&aDate!==bDate)return bDate-aDate;
  if(mode!=='relevance'){const score=Number(b.item.relevanceScore||0)-Number(a.item.relevanceScore||0);if(score)return score;}
  return a.index-b.index;
 }).map(entry=>entry.item);
}
export function filterDiscoveryItems(items,query='') {
 const q=String(query||'').trim().toLowerCase();
 if(!q)return items;
 return items.filter(item=>[item.title,cleanDiscoveryText(item.description),item.sourceName,item.query].some(value=>String(value||'').toLowerCase().includes(q)));
}
const list=typeof document!=='undefined'?document.querySelector('#discovery-list'):null;
const count=typeof document!=='undefined'?document.querySelector('#discovery-count'):null;
const search=typeof document!=='undefined'?document.querySelector('#discovery-search'):null;
if(list&&count){
 let allItems=[];
 const REVIEW_KEY='haewon-thumbnail-reviews-v1';
 let reviewLabels={};
 try{reviewLabels=JSON.parse(localStorage.getItem(REVIEW_KEY)||'{}')||{};}catch{reviewLabels={};}
 const reviewLabelsAllowed=['relevant','unrelated','generic','broken','rights-unclear','uncertain'];
 const persistReviewLabels=(nextLabels)=>{
  const result=persistThumbnailReviewLabels(localStorage,REVIEW_KEY,reviewLabels,nextLabels);
  if(!result.saved)return false;
  reviewLabels=result.labels;
  return true;
 };
 const reviewLabelNames={relevant:'기사와 관련 있음',unrelated:'기사와 무관함',generic:'로고·일반 이미지',broken:'이미지 오류', 'rights-unclear':'권리 확인 필요',uncertain:'판단 보류'};
 const reviewTools=document.createElement('div');reviewTools.className='thumbnail-review-tools';
 const exportReviews=document.createElement('button');exportReviews.type='button';exportReviews.textContent='검수 라벨 내보내기';exportReviews.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),labels:reviewLabels},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='haewon-thumbnail-reviews.json';a.click();URL.revokeObjectURL(url);});
 const importReviews=document.createElement('input');importReviews.type='file';importReviews.accept='application/json,.json';importReviews.hidden=true;importReviews.addEventListener('change',async()=>{const file=importReviews.files?.[0];if(!file)return;try{const parsed=validateThumbnailReviewExport(await file.text());const nextLabels=mergeThumbnailReviewLabels(reviewLabels,parsed.labels);if(!persistReviewLabels(nextLabels)){alert('브라우저 저장 공간에 기록하지 못했습니다. 기존 검수 기록은 유지됩니다. JSON 내보내기로 백업한 뒤 다시 시도해 주세요.');return;}render();}catch{alert('검수 JSON 파일을 읽지 못했습니다. 기존 검수 기록은 유지됩니다.');}finally{importReviews.value='';}});
 const importButton=document.createElement('button');importButton.type='button';importButton.textContent='검수 라벨 가져오기';importButton.addEventListener('click',()=>importReviews.click());
 reviewTools.append(exportReviews,importButton,importReviews);
 const reviewDetails=document.createElement('details');reviewDetails.className='discovery-review-tools';
 const reviewSummaryTitle=document.createElement('summary');reviewSummaryTitle.textContent='이미지 검수 도구 · 라벨 가져오기/내보내기';
 reviewDetails.append(reviewSummaryTitle,reviewTools);
 search?.insertAdjacentElement('afterend',reviewDetails);
 const reviewSummary=document.createElement('p');reviewSummary.className='photo-meta';reviewTools.after(reviewSummary);
 const reviewQueueButton=document.createElement('button');reviewQueueButton.type='button';reviewQueueButton.className='review-next-button';reviewQueueButton.textContent='다음 미검수 후보';
 const reviewQueueStatus=document.createElement('p');reviewQueueStatus.className='photo-meta';reviewQueueStatus.setAttribute('role','status');reviewQueueStatus.setAttribute('aria-live','polite');
 reviewTools.append(reviewQueueButton,reviewQueueStatus);

 const repeatedReviewPanel=document.createElement('details');repeatedReviewPanel.className='thumbnail-cluster-review';repeatedReviewPanel.hidden=true;
 const repeatedReviewHeading=document.createElement('summary');repeatedReviewHeading.textContent='반복 이미지 묶음 검수';repeatedReviewPanel.append(repeatedReviewHeading);
 const repeatedReviewNote=document.createElement('p');repeatedReviewNote.className='photo-meta';repeatedReviewNote.textContent='같은 이미지 URL이 여러 기사에 배정된 묶음입니다. 이미지가 같아도 기사별 적합성은 다를 수 있으므로 각 기사에 따로 라벨을 지정합니다. 자동 삭제·교체는 하지 않습니다.';repeatedReviewPanel.append(repeatedReviewNote);
 const repeatedReviewPreview=document.createElement('img');repeatedReviewPreview.className='thumbnail-cluster-preview';repeatedReviewPreview.alt='반복 배정된 이미지 미리보기';repeatedReviewPreview.loading='lazy';repeatedReviewPanel.append(repeatedReviewPreview);
 const repeatedReviewProgress=document.createElement('p');repeatedReviewProgress.className='photo-meta';repeatedReviewProgress.setAttribute('role','status');repeatedReviewProgress.setAttribute('aria-live','polite');repeatedReviewPanel.append(repeatedReviewProgress);
 const repeatedReviewSearchLabel=document.createElement('label');repeatedReviewSearchLabel.className='thumbnail-cluster-search-label';repeatedReviewSearchLabel.textContent='묶음 안에서 기사 찾기';
 const repeatedReviewSearch=document.createElement('input');repeatedReviewSearch.type='search';repeatedReviewSearch.className='thumbnail-cluster-search';repeatedReviewSearch.placeholder='기사 제목 또는 출처';repeatedReviewSearchLabel.append(repeatedReviewSearch);repeatedReviewPanel.append(repeatedReviewSearchLabel);
 const repeatedReviewNext=document.createElement('button');repeatedReviewNext.type='button';repeatedReviewNext.className='review-next-button';repeatedReviewNext.textContent='다음 미검수 기사';repeatedReviewPanel.append(repeatedReviewNext);
 const repeatedReviewList=document.createElement('div');repeatedReviewList.className='thumbnail-cluster-list';repeatedReviewPanel.append(repeatedReviewList);
 reviewTools.append(repeatedReviewPanel);
 const repeatedReviewGroups=()=>groupRepeatedThumbnailAssignments(allItems);
 const repeatedReviewMatches=(item,query)=>!query||[item.title,item.sourceName,item.publisherHost].some(value=>String(value||'').toLowerCase().includes(query));
 const renderRepeatedReviewRows=()=>{
  const group=repeatedReviewGroups()[0];repeatedReviewList.replaceChildren();
  if(!group)return;
  const query=String(repeatedReviewSearch.value||'').trim().toLowerCase();
  const records=group.records.filter(item=>repeatedReviewMatches(item,query));
  records.forEach(item=>{
   const key=createThumbnailReviewKey(item.id,group.url),row=document.createElement('article');row.className='thumbnail-cluster-row';row.dataset.reviewKey=key;
   const info=document.createElement('div');info.className='thumbnail-cluster-info';
   const title=document.createElement('a');title.className='thumbnail-cluster-title';title.href=item.publisherArticleUrl||item.url||'#';title.target='_blank';title.rel='noopener noreferrer';title.textContent=item.title||'제목 미상';
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||item.discoverySource||'출처 미상')+' · '+(item.publisherArticleUrl?'개별 HTTPS 기사 URL 확인':'발견 링크만 확인')+' · 이미지 출처 '+(item.thumbnailSource||'미상');
   const select=document.createElement('select');select.setAttribute('aria-label','반복 이미지의 기사별 적합성 검수');
   const blank=document.createElement('option');blank.value='';blank.textContent='기사별 검수 라벨 선택';select.append(blank);
   reviewLabelsAllowed.forEach(label=>{const option=document.createElement('option');option.value=label;option.textContent=reviewLabelNames[label];select.append(option);});
   select.value=reviewLabels[key]?.label||'';
   const save=document.createElement('button');save.type='button';save.textContent='저장';
   save.addEventListener('click',()=>{if(!select.value)return;const nextLabels={...reviewLabels,[key]:{articleId:item.id,imageUrl:group.url,source:item.thumbnailSource||'unknown',label:select.value,reviewedAt:new Date().toISOString()}};if(persistReviewLabels(nextLabels)){updateReviewSummary();updateRepeatedReviewSummary();save.textContent='저장됨';repeatedReviewProgress.textContent='기사별 검수 저장 완료. 다음 미검수 기사로 이동합니다.';requestAnimationFrame(()=>repeatedReviewNext.click());}else{select.value=reviewLabels[key]?.label||'';save.textContent='저장 실패';repeatedReviewProgress.textContent='저장 공간 오류로 검수 기록을 저장하지 못했습니다. 기존 라벨은 유지됩니다.';}});
   select.addEventListener('change',()=>{if(select.value)save.click();});
   info.append(title,meta,select,save);row.append(info);repeatedReviewList.append(row);
  });
  if(!records.length){const empty=document.createElement('p');empty.className='photo-meta';empty.textContent='검색 조건에 맞는 기사가 없습니다.';repeatedReviewList.append(empty);}
 };
 const updateRepeatedReviewSummary=()=>{
  const groups=repeatedReviewGroups();repeatedReviewPanel.hidden=!groups.length;
  if(!groups.length)return;
  const group=groups[0],summary=summarizeRepeatedThumbnailGroup(group,reviewLabels);
  repeatedReviewHeading.textContent='반복 이미지 묶음 검수 · '+groups.length+'개 그룹 · 최대 '+group.count+'개 기사';
  repeatedReviewProgress.textContent='현재 묶음 '+summary.reviewed+'/'+summary.count+'개 검수 ('+summary.reviewCoverage+'%) · 미검수 '+summary.pending+'개 · 기사별 판단 유지';
  repeatedReviewPreview.src=group.url;
  if(repeatedReviewPanel.open)renderRepeatedReviewRows();
 };
 repeatedReviewPanel.addEventListener('toggle',()=>{if(repeatedReviewPanel.open)renderRepeatedReviewRows();});
 repeatedReviewSearch.addEventListener('input',renderRepeatedReviewRows);
 repeatedReviewNext.addEventListener('click',()=>{
  const group=repeatedReviewGroups()[0];if(!group)return;
  const query=String(repeatedReviewSearch.value||'').trim().toLowerCase();
  const filtered={...group,records:group.records.filter(item=>repeatedReviewMatches(item,query))};
  const next=findNextUnreviewedInRepeatedGroup(filtered,reviewLabels);
  if(!next){repeatedReviewProgress.textContent='현재 검색 조건의 반복 이미지 기사는 모두 검수했습니다.';return;}
  if(!repeatedReviewPanel.open)repeatedReviewPanel.open=true;
  renderRepeatedReviewRows();
  requestAnimationFrame(()=>{const row=[...repeatedReviewList.querySelectorAll('.thumbnail-cluster-row')].find(element=>element.dataset.reviewKey===next.reviewKey);if(!row)return;row.scrollIntoView({behavior:'smooth',block:'center'});row.querySelector('select')?.focus({preventScroll:true});});
 });

 const updateReviewSummary=()=>{const summary=summarizeThumbnailReviews(allItems,reviewLabels);reviewSummary.textContent='기사 썸네일 검수 · '+summary.reviewed+'/'+summary.eligible+'개 후보 검수 ('+summary.reviewCoverage+'%) · 후보 적합률 '+(summary.precision===null?'미측정':summary.precision+'%')+' · 현재 썸네일 정밀도 '+(summary.selectedPrecision===null?'미측정':summary.selectedPrecision+'%')+' ('+summary.selectedReviewed+'/'+summary.selectedEligible+'개) · 판단 보류/권리 확인 '+summary.excluded+' (모델 정확도와 별도)';reviewQueueStatus.textContent='전체 후보 '+summary.eligible+'개 · 검수 완료 '+summary.reviewed+'개 · 미검수 '+(summary.eligible-summary.reviewed)+'개';updateRepeatedReviewSummary();};
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
 const videoDiscoveryList=document.querySelector('#video-discovery-list');
  const videoDiscoveryCount=document.querySelector('#video-discovery-count');
  const sortSelect=document.querySelector('#discovery-sort');
  let selectedSort=sortSelect?.value||'date';
  const categoryBar=document.querySelector('#discovery-categories');
 const relevanceBar=document.querySelector('#discovery-relevance');
 let selectedRelevance='verified-haewon';
 let unverifiedRepeatedThumbnailUrls=new Set();
 const relevanceLabels={'verified-haewon':'해원 원문 확인',haewon:'해원 기사 후보',nmixx:'NMIXX 기사 후보',all:'전체 기사 후보'};
 let selectedCategory='all';
 const categoryOf=classifyDiscoveryCategories;
 const categoryLabels={all:'전체 분류',news:'일반 뉴스',official:'공식',interview:'인터뷰·방송',performance:'무대·공연',event:'행사·활동',brand:'광고·화보'};
 const getVisibleItems=()=>{
  const q=search?.value||'';
  return sortDiscoveryItems(groupDiscoveryDuplicates(filterDiscoveryRelevance(filterDiscoveryItems(filterArticleCandidates(allItems),q),selectedRelevance),selectedSort).filter(item=>selectedCategory==='all'||categoryOf(item).includes(selectedCategory)),selectedSort);
 };
 const renderCategories=()=>{
  if(!categoryBar)return;
  categoryBar.replaceChildren();
  Object.entries(categoryLabels).forEach(([key,label])=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;button.className=selectedCategory===key?'active':'';
   button.setAttribute('aria-pressed',String(selectedCategory===key));
   button.addEventListener('click',()=>{selectedCategory=key;page=1;renderCategories();render();});
   categoryBar.append(button);
  });
 };
 const renderRelevanceFilters=()=>{
  if(!relevanceBar)return;
  relevanceBar.replaceChildren();
  Object.entries(relevanceLabels).forEach(([key,label])=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;button.className=selectedRelevance===key?'active':'';
   button.setAttribute('aria-pressed',String(selectedRelevance===key));
   button.addEventListener('click',()=>{selectedRelevance=key;page=1;renderRelevanceFilters();render();});
   relevanceBar.append(button);
  });
 };
 const renderVideoDiscoveryCandidates=()=>{
  if(!videoDiscoveryList)return;
  const q=search?.value||'';
  const candidates=sortDiscoveryItems(groupDiscoveryDuplicates(filterDiscoveryItems(filterUnresolvedVideoCandidates(allItems),q),'date'),'date');
  if(videoDiscoveryCount)videoDiscoveryCount.textContent=candidates.length+'개';
  videoDiscoveryList.replaceChildren();
  candidates.slice(0,12).forEach(item=>{
   const row=document.createElement('article');row.className='video-discovery-candidate';
   const title=document.createElement('a');title.href=item.url;title.target='_blank';title.rel='noopener noreferrer';title.textContent=cleanDiscoveryText(item.title)||'제목 미상';
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'출처 미상')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):' · 날짜 미확인')+' · 원본 YouTube 주소 미확인';
   const note=document.createElement('p');note.className='photo-description';note.textContent='발견 후보 링크만 확인된 상태입니다. 원본 영상 주소가 명시적으로 확인되기 전에는 영상 아카이브에 등록하지 않습니다.';
   row.append(title,meta,note);videoDiscoveryList.append(row);
  });
  if(!candidates.length){const empty=document.createElement('p');empty.className='photo-meta';empty.textContent='별도 확인이 필요한 영상 후보가 없습니다.';videoDiscoveryList.append(empty);}
  if(candidates.length>12){const more=document.createElement('p');more.className='photo-meta';more.textContent='최근 12개 표시 · 전체 '+candidates.length+'개 후보';videoDiscoveryList.append(more);}
 };
 const render=()=>{
  const items=getVisibleItems();
  const pageCount=Math.max(1,Math.ceil(items.length/PAGE_SIZE));
  page=Math.min(page,pageCount);
  count.textContent=items.length+'개 기사'+(String(search?.value||'').trim()?' / 검색 결과':'')+' · '+relevanceLabels[selectedRelevance]+' · '+categoryLabels[selectedCategory];
  list.replaceChildren();
  items.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE).forEach(item=>{
   const card=document.createElement('article');card.className='photo-card discovery-card';
   const thumbnail=document.createElement('div');thumbnail.className='discovery-thumbnail-wrap';
   const legacySharedImage=String(item.thumbnailUrl||'')&&unverifiedRepeatedThumbnailUrls.has(item.thumbnailUrl)&&!item.thumbnailSource&&!item.thumbnailMetaFetch&&!item.publisherArticleUrl;
   if(/^https:\/\//i.test(String(item.thumbnailUrl||''))&&!legacySharedImage){
    const image=document.createElement('img');image.className='discovery-thumbnail';image.src=item.thumbnailUrl;image.alt='기사 또는 영상 미리보기';image.loading='lazy';image.onerror=()=>{const fallback=document.createElement('div');fallback.className='discovery-thumbnail-fallback';fallback.textContent='이미지 불러오기 실패';image.replaceWith(fallback);};thumbnail.append(image);
   }else{const fallback=document.createElement('div');fallback.className='discovery-thumbnail-fallback';fallback.textContent=legacySharedImage?'기사별 이미지 확인 전':'이미지 미확인';thumbnail.append(fallback);}
   card.append(thumbnail);
   const details=document.createElement('div');details.className='photo-card-details';
   const title=document.createElement('h3');const titleLink=document.createElement('a');titleLink.href=item.publisherArticleUrl||item.url;titleLink.target='_blank';titleLink.rel='noopener noreferrer';titleLink.textContent=cleanDiscoveryText(item.title);titleLink.className='discovery-title-link';title.append(titleLink);
   const kind=document.createElement('span');kind.className='tag';kind.textContent=categoryOf(item).map(category=>categoryLabels[category]||category).join(' · ');
   const meta=document.createElement('p');meta.className='photo-meta';meta.textContent=(item.sourceName||'출처 미상')+(item.publishedAt?' · '+new Date(item.publishedAt).toLocaleDateString('ko-KR'):'')+' · '+(item.publisherArticleUrl?'원문 확인':'발견 후보');
   const note=document.createElement('p');note.className='photo-description';note.textContent=cleanDiscoveryText(item.description);
   details.append(title,kind,meta);
   if(note.textContent)details.append(note);
   const candidateList=getThumbnailReviewCandidates(item);
   const reviewDisclosure=document.createElement('details');reviewDisclosure.className='thumbnail-review-disclosure';
   const reviewDisclosureTitle=document.createElement('summary');reviewDisclosureTitle.textContent='이미지 후보 검수 · '+candidateList.length+'개';
   reviewDisclosure.append(reviewDisclosureTitle);
   const reviewSection=document.createElement('section');reviewSection.className='thumbnail-review-section';
   if(!candidateList.length){const empty=document.createElement('p');empty.className='photo-meta';empty.textContent='수집된 이미지 후보 없음';reviewSection.append(empty);}
   candidateList.forEach(candidate=>{const row=document.createElement('div');row.className='thumbnail-review-row';const image=document.createElement('img');image.src=candidate.url;image.alt='검수할 이미지 후보';image.loading='lazy';image.onerror=()=>{image.alt='이미지 불러오기 실패';image.classList.add('thumbnail-review-broken');};const info=document.createElement('div');info.className='thumbnail-review-info';const source=document.createElement('p');source.className='photo-meta';source.textContent=(candidate.source||'unknown')+(Number.isFinite(candidate.priority)?' · 우선순위 '+candidate.priority:'')+(candidate.url===item.thumbnailUrl?' · 현재 썸네일':'');const link=document.createElement('a');link.href=candidate.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='이미지 원본 열기';const key=createThumbnailReviewKey(item.id,candidate.url);row.dataset.reviewKey=key;const select=document.createElement('select');select.setAttribute('aria-label','이미지 적합성 검수');const blank=document.createElement('option');blank.value='';blank.textContent='검수 라벨 선택';select.append(blank);reviewLabelsAllowed.forEach(label=>{const option=document.createElement('option');option.value=label;option.textContent=reviewLabelNames[label];select.append(option);});select.value=reviewLabels[key]?.label||'';const save=document.createElement('button');save.type='button';save.textContent='라벨 저장';save.addEventListener('click',()=>{if(!select.value)return;const nextLabels={...reviewLabels,[key]:{articleId:item.id,imageUrl:candidate.url,source:candidate.source||'unknown',label:select.value,reviewedAt:new Date().toISOString()}};if(persistReviewLabels(nextLabels)){updateReviewSummary();save.textContent='저장됨';reviewQueueStatus.textContent='검수 저장 완료. 다음 미검수 후보로 이동합니다.';requestAnimationFrame(()=>reviewQueueButton.click());}else{select.value=reviewLabels[key]?.label||'';save.textContent='저장 실패';reviewQueueStatus.textContent='저장 공간 오류로 검수 기록을 저장하지 못했습니다. 기존 라벨은 유지됩니다.';}});select.addEventListener('change',()=>{if(select.value)save.click();});info.append(source,link,select,save);row.append(image,info);reviewSection.append(row);});
   reviewDisclosure.append(reviewSection);
   details.append(reviewDisclosure);
   card.append(details);list.append(card);
  });
  renderPagination(pageCount);
  renderVideoDiscoveryCandidates();
  updateReviewSummary();
  if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent=allItems.length?'검색 결과가 없습니다. 다른 검색어를 입력해 보세요.':'자동 발견 후보가 아직 없습니다.';list.append(empty);}
 };
 reviewQueueButton.addEventListener('click',()=>{
  const items=getVisibleItems(),next=findNextUnreviewedThumbnail(items,reviewLabels);
  if(!next){reviewQueueStatus.textContent='현재 검색·분류 조건에 미검수 이미지 후보가 없습니다.';return;}
  page=Math.floor(next.itemIndex/PAGE_SIZE)+1;render();
  requestAnimationFrame(()=>{
   const row=[...list.querySelectorAll('.thumbnail-review-row')].find(element=>element.dataset.reviewKey===next.reviewKey);
   if(!row){reviewQueueStatus.textContent='후보 위치를 찾지 못했습니다. 목록을 새로고침해 주세요.';return;}
   if(!revealThumbnailReviewRow(row)){reviewQueueStatus.textContent='검수 영역을 열지 못했습니다. 해당 기사의 이미지 후보를 직접 펼쳐 주세요.';return;}
   requestAnimationFrame(()=>{
    row.scrollIntoView({behavior:'smooth',block:'center'});
    row.querySelector('select')?.focus({preventScroll:true});
    reviewQueueStatus.textContent='미검수 후보 '+(next.itemIndex+1)+'번째 항목으로 이동했습니다. 라벨을 선택하면 자동 저장됩니다.';
   });
  });
 });
 renderCategories();
 renderRelevanceFilters();
 if(search)search.addEventListener('input',()=>{page=1;render();});
  if(sortSelect)sortSelect.addEventListener('change',()=>{selectedSort=sortSelect.value==='relevance'?'relevance':'date';page=1;render();});
 fetch('./data/discovery.json').then(response=>{if(!response.ok)throw new Error('discovery fetch failed');return response.json();}).then(items=>{
  allItems=Array.isArray(items)?items:[];
  const imageGroups=new Map();
  for(const item of allItems){const url=String(item.thumbnailUrl||'');if(url)imageGroups.set(url,(imageGroups.get(url)||0)+1);}
  unverifiedRepeatedThumbnailUrls=new Set([...imageGroups].filter(([url,n])=>n>=10&&allItems.filter(item=>item.thumbnailUrl===url).every(item=>!item.thumbnailSource&&!item.thumbnailMetaFetch&&!item.publisherArticleUrl)).map(([url])=>url));
  render();
 }).catch(()=>{count.textContent='불러오기 실패';const empty=document.createElement('p');empty.className='empty';empty.textContent='자동 발견 자료를 불러오지 못했습니다.';list.replaceChildren(empty);});
}

async function renderQualitySummary(){
 if(typeof document==='undefined')return; const host=document.querySelector('#discovery-quality-summary');if(!host)return;
 try{const response=await fetch('./data/quality-metrics.json');if(!response.ok)throw new Error('metrics unavailable');const metrics=await response.json();host.replaceChildren(); const panel=document.createElement('details');panel.className='quality-details';const panelTitle=document.createElement('summary');panelTitle.textContent='수집·품질 진단 보기';const panelBody=document.createElement('div');panelBody.className='quality-details-body';panel.append(panelTitle,panelBody);host.append(panel);
 const heading=document.createElement('h3');heading.textContent='자료 품질 현황';panelBody.append(heading);
 const summary=document.createElement('p');summary.textContent='뉴스 수집 성공률 '+(metrics.collection.newsQuerySuccessRate===null?'미측정':metrics.collection.newsQuerySuccessRate+'%')+' · 후보 '+metrics.collection.newsCandidatesTotal+'개 · 링크 검사 '+(metrics.linkAudit?.checked||0)+'개 · 깨진 링크 '+(metrics.linkAudit?.broken?.length||0)+'개 · 접근제한/오류 '+((metrics.linkAudit?.rateLimited||0)+(metrics.linkAudit?.unreachable||0))+'개 · 썸네일 누락 '+(metrics.linkAudit?.thumbnailMissing||0)+'개';summary.textContent+=' · 링크 검사는 최근 최대 40개 후보 표본';panelBody.append(summary);
 const relevance=metrics.discoveryRelevance;if(relevance){const relevanceRow=document.createElement('p');relevanceRow.textContent='원문 확인 기사 '+relevance.verifiedPublisherArticles+'개 (출처 확인 이미지 '+relevance.verifiedPublisherArticlesWithProvenanceThumbnail+'개) · 해원 원문 확인 '+relevance.verifiedHaewonArticles+'개 (출처 확인 이미지 '+relevance.verifiedHaewonWithProvenanceThumbnail+'개) · 해원 기사 후보 '+relevance.haewonTitleMatches+'개 · NMIXX 기사 후보 '+relevance.nmixxTitleMatches+'개 · 영상 후보 '+relevance.videoCandidates+'개 (기사 목록과 분리)';panelBody.append(relevanceRow);}
 const articleUrls=metrics.articleUrlProvenance;if(articleUrls){const articleRow=document.createElement('p');articleRow.textContent='개별 기사 URL 확인 '+(articleUrls.itemsWithPublisherArticleUrl||0)+'개 · Bing News 후보 '+(articleUrls.bingNewsItems||0)+'개 · 후보 출처 '+Object.entries(articleUrls.candidateSourceCounts||{}).map(([name,count])=>name+' '+count).join(', ')+' · 출판사 호스트 '+Object.entries(articleUrls.publisherHosts||{}).slice(0,5).map(([name,count])=>name+' '+count).join(', ')+' · 메타 최종 호스트 표본 '+Object.entries(articleUrls.finalHosts||{}).map(([name,count])=>name+' '+count).join(', ');panelBody.append(articleRow);}
 const imageAudit=metrics.thumbnailAudit;if(imageAudit){const row=document.createElement('p');row.textContent='썸네일 URL 검사 · 확보 '+imageAudit.withThumbnail+'/'+imageAudit.items+' · 고유 이미지 URL '+imageAudit.uniqueThumbnailUrls+' · 고유 이미지 배정률 '+(imageAudit.uniqueThumbnailAssignmentRate??'미측정')+'% · 고유 이미지 전체 커버 '+(imageAudit.uniqueImageCoverage??'미측정')+'% · 반복 URL 그룹 '+imageAudit.repeatedUrlGroups+' ('+imageAudit.repeatedItems+'개 중복 사용) · URL 누락 '+imageAudit.missing;panelBody.append(row);if(imageAudit.concentrationWarning){const concentration=document.createElement('p');concentration.className='photo-meta';concentration.textContent='주의: 대표 썸네일 URL '+(imageAudit.dominantThumbnailShare||0)+'% ('+(imageAudit.dominantThumbnailCount||0)+'개) 집중. 실제 이미지 동일성/관련성은 시각 검수 필요';panelBody.append(concentration);}for(const source of (imageAudit.hosts||[]).slice(0,5)){const hostRow=document.createElement('p');hostRow.className='photo-meta';hostRow.textContent='이미지 호스트 '+source.host+' · '+source.count+'개';panelBody.append(hostRow);}} 
 const responseAudit=metrics.thumbnailResponseAudit;if(responseAudit){const responseRow=document.createElement('p');responseRow.textContent='썸네일 응답 검사 (고유 URL 표본 '+responseAudit.checked+'개) · 이미지 아닌 응답 '+responseAudit.nonImage.length+' · 깨진 '+responseAudit.broken.length+' · 접근 실패 '+responseAudit.unreachable.length+' · 제한 '+responseAudit.rateLimited.length;panelBody.append(responseRow);} if(imageAudit?.heuristicFlags?.length){const heuristicRow=document.createElement('p');heuristicRow.textContent='의심 URL 힌트 '+imageAudit.heuristicFlaggedUrls+'개 (반복 URL·로고/아이콘 이름·작은 크기 표기; 자동 확정 판정 아님)';panelBody.append(heuristicRow);} const thumbReview=metrics.thumbnailReviewMetrics||{};const thumbReviewRow=document.createElement('p');thumbReviewRow.textContent='기사 이미지 검수 · '+(thumbReview.reviewed||0)+'/'+(thumbReview.eligible||0)+'개 후보 ('+(thumbReview.reviewCoverage??0)+'%) · 후보 적합률 '+(thumbReview.precision===null||thumbReview.precision===undefined?'미측정':thumbReview.precision+'%')+' · 현재 썸네일 정밀도 '+(thumbReview.selectedPrecision===null||thumbReview.selectedPrecision===undefined?'미측정':thumbReview.selectedPrecision+'%')+' · 검수 데이터는 data/thumbnail-reviews.json';panelBody.append(thumbReviewRow);const classification=document.createElement('p');classification.textContent='분류 검토 정확도 '+(metrics.classification.accuracy===null?'미측정 (검토 라벨 없음)':metrics.classification.accuracy+'% · 검토 '+metrics.classification.reviewedSamples+'건');panelBody.append(classification); if(metrics.classification.reviewedSamples>0){const exact=document.createElement('p');exact.textContent='단일 분류 정확도 '+(metrics.classification.exactSingleLabelAccuracy??'미측정')+'%';panelBody.append(exact);for(const [category,review] of Object.entries(metrics.classification.perCategoryReview||{})){const row=document.createElement('p');row.textContent='검수 '+category+' · '+review.accuracy+'% ('+review.correct+'/'+review.samples+')';panelBody.append(row);}}
 for(const sourceStatus of metrics.sourceCollectionStatus||[]){const statusRow=document.createElement('p');statusRow.textContent=sourceStatus.source+' 수집 성공률 '+(sourceStatus.successRate===null?'미측정':sourceStatus.successRate+'%')+' ('+sourceStatus.successful+'/'+sourceStatus.requested+')';panelBody.append(statusRow);}
 const dedupe=document.createElement('p');dedupe.textContent='중복 제거: '+(metrics.collection.newsAddedLastRun||0)+'개 신규 · 현재 그룹 '+(metrics.collection.duplicateGroupsCurrent||0)+'개 · 병합된 항목 '+(metrics.collection.duplicateItemsCollapsedCurrent||0)+'개';panelBody.append(dedupe); const hostDiagnostics=metrics.thumbnailEnrichmentByHost||[];if(hostDiagnostics.length){const diagnostic=document.createElement('section');diagnostic.className='photo-policy';const heading=document.createElement('strong');heading.textContent='출판사별 이미지 메타데이터 수집 진단 · 재시도 대기 포함';diagnostic.append(heading);for(const rowData of hostDiagnostics.slice(0,8)){const row=document.createElement('p');row.className='photo-meta';row.textContent=rowData.host+' · 시도 '+rowData.attempted+' · 배정 '+rowData.assigned+' · 후보 발견 '+rowData.found+' · 발견률 '+rowData.candidateRate+'% · 발견 후 배정률 '+(rowData.assignmentRate===null?'미측정':rowData.assignmentRate+'%')+' · 메타 없음 '+rowData.missing+' · 오류 '+rowData.failed+' · 재사용 거부 '+rowData.duplicateRejected+' · 오류 코드 '+Object.entries(rowData.errorCodes||{}).map(([code,count])=>code+' '+count).join(', ')+' · 최종 호스트 '+Object.entries(rowData.finalHosts||{}).map(([host,count])=>host+' '+count).join(', ');diagnostic.append(row);}panelBody.append(diagnostic);}const thumb=metrics.collection.thumbnailEnrichment; if(thumb){
 const row=document.createElement('p');row.textContent='썸네일 보완 · 후보 '+thumb.attempted+'건 · 이미지 URL 발견 '+thumb.found+'건 · 실제 신규 배정 '+thumb.assigned+'건 · 중복 거부 '+thumb.duplicateRejected+'건 · Google News 래퍼 메타 '+(thumb.wrapperOnly||0)+'건 · 이미지 없음 '+thumb.missing+'건 · 오류 '+thumb.failed+'건';panelBody.append(row);
 const provenanceMetrics=metrics.thumbnailProvenance||{};const provenance=provenanceMetrics.assignedBySource||{};const provenanceRow=document.createElement('p');provenanceRow.className='photo-meta';provenanceRow.textContent='썸네일 출처 검증: 배정 '+(provenanceMetrics.assignedTotal||0)+'건 · 출처 미확인 레거시 '+(provenanceMetrics.unverifiedLegacyAssignments||0)+'건 · 썸네일 없음 '+(provenanceMetrics.missingThumbnailCount||0)+'건 · 출처 확인률 '+(provenanceMetrics.sourceProvenanceCoverage===null||provenanceMetrics.sourceProvenanceCoverage===undefined?'미측정':provenanceMetrics.sourceProvenanceCoverage+'%')+' · 출처별 '+Object.entries(provenance).map(([source,n])=>source+' '+n+'건').join(' · ');panelBody.append(provenanceRow);
 const attempts=thumb.results||[];if(attempts.length){const detail=document.createElement('p');detail.className='photo-meta';detail.textContent='최근 보강 출처 결과: '+attempts.map(result=>{const candidate=result.candidate||result.candidates?.[0];let hostName='';try{hostName=candidate?.url?new URL(candidate.url).hostname:'';}catch{}return (result.status||'unknown')+(candidate?' · '+candidate.source+' ('+hostName+')':'');}).join(' / ');panelBody.append(detail);}
} const candidateCompare=metrics.thumbnailCandidateComparison;if(candidateCompare){const panel=document.createElement('section');panel.className='photo-policy';panel.setAttribute('aria-label','기사별 이미지 후보 비교');const title=document.createElement('strong');title.textContent='기사 단위 RSS / OG·Twitter 이미지 후보 비교';panel.append(title);const summary=document.createElement('p');summary.textContent='비교 기사 '+candidateCompare.articlesCompared+' · RSS만 '+candidateCompare.rssOnly+' · 메타만 '+candidateCompare.metaOnly+' · 양쪽 '+candidateCompare.bothSources+' · RSS/메타 동일 URL '+candidateCompare.articlesWithSharedUrl;panel.append(summary);const persisted=document.createElement('p');persisted.textContent='저장된 메타 후보 '+candidateCompare.persistedMetaCandidateRecords+'건 · 저장된 HTTPS 썸네일 '+candidateCompare.persistedThumbnailRecords+'건 · 메타 후보 URL 일치 '+candidateCompare.persistedThumbnailMatchesMetaCandidate+'건 · 불일치 '+candidateCompare.persistedThumbnailDoesNotMatchMetaCandidate+'건';panel.append(persisted);const latest=document.createElement('p');latest.textContent='최신 실행 메타 보강 · 시도 '+candidateCompare.latestRunAttempted+'건 · 후보 발견 '+candidateCompare.latestRunFound+'건 · 신규 배정 '+candidateCompare.latestRunAssigned+'건 · 발견 후 배정률 '+(candidateCompare.latestRunAssignmentRate===null?'미측정':candidateCompare.latestRunAssignmentRate+'%');panel.append(latest);for(const [source,n] of Object.entries(candidateCompare.sourceCounts||{})){const row=document.createElement('p');row.className='photo-meta';row.textContent='후보 출처 '+source+' · '+n+'건';panel.append(row);}for(const hostRow of (candidateCompare.hostCounts||[]).slice(0,5)){const row=document.createElement('p');row.className='photo-meta';row.textContent='후보 호스트 '+hostRow.host+' · '+hostRow.count+'건';panel.append(row);}panelBody.append(panel);}const review=metrics.thumbnailReview;if(review){const reviewRow=document.createElement('p');reviewRow.className='photo-meta';reviewRow.textContent='반복 썸네일 재검토 목록 '+review.groups.length+'개 그룹 · 자동 삭제/교체 없음';panelBody.append(reviewRow);for(const group of review.groups.slice(0,3)){const details=document.createElement('details');details.className='photo-policy';const summary=document.createElement('summary');summary.textContent='검토 필요 · '+group.count+'건 반복 URL · 기사 근거 '+group.records.length+'개';details.append(summary);const imageLink=document.createElement('a');imageLink.href=group.url;imageLink.target='_blank';imageLink.rel='noopener noreferrer';imageLink.textContent='현재 썸네일 URL 열기';details.append(imageLink);const list=document.createElement('ul');for(const record of group.records.slice(0,30)){const li=document.createElement('li');const link=document.createElement('a');link.href=record.articleUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent=record.title||record.id;li.append(link);const source=document.createElement('span');source.className='photo-meta';source.textContent=' · 썸네일 출처 '+(record.thumbnailSource||'unknown');li.append(source);list.append(li);}details.append(list);panelBody.append(details);}}
 const comparison=metrics.collection.deduplicationComparison; if(comparison){const row=document.createElement('p');row.textContent='중복 병합 전후: '+comparison.before+'개 → '+comparison.after+'개 · '+comparison.collapsed+'개 축약 (제목 정규화 우선)';panelBody.append(row);}
 const articleUrlMetrics=metrics.articleUrlProvenance;if(articleUrlMetrics){const direct=Number(articleUrlMetrics.itemsWithPublisherArticleUrl||0),total=Number(articleUrlMetrics.totalItems||0),row=document.createElement('p');row.className='photo-meta';row.textContent='원문 URL 검증: 공개 메타데이터에 명시된 HTTPS 기사 URL '+direct+'/'+total+'건 ('+(total?Math.round(direct/total*100):0)+'%) · 미확보 '+Math.max(0,total-direct)+'건 · 후보 출처 '+Object.entries(articleUrlMetrics.candidateSourceCounts||{}).map(([source,n])=>source+' '+n+'건').join(' · ')+' · 래퍼 전용 메타데이터 호스트 '+Object.entries(articleUrlMetrics.wrapperOnlyMetadataHosts||{}).map(([host,n])=>host+' '+n+'건').join(', ');panelBody.append(row);}
 for(const source of metrics.sources||[]){const row=document.createElement('p');row.className='photo-meta';row.textContent=source.source+' · '+source.items+'건 · 발견 링크 '+source.urlCoverage+'% · 원문 기사 URL '+(source.publisherArticleUrlCoverage??0)+'% · 썸네일 '+source.thumbnailCoverage+'% · 날짜 '+source.dateCoverage+'%';panelBody.append(row);}
 }catch{host.textContent='자료 품질 통계를 아직 사용할 수 없습니다.';}
}
renderQualitySummary();
