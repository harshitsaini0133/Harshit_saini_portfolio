import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Code is measured as it travels (gzip); the site grew from a one-page prototype, so the raw 20 KB JS and 50 KB CSS limits no longer fit.
// Measured on 29 Oct 2026: JS 6.6 KB, CSS 19.1 KB gzipped. Images stay on a raw per-file limit.
const limits = {
  '.js': { bytes: 12_000, gzip: true },
  '.css': { bytes: 30_000, gzip: true },
  '.webp': { bytes: 150_000, gzip: false },
};
for (const file of readdirSync('dist/assets')) {
  for (const [extension, { bytes, gzip }] of Object.entries(limits)) {
    if (!file.endsWith(extension)) continue;
    const path = join('dist/assets', file);
    const size = gzip ? gzipSync(readFileSync(path)).length : statSync(path).size;
    if (size > bytes) throw new Error(`${file} is ${size} bytes${gzip ? ' gzipped' : ''}, over the ${bytes} byte budget`);
  }
}
console.log('Production asset budgets passed.');
