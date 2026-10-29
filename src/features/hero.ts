import { reducedMotion } from '../shared/motion';

/** The domain word in the lead cycles; the original sentence stays for assistive tech and no-JS. */
function initRotator() {
  const host = document.querySelector<HTMLElement>('.rot[data-rot]');
  if (!host || reducedMotion.matches) return;
  const words = (host.dataset.rot ?? '').split('|').filter(Boolean);
  if (words.length < 2) return;
  const original = host.textContent ?? '';
  host.textContent = '';
  const label = document.createElement('span');
  label.className = 'sr';
  label.textContent = original;
  const stack = document.createElement('span');
  stack.className = 'rot-stack';
  stack.setAttribute('aria-hidden', 'true');
  const items = words.map(word => {
    const item = document.createElement('span');
    item.className = 'rot-item';
    item.textContent = word;
    stack.append(item);
    return item;
  });
  host.append(label, stack);
  let index = 0;
  const fit = () => stack.style.setProperty('--rw', `${items[index].scrollWidth}px`);
  items[0].classList.add('on');
  fit();
  document.fonts?.ready.then(fit);
  window.setInterval(() => {
    if (document.hidden) return;
    const leaving = items[index];
    index = (index + 1) % items.length;
    leaving.classList.remove('on');
    leaving.classList.add('out');
    window.setTimeout(() => leaving.classList.remove('out'), 450);
    items[index].classList.add('on');
    fit();
  }, 2300);
}

/** Numbers count up the first time the facts strip is seen. */
function initCountUp() {
  const numbers = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!numbers.length || reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const element = entry.target as HTMLElement;
      const target = Number(element.dataset.count);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100);
        element.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      element.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  numbers.forEach(number => observer.observe(number));
}

/** A soft light follows the pointer across each fact card. */
function initSpotlight() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('.facts > div, .lab .exp, .skill, .edu').forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${event.clientX - box.left}px`);
      card.style.setProperty('--sy', `${event.clientY - box.top}px`);
    });
  });
}

/** The app icons behave like a dock: the nearest icon grows, its neighbours follow. */
function initDock() {
  const dock = document.querySelector<HTMLElement>('.store-icons');
  if (!dock) return;
  const icons = Array.from(dock.querySelectorAll<HTMLAnchorElement>('a'));
  icons.forEach(icon => {
    const name = icon.getAttribute('title');
    if (name) { icon.dataset.name = name; icon.removeAttribute('title'); }
  });
  if (reducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const reset = () => icons.forEach(icon => { icon.style.removeProperty('--s'); icon.classList.remove('peak'); });
  dock.addEventListener('pointermove', event => {
    let nearest: HTMLAnchorElement | null = null;
    let best = Infinity;
    icons.forEach(icon => {
      const box = icon.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (box.left + box.width / 2));
      icon.style.setProperty('--s', (1 + 0.6 * Math.exp(-Math.pow(distance / 62, 2))).toFixed(3));
      if (distance < best) { best = distance; nearest = icon; }
    });
    icons.forEach(icon => icon.classList.toggle('peak', icon === nearest));
  });
  dock.addEventListener('pointerleave', reset);
}

export function initHero() {
  initRotator();
  initCountUp();
  initSpotlight();
  initDock();
}
