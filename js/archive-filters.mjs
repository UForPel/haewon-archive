export function filterArchiveItems(items, options = {}) {
  const { query = '', type = 'all', source = 'all', from = null, to = null, recentOnly = false, haewonOnly = false, now = Date.now() } = options;
  const normalizedQuery = String(query).trim().toLocaleLowerCase('ko-KR');
  const recentCutoff = now - 7 * 24 * 60 * 60 * 1000;
  return items.filter(item => {
    const published = Date.parse(item.publishedAt);
    const searchable = String(item.searchText ?? '').toLocaleLowerCase('ko-KR');
    return (type === 'all' || item.type === type) &&
      (source === 'all' || item.sourceKey === source) &&
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (from === null || published >= from) && (to === null || published <= to) &&
      (!recentOnly || published >= recentCutoff) &&
      (!haewonOnly || (item.type === 'video' && item.relevance === true));
  });
}
