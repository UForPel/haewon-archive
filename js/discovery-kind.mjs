const VIDEO_TITLE_HINTS = /(?:직캠|fancam|fullcam|dance practice|performance video|shorts|뮤직비디오)/i;
const VIDEO_HOSTS = /(?:youtube\\.com|youtu\\.be)/i;

export function classifyDiscoveryItem(item = {}) {
  const title = String(item.title || '');
  const url = String(item.url || '');
  return VIDEO_TITLE_HINTS.test(title) || VIDEO_HOSTS.test(url) ? 'video' : 'article';
}
export function filterArticleCandidates(items = []) {
  return items.filter(item => classifyDiscoveryItem(item) === 'article');
}
