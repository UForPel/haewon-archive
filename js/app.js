import { normalizePhotoEntry, validatePhotoEntries, mergePhotoEntries } from './photo-links.mjs';

const grid = document.querySelector('#video-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty');
const count = document.querySelector('#video-count');
const updated = document.querySelector('#updated-at');
const resultCount = document.querySelector('#result-count');
const dateFrom = document.querySelector('#date-from');
const dateTo = document.querySelector('#date-to');
const photoList = document.querySelector('#photo-list');
const photoCount = document.querySelector('#photo-count');
const photoStatus = document.querySelector('#photo-status');
const photoForm = document.querySelector('#photo-form');
const PHOTO_STORAGE_KEY = 'haewon-archive-photo-drafts-v1';
let videos = [];
let filter = 'all';
let publishedPhotos = [];
let localPhotos = [];

function localDateValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function renderVideos() {
  const query = search.value.trim().toLocaleLowerCase('ko-KR');
  const from = localDateValue(dateFrom.value);
  const to = localDateValue(dateTo.value);
  if (to) to.setHours(23, 59, 59, 999);
  const recentCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const visible = videos.filter(video => {
    const published = Date.parse(video.publishedAt);
    const searchable = `${video.title} ${video.description ?? ''} ${video.channelName ?? ''}`
      .toLocaleLowerCase('ko-KR');
    return searchable.includes(query) &&
      (filter !== 'haewon' || video.relevance === true) &&
      (filter !== 'recent' || published >= recentCutoff) &&
      (!from || published >= from.getTime()) &&
      (!to || published <= to.getTime());
  }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  grid.replaceChildren(...visible.map(video => {
    const link = document.createElement('a');
    link.className = 'video-card';
    link.href = video.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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

function readLocalPhotos() {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    return raw ? validatePhotoEntries(JSON.parse(raw)) : [];
  } catch {
    photoStatus.textContent = '브라우저 임시 저장소를 읽지 못했습니다. JSON 내보내기를 사용하기 전에 저장 공간 설정을 확인해 주세요.';
    return [];
  }
}

function saveLocalPhotos() {
  try {
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(localPhotos, null, 2));
    return true;
  } catch {
    photoStatus.textContent = '브라우저 저장에 실패했습니다. JSON 내보내기로 백업해 주세요.';
    return false;
  }
}

function allPhotos() {
  return mergePhotoEntries(publishedPhotos, localPhotos);
}

function renderPhotos() {
  const entries = allPhotos();
  photoCount.textContent = `${entries.length}개`;
  photoList.replaceChildren();

  if (!entries.length) {
    const note = document.createElement('p');
    note.className = 'empty';
    note.textContent = '아직 등록된 사진 게시물 링크가 없습니다. 공개된 원문 링크를 추가해 보세요.';
    photoList.append(note);
    return;
  }

  for (const photo of entries) {
    const card = document.createElement('article');
    card.className = 'photo-card';
    const details = document.createElement('div');
    details.className = 'photo-card-details';
    const title = document.createElement('h3');
    title.textContent = photo.title;
    const meta = document.createElement('p');
    meta.className = 'photo-meta';
    meta.textContent = `${photo.sourceName} · ${photo.publishedAt}`;
    details.append(title, meta);
    if (photo.notes) {
      const notes = document.createElement('p');
      notes.className = 'photo-description';
      notes.textContent = photo.notes;
      details.append(notes);
    }
    const actions = document.createElement('div');
    actions.className = 'photo-card-actions';
    const open = document.createElement('a');
    open.href = photo.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = '원문 열기 ↗';
    actions.append(open);

    const isLocal = localPhotos.some(item => item.url === photo.url);
    const marker = document.createElement('span');
    marker.className = 'photo-origin';
    marker.textContent = isLocal ? '이 브라우저 임시 저장' : '저장소 등록';
    actions.append(marker);

    if (isLocal) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-photo';
      remove.textContent = '임시 항목 삭제';
      remove.addEventListener('click', () => {
        localPhotos = localPhotos.filter(item => item.url !== photo.url);
        saveLocalPhotos();
        renderPhotos();
        photoStatus.textContent = '이 브라우저의 임시 항목을 삭제했습니다. 저장소에 등록된 항목은 변경되지 않습니다.';
      });
      actions.append(remove);
    }
    card.append(details, actions);
    photoList.append(card);
  }
}

function setPhotoStatus(message, isError = false) {
  photoStatus.textContent = message;
  photoStatus.classList.toggle('error', isError);
}

photoForm.addEventListener('submit', event => {
  event.preventDefault();
  try {
    const entry = normalizePhotoEntry({
      id: globalThis.crypto?.randomUUID?.() ?? `photo-${Date.now()}`,
      title: document.querySelector('#photo-title').value,
      sourceName: document.querySelector('#photo-source').value,
      publishedAt: document.querySelector('#photo-date').value,
      url: document.querySelector('#photo-url').value,
      notes: document.querySelector('#photo-notes').value
    });
    if (allPhotos().some(item => item.url.toLowerCase() === entry.url.toLowerCase())) {
      throw new Error('이미 등록된 원문 링크입니다.');
    }
    localPhotos = validatePhotoEntries([...localPhotos, entry]);
    saveLocalPhotos();
    photoForm.reset();
    renderPhotos();
    setPhotoStatus('임시 링크를 등록했습니다. 현재 브라우저에서만 보이며, 전체 공개를 위해서는 JSON 내보내기 후 GitHub에 반영해야 합니다.');
  } catch (error) {
    setPhotoStatus(error.message, true);
  }
});

document.querySelector('#export-photos').addEventListener('click', () => {
  try {
    const json = JSON.stringify(allPhotos(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'photos.json';
    link.click();
    URL.revokeObjectURL(url);
    setPhotoStatus('사진 링크 데이터를 JSON 파일로 내보냈습니다. GitHub의 data/photos.json에 반영하면 모든 방문자에게 공개됩니다.');
  } catch (error) {
    setPhotoStatus(error.message, true);
  }
});

document.querySelector('#import-photos').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = validatePhotoEntries(JSON.parse(await file.text()));
    const combined = mergePhotoEntries(allPhotos(), imported);
    const publishedUrls = new Set(publishedPhotos.map(item => item.url.toLowerCase()));
    localPhotos = combined.filter(item => !publishedUrls.has(item.url.toLowerCase()));
    saveLocalPhotos();
    renderPhotos();
    setPhotoStatus(`${imported.length}개 항목을 확인했습니다. 새 항목은 이 브라우저의 임시 저장으로 추가했습니다.`);
  } catch (error) {
    setPhotoStatus(`가져오기 실패: ${error.message}`, true);
  } finally {
    event.target.value = '';
  }
});

async function start() {
  try {
    const [videoResponse, statusResponse, photoResponse] = await Promise.all([
      fetch('./data/videos.json', { cache: 'no-store' }),
      fetch('./data/collection-status.json', { cache: 'no-store' }),
      fetch('./data/photos.json', { cache: 'no-store' })
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
    if (photoResponse.ok) {
      const data = await photoResponse.json();
      publishedPhotos = validatePhotoEntries(data);
    }
    localPhotos = readLocalPhotos().filter(local =>
      !publishedPhotos.some(item => item.url.toLowerCase() === local.url.toLowerCase())
    );
    renderVideos();
    renderPhotos();
  } catch (error) {
    empty.hidden = false;
    empty.textContent = error.message;
    resultCount.textContent = '데이터를 불러오지 못했습니다';
    renderPhotos();
  }
}

search.addEventListener('input', renderVideos);
dateFrom.addEventListener('change', renderVideos);
dateTo.addEventListener('change', renderVideos);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderVideos();
}));
start();
