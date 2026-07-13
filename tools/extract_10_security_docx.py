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
    text = text.replace("\u2018", "'").replace("\u2019", "'")
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


def table_plain_text(table: Table) -> str:
    return "\n".join(cell.text for row in table.rows for cell in row.cells)


def source_code_block(text: str) -> str:
    text = re.sub(r"^`{3,4}\w*\s+id=\"[^\"]+\"\s*", "", text).strip()
    text = re.sub(r"\s*`{3,4}$", "", text).strip()
    if not text:
        return ""
    return f"{FENCE}text\n{text}\n{FENCE}"


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
    if style == "Source Code" or re.match(r"^`{3,4}\w*\s+id=", text):
        return source_code_block(text)
    return text


def extract_markdown(docx_path: Path) -> str:
    document = Document(str(docx_path))
    chunks: list[str] = []
    in_body = False

    for block in iter_block_items(document):
        if isinstance(block, Paragraph):
            text = normalize_text(block.text.strip())
            if not text:
                continue

            if not in_body:
                match = re.search(r"BEGIN_FINAL_" + r"MARKDOWN\s+(#\s+10\s+Security)\s*$", text)
                if match:
                    chunks.append(match.group(1))
                    in_body = True
                continue

            end_marker = "END_FINAL_" + "MARKDOWN"
            if text == end_marker or end_marker in text:
                break
            if text.startswith("12. 完了条件"):
                break

            chunks.append(paragraph_to_markdown(block))
        elif isinstance(block, Table) and in_body:
            if ("END_FINAL_" + "MARKDOWN") in normalize_text(table_plain_text(block)):
                break
            markdown_table = table_to_markdown(block)
            if markdown_table:
                chunks.append(markdown_table)

    if not chunks or chunks[0] != "# 10 Security":
        raise ValueError("10 Security final Markdown body was not found")

    markdown = "\n\n".join(chunk for chunk in chunks if chunk).strip() + "\n"
    markdown = re.sub(r"```text id=\"[^\"]*\"", "```text", markdown)
    markdown = re.sub(r"\btext id=\"[^\"]*\"\s*", "", markdown)
    return markdown


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: extract_10_security_docx.py SOURCE.docx [OUT.md]", file=sys.stderr)
        return 2
    markdown = extract_markdown(Path(sys.argv[1]))
    if len(sys.argv) == 3:
        Path(sys.argv[2]).write_text(markdown, encoding="utf-8", newline="\n")
    else:
        print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
