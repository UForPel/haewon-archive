import { normalizePhotoEntry, validatePhotoEntries, mergePhotoEntries } from './photo-links.mjs';
import { filterArchiveItems } from './archive-filters.mjs';

const grid = document.querySelector('#video-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty');
const count = document.querySelector('#video-count');
const updated = document.querySelector('#updated-at');
const resultCount = document.querySelector('#result-count');
const dateFrom = document.querySelector('#date-from');
const dateTo = document.querySelector('#date-to');
const typeFilter = document.querySelector('#type-filter');
const sourceFilter = document.querySelector('#source-filter');
const videoSection = document.querySelector('#video-section');
const photoSection = document.querySelector('.photo-section');
const photoList = document.querySelector('#photo-list');
const photoCount = document.querySelector('#photo-count');
const photoStatus = document.querySelector('#photo-status');
const photoForm = document.querySelector('#photo-form');
const PHOTO_STORAGE_KEY = 'haewon-archive-photo-drafts-v1';
let videos = [];
let filter = 'all';
let sources = [];
let publishedPhotos = [];
let localPhotos = [];
const VIDEO_PAGE_SIZE = 12;
let videoPage = 1;

function localDateValue(value) {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
}
function filters() {
  return {
    query: search.value.trim(), type: typeFilter.value, source: sourceFilter.value,
    from: localDateValue(dateFrom.value),
    to: dateTo.value ? new Date(dateTo.value + 'T23:59:59').getTime() : null,
    recentOnly: filter === 'recent', haewonOnly: filter === 'haewon'
  };
}
function sourceName(id) {
  return sources.find(source => source.id === id)?.name ?? id ?? '출처 미상';
}
function allPhotos() {
  return mergePhotoEntries(publishedPhotos, localPhotos);
}
function updateSourceOptions() {
  const current = sourceFilter.value || 'all';
  const options = sources.map(source => ({ value: source.id, label: source.name }));
  [...new Set(allPhotos().map(photo => photo.sourceName))].forEach(name => options.push({ value: 'photo:' + name, label: name }));
  sourceFilter.replaceChildren(new Option('모든 출처', 'all'));
  options.forEach(item => sourceFilter.add(new Option(item.label, item.value)));
  sourceFilter.value = options.some(item => item.value === current) ? current : 'all';
}
function filteredVideos() {
  const items = videos.map(video => ({ ...video, type: 'video', sourceKey: video.sourceId,
    searchText: [video.title, video.description, video.channelName, sourceName(video.sourceId)].join(' ') }));
  return filterArchiveItems(items, filters());
}
function filteredPhotos() {
  const items = allPhotos().map(photo => ({ ...photo, type: 'photo', sourceKey: 'photo:' + photo.sourceName,
    searchText: [photo.title, photo.notes, photo.sourceName].join(' ') }));
  return filterArchiveItems(items, filters());
}
function addDetails(card, description, metadata, linkUrl, linkLabel) {
  const details = document.createElement('details');
  details.className = 'item-details';
  const summary = document.createElement('summary');
  summary.textContent = '상세 정보';
  const body = document.createElement('div');
  body.className = 'item-details-body';
  const text = document.createElement('p');
  text.textContent = description || '추가 설명이 없습니다.';
  const meta = document.createElement('p');
  meta.textContent = metadata;
  body.append(text, meta);
  if (linkUrl) {
    const link = document.createElement('a');
    link.href = linkUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = linkLabel;
    body.append(link);
  }
  details.append(summary, body);
  card.append(details);
}
function renderVideos() {
  const allVisible = filteredVideos().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const pageCount = Math.max(1, Math.ceil(allVisible.length / VIDEO_PAGE_SIZE));
  videoPage = Math.min(videoPage, pageCount);
  const visible = allVisible.slice((videoPage - 1) * VIDEO_PAGE_SIZE, videoPage * VIDEO_PAGE_SIZE);

  grid.replaceChildren(...visible.map(video => {
    const card = document.createElement('article');
    card.className = 'video-card';

    const open = document.createElement('a');
    open.className = 'video-open';
    open.href = video.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';

    const thumbnail = /^https:\/\//i.test(String(video.thumbnailUrl || '')) ? video.thumbnailUrl : '';
    if (thumbnail) {
      const img = document.createElement('img');
      img.src = thumbnail;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => {
        const fallback = document.createElement('div');
        fallback.className = 'thumbnail-fallback';
        fallback.textContent = '썸네일을 불러올 수 없습니다';
        img.replaceWith(fallback);
      };
      open.append(img);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'thumbnail-fallback';
      fallback.textContent = '썸네일 없음';
      open.append(fallback);
    }

    const info = document.createElement('div');
    info.className = 'video-info';
    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = video.title;
    const meta = document.createElement('div');
    meta.className = 'video-meta';
    meta.textContent = (video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('ko-KR') : '날짜 미상') + ' · ' + sourceName(video.sourceId);
    info.append(title, meta);
    if (video.relevance) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = '해원 키워드 포함';
      info.append(tag);
    }
    open.append(info);
    card.append(open);
    addDetails(card, video.description, '수집 시각: ' + (video.collectedAt ? new Date(video.collectedAt).toLocaleString('ko-KR') : '기록 없음'), video.url, 'YouTube 원문 열기 ↗');
    return card;
  }));

  document.querySelector('#video-result-count').textContent = allVisible.length + '개 전체 · ' + videoPage + '/' + pageCount + '페이지';
  renderPagination(document.querySelector('#video-pagination'), videoPage, pageCount, page => { videoPage = page; renderVideos(); });
  empty.hidden = visible.length > 0;
  empty.textContent = videos.length ? '조건에 맞는 영상이 없어요. 검색어나 필터를 바꿔보세요.' : '아직 표시할 영상이 없습니다.';
  videoSection.hidden = typeFilter.value === 'photo';
}
function readLocalPhotos() {
  try { const raw = localStorage.getItem(PHOTO_STORAGE_KEY); return raw ? validatePhotoEntries(JSON.parse(raw)) : []; }
  catch { photoStatus.textContent = '브라우저 임시 저장소를 읽지 못했습니다.'; return []; }
}
function saveLocalPhotos() {
  try { localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(localPhotos, null, 2)); return true; }
  catch { photoStatus.textContent = '브라우저 저장에 실패했습니다. JSON 내보내기로 백업해 주세요.'; return false; }
}
function renderPhotos() {
  const visible = filteredPhotos().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  photoCount.textContent = visible.length + '개 표시';
  photoList.replaceChildren();
  if (!visible.length) {
    const note = document.createElement('p'); note.className = 'empty';
    note.textContent = allPhotos().length ? '조건에 맞는 사진 링크가 없습니다.' : '아직 등록된 사진 게시물 링크가 없습니다.';
    photoList.append(note);
  }
  visible.forEach(photo => {
    const card = document.createElement('article'); card.className = 'photo-card';
    const details = document.createElement('div'); details.className = 'photo-card-details';
    const title = document.createElement('h3'); title.textContent = photo.title;
    const meta = document.createElement('p'); meta.className = 'photo-meta'; meta.textContent = photo.sourceName + ' · ' + photo.publishedAt;
    details.append(title, meta);
    if (photo.notes) { const notes = document.createElement('p'); notes.className = 'photo-description'; notes.textContent = photo.notes; details.append(notes); }
    const actions = document.createElement('div'); actions.className = 'photo-card-actions';
    const open = document.createElement('a'); open.href = photo.url; open.target = '_blank'; open.rel = 'noopener noreferrer'; open.textContent = '원문 열기 ↗'; actions.append(open);
    const isLocal = localPhotos.some(item => item.url === photo.url);
    const marker = document.createElement('span'); marker.className = 'photo-origin'; marker.textContent = isLocal ? '이 브라우저 임시 저장' : '저장소 등록'; actions.append(marker);
    if (isLocal) {
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-photo'; remove.textContent = '임시 항목 삭제';
      remove.addEventListener('click', () => { localPhotos = localPhotos.filter(item => item.url !== photo.url); saveLocalPhotos(); updateSourceOptions(); renderAll(); setPhotoStatus('이 브라우저의 임시 항목을 삭제했습니다.'); });
      actions.append(remove);
    }
    card.append(details, actions);
    addDetails(card, photo.notes, '저장 위치: ' + (isLocal ? '현재 브라우저' : '공개 저장소'), photo.url, '원문 게시물 열기 ↗');
    photoList.append(card);
  });
  photoSection.hidden = typeFilter.value === 'video';
}
function renderAll() {
  videoPage = 1;
  renderVideos(); renderPhotos();
  const total = (typeFilter.value === 'photo' ? 0 : filteredVideos().length) + (typeFilter.value === 'video' ? 0 : filteredPhotos().length);
  resultCount.textContent = total.toLocaleString('ko-KR') + '개 표시';
}
function renderPagination(container, page, pageCount, onPage) {
  if (!container) return;
  container.replaceChildren();
  if (pageCount <= 1) { container.hidden = true; return; }
  container.hidden = false;
  const previous = document.createElement('button'); previous.type = 'button'; previous.textContent = '이전'; previous.disabled = page <= 1; previous.addEventListener('click', () => onPage(page - 1));
  const label = document.createElement('span'); label.textContent = `${page} / ${pageCount}`; label.setAttribute('aria-live', 'polite');
  const next = document.createElement('button'); next.type = 'button'; next.textContent = '다음'; next.disabled = page >= pageCount; next.addEventListener('click', () => onPage(page + 1));
  container.append(previous, label, next);
}
function setPhotoStatus(message, isError = false) {
  photoStatus.textContent = message; photoStatus.classList.toggle('error', isError);
}
photoForm.addEventListener('submit', event => {
  event.preventDefault();
  try {
    const entry = normalizePhotoEntry({
      id: globalThis.crypto?.randomUUID?.() ?? ('photo-' + Date.now()),
      title: document.querySelector('#photo-title').value,
      sourceName: document.querySelector('#photo-source').value,
      publishedAt: document.querySelector('#photo-date').value,
      url: document.querySelector('#photo-url').value,
      notes: document.querySelector('#photo-notes').value
    });
    if (allPhotos().some(item => item.url.toLowerCase() === entry.url.toLowerCase())) throw new Error('이미 등록된 원문 링크입니다.');
    localPhotos = validatePhotoEntries([...localPhotos, entry]); saveLocalPhotos(); photoForm.reset();
    updateSourceOptions(); renderAll();
    setPhotoStatus('임시 링크를 등록했습니다. 현재 브라우저에서만 보이며 전체 공개는 JSON 내보내기 후 GitHub 반영이 필요합니다.');
  } catch (error) { setPhotoStatus(error.message, true); }
});
document.querySelector('#export-photos').addEventListener('click', () => {
  try {
    const blob = new Blob([JSON.stringify(allPhotos(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'photos.json'; link.click(); URL.revokeObjectURL(url);
    setPhotoStatus('사진 링크 데이터를 JSON 파일로 내보냈습니다.');
  } catch (error) { setPhotoStatus(error.message, true); }
});
document.querySelector('#import-photos').addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    const imported = validatePhotoEntries(JSON.parse(await file.text()));
    const combined = mergePhotoEntries(allPhotos(), imported);
    const publishedUrls = new Set(publishedPhotos.map(item => item.url.toLowerCase()));
    localPhotos = combined.filter(item => !publishedUrls.has(item.url.toLowerCase()));
    saveLocalPhotos(); updateSourceOptions(); renderAll();
    setPhotoStatus(imported.length + '개 항목을 확인했습니다. 새 항목은 현재 브라우저의 임시 저장으로 추가했습니다.');
  } catch (error) { setPhotoStatus('가져오기 실패: ' + error.message, true); }
  finally { event.target.value = ''; }
});
async function start() {
  try {
    const responses = await Promise.all([
      fetch('./data/videos.json', { cache: 'no-store' }), fetch('./data/collection-status.json', { cache: 'no-store' }),
      fetch('./data/photos.json', { cache: 'no-store' }), fetch('./data/sources.json', { cache: 'no-store' })
    ]);
    if (!responses[0].ok) throw new Error('영상 데이터를 불러오지 못했습니다.');
    videos = await responses[0].json(); count.textContent = videos.length.toLocaleString('ko-KR');
    if (responses[1].ok) {
      const status = await responses[1].json();
      updated.textContent = status.lastSuccessAt ? '마지막 수집 ' + new Date(status.lastSuccessAt).toLocaleString('ko-KR') : '첫 수집 대기 중';
    }
    if (responses[2].ok) publishedPhotos = validatePhotoEntries(await responses[2].json());
    if (responses[3].ok) sources = await responses[3].json();
    localPhotos = readLocalPhotos().filter(local => !publishedPhotos.some(item => item.url.toLowerCase() === local.url.toLowerCase()));
    updateSourceOptions(); renderAll();
  } catch (error) {
    empty.hidden = false; empty.textContent = error.message; resultCount.textContent = '데이터를 불러오지 못했습니다'; renderPhotos();
  }
}
function applyFilters() { renderAll(); }
search.addEventListener('input', applyFilters);
[dateFrom, dateTo, typeFilter, sourceFilter].forEach(control => control.addEventListener('change', applyFilters));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
  });
  renderAll();
}));
start();
