const secretPatterns = [
  /access[_-]?token/gi,
  /refresh[_-]?token/gi,
  /client[_-]?secret/gi,
  /authorization/gi,
  /password/gi,
  /webhook/gi,
];
const secretKeyPattern =
  /access[_-]?token|refresh[_-]?token|client[_-]?secret|authorization|password|webhook/i;

export function sanitizeReportText(value: string) {
  return secretPatterns.reduce(
    (text, pattern) =>
      text.replace(
        new RegExp(`(${pattern.source})\\s*[:=]\\s*[^\\s,}"']+`, "gi"),
        "$1=[redacted]",
      ),
    value,
  );
}

export function sanitizeReportJson<T>(value: T): T {
  return sanitizeValue(value) as T;
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item));
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    const jsonCapable = value as { toJSON?: () => unknown };
    if (typeof jsonCapable.toJSON === "function") {
      return sanitizeValue(jsonCapable.toJSON());
    }
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => typeof child !== "function")
        .map(([key, child]) => [
          key,
          secretKeyPattern.test(key) ? "[redacted]" : sanitizeValue(child),
        ]),
    );
  }
  if (typeof value === "string") return sanitizeReportText(value);
  return value;
}
