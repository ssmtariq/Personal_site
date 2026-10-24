import sys
from playwright.sync_api import sync_playwright
svg, out = sys.argv[1], sys.argv[2]
html = f"<html><body style='margin:0;background:#FBFAF6'><div style='width:960px'>{open(svg).read()}</div></body></html>"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 960, 'height': 470}); pg.set_content(html); pg.screenshot(path=out); b.close()
