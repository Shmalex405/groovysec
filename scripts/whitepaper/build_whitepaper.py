#!/usr/bin/env python3
"""
Render scripts/whitepaper/WHITEPAPER.md to the public Security Whitepaper PDF.

Output lands at client/public/WHITEOUT_AI_WHITEPAPER.pdf, which vite copies
into dist/public and `npm run build:docs` publishes at
https://groovysec.com/WHITEOUT_AI_WHITEPAPER.pdf (linked from
/whiteout-ai/security-whitepaper).

House recipe (same toolchain as the platform repo's feature-doc builder —
no Python deps, Homebrew CLIs only):
  - pandoc     : Markdown (GFM) -> HTML fragment
  - weasyprint : HTML + CSS -> paged PDF (cover, ToC page numbers, footers)

This is an EXTERNAL document: footer says groovysec.com, not CONFIDENTIAL.

Usage:
  python3 scripts/whitepaper/build_whitepaper.py
"""
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(HERE, "WHITEPAPER.md")
OUT = os.path.join(ROOT, "client", "public", "WHITEOUT_AI_WHITEPAPER.pdf")
LOGO = os.path.join(HERE, "whiteout_logo.png")

VERSION = "Version 4.1 · July 2026"

# Brand palette shared with the platform marketing PDFs: blues #0f3a57 /
# #15598f / #1c8fc9, green #5a9e3f, orange #e08a1e. weasyprint-safe CSS
# (no flexbox/grid; explicit mm height on the cover — weasyprint ignores 100vh).
CSS = """
@page {
  size: Letter; margin: 20mm 16mm 18mm 16mm;
  @bottom-left   { content: "Whiteout AI \\2014 Security Whitepaper"; font-size: 7.5pt; color: #94a3b8; }
  @bottom-center { content: "groovysec.com"; font-size: 7pt; letter-spacing: 1.5px; color: #b3c2d1; }
  @bottom-right  { content: counter(page) " / " counter(pages); font-size: 7.5pt; color: #94a3b8; }
}
@page :first { margin: 0; @bottom-left{content:none;} @bottom-center{content:none;} @bottom-right{content:none;} }

* { box-sizing: border-box; }
html { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #243140; font-size: 9.6pt; line-height: 1.5; }
body { margin: 0; }
a { color: #15598f; text-decoration: none; }

/* ---- cover ---- */
.cover { height: 279mm; page-break-after: always; position: relative;
         background: linear-gradient(160deg, #ffffff 0%, #f4f9fc 55%, #eaf4fb 100%);
         padding: 34mm 22mm; }
.cover .topbar { height: 6px; background: linear-gradient(90deg,#15598f,#1c8fc9,#5a9e3f,#e08a1e);
                 position: absolute; top: 0; left: 0; right: 0; }
.cover img.logo { width: 74mm; margin-top: 4mm; }
.cover .doctype { margin-top: 78mm; font-size: 10pt; letter-spacing: 3px; text-transform: uppercase; color: #1c8fc9; font-weight: 700; }
.cover h1.cv { font-size: 29pt; line-height: 1.12; color: #0f3a57; margin: 5mm 0 4mm 0; font-weight: 800; letter-spacing: -0.5px; border: none; padding: 0; }
.cover .sub { font-size: 12.5pt; color: #486581; max-width: 152mm; }
.cover .badge { display: inline-block; margin-top: 8mm; padding: 5px 14px; border: 1.5px solid #1c8fc9; border-radius: 30px;
                color: #15598f; font-size: 9pt; font-weight: 700; letter-spacing: .5px; }
.cover .meta { position: absolute; left: 22mm; right: 22mm; bottom: 24mm; font-size: 9pt; color: #607d97;
               border-top: 1px solid #d6e4ef; padding-top: 5mm; }
.cover .meta b { color: #34495e; }

/* ---- headings ---- */
h1, h2, h3, h4 { font-family: inherit; color: #0f3a57; }
h1 { font-size: 19pt; font-weight: 800; margin: 0 0 2mm 0; }
h2 { font-size: 14.5pt; font-weight: 800; color: #0f3a57; margin: 9mm 0 2mm 0;
     padding-bottom: 2px; border-bottom: 2px solid #1c8fc9; break-after: avoid; }
h3 { font-size: 11.5pt; font-weight: 700; color: #15598f; margin: 6mm 0 1.5mm 0; break-after: avoid; }
h4 { font-size: 10pt; font-weight: 700; color: #1f3b52; margin: 4mm 0 1mm 0; }
p { margin: 1.6mm 0; }
hr { border: none; border-top: 1px solid #e3edf4; margin: 5mm 0; }

ul, ol { margin: 1.5mm 0; padding-left: 6mm; }
li { margin: 1.1mm 0; break-inside: avoid; }
li > strong:first-child { color: #1f3b52; }
li em, p em { color: #52677d; }

code { font-family: "SF Mono", "Menlo", Consolas, monospace; font-size: 8.4pt;
       background: #eef4f9; color: #1f3b52; padding: 0.3px 4px; border-radius: 3px; }

blockquote { background: #f3f9fd; border: 1px solid #d2e7f4; border-left: 4px solid #1c8fc9;
             border-radius: 4px; padding: 2.5mm 4mm; margin: 3mm 0; color: #34495e; font-size: 9.2pt; break-inside: avoid; }
blockquote p { margin: 1mm 0; }

img { max-width: 100%; height: auto; display: block; margin: 3mm auto; }

table { width: 100%; border-collapse: collapse; margin: 3mm 0; font-size: 8.6pt; break-inside: avoid; }
th { background: #15598f; color: #fff; text-align: left; padding: 1.8mm 2.4mm; font-weight: 700; font-size: 8pt; }
td { padding: 1.6mm 2.4mm; border-bottom: 1px solid #e3edf4; vertical-align: top; color: #3a4d5e; }
tr:nth-child(even) td { background: #f7fbfd; }
td strong, td b { color: #1f3b52; }

h2 + p, h3 + p { break-before: avoid; }

/* ---- table of contents ---- */
nav.toc { page-break-after: always; padding-top: 4mm; }
nav.toc .toc-h { font-size: 19pt; font-weight: 800; color: #0f3a57; margin: 0 0 1mm 0;
                 padding-bottom: 2mm; border-bottom: 2px solid #1c8fc9; }
nav.toc .toc-sub { font-size: 9pt; color: #7c8ea0; margin: 0 0 6mm 0; }
nav.toc ul { list-style: none; margin: 0; padding: 0; }
nav.toc li { margin: 0; padding: 2.6mm 0; font-size: 10.5pt; border-bottom: 1px solid #eef3f7; break-inside: avoid; }
nav.toc a { color: #15598f; font-weight: 600; display: block; }
nav.toc a::after { content: leader(". ") target-counter(attr(href), page);
                   color: #94a3b8; font-weight: 400; font-size: 9.5pt; }
"""


def need(tool):
    if shutil.which(tool) is None:
        sys.exit(f"ERROR: '{tool}' not found on PATH. Install via Homebrew (brew install {tool}).")


def md_to_fragment(md_text):
    need("pandoc")
    r = subprocess.run(
        ["pandoc", "-f", "gfm", "-t", "html", "--wrap=none"],
        input=md_text, capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.exit("pandoc failed:\n" + r.stderr)
    body = r.stdout
    body = re.sub(r"<h1[^>]*>.*?</h1>", "", body, count=1, flags=re.S)  # title lives on the cover
    return body


def make_toc(body_html):
    entries = re.findall(r'<h2[^>]*\sid="([^"]+)"[^>]*>(.*?)</h2>', body_html, flags=re.S)
    items = []
    for anchor, raw in entries:
        text = re.sub(r"<[^>]+>", "", raw).strip()
        items.append(f'<li><a href="#{anchor}">{text}</a></li>')
    return (
        '<nav class="toc">'
        '<div class="toc-h">Contents</div>'
        '<div class="toc-sub">Whiteout AI — Enterprise AI Security &amp; Compliance Whitepaper</div>'
        "<ul>" + "".join(items) + "</ul></nav>"
    )


def make_cover():
    return f"""
    <div class="cover">
      <div class="topbar"></div>
      <img class="logo" src="file://{LOGO}"/>
      <div class="doctype">Security Whitepaper</div>
      <h1 class="cv">Enterprise AI<br/>Security &amp; Compliance</h1>
      <div class="sub">How Whiteout AI enables organizations to safely adopt generative AI —
      real-time semantic policy enforcement with 99.59% validated accuracy, coverage across browser,
      desktop, IDE, infrastructure, mobile and MCP, prompt-injection defense for agentic tools,
      and a complete, exportable audit trail.</div>
      <div class="badge">{VERSION}</div>
      <div class="meta">Whiteout AI &mdash; an AI governance &amp; security platform by <b>Groovy Security</b>
      &nbsp;&middot;&nbsp; groovysec.com</div>
    </div>
    """


def main():
    if not os.path.exists(SRC):
        sys.exit(f"ERROR: {SRC} not found.")
    if not os.path.exists(LOGO):
        sys.exit(f"ERROR: {LOGO} not found.")
    need("weasyprint")
    md = open(SRC, encoding="utf-8").read()
    body = md_to_fragment(md)
    html = (
        "<!DOCTYPE html><html><head><meta charset='utf-8'>"
        "<title>Whiteout AI — Enterprise AI Security &amp; Compliance Whitepaper</title>"
        f"<style>{CSS}</style></head><body>{make_cover()}{make_toc(body)}{body}</body></html>"
    )
    tmp = os.path.join(HERE, "whitepaper.render.html")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(html)
    try:
        r = subprocess.run(["weasyprint", "-e", "utf-8", tmp, OUT], capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit("weasyprint failed:\n" + r.stderr)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
    print(f"wrote {OUT}  ({os.path.getsize(OUT):,} bytes)")


if __name__ == "__main__":
    main()
