"""Re-capture full-page desktop screenshots with animations neutralized.

Usage: python capture2.py OUT_PNG URL [WIDTH]
Blocks known visit-counter hosts so captures don't inflate the owner's counts.
"""
import sys
from playwright.sync_api import sync_playwright

BLOCK = ('abacus.jasoncameron.dev', 'hits.sh', 'visitor-badge', 'counter', 'statcounter', 'clustrmaps', 'mapmyvisitors', 'revolvermaps', 'flagcounter', 'goatcounter')
FORCE_CSS = """
*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important; }
.reveal, [class*="reveal"], [class*="fade"], [data-aos], [class*="animate"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; visibility: visible !important; }
#loading { display: none !important; }
"""
out, url = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
    page = ctx.new_page()
    page.route('**/*', lambda r: r.abort() if any(k in r.request.url for k in BLOCK) else r.continue_())
    page.goto(url, wait_until='load', timeout=60000)
    try:
        page.wait_for_load_state('networkidle', timeout=15000)
    except Exception:
        pass
    h = page.evaluate('document.documentElement.scrollHeight')
    for y in range(0, h + 900, 450):
        page.evaluate(f'window.scrollTo(0,{y})')
        page.wait_for_timeout(150)
    page.add_style_tag(content=FORCE_CSS)
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(1500)
    page.screenshot(path=out, full_page=True, timeout=90000)
    print(out, page.evaluate('document.documentElement.scrollHeight'))
    b.close()
