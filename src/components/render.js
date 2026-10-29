/** Escape content before inserting it into build-time HTML templates. */
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export function renderProcessCards(items) {
  return items.map(item => `<li class="how-card"><img class="process-art" src="${escape(item.image)}" alt="" width="1024" height="1024" loading="lazy" decoding="async"><div class="how-heading"><span class="how-n" aria-hidden="true">${escape(item.number)}</span><h3>${escape(item.title)}</h3></div><p>${escape(item.description)}</p></li>`).join('\n');
}

function renderPoints(item) {
  const points = Array.isArray(item.points) ? item.points : [];
  const list = points.length ? `<ul class="svc-points">${points.map(point => `<li>${escape(point)}</li>`).join('')}</ul>` : '';
  return `${list}${item.fit ? `<p class="svc-fit">${escape(item.fit)}</p>` : ''}`;
}

const MAIL = 'harshitsaini0133@gmail.com';
const BRIEF = 'Hi Harshit,\r\n\r\nWhat the app does:\r\nPlatforms (Android, iOS or both):\r\nNew build or existing app:\r\nTimeline:\r\nBudget range:\r\nHow to reach me:\r\n';

export function renderServiceCards(items) {
  return items.map((item, index) => {
    const href = `mailto:${MAIL}?subject=${encodeURIComponent(item.subject || 'Flutter project enquiry')}&body=${encodeURIComponent(BRIEF)}`;
    const fit = item.fit ? `<p class="svc-fit">${escape(item.fit)}</p>` : '';
    return `<article class="card svc rv"><div class="svc-stage"><img class="service-art" src="${escape(item.image)}" alt="" width="1024" height="1024" loading="lazy" decoding="async"><span class="svc-n" aria-hidden="true">0${index + 1}</span></div>${fit}<h3>${escape(item.title)}</h3><p class="svc-lead">${escape(item.description)}</p>${renderPoints(item).replace(/<p class="svc-fit">.*$/, '')}<a class="btn secondary sm svc-cta" href="${href.replace(/&/g, '&amp;')}">Ask about this<span class="sr">: ${escape(item.title)}</span></a></article>`;
  }).join('\n');
}
