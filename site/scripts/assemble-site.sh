#!/usr/bin/env bash
# Assemble the files published to the public repository from the Astro build and the legacy site.
# Usage: assemble-site.sh preview|live LEGACY_DIR ASTRO_DIST OUT_DIR
#   preview: the current site stays at / unchanged, except that its old résumé link now serves the web CV
#            (the old PDF shows your phone number and GPA); the new site is at /v2/, marked noindex.
#   live:    the new site is at /; /cv.pdf and the old résumé URL serve the web CV. The previous site is kept
#            at /v1/, marked noindex and without its defunct Google Analytics tag; /skeleton/ redirects to
#            /v1/skeleton/, and /v2/ (from the preview) redirects to /.
set -euo pipefail
mode=$1 legacy=$2 dist=$3 out=$4
cv="$dist/cv/Syed_Tariq_CV.pdf"
[ -f "$cv" ] || { echo "missing $cv" >&2; exit 1; }
rm -rf "$out" && mkdir -p "$out"
redirect() { # $1 = folder to hold the stub, $2 = the path it points to
  mkdir -p "$out/$1"
  cat > "$out/$1/index.html" <<HTML
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved to ssmtariq.github.io$2</title>
<meta name="robots" content="noindex"><link rel="canonical" href="https://ssmtariq.github.io$2">
<meta http-equiv="refresh" content="0; url=$2"></head>
<body><p>This page has moved to <a href="$2">ssmtariq.github.io$2</a>.</p></body></html>
HTML
}
legacy_site() { # $1 = folder to hold the legacy pages and their assets
  mkdir -p "$out/$1"
  cp "$legacy/index.html" "$out/$1"
  cp -R "$legacy/assets" "$legacy/images" "$legacy/skeleton" "$out/$1"
}
case "$mode" in
  preview)
    legacy_site .
    cp "$cv" "$out/Resume_of_SSM_TARIQ.pdf"
    mkdir -p "$out/v2" && cp -R "$dist/." "$out/v2/"
    ;;
  live)
    cp -R "$dist/." "$out/"
    cp "$cv" "$out/cv.pdf"
    cp "$cv" "$out/Resume_of_SSM_TARIQ.pdf" # the old pages link here
    legacy_site v1
    # The same two edits are checked in verify-site.mjs (archived()).
    for page in "$out/v1/index.html" "$out/v1/skeleton/index.html"; do
      perl -0777 -pi -e 's/\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]*"><\/script>\s*<script>[^<]*gtag\([^<]*<\/script>//; s/(<meta charset="utf-8">)/$1\n<meta name="robots" content="noindex">/i' "$page"
    done
    redirect skeleton /v1/skeleton/
    redirect v2 /
    ;;
  *) echo "mode must be preview or live" >&2; exit 2 ;;
esac
touch "$out/.nojekyll" # serve files as they are; no Jekyll processing
echo "assembled $mode site in $out ($(find "$out" -type f | wc -l) files)"
