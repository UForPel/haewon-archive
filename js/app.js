const grid = document.querySelector('#video-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty');
const count = document.querySelector('#video-count');
const updated = document.querySelector('#updated-at');
let videos = [];
let filter = 'all';

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const visible = videos.filter(video => {
    const matchesQuery = `${video.title} ${video.description ?? ''}`.toLocaleLowerCase().includes(query);
    return matchesQuery && (filter !== 'haewon' || video.relevance === true);
  }).sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  grid.replaceChildren(...visible.map(video => {
    const link = document.createElement('a');
    link.className = 'video-card';
    link.href = video.url;
    link.target = '_blank';
    link.rel = 'noopener';
    const img = document.createElement('img');
    img.src = video.thumbnailUrl;
    img.alt = '';
    img.loading = 'lazy';
    const info = document.createElement('div');
    info.className = 'video-info';
    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = video.title;
    const meta = document.createElement('div');
    meta.className = 'video-meta';
    meta.textContent = new Date(video.publishedAt).toLocaleDateString('ko-KR');
    info.append(title, meta);
    if (video.relevance) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = '해원 관련 키워드';
      info.append(tag);
    }
    link.append(img, info);
    return link;
  }));
  empty.hidden = visible.length > 0;
}
async function start() {
  try {
    const [videoResponse, statusResponse] = await Promise.all([
      fetch('./data/videos.json', { cache: 'no-store' }),
      fetch('./data/collection-status.json', { cache: 'no-store' })
    ]);
    if (!videoResponse.ok) throw new Error('영상 데이터를 불러오지 못했습니다.');
    videos = await videoResponse.json();
    count.textContent = videos.length.toLocaleString('ko-KR');
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      updated.textContent = status.lastSuccessAt ? `마지막 수집 ${new Date(status.lastSuccessAt).toLocaleString('ko-KR')}` : '첫 수집 대기 중';
    }
    render();
  } catch (error) {
    empty.hidden = false;
    empty.textContent = error.message;
  }
}
search.addEventListener('input', render);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter === 'recent' ? 'all' : button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
  render();
}));
start();
