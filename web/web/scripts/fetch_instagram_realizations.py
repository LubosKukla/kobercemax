#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path


HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "x-ig-app-id": "936619743392459",
}

MONTHS_SK = {
    1: "januara",
    2: "februara",
    3: "marca",
    4: "aprila",
    5: "maja",
    6: "juna",
    7: "jula",
    8: "augusta",
    9: "septembra",
    10: "oktobra",
    11: "novembra",
    12: "decembra",
}

KEYWORD_MAP = [
    ("koberec", "Koberce"),
    ("koberce", "Koberce"),
    ("vinyl", "Vinyl"),
    ("podlaha", "Podlahy"),
    ("podlahy", "Podlahy"),
    ("schody", "Schody"),
    ("dvere", "Dvere"),
    ("rohoze", "Rohoze"),
    ("panel", "Panely"),
    ("showroom", "Showroom"),
    ("montaz", "Montaz"),
]


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_file(url: str, target: Path) -> None:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(resp.read())


def sanitize_text(text: str) -> str:
    text = text or ""
    text = re.sub(r"\s+", " ", text).strip()
    return text


def strip_hashtags(text: str) -> str:
    return sanitize_text(re.sub(r"#\w+", "", text))


def to_date_label(ts: int) -> str:
    d = dt.datetime.fromtimestamp(ts, dt.UTC).date()
    month = MONTHS_SK.get(d.month, "")
    return f"{d.day}. {month} {d.year}"


def pick_title(caption: str, date_label: str, code: str) -> str:
    for line in caption.splitlines():
        line = strip_hashtags(line)
        line = line.strip(" -–|")
        if len(line) >= 8:
            return line[:90].strip()
    return f"Instagram realizacia {date_label} ({code})"


def extract_tags(caption: str, date_label: str) -> list[str]:
    tags = ["Instagram realizacia"]
    lowered = caption.lower()
    for key, tag in KEYWORD_MAP:
        if key in lowered and tag not in tags:
            tags.append(tag)
    hashtags = re.findall(r"#([A-Za-z0-9_]+)", caption)
    for h in hashtags[:5]:
        normalized = h.replace("_", " ").strip()
        if normalized and normalized not in tags:
            tags.append(normalized)
    if date_label not in tags:
        tags.append(date_label)
    return tags


def ext_from_url(url: str, fallback: str = "jpg") -> str:
    path = urllib.parse.urlparse(url).path
    if "." in path:
        ext = path.rsplit(".", 1)[1].lower()
        if ext in {"jpg", "jpeg", "png", "webp"}:
            return "jpg" if ext == "jpeg" else ext
    return fallback


def extract_image_urls(item: dict) -> list[str]:
    media_type = item.get("media_type")
    urls: list[str] = []

    if media_type == 8 and isinstance(item.get("carousel_media"), list):
        for media in item["carousel_media"]:
            candidates = ((media.get("image_versions2") or {}).get("candidates")) or []
            if candidates:
                urls.append(candidates[0].get("url", ""))
    else:
        candidates = ((item.get("image_versions2") or {}).get("candidates")) or []
        if candidates:
            urls.append(candidates[0].get("url", ""))

    urls = [u for u in urls if u]
    dedup = []
    seen = set()
    for u in urls:
        if u in seen:
            continue
        seen.add(u)
        dedup.append(u)
    return dedup


def fetch_posts(username: str, max_posts: int) -> list[dict]:
    profile = fetch_json(
        f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
    )
    user_id = profile["data"]["user"]["id"]

    posts: list[dict] = []
    max_id = None
    while len(posts) < max_posts:
        url = f"https://www.instagram.com/api/v1/feed/user/{user_id}/?count=12"
        if max_id:
            url += f"&max_id={urllib.parse.quote(max_id)}"
        page = fetch_json(url)
        items = page.get("items", [])
        if not items:
            break
        posts.extend(items)
        if not page.get("more_available"):
            break
        max_id = page.get("next_max_id")
        if not max_id:
            break
    return posts[:max_posts]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Download Instagram posts as local realization candidates."
    )
    parser.add_argument("--username", default="kobercemax")
    parser.add_argument("--max-posts", type=int, default=60)
    parser.add_argument(
        "--public-root",
        default="web/web/public",
        help="Path to public directory",
    )
    parser.add_argument(
        "--output-json",
        default="web/web/src/data/realizations-instagram.json",
        help="Output JSON path",
    )
    args = parser.parse_args()

    public_root = Path(args.public_root).resolve()
    output_json = Path(args.output_json).resolve()
    base_dir = public_root / "img" / "realizations" / "instagram"
    base_dir.mkdir(parents=True, exist_ok=True)

    try:
        posts = fetch_posts(args.username, args.max_posts)
    except Exception as exc:
        print(f"Failed to fetch Instagram data: {exc}", file=sys.stderr)
        return 1

    results = []
    for idx, item in enumerate(posts, start=1):
        code = item.get("code")
        ts = int(item.get("taken_at") or 0)
        if not code or not ts:
            continue

        date_value = dt.datetime.fromtimestamp(ts, dt.UTC).date().isoformat()
        date_label = to_date_label(ts)
        caption = (item.get("caption") or {}).get("text") or ""
        caption_clean = sanitize_text(caption)
        excerpt = strip_hashtags(caption_clean)[:180].strip()
        summary = strip_hashtags(caption_clean)
        if not summary:
            summary = "Fotodokumentacia realizacie z Instagramu."
        title = pick_title(caption, date_label, code)
        tags = extract_tags(caption_clean, date_label)

        image_urls = extract_image_urls(item)
        if not image_urls:
            continue

        post_dir = base_dir / code
        cover_dir = post_dir / "cover"
        gallery_dir = post_dir / "gallery"
        cover_dir.mkdir(parents=True, exist_ok=True)
        gallery_dir.mkdir(parents=True, exist_ok=True)

        # Remove old files for deterministic updates.
        for path in gallery_dir.glob("*"):
            if path.is_file():
                path.unlink()

        cover_ext = ext_from_url(image_urls[0])
        cover_file = cover_dir / f"cover.{cover_ext}"
        try:
            download_file(image_urls[0], cover_file)
        except Exception:
            continue

        gallery_paths = []
        for gidx, img_url in enumerate(image_urls, start=1):
            ext = ext_from_url(img_url)
            file_name = f"{gidx:02d}.{ext}"
            target = gallery_dir / file_name
            try:
                download_file(img_url, target)
            except Exception:
                continue
            rel = "/" + str(target.relative_to(public_root)).replace(os.sep, "/")
            gallery_paths.append(rel)

        cover_rel = "/" + str(cover_file.relative_to(public_root)).replace(os.sep, "/")
        folder_rel = "/" + str(post_dir.relative_to(public_root)).replace(os.sep, "/") + "/"

        results.append(
            {
                "id": 900000 + idx,
                "slug": f"instagram-{code.lower()}",
                "title": title,
                "date": date_value,
                "dateLabel": date_label,
                "category": "Instagram realizacie",
                "wpPostId": None,
                "excerpt": excerpt or "Fotodokumentacia realizacie z Instagramu.",
                "summary": summary,
                "coverImage": cover_rel,
                "gallery": gallery_paths if gallery_paths else [cover_rel],
                "imageUploadFolder": folder_rel,
                "tags": tags,
                "instagramCode": code,
            }
        )

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(
        json.dumps(
            {
                "source": "instagram",
                "username": args.username,
                "generatedAt": dt.datetime.now(dt.UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "count": len(results),
                "realizations": results,
            },
            ensure_ascii=True,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"Saved {len(results)} Instagram candidates to {output_json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
