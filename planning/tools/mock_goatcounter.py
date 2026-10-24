"""Mock of the two GoatCounter endpoints the fetcher uses, with bearer auth and pagination."""
import json, sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
PAGES = [
  {"stats": [{"id": "US", "name": "United States", "count": 412}, {"id": "BD", "name": "Bangladesh", "count": 96}, {"id": "IN", "name": "India", "count": 41}], "more": True},
  {"stats": [{"id": "DE", "name": "Germany", "count": 18}, {"id": "CY", "name": "Cyprus", "count": 7}, {"id": "(unknown)", "name": "(unknown)", "count": 3}], "more": False},
]
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.headers.get('Authorization') != 'Bearer test-token':
            self.send_response(401); self.end_headers(); self.wfile.write(b'{"error":"unauthorized"}'); return
        u = urlparse(self.path); q = parse_qs(u.query)
        if 'start' not in q: self.send_response(400); self.end_headers(); return
        if u.path == '/api/v0/stats/total': body = {"total": 577, "total_events": 0, "total_utc": 577, "stats": []}
        elif u.path == '/api/v0/stats/locations': body = PAGES[min(int(q.get('offset', ['0'])[0]) // 100, 1)]
        else: self.send_response(404); self.end_headers(); return
        self.send_response(200); self.send_header('Content-Type', 'application/json'); self.end_headers(); self.wfile.write(json.dumps(body).encode())
HTTPServer(('127.0.0.1', int(sys.argv[1])), H).serve_forever()
