#!/usr/bin/env python3
"""Validate the Capacitor Lens skill pack. Stdlib only."""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
LINK_RE = re.compile(r"\[[^\]]*]\(([^)]+)\)")
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)

REQUIRED = [
    "SKILL.md",
    "install.md",
    "implementation.md",
    "recipes.md",
    "settings-groups.md",
    "settings-catalog.md",
    "conflicts.md",
    "clarifications.md",
    "troubleshooting.md",
    "suggestions.md",
    "checklist.md",
    "parity.md",
    "sources.md",
    "templates/full.md",
    "templates/receipts.md",
    "templates/long-receipts.md",
    "templates/checks.md",
    "templates/credit-cards.md",
    "templates/business-cards.md",
    "templates/barcodes.md",
    "templates/ocr-code-strips.md",
    "templates/ocr-code-caps.md",
    "templates/w2.md",
    "templates/w9.md",
    "templates/any-documents.md",
]

PHRASES = [
    "veryfiInitLens",
    "setLensEventDelegate",
    "addListener",
    "veryfiLensUpdate",
    "src/web.ts",
    "call.resolve",
    "Unconfirmed",
    "packageID",
    "imageSourceTag",
    "@veryfi/veryfi-lens-capacitor",
    "2.0.61",
    "2.6.0.18",
    "veryfi-lens-spm.git",
    "3.0.16",
    "558244333860701fea3b933bc5cf9de2df8b3f50",
    "Headless",
    "Lite",
    "Remote Models",
    "showGallery",
    "getFileBase64",
    "backupDocsToGallery",
    "sdk_binary_sizes",
    "unsupported",
    "quick",
    "guided",
    "fraudDetectionIsOn",
    "documentFieldsToDetect",
    "userName",
    "definitions.ts",
    "no-op",
    "retrieveCheckTiffIsOn",
    "credit_card",
    "showInfoButton",
    "VeryfiInfoView",
]

SIBLING = re.compile(
    r"veryfi-lens-(ios|android|plugins|react-native|flutter|cordova|maui)-integrate"
)


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def markdown_files() -> list[Path]:
    return sorted(ROOT.rglob("*.md"))


def check_frontmatter(errors: list[str]) -> None:
    text = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(text)
    if not match:
        fail(errors, "SKILL.md is missing YAML frontmatter")
        return
    body = match.group(1)
    name = re.search(r"^name:\s*(\S+)\s*$", body, re.M)
    desc = re.search(r"^description:\s*>-\s*\n((?:  .+\n)+)", body, re.M)
    if not name or name.group(1) != "veryfi-lens-capacitor-integrate":
        fail(errors, "SKILL.md name must be veryfi-lens-capacitor-integrate")
    if not desc:
        fail(errors, "SKILL.md description must use a folded block")
    else:
        description = " ".join(line.strip() for line in desc.group(1).splitlines())
        if not description:
            fail(errors, "SKILL.md description is empty")
        if len(description) > 1024:
            fail(errors, "SKILL.md description exceeds 1024 characters")
        if description.startswith(("I ", "You ")):
            fail(errors, "SKILL.md description must be third person")
    line_count = text.count("\n") + (0 if text.endswith("\n") else 1)
    if line_count > 500:
        fail(errors, f"SKILL.md is {line_count} lines; keep it at or under 500")


def check_links(errors: list[str]) -> None:
    for source in markdown_files():
        text = source.read_text(encoding="utf-8")
        if SIBLING.search(text):
            fail(errors, f"{source.relative_to(ROOT)}: names another Lens skill pack")
        for raw in LINK_RE.findall(text):
            target = raw.strip().split()[0].strip("<>")
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            path_part = unquote(target.split("#", 1)[0])
            if not path_part:
                continue
            resolved = (source.parent / path_part).resolve()
            if not resolved.exists():
                fail(errors, f"{source.relative_to(ROOT)}: missing link {target}")
            elif ROOT.resolve() not in resolved.parents and resolved != ROOT.resolve():
                fail(errors, f"{source.relative_to(ROOT)}: link leaves this skill: {target}")


def check_phrases(errors: list[str]) -> None:
    blob = "\n".join(path.read_text(encoding="utf-8") for path in markdown_files())
    for phrase in PHRASES:
        if phrase not in blob:
            fail(errors, f"missing required phrase: {phrase}")
    if "configureWithCredentials" in blob:
        fail(errors, "React Native configureWithCredentials leaked into the Capacitor pack")
    if "NativeEventEmitter" in blob:
        fail(errors, "React Native NativeEventEmitter leaked into the Capacitor pack")
    engines = set(re.findall(r'dataExtractionEngine:\s*[\'"]([^\'"]+)[\'"]', blob))
    engines |= set(re.findall(r'"dataExtractionEngine"\s*:\s*"([^"]+)"', blob))
    if not engines <= {"api", "mobile", "none"}:
        fail(errors, f"unsupported engine strings: {sorted(engines - {'api', 'mobile', 'none'})}")
    if "headlessUpload" not in blob:
        fail(errors, "missing headlessUpload")
    if "uploadImages" not in blob:
        fail(errors, "missing uploadImages")
    if "no configure-ready signal" not in blob:
        fail(errors, "missing configure-ready warning")
    native_await = re.compile(
        r"await\s+VeryfiLensCapacitor\.(?!addListener\b)(\w+)"
    )
    for path in markdown_files():
        for match in native_await.finditer(path.read_text(encoding="utf-8")):
            fail(
                errors,
                f"{path.relative_to(ROOT)}: do not await native method "
                f"VeryfiLensCapacitor.{match.group(1)}",
            )


def check_source_tokens(errors: list[str]) -> None:
    definitions = Path(
        "/Users/veryfij/plugins/veryfi-lens-capacitor-plugin/veryfi-lens-capacitor/src/definitions.ts"
    )
    if not definitions.is_file():
        print(f"note: Capacitor source absent at {definitions}")
        return
    text = definitions.read_text(encoding="utf-8")
    for token in ("veryfiInitLens(", "setLensEventDelegate(", "showCamera("):
        if token not in text:
            fail(errors, f"pinned definitions.ts missing {token}")
    web = Path(
        "/Users/veryfij/plugins/veryfi-lens-capacitor-plugin/veryfi-lens-capacitor/src/web.ts"
    )
    if web.is_file() and "async showCamera" not in web.read_text(encoding="utf-8"):
        fail(errors, "web.ts no longer has an empty showCamera; update the skill")


def main() -> int:
    errors: list[str] = []
    for name in REQUIRED:
        if not (ROOT / name).is_file():
            fail(errors, f"missing {name}")
    if not errors:
        check_frontmatter(errors)
        check_links(errors)
        check_phrases(errors)
        check_source_tokens(errors)
    if errors:
        print("FAIL")
        for item in errors:
            print(f"- {item}")
        return 1
    print(f"OK: {len(markdown_files())} Markdown files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
