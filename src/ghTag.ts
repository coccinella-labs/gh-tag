const SEMVER =
  /^v?[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/

export function normalizeTag(tag: string): string {
  return tag.startsWith("v") ? tag : `v${tag}`
}

export function validateTag(tag: string): boolean {
  return SEMVER.test(tag)
}
