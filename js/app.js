const grid = document.querySelector('#video-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty');
const count = document.querySelector('#video-count');
const updated = document.querySelector('#updated-at');
const resultCount = document.querySelector('#result-count');
const dateFrom = document.querySelector('#date-from');
const dateTo = document.querySelector('#date-to');
let videos = [];
let filter = 'all';

function localDateValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('ko-KR');
  const from = localDateValue(dateFrom.value);
  const to = localDateValue(dateTo.value);
  if (to) to.setHours(23, 59, 59, 999);
  const recentCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const visible = videos.filter(video => {
    const published = Date.parse(video.publishedAt);
    const searchable = `${video.title} ${video.description ?? ''} ${video.channelName ?? ''}`
      .toLocaleLowerCase('ko-KR');
    const matchesQuery = searchable.includes(query);
    const matchesRelevance = filter !== 'haewon' || video.relevance === true;
    const matchesRecent = filter !== 'recent' || published >= recentCutoff;
    const matchesFrom = !from || published >= from.getTime();
    const matchesTo = !to || published <= to.getTime();
    return matchesQuery && matchesRelevance && matchesRecent && matchesFrom && matchesTo;
  }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

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
      tag.textContent = '해원 키워드 포함';
      info.append(tag);
    }
    link.append(img, info);
    return link;
  }));

  resultCount.textContent = `${visible.length.toLocaleString('ko-KR')}개 표시`;
  empty.hidden = visible.length > 0;
  if (visible.length === 0) {
    empty.textContent = videos.length
      ? '조건에 맞는 영상이 없어요. 검색어나 날짜 필터를 바꿔보세요.'
      : '아직 표시할 영상이 없어요. 첫 자동 수집이 끝나면 여기에 나타납니다.';
  }
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
      updated.textContent = status.lastSuccessAt
        ? `마지막 수집 ${new Date(status.lastSuccessAt).toLocaleString('ko-KR')}`
        : '첫 수집 대기 중';
    }
    render();
  } catch (error) {
    empty.hidden = false;
    empty.textContent = error.message;
    resultCount.textContent = '데이터를 불러오지 못했습니다';
  }
}

search.addEventListener('input', render);
dateFrom.addEventListener('change', render);
dateTo.addEventListener('change', render);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  render();
}));
start();
