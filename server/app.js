import express from 'express';
import fs from 'node:fs';
import { profiles } from './profiles.js';

// Only these fields ever leave the server. `likedYou` is deliberately left out.
function publicProfile({ id, name, age, city, bio, interests, photo }) {
  return { id, name, age, city, bio, interests, photo };
}

// swipes look like { "3": "like", "7": "pass" }, keyed by profile id.
function loadSwipes(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isMatch(profile, swipes) {
  return swipes[profile.id] === 'like' && profile.likedYou;
}

export function createApp(dataFile) {
  const app = express();
  app.use(express.json());
  const swipes = loadSwipes(dataFile);

  app.get('/feed', (req, res) => {
    const unseen = profiles.filter((p) => !swipes[p.id]);
    res.json(unseen.map(publicProfile));
  });

  app.post('/swipe', (req, res) => {
    const { profileId, action } = req.body || {};
    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (action !== 'like' && action !== 'pass') {
      return res.status(400).json({ error: 'action must be "like" or "pass"' });
    }
    if (swipes[profileId]) return res.status(409).json({ error: 'Already swiped' });

    swipes[profileId] = action;
    fs.writeFileSync(dataFile, JSON.stringify(swipes, null, 2));

    res.json({ match: Boolean(isMatch(profile, swipes)) });
  });

  app.get('/matches', (req, res) => {
    res.json(profiles.filter((p) => isMatch(p, swipes)).map(publicProfile));
  });

  return app;
}
