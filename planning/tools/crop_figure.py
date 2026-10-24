"""Crop a figure from a PDF page: everything between the top text margin and its caption.
Usage: crop_figure.py PDF PAGE CAPTION_PREFIX OUT_PNG [DPI] [--column left|right|full] [--top PT]
Two-column papers need --column; pages without a running header need --top (points from the page top).
The caption prefix (e.g. "Fig. 3.") is located with pdftotext -bbox, so crops survive re-rendering."""
import re, subprocess, sys, html
from PIL import Image, ImageOps
pdf, page, prefix, out = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
opts = sys.argv[5:]
dpi = int(opts[0]) if opts and opts[0].isdigit() else 220
column = opts[opts.index('--column') + 1] if '--column' in opts else 'full'
top_override = float(opts[opts.index('--top') + 1]) if '--top' in opts else None
xml = subprocess.run(['pdftotext', '-f', str(page), '-l', str(page), '-bbox', pdf, '-'], capture_output=True, text=True).stdout
pw, ph = map(float, re.search(r'<page width="([\d.]+)" height="([\d.]+)"', xml).groups())
words = [(float(a), float(b), float(c), float(d), html.unescape(w)) for a, b, c, d, w in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', xml)]
first, second = prefix.split()[0], prefix.split()[1]
cap = next((w for i, w in enumerate(words) if w[4] == first and i + 1 < len(words) and words[i + 1][4].startswith(second)), None)
if not cap: sys.exit(f'caption "{prefix}" not found on page {page}')
header_bottom = min(w[3] for w in words if w[1] > 20) # first text line (running header)
top = top_override if top_override is not None else header_bottom + 4
png = out.replace('.png', '') + '_page'
subprocess.run(['pdftoppm', '-r', str(dpi), '-png', '-f', str(page), '-l', str(page), '-singlefile', pdf, png], check=True)
im = Image.open(png + '.png').convert('RGB'); s = dpi / 72
x0, x1 = {'left': (0, pw / 2), 'right': (pw / 2, pw), 'full': (0, pw)}[column]
crop = im.crop((int(x0 * s), int(top * s), int(x1 * s), int((cap[1] - 2) * s)))
bbox = ImageOps.invert(crop).getbbox()           # trim white margins
crop = crop.crop((max(0, bbox[0] - 12), max(0, bbox[1] - 12), min(crop.width, bbox[2] + 12), min(crop.height, bbox[3] + 12)))
crop.save(out, optimize=True)
print(out, crop.size, f'caption at y={cap[1]:.0f}pt of {ph:.0f}pt')
