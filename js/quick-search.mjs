export function buildSearchUrl(platform, query) {
  const q = encodeURIComponent(String(query || '').trim());
  if (!q) return '';
  const urls = {
        youtube: `https://www.youtube.com/results?search_query=${q}`,
        google: `https://www.google.com/search?q=${q}`,
        images: `https://www.google.com/search?tbm=isch&q=${q}`,
        tiktok: `https://www.tiktok.com/search?q=${q}`,
        x: `https://x.com/search?q=${q}`
  };
  return urls[platform] || urls.youtube;
}

const form = typeof document !== 'undefined' ? document.querySelector('#quick-search-form') : null;
const presetQueries=['오해원 직캠','해원 NMIXX 직캠','Haewon fancam','NMIXX Haewon focus cam','Haewon 4K','해원 무대','Haewon shorts','오해원 인터뷰','Haewon variety','NMIXX Haewon behind'];
if(form){
 const presets=document.createElement('div');presets.className='search-presets';
 const label=document.createElement('p');label.textContent='추천 검색 조합';presets.append(label);
 presetQueries.forEach(query=>{const button=document.createElement('button');button.type='button';button.textContent=query;button.addEventListener('click',()=>{const input=document.querySelector('#quick-search-input');const platform=document.querySelector('#quick-search-platform');if(input)input.value=query;if(platform)platform.value='youtube';const url=buildSearchUrl('youtube',query);if(url)window.open(url,'_blank','noopener,noreferrer');});presets.append(button);});
 form.after(presets);
}
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = document.querySelector('#quick-search-input')?.value || '';
    const platform = document.querySelector('#quick-search-platform')?.value || 'youtube';
    const url = buildSearchUrl(platform, query);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
}
