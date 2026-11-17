import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app.js';

// Profile "2" (Diya) has liked the user; profile "1" (Aarav) has not.
const LIKER = '2';
const NON_LIKER = '1';

let server, base, file;

async function start() {
  server = createApp(file).listen(0);
  await once(server, 'listening');
  base = `http://localhost:${server.address().port}`;
}

beforeEach(() => {
  file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'coy-')), 'swipes.json');
  return start();
});

afterEach(() => server.close());

const get = (url) => fetch(base + url).then((r) => r.json());
const swipe = (profileId, action) =>
  fetch(base + '/swipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId, action }),
  });

test('liking someone who liked you is a match', async () => {
  const body = await (await swipe(LIKER, 'like')).json();
  assert.equal(body.match, true);
  assert.deepEqual((await get('/matches')).map((p) => p.id), [LIKER]);
});

test('liking someone who has not liked you is not a match', async () => {
  const body = await (await swipe(NON_LIKER, 'like')).json();
  assert.equal(body.match, false);
  assert.deepEqual(await get('/matches'), []);
});

test('passing on someone who liked you is not a match and reveals nothing', async () => {
  const body = await (await swipe(LIKER, 'pass')).json();
  assert.deepEqual(body, { match: false });
  assert.deepEqual(await get('/matches'), []);
});

test('feed never says who liked the user', async () => {
  const feed = await get('/feed');
  assert.equal(feed.length, 30);
  for (const p of feed) assert.equal('likedYou' in p, false);
});

test('a swiped profile leaves the feed and cannot be swiped again', async () => {
  await swipe(NON_LIKER, 'pass');
  const feed = await get('/feed');
  assert.equal(feed.some((p) => p.id === NON_LIKER), false);
  assert.equal((await swipe(NON_LIKER, 'like')).status, 409);
});

test('bad input is rejected', async () => {
  assert.equal((await swipe('999', 'like')).status, 404);
  assert.equal((await swipe(LIKER, 'superlike')).status, 400);
});

test('swipes and matches survive a restart', async () => {
  await swipe(LIKER, 'like');
  server.close();
  await start();
  assert.deepEqual((await get('/matches')).map((p) => p.id), [LIKER]);
  assert.equal((await get('/feed')).length, 29);
});
