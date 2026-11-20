const form=document.querySelector('#quick-search-form');
if(form){form.addEventListener('submit',event=>{event.preventDefault();const query=document.querySelector('#quick-search-input').value.trim();if(!query)return;window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(query),'_blank','noopener');});}
