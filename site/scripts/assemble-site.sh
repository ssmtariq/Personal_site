#!/usr/bin/env bash
# Assemble the files published to the public repository from the Astro build and the legacy site.
# Usage: assemble-site.sh preview|live LEGACY_DIR ASTRO_DIST OUT_DIR
#   preview: the current site stays at / unchanged, except that its old résumé link now serves the web CV
#            (the old PDF shows your phone number and GPA); the new site is at /v2/, marked noindex.
#   live:    the new site is at /; /cv.pdf and the old résumé URL serve the web CV; the old pages
#            (/skeleton/, and /v2/ from the preview) redirect to /. The legacy files stay in this
#            private repository (legacy/) and are no longer published.
set -euo pipefail
mode=$1 legacy=$2 dist=$3 out=$4
cv="$dist/cv/Syed_Tariq_CV.pdf"
[ -f "$cv" ] || { echo "missing $cv" >&2; exit 1; }
rm -rf "$out" && mkdir -p "$out"
redirect() { # $1 = folder to hold the stub
  mkdir -p "$out/$1"
  cat > "$out/$1/index.html" <<'HTML'
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved to ssmtariq.github.io</title>
<meta name="robots" content="noindex"><link rel="canonical" href="https://ssmtariq.github.io/">
<meta http-equiv="refresh" content="0; url=/"></head>
<body><p>This page has moved to <a href="/">ssmtariq.github.io</a>.</p></body></html>
HTML
}
case "$mode" in
  preview)
    cp "$legacy/index.html" "$out/"
    cp -R "$legacy/assets" "$legacy/images" "$legacy/skeleton" "$out/"
    cp "$cv" "$out/Resume_of_SSM_TARIQ.pdf"
    mkdir -p "$out/v2" && cp -R "$dist/." "$out/v2/"
    ;;
  live)
    cp -R "$dist/." "$out/"
    cp "$cv" "$out/cv.pdf"
    cp "$cv" "$out/Resume_of_SSM_TARIQ.pdf"
    redirect skeleton
    redirect v2
    ;;
  *) echo "mode must be preview or live" >&2; exit 2 ;;
esac
touch "$out/.nojekyll" # serve files as they are; no Jekyll processing
echo "assembled $mode site in $out ($(find "$out" -type f | wc -l) files)"
