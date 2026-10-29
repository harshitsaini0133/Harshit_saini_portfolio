import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const url = 'http://127.0.0.1:4180/Harshit_saini_portfolio/';
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4180', '--strictPort'], { stdio: 'ignore', detached: true });
let chrome;
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { ready = (await fetch(url)).ok; } catch { /* Wait for preview. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Preview did not start');
  chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox'] });
  const result = await lighthouse(url, { port: chrome.port, output: 'html', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  await mkdir('.lighthouseci', { recursive: true });
  await writeFile('.lighthouseci/report.html', result.report);
  await writeFile('.lighthouseci/result.json', JSON.stringify(result.lhr, null, 2));
  for (const [name, category] of Object.entries(result.lhr.categories)) console.log(`${name}: ${Math.round(category.score * 100)}`);
  if (result.lhr.categories.accessibility.score < 0.95) throw new Error('Accessibility score below 95');
  if (result.lhr.audits['cumulative-layout-shift'].numericValue > 0.1) throw new Error('CLS exceeds 0.1');
  if (result.lhr.categories.performance.score < 0.9) console.warn('Performance below target 90; inspect saved report');
} finally {
  await chrome?.kill();
  try { process.kill(-server.pid, 'SIGTERM'); } catch { /* Server already exited. */ }
}
