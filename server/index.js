import express from 'express';
import fs from 'node:fs';
import { createApp } from './app.js';

fs.mkdirSync('data', { recursive: true });
const app = createApp('data/swipes.json');
app.use(express.static('dist')); // the built React app

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Coy Discover running on http://localhost:${port}`));
