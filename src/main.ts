import { initTheme } from './features/theme';
import { initNavigation } from './features/navigation';
import { initFilters } from './features/project-filters';
import { initGalleries } from './features/screenshot-gallery';
import { initCopy } from './features/copy-email';
import { initPolish } from './features/polish';
import { initHeader } from './features/header';
import { initHero } from './features/hero';
import { initWork } from './features/work';
import { initAllWork } from './features/all-work';
import { initCredentials } from './features/credentials';

/** Run one enhancement; a failure in an optional feature must not disable the readable page or other controls. */
function run(enhance: () => void) {
  performance.mark(`init:${enhance.name}:start`);
  try { enhance(); } catch (error) { console.error(`Portfolio enhancement failed: ${enhance.name}`, error); }
  performance.measure(`init:${enhance.name}`, `init:${enhance.name}:start`);
}

// Controls and everything that changes first-screen layout start immediately, so nothing shifts after paint.
[initTheme, initNavigation, initFilters, initCopy, initPolish, initHeader, initHero].forEach(run);

// Below-the-fold enhancements wait for an idle moment and never delay first paint or input.
const idle: (callback: () => void) => void = 'requestIdleCallback' in window
  ? callback => window.requestIdleCallback(callback, { timeout: 600 })
  : callback => window.setTimeout(callback, 80);
[initGalleries, initWork, initAllWork, initCredentials].forEach(enhance => idle(() => run(enhance)));
