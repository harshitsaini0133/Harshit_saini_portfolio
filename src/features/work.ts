import { reducedMotion } from '../shared/motion';

/** Earlier cards shrink and dim as the next one slides over them. */
function initStackDepth(cards: HTMLElement[]) {
  const sticky = matchMedia('(min-width: 960px) and (min-height: 700px)');
  let frame = 0;
  const update = () => {
    frame = 0;
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!sticky.matches || !next) { card.style.removeProperty('--depth'); return; }
      const stuckTop = 88 + (index + 1) * 16;
      const range = card.offsetHeight * 0.85;
      const depth = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - stuckTop) / range));
      card.style.setProperty('--depth', depth.toFixed(3));
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

/** The phone stage leans toward a fine pointer. */
function initStageTilt(cards: HTMLElement[]) {
  if (reducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  cards.forEach(card => {
    const media = card.querySelector<HTMLElement>('.pc-media');
    const stage = card.querySelector<HTMLElement>('.pc-stage');
    if (!media || !stage) return;
    media.addEventListener('pointermove', event => {
      const box = media.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      stage.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
      stage.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
    });
    media.addEventListener('pointerleave', () => { stage.style.removeProperty('--rx'); stage.style.removeProperty('--ry'); });
  });
}

/** A small rail on wide screens shows and jumps between the featured apps. */
function initRail(cards: HTMLElement[]) {
  const section = document.getElementById('work');
  if (!section || cards.length < 2) return;
  const rail = document.createElement('nav');
  rail.className = 'work-rail';
  rail.setAttribute('aria-label', 'Featured apps');
  const links = cards.map(card => {
    const link = document.createElement('a');
    link.href = `#${card.id}`;
    link.dataset.app = card.dataset.app ?? '';
    const name = card.querySelector('h3')?.textContent?.trim() ?? card.id;
    link.innerHTML = `<span>${name.replace(/[<>&]/g, '')}</span><i aria-hidden="true"></i>`;
    rail.append(link);
    return link;
  });
  // Placed inside the Work section so keyboard users meet it right after the section heading, not after the footer.
  section.prepend(rail);
  let frame = 0;
  const update = () => {
    frame = 0;
    const box = section.getBoundingClientRect();
    rail.classList.toggle('show', box.top < innerHeight * 0.55 && box.bottom > innerHeight * 0.45);
    let active = 0;
    cards.forEach((card, index) => { if (card.getBoundingClientRect().top < innerHeight * 0.5) active = index; });
    links.forEach((link, index) => { if (index === active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

export function initWork() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.project-card'));
  if (!cards.length) return;
  initStackDepth(cards);
  initStageTilt(cards);
  initRail(cards);
}
