#!/usr/bin/env python3
"""Non-deploying static quality gate for the current That’s My Lingo HTML shell."""
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_depth = 0
        self.title_text = []
        self.inline_scripts = []
        self.current_script = None
        self.ids = set()
        self.duplicate_ids = []
        self.asset_refs = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.duplicate_ids.append(attrs["id"])
            self.ids.add(attrs["id"])
        if tag == "title":
            self.title_depth += 1
        if tag == "script" and not attrs.get("src") and attrs.get("type", "").lower() not in ("application/ld+json", "application/json"):
            self.current_script = []
        for key in ("src", "href"):
            value = attrs.get(key, "")
            if value and not value.startswith(("http://", "https://", "data:", "#", "mailto:", "tel:", "javascript:")):
                if value.startswith("/") and not value.startswith("/_vercel/"):
                    self.asset_refs.append(value)
    def handle_endtag(self, tag):
        if tag == "title" and self.title_depth:
            self.title_depth -= 1
        if tag == "script" and self.current_script is not None:
            self.inline_scripts.append("".join(self.current_script))
            self.current_script = None
    def handle_data(self, data):
        if self.title_depth:
            self.title_text.append(data)
        if self.current_script is not None:
            self.current_script.append(data)

def fail(message):
    print("FAIL:", message)
    sys.exit(1)

if not HTML.exists():
    fail("index.html not found")
source = HTML.read_text(encoding="utf-8")
parser = AuditParser()
try:
    parser.feed(source)
    parser.close()
except Exception as exc:
    fail(f"HTML parse failed: {exc}")
if not "".join(parser.title_text).strip():
    fail("document title is missing")
if parser.duplicate_ids:
    fail("duplicate IDs: " + ", ".join(sorted(set(parser.duplicate_ids))))
missing = []
for ref in parser.asset_refs:
    # Root-relative local paths should resolve within the repo's public web root or root.
    candidates = [ROOT / ref.lstrip("/"), ROOT / "public" / ref.lstrip("/")]
    if not any(candidate.exists() for candidate in candidates):
        missing.append(ref)
if missing:
    fail("missing root-relative assets: " + ", ".join(sorted(set(missing))))
node = shutil.which("node")
if parser.inline_scripts and not node:
    fail("inline JavaScript exists but Node.js is unavailable for syntax validation")
for index, script in enumerate(parser.inline_scripts, 1):
    if not script.strip():
        continue
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as handle:
        handle.write(script)
        temp_path = Path(handle.name)
    try:
        result = subprocess.run([node, "--check", str(temp_path)], capture_output=True, text=True, timeout=30)
        if result.returncode:
            fail(f"inline script {index} syntax error: {result.stderr.strip()}")
    finally:
        temp_path.unlink(missing_ok=True)
print(f"PASS: HTML parsed; title present; {len(parser.ids)} unique IDs; {len(parser.inline_scripts)} inline script blocks checked; {len(parser.asset_refs)} root-relative references checked.")
print("NOTE: This is static validation only; it is not browser QA, game-math certification, backend validation, or production authorization.")
