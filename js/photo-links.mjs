export function normalizePhotoEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error('사진 항목은 객체여야 합니다.');
  }
  const title = String(entry.title ?? '').trim();
  const sourceName = String(entry.sourceName ?? '').trim();
  const rawUrl = String(entry.url ?? '').trim();
  const publishedAt = String(entry.publishedAt ?? '').trim();
  const notes = String(entry.notes ?? '').trim();

  if (!title || title.length > 120) throw new Error('제목은 1~120자로 입력해 주세요.');
  if (!sourceName || sourceName.length > 80) throw new Error('출처 이름은 1~80자로 입력해 주세요.');
  if (notes.length > 300) throw new Error('메모는 300자 이내로 입력해 주세요.');

  let parsedUrl;
  try { parsedUrl = new URL(rawUrl); } catch { throw new Error('올바른 원문 링크를 입력해 주세요.'); }
  if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
    throw new Error('보안을 위해 https 원문 링크만 등록할 수 있습니다.');
  }

  const parsedDate = new Date(publishedAt + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ||
      Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== publishedAt) {
    throw new Error('게시 날짜를 확인해 주세요.');
  }

  return {
    id: String(entry.id ?? '').trim(),
    title,
    sourceName,
    url: parsedUrl.href,
    publishedAt,
    notes
  };
}

export function validatePhotoEntries(entries) {
  if (!Array.isArray(entries)) throw new Error('사진 데이터는 배열이어야 합니다.');
  const seen = new Set();
  return entries.map((entry, index) => {
    let normalized;
    try { normalized = normalizePhotoEntry(entry); }
    catch (error) { throw new Error(`사진 데이터 ${index + 1}번: ${error.message}`); }
    const key = normalized.url.toLowerCase();
    if (seen.has(key)) throw new Error(`중복된 원문 링크가 있습니다: ${normalized.url}`);
    seen.add(key);
    return normalized;
  });
}

export function mergePhotoEntries(base, additions) {
  const merged = new Map();
  for (const entry of [...validatePhotoEntries(base), ...validatePhotoEntries(additions)]) {
    const key = entry.url.toLowerCase();
    const previous = merged.get(key);
    merged.set(key, previous ? { ...previous, ...entry, id: previous.id || entry.id } : entry);
  }
  return [...merged.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
