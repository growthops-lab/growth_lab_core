export function missingCanvaScopes(granted: string | null | undefined) {
  const required = (process.env.CANVA_OAUTH_SCOPES ?? "")
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
  const grantedSet = new Set((granted ?? "").split(/\s+/).filter(Boolean));
  return required.filter((scope) => !grantedSet.has(scope));
}
