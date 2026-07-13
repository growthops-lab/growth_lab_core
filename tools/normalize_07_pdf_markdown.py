from __future__ import annotations

import sys
from pathlib import Path


TOP_LEVEL_HEADINGS = {
    "6. System Vision",
    "7. Overall System Architecture",
    "8. System Layers",
    "9. Responsibility Boundary",
    "10. Orchestration Boundary",
    "11. Core System Components",
    "12. User Interface Policy",
    "13. API Layer Policy",
    "14. Application Layer Policy",
    "15. Domain Module Overview",
    "16. Registry Management Policy",
    "17. Identity and Account Management",
    "18. Content and Campaign Management",
    "19. AI Output Management",
    "20. Affiliate Link Management",
    "21. Analytics and KPI Integration",
    "22. State Management",
    "23. Workflow Management",
    "24. Approval Gate Policy",
    "25. Scheduler Policy",
    "26. Automation Engine Policy",
    "27. Integration Layer Policy",
    "28. Data Access Policy",
    "29. Audit Log Policy",
    "30. Monitoring and Alert Policy",
    "31. Error Handling Policy",
    "32. Security Boundary",
    "33. Configuration and Environment Policy",
    "34. Mock Mode Policy",
    "35. Local Development Policy",
    "36. Deployment Readiness",
    "37. System Data Model Overview",
    "38. Scale Architecture",
    "39. Growth Lab Core System Scale Gate",
    "40. Cost Optimization",
    "41. Operations Policy",
    "42. Integration with Other Chapters",
    "43. Chapter Responsibility Boundary",
    "44. Architecture Constraints",
    "45. Risks",
    "46. Required Review Checklist",
    "47. Review Points",
    "48. Architecture Decision Records",
}


def normalize(markdown: str) -> str:
    lines = markdown.splitlines()
    normalized: list[str] = []
    in_principle_fence = False

    for line in lines:
        stripped = line.strip()

        if stripped == "```text":
            in_principle_fence = True
            normalized.append(line)
            continue

        if in_principle_fence and stripped == "Growth Lab Core Systemにおける優先順位は以下である。":
            normalized.append("```")
            normalized.append(line)
            in_principle_fence = False
            continue

        if stripped in TOP_LEVEL_HEADINGS:
            normalized.append(f"## {stripped}")
            continue

        normalized.append(line)

    if in_principle_fence:
        normalized.append("```")

    result = "\n".join(normalized)
    result = result.replace(
        "System Scale Gateは、Mail Scale Gate、SNS Scale Gate、WordPress Scale Gate、AI Scale Gateを置き換え\nるものではない。",
        "System Scale Gateは、Mail Scale Gate、SNS Scale Gate、WordPress Scale Gate、AI Scale Gateを置き換えるものではない。",
    )
    result = result.replace(".env.example には安全なプレースホルダーのみ記載する。", ".env.example には安全な仮値のみ記載する。")
    return result.strip() + "\n"


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: normalize_07_pdf_markdown.py INPUT.md OUTPUT.md", file=sys.stderr)
        return 2
    source = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    dest.write_text(normalize(source.read_text(encoding="utf-8")), encoding="utf-8", newline="\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
