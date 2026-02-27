#!/usr/bin/env python3
import argparse
import datetime as dt
import html
import json
import re
import urllib.parse
import urllib.request
import unicodedata
from pathlib import Path

import instaloader


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

KEYWORD_TAGS = [
    ("vinyl", "Vinyl"),
    ("pvc", "PVC"),
    ("koberec", "Koberce"),
    ("koberce", "Koberce"),
    ("podlah", "Podlahy"),
    ("schod", "Schody"),
    ("dvere", "Dvere"),
    ("rohoz", "Rohoze"),
    ("hotel", "Hotel"),
    ("kancelar", "Kancelarie"),
    ("skola", "Skola"),
    ("montaz", "Montaz"),
    ("pokladk", "Pokladka"),
]

MATERIAL_FEATURES = [
    ("vinyl", "Vinyl"),
    ("pvc", "PVC"),
    ("koberc", "Koberce"),
    ("laminat", "Laminat"),
    ("kompozit", "Kompozit"),
    ("dreven", "Drevene podlahy"),
    ("rohoz", "Rohoze"),
    ("podlah", "Podlahy"),
]

WORK_FEATURES = [
    ("schod", "Schody"),
    ("pokladk", "Pokladka"),
    ("montaz", "Montaz"),
    ("lepen", "Lepeny system"),
    ("priprava podkladu", "Priprava podkladu"),
    ("niveliz", "Nivelizacia"),
    ("brusen", "Brusenie"),
    ("penetro", "Penetracia"),
]

SPACE_FEATURES = [
    ("hotel", "Hotel"),
    ("apartman", "Apartman"),
    ("kancelar", "Kancelarie"),
    ("skol", "Skola"),
    ("telocvic", "Telocvicna"),
    ("fitk", "Fitko"),
    ("garaz", "Garaz"),
    ("kostol", "Kostol"),
    ("medicentrum", "Medicentrum"),
    ("rodinny dom", "Rodinny dom"),
    ("domacnost", "Domacnost"),
]


def normalize(text: str) -> str:
    raw = text or ""
    lowered = raw.lower()
    deacc = "".join(ch for ch in unicodedata.normalize("NFKD", lowered) if not unicodedata.combining(ch))
    deacc = re.sub(r"\s+", " ", deacc).strip()
    return deacc


def date_label(date_value: dt.date) -> str:
    return f"{date_value.day}. {MONTHS_SK[date_value.month]} {date_value.year}"


def detect_features(text: str) -> dict:
    source = normalize(text)
    materials = [label for token, label in MATERIAL_FEATURES if token in source]
    if len(materials) > 1 and "Podlahy" in materials:
        materials = [m for m in materials if m != "Podlahy"]
    works = [label for token, label in WORK_FEATURES if token in source]
    spaces = [label for token, label in SPACE_FEATURES if token in source]
    return {
        "materials": list(dict.fromkeys(materials)),
        "works": list(dict.fromkeys(works)),
        "spaces": list(dict.fromkeys(spaces)),
        "has_schody": "schod" in source,
        "has_vinyl": "vinyl" in source,
        "has_pvc": "pvc" in source,
        "has_koberec": "koberc" in source,
        "has_podlahy": "podlah" in source,
        "has_drevo": "drev" in source,
    }


def choose_title(features: dict) -> str:
    if features["has_schody"] and features["has_koberec"]:
        return "Kobercové schody"
    if features["has_schody"] and features["has_vinyl"]:
        return "Vinylové schody"
    if features["has_schody"] and features["has_pvc"]:
        return "Schody z PVC"
    if features["has_schody"] and features["has_drevo"]:
        return "Drevené schody"
    if features["has_schody"]:
        return "Schodisková realizácia"
    if features["has_koberec"] and "Hotel" in features["spaces"]:
        return "Hotelová kobercová realizácia"
    if features["has_koberec"]:
        return "Pokládka koberca"
    if features["has_vinyl"]:
        return "Pokládka vinylovej podlahy"
    if features["has_pvc"]:
        return "Pokládka PVC podlahy"
    if features["has_podlahy"]:
        return "Realizácia podlahy"
    return "Interiérová realizácia"


def space_phrase(spaces: list[str]) -> str:
    if not spaces:
        return "v interiéri"
    value = spaces[0]
    mapping = {
        "Hotel": "v hotelovom priestore",
        "Apartman": "v apartmáne",
        "Kancelarie": "v kancelárskych priestoroch",
        "Skola": "v školskom prostredí",
        "Telocvicna": "v telocvični",
        "Fitko": "vo fitness priestore",
        "Garaz": "v garáži",
        "Kostol": "v kostole",
        "Medicentrum": "v zdravotníckom priestore",
        "Rodinny dom": "v rodinnom dome",
        "Domacnost": "v domácnosti",
    }
    return mapping.get(value, "v interiéri")


def build_excerpt_and_summary(features: dict) -> tuple[str, str]:
    place = space_phrase(features["spaces"])

    if features["has_schody"] and features["has_koberec"]:
        work = "obklad schodiska kobercom"
    elif features["has_schody"] and features["has_vinyl"]:
        work = "obklad schodiska vinylom"
    elif features["has_schody"] and features["has_pvc"]:
        work = "obklad schodiska PVC materiálom"
    elif features["has_schody"]:
        work = "realizáciu schodiska"
    elif features["has_koberec"]:
        work = "pokládku koberca"
    elif features["has_vinyl"]:
        work = "pokládku vinylovej podlahy"
    elif features["has_pvc"]:
        work = "pokládku PVC podlahy"
    else:
        work = "pokládku podlahy"

    if features["materials"]:
        mat_core = ", ".join(features["materials"][:2]).lower()
        material_sentence = f"Použitý bol materiál typu {mat_core}, prispôsobený na konkrétne zaťaženie priestoru."
    else:
        material_sentence = "Materiál sme zvolili podľa typu prevádzky a požiadaviek na odolnosť aj údržbu."

    if features["has_schody"]:
        if work.startswith("realizáciu schodiska"):
            excerpt = f"Realizovali sme schodisko {place}, s dôrazom na presné napojenia a čistý detail."
        else:
            excerpt = f"Realizácia schodiska zahŕňala {work} {place}, s dôrazom na presné napojenia a čistý detail."
    elif features["has_koberec"]:
        excerpt = f"V tejto zákazke sme riešili {work} {place} s dôrazom na komfort, odolnosť a jednoduchú údržbu."
    else:
        excerpt = f"Projekt zahŕňal {work} {place} s dôrazom na presné spracovanie a dlhodobú životnosť povrchu."

    summary = (
        f"V tejto realizácii sme zabezpečili {work} {place}. "
        f"{material_sentence} "
        "Dôsledne sme riešili hrany, prechody a finálne napojenia, aby bol výsledok funkčný, odolný a vizuálne čistý."
    )
    return excerpt, summary


def build_tags(text: str, date_lbl: str) -> list[str]:
    norm = normalize(text)
    tags = ["Instagram", "Realizacia"]
    for needle, label in KEYWORD_TAGS:
        if needle in norm and label not in tags:
            tags.append(label)
    tags = tags[:7]
    tags.append(date_lbl)
    return tags


def extract_extension(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    ext = Path(path).suffix.lower().lstrip(".")
    if ext == "jpeg":
        ext = "jpg"
    if ext not in {"jpg", "png", "webp"}:
        ext = "jpg"
    return ext


def download(url: str, out: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(resp.read())


def fetch_post(context: instaloader.InstaloaderContext, code: str) -> tuple[dt.date, str, list[str]]:
    post = instaloader.Post.from_shortcode(context, code)
    caption = html.unescape((post.caption or "").strip())
    date_value = post.date_utc.date()

    image_urls: list[str] = []
    if post.typename == "GraphSidecar":
        for node in post.get_sidecar_nodes():
            if node.is_video:
                continue
            image_urls.append(node.display_url)
    else:
        if not post.is_video:
            image_urls.append(post.url)

    dedup = []
    seen = set()
    for url in image_urls:
        base = urllib.parse.urlparse(url).path
        if base in seen:
            continue
        seen.add(base)
        dedup.append(url)

    if not dedup:
        raise RuntimeError(f"No image URLs for shortcode {code}")
    return date_value, caption, dedup


def main() -> int:
    parser = argparse.ArgumentParser(description="Add selected Instagram shortcodes into realizations data.")
    parser.add_argument("--codes", nargs="+", required=True)
    parser.add_argument("--main-json", default="web/web/src/data/realizations.json")
    parser.add_argument("--ig-json", default="web/web/src/data/realizations-instagram.json")
    parser.add_argument("--public-root", default="web/web/public")
    args = parser.parse_args()

    main_path = Path(args.main_json).resolve()
    ig_path = Path(args.ig_json).resolve()
    public_root = Path(args.public_root).resolve()
    ig_assets = public_root / "img" / "realizations" / "instagram"
    ig_assets.mkdir(parents=True, exist_ok=True)

    main_data = json.loads(main_path.read_text(encoding="utf-8"))
    ig_data = json.loads(ig_path.read_text(encoding="utf-8"))

    main_items = main_data.get("realizations", [])
    ig_items = ig_data.get("realizations", [])

    existing_codes = {
        (item.get("instagramCode") or "").strip()
        for item in main_items
        if item.get("category") == "Instagram realizacie"
    }

    max_id = max([int(item.get("id", 900000)) for item in main_items] + [900000])
    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
    )

    added = []
    skipped = []
    for code in args.codes:
        code = code.strip()
        if not code:
            continue
        if code in existing_codes:
            skipped.append((code, "already exists"))
            continue

        try:
            date_value, caption, urls = fetch_post(loader.context, code)
        except Exception as exc:
            skipped.append((code, f"fetch failed: {exc}"))
            continue

        post_dir = ig_assets / code
        cover_dir = post_dir / "cover"
        gallery_dir = post_dir / "gallery"
        cover_dir.mkdir(parents=True, exist_ok=True)
        gallery_dir.mkdir(parents=True, exist_ok=True)
        for f in gallery_dir.glob("*"):
            if f.is_file():
                f.unlink()

        gallery_paths = []
        for idx, url in enumerate(urls, start=1):
            ext = extract_extension(url)
            target = gallery_dir / f"{idx:02d}.{ext}"
            try:
                download(url, target)
            except Exception:
                continue
            gallery_paths.append("/" + str(target.relative_to(public_root)).replace("\\", "/"))

        if not gallery_paths:
            skipped.append((code, "image download failed"))
            continue

        first_ext = Path(gallery_paths[0]).suffix
        cover_target = cover_dir / f"cover{first_ext}"
        try:
            download(urls[0], cover_target)
        except Exception:
            # fallback to first gallery image if direct cover download fails
            cover_target.write_bytes((public_root / gallery_paths[0].lstrip("/")).read_bytes())

        cover_path = "/" + str(cover_target.relative_to(public_root)).replace("\\", "/")
        date_lbl = date_label(date_value)
        source_text = caption or code
        features = detect_features(source_text)
        title = choose_title(features)
        excerpt, summary = build_excerpt_and_summary(features)
        tags = build_tags(source_text, date_lbl)

        max_id += 1
        item = {
            "id": max_id,
            "slug": f"instagram-{code.lower()}",
            "title": title,
            "date": date_value.isoformat(),
            "dateLabel": date_lbl,
            "category": "Instagram realizacie",
            "wpPostId": None,
            "excerpt": excerpt,
            "summary": summary,
            "coverImage": cover_path,
            "gallery": gallery_paths,
            "imageUploadFolder": "/" + str(post_dir.relative_to(public_root)).replace("\\", "/") + "/",
            "tags": tags,
            "instagramCode": code,
        }
        main_items.append(item)
        ig_items.append(item)
        existing_codes.add(code)
        added.append(code)

    main_items.sort(key=lambda r: (r.get("date", ""), int(r.get("id", 0))), reverse=True)
    ig_items.sort(key=lambda r: (r.get("date", ""), int(r.get("id", 0))), reverse=True)

    main_path.write_text(json.dumps({"realizations": main_items}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ig_out = {
        "source": "instagram",
        "username": ig_data.get("username", "kobercemax"),
        "generatedAt": dt.datetime.now(dt.UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(ig_items),
        "realizations": ig_items,
    }
    ig_path.write_text(json.dumps(ig_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Added {len(added)} posts: {', '.join(added) if added else '-'}")
    if skipped:
        print("Skipped:")
        for code, reason in skipped:
            print(f"- {code}: {reason}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
