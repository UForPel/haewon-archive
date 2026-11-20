import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CHANNEL_ID = 'UCnUAyD4t2LkvW68YrDh7fDg';
export const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .trim();
}

function tagText(xml, localName) {
  const escaped = localName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(new RegExp(`<(?:[\\w.-]+:)?${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?${escaped}\\s*>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function attr(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`\\b${escaped}=["']([^"']*)["']`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

export function parseAtomFeed(xml) {
  if (typeof xml !== 'string' || !xml.includes('<feed')) {
    throw new Error('응답이 유효한 Atom 피드가 아닙니다.');
  }
  const entries = [...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi)].map(([, entry]) => {
    const videoId = tagText(entry, 'videoId');
    const title = tagText(entry, 'title');
    const publishedAt = tagText(entry, 'published');
    const author = tagText(entry, 'name');
    const linkTag = entry.match(/<(?:[\w.-]+:)?link\b[^>]*>/i)?.[0] ?? '';
    const thumbnailTag = entry.match(/<(?:[\w.-]+:)?thumbnail\b[^>]*>/i)?.[0] ?? '';
    const description = tagText(entry, 'description');
    if (!videoId || !title || !publishedAt) return null;
    const published = new Date(publishedAt);
    if (Number.isNaN(published.getTime())) return null;
    return {
      id: videoId,
      title,
      url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      thumbnailUrl: attr(thumbnailTag, 'url') || `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`,
      publishedAt: published.toISOString(),
      description,
      channelName: author || 'NMIXX',
      sourceId: 'nmixx-youtube',
      collectedAt: new Date().toISOString(),
      relevance: /해원|오해원|haewon/i.test(`${title} ${description}`)
    };
  }).filter(Boolean);
  return entries;
}

export function mergeVideos(existing, incoming) {
  const byId = new Map();
  for (const item of [...existing, ...incoming]) {
    if (item && typeof item.id === 'string' && item.id) {
      const prior = byId.get(item.id);
      byId.set(item.id, prior ? { ...prior, ...item, collectedAt: prior.collectedAt || item.collectedAt } : item);
    }
  }
  return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function main() {
  const statusPath = resolve(ROOT, 'data/collection-status.json');
  const videosPath = resolve(ROOT, 'data/videos.json');
  const attemptedAt = new Date().toISOString();
  try {
    const response = await fetch(FEED_URL, {
      headers: { 'user-agent': 'HaewonArchiveBot/0.1 (+https://github.com/UForPel/haewon-archive)' },
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw new Error(`YouTube 피드 HTTP ${response.status}`);
    const xml = await response.text();
    const incoming = parseAtomFeed(xml);
    if (incoming.length === 0) throw new Error('피드에서 유효한 영상 항목을 찾지 못했습니다.');
    const existing = JSON.parse(await readFile(videosPath, 'utf8'));
    const merged = mergeVideos(existing, incoming);
    const previousIds = new Set(existing.map(item => item.id));
    const added = merged.filter(item => !previousIds.has(item.id)).length;
    await writeFile(videosPath, JSON.stringify(merged, null, 2) + '\n');
    await writeFile(statusPath, JSON.stringify({
      status: 'success',
      source: 'nmixx-youtube',
      feedUrl: FEED_URL,
      lastAttemptAt: attemptedAt,
      lastSuccessAt: new Date().toISOString(),
      itemsFetched: incoming.length,
      itemsAdded: added,
      itemsDuplicate: incoming.length - added,
      totalItems: merged.length,
      message: '공개 YouTube 채널 피드 수집 완료'
    }, null, 2) + '\n');
    console.log(JSON.stringify({ status: 'success', fetched: incoming.length, added, total: merged.length }));
  } catch (error) {
    let previous = {};
    try { previous = JSON.parse(await readFile(statusPath, 'utf8')); } catch {}
    await mkdir(dirname(statusPath), { recursive: true });
    await writeFile(statusPath, JSON.stringify({
      ...previous,
      status: 'error',
      itemsFetched: 0,
      itemsAdded: 0,
      itemsDuplicate: 0,
      lastAttemptAt: attemptedAt,
      message: error.message
    }, null, 2) + '\n');
    console.error(error);
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
