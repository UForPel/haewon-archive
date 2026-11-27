import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAtomFeed, mergeVideos } from '../scripts/collect-youtube.mjs';

const fixture = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
  <entry>
    <id>tag:youtube.com,2008:video:abc123</id>
    <yt:videoId>abc123</yt:videoId>
    <title>[NMIXX] 해원 HAEWON 영상 &amp; 이야기</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=abc123"/>
    <published>2026-11-17T09:00:00+00:00</published>
    <author><name>NMIXX</name></author>
    <media:group><media:description>오해원</media:description><media:thumbnail url="https://example.com/thumb.jpg"/></media:group>
  </entry>
</feed>`;

test('Atom 피드에서 영상 메타데이터와 해원 관련도를 추출한다', () => {
  const [video] = parseAtomFeed(fixture);
  assert.equal(video.id, 'abc123');
  assert.equal(video.title, '[NMIXX] 해원 HAEWON 영상 & 이야기');
  assert.equal(video.relevance, true);
  assert.equal(video.channelId, 'UCnUAyD4t2LkvW68YrDh7fDg');
  assert.equal(video.origin, 'artist-official');
  assert.equal(video.url, 'https://www.youtube.com/watch?v=abc123');
  assert.equal(video.thumbnailUrl, 'https://example.com/thumb.jpg');
});

test('중복 영상 ID는 하나로 합치고 최신순으로 정렬한다', () => {
  const old = { id: 'a', title: 'old', publishedAt: '2026-01-01T00:00:00.000Z', collectedAt: 'first' };
  const newer = { id: 'a', title: 'updated', publishedAt: '2026-01-01T00:00:00.000Z', collectedAt: 'second' };
  const other = { id: 'b', title: 'other', publishedAt: '2026-02-01T00:00:00.000Z' };
  const result = mergeVideos([old], [newer, other]);
  assert.equal(result.length, 2);
  assert.equal(result[1].title, 'updated');
  assert.equal(result[1].collectedAt, 'first');
  assert.equal(result[0].id, 'b');
});

test('잘못된 피드는 명확하게 거부한다', () => {
  assert.throws(() => parseAtomFeed('<html>not a feed</html>'), /Atom/);
});
