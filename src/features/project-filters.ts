import { required } from '../shared/dom';
import { filterCategory } from '../shared/preferences';

export function initFilters() {
  const rows = Array.from(document.querySelectorAll<HTMLElement>('#index .row'));
  const categories = ['All', ...new Set(rows.map(row => row.dataset.category || ''))];
  const filters = required<HTMLElement>('#filters');
  const count = required<HTMLElement>('#count');
  let category = filterCategory(new URL(location.href).searchParams.get('category'), categories);
  const total = (label: string) => label === 'All' ? rows.length : rows.filter(row => row.dataset.category === label).length;
  const pill = document.createElement('span');
  pill.className = 'filter-pill no-anim';
  pill.setAttribute('aria-hidden', 'true');
  filters.append(pill);
  const buttons = categories.map(label => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.label = label;
    button.innerHTML = `<span class="fl"></span><span class="fc" aria-hidden="true">${total(label)}</span>`;
    (button.firstElementChild as HTMLElement).textContent = label;
    button.addEventListener('click', () => {
      category = label;
      const url = new URL(location.href);
      if (category === 'All') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      history.pushState(null, '', url);
      render(true);
    });
    filters.append(button);
    return button;
  });
  /** The dark pill slides to the chosen filter. */
  function movePill(instant: boolean) {
    const active = buttons.find(button => button.dataset.label === category);
    if (!active || !filters.offsetWidth) return;
    if (instant) pill.classList.add('no-anim');
    pill.style.setProperty('--x', `${active.offsetLeft}px`);
    pill.style.setProperty('--y', `${active.offsetTop}px`);
    pill.style.setProperty('--w', `${active.offsetWidth}px`);
    pill.style.setProperty('--h', `${active.offsetHeight}px`);
    if (instant) requestAnimationFrame(() => pill.classList.remove('no-anim'));
  }
  function render(animate = false) {
    let visible = 0;
    rows.forEach(row => {
      row.hidden = category !== 'All' && row.dataset.category !== category;
      row.classList.remove('enter');
      if (!row.hidden) {
        if (animate) {
          row.style.setProperty('--d', `${Math.min(visible, 8) * 45}ms`);
          void row.offsetWidth;
          row.classList.add('enter');
        }
        visible++;
      }
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.label === category)));
    count.textContent = category === 'All' ? `All ${rows.length}` : `${visible} of ${rows.length} in ${category}`;
    movePill(!animate);
  }
  window.addEventListener('popstate', () => {
    category = filterCategory(new URL(location.href).searchParams.get('category'), categories);
    render(true);
  });
  new ResizeObserver(() => movePill(true)).observe(filters);
  document.fonts?.ready.then(() => movePill(true));
  render();
}
