"""Split a tall screenshot into downscaled tiles: python tile.py IMG OUT_PREFIX TILE_H WIDTH"""
import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, prefix, tile_h, width = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src).convert('RGB')
w, h = im.size
n = 0
for top in range(0, h, tile_h):
    crop = im.crop((0, top, w, min(top + tile_h, h)))
    scale = width / w
    crop = crop.resize((width, max(1, int(crop.height * scale))), Image.LANCZOS)
    crop.save(f'{prefix}_{n:02d}.jpg', quality=82)
    n += 1
print(src, (w, h), 'tiles:', n)
