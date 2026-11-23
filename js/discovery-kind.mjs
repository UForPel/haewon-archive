const VIDEO_TITLE_HINTS = /(?:youtube|직캠|fancam|fullcam|dance practice|performance video|shorts|뮤직비디오)/i;
const VIDEO_HOSTS = /(?:youtube\.com|youtu\.be)/i;

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

export function classifyDiscoveryCategory(item = {}) {
  if (classifyDiscoveryItem(item) === 'video') return 'video';
  const title = String(item.title || '');
  const description = String(item.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&');
  // Titles are more reliable than RSS descriptions, which often repeat publisher boilerplate.
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(title)) return category;
  }
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(description)) return category;
  }
  return 'news';
}

const normalizeTitle = value => String(value || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/gi, '&')
  .normalize('NFKC')
  .toLocaleLowerCase()
  .replace(/\b(?:youtube|youtu\.be)\b/g, '')
  .replace(/[\p{P}\p{S}\s]+/gu, '')
  .trim();

export function groupDiscoveryDuplicates(items = []) {
  const groups = new Map();
  const shortItems = [];
  for (const item of items) {
    const key = normalizeTitle(item.title);
    if (key.length < 24) {
      shortItems.push({ ...item, duplicateCount: 1, sourceCount: 1, duplicateSources: [] });
      continue;
    }
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  const grouped = [...groups.values()].map(group => {
    const ranked = group.slice().sort((a, b) =>
      Number(b.relevanceScore || 0) - Number(a.relevanceScore || 0) ||
      String(b.publishedAt || b.discoveredAt || '').localeCompare(String(a.publishedAt || a.discoveredAt || ''))
    );
    const sources = [...new Set(group.map(item => String(item.sourceName || item.discoverySource || '출처 미상')))];
    return { ...ranked[0], duplicateCount: group.length, sourceCount: sources.length, duplicateSources: sources };
  });
  return [...shortItems, ...grouped].sort((a, b) =>
    Number(b.relevanceScore || 0) - Number(a.relevanceScore || 0) ||
    String(b.publishedAt || b.discoveredAt || '').localeCompare(String(a.publishedAt || a.discoveredAt || ''))
  );
}
