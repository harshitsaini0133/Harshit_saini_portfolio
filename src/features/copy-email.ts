import { root, required } from '../shared/dom';

export function initCopy() {
  const button = required<HTMLButtonElement>('#copy');
  const label = required<HTMLElement>('#copyLabel');
  const live = required<HTMLElement>('#live');
  let timer: ReturnType<typeof setTimeout> | undefined;
  let busy = false;
  button.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    clearTimeout(timer);
    button.setAttribute('aria-busy', 'true');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(required<HTMLElement>('#mail').textContent!.trim());
      label.textContent = 'Copied';
      live.textContent = 'Email address copied.';
      timer = setTimeout(() => { label.textContent = 'Copy email'; live.textContent = ''; }, 4000);
    } catch {
      label.textContent = 'Try copying again';
      live.textContent = 'Couldn’t copy. Select the email address above, or use the Email me link.';
    } finally {
      busy = false;
      button.removeAttribute('aria-busy');
    }
  });
  root.classList.add('copy-ready');
}
