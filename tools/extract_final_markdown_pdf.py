from __future__ import annotations

import re
import sys
from pathlib import Path

from pypdf import PdfReader


BEGIN = "BEGIN_FINAL_" + "MARKDOWN"
END = "END_FINAL_" + "MARKDOWN"


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def clean_pdf_artifacts(text: str) -> str:
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if re.fullmatch(r"\d{1,3}", line.strip()):
            continue
        if line.strip() == "\u2022":
            continue
        lines.append(line)
    return "\n".join(lines).strip() + "\n"


def extract_markdown(path: Path) -> str:
    text = extract_pdf_text(path)
    match = re.search(
        rf"^{BEGIN}\s*\n(?P<body># .+?)^{END}\s*$",
        text,
        flags=re.DOTALL | re.MULTILINE,
    )
    if not match:
        raise ValueError("Final markdown boundary markers were not found")

    markdown = match.group("body")
    return clean_pdf_artifacts(markdown)


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: extract_final_markdown_pdf.py SOURCE.pdf [OUT.md]", file=sys.stderr)
        return 2

    markdown = extract_markdown(Path(sys.argv[1]))
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(markdown, encoding="utf-8", newline="\n")
    else:
        print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
