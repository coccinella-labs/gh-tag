import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { normalizeTag, validateTag } from "../src/ghTag"

describe("normalizeTag", () => {
  it("adds the v prefix when missing", () => {
    assert.equal(normalizeTag("1.2.3"), "v1.2.3")
  })

  it("keeps an existing v prefix", () => {
    assert.equal(normalizeTag("v1.2.3"), "v1.2.3")
  })

  it("keeps prerelease and build suffixes", () => {
    assert.equal(normalizeTag("1.2.3-rc.1+build.5"), "v1.2.3-rc.1+build.5")
  })
})

describe("validateTag", () => {
  it("accepts semantic versions", () => {
    for (const tag of ["v1.2.3", "1.2.3", "v0.1.0", "v1.2.3-rc.1", "v1.2.3+build.5"]) {
      assert.ok(validateTag(tag), `expected ${tag} to be valid`)
    }
  })

  it("rejects non-semantic tags", () => {
    for (const tag of ["v1", "1.2", "v1.2.3.4", "release", "v1.2.3 ", ""]) {
      assert.ok(!validateTag(tag), `expected ${tag} to be invalid`)
    }
  })
})
