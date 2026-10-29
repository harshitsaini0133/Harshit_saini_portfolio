import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { renderProcessCards, renderServiceCards } from '../src/components/render.js';

const html = readFileSync('dist/index.html', 'utf8');
const base = '/Harshit_saini_portfolio/';

test('production page contains composed content and unique required controls', () => {
  assert.doesNotMatch(html, /<!-- component:|\{\{(?:processCards|serviceCards)\}\}|\/src\/assets\//);
  for (const id of ['top', 'work', 'all-work', 'experience', 'about', 'how', 'services', 'contact', 'themeSelect', 'menuBtn', 'mnav', 'filters', 'count', 'mail', 'copy', 'copyLabel', 'live']) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1, id);
  }
  assert.match(html, /Flutter apps,/);
  assert.match(html, /Let’s talk\./);
});

test('every internal anchor resolves and IDs are unique', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate HTML IDs');
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});

test('all local production assets and CSS URLs exist under the Pages base', () => {
  let checked = 0;
  const verify = url => {
    assert.ok(url.startsWith(base), `unexpected base: ${url}`);
    assert.ok(existsSync(join('dist', decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]))), url);
    checked++;
  };
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) verify(match[1]);
  for (const match of html.matchAll(/href="([^" ]+\.css)"/g)) {
    const css = readFileSync(join('dist', match[1].slice(base.length)), 'utf8');
    for (const asset of css.matchAll(/url\(["']?(\/[^\s)"']+)["']?\)/g)) verify(asset[1]);
  }
  assert.ok(checked > 70);
  for (const file of ['robots.txt', 'sitemap.xml', 'assets/HarshitSaini.pdf', 'favicon.svg']) assert.ok(existsSync(join('dist', file)), file);
});

test('data-driven illustrations and identity images survive composition', () => {
  assert.equal([...html.matchAll(/class="process-art"/g)].length, 6);
  assert.equal([...html.matchAll(/class="service-art"/g)].length, 3);
  assert.equal([...html.matchAll(/class="brand-avatar"/g)].length, 1); // footer photo; the header uses the Peek mark
  assert.equal([...html.matchAll(/class="peek"/g)].length, 2); // header mark and the hero tile
  assert.match(html, /aria-controls="mnav"/);
  assert.match(html, /id="live" role="status" aria-live="polite"/);
});

test('card renderers escape content and attribute injection', () => {
  const item = { title: '<script>alert(1)</script>', description: 'A & B', image: '" onerror="alert(1)', number: '01' };
  for (const render of [renderProcessCards, renderServiceCards]) {
    const result = render([item]);
    assert.doesNotMatch(result, /<script>|src="" onerror=/);
    assert.match(result, /&lt;script&gt;/);
    assert.match(result, /A &amp; B/);
  }
});

test('theme and category normalization preserve preference behavior', async () => {
  const source = readFileSync('src/shared/preferences.ts', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { themePreference, resolvedTheme, filterCategory } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  assert.equal(themePreference('invalid'), 'system');
  assert.equal(themePreference(null), 'system');
  assert.equal(resolvedTheme('system', true), 'dark');
  assert.equal(resolvedTheme('light', true), 'light');
  assert.equal(resolvedTheme('dark', false), 'dark');
  assert.equal(filterCategory('Travel', ['All', 'Travel']), 'Travel');
  assert.equal(filterCategory('unknown', ['All', 'Travel']), 'All');
});

test('component CSS uses design tokens instead of raw colours, spacing, type sizes, z-index and motion values', () => {
  const files = ['src/styles/components.css', ...readdirSync('src/styles/sections').map(name => `src/styles/sections/${name}`)];
  const problems = [];
  for (const file of files) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const check = (label, pattern) => { for (const match of css.matchAll(pattern)) problems.push(`${file}: ${label}: ${match[0].slice(0, 60)}`); };
    check('hex colour', /(?<![\w&"'%-])#[0-9a-fA-F]{3,8}\b(?![^{]*\{)/g);
    check('rgb literal', /rgba?\(\s*\d/g);
    check('spacing in px', /(?<![\w-])(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?\s*:[^;{}]*?(?<![\w.#-])(?:[2-9]\d*|1\d+)px/g);
    check('font-size in px', /(?<![\w-])font-size\s*:\s*\d+px/g);
    check('numeric z-index', /(?<![\w-])z-index\s*:\s*-?\d/g);
    check('literal duration', /(?<![\w-])(?:transition|animation)\s*:[^;{}]*?(?<![\w.#-])\d*\.?\d+m?s\b(?![^()]*\))/g);
  }
  assert.deepEqual(problems, []);
});
