import { root, required } from '../shared/dom';
import { THEME_KEY, themePreference, resolvedTheme } from '../shared/preferences';
import { reducedMotion } from '../shared/motion';

export function initTheme() {
  const system = matchMedia('(prefers-color-scheme: dark)');
  const select = required<HTMLSelectElement>('#themeSelect');
  let preference = themePreference(root.dataset.pref);
  function render() {
    root.dataset.pref = preference;
    root.dataset.theme = resolvedTheme(preference, system.matches);
    select.value = preference;
  }
  /** The new theme spreads out from the toggle as a circle where the browser supports view transitions. */
  function reveal(update: () => void) {
    const start = (document as Document & { startViewTransition?: (callback: () => void) => { ready: Promise<void> } }).startViewTransition?.bind(document);
    if (!start || reducedMotion.matches) { update(); return; }
    const box = select.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    start(update).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => { /* A skipped transition still applies the theme. */ });
  }
  function choose(value: string | undefined) {
    preference = themePreference(value);
    try { localStorage.setItem(THEME_KEY, preference); } catch { /* Preference still applies this visit. */ }
    reveal(render);
  }
  select.addEventListener('change', () => choose(select.value));
  system.addEventListener('change', render);
  window.addEventListener('storage', event => {
    if (event.key === THEME_KEY || event.key === null) {
      preference = themePreference(event.newValue);
      render();
    }
  });
  render();
  root.classList.add('theme-ready');
}
