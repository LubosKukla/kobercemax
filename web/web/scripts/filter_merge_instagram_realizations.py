#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import re
import shutil
import unicodedata
from pathlib import Path


POS_STRONG = [
    "realiz",
    "pokladk",
    "montaz",
    "lepen",
    "niveliz",
    "schod",
    "hotel",
    "kancelar",
    "medicentrum",
    "kostol",
    "apartman",
    "rodinny dom",
]

POS_WEAK = [
    "vinyl",
    "pvc",
    "koberec",
    "koberce",
    "podlaha",
    "podlahy",
    "dvere",
    "rohoze",
    "obklad",
    "terasa",
    "garaz",
    "fitko",
]

NEGATIVE = [
    "showroom",
    "vzorkovnik",
    "vzorky",
    "predajni",
    "pridte sa pozriet",
    "otvaracie hodiny",
    "po-pi",
    "po pi",
    "rychly prelet predajnou",
    "pozri ponuku",
    "listujete",
    "porovnavate",
    "novinka",
    "akcia",
    "najdes vsetko",
    "vsetko na jednom mieste",
    "plavisko",
    "044 /",
    "044/",
    "kontaktujte nas",
]

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

GENERIC_PATTERNS = [
    "fotodokumentacia realizacie z instagramu",
    "instagram realizacia",
]

REALIZATION_EVIDENCE = [
    "realiz",
    "pokladk",
    "montaz",
    "lepen",
    "schod",
    "obklad",
    "odovzdan",
    "ukonc",
    "na mieru",
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


def clean_caption(caption: str) -> str:
    text = caption or ""
    text = re.sub(r"#\w+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def date_label(date_value: str) -> str:
    d = dt.date.fromisoformat(date_value)
    months = [
        "",
        "januara",
        "februara",
        "marca",
        "aprila",
        "maja",
        "juna",
        "jula",
        "augusta",
        "septembra",
        "oktobra",
        "novembra",
        "decembra",
    ]
    return f"{d.day}. {months[d.month]} {d.year}"


def score_caption(caption: str) -> int:
    text = normalize(caption)
    score = 0

    for token in POS_STRONG:
        if token in text:
            score += 3

    for token in POS_WEAK:
        if token in text:
            score += 1

    for token in NEGATIVE:
        if token in text:
            score -= 2

    if "predajna" in text and "realiz" not in text and "pokladk" not in text:
        score -= 3

    return score


def keep_item(item: dict) -> bool:
    caption = (item.get("summary") or "") + " " + (item.get("excerpt") or "")
    title = item.get("title") or ""
    source = normalize(f"{title} {caption}")

    if any(pattern in source for pattern in GENERIC_PATTERNS):
        return False

    has_evidence = any(token in source for token in REALIZATION_EVIDENCE)
    if not has_evidence:
        return False

    has_product_context = any(token in source for token, _ in MATERIAL_FEATURES) or any(
        token in source for token, _ in WORK_FEATURES
    )
    if not has_product_context:
        return False

    score = score_caption(caption)
    return score >= 3


def detect_features(text: str, tags: list[str] | None = None) -> dict:
    source = normalize(f"{text} {' '.join(tags or [])}")

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


def build_tags(caption: str, date_lbl: str) -> list[str]:
    norm = normalize(caption)
    tags = ["Instagram", "Realizacia"]

    for needle, label in KEYWORD_TAGS:
        if needle in norm and label not in tags:
            tags.append(label)

    # Keep concise, always include date.
    tags = tags[:7]
    if date_lbl not in tags:
        tags.append(date_lbl)
    return tags


def main() -> int:
    parser = argparse.ArgumentParser(description="Filter IG candidates and merge into realizations.json")
    parser.add_argument(
        "--ig-json",
        default="web/web/src/data/realizations-instagram.json",
    )
    parser.add_argument(
        "--main-json",
        default="web/web/src/data/realizations.json",
    )
    parser.add_argument(
        "--instagram-assets-dir",
        default="web/web/public/img/realizations/instagram",
    )
    args = parser.parse_args()

    ig_path = Path(args.ig_json).resolve()
    main_path = Path(args.main_json).resolve()
    assets_dir = Path(args.instagram_assets_dir).resolve()

    ig_data = json.loads(ig_path.read_text(encoding="utf-8"))
    main_data = json.loads(main_path.read_text(encoding="utf-8"))

    raw_items = ig_data.get("realizations", [])
    selected = []
    selected_dirs = set()

    for item in raw_items:
        caption_source = " ".join(
            part
            for part in [item.get("title") or "", item.get("summary") or "", item.get("excerpt") or ""]
            if part
        )
        if not keep_item(item):
            continue

        date_lbl = item.get("dateLabel") or date_label(item["date"])
        features = detect_features(caption_source, item.get("tags") or [])
        title = choose_title(features)
        excerpt, summary = build_excerpt_and_summary(features)
        tags = build_tags(caption_source, date_lbl)

        merged_item = {
            "id": item["id"],
            "slug": item["slug"],
            "title": title,
            "date": item["date"],
            "dateLabel": date_lbl,
            "category": "Instagram realizacie",
            "wpPostId": None,
            "excerpt": excerpt,
            "summary": summary,
            "coverImage": item["coverImage"],
            "gallery": item.get("gallery", []),
            "imageUploadFolder": item["imageUploadFolder"],
            "tags": tags,
            "instagramCode": item.get("instagramCode"),
        }
        selected.append(merged_item)

        rel = item["coverImage"].lstrip("/")
        parts = Path(rel).parts
        if len(parts) >= 4:
            selected_dirs.add(parts[3])

    # Rewrite instagram candidates JSON with filtered set only.
    filtered_ig = {
        "source": "instagram",
        "username": ig_data.get("username", "kobercemax"),
        "generatedAt": dt.datetime.now(dt.UTC).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(selected),
        "realizations": selected,
    }
    ig_path.write_text(json.dumps(filtered_ig, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Merge into main realizations: keep non-instagram + filtered instagram.
    base = [r for r in main_data.get("realizations", []) if not str(r.get("slug", "")).startswith("instagram-")]
    merged = base + selected
    merged.sort(key=lambda r: (r.get("date", ""), int(r.get("id", 0))), reverse=True)
    main_out = {"realizations": merged}
    main_path.write_text(json.dumps(main_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Remove unselected instagram asset folders.
    if assets_dir.exists():
        for child in assets_dir.iterdir():
            if not child.is_dir():
                continue
            if child.name not in selected_dirs:
                shutil.rmtree(child)

    print(
        f"Filtered {len(raw_items)} IG candidates -> kept {len(selected)} realizations; merged into {main_path}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
