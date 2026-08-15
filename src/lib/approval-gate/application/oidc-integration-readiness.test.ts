import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { validateOidcIntegrationReadiness } from "./oidc-integration-readiness";

function validInput() {
  return {
    issuer: "https://issuer.example.test",
    clientId: "public-client_001.example",
    redirectUri: "https://app.example.test/auth/callback",
    requiredClaims: ["sub", "iss"],
  };
}

describe("validateOidcIntegrationReadiness", () => {
  it("accepts complete non-secret offline readiness input", () => {
    expect(validateOidcIntegrationReadiness(validInput())).toEqual({
      ok: true,
    });
  });

  it.each([
    ["missing field", { issuer: "https://issuer.example.test" }],
    [
      "insecure issuer",
      { ...validInput(), issuer: "http://issuer.example.test" },
    ],
    [
      "insecure redirect URI",
      { ...validInput(), redirectUri: "http://app.example.test/auth/callback" },
    ],
    [
      "duplicate required claim",
      { ...validInput(), requiredClaims: ["sub", "sub"] },
    ],
    [
      "malformed public client identifier",
      { ...validInput(), clientId: "public client" },
    ],
    ["unsupported key", { ...validInput(), integrationMode: "offline" }],
  ])("fails closed for %s", (_caseName, input) => {
    expect(validateOidcIntegrationReadiness(input)).toEqual({
      ok: false,
      code: "OIDC_INTEGRATION_READINESS_INVALID",
    });
  });

  it.each([
    ["top-level", { ...validInput(), clientSecret: "redacted" }],
    [
      "nested record",
      {
        ...validInput(),
        issuer: { authorization: "redacted" },
      },
    ],
  ])("rejects a secret-indicating key at %s", (_caseName, input) => {
    expect(validateOidcIntegrationReadiness(input)).toEqual({
      ok: false,
      code: "OIDC_INTEGRATION_READINESS_SECRET_KEY_REJECTED",
    });
  });

  it("rejects a secret-indicating array property before inspecting values", () => {
    const input = validInput();
    Object.defineProperty(input.requiredClaims, "token", {
      value: "redacted",
      configurable: true,
    });

    expect(validateOidcIntegrationReadiness(input)).toEqual({
      ok: false,
      code: "OIDC_INTEGRATION_READINESS_SECRET_KEY_REJECTED",
    });
  });

  it("fails closed when hostile inspection throws without reflecting input", () => {
    const input = new Proxy(
      {},
      {
        ownKeys() {
          throw new Error("private input");
        },
      },
    );

    const result = validateOidcIntegrationReadiness(input);

    expect(result).toEqual({
      ok: false,
      code: "OIDC_INTEGRATION_READINESS_INVALID",
    });
    expect(JSON.stringify(result)).not.toContain("private input");
  });

  it("contains no environment, filesystem, network, database, or OIDC runtime boundary", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("./oidc-integration-readiness.ts", import.meta.url),
      ),
      "utf8",
    );

    expect(source).not.toMatch(/process\s*\.\s*env/u);
    expect(source).not.toMatch(/node:(?:fs|http|https)|\bfetch\s*\(/u);
    expect(source).not.toMatch(/\b(?:prisma|openid-client)\b/iu);
  });
});
