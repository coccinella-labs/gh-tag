"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const ghTag_1 = require("../src/ghTag");
(0, node_test_1.describe)("normalizeTag", () => {
    (0, node_test_1.it)("adds the v prefix when missing", () => {
        strict_1.default.equal((0, ghTag_1.normalizeTag)("1.2.3"), "v1.2.3");
    });
    (0, node_test_1.it)("keeps an existing v prefix", () => {
        strict_1.default.equal((0, ghTag_1.normalizeTag)("v1.2.3"), "v1.2.3");
    });
    (0, node_test_1.it)("keeps prerelease and build suffixes", () => {
        strict_1.default.equal((0, ghTag_1.normalizeTag)("1.2.3-rc.1+build.5"), "v1.2.3-rc.1+build.5");
    });
});
(0, node_test_1.describe)("validateTag", () => {
    (0, node_test_1.it)("accepts semantic versions", () => {
        for (const tag of ["v1.2.3", "1.2.3", "v0.1.0", "v1.2.3-rc.1", "v1.2.3+build.5"]) {
            strict_1.default.ok((0, ghTag_1.validateTag)(tag), `expected ${tag} to be valid`);
        }
    });
    (0, node_test_1.it)("rejects non-semantic tags", () => {
        for (const tag of ["v1", "1.2", "v1.2.3.4", "release", "v1.2.3 ", ""]) {
            strict_1.default.ok(!(0, ghTag_1.validateTag)(tag), `expected ${tag} to be invalid`);
        }
    });
});
