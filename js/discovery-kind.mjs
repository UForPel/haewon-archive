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
  // Avoid treating every NMIXX/JYP mention as official. Require explicit official/notice wording.
  ['official', /공식|official|jyp\s*(?:공식|official)|공지|notice|소식|update/i],
  ['interview', /인터뷰|interview|방송|예능|radio|라디오|출연/i],
  ['performance', /무대|stage|공연|concert|직캠|fancam|dance|춤/i]
];

export function classifyDiscoveryCategory(item = {}) {
  if (classifyDiscoveryItem(item) === 'video') return 'video';
  const text = String(item.title || '') + ' ' + String(item.description || '');
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(text)) return category;
  }
  return 'news';
}
