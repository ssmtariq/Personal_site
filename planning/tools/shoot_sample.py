"""Screenshots and behaviour checks for the one-page site (review build).

Usage: python shoot_sample.py DIST_DIR OUT_DIR
Serves DIST_DIR on 127.0.0.1:8834 and writes PNG captures plus checks.json to OUT_DIR.
"""
import functools, json, sys, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

root, out = sys.argv[1], Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = ThreadingHTTPServer(('127.0.0.1', 8834), functools.partial(Quiet, directory=root))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:8834/'
SECTIONS = ['about', 'experience', 'education', 'publications', 'teaching', 'research', 'service', 'awards', 'gallery', 'contact']
checks = {}


def page(browser, w, h, query='', motion='reduce', dark=False):
    ctx = browser.new_context(viewport={'width': w, 'height': h}, reduced_motion=motion, color_scheme='dark' if dark else 'light', device_scale_factor=1)
    pg = ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and errors.append(m.text))
    pg.goto(URL + query, wait_until='networkidle')
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(300)
    return ctx, pg, errors


def load_lazy(pg):
    # lazy images load only near the viewport; walk the page once so full-page captures include them
    pg.evaluate("""async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
    }""")
    pg.wait_for_load_state('networkidle')
    pg.wait_for_timeout(300)


def scroll_to(pg, sel, offset=0):
    pg.evaluate(f"window.scrollTo(0, document.querySelector('{sel}').offsetTop + {offset})")
    pg.wait_for_timeout(250)


with sync_playwright() as p:
    b = p.chromium.launch()

    # full pages
    for name, w, h, q, dark in [('desktop_light', 1440, 900, '?card=off', False), ('desktop_dark', 1440, 900, '?card=off&theme=dark', True), ('mobile_light', 390, 844, '?card=off', False)]:
        ctx, pg, errors = page(b, w, h, q, dark=dark)
        load_lazy(pg)
        pg.screenshot(path=str(out / f'sample_{name}_full.png'), full_page=True)
        checks[f'{name}_console_errors'] = errors
        checks[f'{name}_page_height'] = pg.evaluate('document.documentElement.scrollHeight')
        checks[f'{name}_horizontal_overflow_px'] = pg.evaluate('document.documentElement.scrollWidth - window.innerWidth')
        ctx.close()

    # first screen
    ctx, pg, _ = page(b, 1440, 900, '?card=off')
    pg.screenshot(path=str(out / 'sample_desktop_fold.png'))
    # scroll-spy: the highlighted link must follow every section
    spy = {}
    for sid in SECTIONS:
        scroll_to(pg, f'#{sid}', 40)
        spy[sid] = pg.evaluate("[...document.querySelectorAll('.nav a[aria-current=\"true\"]')].map(a => a.hash.slice(1))")
    checks['scroll_spy'] = spy
    checks['scroll_spy_ok'] = all(v == [k] for k, v in spy.items())
    # header stays on screen while scrolling (sticky) and the progress bar grows
    scroll_to(pg, '#research', 40)
    checks['header_top_px_at_research'] = pg.evaluate("document.querySelector('.site-header').getBoundingClientRect().top")
    checks['progress_scale_at_research'] = pg.evaluate("getComputedStyle(document.querySelector('.progress i')).transform")
    pg.screenshot(path=str(out / 'sample_frame_research.png'))
    # publications: filter + abstract + BibTeX
    scroll_to(pg, '#publications', 0)
    pg.click('[data-filter="conference"]')
    pg.click('[aria-controls="abs-tariq-saner26-cold-start"]')
    pg.click('[aria-controls="bib-tariq-saner26-cold-start"]')
    pg.wait_for_timeout(200)
    scroll_to(pg, '#publications', 0)
    checks['visible_pubs_after_conference_filter'] = pg.evaluate("[...document.querySelectorAll('#pub-list .pub')].filter(li => !li.hidden).length")
    pg.screenshot(path=str(out / 'sample_frame_publications.png'))
    pg.fill('#pub-search', 'microservice')
    pg.click('[data-filter="all"]')
    checks['visible_pubs_search_microservice'] = pg.evaluate("[...document.querySelectorAll('#pub-list .pub')].filter(li => !li.hidden).map(li => li.id)")
    pg.fill('#pub-search', '')
    # lightbox
    scroll_to(pg, '#research', 0)
    pg.click('#project-microprof [data-lightbox]')
    pg.wait_for_timeout(400)
    checks['lightbox_open'] = pg.evaluate("document.querySelector('#lightbox').open")
    pg.screenshot(path=str(out / 'sample_frame_lightbox.png'))
    pg.keyboard.press('Escape')
    ctx.close()

    # availability card (forced) over the About section
    ctx, pg, _ = page(b, 1440, 900, '?card=show')
    scroll_to(pg, '#about', -40)
    pg.wait_for_timeout(500)
    pg.screenshot(path=str(out / 'sample_frame_card.png'))
    pg.keyboard.press('Escape')
    pg.wait_for_timeout(500)
    checks['card_hidden_after_escape'] = pg.evaluate("document.querySelector('#contact-card').hidden")
    ctx.close()

    # "Get connected" opens LinkedIn in a new tab and closes the card
    ctx, pg, _ = page(b, 1440, 900, '?card=show')
    pg.wait_for_timeout(500)
    link = pg.locator('#contact-card a', has_text='Get connected')
    checks['card_connect_link'] = {'href': link.get_attribute('href'), 'target': link.get_attribute('target'), 'label': link.inner_text().strip()}
    ctx.route('**/*linkedin.com/**', lambda r: r.abort())  # never contact LinkedIn from a test
    with ctx.expect_page() as popup:
        link.click()
    checks['card_connect_opens_new_tab'] = True
    popup.value.close()
    pg.wait_for_timeout(500)
    checks['card_hidden_after_connect'] = pg.evaluate("document.querySelector('#contact-card').hidden")
    checks['card_label'] = pg.locator('#contact-card .label').inner_text().strip()
    ctx.close()

    # the card appears on its own after reaching Publications, and never while Contact is on screen
    ctx, pg, _ = page(b, 1440, 900, '', motion='no-preference')
    scroll_to(pg, '#publications', 0)
    pg.wait_for_timeout(900)
    checks['card_auto_after_publications'] = pg.evaluate("!document.querySelector('#contact-card').hidden")
    ctx.close()

    # reading progress below the sticky header, the gallery strip and its arrows, flags, the green availability chip
    ctx, pg, _ = page(b, 1440, 900, '?card=off')
    load_lazy(pg)
    scroll_to(pg, '#teaching', 40)
    checks['progress_value_at_teaching'] = pg.evaluate("document.querySelector('.progress').getAttribute('aria-valuenow')")
    pg.screenshot(path=str(out / 'sample_frame_progress.png'))
    if pg.evaluate("!!document.getElementById('gallery')"):
        scroll_to(pg, '#gallery', -10)
        pg.screenshot(path=str(out / 'sample_frame_gallery.png'))
        before = pg.evaluate("document.getElementById('gallery-track').scrollLeft")
        pg.click('[data-gal="1"]')
        pg.wait_for_timeout(700)
        checks['gallery_arrow_scrolls_px'] = pg.evaluate("document.getElementById('gallery-track').scrollLeft") - before
    checks['flags_rendered'] = pg.evaluate("document.querySelectorAll('svg.flag').length")
    checks['open_chip_border'] = pg.evaluate("getComputedStyle(document.querySelector('.hero .open-chip')).borderTopColor")
    ctx.close()

    # mobile: first screen, open menu, card
    ctx, pg, _ = page(b, 390, 844, '?card=off')
    pg.screenshot(path=str(out / 'sample_mobile_fold.png'))
    scroll_to(pg, '#research', 40)
    pg.click('#menu-btn')
    pg.wait_for_timeout(250)
    checks['mobile_menu_current'] = pg.evaluate("[...document.querySelectorAll('#mobile-menu a[aria-current=\"true\"]')].map(a => a.hash)")
    pg.screenshot(path=str(out / 'sample_mobile_menu.png'))
    checks['mobile_header_overflow'] = pg.evaluate("(() => { const b = document.querySelector('.site-header .bar'); return b.scrollWidth - b.clientWidth; })()")
    ctx.close()
    ctx, pg, _ = page(b, 390, 844, '?card=show')
    scroll_to(pg, '#about', 0)
    pg.wait_for_timeout(500)
    pg.screenshot(path=str(out / 'sample_mobile_card.png'))
    ctx.close()

    # the full nav never touches the icon group: report the free space between them (or "collapsed" to the menu)
    for w in (1024, 1259, 1260, 1280, 1440, 1920):
        ctx, pg, _ = page(b, w, 800, '?card=off')
        checks[f'header_gap_{w}'] = pg.evaluate("""(() => {
          if (getComputedStyle(document.querySelector('.site-header .nav')).display === 'none') return 'collapsed';
          const links = [...document.querySelectorAll('.site-header .nav a')];
          return Math.round(document.querySelector('.site-header .tools').getBoundingClientRect().left - links[links.length - 1].getBoundingClientRect().right);
        })()""")
        ctx.close()

    # no-JavaScript visitors still get every section and every abstract
    ctx = b.new_context(viewport={'width': 1440, 'height': 900}, java_script_enabled=False)
    pg = ctx.new_page()
    pg.goto(URL, wait_until='networkidle')
    checks['nojs_sections_present'] = pg.evaluate(f"{json.dumps(SECTIONS)}.every(id => document.getElementById(id))")
    checks['nojs_abstract_visible'] = pg.evaluate("getComputedStyle(document.getElementById('abs-tariq-saner26-cold-start')).display !== 'none'")
    ctx.close()

    # transfer size of the first view
    ctx = b.new_context(viewport={'width': 1440, 'height': 900})
    pg = ctx.new_page()
    cdp = ctx.new_cdp_session(pg)
    cdp.send('Network.enable')
    tot = {'b': 0, 'n': 0}
    cdp.on('Network.loadingFinished', lambda e: tot.__setitem__('b', tot['b'] + e['encodedDataLength']) or tot.__setitem__('n', tot['n'] + 1))
    pg.goto(URL + '?card=off', wait_until='networkidle')
    pg.wait_for_timeout(500)
    checks['first_view_requests'] = tot['n']
    checks['first_view_kib'] = round(tot['b'] / 1024)
    ctx.close()
    b.close()
srv.shutdown()
(out / 'checks.json').write_text(json.dumps(checks, indent=2))
print(json.dumps(checks, indent=2))
