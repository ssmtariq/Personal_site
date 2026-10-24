"""Capture screenshots and page metrics for a list of URLs.

Usage: python capture.py OUT_DIR URL [URL ...]
Writes OUT_DIR/<slug>/{desktop.png,mobile.png,metrics.json}.
"""
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

LCP_SCRIPT = """
window.__lcp = 0; window.__cls = 0;
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; })
  .observe({type: 'largest-contentful-paint', buffered: true});
new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
  .observe({type: 'layout-shift', buffered: true});
"""

DOM_SCRIPT = r"""
() => {
  const q = s => Array.from(document.querySelectorAll(s));
  const meta = {};
  q('meta').forEach(m => {
    const k = m.getAttribute('name') || m.getAttribute('property');
    if (k) meta[k] = (m.getAttribute('content') || '').slice(0, 200);
  });
  const headings = q('h1,h2,h3').map(h => h.tagName + ': ' + h.innerText.trim().replace(/\s+/g, ' ').slice(0, 120)).filter(Boolean);
  const navLinks = q('nav a, header a').map(a => (a.innerText.trim() || a.getAttribute('aria-label') || '') + ' -> ' + a.getAttribute('href')).slice(0, 60);
  const imgs = q('img');
  const links = q('a[href]').map(a => a.href);
  let darkCss = false;
  for (const ss of Array.from(document.styleSheets)) {
    try { for (const r of Array.from(ss.cssRules)) { if ((r.conditionText || r.media?.mediaText || '').includes('prefers-color-scheme')) darkCss = true; } } catch (e) {}
  }
  const html = document.documentElement.outerHTML;
  return {
    title: document.title,
    lang: document.documentElement.lang,
    meta,
    jsonld: q('script[type="application/ld+json"]').map(s => s.textContent.slice(0, 400)),
    canonical: document.querySelector('link[rel=canonical]')?.href || null,
    favicon: q('link[rel*=icon]').map(l => l.href),
    headings,
    navLinks,
    imgCount: imgs.length,
    imgNoAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    imgEmptyAlt: imgs.filter(i => i.getAttribute('alt') === '').length,
    linkCount: links.length,
    profileLinks: links.filter(h => /scholar\.google|github\.com|linkedin\.com|orcid\.org|dblp|researchgate|twitter\.com|x\.com|semanticscholar|youtube/i.test(h)).slice(0, 30),
    pdfLinks: links.filter(h => /\.pdf($|\?)/i.test(h)).slice(0, 30),
    fonts: Array.from(new Set(Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family))),
    bodyFont: getComputedStyle(document.body).fontFamily,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    textLength: document.body.innerText.length,
    darkModeCss: darkCss,
    themeToggleHint: /theme|dark|light-mode|darkmode/i.test(html.slice(0, 200000)) ,
    generator: document.querySelector('meta[name=generator]')?.content || null,
    scripts: q('script[src]').map(s => s.src).slice(0, 40),
    stylesheets: q('link[rel=stylesheet]').map(s => s.href).slice(0, 40),
    iframes: q('iframe').map(f => f.src).slice(0, 20),
    pageHeight: document.documentElement.scrollHeight,
  };
}
"""


def slugify(url):
    p = urlparse(url)
    s = (p.netloc + p.path).strip('/')
    return re.sub(r'[^A-Za-z0-9]+', '_', s)[:80]


def auto_scroll(page):
    page.evaluate("""async () => {
      await new Promise(res => {
        let y = 0; const step = 600;
        const t = setInterval(() => {
          window.scrollBy(0, step); y += step;
          if (y >= document.documentElement.scrollHeight + 1000) { clearInterval(t); res(); }
        }, 120);
      });
      window.scrollTo(0, 0);
    }""")


def capture(browser, url, out, mobile=False):
    if mobile:
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1,
                                  is_mobile=True, has_touch=True,
                                  user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    else:
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.add_init_script(LCP_SCRIPT)
    cdp = ctx.new_cdp_session(page)
    cdp.send('Network.enable')
    stats = {'bytes': 0, 'requests': 0, 'domains': {}, 'failed': []}
    req_urls = {}

    def on_req(e):
        stats['requests'] += 1
        u = e['request']['url']
        req_urls[e['requestId']] = u
        d = urlparse(u).netloc
        if d:
            stats['domains'][d] = stats['domains'].get(d, 0) + 1

    def on_fin(e):
        stats['bytes'] += e.get('encodedDataLength', 0)

    def on_fail(e):
        stats['failed'].append(req_urls.get(e['requestId'], '?') + ' ' + e.get('errorText', ''))

    cdp.on('Network.requestWillBeSent', on_req)
    cdp.on('Network.loadingFinished', on_fin)
    cdp.on('Network.loadingFailed', on_fail)
    console = []
    page.on('console', lambda m: console.append(f'{m.type}: {m.text[:200]}') if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: console.append(f'pageerror: {str(e)[:200]}'))
    t0 = time.time()
    try:
        page.goto(url, wait_until='load', timeout=60000)
    except Exception as e:
        console.append(f'goto: {e}')
    load_s = time.time() - t0
    try:
        page.wait_for_load_state('networkidle', timeout=15000)
    except Exception:
        pass
    timing = page.evaluate("""() => { const n = performance.getEntriesByType('navigation')[0];
      return n ? {dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), ttfb: Math.round(n.responseStart)} : null; }""")
    lcp = page.evaluate('window.__lcp')
    auto_scroll(page)
    page.wait_for_timeout(1500)
    cls = page.evaluate('window.__cls')
    dom = page.evaluate(DOM_SCRIPT)
    name = 'mobile' if mobile else 'desktop'
    try:
        page.screenshot(path=str(out / f'{name}.png'), full_page=True, timeout=60000)
    except Exception as e:
        console.append(f'screenshot: {e}')
    # above-the-fold shot for first impression
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(800)
    page.screenshot(path=str(out / f'{name}_fold.png'), full_page=False)
    ctx.close()
    return {
        'url': url, 'mode': name, 'wall_load_s': round(load_s, 2), 'timing_ms': timing,
        'lcp_ms': round(lcp or 0), 'cls': round(cls or 0, 3),
        'transfer_bytes': stats['bytes'], 'transfer_mb': round(stats['bytes'] / 1e6, 2),
        'requests': stats['requests'], 'domains': stats['domains'], 'failed': stats['failed'][:20],
        'console': console[:30], 'dom': dom,
    }


def main():
    out_root = Path(sys.argv[1])
    urls = sys.argv[2:]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for url in urls:
            out = out_root / slugify(url)
            out.mkdir(parents=True, exist_ok=True)
            res = {}
            for mobile in (False, True):
                try:
                    res['mobile' if mobile else 'desktop'] = capture(browser, url, out, mobile)
                except Exception as e:
                    res['mobile' if mobile else 'desktop'] = {'error': str(e)}
            (out / 'metrics.json').write_text(json.dumps(res, indent=2))
            d = res.get('desktop', {})
            print(f"{url}: {d.get('transfer_mb')} MB, {d.get('requests')} req, LCP {d.get('lcp_ms')} ms, height {d.get('dom', {}).get('pageHeight')}")
        browser.close()


if __name__ == '__main__':
    main()
