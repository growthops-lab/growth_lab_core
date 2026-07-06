function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeHref(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "#";
    return parsed.toString();
  } catch {
    return "#";
  }
}

export function markdownToSafeHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  if (inList) html.push("</ul>");
  return html.join("\n");
}

function inlineMarkdown(value: string) {
  const escaped = escapeHtml(value);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, (_match, label: string, url: string) => {
      const safeUrl = sanitizeHref(url);
      return `<a href="${safeUrl}" rel="nofollow noopener noreferrer">${label}</a>`;
    });
}
