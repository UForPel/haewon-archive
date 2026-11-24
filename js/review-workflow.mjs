const LABELS=['relevant','unrelated','generic','broken','rights-unclear','uncertain'];
let installed=false;
function updateProgress(root){
 const selects=[...document.querySelectorAll('.thumbnail-review-info select')];
 const reviewed=selects.filter(select=>LABELS.includes(select.value)).length;
 const status=root.querySelector('[data-review-queue-status]');
 if(status)status.textContent='현재 페이지 검수 '+reviewed+'/'+selects.length+'개 · 라벨을 선택하면 자동 저장됩니다.';
}
function install(){
 const tools=document.querySelector('.thumbnail-review-tools');
 if(!tools||installed)return;
 installed=true;
 const next=document.createElement('button');
 next.type='button';next.textContent='다음 미검수 후보';next.className='review-next-button';
 next.addEventListener('click',()=>{
  const rows=[...document.querySelectorAll('.thumbnail-review-info select')];
  const target=rows.find(select=>!LABELS.includes(select.value));
  if(!target){
   const status=tools.querySelector('[data-review-queue-status]');
   if(status)status.textContent=rows.length?'현재 페이지는 모두 검수했습니다. 다음 페이지로 이동해 주세요.':'현재 페이지에 검수할 이미지 후보가 없습니다.';
   return;
  }
  target.closest('.thumbnail-review-row')?.scrollIntoView({behavior:'smooth',block:'center'});
  target.focus({preventScroll:true});
  const status=tools.querySelector('[data-review-queue-status]');
  if(status)status.textContent='미검수 후보로 이동했습니다. 라벨을 선택하면 자동 저장됩니다.';
 });
 const status=document.createElement('p');status.className='photo-meta';status.dataset.reviewQueueStatus='true';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 tools.append(next,status);
 document.addEventListener('change',event=>{
  const select=event.target;
  if(!(select instanceof HTMLSelectElement)||!select.matches('.thumbnail-review-info select')||!LABELS.includes(select.value))return;
  const save=select.parentElement?.querySelector('button');
  if(save)save.click();
  updateProgress(tools);
 },true);
 const observer=new MutationObserver(()=>updateProgress(tools));
 const list=document.querySelector('#discovery-list');
 if(list)observer.observe(list,{childList:true,subtree:true});
 updateProgress(tools);
}
const observer=new MutationObserver(install);
observer.observe(document.documentElement,{childList:true,subtree:true});
install();
