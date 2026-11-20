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

const form = document.querySelector('#quick-search-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = document.querySelector('#quick-search-input')?.value || '';
    const platform = document.querySelector('#quick-search-platform')?.value || 'youtube';
    const url = buildSearchUrl(platform, query);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
}
