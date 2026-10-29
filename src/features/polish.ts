import { root } from '../shared/dom';
import { reducedMotion } from '../shared/motion';

/** Reading progress, exposed as --p (0 to 1) on the root for the header ring. */
function initProgress() {
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/** The hero device fan leans toward the pointer; fine pointers only. */
function initHeroTilt() {
  const tile = document.getElementById('heroTile');
  if (!tile || !matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) return;
  let frame = 0;
  tile.addEventListener('pointermove', event => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const box = tile.getBoundingClientRect();
      tile.style.setProperty('--px', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      tile.style.setProperty('--py', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
    });
  });
  tile.addEventListener('pointerleave', () => {
    tile.style.removeProperty('--px');
    tile.style.removeProperty('--py');
  });
}

/** Fade content in once as it enters the viewport. Without JS or with reduced motion everything stays visible. */
function initReveal() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll<HTMLElement>('.head, .gantt, .how-card, .how-cta, .cards3 > *, .exp, .skill, .xp > li, .row.app, .os-stats > li, .edu, .awards, .cert-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  items.forEach(item => { item.classList.add('reveal'); observer.observe(item); });
  root.classList.add('reveal-ready');
  // Safety net: nothing may stay hidden if the observer never fires (print, find-in-page, anchors).
  window.addEventListener('beforeprint', () => items.forEach(item => item.classList.add('is-in')));
  // Jumping to an anchor shows the target at once. A target still mid-transition would be measured shifted
  // and the page would land under the fixed header.
  const settle = (id: string) => {
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    const nodes = [target, ...target.querySelectorAll<HTMLElement>('.reveal'), ...(target.closest<HTMLElement>('.reveal') ? [target.closest<HTMLElement>('.reveal')!] : [])];
    nodes.forEach(node => { if (node.classList.contains('reveal')) node.classList.add('is-in', 'is-instant'); });
  };
  document.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (link) settle(link.hash.slice(1));
  }, true);
  addEventListener('hashchange', () => {
    settle(location.hash.slice(1));
    // Back and forward jump before the reveal state is known, so align the target again once it is settled.
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' }));
  });
  settle(location.hash.slice(1));
}

/** Ambient loops (float, drift, pulse) only run while their section is on screen, which keeps scrolling light. */
function initMotionBudget() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
  }, { rootMargin: '120px 0px' });
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
}

export function initPolish() {
  initMotionBudget();
  initProgress();
  initHeroTilt();
  initReveal();
}
