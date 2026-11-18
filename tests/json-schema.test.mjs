import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateAgainstSchema, assertMatchesSchema } from '../scripts/json-schema.mjs';

const schema = JSON.parse(await readFile(new URL('../schemas/archive-record.schema.json', import.meta.url), 'utf8'));
const video = {
  id: 'abc123',
  title: 'NMIXX HAEWON',
  url: 'https://www.youtube.com/watch?v=abc123',
  thumbnailUrl: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
  publishedAt: '2026-11-18T09:00:29.000Z',
  description: '',
  channelName: 'NMIXX',
  sourceId: 'nmixx-youtube',
  collectedAt: '2026-11-18T19:25:38.877Z',
  relevance: true
};
const photo = {
  id: 'photo-1',
  title: '공식 게시물',
  sourceName: 'NMIXX',
  url: 'https://nmixx.jype.com/Board/Detail?boardID=123',
  publishedAt: '2026-11-18',
  notes: ''
};

test('영상 레코드가 저장소 JSON Schema를 통과한다', () => {
  assert.deepEqual(validateAgainstSchema(video, schema), []);
  assert.doesNotThrow(() => assertMatchesSchema(video, schema));
});

test('사진 링크 레코드가 저장소 JSON Schema를 통과한다', () => {
  assert.deepEqual(validateAgainstSchema(photo, schema), []);
});

test('필수 필드 누락과 잘못된 타입을 거부한다', () => {
  const invalid = { ...video, id: 123, relevance: 'yes' };
  const errors = validateAgainstSchema(invalid, schema);
  assert.ok(errors.some(error => error.includes('$.id: expected string')));
  assert.ok(errors.some(error => error.includes('$.relevance: expected boolean')));
  assert.ok(errors.some(error => error.includes('$.description: required property is missing')) === false);
  assert.throws(() => assertMatchesSchema(invalid, schema), /JSON Schema validation failed/);
});

test('비 HTTPS 영상 URL, 잘못된 날짜, 허용되지 않은 필드를 거부한다', () => {
  assert.ok(validateAgainstSchema({ ...video, url: 'javascript:alert(1)' }, schema).length > 0);
  assert.ok(validateAgainstSchema({ ...video, publishedAt: '2026-02-31T00:00:00Z' }, schema).length > 0);
  assert.ok(validateAgainstSchema({ ...video, unexpected: true }, schema).some(error => error.includes('additional property')));
});

test('사진 링크의 잘못된 날짜와 HTTP URL을 거부한다', () => {
  assert.ok(validateAgainstSchema({ ...photo, publishedAt: '2026-02-31' }, schema).length > 0);
  assert.ok(validateAgainstSchema({ ...photo, url: 'http://example.com/post' }, schema).length > 0);
});

test('video/photo 어느 쪽에도 맞지 않는 객체는 oneOf에서 거부한다', () => {
  assert.ok(validateAgainstSchema({ id: 'incomplete' }, schema).some(error => error.includes('exactly one schema variant')));
});
