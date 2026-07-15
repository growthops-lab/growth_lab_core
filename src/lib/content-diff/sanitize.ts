const BLOCKED_ELEMENTS =
  /<\s*(script|iframe|object|embed|style|form|textarea|select)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const BLOCKED_TAGS =
  /<\s*\/?\s*(script|iframe|object|embed|style|form|input|button|textarea|select|link|meta)[^>]*>/gi;
const EVENT_ATTRIBUTES = /\s+on[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const JS_URLS = /(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi;

function testPattern(pattern: RegExp, value: string) {
  pattern.lastIndex = 0;
  return pattern.test(value);
}

export function sanitizeHtml(input: string) {
  return input
    .replace(BLOCKED_ELEMENTS, "")
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_ATTRIBUTES, "")
    .replace(JS_URLS, '$1="#"');
}

export function htmlToText(input: string) {
  return sanitizeHtml(input)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|li|ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasUnsafeHtml(input: string) {
  return (
    testPattern(BLOCKED_ELEMENTS, input) ||
    testPattern(BLOCKED_TAGS, input) ||
    testPattern(EVENT_ATTRIBUTES, input) ||
    testPattern(JS_URLS, input)
  );
}
