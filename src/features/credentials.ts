/** Credential IDs copy with one tap; a hidden status region announces the result. */
export function initCredentials() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.copy-id');
  if (!buttons.length) return;
  const live = document.createElement('div');
  live.className = 'sr';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  document.body.append(live);
  buttons.forEach(button => button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    const label = button.querySelector<HTMLElement>('.ci-l');
    let copied = false;
    try { await navigator.clipboard.writeText(value); copied = true; } catch { /* Fall back to selecting the visible ID. */ }
    if (!copied) {
      const code = button.parentElement?.querySelector('code');
      if (code) { const range = document.createRange(); range.selectNodeContents(code); const selection = getSelection(); selection?.removeAllRanges(); selection?.addRange(range); }
      live.textContent = 'Select and copy the credential ID shown.';
      return;
    }
    button.classList.add('done');
    if (label) label.textContent = 'Copied';
    live.textContent = 'Credential ID copied';
    window.setTimeout(() => { button.classList.remove('done'); if (label) label.textContent = 'Copy'; live.textContent = ''; }, 1800);
  }));
}
