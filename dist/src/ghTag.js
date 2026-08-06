"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTag = normalizeTag;
exports.validateTag = validateTag;
const SEMVER = /^v?[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
function normalizeTag(tag) {
    return tag.startsWith("v") ? tag : `v${tag}`;
}
function validateTag(tag) {
    return SEMVER.test(tag);
}
