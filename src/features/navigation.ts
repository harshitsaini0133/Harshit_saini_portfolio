import { root, required } from '../shared/dom';

export function initNavigation() {
  const header = required<HTMLElement>('header.site');
  const button = required<HTMLButtonElement>('#menuBtn');
  const menu = required<HTMLElement>('#mnav');
  const desktop = matchMedia('(min-width: 960px)');
  const syncHeader = () => header.classList.toggle('is-condensed', window.scrollY > 50);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  function close(restoreFocus = false) {
    menu.classList.remove('open');
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
    if (restoreFocus && !desktop.matches) button.focus();
  }
  menu.inert = true;
  menu.setAttribute('aria-hidden', 'true');
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (!link) return;
    const href = link.getAttribute('href');
    close();
    if (href?.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
    } else button.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) close(true);
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
      close(menu.contains(document.activeElement));
    }
  });
  desktop.addEventListener('change', () => {
    const focusInside = menu.contains(document.activeElement);
    close();
    if (focusInside) required<HTMLAnchorElement>('header .brand').focus();
  });
  // A focused control must never sit under the fixed header (WCAG 2.4.11); browsers skip scrolling when it is only partly covered.
  document.addEventListener('focusin', event => {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLElement) || header.contains(target) || menu.contains(target)) return;
    const shell = header.querySelector<HTMLElement>('.header-shell');
    const limit = (shell?.getBoundingClientRect().bottom ?? 0) + 12;
    const top = target.getBoundingClientRect().top;
    if (top < limit && top > -window.innerHeight) window.scrollBy({ top: top - limit, behavior: 'instant' });
  });
  root.classList.add('nav-ready');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav.main a, #mnav a[href^="#"]'));
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px' });
  [...new Set(navLinks.map(link => link.hash.slice(1)))].forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
