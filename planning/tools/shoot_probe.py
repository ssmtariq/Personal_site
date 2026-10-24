import sys, threading, functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
root, out = sys.argv[1], sys.argv[2]
class Q(SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = ThreadingHTTPServer(('127.0.0.1', 8833), functools.partial(Q, directory=root)); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, vp, q, full in [('desktop_light', (1440, 900), '', True), ('desktop_dark', (1440, 900), '?theme=dark', True), ('mobile_light', (390, 844), '', True), ('desktop_fold', (1440, 900), '', False)]:
        ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, reduced_motion='no-preference')
        pg = ctx.new_page(); pg.goto(f'http://127.0.0.1:8833/probe/{q}', wait_until='networkidle')
        for y in range(0, 5000, 400): pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(60)
        pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(700)
        pg.screenshot(path=f'{out}_{name}.png', full_page=full); ctx.close()
    # transfer size of the probe page (all requests)
    ctx = b.new_context(viewport={'width': 1440, 'height': 900}); pg = ctx.new_page(); cdp = ctx.new_cdp_session(pg); cdp.send('Network.enable')
    tot = {'b': 0, 'n': 0}; cdp.on('Network.loadingFinished', lambda e: tot.__setitem__('b', tot['b'] + e['encodedDataLength']) or tot.__setitem__('n', tot['n'] + 1))
    pg.goto('http://127.0.0.1:8833/probe/', wait_until='networkidle'); pg.wait_for_timeout(500)
    print(f"probe page: {tot['n']} requests, {tot['b']/1024:.0f} KiB transferred (uncompressed local server)")
    b.close()
srv.shutdown()
