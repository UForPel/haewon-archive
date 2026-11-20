const VIDEO_HINTS = /(?:youtube|유튜브|직캠|fancam|fullcam|dance practice|performance video|shorts|뮤직비디오)/i;

export function classifyDiscoveryItem(item = {}) {
  const text = [item.title, item.description, item.url].map(value => String(value || '')).join(' ');
  return VIDEO_HINTS.test(text) ? 'video' : 'article';
}
