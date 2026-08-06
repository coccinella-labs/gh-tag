"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const ghTag_1 = require("./ghTag");
async function tagExists(octokit, owner, repo, tag) {
    try {
        await octokit.rest.git.getRef({ owner, repo, ref: `tags/${tag}` });
        return true;
    }
    catch (error) {
        if (error.status === 404) {
            return false;
        }
        throw error;
    }
}
async function run() {
    const token = core.getInput("token", { required: true });
    const octokit = (0, github_1.getOctokit)(token);
    const { owner, repo } = github_1.context.repo;
    const tag = (0, ghTag_1.normalizeTag)(core.getInput("tag", { required: true }));
    if (!(0, ghTag_1.validateTag)(tag)) {
        throw new Error(`invalid tag: ${tag}; expected a semantic version such as 1.2.3`);
    }
    const message = core.getInput("message") || tag;
    const checkIfExists = core.getBooleanInput("check-if-exists");
    if (await tagExists(octokit, owner, repo, tag)) {
        core.setOutput("tag", tag);
        core.setOutput("created", "false");
        core.info(`tag ${tag} already exists; skipping`);
        if (checkIfExists) {
            throw new Error(`tag ${tag} already exists`);
        }
        return;
    }
    const { data: tagObject } = await octokit.rest.git.createTag({
        owner,
        repo,
        tag,
        message,
        object: github_1.context.sha,
        type: "commit",
    });
    await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/tags/${tag}`,
        sha: tagObject.sha,
    });
    core.setOutput("tag", tag);
    core.setOutput("created", "true");
    core.info(`created annotated tag ${tag}`);
}
run().catch((error) => {
    core.setFailed(error instanceof Error ? error.message : String(error));
});
