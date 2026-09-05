#!/usr/bin/env python3
"""Serve the exported artifact locally, including a GitHub Pages base path."""

import argparse
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

OUTPUT = Path(__file__).resolve().parent.parent / "out"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--port", type=int, default=4187)
parser.add_argument("--host", default="127.0.0.1")
parser.add_argument("--base-path", default=None)
args = parser.parse_args()
if not (OUTPUT / "index.html").is_file():
    parser.error("Static output is missing. Run npm run build first.")
metadata = json.loads((OUTPUT / "build-info.json").read_text())
base_path = args.base_path if args.base_path is not None else metadata.get("basePath", "")
base_path = "/" + base_path.strip("/") if base_path.strip("/") else ""


class StaticHandler(SimpleHTTPRequestHandler):
    def send_header(self, keyword, value):
        if keyword.lower() == "location" and base_path and value.startswith("/"):
            if not value.startswith(base_path + "/"):
                value = base_path + value
        super().send_header(keyword, value)

    def send_head(self):
        original = self.path
        path = urlsplit(original).path
        if base_path and path in ("/", base_path):
            self.send_response(302)
            self.send_header("Location", base_path + "/")
            self.end_headers()
            return None
        if base_path and not path.startswith(base_path + "/"):
            self.send_error(404, "Outside the configured static base path")
            return None
        self.path = original[len(base_path):] if base_path else original
        try:
            return super().send_head()
        finally:
            self.path = original

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


server = ThreadingHTTPServer((args.host, args.port), partial(StaticHandler, directory=str(OUTPUT)))
print(f"Static preview: http://{args.host}:{args.port}{base_path}/", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
