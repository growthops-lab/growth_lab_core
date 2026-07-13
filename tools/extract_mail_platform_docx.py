from __future__ import annotations

import re
import sys
from pathlib import Path

from docx import Document


FENCE = "`" * 3


def normalize_text(text: str) -> str:
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    return text


def paragraph_to_markdown(style: str, text: str) -> str:
    if "\n" in text or text.lstrip().startswith(("## ", "### ", "---", FENCE, "- ")):
        return text
    if style == "Heading 1":
        return f"# {text}"
    if style == "Heading 2":
        return f"## {text}"
    if style == "Heading 3":
        return f"### {text}"
    if style == "Heading 4":
        return f"#### {text}"
    if style == "Compact":
        return f"- {text}"
    return text


def extract_markdown(docx_path: Path) -> str:
    document = Document(str(docx_path))
    in_body = False
    chunks: list[str] = []

    for paragraph in document.paragraphs:
        text = normalize_text(paragraph.text.strip())
        if not text:
            continue
        if text == "BEGIN_FINAL_" + "MARKDOWN":
            in_body = True
            continue
        if text == "END_FINAL_" + "MARKDOWN":
            break
        if not in_body:
            continue
        chunks.append(paragraph_to_markdown(paragraph.style.name, text))

    markdown = "\n\n".join(chunks).strip() + "\n"
    markdown = re.sub(r"```text id=\"[^\"]*\"", "```text", markdown)
    markdown = re.sub(r"\btext id=\"[^\"]*\"\s*", "", markdown)
    return markdown


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: extract_mail_platform_docx.py SOURCE.docx [OUT.md]", file=sys.stderr)
        return 2

    source = Path(sys.argv[1])
    markdown = extract_markdown(source)

    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(markdown, encoding="utf-8", newline="\n")
    else:
        print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
