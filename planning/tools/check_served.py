"""Serve an assembled site and check that given paths render with their CSS and images."""
import sys, threading, functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
root, port, outprefix = sys.argv[1], int(sys.argv[2]), sys.argv[3]
paths = sys.argv[4:]
h = functools.partial(SimpleHTTPRequestHandler, directory=root)
h.log_message = lambda *a: None
srv = ThreadingHTTPServer(('127.0.0.1', port), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    for path in paths:
        pg = b.new_page(viewport={'width': 1280, 'height': 800}); bad = []
        pg.on('response', lambda r: bad.append(f'{r.status} {r.url}') if r.status >= 400 and '127.0.0.1' in r.url else None)
        pg.goto(f'http://127.0.0.1:{port}{path}', wait_until='networkidle')
        info = pg.evaluate("""() => ({title: document.title, sheets: document.styleSheets.length, font: getComputedStyle(document.body).fontFamily.slice(0,40),
          imgs: document.images.length, broken: Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src'))})""")
        name = path.strip('/').replace('/', '_') or 'root'
        pg.screenshot(path=f'{outprefix}_{name}.png'); pg.close()
        print(f"{path:12s} title={info['title'][:38]!r:42s} css={info['sheets']} font={info['font']!r} imgs={info['imgs']} broken={info['broken']} 4xx={[x.split(' ')[0]+' '+x.split('/')[-1] for x in bad]}")
    b.close()
srv.shutdown()
