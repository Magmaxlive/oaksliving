#!/usr/bin/env python3
"""
Download project gallery images from oaksliving.co.nz/portfolio/ (Elementor
galleries) into images/<Project>/ by filename prefix (CR, WN, KDTR, KDAPT, SW, RS).
Skips files that already exist with non-zero size.
"""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = Path(tempfile.gettempdir()) / "oaksliving_portfolio_mirror.html"
BASE = "https://oaksliving.co.nz"

UA = "Mozilla/5.0 (compatible; OaksLivingMirror/1.0; +https://oaksliving.co.nz/)"


def project_dir_for_filename(name: str) -> str | None:
    """Map wp upload basename to images subfolder name."""
    n = name.upper()
    if re.search(r"\d+CR[_-]", n) or "_CR_" in n or n.startswith("CR"):
        return "Coronation Garden"
    if re.search(r"\d+WN[_-]", n) or "_WN_" in n:
        return "Wainui Terraces"
    if "KDAPT" in n:
        return "Kenderdine Apartment"
    if "KDTR" in n or "KDTD" in n:
        return "Kenderdine Terraces"
    if re.search(r"\d+SW[_-]", n) or "_SW_" in n:
        return "Swanson Terraces"
    if re.search(r"\d+RS[_-]", n) or "_RS_" in n:
        return "Russell Terraces"
    return None


def gallery_urls(html: str) -> list[str]:
    pat = re.compile(
        r'class="e-gallery-item[^"]*" href="(https://oaksliving\.co\.nz/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"',
        re.I,
    )
    return pat.findall(html)


def download(url: str, dest: Path) -> str:
    """Use curl (system trust store) — Python urllib SSL can fail on some macOS setups."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return "skip"
    r = subprocess.run(
        [
            "curl",
            "-fsL",
            "--connect-timeout",
            "30",
            "--max-time",
            "120",
            "-A",
            UA,
            "-o",
            str(dest),
            url,
        ],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size == 0:
        raise RuntimeError(r.stderr or r.stdout or f"curl exit {r.returncode}")
    return "ok"


def main() -> int:
    if not HTML.exists():
        print("Fetching portfolio HTML…")
        subprocess.run(
            [
                "curl",
                "-fsL",
                "-A",
                UA,
                "-o",
                str(HTML),
                f"{BASE}/portfolio/",
            ],
            check=True,
        )
    html = HTML.read_text(errors="replace")
    urls = list(dict.fromkeys(gallery_urls(html)))
    urls = [
        u
        for u in urls
        if project_dir_for_filename(u.rsplit("/", 1)[-1].split("?", 1)[0]) is not None
    ]

    stats = {"ok": 0, "skip": 0, "fail": 0}

    def handle(url: str, subdir: str | None, fname: str | None = None) -> None:
        if subdir is None:
            print("skip unmapped:", url)
            stats["fail"] += 1
            return
        name = fname or url.rsplit("/", 1)[-1]
        name = name.split("?", 1)[0]
        dest = ROOT / "images" / subdir / name
        try:
            st = download(url, dest)
            stats[st] += 1
            print(st, dest.relative_to(ROOT))
        except Exception as e:
            stats["fail"] += 1
            print("FAIL", url, e, file=sys.stderr)

    for url in urls:
        fname = url.rsplit("/", 1)[-1].split("?", 1)[0]
        sub = project_dir_for_filename(fname)
        handle(url, sub)

    print("done:", stats)
    return 0 if stats["fail"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
