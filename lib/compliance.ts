import { checkPostLinks } from "@/lib/link-check";

function hostnameMatches(hostname: string, domain: string) {
  const normalizedHostname = hostname.toLowerCase();
  const normalizedDomain = domain.toLowerCase();
  return normalizedHostname === normalizedDomain || normalizedHostname.endsWith(`.${normalizedDomain}`);
}

const affiliateDomains = ["a8.net"];

export function validateXDestination(destinationUrl: string): string[] {
  const errors: string[] = [];

  try {
    const url = new URL(destinationUrl);
    if (affiliateDomains.some((domain) => hostnameMatches(url.hostname, domain))) {
      errors.push("A8.net広告リンクはXに直接掲載できません。WordPressメディアURLを指定してください。");
    }
  } catch {
    errors.push("有効なURLを入力してください。");
  }

  return errors;
}

export async function validateXPostCompliance(body: string, destinationUrl: string): Promise<string[]> {
  const errors = validateXDestination(destinationUrl);
  const linkCheck = await checkPostLinks({ body, destinationUrl });

  if (linkCheck.status === "BLOCKED") {
    errors.push(linkCheck.reason);
  }

  return [...new Set(errors)];
}

export function buildComplianceNotes(destinationUrl: string): string {
  const warnings = validateXDestination(destinationUrl);
  if (warnings.length > 0) return warnings.join(" ");
  return "XはWordPressメディアへの集客用。広告リンクの直接掲載なし。人間承認後のみ予約可能。";
}
