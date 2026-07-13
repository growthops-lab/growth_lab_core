from __future__ import annotations

import re
import sys
from pathlib import Path

from docx import Document
from docx.document import Document as DocumentObject
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


FENCE = "`" * 3


def normalize_text(text: str) -> str:
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    return text


def iter_block_items(parent: DocumentObject):
    for child in parent.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def escape_table_cell(text: str) -> str:
    text = normalize_text(text).replace("\n", "<br>")
    return text.replace("|", "\\|")


def table_to_markdown(table: Table) -> str:
    rows = [[escape_table_cell(cell.text.strip()) for cell in row.cells] for row in table.rows]
    if not rows:
        return ""
    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    return "\n".join(
        [
            "| " + " | ".join(rows[0]) + " |",
            "| " + " | ".join(["---"] * width) + " |",
            *["| " + " | ".join(row) + " |" for row in rows[1:]],
        ]
    )


def paragraph_to_markdown(paragraph: Paragraph) -> str:
    text = normalize_text(paragraph.text.strip())
    style = paragraph.style.name

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
    if style == "Source Code":
        return f"{FENCE}text\n{text}\n{FENCE}"
    return text


def extract_markdown(docx_path: Path) -> str:
    document = Document(str(docx_path))
    chunks: list[str] = []
    in_body = False
    saw_marker = False

    for block in iter_block_items(document):
        if isinstance(block, Paragraph):
            text = normalize_text(block.text.strip())
            if not text:
                continue
            if text == "BEGIN_FINAL_" + "MARKDOWN":
                in_body = True
                saw_marker = True
                continue
            if text == "END_FINAL_" + "MARKDOWN":
                break
            if saw_marker and not in_body:
                continue
            chunks.append(paragraph_to_markdown(block))
        elif isinstance(block, Table):
            markdown_table = table_to_markdown(block)
            if markdown_table:
                chunks.append(markdown_table)

    markdown = "\n\n".join(chunks).strip() + "\n"
    markdown = re.sub(r"```text id=\"[^\"]*\"", "```text", markdown)
    markdown = re.sub(r"\btext id=\"[^\"]*\"\s*", "", markdown)
    return markdown


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: extract_markdown_docx_all.py SOURCE.docx [OUT.md]", file=sys.stderr)
        return 2
    markdown = extract_markdown(Path(sys.argv[1]))
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(markdown, encoding="utf-8", newline="\n")
    else:
        print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
