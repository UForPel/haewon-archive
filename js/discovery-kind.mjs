const VIDEO_TITLE_HINTS = /(?:youtube|직캠|fancam|fullcam|dance practice|performance video|shorts|뮤직비디오)/i;
const VIDEO_HOSTS = /(?:youtube\.com|youtu\.be)/i;
export function isExplicitYoutubeVideoUrl(value='') {
  try {
    const url = new URL(String(value || ''));
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    const id = '[A-Za-z0-9_-]{11}';
    if (host === 'youtu.be') return new RegExp('^/' + id + '/?$').test(url.pathname);
    if (!['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)) return false;
    return (url.pathname === '/watch' && new RegExp('^' + id + '$').test(url.searchParams.get('v') || '')) ||
      new RegExp('^/(?:shorts|embed)/' + id + '/?$').test(url.pathname);
  } catch { return false; }
}
export function filterUnresolvedVideoCandidates(items=[]) {
  return items.filter(item =>
    (VIDEO_TITLE_HINTS.test(String(item.title || '')) || VIDEO_HOSTS.test(String(item.url || ''))) &&
    !isExplicitYoutubeVideoUrl(item.url) && !isExplicitYoutubeVideoUrl(item.publisherArticleUrl)
  );
}
export function classifyDiscoveryItem(item = {}) {
  const title = String(item.title || '');
  const url = String(item.url || '');
  return VIDEO_TITLE_HINTS.test(title) || VIDEO_HOSTS.test(url) ? 'video' : 'article';
}
export function filterArticleCandidates(items = []) {
  return items.filter(item => classifyDiscoveryItem(item) === 'article');
}
const CATEGORY_RULES = [
  ['event', /행사|event|팬미팅|fan meeting|시상식|award|페스티벌|festival/i],
  ['brand', /광고|브랜드|brand|화보|pictorial|campaign|모델/i],
  ['official', /공식|official|공지|notice|소식/i],
  ['interview', /인터뷰|interview|방송|예능|radio|라디오|출연/i],
  ['performance', /무대|stage|공연|concert|직캠|fancam|dance|춤/i]
];
export function cleanDiscoveryText(value = '') {
  return String(value || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => { const n = Number(code); return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' '; })
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => { const n = Number.parseInt(code, 16); return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' '; })
    .replace(/https?:\/\/[^\s<>"']+/gi, ' ')
    .replace(/[ \t\r\n]+/g, ' ')
    .trim();
}
const cleanDescription = cleanDiscoveryText;
const HAEWON_TITLE = /오해원|해원|haewon/i;
const NMIXX_TITLE = /nmixx|엔믹스/i;
export function classifyDiscoveryRelevance(item = {}) {
  const title = cleanDiscoveryText(item.title);
  if (HAEWON_TITLE.test(title)) return 'haewon';
  if (NMIXX_TITLE.test(title)) return 'nmixx';
  return 'other';
}
export function hasExplicitPublisherArticleUrl(item = {}) {
  try {
    const url = new URL(String(item.publisherArticleUrl || ''));
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password && url.pathname !== '/' &&
      host !== 'news.google.com' && !host.endsWith('.news.google.com') &&
      host !== 'google.com' && !host.endsWith('.google.com') &&
      !host.endsWith('.googleusercontent.com') && !host.endsWith('.gstatic.com');
  } catch { return false; }
}
export function filterDiscoveryRelevance(items = [], scope = 'verified-haewon') {
  if (scope === 'all') return items;
  if (scope === 'verified-haewon') return items.filter(item => HAEWON_TITLE.test(cleanDiscoveryText(item.title)) && hasExplicitPublisherArticleUrl(item));
  const pattern = scope === 'nmixx' ? NMIXX_TITLE : HAEWON_TITLE;
  return items.filter(item => pattern.test(cleanDiscoveryText(item.title)));
}

export function classifyDiscoveryCategories(item = {}) {
  if (classifyDiscoveryItem(item) === 'video') return ['video'];
  const title = String(item.title || '');
  const description = cleanDescription(item.description);
  const titleMatches = CATEGORY_RULES.filter(([, pattern]) => pattern.test(title)).map(([category]) => category);
  if (titleMatches.length) return titleMatches;
  const descriptionMatches = CATEGORY_RULES.filter(([, pattern]) => pattern.test(description)).map(([category]) => category);
  return descriptionMatches.length ? descriptionMatches : ['news'];
}
export function classifyDiscoveryCategory(item = {}) {
  return classifyDiscoveryCategories(item)[0] || 'news';
}
const normalizeTitle = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/gi, '&').normalize('NFKC').toLocaleLowerCase().replace(/\b(?:youtube|youtu\.be)\b/g, '').replace(/[\p{P}\p{S}\s]+/gu, '').trim();
function canonicalUrl(value) {
  try {
    const url = new URL(String(value || ''));
    if (!/^https?:$/.test(url.protocol)) return '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid|ref|source)/i.test(key)) url.searchParams.delete(key);
    url.searchParams.sort();
    return url.toString().replace(/\/$/, '');
  } catch { return ''; }
}
export function assessDiscoveryQuality(item = {}) {
  const signals = [];
  const warnings = [];
  let score = 0;
  if (String(item.title || '').trim().length >= 12) { score += 20; signals.push('title'); }
  else warnings.push('title_missing_or_short');
  if (String(item.sourceName || item.discoverySource || '').trim()) { score += 20; signals.push('source'); }
  else warnings.push('source_missing');
  if (canonicalUrl(item.url)) { score += 20; signals.push('url'); }
  else warnings.push('url_missing_or_invalid');
  const date = Date.parse(item.publishedAt || item.discoveredAt || '');
  if (Number.isFinite(date)) { score += 20; signals.push('date'); }
  else warnings.push('date_missing_or_invalid');
  if (/^https?:\/\//i.test(String(item.thumbnailUrl || ''))) { score += 20; signals.push('thumbnail'); }
  else warnings.push('thumbnail_missing');
  return { score, tier: score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low', signals, warnings };
}

export function groupDiscoveryDuplicates(items = []) {
  const groups = new Map();
  const unique = [];
  for (const item of items) {
    const titleKey = normalizeTitle(item.title);
    const urlKey = canonicalUrl(item.url);
    const key = titleKey.length >= 32 ? 'title:' + titleKey : (urlKey ? 'url:' + urlKey : '');
    if (!key) { unique.push({ ...item, duplicateCount: 1, sourceCount: 1, duplicateSources: [] }); continue; }
    const group = groups.get(key);
    if (group) group.push(item); else groups.set(key, [item]);
  }
  const grouped = [...groups.values()].map(group => {
    const ranked = group.slice().sort((a,b) => Number(b.relevanceScore || 0) - Number(a.relevanceScore || 0) || String(b.publishedAt || b.discoveredAt || '').localeCompare(String(a.publishedAt || a.discoveredAt || '')));
    const sources = [...new Set(group.map(item => String(item.sourceName || item.discoverySource || '출처 미상')))];
    return { ...ranked[0], duplicateCount: group.length, sourceCount: sources.length, duplicateSources: sources };
  });
  return [...unique, ...grouped].sort((a,b) => Number(b.relevanceScore || 0) - Number(a.relevanceScore || 0) || String(b.publishedAt || b.discoveredAt || '').localeCompare(String(a.publishedAt || a.discoveredAt || '')));
}
