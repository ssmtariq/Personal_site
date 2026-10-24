// Progressive enhancement for the one-page site. Every section, link, and fact works without this file.
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(location.search);
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage blocked: keep defaults */ } },
};

// ---------- toast and copy ----------
const toastEl = $('#toast');
let toastTimer = 0;
function toast(message: string) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-in');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-in'), 2200);
}
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

document.addEventListener('click', async (e) => {
  const target = e.target as Element;

  const copyBtn = target.closest<HTMLElement>('[data-copy], [data-copy-from]');
  if (copyBtn) {
    const text = copyBtn.dataset.copy ?? document.getElementById(copyBtn.dataset.copyFrom!)?.textContent ?? '';
    toast((await copyText(text)) ? copyBtn.dataset.copied ?? 'Copied' : 'Copy failed; select the text instead');
    return;
  }

  // Abstract / BibTeX panels
  const toggle = target.closest<HTMLButtonElement>('[data-toggle][aria-controls]');
  if (toggle) {
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!);
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    if (panel) panel.hidden = !open;
    return;
  }

  // Figure and certificate lightbox (falls back to opening the image)
  const lb = target.closest<HTMLAnchorElement>('[data-lightbox]');
  const dialog = $<HTMLDialogElement>('#lightbox');
  if (lb && dialog && typeof dialog.showModal === 'function') {
    e.preventDefault();
    const img = $<HTMLImageElement>('img', dialog)!;
    img.src = lb.href;
    img.alt = lb.dataset.alt ?? '';
    $('#lightbox-caption')!.textContent = lb.dataset.caption ?? '';
    $('#lightbox-credit')!.textContent = lb.dataset.credit ?? '';
    dialog.showModal();
  }
});
$<HTMLDialogElement>('#lightbox')?.addEventListener('click', (e) => {
  const dialog = e.currentTarget as HTMLDialogElement;
  if (e.target === dialog || (e.target as Element).closest('[data-close]')) dialog.close();
});

// ---------- theme ----------
const themeButtons = $$('[data-theme-toggle]');
const isDark = () => (root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
const syncTheme = () =>
  themeButtons.forEach((b) => {
    b.setAttribute('aria-pressed', String(isDark()));
    b.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  });
themeButtons.forEach((b) =>
  b.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
    syncTheme();
  }),
);
syncTheme();

// ---------- header: progress bar, scroll-spy, back to top ----------
const header = $('.site-header')!;
const bar = $('.progress i');
const toTop = $('#to-top');
const spyLinks = $$<HTMLAnchorElement>('[data-spy] a[href^="#"]');
const sections = [...new Set(spyLinks.map((a) => a.hash.slice(1)))]
  .map((id) => document.getElementById(id))
  .filter((s): s is HTMLElement => s !== null);
let current = '';
function onScroll() {
  const y = window.scrollY;
  const max = root.scrollHeight - innerHeight;
  const ratio = max > 0 ? Math.min(1, y / max) : 0;
  if (bar) bar.style.transform = `scaleX(${ratio})`;
  bar?.parentElement?.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  header.classList.toggle('is-scrolled', y > 4);
  if (toTop) toTop.hidden = y < innerHeight * 1.2;
  // The section that crosses a line 30% down the viewport is current; the hero counts as "About".
  const line = y + header.offsetHeight + innerHeight * 0.3;
  let id = sections[0]?.id ?? '';
  for (const s of sections) if (s.offsetTop <= line) id = s.id;
  if (y >= max - 2 && sections.length) id = sections[sections.length - 1].id;
  if (id === current) return;
  current = id;
  spyLinks.forEach((a) => (a.hash === `#${id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
}
let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; onScroll(); });
}, { passive: true });
addEventListener('resize', onScroll);
document.fonts?.ready.then(onScroll);
onScroll();
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ---------- mobile menu ----------
const menuBtn = $('#menu-btn');
const menu = $('#mobile-menu');
const setMenu = (open: boolean) => {
  menuBtn?.setAttribute('aria-expanded', String(open));
  if (menu) menu.hidden = !open;
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false); });
document.addEventListener('click', (e) => {
  if (menu && !menu.hidden && !(e.target as Element).closest('#mobile-menu, #menu-btn')) setMenu(false);
});

// ---------- availability card (one card, never while Contact is on screen; dismissal remembered 7 days) ----------
const card = $('#contact-card');
if (card) {
  const KEY = 'availability-card-dismissed';
  const mode = params.get('card'); // "show" or "off", for previews and screenshots
  const recently = Number(store.get(KEY)) > Date.now() - 7 * 864e5;
  const contact = document.getElementById('contact');
  let shown = false;
  const show = () => {
    if (shown || mode === 'off') return;
    const r = contact?.getBoundingClientRect();
    if (r && r.top < innerHeight && r.bottom > 0) return;
    shown = true;
    card.hidden = false;
    document.body.classList.add('has-card');
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-in')));
  };
  const hide = () => {
    store.set(KEY, String(Date.now()));
    card.classList.remove('is-in');
    document.body.classList.remove('has-card');
    setTimeout(() => (card.hidden = true), 350);
  };
  if (mode === 'show') show();
  else if (!recently && mode !== 'off') {
    setTimeout(show, 12000);
    const trigger = document.getElementById('publications');
    const onReach = () => {
      if (trigger && trigger.getBoundingClientRect().top < innerHeight * 0.5) {
        show();
        removeEventListener('scroll', onReach);
      }
    };
    addEventListener('scroll', onReach, { passive: true });
  }
  $$('[data-card-dismiss]', card).forEach((b) => b.addEventListener('click', hide));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !card.hidden) hide(); });
}
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- gallery: arrow buttons page through the strip ----------
const track = $('#gallery-track');
if (track) {
  const buttons = $$<HTMLButtonElement>('[data-gal]');
  const sync = () =>
    buttons.forEach((b) => {
      const dir = Number(b.dataset.gal);
      b.disabled = dir < 0 ? track.scrollLeft < 4 : track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    });
  buttons.forEach((b) =>
    b.addEventListener('click', () => track.scrollBy({ left: Number(b.dataset.gal) * track.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' })),
  );
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  addEventListener('resize', sync);
  sync();
}

// ---------- publication filters and search ----------
const pubList = $('#pub-list');
if (pubList) {
  const tools = $('#pub-tools');
  if (tools) tools.hidden = false;
  const items = $$('.pub', pubList);
  const groups = $$('.pub-group', pubList);
  const empty = $('#pub-empty');
  const search = $<HTMLInputElement>('#pub-search');
  let cat = 'all';
  const apply = () => {
    const term = (search?.value ?? '').trim().toLowerCase();
    let shown = 0;
    for (const li of items) {
      const ok = (cat === 'all' || li.dataset.cat === cat) && (!term || (li.dataset.search ?? '').includes(term));
      li.hidden = !ok;
      if (ok) shown++;
    }
    groups.forEach((g) => (g.hidden = !$$('.pub', g).some((li) => !li.hidden)));
    if (empty) empty.hidden = shown > 0;
  };
  $$('[data-filter]').forEach((b) =>
    b.addEventListener('click', () => {
      cat = b.dataset.filter!;
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }),
  );
  search?.addEventListener('input', apply);
}

// ---------- count-up numbers and reveal on scroll (motion-safe only) ----------
if (!reduceMotion && 'IntersectionObserver' in window) {
  const animate = (el: HTMLElement) => {
    const m = (el.dataset.count ?? '').match(/^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] ?? '').length;
    const fmt = (v: number) => pre + (num.includes(',') ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals)) + post;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counter = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      counter.unobserve(en.target);
      animate(en.target as HTMLElement);
    }
  }, { threshold: 0.7 });
  $$('[data-count]').forEach((el) => counter.observe(el));

  const below = $$('.reveal').filter((el) => el.getBoundingClientRect().top > innerHeight);
  below.forEach((el) => el.classList.add('pre'));
  const revealer = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.remove('pre');
      revealer.unobserve(en.target);
    }
  }, { rootMargin: '0px 0px -6% 0px' });
  below.forEach((el) => revealer.observe(el));
}
