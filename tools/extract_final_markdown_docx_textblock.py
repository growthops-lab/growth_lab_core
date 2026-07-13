from __future__ import annotations

import re
import sys
from pathlib import Path

from docx import Document


BEGIN = "BEGIN_FINAL_" + "MARKDOWN"
END = "END_FINAL_" + "MARKDOWN"


def normalize_text(text: str) -> str:
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    return text


def extract_markdown(path: Path) -> str:
    document = Document(str(path))
    text = "\n".join(normalize_text(paragraph.text) for paragraph in document.paragraphs)
    match = re.search(
        rf"^{BEGIN}\s*\n(?P<body># .+?)^{END}\s*$",
        text,
        flags=re.DOTALL | re.MULTILINE,
    )
    if not match:
        raise ValueError("Final Markdown block was not found")
    return match.group("body").strip() + "\n"


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: extract_final_markdown_docx_textblock.py SOURCE.docx [OUT.md]", file=sys.stderr)
        return 2
    markdown = extract_markdown(Path(sys.argv[1]))
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(markdown, encoding="utf-8", newline="\n")
    else:
        print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
