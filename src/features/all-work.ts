import { reducedMotion } from '../shared/motion';

/** Screenshot strips can be dragged with a mouse; touch and trackpads already scroll natively. */
function initDrag() {
  document.querySelectorAll<HTMLElement>('.shots').forEach(strip => {
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    strip.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      down = true; moved = false; startX = event.clientX; startLeft = strip.scrollLeft;
    });
    window.addEventListener('pointermove', event => {
      if (!down) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; strip.classList.add('dragging'); }
      if (moved) strip.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => { down = false; strip.classList.remove('dragging'); });
    strip.addEventListener('click', event => { if (moved) { event.stopPropagation(); event.preventDefault(); moved = false; } }, true);
  });
}

/** Store screenshots open in a large viewer: arrow keys, swipe, Escape and click outside. */
function initLightbox() {
  const strips = Array.from(document.querySelectorAll<HTMLElement>('.shots'));
  if (!strips.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Screenshot viewer');
  dialog.innerHTML = `<div class="lb-bar"><p class="lb-title" id="lbTitle"></p><span class="lb-count" id="lbCount" aria-live="polite"></span><button type="button" class="lb-close" aria-label="Close viewer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
<div class="lb-stage"><button type="button" class="lb-nav lb-prev" aria-label="Previous screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><span class="lb-slot"></span><button type="button" class="lb-nav lb-next" aria-label="Next screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>
<p class="lb-cap" id="lbCap"></p>`;
  document.body.append(dialog);
  // The image exists only while the viewer is open, so the page never carries an <img> without a source.
  const slot = dialog.querySelector<HTMLElement>('.lb-slot')!;
  const image = document.createElement('img');
  image.className = 'lb-img';
  const title = dialog.querySelector<HTMLElement>('#lbTitle')!;
  const counter = dialog.querySelector<HTMLElement>('#lbCount')!;
  const caption = dialog.querySelector<HTMLElement>('#lbCap')!;
  const prev = dialog.querySelector<HTMLButtonElement>('.lb-prev')!;
  const next = dialog.querySelector<HTMLButtonElement>('.lb-next')!;
  let shots: HTMLImageElement[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;
  const show = (to: number) => {
    index = (to + shots.length) % shots.length;
    const shot = shots[index];
    image.classList.remove('swap');
    void image.offsetWidth;
    image.src = shot.currentSrc || shot.src;
    image.alt = shot.alt;
    if (!reducedMotion.matches) image.classList.add('swap');
    counter.textContent = `${index + 1} of ${shots.length}`;
    caption.textContent = shot.alt.replace(/^.*? store image:\s*/, '');
    shot.parentElement?.scrollTo({ left: shot.offsetLeft - 8, behavior: 'auto' });
  };
  const open = (strip: HTMLElement, shot: HTMLImageElement) => {
    shots = Array.from(strip.querySelectorAll('img'));
    if (!image.isConnected) slot.replaceWith(image);
    title.textContent = (strip.getAttribute('aria-label') ?? '').split(' screenshots')[0];
    opener = shot;
    dialog.showModal();
    show(shots.indexOf(shot));
  };
  strips.forEach(strip => strip.querySelectorAll<HTMLImageElement>('img').forEach(shot => {
    shot.tabIndex = 0;
    shot.setAttribute('role', 'button');
    shot.setAttribute('aria-haspopup', 'dialog');
    shot.classList.add('zoomable');
    shot.addEventListener('click', () => open(strip, shot));
    shot.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(strip, shot); } });
  }));
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.querySelector('.lb-close')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog || (event.target as HTMLElement).classList.contains('lb-stage')) dialog.close(); });
  dialog.addEventListener('close', () => { image.removeAttribute('src'); image.replaceWith(slot); opener?.focus(); opener = null; });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });
  let touchX = 0;
  dialog.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

export function initAllWork() {
  initDrag();
  initLightbox();
}
