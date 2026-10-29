import { reducedMotion } from '../shared/motion';

/** A single raised pill glides under the nav item that is hovered, focused or in view. */
function initNavPill() {
  const nav = document.querySelector<HTMLElement>('nav.main');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  const pill = document.createElement('span');
  pill.className = 'nav-pill no-anim';
  pill.setAttribute('aria-hidden', 'true');
  nav.prepend(pill);
  let hovered: HTMLAnchorElement | null = null;
  const current = () => nav.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
  const render = (instant = false) => {
    const target = hovered ?? current();
    links.forEach(link => link.classList.toggle('is-lit', link === target));
    if (!target || !nav.offsetWidth) { pill.classList.remove('is-on'); return; }
    if (instant) pill.classList.add('no-anim');
    pill.style.setProperty('--x', `${target.offsetLeft}px`);
    pill.style.setProperty('--y', `${target.offsetTop}px`);
    pill.style.setProperty('--w', `${target.offsetWidth}px`);
    pill.style.setProperty('--h', `${target.offsetHeight}px`);
    pill.classList.add('is-on');
    if (instant) requestAnimationFrame(() => pill.classList.remove('no-anim'));
  };
  links.forEach(link => {
    link.addEventListener('pointerenter', () => { hovered = link; render(!pill.classList.contains('is-on')); });
    link.addEventListener('focus', () => { hovered = link; render(!pill.classList.contains('is-on')); });
    link.addEventListener('blur', () => { hovered = null; render(); });
  });
  nav.addEventListener('pointerleave', () => { hovered = null; render(); });
  new MutationObserver(() => render()).observe(nav, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  new ResizeObserver(() => render(true)).observe(nav);
  document.fonts?.ready.then(() => render(true));
  render(true);
}

/** Every Peek on the page follows the pointer with their eyes, leans with scroll direction and blinks. */
function initPeek() {
  const peeks = Array.from(document.querySelectorAll<SVGElement>('.peek'));
  if (!peeks.length || reducedMotion.matches) return;
  const look = (peek: SVGElement, x: number, y: number) => { peek.style.setProperty('--lx', x.toFixed(3)); peek.style.setProperty('--ly', y.toFixed(3)); };
  const vectors = new Map<SVGElement, { x: number; y: number }>(peeks.map(peek => [peek, { x: 0, y: -0.3 }]));
  let frame = 0;
  let scrollTimer = 0;
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      peeks.forEach(peek => {
        const box = peek.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const strength = Math.min(1, distance / 240);
        const vector = { x: (dx / distance) * strength, y: (dy / distance) * strength };
        vectors.set(peek, vector);
        look(peek, vector.x, vector.y);
      });
    });
  }, { passive: true });
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const direction = Math.sign(window.scrollY - lastY);
    lastY = window.scrollY;
    if (!direction) return;
    peeks.forEach(peek => look(peek, (vectors.get(peek)?.x ?? 0) * 0.4, direction * 0.85));
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => peeks.forEach(peek => { const v = vectors.get(peek); if (v) look(peek, v.x, v.y); }), 520);
  }, { passive: true });
  const blink = () => {
    peeks.forEach(peek => peek.classList.add('blink'));
    window.setTimeout(() => peeks.forEach(peek => peek.classList.remove('blink')), 140);
    window.setTimeout(blink, 2600 + Math.random() * 3400);
  };
  window.setTimeout(blink, 1800);
  peeks.forEach(peek => look(peek, 0, -0.3));
}

/** The header call to action leans toward a fine pointer. */
function initMagnet() {
  const button = document.querySelector<HTMLElement>('.header-cta');
  if (!button || reducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  button.addEventListener('pointermove', event => {
    const box = button.getBoundingClientRect();
    button.style.setProperty('--mx', `${((event.clientX - box.left) / box.width - 0.5) * 8}px`);
    button.style.setProperty('--my', `${((event.clientY - box.top) / box.height - 0.5) * 6}px`);
  });
  button.addEventListener('pointerleave', () => { button.style.removeProperty('--mx'); button.style.removeProperty('--my'); });
}

export function initHeader() {
  initNavPill();
  initPeek();
  initMagnet();
}
