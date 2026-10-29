import { root } from '../shared/dom';
import { reducedMotion } from '../shared/motion';

export function initGalleries() {
  document.querySelectorAll<HTMLElement>('.shots-wrap').forEach(wrap => {
    const strip = wrap.querySelector<HTMLElement>('.shots');
    if (!strip) return;
    const app = (strip.getAttribute('aria-label') ?? '').split(' screenshots')[0] || 'app';
    const nav = document.createElement('div');
    nav.className = 'shots-nav';
    const make = (label: string, path: string, direction: number) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.tabIndex = -1; // The strip itself is focusable and scrolls with arrow keys.
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
      button.addEventListener('click', () => strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
      return button;
    };
    const previous = make(`Previous ${app} screenshots`, 'M15 5l-7 7 7 7', -1);
    const next = make(`Next ${app} screenshots`, 'M9 5l7 7-7 7', 1);
    const update = () => {
      previous.disabled = strip.scrollLeft <= 1;
      next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
      nav.hidden = strip.scrollWidth <= strip.clientWidth + 1;
    };
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    nav.append(previous, next);
    wrap.append(nav);
    update();
  });
  root.classList.add('gallery-ready');
}
