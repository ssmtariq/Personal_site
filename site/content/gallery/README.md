# Gallery photos

Put photos for the site's Gallery section in this folder (`.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`).

- Every photo here appears in the horizontally scrolling gallery ("Memories"), which sits just before Contact.
- With no photos, the Gallery section and its menu item are hidden.
- For alt text, a caption, a date, and a place, add an entry to `content/gallery.yaml` (see the example there).
  Without one, the alt text comes from the file name, so name files descriptively, for example `hipeac-2024-munich.jpg`.
- Photos appear in the `order` given in `content/gallery.yaml` (1, 2, 3 ...). Photos without an `order` follow, newest first by date.
- The build resizes and re-encodes every photo and removes metadata such as GPS location. Originals are never published.
- Keep each original under about 10 MB; the build makes small versions for the page.
