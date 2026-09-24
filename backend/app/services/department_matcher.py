"""Maps free-text department names (from AI or the user) to real Department rows."""
import re
from typing import Optional

from sqlalchemy.orm import Session

from app.models.models import Department

DEFAULT_DEPARTMENT = "General Medicine"

# Common AI / user wordings -> canonical seeded department names.
SYNONYMS = {
    "Emergency": [
        "emergency", "er", "a&e", "accident", "casualty", "trauma", "urgent care", "critical",
    ],
    "Cardiology": ["cardio", "cardiac", "heart", "cardiovascular"],
    "Orthopedics": [
        "ortho", "orthopaedic", "bone", "joint", "fracture", "musculoskeletal", "spine", "sports",
    ],
    "Pediatrics": ["pediatric", "paediatric", "child", "children", "infant", "neonat", "kids"],
    "General Medicine": [
        "general", "internal medicine", "family medicine", "primary care", "gp", "outpatient", "opd",
    ],
}


def _norm(text: str) -> str:
    return re.sub(r"[^a-z0-9& ]+", " ", (text or "").lower()).strip()


def resolve_department(db: Session, name: Optional[str]) -> Optional[Department]:
    departments = db.query(Department).all()
    if not departments:
        return None
    by_norm = {_norm(d.name): d for d in departments}
    default = by_norm.get(_norm(DEFAULT_DEPARTMENT)) or departments[0]

    key = _norm(name or "")
    if not key:
        return default

    # 1. Exact (case/punctuation-insensitive)
    if key in by_norm:
        return by_norm[key]

    # 2. Partial containment either way ("Cardiology Department", "Ortho")
    for norm_name, dep in by_norm.items():
        if norm_name in key or key in norm_name:
            return dep

    # 3. Synonyms
    for canonical, words in SYNONYMS.items():
        dep = by_norm.get(_norm(canonical))
        if not dep:
            continue
        for w in words:
            if re.search(rf"(^|\s){re.escape(w)}", key):
                return dep

    return default
