import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderProcessCards, renderServiceCards } from '../src/components/render.js';

const source = new URL('../src/', import.meta.url);
const read = path => readFileSync(new URL(path, source), 'utf8');

/** Vite processes expanded HTML so images/fonts receive hashed, base-aware URLs. */
export function portfolioHtml() {
  return {
    name: 'portfolio-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const templates = new Map();
        for (const group of ['layout', 'sections']) {
          const folder = `components/${group}/`;
          for (const name of readdirSync(new URL(folder, source))) {
            if (name.endsWith('.html')) templates.set(name.slice(0, -5), read(folder + name));
          }
        }
        const expanded = html.replace(/<!-- component:([\w-]+) -->/g, (_, name) => {
          if (!templates.has(name)) throw new Error(`Missing portfolio component: ${name}`);
          return templates.get(name);
        }).replace('{{processCards}}', renderProcessCards(JSON.parse(read('data/process.json'))))
          .replace('{{serviceCards}}', renderServiceCards(JSON.parse(read('data/services.json'))));
        if (/<!-- component:|\{\{\w+\}\}/.test(expanded)) throw new Error('Unresolved portfolio template');
        return expanded;
      },
    },
    configureServer(server) {
      const folders = ['components', 'data'].map(folder => fileURLToPath(new URL(folder, source)));
      server.watcher.add(folders);
      server.watcher.on('change', path => {
        if (folders.some(folder => path.startsWith(folder))) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
