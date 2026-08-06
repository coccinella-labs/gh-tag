import * as core from "@actions/core"
import { context, getOctokit } from "@actions/github"
import { normalizeTag, validateTag } from "./ghTag"

type Octokit = ReturnType<typeof getOctokit>

async function tagExists(
  octokit: Octokit,
  owner: string,
  repo: string,
  tag: string,
): Promise<boolean> {
  try {
    await octokit.rest.git.getRef({ owner, repo, ref: `tags/${tag}` })
    return true
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return false
    }
    throw error
  }
}

async function run(): Promise<void> {
  const token = core.getInput("token", { required: true })
  const octokit = getOctokit(token)
  const { owner, repo } = context.repo

  const tag = normalizeTag(core.getInput("tag", { required: true }))
  if (!validateTag(tag)) {
    throw new Error(`invalid tag: ${tag}; expected a semantic version such as 1.2.3`)
  }

  const message = core.getInput("message") || tag
  const checkIfExists = core.getBooleanInput("check-if-exists")

  if (await tagExists(octokit, owner, repo, tag)) {
    core.setOutput("tag", tag)
    core.setOutput("created", "false")
    core.info(`tag ${tag} already exists; skipping`)
    if (checkIfExists) {
      throw new Error(`tag ${tag} already exists`)
    }
    return
  }

  const { data: tagObject } = await octokit.rest.git.createTag({
    owner,
    repo,
    tag,
    message,
    object: context.sha,
    type: "commit",
  })
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tag}`,
    sha: tagObject.sha,
  })

  core.setOutput("tag", tag)
  core.setOutput("created", "true")
  core.info(`created annotated tag ${tag}`)
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error))
})
